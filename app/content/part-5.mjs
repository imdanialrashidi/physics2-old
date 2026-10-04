import { validateConcept, validateQuestion } from './schema.mjs';

export const questions = [
  validateQuestion({
    id: 'p5-field-1',
    type: 'mcq',
    concepts: ['magnetic-field'],
    prompt: String.raw`میدان مغناطیسی روی کدام‌یک اثر **نمی‌کند**؟`,
    options: [
      { id: 'a', text: 'بار متحرک در حال حرکت' },
      { id: 'b', text: 'سیم حامل جریان' },
      { id: 'c', text: 'بار ساکن روی میز' },
      { id: 'd', text: 'ذره‌ی باردارِ در حال حرکت' },
    ],
    answer: 'c',
    explain: String.raw`نیروی مغناطیسی به سرعت وابسته است: $F = qvB\sin\theta$. بار **ساکن** ($v=0$) هیچ نیرویی نمی‌گیرد.`,
  }),
  validateQuestion({
    id: 'p5-biot-savart-1',
    type: 'mcq',
    concepts: ['biot-savart'],
    prompt: String.raw`میدان مغناطیسی مستقیماً از چه چیزی ساخته می‌شود؟`,
    options: [
      { id: 'a', text: 'بار الکتریکی ساکن' },
      { id: 'b', text: 'جریان الکتریکی (بارهای متحرک)' },
      { id: 'c', text: 'میدان الکتریکی' },
      { id: 'd', text: 'دمای جسم' },
    ],
    answer: 'b',
    explain: String.raw`قانون بیو-ساوار می‌گوید میدان از المان‌های **جریان** ساخته می‌شود. بار ساکن فقط میدان **الکتریکی** می‌سازد.`,
  }),
  validateQuestion({
    id: 'p5-magnetic-force-1',
    type: 'mcq',
    concepts: ['magnetic-force'],
    prompt: String.raw`یک بار $q = 2\times10^{-6}\,\text{C}$ با سرعت $v = 300\,m/s$ در میدان $B = 0.5\,T$ و **عمود بر آن** حرکت می‌کند. اندازه‌ی نیروی مغناطیسی چند نیوتن است؟`,
    options: [
      { id: 'a', text: String.raw`$3\times10^{-4}\,N$` },
      { id: 'b', text: String.raw`$0.3\,N$` },
      { id: 'c', text: String.raw`$1.5\,N$` },
      { id: 'd', text: String.raw`$6\times10^{-7}\,N$` },
    ],
    answer: 'a',
    explain: String.raw`$F = qvB\sin\theta$ با $\theta = 90^\circ$ ⇒ $F = 2\times10^{-6}\times300\times0.5 = 3\times10^{-4}\,N$.`,
  }),
  validateQuestion({
    id: 'p5-magnetic-force-2',
    type: 'mcq',
    concepts: ['magnetic-force'],
    prompt: String.raw`اگر بار متحرک **موازی** میدان حرکت کند، چه می‌شود؟`,
    options: [
      { id: 'a', text: 'نیرو دو برابر بیشتر می‌شود' },
      { id: 'b', text: 'نیرو صفر است' },
      { id: 'c', text: 'نیرو نصف می‌شود' },
      { id: 'd', text: 'بار متوقف می‌شود' },
    ],
    answer: 'b',
    explain: String.raw`$\theta = 0 \Rightarrow \sin\theta = 0 \Rightarrow F = 0$. یعنی بار بدون تغییر سرعت از میدان رد می‌شود؛ فقط جهانی که زاویه صفر باشد، نیروی مغناطیسی ندارد.`,
  }),
  validateQuestion({
    id: 'p5-circular-1',
    type: 'mcq',
    concepts: ['circular-motion', 'cyclotron'],
    prompt: String.raw`چرا انرژی جنبشی یک بار در میدان مغناطیسی ثابت می‌ماند؟`,
    options: [
      { id: 'a', text: 'چون نیرو کار انجام نمی‌دهد (همیشه عمود بر سرعت است)' },
      { id: 'b', text: 'چون انرژی کم می‌شود' },
      { id: 'c', text: 'چون سرعت کم می‌شود' },
      { id: 'd', text: 'چون بار خنثی می‌شود' },
    ],
    answer: 'a',
    explain: String.raw`نیروی مغناطیسی همیشه بر **سرعت** عمود است، پس $F\cdot v = 0$ و کار صفر می‌ماند. نیرو فقط **جهت** سرعت را عوض می‌کند (می‌کند به دایره)، نه اندازه‌اش را.`,
  }),
  validateQuestion({
    id: 'p5-cyclotron-1',
    type: 'mcq',
    concepts: ['cyclotron'],
    prompt: String.raw`دوره‌ی حرکت دایره‌ای بار در میان مغناطیسی به چه چیزی وابسته است؟`,
    options: [
      { id: 'a', text: 'به سرعت بار' },
      { id: 'b', text: String.raw`به میدان $B$، جرم و بار ($T = 2\pi m/qB$)` },
      { id: 'c', text: 'به شعاع مسیر' },
      { id: 'd', text: 'به جرم به‌تنهایی' },
    ],
    answer: 'b',
    explain: String.raw`دوره فقط به $m$، $q$ و $B$ بستگی دارد، نه به سرعت و نه به شعاع. یعنی دو ذره با سرعت‌های متفاوت، با $m/q$ یکسان، دقیقاً یک دور می‌زنند — و همین پایه‌ی «سیکلوترون» است.`,
  }),
  validateQuestion({
    id: 'p5-wire-1',
    type: 'mcq',
    concepts: ['wire-force', 'torque'],
    prompt: String.raw`گشتاور روی حلقه‌ی جریان‌دار $\tau = NIAB\sin\theta$ وقتی **صفر** است که:`,
    options: [
      { id: 'a', text: String.raw`$\theta = 0$ باشد` },
      { id: 'b', text: String.raw`$\theta = 90^\circ$ باشد` },
      { id: 'c', text: '$I = 0$ باشد' },
      { id: 'd', text: '$N = 0$ باشد' },
    ],
    answer: 'b',
    explain: String.raw`گشتاور = گشتاور مغناطیسی × میدان × سینوس زاویه. با $I$ و $N$ غیرصفر، گشتاور وقتی صفر است که $\sin\theta = 0$ یعنی $\theta = 0$ یا $180^\circ$. **بیشینه** گشتاور در $90^\circ$ است (حلقه عمود بر میدان، سطح موازی میدان).`,
  }),
  validateQuestion({
    id: 'p5-wire-field-1',
    type: 'mcq',
    concepts: ['wire-field', 'biot-savart', 'ampere'],
    prompt: String.raw`میدان مغناطیسی یک سیم مستقیم بلند با فاصله چه تغییر می‌کند؟`,
    options: [
      { id: 'a', text: 'با $1/r^2$ مثل بار الکتریکی' },
      { id: 'b', text: 'با $1/r$ مثل میدان سیم باردار' },
      { id: 'c', text: 'ثابت می‌ماند' },
      { id: 'd', text: 'با $1/r^3$' },
    ],
    answer: 'b',
    explain: String.raw`$B = \mu_0 I/(2\pi r)$: میدان سیم **مغناطیسی** مثل میدان سیم **الکتریکی** با $1/r$ کم می‌شود (دو دنیای موازی!).`,
  }),
  validateQuestion({
    id: 'p5-solenoid-1',
    type: 'mcq',
    concepts: ['ampere'],
    prompt: String.raw`در سلونوئید بلند، میدان مغناطیسی در داخل تقریباً چگونه است؟`,
    options: [
      { id: 'a', text: 'یکنواخت و قوی، و در بیرون نزدیک صفر' },
      { id: 'b', text: 'در بیرون قوی‌تر است' },
      { id: 'c', text: 'در مرکز صفر است' },
      { id: 'd', text: 'فقط در انتهاها وجود دارد' },
    ],
    answer: 'a',
    explain: String.raw`$B = \mu_0 nI$ در داخل، و در بیرون نزدیک صفر. این ویژگی است که سیم‌پیچ را شبیه آهنربا می‌کند.`,
  }),
  validateQuestion({
    id: 'p5-helix-1',
    type: 'mcq',
    concepts: ['helix'],
    prompt: String.raw`اگر سرعت اولیه‌ی بار در میدان مغناطیسی هم مؤلفه‌ی موازی و هم عمود داشته باشد، مسیرش چه شکلی است؟`,
    options: [
      { id: 'a', text: 'مارپیچی (حلزونی)' },
      { id: 'b', text: 'دایره‌ای کامل' },
      { id: 'c', text: 'خط مستقیم' },
      { id: 'd', text: 'بیضوی' },
    ],
    answer: 'a',
    explain: String.raw`مؤلفه‌ی عمود بر میدان ⇒ حرکت دایره‌ای، و مؤلفه‌ی موازی ⇒ حرکت مستقیم. ترکیب این دو ⇒ **مارپیچ** (حلزون).`,
  }),
];

