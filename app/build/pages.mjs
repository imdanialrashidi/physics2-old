import { renderInlineProse, renderLatex, renderProse } from './math.mjs';
import {
  SITE,
  badgePart,
  callout,
  conceptCard,
  difficultyDots,
  escapeAttribute,
  escapeHtml,
  formulaCard,
  glyph,
  layout,
  misconceptionsBlock,
  originBadge,
  partMeta,
  quizBlock,
  rescueBlock,
  simBlock,
  stepsBlock,
  toPersian,
  tocBlock,
} from './render.mjs';

/* ------------------------------------------------------------------- home */

export function homePage(ctx) {
  const { registry, prefix, assets } = ctx;
  const firstConcept = registry.concepts[0];
  const totalMinutes = registry.concepts.reduce((sum, concept) => sum + concept.effort, 0);
  const body = `
<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy">
      <p class="hero-kicker">${glyph('bolt', 16)} یک کتاب تعاملی فارسی برای فیزیک ۲</p>
      <h1>فیزیک را <span class="hero-highlight">فهمیدنی</span> کن، نه حفظ کردنی</h1>
      <p class="hero-lede">هر مفهوم از شهود شروع می‌شود، با یک تصویر یا شبیه‌سازی روشن می‌شود، بعد ریاضی‌اش را می‌آموزی، یک مثال را با هم حل می‌کنی و آخرش خودت امتحان می‌دهی. اگر جایی گیر کردی، دکمه‌ی نجات همیشه هست.</p>
      <div class="hero-actions">
        <a class="primary-button" href="${prefix}lessons/part-1/">شروع از پارت اول</a>
        <a class="secondary-button" href="${prefix}concepts/">نمایه‌ی مفاهیم</a>
        <a class="secondary-button" href="${prefix}practice/">تمرین سریع</a>
      </div>
      <dl class="hero-stats">
        <div><dt>مفهوم آموزشی</dt><dd data-stat="concepts">${toPersian(registry.concepts.length)}</dd></div>
        <div><dt>فرمول با توضیح</dt><dd data-stat="formulas">${toPersian(registry.formulas.length)}</dd></div>
        <div><dt>پرسش تمرینی</dt><dd data-stat="questions">${toPersian(registry.questions.length)}</dd></div>
        <div><dt>زمان تخمینی کل</dt><dd>${toPersian(Math.round(totalMinutes / 60))} ساعت</dd></div>
      </dl>
    </div>
    <div class="hero-visual">
      <canvas class="hero-canvas" data-hero-canvas width="520" height="420" aria-hidden="true"></canvas>
      <p class="hero-caption">میدان الکتریکی دو بار: پیکان‌های میدان در اطراف هر بار پخش می‌شوند. همین تصویر، پایه‌ی بخش‌های بعدی است.</p>
      <noscript><p class="hero-noscript">میدان یک بار مثبت در اطرافش به بیرون و میدان یک بار منفی به سمت خودش است.</p></noscript>
    </div>
  </div>
</section>

<section class="map-strip" aria-labelledby="map-title">
  <div class="section-head">
    <h2 id="map-title">نقشه‌ی درس: از کجا شروع کنم؟</h2>
    <p>هر پارت یک پله است. روی هر پله کلیک کن تا درس‌هایش را ببینی.</p>
  </div>
  <ol class="ladder">
    ${registry.parts
      .map((part, index) => {
        const meta = partMeta(part.id);
        const partConcepts = registry.concepts.filter((concept) => concept.part === part.id);
        const minutes = partConcepts.reduce((sum, concept) => sum + concept.effort, 0);
        return `<li class="ladder-step" style="--part-hue:${meta.hue};--part-ink:${meta.ink};--part-tint:${meta.tint}">
      <a href="${prefix}lessons/${part.id}/">
        <span class="ladder-index">${toPersian(index + 1)}</span>
        <span class="ladder-glyph">${glyph(meta.glyph, 26)}</span>
        <span class="ladder-body">
          <strong>${escapeHtml(part.title)}</strong>
          <span class="ladder-en">${escapeHtml(part.en)}</span>
          <span class="ladder-meta">${toPersian(partConcepts.length)} مفهوم · حدود ${toPersian(Math.round(minutes / 60 * 10) / 10)} ساعت</span>
        </span>
      </a>
    </li>`;
      })
      .join('')}
  </ol>
</section>

<section class="section" aria-labelledby="start-title">
  <div class="section-head">
    <h2 id="start-title">همین الان از کجا شروع کنم؟</h2>
    <p>پیشنهاد ما بر اساس پیشرفت تو در همین مرورگر است؛ اگر تازه شروع کرده‌ای، از پایه‌ای‌ترین مفهوم شروع کن.</p>
  </div>
  <div class="start-grid">
    ${conceptCard(firstConcept, prefix)}
    <article class="start-card start-card-next" data-next-concept hidden></article>
    <div data-recent-list class="start-grid-item"></div>
    <article class="start-card start-card-weak">
      <h3>${glyph('bolt', 18)} نقطه‌ی ضعف من</h3>
      <p>ببین کدام مفهوم‌ها را کمتر بلدی و فقط همان‌ها را تمرین کن.</p>
      <a class="inline-link" href="${prefix}practice/">رفتن به تمرین‌ها ←</a>
    </article>
  </div>
</section>

<section class="section" aria-labelledby="entry-title">
  <div class="section-head">
    <h2 id="entry-title">دسترسی سریع</h2>
  </div>
  <div class="entry-grid">
    <a class="entry-tile" href="${prefix}formulas/"><span class="entry-icon">${glyph('bolt', 22)}</span><strong>دفترچه‌ی فرمول‌ها</strong><span>هر فرمول با واحد، تفسیر، کِی استفاده کنم و کِی نکنم.</span></a>
    <a class="entry-tile" href="${prefix}map/"><span class="entry-icon">${glyph('ladder', 22)}</span><strong>نقشه‌ی پیش‌نیازها</strong><span>ببین برای هر مفهوم چه چیزی را باید اول بلد باشی.</span></a>
    <a class="entry-tile" href="${prefix}concepts/"><span class="entry-icon">${glyph('sphere', 22)}</span><strong>نمایه‌ی مفاهیم</strong><span>جست‌وجو و فیلتر میان ${toPersian(registry.concepts.length)} مفهوم درس.</span></a>
    <a class="entry-tile" href="${prefix}glossary/"><span class="entry-icon">${glyph('book', 22)}</span><strong>واژه‌نامه</strong><span>معنی اصطلاح‌های فارسی و انگلیسی در یک نگاه.</span></a>
  </div>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="section-head">
    <h2 id="why-title">این سایت چه فرقی با خواندن جزوه دارد؟</h2>
  </div>
  <div class="why-grid">
    <div class="why-item"><h3>هر مفهوم پنج لایه دارد</h3><p>شهود، تصویر، ریاضی، مثال حل‌شده و تمرین. اگر لایه‌ای را نفهمیدی، همان لایه را نگه می‌داری و بقیه لازم نیست.</p></div>
    <div class="why-item"><h3>شبیه‌سازی واقعی، نه انیمیشن نمایشی</h3><p>هر کنترل، همان محاسبه‌ی فیزیک را عوض می‌کند: بار را کم و زیاد کن، میدان و نیرو و نمودار با هم به‌روز می‌شوند.</p></div>
    <div class="why-item"><h3>جایی که گیر می‌کنی، راه نجات دارد</h3><p>دکمه‌ی «این قسمت رو نمی‌فهمم» تو را به پیش‌نیاز، توضیح ساده‌تر، تصویر و یک مثال کوچک می‌برد.</p></div>
    <div class="why-item"><h3>پیشرفت و تمرین، روی همین دستگاه</h3><p>مفهوم‌های تمام‌شده، نشان‌کردن‌ها و نتیجه‌ی تمرین‌ها در مرورگر خودت ذخیره می‌شود؛ بدون حساب کاربری.</p></div>
  </div>
</section>`;

  return layout({
    title: `${SITE.title}`,
    description: SITE.tagline,
    route: { kind: 'home', id: 'home' },
    prefix,
    assets,
    activeNav: 'home',
    bodyClass: 'page-home',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'home', nextConceptId: registry.concepts[1]?.id ?? null, stats: registry.concepts.length }),
  });
}

