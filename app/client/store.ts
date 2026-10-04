/**
 * Browser-local learning state. Storage is an enhancement, never a requirement: every read falls
 * back to an in-memory map so the site stays fully usable with storage disabled or full.
 */
const KEY = 'physics2.learning.v1';

export interface LearningState {
  completedConcepts: string[];
  completedParts: string[];
  bookmarks: string[];
  recent: { id: string; at: number }[];
  quiz: Record<string, { total: number; correct: number; at: number }>;
  quizByConcept: Record<string, { correct: number; total: number }>;
  streak: { days: number; last: string };
}

const emptyState = (): LearningState => ({
  completedConcepts: [],
  completedParts: [],
  bookmarks: [],
  recent: [],
  quiz: {},
  quizByConcept: {},
  streak: { days: 0, last: '' },
});

let memory: LearningState = emptyState();
let storageWorks = true;

function read(): LearningState {
  if (!storageWorks) return memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw) as Partial<LearningState>;
    return { ...emptyState(), ...parsed };
  } catch {
    storageWorks = false;
    return memory;
  }
}

function write(state: LearningState): void {
  memory = state;
  if (!storageWorks) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageWorks = false;
  }
}

export function storageAvailable(): boolean {
  return storageWorks;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const store = {
  storageAvailable(): boolean {
    return storageWorks;
  },

  get(): LearningState {
    return read();
  },

  completeConcept(id: string): boolean {
    const state = read();
    if (state.completedConcepts.includes(id)) return false;
    state.completedConcepts.push(id);
    store.touchStreak(state);
    write(state);
    return true;
  },

  completePart(id: string): void {
    const state = read();
    if (!state.completedParts.includes(id)) {
      state.completedParts.push(id);
      store.touchStreak(state);
    }
    write(state);
  },

  toggleBookmark(id: string): boolean {
    const state = read();
    const index = state.bookmarks.indexOf(id);
    if (index >= 0) state.bookmarks.splice(index, 1);
    else state.bookmarks.push(id);
    write(state);
    return index < 0;
  },

  isBookmarked(id: string): boolean {
    return read().bookmarks.includes(id);
  },

  markRecent(id: string): void {
    const state = read();
    state.recent = [{ id, at: Date.now() }, ...state.recent.filter((item) => item.id !== id)].slice(0, 12);
    write(state);
  },

  saveQuiz(key: string, correct: number, total: number, conceptId?: string): void {
    const state = read();
    state.quiz[key] = { correct, total, at: Date.now() };
    if (conceptId) {
      const previous = state.quizByConcept[conceptId] ?? { correct: 0, total: 0 };
      state.quizByConcept[conceptId] = {
        correct: previous.correct + correct,
        total: previous.total + total,
      };
    }
    store.touchStreak(state);
    write(state);
  },

  quizStats(key: string): { correct: number; total: number } | undefined {
    return read().quiz[key];
  },

  weakConcepts(): string[] {
    const state = read();
    return Object.entries(state.quizByConcept)
      .filter(([, value]) => value.total > 0 && value.correct / value.total < 0.7)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .map(([id]) => id);
  },

  clearHistory(): void {
    const state = read();
    state.quiz = {};
    state.quizByConcept = {};
    write(state);
  },

  touchStreak(state: LearningState): void {
    const todayISO = today();
    if (state.streak.last === todayISO) return;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    state.streak.days = state.streak.last === yesterday ? state.streak.days + 1 : 1;
    state.streak.last = todayISO;
  },

  export(): LearningState {
    return read();
  },
};