export const concepts = [
  validateConcept(
    {
      id: 'magnetic-field',
      part: 'part-5',
      title: 'میدان مغناطیسی',
      en: 'Magnetic Field',
      sourceRefs: ['part-5#1'],
      origin: 'course',
      difficulty: 2,
      effort: 10,
      prereqs: ['current'],
      keywords: ['میدان مغناطیسی', 'B', 'تِسلا', 'مغناطیس'],
      intuition: String.raw`میدان مغناطیسی ناحیه‌ای از فضاست که به **بارهای متحرک** و **جریان‌های الکتریکی** نیرو وارد می‌کند. آن را با بردار $\vec B$ نشان می‌دهیم و واحدش **تِسلا** (T) است.

تفاوت بنیادی با میدان الکتریکی (پارت ۱):

- میدان الکتریکی روی **بار ساکن** هم اثر می‌کند.
- میدان مغناطیسی فقط روی **بار متحرک** اثر می‌کند.

مثل تفاوت یک کشنده و یک دیوار! کشنده هر چیزی را می‌گیرد، ولی دیوار فقط چیزی را که به سمتش **حرکت** کند پس می‌زند. به همین دلیل بار ساکن، میدان مغناطیسی حس نمی‌کند.

نکته‌ی مهم: میدان مغناطیسی را در کل طبیعت تولید می‌کند (زمین، خورشید، اتم‌ها). اما در این درس، منبع اصلی را **جریان الکتریکی** می‌سازیم.`,
      visual: {
        sim: 'b-field-lab',
        caption: 'میدان مغناطیسی: حلقه‌های هم‌مرکز دور سیم',
        controls: ['نوع منبع', 'جریان', 'فاصله'],
        fallback: String.raw`به‌جای تصویر: میدان مغناطیسی را مثل خطوط روی یک نقشه‌ی جاده تصور کن: جاده‌های موازی دور یک بزرگراه. خط‌های میدان **هرگز** یکدیگر را قطع نمی‌کنند (میدان مغناطیسی بدون منبع و فرو، بسته است).`,
      },
      formulas: [
        {
          name: 'واحد میدان مغناطیسی',
          en: 'Unit of magnetic field',
          latex: String.raw`[B] = \text{T} \quad (\text{تِسلا})`,
          symbols: [{ sym: String.raw`T`, meaning: 'تِسلا؛ یک تِسلا برابر است با نیوتن بر آمپر‌متر', unit: String.raw`$\text{T} = \text{N}/(\text{A·m})$` }],
          interpretation: String.raw`شدت میدانی که به بار متحرک $1\,\text{C}$ با سرعت $1\,m/s$ نیروی $1\,N$ وارد می‌کند.`,
          whenToUse: String.raw`برای بررسی مرتبه‌ی بزرگی جواب‌ها (میدان زمین حدود $50\,\mu T$).`,
          whenNotToUse: String.raw`در محاسبه؛ این فقط یادآوری واحد است.`,
        },
      ],
      examples: [
        {
          title: 'میدان زمین',
          problem: String.raw`میدان مغناطیسی زمین تقریباً $5\times10^{-5}\,\text{T}$ است. برای بار $1\,\mu C$ با سرعت $1\,m/s$ چه نیرویی وارد می‌شود؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`با $\theta = 90^\circ$: $F = qvB = 10^{-6}\times1\times5\times10^{-5} = 5\times10^{-11}\,N$`},
            { label: 'گام ۲', body: String.raw`نیرو بسیار کوچکی است — یعنی میدان زمین برای یک بار کوچک اثر ناچیزی دارد. اثر آن روی قطب‌نما (که جریان کوچکی دارد) محسوس است چون سیم قطب‌نما بلند است.`},
          ],
          answer: { latex: String.raw`F = 5\times10^{-11}\,\text{N}`, body: String.raw`نیرو بسیار کوچک است.`},
        },
      ],
      practice: ['p5-field-1'],
      misconceptions: [
        { wrong: String.raw`«میدان مغناطیسی روی بار ساکن هم اثر می‌کند.»`, right: String.raw`نه! بدون سرعت، نیروی مغناطیسی صفر است ($F = qvB\sin\theta$).` },
        { wrong: String.raw`«میدان مغناطیسی مثل میدان الکتریکی است.»`, right: String.raw`فرق‌های مهمی دارند: روی بار ساکن اثر نمی‌کند، از جریان ساخته می‌شود، و خطوطش هرگز قطع نمی‌شوند.` },
      ],
      rescue: {
        prereq: 'current',
        simpler: String.raw`میدان مغناطیسی فقط روی چیزی اثر دارد که **حرکت** کند و بار داشته باشد.`,
        visual: String.raw`در شبیه‌ساز میدان، جریان سیم را بالا و پایین کن و ببین حلقه‌های میدان چطور تغییر می‌کنند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`بار ساکن روی میز در میدان آهنربا: هیچ اتفاقی نمی‌افتد. بار همان را هل بده: نیرو می‌گیرد!`,
        },
      },
      related: [
        { id: 'magnetic-force', why: 'اثر اصلی میدان مغناطیسی.' },
        { id: 'wire-field', why: 'میدان مغناطیسی از کجا می‌آید؟' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'magnetic-force',
      part: 'part-5',
      title: 'نیروی مغناطیسی وارد بر بار متحرک',
      en: 'Magnetic Force on a Moving Charge',
      sourceRefs: ['part-5#2'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['magnetic-field'],
      keywords: ['نیروی مغناطیسی', 'F = qvB sin', 'قانون دست راست', 'نیروی لورنتز'],
      intuition: String.raw`اگر باری با سرعت $\vec v$ در میدان $\vec B$ حرکت کند، نیروی مغناطیسی وارد بر آن می‌شود:

$$
\boxed{\vec F = q\,\vec v \times \vec B}
$$

اندازه‌ی نیرو:

$$
\boxed{F = qvB\sin\theta}
$$

که $\theta$ **زاویه بین سرعت و میدان** است. سه حالت مهم:

- $\theta = 90^\circ$: $F = qvB$ — **بیشترین** نیرو (بار **عمود** بر میدان حرکت می‌کند).
- $\theta = 0$: $F = 0$ — بدون نیرو (بار **موازی** میدان حرکت می‌کند، یعنی میدان کاری با آن نمی‌کند!).
- حالت کلی: بین این دو.

نکته‌ی بسیار مهم که بارها اشتباه می‌شود: نیروی مغناطیسی **همیشه** بر سرعت **عمود** است. پس **هرگز** کار انجام نمی‌دهد و سرعت (اندازه‌اش) را تغییر نمی‌دهد — فقط **جهت** را می‌چرخاند.`,
      visual: {
        sim: 'magnetic-motion',
        caption: 'نیروی مغناطیسی: همیشه عمود بر سرعت',
        controls: ['بار', 'سرعت', 'میدان', 'زاویه'],
        fallback: String.raw`به‌جای تصویر: یک توپ را در دستت بگیر و در حالی که جلو می‌رود، با دست دیگر آن را بچرخان. توپ سرعتش کم نمی‌شود، فقط جهتش عوض می‌شود. نیروی مغناطیسی دقیقاً همین کار را می‌کند — و به همین دلیل انرژی جنبشی ثابت می‌ماند.`,
      },
      formulas: [
        {
          name: 'نیروی مغناطیسی (برداری)',
          en: 'Lorentz magnetic force',
          latex: String.raw`F = qvB\sin\theta,\qquad \vec F = q\,\vec v\times\vec B`,
          symbols: [
            { sym: String.raw`\theta`, meaning: 'زاویه‌ی بین سرعت و میدان', unit: 'درجه/رادیان' },
            { sym: String.raw`q`, meaning: 'بار', unit: 'C' },
            { sym: String.raw`v`, meaning: 'سرعت', unit: String.raw`$\text{m/s}$` },
            { sym: String.raw`B`, meaning: 'میدان مغناطیسی', unit: 'T' },
          ],
          interpretation: String.raw`بیشترین نیرو وقتی است که سرعت عمود بر میدان باشد.`,
          whenToUse: String.raw`برای هر مسئله‌ی «بار متحرک در میدان مغناطیسی».`,
          whenNotToUse: String.raw`برای بار **ساکن** (نیرو صفر) یا موازی میدان.`,
          notes: [String.raw`نیرو بر **سرعت** عمود است ⇒ کار صفر ⇒ انرژی جنبشی ثابت.`],
        },
      ],
      examples: [
        {
          title: 'نیرو در زاویه‌های مختلف',
          problem: String.raw`برای بار $q$ با سرعت $v$ در میدان $B$، نیرو در سه زاویه چقدر است؟`,
          steps: [
            { label: 'گام ۱ — عمود', body: String.raw`$\theta = 90^\circ \Rightarrow F = qvB$ (بیشترین)`},
            { label: 'گام ۲ — موازی', body: String.raw`$\theta = 0 \Rightarrow F = 0$`},
            { label: 'گام ۳ — ۴۵ درجه', body: String.raw`$\theta = 45^\circ \Rightarrow F = qvB\times\frac{\sqrt2}{2} \approx 0.71\,qvB$`},
          ],
          answer: { body: String.raw`نیرو بین صفر و بیشترین مقدار تغییر می‌کند.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«نیروی مغناطیسی کار انجام می‌دهد و سرعت را زیاد می‌کند.»`, right: String.raw`نه! نیرو بر سرعت **عمود** است ⇒ کار صفر ⇒ انرژی جنبشی ثابت. فقط جهت عوض می‌شود.` },
        { wrong: String.raw`«نیرو به مسیر بستگی ندارد.»`, right: String.raw`به **زاویه‌ی** بین $v$ و $B$ بستگی دارد: $F = qvB\sin\theta$. موازی ⇒ صفر.` },
      ],
      practice: ['p5-magnetic-force-1', 'p5-magnetic-force-2'],
      rescue: {
        prereq: 'magnetic-field',
        simpler: String.raw`$F = qvB\sin\theta$: نیرو وقتی بیشترین است که سرعت **عمود** بر میدان باشد؛ موازی که باشد، نیرو صفر است.`,
        visual: String.raw`در شبیه‌ساز حرکت مغناطیسی، زاویه‌ی $\theta$ را از صفر تا ۹۰ تغییر بده و تغییر شکل مسیر (از خط مستقیم تا دایره) را ببین.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`بار موازی میان: مثل راه رفتن در راهروی مستقیم — باد پشتت می‌زند ولی جلوی رفتنت را نمی‌گیرد (نیرو صفر).`,
        },
      },
      related: [
        { id: 'right-hand-rule', why: 'جهت نیرو چطور پیدا می‌شود؟' },
        { id: 'circular-motion', why: 'نیروی مغناطیسی چه مسیری می‌سازد؟' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'right-hand-rule',
      part: 'part-5',
      title: 'قاعده دست راست',
      en: 'Right-Hand Rule',
      sourceRefs: ['part-5#3'],
      origin: 'course',
      difficulty: 2,
      effort: 8,
      prereqs: ['magnetic-force'],
      keywords: ['قاعده دست راست', 'جهت نیرو', 'بادانگشت', 'شست'],
      intuition: String.raw`فرمول‌ها فقط **اندازه** می‌گویند. **جهت** را قاعده دست راست می‌دهد، دقیقاً مثل ضرب برداری $\vec v\times\vec B$:

- انگشتان دست راست را در جهت **سرعت** $\vec v$ بگذار.
- دست را به‌طوری بچرخان که انگشت اشاره در جهت **میدان** $\vec B$ باشد.
- **شست** دست، جهت **نیروی** بار **مثبت** را نشان می‌دهد.

برای بار **منفی**، جهت نیرو **برعکس** شست است.

استعاره: مثل گشتن دست راست در باد. انگشت‌ها (باد/میدان) و شست (نیرو).

این قاعده فقط یک ترفند نیست؛ در واقع همان تعریف **ضرب برداری** است. پس اگر با ضرب برداری آشنا باشی، دیگر به حفظ کردن قاعده نیاز نداری.`,
      visual: {
        sim: 'magnetic-motion',
        caption: 'جهت نیرو: انگشتان سرعت، شست نیرو',
        controls: ['زاویه', 'علامت بار'],
        fallback: String.raw`به‌جای تصویر: یک دست راست بگیر. انگشتان را در جهت سرعت قرار بده (مثلاً به سمت جلو) و انگشت اشاره را در جهت میدان (مثلاً بالا). حالا شست کجا رفته؟ همان‌جا نیروی بار مثبت است. برای بار منفی، شست برعکس می‌شود.`,
        extra: [
          {
            sim: 'hand-rule-trainer',
            caption: 'آموزگر قاعده‌ی دست راست: خودت جهت نیرو را پیدا کن',
            fallback: String.raw`به‌جای تصویر: در آموزگر، بار در راستای $x$ حرکت می‌کند و میدان $B$ رو به بیرون از صفحه ($\odot$) است. انگشتان دست راست روی $v$، خم‌شده به سمت $B$ (بیرون صفحه)، پس شست به سمت $\vec v \times \vec B$ اشاره می‌کند: با $v$ رو به $+x$ و $B$ رو به $+z$، حاصل‌ضرب در راستای $-y$ است (چون $x \times z = -y$). پس نیروی بار **مثبت** به سمت $-y$ می‌رود. برای بار منفی، نیرو برعکس می‌شود.`,
          },
        ],
      },
      formulas: [
        {
          name: 'نیروی برداری',
          en: 'Vector form (cross product)',
          latex: String.raw`\vec F = q\,\vec v\times\vec B`,
          symbols: [{ sym: String.raw`\vec v\times\vec B`, meaning: 'ضرب برداری؛ هم‌جهت با انگشت شست راست پس از رعایت قاعده', en: 'cross product' }],
          interpretation: String.raw`ضرب برداری، خودش جهت را تعیین می‌کند — قاعده دست راست فقط بیان تصویری آن است.`,
          whenToUse: String.raw`برای یافتن جهت نیرو (و بعداً جهت گشتاور).`,
          whenNotToUse: String.raw`برای اندازه (که با $qvB\sin\theta$ به دست می‌آید).`,
        },
      ],
      examples: [
        {
          title: 'جهت نیرو در یک حالت مشخص',
          problem: String.raw`بار **مثبت** با سرعت به سمت راست در میدانی که به سمت بالاست حرکت می‌کند. نیرو به کدام سو است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`انگشتان → راست (سرعت)، انگشت اشاره → بالا (میدان).`},
            { label: 'گام ۲', body: String.raw`شست در این حالت به سمت **خارج از صفحه** (سمت تو) اشاره می‌کند.`},
            { label: 'گام ۳ — اگر بار منفی بود', body: String.raw`نیرو به سمت **داخل صفحه** (سمت تو) می‌شد — یعنی برعکس.`},
          ],
          answer: { body: String.raw`نیروی بار مثبت: خارج از صفحه؛ بار منفی: داخل صفحه.`},
          tip: String.raw`وقتی مطمئن نیستی، انگشتانت را واقعاً روی کاغذ بگیر — حس بدنی از فکر کردن سریع‌تر و مطمئن‌تر است.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«جهت نیرو همیشه مثل میدان است.»`, right: String.raw`نیرو بر **سرعت** و میدان **عمود** است. اگر موازی میدان حرکت کند، نیرو اصلاً وجود ندارد.` },
        { wrong: String.raw`«برای بار منفی هم قاعده دست راست همان است.»`, right: String.raw`برای بار منفی، جهت نیرو **برعکس** شست است.` },
      ],
      practice: ['p5-magnetic-force-2'],
      rescue: {
        prereq: 'magnetic-force',
        simpler: String.raw`انگشتان = سرعت، انگشت اشاره = میدان، شست = نیروی بار مثبت.`,
        visual: String.raw`در شبیه‌ساز، علامت بار را عوض کن و ببین جهت پیکان نیرو چطور برمی‌گردد.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`مؤلفه‌ی عمود بر میدان مسئول چرخش است؛ مؤلفه‌ی موازی، حرکت مستقیم.`,
        },
      },
      related: [
        { id: 'magnetic-force', why: 'نیرویی که جهتش را پیدا می‌کنیم.' },
        { id: 'torque', why: 'همین قاعده برای گشتاور هم به کار می‌رود.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'circular-motion',
      part: 'part-5',
      title: 'حرکت ذره‌ی باردار در میدان مغناطیسی',
      en: 'Motion of a Charge in a Magnetic Field',
      sourceRefs: ['part-5#4'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['magnetic-force', 'right-hand-rule'],
      keywords: ['حرکت دایره ای', 'نیروی مرکزگرا', 'شعاع مسیر', 'r = mv/qB', 'دایره'],
      intuition: String.raw`چون نیروی مغناطیسی همیشه بر سرعت **عمود** است و کار انجام نمی‌دهد:

- **اندازه‌ی** سرعت ثابت می‌ماند (انرژی جنبشی ثابت).
- فقط **جهت** سرعت عوض می‌شود.

حالا یک نیروی دائمی که همیشه بر حرکت **عمود** است، دقیقاً مثل **نیروی مرکزگرا** در حرکت دایره‌ای عمل می‌کند. پس مسیر ذره **دایره‌ای** می‌شود.

تعادل دو نیرو:

$$
\underbrace{qvB}_{\text{نیروی مغناطیسی}} = \underbrace{\frac{mv^2}{r}}_{\text{نیروی مرکزگرا}}
$$

از این تعادل، شعاع مسیر به دست می‌آید:

$$
\boxed{r = \frac{mv}{qB}}
$$

چند نتیجه‌ی مهم از این فرمول:
۱. $r$ با $v$ **مستقیم** است: سریع‌تر = دایره‌ی بزرگ‌تر.
۲. $r$ با $m$ مستقیم و با $q$ و $B$ **معکوس** است: جرم بیشتر یا میدان قوی‌تر = دایره‌ی کوچک‌تر.
۳. علامت بار روی اندازه‌ی $r$ اثر ندارد (ولی روی **جهت** گردش اثر دارد): بار مثبت یک سو می‌چرخد، بار منفی سوی دیگر.`,
      visual: {
        sim: 'magnetic-motion',
        caption: 'مسیر دایره‌ای: نیرو همیشه به سمت مرکز',
        controls: ['بار', 'جرم', 'سرعت', 'میدان'],
        fallback: String.raw`به‌جای تصویر: یک سنگ را با ریسمان به دستت بچرخان. نیروی ریسمان همیشه به سمت مرکز دایره است و سنگ را در دایره نگه می‌دارد. نیروی مغناطیسی دقیقاً همین کار را می‌کند — فقط به‌جای ریسمان، از قانون فیزیکی می‌آید.`,
      },
      formulas: [
        {
          name: 'شعاع مسیر دایره‌ای',
          en: 'Radius of circular motion',
          latex: String.raw`r = \frac{mv}{qB}\quad (\text{برای } v \perp B)`,
          symbols: [
            { sym: String.raw`r`, meaning: 'شعاع مسیر دایره‌ای', unit: 'm' },
            { sym: String.raw`m`, meaning: 'جرم ذره', unit: 'kg' },
          ],
          interpretation: String.raw`شعاع با سرعت و جرم مستقیم و با بار و میدان معکوس است.`,
          whenToUse: String.raw`برای وقتی که سرعت **عمود** بر میدان باشد.`,
          whenNotToUse: String.raw`برای سرعت مایل به میدان (که مسیر مارپیچی می‌شود).`,
          rearrangements: [{ latex: String.raw`v = \frac{qBr}{m}`, note: 'سرعت با شعاع داده‌شده' }],
        },
      ],
      examples: [
        {
          title: 'مقایسه‌ی دو ذره',
          problem: String.raw`دو ذره با جرم یکسان در میان یکسان، یکی با سرعت دو برابر دیگری حرکت می‌کنند. شعاع مسیرها چه نسبتی دارد؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`برای هر دو $r = mv/qB$ است.`},
            { label: 'گام ۲', body: String.raw`نسبت شعاع = نسبت سرعت (چون بقیه یکسان است): $\frac{r_1}{r_2} = \frac{v_1}{v_2} = 2$.`},
          ],
          answer: { latex: String.raw`\frac{r_1}{r_2} = 2`, body: String.raw`ذ��ره‌ی سریع‌تر دایره‌ی بزرگ‌تری دارد.`},
          tip: String.raw`برای به‌خاطر سپردن: «سریع‌تر = بزرگ‌تر»، «سنگین‌تر = بزرگ‌تر»، «قوی‌تر = کوچک‌تر».`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«نیروی مغناطیسی سرعت را کم می‌کند.»`, right: String.raw`چون بر سرعت عمود است، اصلاً کار نمی‌کند. سرعت **ثابت** می‌ماند و فقط جهت عوض می‌شود.` },
        { wrong: String.raw`«بار مثبت و منفی شعاع متفاوتی دارند.»`, right: String.raw`اندازه‌ی شعاع یکسان است (فرمول فقط $|q|$ دارد)؛ فقط **جهت** گردششان مخالف است.` },
      ],
      practice: ['p5-circular-1'],
      rescue: {
        prereq: 'magnetic-force',
        simpler: String.raw`نیروی مغناطیسی = نیروی مرکزگرا ⇒ $qvB = mv^2/r$ ⇒ $r = mv/qB$.`,
        visual: String.raw`در شبیه‌ساز، سرعت را زیاد کن و ببین دایره چطور بزرگ می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`چون $F$ با $v$ زیاد می‌شود ولی «شتاب مرکزگرا» $v^2/r$ با مربع سرعت، سریع‌تر رشد می‌کند، دایره بزرگ‌تر می‌شود.`,
        },
      },
      related: [
        { id: 'cyclotron', why: 'دوره و فرکانس این حرکت.' },
        { id: 'helix', why: 'وقتی سرعت مایل باشد چه می‌شود؟' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'cyclotron',
      part: 'part-5',
      title: 'فرکانس حرکت دایره‌ای',
      en: 'Cyclotron Frequency',
      sourceRefs: ['part-5#5'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['circular-motion'],
      keywords: ['دوره', 'فرکانس زاویه ای', 'T = 2pi m/qB', 'سیکلوترون', 'omega'],
      intuition: String.raw`زمان یک دور کامل ذره در میان مغناطیسی را **دوره** ($T$) می‌گویند. از $T = 2\pi r/v$ و جایگذاری $r = mv/qB$:

$$
T = \frac{2\pi r}{v} = \frac{2\pi}{v}\cdot\frac{mv}{qB} = \boxed{\frac{2\pi m}{qB}}
$$

و فرکانس زاویه‌ای:

$$
\boxed{\omega = \frac{qB}{m}}
$$

نکته‌ی شگفت‌انگیز (و مهم): $T$ (و $\omega$) به **سرعت** و **شعاع** بستگی ندارد! فقط به $m$، $q$ و $B$.

یعنی دو ذره با $m/q$ یکسان، حتی با سرعت‌های کاملاً متفاوت، **دقیقاً یک دور** را در زمان یکسان می‌زنند. به همین دلیل:

- دستگاه شتاب‌دهنده‌ی ذرات (سیکلوترون) کار می‌کند: بار را می‌چرخاند و در هر نیم‌دور، اختلاف پتانسیل را **با همان فرکانس** عوض می‌کند، پس بار همیشه شتاب می‌گیرد.
- نسبت $q/m$ را می‌توان با اندازه‌گیری $T$ پیدا کرد (همین کار طیف‌سنج جرم انجام می‌دهد).`,
      visual: {
        sim: 'magnetic-motion',
        caption: 'دوره‌ی مستقل از سرعت',
        controls: ['جرم', 'بار', 'میدان'],
        fallback: String.raw`به‌جای تصویر: دو چرخ‌فلک را تصور کن که یکی کند و یکی تند می‌چرخد ولی هر دو در زمان یکسان یک دور کامل می‌زنند. در میدان مغناطیسی هم همین اتفاق می‌افتد: سرعت فرق دارد، ولی **زمان** یک دور یکی است.`,
      },
      formulas: [
        {
          name: 'دوره و فرکانس زاویه‌ای',
          en: 'Period and angular frequency',
          latex: String.raw`T = \frac{2\pi m}{qB},\qquad \omega = \frac{qB}{m}`,
          symbols: [{ sym: String.raw`\omega`, meaning: 'فرکانس زاویه‌ای', unit: String.raw`$\text{rad/s}$` }],
          interpretation: String.raw`مستقل از سرعت و شعاع؛ فقط جرم، بار و میدان.`,
          whenToUse: String.raw`برای طراحی شتاب‌دهنده و طیف‌سنج جرم.`,
          whenNotToUse: String.raw`وقتی به سرعت و شعاع نیاز داری (برای آن‌ها از $r = mv/qB$ استفاده کن).`,
          rearrangements: [{ latex: String.raw`q = \frac{2\pi m}{BT}`, note: 'نسبت بار به جرم از روی دوره' }],
        },
      ],
      examples: [
        {
          title: 'چرا سرعت روی دوره اثر ندارد؟',
          problem: String.raw`دو ذره‌ی با $m/q$ یکسان، یکی با سرعت $v$ و دیگری با $2v$، در یک میان $B$. چه اتفاقی می‌افتد؟`,
          steps: [
            { label: 'گام ۱ — شعاع', body: String.raw`$r_2/r_1 = v_2/v_1 = 2$ (شعاع دو برابر).`},
            { label: 'گام ۲ — دوره', body: String.raw`$T = 2\pi r/v = 2\pi(2r)/(2v) = 2\pi r/v = T_1$. دوره **یکسان** است!`},
            { label: 'گام ۳ — نتیجه', body: String.raw`سرعت بیشتر ⇒ مسیر بزرگ‌تر ⇒ ولی سرعت بیشتر ⇒ همان دوره. تقابل این دو، اثر سرعت روی دوره را خنثی می‌کند.`},
          ],
          answer: { latex: String.raw`T_1 = T_2`, body: String.raw`دوره مستقل از سرعت است — اساس کار سیکلوترون.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«ذزه‌ی سریع‌تر زودتر یک دور می‌زند.»`, right: String.raw`نه! هر دو در زمان یکسان یک دور می‌زنند. ذره‌ی سریع‌تر فقط دایره‌ی **بزرگ‌تری** می‌زند.` },
        { wrong: String.raw`«فرکانس زاویه‌ای و فرکانس یکی هستند.»`, right: String.raw`فرکانس معمولی $f = 1/T$ و فرکانس زاویه‌ای $\omega = 2\pi f$ است. این دو را قاطی نکن.` },
      ],
      practice: ['p5-cyclotron-1'],
      rescue: {
        prereq: 'circular-motion',
        simpler: String.raw`$T = 2\pi m/qB$: فقط جرم، بار و میدان. سرعت و شعاع در فرمول نیستند!`,
        visual: String.raw`در شبیه‌ساز، سرعت را زیاد کن و ببین دایره بزرگ می‌شود ولی دوره ثابت می‌ماند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`مثل دوندگانی که روی مسیر دایره‌ای مسابقه می‌دهند: دونده‌ی تندتر مسیر بزرگ‌تری را می‌دود ولی زمان یک دور برای همه یکسان است.`,
        },
      },
      related: [
        { id: 'circular-motion', why: 'مسیر دایره‌ای که دوره از آن می‌آید.' },
        { id: 'magnetic-field', why: 'پارامترهای دوره از میدان می‌آیند.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'helix',
      part: 'part-5',
      title: 'حرکت مارپیچی',
      en: 'Helical Motion',
      sourceRefs: ['part-5#6'],
      origin: 'course',
      difficulty: 2,
      effort: 8,
      prereqs: ['circular-motion'],
      keywords: ['مارپیچ', 'حلزون', 'مولفه موازی', 'گام مارپیچ', 'helix'],
      intuition: String.raw`اگر سرعت اولیه‌ی بار **هم‌زمان** دو مؤلفه داشته باشد:

- مؤلفه‌ی **عمود بر میدان** ($v_\perp$) ⇒ حرکت **دایره‌ای** (مؤلفه‌ی ثابت $r = mv_\perp/qB$)
- مؤلفه‌ی **موازی میدان** ($v_\parallel$) ⇒ حرکت **مستقیم** (چون نیرویی در این راستا نیست، این مؤلفه تغییر نمی‌کند)

ترکیب این دو حرکت مستقل، مسیری **مارپیچی** (حلزونی) می‌سازد — مثل فنر، یا لوله‌کشی مارپیچ.

نکته‌ی جالب: در حرکت مارپیچی هم **انرژی جنبشی ثابت** است، چون نیروی مغناطیسی همچنان کار نمی‌کند. فقط مسیر فرق می‌کند.

نکته‌ی کاربردی: «گام مارپیچ» (فاصله‌ی بین دو دور) برابر است با $v_\parallel \times T$ (سرعت موازی × دوره).`,
      visual: {
        sim: 'magnetic-motion',
        caption: 'ترکیب دایره و خط مستقیم = مارپیچ',
        controls: ['زاویه (مؤلفه‌ی موازی)', 'میدان'],
        fallback: String.raw`به‌جای تصویر: یک فنر کشیده را تصور کن. فنر هم می‌چرخد (مثل دایره) و هم بالا می‌رود (مثل مستقیم). اگر فنر را خیلی کشیده‌تر بکشی، فقط بالا می‌رود (مؤلفه‌ی موازی بزرگ). اگر فنر را فشرده کنی، فقط می‌چرخد (مؤلفه‌ی عمود بزرگ).`,
      },
      formulas: [
        {
          name: 'تجزیه‌ی سرعت',
          en: 'Velocity decomposition',
          latex: String.raw`v_\perp = v\sin\theta,\qquad v_\parallel = v\cos\theta`,
          symbols: [
            { sym: String.raw`v_\perp`, meaning: 'مؤلفه‌ی عمود بر میدان (مسئول چرخش)', unit: String.raw`$\text{m/s}$` },
            { sym: String.raw`v_\parallel`, meaning: 'مؤلفه‌ی موازی میدان (مسئول پیشروی)', unit: String.raw`$\text{m/s}$` },
          ],
          interpretation: String.raw`سرعت را به دو مؤلفه‌ی مستقل می‌شکنیم؛ هر کدام رفتار خودش را دارد.`,
          whenToUse: String.raw`برای فهم مسیرهای مارپیچی (و شعاع $r = mv_\perp/qB$).`,
          whenNotToUse: String.raw`وقتی سرعت کاملاً موازی ($\theta = 0$) یا کاملاً عمود ($\theta = 90^\circ$) است.`,
        },
        {
          name: 'گام مارپیچ',
          en: 'Pitch of the helix',
          latex: String.raw`p = v_\parallel \cdot T = v_\parallel\frac{2\pi m}{qB}`,
          symbols: [{ sym: String.raw`p`, meaning: 'فاصله‌ی بین دو دور مارپیچ', unit: 'm' }],
          interpretation: String.raw`چقدر در هر دور، ذره در راستای میدان پیش می‌رود.`,
          whenToUse: String.raw`برای توصیف شکل مارپیچ (در دستگاه‌های آزمایشگاهی مثل طیف‌سنج جرم).`,
          whenNotToUse: String.raw`وقتی مؤلفه‌ی موازی صفر باشد (مسیر دایره‌ای خالص).`,
        },
      ],
      examples: [
        {
          title: 'از دایره تا مارپیچ تا خط',
          problem: String.raw`با تغییر زاویه‌ی $\theta$ بین سرعت و میدان، مسیر چه می‌شود؟`,
          steps: [
            { label: 'گام ۱ — $\theta = 0$', body: String.raw`کاملاً موازی ⇒ فقط حرکت **مستقیم** (بدون چرخش).`},
            { label: 'گام ۲ — $0 < \theta < 90^\circ$', body: String.raw`ترکیبی ⇒ **مارپیچ** با گام متوسط.`},
            { label: 'گام ۳ — $\theta = 90^\circ$', body: String.raw`کاملاً عمود ⇒ فقط **دایره** (بدون پیشروی).`},
          ],
          answer: { body: String.raw`از خط مستقیم → مارپیچ → دایره. هرچه زاویه بیشتر، چرخش بیشتر و پیشروی کمتر.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«ذره در میدان مغناطیسی حتماً خط مستقیم می‌رود.»`, right: String.raw`اگر سرعت عمود بر میدان باشد، **دایره** می‌زند؛ اگر موازی باشد، خط مستقیم؛ اگر مایل باشد، مارپیچ.` },
        { wrong: String.raw`«مؤلفه‌ی موازی هم به‌خاطر نیرو کم می‌شود.»`, right: String.raw`نیروی مغناطیسی **هیچ** مؤلفه‌ای از سرعت را تغییر نمی‌دهد (چون کار نمی‌کند). سرعت ثابت است؛ فقط جهت می‌چرخد.` },
      ],
      practice: ['p5-helix-1'],
      rescue: {
        prereq: 'circular-motion',
        simpler: String.raw`سرعت را به دو تکه بشکن: تکه‌ی عمود می‌چرخد، تکه‌ی موازی راه می‌رود. با هم ⇒ مارپیچ.`,
        visual: String.raw`در شبیه‌ساز، زاویه را از ۰ تا ۹۰ ببر و تغییر تدریجی مسیر (خط → مارپیچ → دایره) را تماشا کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`فنر کشیده = مارپیچ. فنر بی‌کشش (فشرده) = دایره.`,
        },
      },
      related: [
        { id: 'circular-motion', why: 'مؤلفه‌ی عمود.' },
        { id: 'magnetic-force', why: 'نیرویی که فقط مؤلفه‌ی عمود را می‌چرخاند.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'wire-force',
      part: 'part-5',
      title: 'نیروی وارد بر سیم حامل جریان',
      en: 'Force on a Current-Carrying Wire',
      sourceRefs: ['part-5#7'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['magnetic-force'],
      keywords: ['نیروی سیم', 'F = ILB sin', 'موتور', 'لورنتز'],
      intuition: String.raw`سیم حامل جریان مجموعه‌ای از بارهای متحرک است. نیروی مغناطیسی روی بارها جمع می‌شود و در مجموع یک نیرو روی کل سیم می‌دهد:

$$
\boxed{\vec F = I\,\vec L\times\vec B},\qquad \boxed{F = ILB\sin\theta}
$$

که $L$ **طول** سیم و $\theta$ زاویه‌ی بین سیم (جهت جریان) و میدان است.

نکته‌ی کلیدی: جهت نیرو **عمود بر سیم** است. مثل یک چوب در جریان آب که کشیده می‌شود.

کاربرد مهم: **موتور الکتریکی** دقیقاً بر همین بنا شده. سیم داخل روتور جریان دارد و میدان مغناطیسی ثابت (از آهنربا) به آن نیرو وارد می‌کند ⇒ نیرو باعث **چرخش** می‌شود.`,
      visual: {
        sim: 'wire-torque',
        caption: 'نیروی وارد بر سیم و گشتاور روی حلقه',
        controls: ['جریان', 'طول', 'میدان', 'زاویه'],
        fallback: String.raw`به‌جای تصویر: یک چوب را در استخر بینداز؛ جریان آب (I) آن را می‌کشد. اگر میدان مغناطیسی (B) هم باشد و زاویه داشته باشد، نیرو بسته به زاویه تغییر می‌کند. وقتی زاویه صفر است (سیم موازی میدان)، هیچ نیرویی نیست — مثل شنا در جهت جریان که حس نمی‌شود.`,
      },
      formulas: [
        {
          name: 'نیروی سیم حامل جریان',
          en: 'Force on a current-carrying wire',
          latex: String.raw`\vec F = I\,\vec L\times\vec B,\qquad F = ILB\sin\theta`,
          symbols: [
            { sym: String.raw`I`, meaning: 'جریان سیم', unit: String.raw`$\text{A}$` },
            { sym: String.raw`L`, meaning: 'طول سیم', unit: 'm' },
            { sym: String.raw`\theta`, meaning: 'زاویه‌ی سیم با میدان', unit: 'درجه' },
          ],
          interpretation: String.raw`نیرویی که میدان بر کل سیم وارد می‌کند.`,
          whenToUse: String.raw`برای سیم‌های جریان‌دار در میدان (موتور، بلندگو، گیره‌ی آهنربایی).`,
          whenNotToUse: String.raw`برای سیم **بدون** جریان ($I=0$) — نیرو صفر است.`,
        },
      ],
      examples: [
        {
          title: 'نیروی سیم عمود',
          problem: String.raw`سیمی با $I = 3\,A$ و $L = 0.4\,m$ **عمود** بر میدان $B = 0.2\,T$ است. نیرو چقدر است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`با $\theta = 90^\circ$: $F = ILB = 3\times0.4\times0.2 = 0.24\,N$`},
            { label: 'گام ۲ — اگر موازی بود', body: String.raw`اگر سیم موازی میدان ($0^\circ$) بود: $F = 0$.`},
          ],
          answer: { latex: String.raw`F = 0.24\,\text{N}`, body: String.raw`بیشترین نیرو برای این سیم.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«سیم بدون میدان هم نیرو می‌گیرد.»`, right: String.raw`بدون میدان ($B=0$) نیرو صفر است؛ یا بدون جریان ($I=0$) همین‌طور.` },
        { wrong: String.raw`«نیرو در راستای سیم است.»`, right: String.raw`نیرو **عمود** بر سیم (و بر میدان). برای همین موتور می‌چرخد و هل داده نمی‌شود.` },
      ],
      practice: ['p5-wire-field-1'.replace('p5-wire-field-1', 'p5-wire-1')],
      rescue: {
        prereq: 'magnetic-force',
        simpler: String.raw`نیروی بار ($qvB$) را برای کل سیم جمع بزن ⇒ $F = ILB\sin\theta$.`,
        visual: String.raw`در شبیه‌ساز، سیم را نسبت به میدان بچرخان و ببین نیرو کِی صفر و کِی بیشینه است.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`سیم موازی میدان = نیرو صفر؛ سیم عمود میدان = بیشترین نیرو.`,
        },
      },
      related: [
        { id: 'magnetic-force', why: 'همان قانون روی تک‌بار، اینجا روی کل سیم.' },
        { id: 'torque', why: 'نیروی سیم ⇒ گشتاور روی حلقه ⇒ چرخش.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'torque',
      part: 'part-5',
      title: 'گشتاور روی حلقه‌ی جریان‌دار',
      en: 'Torque on a Current Loop',
      sourceRefs: ['part-5#8'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['wire-force'],
      keywords: ['گشتاور مغناطیسی', 'tau = NIAB', 'گشتاور مغناطیسی', 'موتور', 'قطران'],
      intuition: String.raw`حلقه‌ی جریان‌دار در میدان مغناطیسی، فقط نیرو نمی‌گیرد — **می‌چرخد**! گشتاور، تمایل یک نیرو به ایجاد چرخش است.

گشتاور روی حلقه:

$$
\boxed{\tau = NIAB\sin\theta}
$$

که $N$ تعداد دور، $I$ جریان، $A$ مساحت حلقه و $\theta$ زاویه‌ی **گشتاور مغناطیسی** با میدان است.

با تعریف **گشتاور مغناطیسی**:

$$
\boxed{\mu = NIA}
$$

رابطه‌ی گشتاور ساده می‌شود:

$$
\boxed{\tau = \mu B\sin\theta}
$$

نکته‌ی بسیار مهم و کاربردی: موتورهای الکتریکی دقیقاً از همین استفاده می‌کنند. حلقه (روتور) می‌خواهد $\vec\mu$ را با $\vec B$ **هم‌جهت** کند (کمینه‌ی انرژی)، پس چون گشتاور صفر در $\theta=0$ است، موتور به‌طور طبیعی تا **هم‌جهت شدن** می‌چرخد.

مثل آهنربا در میدان: همیشه می‌خواهد خودش را با میدان هم‌جهت کند.`,
      visual: {
        sim: 'wire-torque',
        caption: 'حلقه تا هم‌جهت شدن با میدان می‌چرخد',
        controls: ['تعداد دور', 'جریان', 'مساحت', 'میدان', 'زاویه'],
        fallback: String.raw`به‌جای تصویر: یک قاشق را در میدان آهنربا بچرخان. قاشق می‌خواهد با میدان هم‌جهت شود. اگر زاویه‌اش را عوض کنی، خودش می‌چرخد تا دوباره هم‌جهت شود — این دقیقاً همان رفتار حلقه‌ی جریان‌دار است.`,
      },
      formulas: [
        {
          name: 'گشتاور مغناطیسی',
          en: 'Magnetic moment',
          latex: String.raw`\mu = NIA`,
          symbols: [
            { sym: String.raw`\mu`, meaning: 'گشتاور مغناطیسی', unit: String.raw`$\text{A·m}^2$` },
            { sym: String.raw`N`, meaning: 'تعداد دور', unit: 'بی‌بُعد' },
            { sym: String.raw`A`, meaning: 'مساحت حلقه', unit: String.raw`$\text{m}^2$` },
          ],
          interpretation: String.raw`«قدرت چرخاندن» حلقه‌ی جریان‌دار.`,
          whenToUse: String.raw`برای توصیف توانایی چرخاندن یک حلقه؛ مثل مقایسه‌ی موتورها.`,
          whenNotToUse: String.raw`وقتی فقط نیروی یک سیم را می‌خواهی (که $F = ILB\sin\theta$ است).`,
        },
        {
          name: 'گشتاور روی حلقه',
          en: 'Torque on a current loop',
          latex: String.raw`\tau = NIAB\sin\theta = \mu B\sin\theta`,
          symbols: [{ sym: String.raw`\theta`, meaning: String.raw`زاویه‌ی $\vec\mu$ با $\vec B$`, unit: 'درجه' }],
          interpretation: String.raw`بیشینه در $90^\circ$، صفر در $0^\circ$ و $180^\circ$.`,
          whenToUse: String.raw`برای موتورها، بلندگوها و هر جایی که «چرخاندن» مطرح است.`,
          whenNotToUse: String.raw`وقتی حلقه آزاد است و آزادانه می‌چرخد (بازوی لنگر $A$ اهمیت دارد).`,
        },
      ],
      examples: [
        {
          title: 'موتور کوچک',
          problem: String.raw`حلقه‌ای با $N = 50$ دور، $I = 0.8\,A$، $A = 0.02\,m^2$ در میدان $B = 0.4\,T$ و با زاویه‌ی $30^\circ$. (الف) گشتاور مغناطیسی؟ (ب) گشتاور؟`,
          steps: [
            { label: 'گام ۱ — گشتاور مغناطیسی', body: String.raw`$\mu = NIA = 50\times0.8\times0.02 = 0.8\,A\cdot m^2$`},
            { label: 'گام ۲ — گشتاور', body: String.raw`$\tau = \mu B\sin30^\circ = 0.8\times0.4\times0.5 = 0.16\,N\cdot m$`},
            { label: 'گام ۳ — چک بیشینه', body: String.raw`در $90^\circ$ گشتاور $0.8\times0.4 = 0.32\,N\cdot m$ می‌شد (دو برابر).`},
          ],
          answer: { latex: String.raw`\mu = 0.8\,\text{A·m}^2,\quad \tau = 0.16\,\text{N·m}`, body: String.raw`با زاویه‌ی $90^\circ$ گشتاور دو برابر می‌شد.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«گشتاور وقتی صفر است که زاویه ۹۰ درجه باشد.»`, right: String.raw`برعکس! $\sin90^\circ = 1$ ⇒ گشتاور **بیشینه** در $90^\circ$ و **صفر** در $0^\circ$ (یعنی وقتی $\mu$ و $B$ هم‌جهت‌اند).` },
        { wrong: String.raw`«$\tau$ و $\mu$ یکی هستند.»`, right: String.raw`$\mu$ ویژگی خودِ حلقه است (جریان × سطح)؛ $\tau$ حاصل اثر میدان روی آن است ($\mu B\sin\theta$).` },
      ],
      practice: ['p5-wire-1'],
      rescue: {
        prereq: 'wire-force',
        simpler: String.raw`نیرو روی سیم ⇒ چون نیرو خارج از مرکز است، حلقه می‌چرخد ⇒ گشتاور $\tau = NIAB\sin\theta$.`,
        visual: String.raw`در شبیه‌ساز گشتاور، حالت «چرخش زنده» را ببین تا حلقه خودش تا هم‌جهت شدن بچرخد.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`دو انگشت را مثل حلقه بگیر و آن را در میدان مغناطیسی بچرخان — حس می‌کنی می‌خواهد هم‌جهت شود.`,
        },
      },
      related: [
        { id: 'wire-force', why: 'نیروی روی هر دور سیم.' },
        { id: 'electric-dipole', why: 'ساختار مشابه در الکتریسیته: دوقطبی و گشتاورش.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'biot-savart',
      part: 'part-5',
      title: 'قانون بیو-ساوار',
      en: 'Biot–Savart Law',
      sourceRefs: ['part-5#9'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['magnetic-field'],
      keywords: ['بیو ساوار', 'Biot-Savart', 'المان جریان', 'dB', 'میدان مغناطیسی'],
      intuition: String.raw`قانون بیو-ساوار، «قانون کولنِ» مغناطیس است. می‌گوید میدان مغناطیسی از **المان‌های کوچک جریان** ساخته می‌شود:

$$
d\vec B = \frac{\mu_0}{4\pi}\frac{I\,d\vec l\times\hat r}{r^2}
$$

یعنی هر المان جریان $I\,d\vec l$، در فاصله‌ی $r$، میدان کوچک $d\vec B$ می‌سازد و میدان کل **جمع برداری** این المان‌هاست.

دو نکته:

۱. $\mu_0 = 4\pi\times10^{-7}\,\text{T·m/A}$ ثابت مغناطیسی خلأ است.
۲. $\hat r$ بردار یکه‌ی فاصله است — همان نقشی که $1/r^2$ در قانون کولن دارد.

این قانون به تو می‌گوید: میدان مغناطیسی از **جریان** می‌آید، نه از بار ساکن. همان‌طور که میدان الکتریکی از **بار** می‌آید.

در عمل، انتگرال بیو-ساوار سخت است؛ برای همین در مسائل متقارنی بهتر از **قانون آمپر** استفاده می‌کنیم.`,
      visual: {
        sim: 'b-field-lab',
        caption: 'میدان حلقه‌های جریان: هر کدام سهم خود را می‌گذارند',
        controls: ['نوع منبع', 'جریان'],
        fallback: String.raw`به‌جای تصویر: میدان الکتریکی را از «بارهای نقطه‌ای» ساختیم؛ حالا میدان مغناطیسی را از «سیم‌های کوچک» می‌سازیم. مثل این‌که یک سیم بلند را از تکه‌های کوچک بسازیم؛ هر تکه سهم خودش را در میدان دارد.`,
      },
      formulas: [
        {
          name: 'قانون بیو-ساوار',
          en: 'Biot–Savart law',
          latex: String.raw`d\vec B = \frac{\mu_0}{4\pi}\frac{I\,d\vec l\times\hat r}{r^2}`,
          symbols: [
            { sym: String.raw`\mu_0`, meaning: String.raw`ثابت مغناطیسی خلأ $=4\pi\times10^{-7}$`, unit: String.raw`$\text{T·m/A}$` },
            { sym: String.raw`d\vec l`, meaning: 'بردار المان جریان', unit: 'm' },
            { sym: String.raw`\hat r`, meaning: 'بردار یکه از المان به نقطه‌ی موردنظر', en: 'unit vector' },
          ],
          interpretation: String.raw`میدان کل، جمع برداری میدان همه‌ی المان‌های جریان است.`,
          whenToUse: String.raw`برای حلقه، سیم نیمه‌بی‌نهایت و آرایش‌هایی که تقارن آمپری ندارند.`,
          whenNotToUse: String.raw`وقتی تقارن اجازه‌ی استفاده از قانون آمپر را می‌دهد (سیم بلند، سلونوئید) — آن‌جا آمپر بسیار ساده‌تر است.`,
        },
      ],
      examples: [
        {
          title: 'مقایسه‌ی دو قانون',
          problem: String.raw`برای میدان یک سیم بلند، کدام قانون راحت‌تر است؟`,
          steps: [
            { label: 'گام ۱ — بیو-ساوار', body: String.raw`باید در طول سیم و سپس در فضا انتگرال بگیری؛ سخت است.`},
            { label: 'گام ۲ — آمپر', body: String.raw`با تقارن استوانه‌ای، میدان روی مسیر آمپری ثابت است و انتگرال ساده می‌شود.`},
            { label: 'گام ۳ — نتیجه', body: String.raw`برای سیم بلند و سلونوئید، قانون آمپر انتخاب درست است.`},
          ],
          answer: { body: String.raw`قانون آمپر (به‌خاطر تقارن). بیو-ساوار برای حلقه و حالت‌های نامتقارن.`},
        },
      ],
      practice: ['p5-biot-savart-1'],
      misconceptions: [
        { wrong: String.raw`«بیو-ساوار مثل قانون کولن، مستقیم جواب می‌دهد.»`, right: String.raw`کولن مستقیم است، ولی بیو-ساوار **انتگرال** می‌خواهد. برای همین در حالت‌های متقارن، آمپر ترجیح دارد.` },
        { wrong: String.raw`«میدان مغناطیسی از بار ساکن می‌آید.»`, right: String.raw`از **جریان** (بارهای متحرک) می‌آید. بار ساکن میدان مغناطیسی نمی‌سازد.` },
      ],
      rescue: {
        prereq: 'magnetic-field',
        simpler: String.raw`میدان الکتریکی از بار نقطه‌ای ساخته می‌شد؛ میدان مغناطیسی از «تکه‌های کوچک سیم».`,
        visual: String.raw`در شبیه‌ساز میدان، حلقه و سیم را ببین که هر کدام چطور میدان می‌سازند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک سیم بلند = بی‌نهایت المان جریان کوچک که میدان‌هایشان با هم جمع می‌شود.`,
        },
      },
      related: [
        { id: 'ampere', why: 'روش ساده‌تر برای حالت‌های متقارن.' },
        { id: 'wire-field', why: 'نتیجه‌ی ساده‌ی بیو-ساوار برای سیم و حلقه.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'wire-field',
      part: 'part-5',
      title: 'میدان سیم مستقیم و حلقه',
      en: 'Field of a Straight Wire and a Loop',
      sourceRefs: ['part-5#10', 'part-5#11'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['biot-savart'],
      keywords: ['میدان سیم', 'B = mu0 I /2pi r', 'مرکز حلقه', 'قانون آمپر', 'جهت میدان'],
      intuition: String.raw`**سیم مستقیم بلند** (با قانون آمپر یا بیو-ساوار):

$$
\boxed{B = \frac{\mu_0 I}{2\pi r}}
$$

با $\mu_0 = 4\pi\times10^{-7}$.

نکته‌ی مهم: مثل میدان الکتریکی سیم باردار، اینجا هم افت با $1/r$ است — نه $1/r^2$.

**جهت** میدان: با **قاعده دست راست** — انگشتان در جهت جریان، شست در جهت میدان. پس میدان دور سیم حلقه‌های هم‌مرکز می‌سازد.

**حلقه‌ی جریان**، میدان در **مرکز**:

$$
\boxed{B = \frac{\mu_0 I}{2R}}
$$

و برای $N$ دور:

$$
\boxed{B = \frac{\mu_0 NI}{2R}}
$$

نکته: مثل بار نقطه‌ای، میدان حلقه در فاصله‌های بزرگ با $1/r^2$ کم می‌شود.`,
      visual: {
        sim: 'b-field-lab',
        caption: 'میدان سیم: حلقه‌های هم‌مرکز، و مسیر آمپری',
        controls: ['نوع منبع', 'جریان', 'فاصله', 'شعاع حلقه'],
        fallback: String.raw`به‌جای تصویر: دور یک سیم، میدان را مثل حلقه‌های هم‌مرکز تصور کن (نه بردارهای رادیال مثل میدان الکتریکی). جهت با دست راست: شست در جهت جریان، انگشت‌ها دور سیم.`,
      },
      formulas: [
        {
          name: 'میدان سیم مستقیم بلند',
          en: 'Field of a long straight wire',
          latex: String.raw`B = \frac{\mu_0 I}{2\pi r}`,
          symbols: [
            { sym: String.raw`B`, meaning: 'میدان مغناطیسی در فاصله $r$', unit: 'T' },
            { sym: String.raw`I`, meaning: 'جریان سیم', unit: String.raw`$\text{A}$` },
          ],
          interpretation: String.raw`با فاصله $1/r$ کم می‌شود — مثل میدان الکتریکی سیم باردار.`,
          whenToUse: String.raw`برای سیم‌های بلند و مستقیم در فواصلی که انتهاها اثر نکنند.`,
          whenNotToUse: String.raw`نزدیک دو سر سیم.`,
          notes: [String.raw`با $\mu_0 = 4\pi\times10^{-7}$ مقدار $B$ را سریع حساب می‌کنی: $B = 2\times10^{-7}I/r$.`],
        },
        {
          name: 'میدان مرکز حلقه',
          en: 'Field at the centre of a loop',
          latex: String.raw`B = \frac{\mu_0 I}{2R},\qquad \text{و برای } N \text{ دور: } B = \frac{\mu_0 NI}{2R}`,
          symbols: [{ sym: String.raw`R`, meaning: 'شعاع حلقه', unit: 'm' }],
          interpretation: String.raw`با تعداد دور خطی و با شعاع معکوس تغییر می‌کند.`,
          whenToUse: String.raw`برای حلقه‌ی جریان‌دار (مثل سیم‌پیچ کوچک).`,
          whenNotToUse: String.raw`برای حلقه‌ی تخت با تعداد دور کم (فرم تقریبی است).`,
        },
      ],
      examples: [
        {
          title: 'میدان یک سیم واقعی',
          problem: String.raw`سیمی با $I = 5\,A$. میدان را در $r = 1\,cm$ حساب کنید.`,
          steps: [
            { label: 'گام ۱', body: String.raw`$B = \frac{\mu_0 I}{2\pi r} = \frac{4\pi\times10^{-7}\times5}{2\pi\times0.01} = 10^{-4}\,\text{T} = 0.1\,mT$`},
            { label: 'گام ۲ — مقایسه', body: String.raw`این میدان حدود **۲ برابر** میدان زمین ($5\times10^{-5}\,T$) است. یعنی سیم برقی با ۵ آمپر، در یک سانتی‌متری، میدان قابل‌توجهی می‌سازد.`},
          ],
          answer: { latex: String.raw`B = 1\times10^{-4}\,\text{T}`, body: String.raw`=$0.1\,mT$.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«میدان مغناطیسی مثل میدان الکتریکی با $1/r^2$ کم می‌شود.»`, right: String.raw`برای **سیم** $1/r$ است (مثل سیم باردار). $1/r^2$ فقط برای حلقه در فاصله‌های بزرگ (و بار نقطه‌ای) صدق می‌کند.` },
        { wrong: String.raw`«جهت میدان سیم به مرکز است.»`, right: String.raw`میدان دور سیم **حلقه‌ای** است (عمود بر سیم و شعاعی حول آن)، نه به سمت سیم.` },
      ],
      practice: ['p5-wire-field-1'],
      rescue: {
        prereq: 'biot-savart',
        simpler: String.raw`سیم: $B \propto 1/r$. حلقه در مرکز: $B = \mu_0 NI/2R$.`,
        visual: String.raw`در شبیه‌ساز میدان، بین «سیم» و «حلقه» جابه‌جا شو و تفاوت الگوی میدان را ببین.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`قاعده دست راست: شست در جهت جریان ⇒ انگشت‌ها جهت میدان دور سیم.`,
        },
      },
      related: [
        { id: 'biot-savart', why: 'قانون پشت این محاسبه.' },
        { id: 'ampere', why: 'روش سریع‌تر برای سیم بلند.' },
        { id: 'wire-force', why: 'میدان مغناطیسی روی سیم جریان‌دار نیرو وارد می‌کند.' },
      ],
    },
    'part-5',
  ),

  validateConcept(
    {
      id: 'ampere',
      part: 'part-5',
      title: 'قانون آمپر و سلونوئید',
      en: "Ampère's Law and the Solenoid",
      sourceRefs: ['part-5#12', 'part-5#13'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['wire-field'],
      keywords: ['قانون آمپر', 'Ampere', 'مسیر آمپری', 'سلونوئید', 'B = mu0 nI'],
      intuition: String.raw`قانون آمپر، «نسخه‌ی مغناطیسی» قانون گاوس است:

$$
\boxed{\oint \vec B\cdot d\vec l = \mu_0 I_{enc}}
$$

یعنی: گردش میدان مغناطیسی حول یک مسیر بسته، برابر است با $\mu_0$ ضرب‌در **جریان محصور** درون آن مسیر.

معنی: میدان مغناطیسی «منبع» و «م sinks» ندارد (خطوط میدان بسته‌اند). اگر مسیر آمپری هیچ سیمی در خود نداشته باشد، $\oint B\cdot dl = 0$ می‌شود، حتی اگر میدان در اطرافش باشد.

**سلونوئید** (سیم‌پیچ بلند) — کاربرد اصلی قانون آمپر:

- **داخل** سیم‌پیچ: میدان یکنواخت و قوی:

$$
\boxed{B = \mu_0 n I},\qquad n = \frac{N}{L}
$$

- **بیرون** سیم‌پیچ: میدان نزدیک صفر.

این «میدان قوی داخل، صفر بیرون» است که سیم‌پیچ را شبیه آهنربا می‌کند و پایه‌ی موتورها، بلندگوها و آشکارسازهای مغناطیسی است.`,
      visual: {
        sim: 'b-field-lab',
        caption: 'سلونوئید: میدان قوی داخل، ضعیف بیرون',
        controls: ['نوع منبع', 'تعداد دور', 'طول', 'جریان'],
        fallback: String.raw`به‌جای تصویر: یک سیم‌پیچ (سلونوئید) را تصور کن. میدان مثل خطوط داخل لوله‌ی کاغذی **داخل** آن متمرکز است، ولی بیرون، خطوط محو می‌شوند (انگار بیرون میدان را نمی‌بینی). این همان چیزی است که آهنربا را شبیه‌سازی می‌کند.`,
      },
      formulas: [
        {
          name: 'قانون آمپر',
          en: "Ampère's law",
          latex: String.raw`\oint \vec B\cdot d\vec l = \mu_0 I_{enc}`,
          symbols: [{ sym: String.raw`I_{enc}`, meaning: 'جریان محصور درون مسیر آمپری', unit: String.raw`$\text{A}$` }],
          interpretation: String.raw`گردش میدان فقط به جریان محصور بستگی دارد، نه به شکل مسیر.`,
          whenToUse: String.raw`برای آرایش‌های متقارن: سیم بلند، سلونوئید، کره‌ی جریان‌دار.`,
          whenNotToUse: String.raw`برای حلقه‌ی ساده (که بیو-ساوار راحت‌تر است) و آرایش‌های نامتقارن.`,
        },
        {
          name: 'میدان داخل سلونوئید',
          en: 'Field inside a solenoid',
          latex: String.raw`B = \mu_0 n I = \frac{\mu_0 NI}{L}`,
          symbols: [
            { sym: String.raw`n`, meaning: 'تعداد دور بر واحد طول $=N/L$', unit: String.raw`$\text{m}^{-1}$` },
          ],
          interpretation: String.raw`فقط به تعداد دور بر **طول** بستگی دارد، نه به شعاع سیم‌پیچ.`,
          whenToUse: String.raw`برای سیم‌پیچ بلند و نازک.`,
          whenNotToUse: String.raw`برای سیم‌پیچ کوتاه و پهن (میدان بیرون قابل‌توجه است).`,
        },
      ],
      examples: [
        {
          title: 'محاسبه‌ی میدان سلونوئید',
          problem: String.raw`سلونوئیدی با $N = 1000$ دور در طول $L = 0.25\,m$ و جریان $I = 2\,A$. میدان داخل چقدر است؟`,
          steps: [
            { label: 'گام ۱ — تعداد دور بر متر', body: String.raw`$n = N/L = 1000/0.25 = 4000\,m^{-1}$`},
            { label: 'گام ۲ — میدان', body: String.raw`$B = \mu_0 nI = 4\pi\times10^{-7}\times4000\times2 = 10^{-2}\,T = 10\,mT$`},
            { label: 'گام ۳ — بررسی', body: String.raw`برای سیم‌پیچی با این اندازه، $10\,mT$ میدان معقولی است (قوی، ولی نه غیرعادی).`},
          ],
          answer: { latex: String.raw`B = 0.01\,\text{T}`, body: String.raw`یعنی $10\,mT$.`},
          tip: String.raw`توجه کن که $B$ به **طول** سیم‌پیچ بستگی دارد: اگر دورها را در همان طول جمع کنی ($n$ بزرگ‌تر)، میدان بیشتر می‌شود.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«میدان سلونوئید مثل آهنربا در بیرون هم قوی است.»`, right: String.raw`بیرونِ سلونوئید بلند، میدان **نزدیک صفر** است. قدرت سلونوئید از تمرکز میدان در داخلش می‌آید.` },
        { wrong: String.raw`«قانون آمپر مثل قانون گاوس، همیشه میدان را می‌دهد.»`, right: String.raw`فقط وقتی که بتوانی میدان را روی مسیر **ثابت** فرض کنی (یعنی تقارن). در غیر این صورت، آمپر فقط رابطه می‌دهد و باید از بیو-ساوار استفاده کنی.` },
      ],
      practice: ['p5-solenoid-1'],
      rescue: {
        prereq: 'wire-field',
        simpler: String.raw`آمپر = گاوسِ مغناطیسی. سلونوئید: $B = \mu_0 n I$ با $n = N/L$.`,
        visual: String.raw`در شبیه‌ساز، حالت «سلونوئید» را انتخاب کن و پیکان‌های داخل و بیرون را مقایسه کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`اگر $n$ را دو برابر کنی (دو برابر دور در همان طول)، میدان هم دو برابر می‌شود.`,
        },
      },
      related: [
        { id: 'wire-field', why: 'میدان سیم و حلقه، پایه‌ی سلونوئید.' },
        { id: 'torque', why: 'سلونوئید، گشتاور را بزرگ می‌کند (موتورها).' },
      ],
    },
    'part-5',
  ),
];