/* ------------------------------------------------------------- part pages */

export function partPage(ctx, part) {
  const { registry, prefix, assets } = ctx;
  const meta = partMeta(part.id);
  const concepts = registry.concepts.filter((concept) => concept.part === part.id);
  const minutes = concepts.reduce((sum, concept) => sum + concept.effort, 0);
  const partIndex = registry.parts.findIndex((item) => item.id === part.id);
  const nextPart = registry.parts[partIndex + 1];
  const toc = concepts.map((concept, index) => ({
    id: `c${index + 1}`,
    label: `${toPersian(index + 1)}. ${concept.title}`,
  }));
  const body = `
<div class="lesson" style="--part-hue:${meta.hue};--part-ink:${meta.ink};--part-tint:${meta.tint}">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: `پارت ${toPersian(part.number)}` }])}
  <header class="lesson-head">
    <div class="lesson-head-main">
      <p class="lesson-kicker">${badgePart(part)} ${originBadge(concepts.some((c) => c.origin !== 'course') ? 'mixed' : 'course')}</p>
      <h1>${escapeHtml(part.title)}</h1>
      <p class="lesson-en">${escapeHtml(part.en)}</p>
      <p class="lesson-tagline">${escapeHtml(part.tagline)}</p>
      <dl class="lesson-stats">
        <div><dt>مفهوم</dt><dd>${toPersian(concepts.length)}</dd></div>
        <div><dt>زمان تخمینی</dt><dd>${toPersian(Math.round(minutes / 5) * 5)} دقیقه</dd></div>
        <div><dt>تمرین</dt><dd>${toPersian(concepts.reduce((sum, concept) => sum + concept.practice.length, 0))} پرسش</dd></div>
      </dl>
      <div class="lesson-actions">
        <button class="primary-button" type="button" data-complete-part="${part.id}">این پارت را تمام کردم</button>
        <a class="secondary-button" href="${prefix}practice/${part.id}/">تمرین این پارت</a>
      </div>
      <p class="lesson-progress" data-part-progress aria-live="polite"></p>
    </div>
    <div class="lesson-head-visual">
      <div class="part-emblem" aria-hidden="true">${glyph(meta.glyph, 72)}</div>
    </div>
  </header>

  ${tocBlock(toc)}

  <section class="part-overview">
    <h2>این پارت چه چیزی را یاد می‌گیری؟</h2>
    <p>${renderProse(partIntro(part.id))}</p>
    ${callout('source', 'از کجا آمده؟', `<p>این پارت از فایل <code>${escapeHtml(part.note)}</code> در جزوه‌ی درسی ساخته شده است. هر بخش، بخش متناظر جزوه را پوشش می‌دهد و افزوده‌های آموزشی با برچسب «تکمیلی» جدا شده‌اند.</p>`)}
  </section>

  <ol class="concept-stack">
    ${concepts
      .map(
        (concept, index) => `<li class="concept-row" id="c${index + 1}">
      <div class="concept-row-index">${toPersian(index + 1)}</div>
      <div class="concept-row-body">
        <h3><a href="${prefix}concept/${concept.id}/">${escapeHtml(concept.title)}</a></h3>
        <p class="concept-en">${escapeHtml(concept.en)}</p>
        <p>${renderInlineProse(concept.intuition.split('\n\n')[0])}</p>
        <div class="concept-row-meta">
          ${difficultyDots(concept.difficulty)}${originBadge(concept.origin)}
          <span class="meta-item">${glyph('clock', 14)}${toPersian(concept.effort)} دقیقه</span>
          <span class="meta-item">${glyph('bolt', 14)}${toPersian(concept.formulas.length)} فرمول</span>
          <a class="inline-link" href="${prefix}concept/${concept.id}/">رفتن به درس ←</a>
        </div>
      </div>
    </li>`,
      )
      .join('')}
  </ol>

  <nav class="lesson-pager" aria-label="پارت‌های دیگر">
    ${partIndex > 0 ? `<a class="pager-prev" href="${prefix}lessons/${registry.parts[partIndex - 1].id}/"><span>پارت قبل</span><strong>${escapeHtml(registry.parts[partIndex - 1].title)}</strong></a>` : '<span></span>'}
    ${nextPart ? `<a class="pager-next" href="${prefix}lessons/${nextPart.id}/"><span>پارت بعد</span><strong>${escapeHtml(nextPart.title)}</strong></a>` : '<span></span>'}
  </nav>
</div>`;

  return layout({
    title: `${part.title} — ${SITE.title}`,
    description: `${part.tagline}. ${concepts.length} مفهوم با مثال و تمرین.`,
    route: { kind: 'part', id: part.id },
    prefix,
    assets,
    activeNav: 'lessons',
    bodyClass: 'page-part',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({
      page: 'part',
      partId: part.id,
      conceptIds: concepts.map((concept) => concept.id),
      questionIds: concepts.flatMap((concept) => concept.practice),
    }),
  });
}

function partIntro(partId) {
  const intros = {
    'part-1': String.raw`از این پارت با یک پرسش ساده شروع می‌کنیم: «بار» یعنی چه و چرا دو جسم باردار همدیگر را هل می‌دهند؟ بعد یاد می‌گیریم شدت این هل کردن چقدر است (قانون کولن)، چند جسم را با هم چطور حساب کنیم، و در پایان یک روش کاملاً حرفه‌ای: **میدان الکتریکی** — یعنی به‌جای نیرو، خودِ فضا را توصیف می‌کنیم. اگر این پارت را خوب بفهمی، بقیه‌ی درس روی همین پایه سوار است.`,
    'part-2': String.raw`اینجا یک ابزار قدرتمند یاد می‌گیری: **قانون گاوس**. ایده‌ی اصلی ساده است — یک سطح فرضی می‌کشیم و می‌پرسیم «چقدر میدان از این سطح عبور می‌کند؟» پاسخ فقط به بار داخل سطح بستگی دارد. اگر آرایش متقارن باشد، این تکنیک به جای انتگرال‌گیری سخت، یک خط فرمول ساده به تو می‌دهد.`,
    'part-3': String.raw`میدان به تو **نیرو** می‌گوید؛ پتانسیل به تو **انرژی**. این پارت نشان می‌دهد چرا پتانسیل خیلی راحت‌تر با هم جمع می‌شود، چطور انرژی یک بار در میدان را حساب کنی، و چگونه خازن‌ها انرژی را ذخیره می‌کنند.`,
    'part-4': String.raw`از میدان به **حرکت بار** می‌رسیم: جریان چیست، الکترون‌ها چقدر کند راه می‌روند (خیلی کندتر از فکر می‌کنی)، مقاومت از کجا می‌آید، توان یعنی چه، و در پایان مدار RC که پایه‌ی همه‌ی مدارهای زمان‌دار است.`,
    'part-5': String.raw`آخرین پارت، دنیای مغناطیس است: نیرویی که روی بار متحرک و سیم باردار اثر می‌کند، حرکت مارپیچی، موتورهای الکتریکی، و دو قانون مهم — بیو-ساوار و آمپر — که میدان مغناطیسی جریان‌ها را می‌سازند.`,
  };
  return intros[partId] ?? '';
}

/* ---------------------------------------------------------- concept pages */

export function conceptPage(ctx, concept) {
  const { registry, prefix, assets } = ctx;
  const meta = partMeta(concept.part);
  const part = registry.parts.find((item) => item.id === concept.part);
  const siblings = registry.concepts.filter((item) => item.part === concept.part);
  const index = siblings.findIndex((item) => item.id === concept.id);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  const prereqConcept = registry.conceptById.get(concept.prereqs[0]);
  const questions = concept.practice.map((id) => registry.questionById.get(id)).filter(Boolean);
  const rescue = {
    ...concept.rescue,
    prereq: concept.prereqs[0],
    prereqTitle: prereqConcept?.title,
  };
  const toc = [
    { id: 'intuition', label: 'اول با شهود بفهمیم' },
    ...(concept.visual?.sim ? [{ id: 'visual', label: 'یک تصویر / شبیه‌سازی' }] : []),
    { id: 'math', label: 'حالا ریاضی' },
    { id: 'example', label: 'مثال حل‌شده' },
    { id: 'mistakes', label: 'اشتباهات رایج' },
    { id: 'practice', label: 'تمرین' },
    { id: 'related', label: 'ارتباط با مباحث دیگر' },
  ];

  const body = `
<div class="concept-page" style="--part-hue:${meta.hue};--part-ink:${meta.ink};--part-tint:${meta.tint}">
  ${breadcrumbFor(prefix, [
    { label: 'خانه', href: 'index.html' },
    { label: `پارت ${toPersian(part.number)}`, href: `lessons/${part.id}/` },
    { label: concept.title },
  ])}
  <div class="concept-layout">
    <article class="concept-main">
      <header class="concept-head">
        <p class="concept-kicker">${badgePart(part)} ${originBadge(concept.origin)} ${difficultyDots(concept.difficulty)}</p>
        <h1>${escapeHtml(concept.title)}</h1>
        <p class="concept-en">${escapeHtml(concept.en)}</p>
        <div class="concept-tools">
          <button class="tool-button" type="button" data-bookmark="${concept.id}" aria-pressed="false">${glyph('spark', 15)} نشان کن</button>
          <button class="tool-button tool-button-alert" type="button" data-lost-open>این قسمت رو نمی‌فهمم</button>
          <span class="concept-effort">${glyph('clock', 14)} حدود ${toPersian(concept.effort)} دقیقه مطالعه</span>
        </div>
        <p class="concept-source">${escapeHtml(sourceLine(concept))}</p>
      </header>

      <section class="layer layer-intuition" id="intuition">
        <h2><span class="layer-tag">لایه‌ی ۱</span> اول با شهود بفهمیم</h2>
        ${renderProse(concept.intuition)}
      </section>

      ${
        concept.visual
          ? `<section class="layer layer-visual" id="visual">
        <h2><span class="layer-tag">لایه‌ی ۲</span> یک تصویر / شبیه‌سازی</h2>
        <figure class="sim-figure">
          ${simBlock(concept.visual, concept.id)}
          <figcaption>${escapeHtml(concept.visual.caption)}</figcaption>
        </figure>
      </section>`
          : ''
      }

      <section class="layer layer-math" id="math">
        <h2><span class="layer-tag">لایه‌ی ۳</span> حالا ریاضی</h2>
        ${concept.mathNote ? callout('tip', 'قبل از فرمول', `<p>${renderProse(concept.mathNote)}</p>`) : ''}
        ${concept.formulas.map((formula) => formulaCard(formula)).join('')}
      </section>

      <section class="layer layer-example" id="example">
        <h2><span class="layer-tag">لایه‌ی ۴</span> مثال حل‌شده</h2>
        ${concept.examples.map((example) => stepsBlock(example)).join('')}
      </section>

      <section class="layer layer-mistakes" id="mistakes">
        <h2><span class="layer-tag">بازبینی</span> اشتباهات رایج</h2>
        ${misconceptionsBlock(concept.misconceptions)}
      </section>

      <section class="layer layer-practice" id="practice">
        <h2><span class="layer-tag">لایه‌ی ۵</span> تمرین</h2>
        ${quizBlock(questions, { title: 'بیا امتحان کنیم', partId: concept.part })}
      </section>

      ${
        concept.supplements?.length
          ? `<section class="layer layer-supplement" id="supplement">
        <h2><span class="layer-tag layer-tag-supp">افزوده</span> تکمیلی</h2>
        ${concept.supplements.map((item) => callout('supplement', item.title, `<p>${renderProse(item.body)}</p>`)).join('')}
      </section>`
          : ''
      }

      <section class="layer layer-related" id="related">
        <h2>ارتباط با مباحث دیگر</h2>
        ${concept.related
          .map((relation) => {
            const target = registry.conceptById.get(relation.id);
            if (!target) return '';
            return `<a class="related-card" href="${prefix}concept/${target.id}/"><strong>${escapeHtml(target.title)}</strong><span>${escapeHtml(relation.why)}</span></a>`;
          })
          .join('')}
        ${concept.examTips?.length ? callout('tip', 'نکته‌های امتحانی', `<ul class="exam-tips">${concept.examTips.map((tip) => `<li>${renderProse(tip)}</li>`).join('')}</ul>`) : ''}
      </section>

      ${rescueBlock(rescue, concept, prefix)}

      <nav class="lesson-pager" aria-label="مفهوم‌های دیگر">
        ${prev ? `<a class="pager-prev" href="${prefix}concept/${prev.id}/"><span>مفهوم قبل</span><strong>${escapeHtml(prev.title)}</strong></a>` : '<span></span>'}
        ${next ? `<a class="pager-next" href="${prefix}concept/${next.id}/"><span>مفهوم بعد</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span></span>'}
      </nav>
      <div class="concept-complete">
        <button class="primary-button" type="button" data-complete-concept="${concept.id}">فهمیدم، این مفهوم تمام شد</button>
        <p data-concept-status role="status"></p>
      </div>
    </article>
    <aside class="concept-side">
      ${tocBlock(toc)}
      <div class="side-card">
        <h3>${glyph('ladder', 16)} قبل از این، این را بلد باش</h3>
        ${
          concept.prereqs.length
            ? `<ul>${concept.prereqs
                .map((id) => {
                  const target = registry.conceptById.get(id);
                  return target ? `<li><a href="${prefix}concept/${target.id}/">${escapeHtml(target.title)}</a></li>` : '';
                })
                .join('')}</ul>`
            : '<p>این مفهوم، نقطه‌ی شروع است و پیش‌نیازی ندارد.</p>'
        }
      </div>
      <div class="side-card">
        <h3>${glyph('bolt', 16)} فرمول‌های این مفهوم</h3>
        <ul class="formula-index">${concept.formulas.map((formula) => `<li><a href="#math">${escapeHtml(formula.name)}</a></li>`).join('') || '<li>مفهوم تعریفی است و فرمول ندارد.</li>'}</ul>
      </div>
    </aside>
  </div>
</div>`;

  return layout({
    title: `${concept.title} — ${part.title} | فیزیک ۲`,
    description: `${concept.title} (${concept.en}): شهود، شبیه‌سازی، فرمول، مثال حل‌شده و تمرین.`,
    route: { kind: 'concept', id: concept.id },
    prefix,
    assets,
    activeNav: 'concepts',
    bodyClass: 'page-concept',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({
      page: 'concept',
      conceptId: concept.id,
      partId: concept.part,
      questionIds: concept.practice,
      sim: concept.visual?.sim ?? null,
    }),
  });
}

function sourceLine(concept) {
  const refs = concept.sourceRefs.map((ref) => ref.replace('part-', 'پارت '));
  return `منبع این صفحه: ${refs.join('، ')}`;
}

function breadcrumbFor(prefix, items) {
  const parts = items
    .map((item) => (item.href ? `<a href="${prefix}${item.href}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`))
    .join('<span class="crumb-sep" aria-hidden="true">‹</span>');
  return `<nav class="breadcrumbs" aria-label="مسیر صفحه"><ol>${parts}</ol></nav>`;
}

/* -------------------------------------------------------------- formulas */

export function formulasPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const groups = registry.parts.map((part) => ({
    part,
    formulas: registry.formulas.filter((formula) => formula.part === part.id),
  }));
  const body = `
<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'دفترچه‌ی فرمول‌ها' }])}
  <header class="hub-head">
    <h1>دفترچه‌ی فرمول‌ها</h1>
    <p>هر فرمول با نمادها، واحدها، تفسیر فیزیکی، «کِی استفاده کنم» و «کِی استفاده نکنم» و بازنویسی‌های مفید. برای پیدا کردن یک فرمول، جست‌وجو یا فیلتر پارت را استفاده کن.</p>
    <div class="filter-bar" role="group" aria-label="فیلتر بر اساس پارت">
      <button class="chip is-active" type="button" data-formula-filter="all">همه</button>
      ${registry.parts.map((part) => `<button class="chip" type="button" data-formula-filter="${part.id}">پارت ${toPersian(part.number)}</button>`).join('')}
      <input class="filter-input" type="search" data-formula-search placeholder="جست‌وجو در نام فرمول یا نماد…" aria-label="جست‌وجو در فرمول‌ها">
    </div>
    <p class="filter-status" data-formula-status role="status"></p>
  </header>
  ${groups
    .map(
      ({ part, formulas }) => `<section class="formula-group" data-part-section="${part.id}" style="--part-hue:${partMeta(part.id).hue};--part-ink:${partMeta(part.id).ink};--part-tint:${partMeta(part.id).tint}">
    <h2>${badgePart(part)} ${escapeHtml(part.title)}</h2>
    ${formulas.map((formula) => formulaCard(formula)).join('')}
  </section>`,
    )
    .join('')}
  <p class="empty-state" data-formulas-empty hidden>فرمولی با این عبارت پیدا نشد. عبارت دیگری امتحان کن یا همه‌ی پارت‌ها را ببین.</p>
</div>`;
  return layout({
    title: `دفترچه‌ی فرمول‌ها — ${SITE.title}`,
    description: 'همه‌ی فرمول‌های فیزیک ۲ با واحد، تفسیر و شرایط استفاده.',
    route: { kind: 'formulas', id: 'formulas' },
    prefix,
    assets,
    activeNav: 'formulas',
    bodyClass: 'page-formulas',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'formulas' }),
  });
}

/* -------------------------------------------------------------- concepts */

export function conceptsPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const body = `
<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'نمایه‌ی مفاهیم' }])}
  <header class="hub-head">
    <h1>نمایه‌ی مفاهیم</h1>
    <p>همه‌ی مفاهیم درس با فیلتر پارت، سطح و جست‌وجوی زنده. هر کارت به صفحه‌ی آموزشی همان مفهوم می‌رود.</p>
    <div class="filter-bar">
      <input class="filter-input" type="search" data-concepts-search placeholder="جست‌وجو در مفاهیم…" aria-label="جست‌وجو در مفاهیم">
      <div class="chip-row" role="group" aria-label="فیلتر پارت">
        <button class="chip is-active" type="button" data-concept-filter="all">همه</button>
        ${registry.parts.map((part) => `<button class="chip" type="button" data-concept-filter="${part.id}">پارت ${toPersian(part.number)}</button>`).join('')}
      </div>
      <div class="chip-row" role="group" aria-label="فیلتر سطح">
        <button class="chip is-active" type="button" data-level-filter="all">هر سطح</button>
        <button class="chip" type="button" data-level-filter="1">مقدماتی</button>
        <button class="chip" type="button" data-level-filter="2">متوسط</button>
        <button class="chip" type="button" data-level-filter="3">چالش‌برانگیز</button>
      </div>
    </div>
    <p class="filter-status" data-concepts-status role="status"></p>
  </header>
  <div class="concept-grid" data-concepts-grid>
    ${registry.concepts.map((concept) => conceptCard(concept, prefix)).join('')}
  </div>
  <p class="empty-state" data-concepts-empty hidden>مفهومی با این عبارت پیدا نشد. شاید بخشی از عنوان یا کلیدواژه را امتحان کن.</p>
</div>`;
  return layout({
    title: `نمایه‌ی مفاهیم — ${SITE.title}`,
    description: 'فهرست مفاهیم فیزیک ۲ با جست‌وجو و فیلتر.',
    route: { kind: 'concepts', id: 'concepts' },
    prefix,
    assets,
    activeNav: 'concepts',
    bodyClass: 'page-concepts',
    body,
    pageData: JSON.stringify({
      page: 'concepts',
      concepts: registry.concepts.map((concept) => ({
        id: concept.id,
        title: concept.title,
        en: concept.en,
        part: concept.part,
        difficulty: concept.difficulty,
        keywords: concept.keywords,
      })),
    }),
  });
}

/* -------------------------------------------------------------- practice */

export function practiceHubPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const body = `
<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'تمرین' }])}
  <header class="hub-head">
    <h1>تمرین</h1>
    <p>سه حالت داری: یک آزمون کوتاه ترکیبی، تمرین یک پارت مشخص، یا مرور فقط مفاهیمی که ضعیف‌تر هستی. هر پاسخ، توضیح دارد؛ پاسخ اشتباه هم توضیح دارد.</p>
  </header>
  <div class="entry-grid">
    <a class="entry-tile entry-tile-strong" href="${prefix}practice/mixed/"><span class="entry-icon">${glyph('bolt', 22)}</span><strong>آزمون ترکیبی</strong><span>${toPersian(registry.questions.length)} پرسش از همه‌ی پارت‌ها، به ترتیب تصادفی.</span></a>
    ${registry.parts
      .map((part) => {
        const count = registry.concepts.filter((concept) => concept.part === part.id).reduce((sum, concept) => sum + concept.practice.length, 0);
        return `<a class="entry-tile" href="${prefix}practice/${part.id}/" style="--part-hue:${partMeta(part.id).hue};--part-ink:${partMeta(part.id).ink};--part-tint:${partMeta(part.id).tint}"><span class="entry-icon">${glyph(partMeta(part.id).glyph, 22)}</span><strong>پارت ${toPersian(part.number)}</strong><span>${escapeHtml(part.title)} — ${toPersian(count)} پرسش</span></a>`;
      })
      .join('')}
  </div>
  <section class="practice-history" data-practice-history hidden>
    <h2>سابقه‌ی تمرین‌های تو</h2>
    <ul data-history-list></ul>
    <button class="ghost-button" type="button" data-clear-history>پاک کردن سابقه</button>
  </section>
</div>`;
  return layout({
    title: `تمرین — ${SITE.title}`,
    description: 'تمرین مفهومی و عددی فیزیک ۲ با توضیح پاسخ.',
    route: { kind: 'practice', id: 'practice' },
    prefix,
    assets,
    activeNav: 'practice',
    bodyClass: 'page-practice',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'practice' }),
  });
}

export function practiceTopicPage(ctx, topicId) {
  const { registry, prefix, assets } = ctx;
  const isMixed = topicId === 'mixed';
  const part = registry.parts.find((item) => item.id === topicId);
  if (!isMixed && !part) return null;
  const concepts = registry.concepts.filter((concept) => (isMixed ? true : concept.part === topicId));
  const questions = isMixed
    ? [...registry.questions].sort(() => Math.random() - 0.5).slice(0, 12)
    : concepts.flatMap((concept) => concept.practice.map((id) => registry.questionById.get(id))).filter(Boolean);
  const partId = isMixed ? 'part-1' : topicId;
  const title = isMixed ? 'آزمون ترکیبی' : `تمرین پارت ${toPersian(part.number)}`;
  const body = `
<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'تمرین', href: 'practice/' }, { label: title }])}
  <header class="hub-head">
    <h1>${escapeHtml(title)}</h1>
    <p>${toPersian(questions.length)} پرسش. اول خودت جواب بده، بعد توضیح را باز کن. نتیجه در همین مرورگر ذخیره می‌شود.</p>
  </header>
  ${quizBlock(questions, { title: 'پرسش‌ها', partId })}
  <section class="practice-weak" data-weak-list hidden>
    <h2>مفاهیمی که در این تمرین کمتر بلدی</h2>
    <ul></ul>
  </section>
</div>`;
  return layout({
    title: `${title} — ${SITE.title}`,
    description: `${title} در فیزیک ۲ با توضیح پاسخ.`,
    route: { kind: 'practice-topic', id: topicId },
    prefix,
    assets,
    activeNav: 'practice',
    bodyClass: 'page-practice',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({
      page: 'practice-topic',
      topicId,
      questionIds: questions.map((question) => question.id),
      conceptIds: concepts.map((concept) => concept.id),
    }),
  });
}

/* -------------------------------------------------------------------- map */

export function mapPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const rows = registry.parts.map((part) => {
    const meta = partMeta(part.id);
    const concepts = registry.concepts.filter((concept) => concept.part === part.id);
    return `<section class="map-part" style="--part-hue:${meta.hue};--part-ink:${meta.ink};--part-tint:${meta.tint}">
    <header><span class="map-part-glyph">${glyph(meta.glyph, 30)}</span><div><h2>${escapeHtml(part.title)}</h2><p>${escapeHtml(part.tagline)}</p></div><a class="inline-link" href="${prefix}lessons/${part.id}/">درس پارت ${toPersian(part.number)}</a></header>
    <ol class="map-chain">
      ${concepts
        .map((concept) => {
          const prereqs = concept.prereqs
            .map((id) => registry.conceptById.get(id))
            .filter(Boolean)
            .map((item) => `<a class="chain-prereq" href="${prefix}concept/${item.id}/">${escapeHtml(item.title)}</a>`)
            .join('<span class="chain-arrow" aria-hidden="true">→</span>');
          return `<li class="map-node" data-concept-node="${concept.id}">
        <div class="map-node-head"><a href="${prefix}concept/${concept.id}/"><strong>${escapeHtml(concept.title)}</strong></a>${difficultyDots(concept.difficulty)}</div>
        <p class="map-formula">${concept.formulas.length ? renderLatex(concept.formulas[0].latex, { display: false }) : '<span class="hint">مفهوم تعریفی</span>'}</p>
        ${prereqs ? `<p class="map-prereqs">قبل از این: ${prereqs}</p>` : ''}
      </li>`;
        })
        .join('')}
    </ol>
  </section>`;
  });
  return layout({
    title: `نقشه‌ی یادگیری — ${SITE.title}`,
    description: 'نقشه‌ی پیش‌نیاز مفاهیم فیزیک ۲: از پایه تا تمرین.',
    route: { kind: 'map', id: 'map' },
    prefix,
    assets,
    activeNav: 'map',
    bodyClass: 'page-map',
    body: `<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'نقشه‌ی یادگیری' }])}
  <header class="hub-head"><h1>نقشه‌ی یادگیری</h1><p>هر مفهوم به پیش‌نیازهایش وصل است. اگر جایی گیر کردی، از همان مفهوم پیش‌نیاز شروع کن.</p></header>
  ${rows}
</div>`,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'map' }),
  });
}

/* --------------------------------------------------------------- glossary */

export function glossaryPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const body = `<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'واژه‌نامه' }])}
  <header class="hub-head"><h1>واژه‌نامه</h1><p>اصطلاح‌های اصلی درس با معادل انگلیسی و یک توضیح یک‌خطی.</p></header>
  <div class="filter-bar"><input class="filter-input" type="search" data-glossary-search placeholder="جست‌وجو در واژه‌نامه…" aria-label="جست‌وجو در واژه‌نامه"></div>
  <p class="filter-status" data-glossary-status role="status"></p>
  <dl class="glossary" data-glossary>
    ${registry.glossary
      .map(
        (entry) => `<div class="glossary-entry" data-term="${escapeAttribute(`${entry.term} ${entry.en} ${entry.meaning}`)}">
      <dt>${escapeHtml(entry.term)} <span class="glossary-en">${escapeHtml(entry.en)}</span></dt>
      <dd>${renderProse(entry.meaning)}</dd>
    </div>`,
      )
      .join('')}
  </dl>
  <p class="empty-state" data-glossary-empty hidden>واژه‌ای با این عبارت پیدا نشد.</p>
</div>`;
  return layout({
    title: `واژه‌نامه — ${SITE.title}`,
    description: 'واژه‌نامه‌ی اصطلاح‌های فیزیک ۲ با معادل انگلیسی.',
    route: { kind: 'glossary', id: 'glossary' },
    prefix,
    assets,
    activeNav: 'concepts',
    bodyClass: 'page-glossary',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'glossary' }),
  });
}

/* ------------------------------------------------------------ simulations */

export const SIMULATIONS = [
  { id: 'charge-lab', title: 'باردار کردن جسم', part: 'part-1', concept: 'charge-atom', hint: 'اضافه و کم کردن الکترون و دیدن بار خالص' },
  { id: 'coulomb-lab', title: 'آزمایشگاه قانون کولن', part: 'part-1', concept: 'coulomb', hint: 'دو بار، نیرو و افت $1/r^2$' },
  { id: 'triangle-forces', title: 'جمع برداری نیرو در مثلث', part: 'part-1', concept: 'net-force-superposition', hint: 'سه بار روی مثلث متساوی‌الاضلاع' },
  { id: 'square-balance', title: 'مربع و نیروی خالص صفر', part: 'part-1', concept: 'net-force-superposition', hint: 'پیدا کردن $q/Q$ برای تعادل' },
  { id: 'field-lab', title: 'نقشه‌ی میدان الکتریکی', part: 'part-1', concept: 'electric-field', hint: 'بارها را بکش، میدان و نیروی $q_0$ را ببین' },
  { id: 'dipole-lab', title: 'دوقطبی روی محور و عمودمنصف', part: 'part-1', concept: 'electric-dipole', hint: 'مقایسه‌ی میدان و افت $1/r^3$' },
  { id: 'gauss-lab', title: 'آزمایشگاه قانون گاوس', part: 'part-2', concept: 'gauss-law', hint: 'کره، سیم، صفحه و حلقه با سطح گاوسی' },
  { id: 'capacitor-lab', title: 'آزمایشگاه خازن', part: 'part-3', concept: 'parallel-plate', hint: 'مساحت، فاصله، دی‌الکتریک و اتصال سری/موازی' },
  { id: 'drift-lab', title: 'سرعت رانشی الکترون‌ها', part: 'part-4', concept: 'drift-velocity', hint: 'چرا سرعت رانشی این‌قدر کم است' },
  { id: 'circuit-lab', title: 'مدار سری و موازی', part: 'part-4', concept: 'circuits-series-parallel', hint: 'جریان، ولتاژ، توان و اثر دما' },
  { id: 'rc-lab', title: 'شارژ و تخلیه‌ی RC', part: 'part-4', concept: 'rc-circuit', hint: 'منحنی نمایی و ثابت زمانی' },
  { id: 'magnetic-motion', title: 'حرکت بار در میدان مغناطیسی', part: 'part-5', concept: 'magnetic-force', hint: 'دایره، مارپیچ، شعاع و دوره' },
  { id: 'wire-torque', title: 'نیروی سیم و گشتاور حلقه', part: 'part-5', concept: 'torque', hint: 'موتور الکتریکی و گشتاور $NIAB$' },
  { id: 'b-field-lab', title: 'میدان سیم، حلقه و سلونوئید', part: 'part-5', concept: 'ampere', hint: 'قانون آمپر و میدان $B(r)$' },
];

export function simsPage(ctx) {
  const { registry, prefix, assets } = ctx;
  const groups = registry.parts
    .map((part) => ({ part, items: SIMULATIONS.filter((sim) => sim.part === part.id) }))
    .filter((group) => group.items.length > 0);
  const body = `<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'شبیه‌سازی‌ها' }])}
  <header class="hub-head">
    <h1>آزمایشگاه تعاملی</h1>
    <p>همه‌ی شکل‌های این سایت در یک صفحه. هر کنترل همان محاسبه‌ی فیزیک را عوض می‌کند؛ فقط تصویر نیست.</p>
  </header>
  ${groups
    .map(
      ({ part, items }) => `<section class="sim-gallery-group" style="--part-hue:${partMeta(part.id).hue};--part-ink:${partMeta(part.id).ink};--part-tint:${partMeta(part.id).tint}">
    <h2>${badgePart(part)} ${escapeHtml(part.title)}</h2>
    <div class="sim-gallery">
      ${items
        .map(
          (sim) => `<article class="sim-tile" data-sim="${escapeAttribute(sim.id)}" data-concept="${escapeAttribute(sim.concept)}">
        <div class="sim-stage" data-sim-stage><p class="sim-loading">در حال آماده‌سازی…</p></div>
        <header class="sim-tile-head">
          <h3>${escapeHtml(sim.title)}</h3>
          <a class="inline-link" href="${prefix}concept/${sim.concept}/">درس مرتبط</a>
        </header>
        <p class="sim-tile-hint">${renderInlineProse(sim.hint)}</p>
        <details class="sim-text"><summary>توضیح متنی</summary><div>${renderProse(
          registry.conceptById.get(sim.concept)?.visual?.fallback ?? 'توضیح متنی برای این شکل موجود نیست.',
        )}</div></details>
      </article>`,
        )
        .join('')}
    </div>
  </section>`,
    )
    .join('')}
</div>`;
  return layout({
    title: `آزمایشگاه تعاملی — ${SITE.title}`,
    description: 'همه‌ی شبیه‌سازی‌های فیزیک ۲ در یک صفحه.',
    route: { kind: 'sims', id: 'sims' },
    prefix,
    assets,
    activeNav: 'sims',
    bodyClass: 'page-sims',
    body,
    conceptCount: registry.concepts.length,
    pageData: JSON.stringify({ page: 'sims', sims: SIMULATIONS.map((sim) => sim.id) }),
  });
}

/* ----------------------------------------------------------------- search */

export function searchPage(ctx) {
  const { prefix, assets, registry } = ctx;
  const body = `<div class="hub">
  ${breadcrumbFor(prefix, [{ label: 'خانه', href: 'index.html' }, { label: 'جست‌وجو' }])}
  <header class="hub-head"><h1>جست‌وجو در درس</h1><p>در مفاهیم، فرمول‌ها، مثال‌ها و پرسش‌های تمرینی بگرد. جست‌وجو کاملاً روی همین دستگاه انجام می‌شود.</p></header>
  <div class="filter-bar"><input class="filter-input filter-input-lg" type="search" data-search-page-input placeholder="مثلاً: قانون گاوس، خازن، سرعت رانشی…" aria-label="جست‌وجو در درس"></div>
  <p class="filter-status" data-search-page-status role="status"></p>
  <ol class="search-results" data-search-page-results></ol>
</div>`;
  return layout({
    title: `جست‌وجو — ${SITE.title}`,
    description: 'جست‌وجوی سریع در مفاهیم و فرمول‌های فیزیک ۲.',
    route: { kind: 'search', id: 'search' },
    prefix,
    assets,
    activeNav: 'search',
    bodyClass: 'page-search',
    body,
    pageData: JSON.stringify({
      page: 'search',
      entries: registry.concepts.map((concept) => ({
        type: 'concept',
        title: concept.title,
        en: concept.en,
        href: `concept/${concept.id}/`,
        text: `${concept.keywords.join(' ')} ${concept.intuition} ${concept.en}`,
      })),
      formulas: registry.formulas.map((formula) => ({
        type: 'formula',
        title: formula.name,
        en: formula.en ?? '',
        href: `formulas/`,
        text: `${formula.latex} ${formula.interpretation}`,
      })),
      questions: registry.questions.map((question) => ({
        type: 'question',
        title: question.prompt.replace(/\$[^$]*\$/g, '').slice(0, 70),
        en: '',
        href: question.concepts?.length ? `concept/${question.concepts[0]}/` : 'practice/',
        text: question.explain,
      })),
    }),
  });
}

export function notFoundPage(ctx) {
  const { prefix, assets } = ctx;
  const body = `<div class="hub hub-narrow">
  <header class="hub-head"><h1>این صفحه پیدا نشد</h1><p>شاید نشانی را اشتباه تایپ کرده‌ای. از این‌ها شروع کن:</p></header>
  <div class="entry-grid">
    <a class="entry-tile" href="${prefix}index.html"><strong>صفحه‌ی اصلی</strong><span>نقشه‌ی درس و پیشنهاد شروع</span></a>
    <a class="entry-tile" href="${prefix}concepts/"><strong>نمایه‌ی مفاهیم</strong><span>همه‌ی مفاهیم درس</span></a>
    <a class="entry-tile" href="${prefix}search/"><strong>جست‌وجو</strong><span>پیدا کردن سریع یک موضوع</span></a>
  </div>
</div>`;
  return layout({
    title: `صفحه پیدا نشد — ${SITE.title}`,
    description: 'نشانی وارد شده وجود ندارد.',
    route: { kind: '404', id: '404' },
    prefix,
    assets,
    activeNav: '',
    bodyClass: 'page-404',
    body,
    pageData: JSON.stringify({ page: '404' }),
  });
}