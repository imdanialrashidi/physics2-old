import { validateConcept, validateQuestion } from './schema.mjs';

export const questions = [
  validateQuestion({
    id: 'p2-density-1',
    type: 'mcq',
    concepts: ['charge-density'],
    prompt: String.raw`بار $Q=20\,\mu C$ روی یک سیم به طول $L=0.5\,m$ به‌طور یکنواخت پخش شده است. چگالی خطی بار برابر است با:`,
    options: [
      { id: 'a', text: String.raw`$40\,\mu C/m$` },
      { id: 'b', text: String.raw`$10\,\mu C/m$` },
      { id: 'c', text: String.raw`$0.025\,C/m$` },
      { id: 'd', text: String.raw`$0.5\,\mu C/m$` },
    ],
    answer: 'b',
    explain: String.raw`$\lambda = Q/L = 20\times10^{-6}/0.5 = 40\times10^{-6}\,\text{C/m}$. گزینه‌ی (الف) یعنی حاصل‌ضرب، و (ج) یعنی حاصل‌تقسیم با تبدیل واحد اشتباه.`,
  }),
  validateQuestion({
    id: 'p2-density-2',
    type: 'mcq',
    concepts: ['charge-density'],
    prompt: String.raw`کدام گزینه درست است؟`,
    options: [
      { id: 'a', text: String.raw`برای میله‌ی باردار از چگالی سطحی $\sigma$ استفاده می‌کنیم` },
      { id: 'b', text: String.raw`برای صفحه‌ی باردار از چگالی سطحی $\sigma = Q/A$ استفاده می‌کنیم` },
      { id: 'c', text: String.raw`برای کره‌ی باردار از چگالی خطی $\lambda$ استفاده می‌کنیم` },
      { id: 'd', text: 'چگالی بار همیشه بدون واحد است' },
    ],
    answer: 'b',
    explain: String.raw`چگالی **خطی** برای سیم (واحد $\text{C/m}$)، **سطحی** برای صفحه و پوسته ($\text{C/m}^2$) و **حجمی** برای جسم توپر ($\text{C/m}^3$). انتخاب درست، انتگرال‌گیری را ساده می‌کند.`,
  }),
  validateQuestion({
    id: 'p2-wire-1',
    type: 'numeric',
    concepts: ['gauss-cylindrical'],
    prompt: String.raw`یک سیم بلند با چگالی خطی $\lambda = 2\times10^{-6}\,\text{C/m}$ در فاصله‌ی $r = 5\,cm$ میدان الکتریکی چند $\text{N/C}$ است؟`,
    answer: 719700,
    unit: 'N/C',
    tolerance: 0.01,
    explain: String.raw`$E = \lambda/(2\pi\varepsilon_0 r) = 2\times10^{-6}/(2\pi\times8.85\times10^{-12}\times0.05) \approx 7.2\times10^{5}\,\text{N/C}$. توجه کن که وابستگی به فاصله $1/r$ است، نه $1/r^2$ — فرق مهمی با بار نقطه‌ای دارد.`,
  }),
  validateQuestion({
    id: 'p2-gauss-1',
    type: 'mcq',
    concepts: ['gauss-law'],
    prompt: String.raw`طبق قانون گاوس، شار میدان الکتریکی از یک سطح بسته به چه چیزی بستگی دارد؟`,
    options: [
      { id: 'a', text: 'به شکل و اندازه‌ی سطح گاوسی' },
      { id: 'b', text: 'به بار محصور درون آن سطح' },
      { id: 'c', text: 'به میدان در تمام نقطه‌های اطراف' },
      { id: 'd', text: 'به جنس سطح گاوسی' },
    ],
    answer: 'b',
    explain: String.raw`$\Phi_E = q_{net}/\varepsilon_0$: شار فقط به **بار خالص داخل** بستگی دارد. اگر باری بیرون باشد میدان از سطح عبور می‌کند ولی شار صفر می‌دهد.`,
  }),
  validateQuestion({
    id: 'p2-gauss-2',
    type: 'numeric',
    concepts: ['gauss-law', 'gaussian-surface'],
    prompt: String.raw`شار میدان الکتریکی از یک سطح گاوسی $3\times10^{-6}\,\text{N}\cdot\text{m}^2/\text{C}$ است. بار خالص داخل آن چند میکروکولن است؟`,
    answer: 2.66,
    unit: 'µC',
    tolerance: 0.02,
    explain: String.raw`از $\Phi_E = q_{net}/\varepsilon_0$ داریم $q_{net} = \Phi_E\varepsilon_0 = 3\times10^{-6}\times8.85\times10^{-12}\approx2.66\times10^{-17}\,\text{C}$. یعنی حدود $2.66\times10^{-11}\,\mu C$ — بسیار کوچک؛ اگر به این نتیجه شک کردی، یادت باشد که شارها معمولاً کوچک‌اند مگر بار زیاد باشد.`,
  }),
  validateQuestion({
    id: 'p2-sphere-1',
    type: 'mcq',
    concepts: ['gauss-spherical'],
    prompt: String.raw`برای یک **کره‌ی توپر با بار یکنواخت**، میدان در **مرکز** کره صفر است. چرا؟`,
    options: [
      { id: 'a', text: 'چون باری در مرکز وجود ندارد' },
      { id: 'b', text: 'چون به‌خاطر تقارن کروی، بردارهای میدان از همه‌ی جهت‌ها همدیگر را خنثی می‌کنند' },
      { id: 'c', text: 'چون فاصله صفر است و فرمول $1/r^2$ بی‌نهایت می‌شود' },
      { id: 'd', text: 'چون کره رسانا نیست' },
    ],
    answer: 'b',
    explain: String.raw`در مرکز، هر نقطه‌ی کوچک از بار دقیقاً روبه‌روی نقطه‌ی مقابل میدان برابر و مخالف می‌سازد؛ جمع برداری صفر است. برای کره‌ی توپر میدان در طول شعاع **خطی** زیاد می‌شود: $E = kQr/R^3$.`,
  }),
  validateQuestion({
    id: 'p2-plane-1',
    type: 'mcq',
    concepts: ['plane-field'],
    prompt: String.raw`میدان یک صفحه‌ی باردار بی‌نهایت با چگالی $\sigma$ برابر است با:`,
    options: [
      { id: 'a', text: String.raw`$E = \sigma/\varepsilon_0$` },
      { id: 'b', text: String.raw`$E = \sigma/(2\varepsilon_0)$` },
      { id: 'c', text: String.raw`$E = \sigma/\varepsilon_0$ ولی فقط یک طرف` },
      { id: 'd', text: String.raw`$E = 4\pi k\sigma$` },
    ],
    answer: 'b',
    explain: String.raw`دو طرف صفحه میدان برابر و رو به بیرون دارند، پس هر کدام نصف می‌شود: $E = \sigma/(2\varepsilon_0)$. برای هر صفحه‌ی **جدا** از صفحه‌ی دیگر، $E = \sigma/\varepsilon_0$ می‌شود (میدان‌ها جمع می‌شوند).`,
  }),
  validateQuestion({
    id: 'p2-ring-1',
    type: 'mcq',
    concepts: ['ring-field'],
    prompt: String.raw`میدان روی محور یک حلقه‌ی باردار در **مرکز حلقه** صفر است، ولی در فاصله‌های بزرگ از صفر بیشتر می‌شود. چرا؟`,
    options: [
      { id: 'a', text: 'چون در مرکز همه‌ی بردارهای میدان همدیگر را خنثی می‌کنند و در بیرون تقریباً هم‌جهت می‌شوند' },
      { id: 'b', text: 'چون بار حلقه در مرکز صفر است' },
      { id: 'c', text: 'چون فاصله صفر یعنی بی‌نهایت' },
      { id: 'd', text: 'چون حلقه رساناست' },
    ],
    answer: 'a',
    explain: String.raw`در مرکز، تقارن کامل میدان را صفر می‌کند. در فاصله‌های بزروم حلقه مثل یک بار نقطه‌ای رفتار می‌کند ($1/r^2$) و بیشینه‌ی میدان در $x = R/\sqrt2$ رخ می‌دهد.`,
  }),
];

export const concepts = [
  validateConcept(
    {
      id: 'charge-density',
      part: 'part-2',
      title: 'چگالی بار',
      en: 'Charge Density',
      sourceRefs: ['part-2#2', 'part-2#2.1', 'part-2#2.2', 'part-2#2.3'],
      origin: 'course',
      difficulty: 2,
      effort: 12,
      prereqs: ['continuous-distribution'],
      keywords: ['چگالی خطی', 'چگالی سطحی', 'چگالی حجمی', 'lambda', 'sigma', 'rho', 'توزیع بار'],
      intuition: String.raw`وقتی بار روی یک جسم پخش است، نمی‌توانیم فقط با «بار کل» توصیفش کنیم؛ باید بگوییم بار **کجا** و با چه تراکمی قرار دارد. این کمیت‌ها سه‌تا هستند و فقط به شکل جسم بستگی دارند:

| نام | کاربرد | رابطه | واحد |
|---|---|---|---|
| چگالی **خطی** $\lambda$ | سیم، میله‌ی نازک | $\lambda = Q/L$ | $\text{C/m}$ |
| چگالی **سطحی** $\sigma$ | صفحه، پوسته | $\sigma = Q/A$ | $\text{C/m}^2$ |
| چگالی **حجمی** $\rho$ | جسم توپر | $\rho = Q/V$ | $\text{C/m}^3$ |

و در هر سه حالت المان بار همان است:

$$
dq = \lambda\, dl,\qquad dq = \sigma\, dA,\qquad dq = \rho\, dV
$$

یعنی $\lambda\,dl$، $\sigma\,dA$ و $\rho\,dV$ همگی «بار» هستند؛ فقط فرقشان این است که $\lambda$ به **طول** ضرب می‌شود، $\sigma$ به **مساحت** و $\rho$ به **حجم**.

کاربرد اصلی: قبل از هر انتگرال یا قانون گاوس، باید تصمیم بگیری کدام چگالی برای مسئله‌ی تو مناسب است. اگر جسم نازک (سیم) است، خطی؛ اگر نازک اما پهن (صفحه) است، سطحی؛ اگر حجم دارد، حجمی.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'همان سطح باردار، سه نوع چگالی',
        controls: ['نوع توزیع', 'ابعاد جسم'],
        fallback: String.raw`به‌جای تصویر: یک سیم را مثل یک خط، یک صفحه را مثل یک مستطیل و یک کره را مثل یک حجم تصور کن. بار روی خط تقسیم بر طول، روی سطح تقسیم بر مساحت و در حجم تقسیم بر حجم می‌شود. هرچه جسم «بزرگ‌تر» باشد، چگالی کوچک‌تر است، ولی بار کل ثابت می‌ماند.`,
      },
      formulas: [
        {
          name: 'چگالی‌های بار',
          en: 'Linear, surface and volume charge density',
          latex: String.raw`\lambda = \frac{Q}{L},\qquad \sigma = \frac{Q}{A},\qquad \rho = \frac{Q}{V}`,
          symbols: [
            { sym: String.raw`\lambda`, meaning: 'چگالی خطی بار', unit: String.raw`$\text{C/m}$`, en: 'linear density' },
            { sym: String.raw`\sigma`, meaning: 'چگالی سطحی بار', unit: String.raw`$\text{C/m}^2$` },
            { sym: String.raw`\rho`, meaning: 'چگالی حجمی بار', unit: String.raw`$\text{C/m}^3$` },
            { sym: String.raw`Q`, meaning: 'بار کل', unit: 'C' },
          ],
          interpretation: String.raw`تراکم بار روی یک بعد (طول)، دو بعد (سطح) یا سه بعد (حجم).`,
          whenToUse: String.raw`برای نوشتن $dq$ قبل از انتگرال‌گیری، و برای تبدیل «بار کل» به اطلاعات مکانی.`,
          whenNotToUse: String.raw`اگر جسم آن‌قدر کوچک باشد که بتوان آن را بار نقطه‌ای فرض کرد؛ آن‌جا مستقیم از $Q$ استفاده کن.`,
        },
        {
          name: 'المان بار',
          en: 'Charge element',
          latex: String.raw`dq = \lambda\, dl = \sigma\, dA = \rho\, dV`,
          symbols: [{ sym: String.raw`dq`, meaning: 'بار یک جزء بسیار کوچک', unit: 'C' }],
          interpretation: String.raw`با انتخاب چگالی درست، هر سه حالت به یک انتگرال می‌رسند.`,
          whenToUse: String.raw`در هر محاسبه‌ی میدان برای بار پیوسته.`,
          whenNotToUse: String.raw`برای بار نقطه‌ای که خودش یک جزء است و دیگر قابل تقسیم نیست.`,
        },
      ],
      examples: [
        {
          title: 'تبدیل بین چگالی‌ها',
          problem: String.raw`یک کره‌ی توپر با شعاع $R=2\,cm$ بار $Q=40\,\mu C$ دارد. چگالی حجمی آن چقدر است؟`,
          steps: [
            { label: 'گام ۱ — حجم', body: String.raw`$V = \frac43\pi R^3 = \frac43\pi(0.02)^3 \approx 3.35\times10^{-5}\,\text{m}^3$`},
            { label: 'گام ۲ — چگالی', body: String.raw`$\rho = Q/V = 40\times10^{-6}/3.35\times10^{-5} \approx 1.19\,\text{C/m}^3$`},
            { label: 'گام ۳ — بررسی', body: String.raw`چگالی حجمی برای اجسام ماکروسکوپی حدود $\text{C/m}^3$ است، نه عدد کوچکی مثل $\mu\text{C/m}^3$.`},
          ],
          answer: { latex: String.raw`\rho \approx 1.19\,\text{C/m}^3`, body: String.raw`یعنی هر متر مکعب از کره حدود $1.2$ کولن بار دارد.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«چگالی سطحی یعنی بار تقسیم بر حجم.»`, right: String.raw`چگالی سطحی بار بر **مساحت** است ($Q/A$)؛ تقسیم بر حجم می‌شود **حجمی**.` },
        { wrong: String.raw`«هر سه چگالی واحد یکسان دارند.»`, right: String.raw`واحدها فرق دارند: $\text{C/m}$، $\text{C/m}^2$، $\text{C/m}^3$. همین واحد در جواب نهایی دیده می‌شود.` },
      ],
      practice: ['p2-density-1', 'p2-density-2'],
      rescue: {
        prereq: 'continuous-distribution',
        simpler: String.raw`بار کل را تقسیم کن بر اندازه‌ی جسم: طول اگر سیم است، مساحت اگر صفحه، حجم اگر توپر.`,
        visual: String.raw`در شبیه‌ساز گاوس، بین حالت کروی، استوانه‌ای و صفحه‌ای جابه‌جا شو و ببین کدام چگالی در هر حالت استفاده می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`بار $10\,\mu C$ روی یک سیم $2\,m$: $\lambda = 5\,\mu\text{C/m}$. اگر همین بار روی یک صفحه‌ی $1\,m^2$ باشد: $\sigma = 10\,\mu\text{C/m}^2$.`,
        },
      },
      related: [
        { id: 'gauss-law', why: 'برای محاسبه‌ی میدان، چگالی بار تعیین می‌کند چه انتگرالی بنویسی.' },
        { id: 'continuous-distribution', why: 'قبل از این، ایده‌ی «تقسیم جسم به المان‌های کوچک» را دیده بودی.' },
      ],
      examTips: [
        String.raw`اول شکل جسم را نگاه کن و بپرس «بار روی خط است، روی سطح، یا در حجم؟»؛ این یک تصمیم، نیمی از راه‌حل است.`,
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'gauss-law',
      part: 'part-2',
      title: 'قانون گاوس',
      en: "Gauss's Law",
      sourceRefs: ['part-2#6'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['continuous-distribution', 'charge-density'],
      keywords: ['قانون گاوس', 'شار الکتریکی', 'قانون گاوس', 'surface', 'surface gausse', 'شار'],
      intuition: String.raw`تا اینجا میدان را با انتگرال‌گیری المان‌به‌المان حساب می‌کردیم و خیلی وقت‌ها سخت می‌شد. قانون گاوس یک راه کوتاه می‌دهد.

**شار الکتریکی** یعنی «چقدر میدان از این سطح بیرون می‌رود»:

$$
\Phi_E = \int \vec E \cdot d\vec A
$$

نکته‌ی کلیدی ضرب داخلی: $\vec E\cdot d\vec A$ وقتی مثبت است که میدان **از سطح به بیرون** باشد و وقتی منفی است که میدان به داخل باشد. یعنی شار جهت را می‌گیرد.

قانون گاوس می‌گوید:

$$
\boxed{\Phi_E = \frac{q_{net}}{\varepsilon_0}}
$$

یعنی شار فقط به **بار خالص محصور** بستگی دارد — نه به شکل سطح، نه به اندازه‌اش.

استعاره‌ی ساده: میدان الکتریکی مثل آب است. هر چه بار داخل یک ظرف داشته باشی، آب بیشتری از سوراخ‌های ظرف بیرون می‌ریزد. بارهای بیرون از ظرف، سوراخ‌ها را اضافه می‌کنند ولی بار **اضافه** به آب نمی‌کنند؛ برای همین $q_{net}$ مهم است نه مجموع بارها.

پس با قانون گاوس، اگر میدان روی سطح گاوسی **یکنواخت** باشد، می‌توانی مستقیم میدان را به دست بیاوری:

$$
\Phi_E = EA \quad\Rightarrow\quad E = \frac{q_{net}}{\varepsilon_0 A}
$$

این «میان‌بر» فقط وقتی کار می‌کند که سطح را هوشمندانه انتخاب کنی.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'سطح گاوسی: بار داخل، و شار ثابت',
        controls: ['تقارن', 'شعاع سطح گاوسی', 'بار کل'],
        fallback: String.raw`به‌جای تصویر: یک ظرف بسته تصور کن. هر مقدار بار مثبت داخل، میدان را از جداره بیرون می‌فرستد و هر بار منفی داخل، میدان را به داخل می‌کشد. بار بیرون از جداره، چه وارد شود چه خارج شود، شار خالص را تغییر نمی‌دهد. پس شار فقط با بار خالص داخل گره خورده است.`,
      },
      formulas: [
        {
          name: 'شار الکتریکی',
          en: 'Electric flux',
          latex: String.raw`\Phi_E = \int \vec E \cdot d\vec A`,
          symbols: [
            { sym: String.raw`\Phi_E`, meaning: 'شار میدان از سطح بسته', unit: String.raw`$\text{N}\cdot\text{m}^2/\text{C}$` },
            { sym: String.raw`d\vec A`, meaning: 'بردار سطح کوچک با واحد سطح', unit: String.raw`$\text{m}^2$` },
          ],
          interpretation: String.raw`اندازه‌ی «میدان عبوری» از یک سطح؛ مثل حجم آبی که از یک در بیرون می‌ریزد.`,
          whenToUse: String.raw`همیشه وقتی می‌خواهی از قانون گاوس میدان را پیدا کنی.`,
          whenNotToUse: String.raw`اگر میدان روی سطح یکنواخت نباشد، باید انتگرال بگیری و مزیت گاوس از بین می‌رود.`,
        },
        {
          name: 'قانون گاوس',
          en: "Gauss's law",
          latex: String.raw`\Phi_E = \frac{q_{net}}{\varepsilon_0} \quad\Longrightarrow\quad E = \frac{q_{net}}{\varepsilon_0 A}`,
          symbols: [
            { sym: String.raw`q_{net}`, meaning: 'بار خالص داخل سطح گاوسی', unit: 'C' },
            { sym: String.raw`E`, meaning: 'میدان (وقتی یکنواخت باشد)', unit: String.raw`$\text{N/C}$` },
            { sym: String.raw`A`, meaning: 'مساحت سطح بسته', unit: String.raw`$\text{m}^2$` },
          ],
          interpretation: String.raw`شار فقط تابع بار داخل است؛ اگر میدان یکنواخت باشد، مستقیم به میدان تبدیل می‌شود.`,
          whenToUse: String.raw`وقتی آرایش، تقارن بالایی دارد: کروی، استوانه‌ای، صفحه‌ای.`,
          whenNotToUse: String.raw`برای حلقه، میله یا هر آرایش نامتقارن؛ آن‌جا انتگرال لازم است.`,
          rearrangements: [{ latex: String.raw`q_{net} = \varepsilon_0 \Phi_E`, note: 'شار را بدهیم، بار داخل پیدا می‌شود' }],
          notes: [
            String.raw`دقت کن: $\vec E\cdot d\vec A$ با علامت می‌نویسیم؛ اگر میدان به داخل باشد، شار منفی می‌شود.`,
            String.raw`واحب شار $\text{N}\cdot\text{m}^2/\text{C}$ است — اگر به دست آمد، احتمالاً در تبدیل واحد اشتباه کرده‌ای.`,
          ],
        },
      ],
      examples: [
        {
          title: 'میدان کروی بیرون از یک بار نقطه‌ای',
          problem: String.raw`یک بار $Q$ در مرکز یک کره‌ی گاوسی به شعاع $r$ قرار دارد. میدان روی کره را پیدا کنید.`,
          steps: [
            { label: 'گام ۱ — سطح را انتخاب کن', body: String.raw`کره‌ای هم‌مرکز با بار، تا $E$ روی آن ثابت باشد.`},
            { label: 'گام ۲ — بنویس شار', body: String.raw`$\Phi_E = E\cdot A = E\cdot4\pi r^2$`},
            { label: 'گام ۳ — قانون گاوس', body: String.raw`$E\cdot4\pi r^2 = Q/\varepsilon_0$ ⇒ $E = \frac{Q}{4\pi\varepsilon_0 r^2} = \frac{kQ}{r^2}$`},
            { label: 'گام ۴ — نتیجه‌گیری مهم', body: String.raw`همان فرمول قانون کولن برای بار نقطه‌ای! یعنی قانون گاوس برای بار نقطه‌ای، قانون کولن را بازتولید می‌کند.`},
          ],
          answer: { latex: String.raw`E = \frac{kQ}{r^2}`, body: String.raw`بیرون از هر توزیع کروی، نتیجه همان بار نقطه‌ای است.`},
          tip: String.raw`اگر جواب قانون گاوس برای بار نقطه‌ای با قانون کولن فرق داشت، جایی اشتباه کرده‌ای.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«قانون گاوس فقط یک قانون ریاضی انتزاعی است.»`, right: String.raw`این یک نتیجه‌ی فیزیکی است: شار میدان فقط به بار محصور بستگی دارد. در آرایش‌های متقارن، این ماهیت فیزیکی، محاسبه را ساده می‌کند.` },
        { wrong: String.raw`«هر سطح بسته‌ای به درد می‌خورد.»`, right: String.raw`فقط سطحی که با **تقارن** آرایش جور باشد و $E$ را یکنواخت (یا چند جای مشخص) کند.` },
      ],
      practice: ['p2-gauss-1', 'p2-gauss-2'],
      rescue: {
        prereq: 'continuous-distribution',
        simpler: String.raw`شار یعنی «میدان از این سطح چقدر عبور می‌کند». گاوس می‌گوید این مقدار فقط به بار داخل بستگی دارد. پس اول بپرس «بار داخل چقدر است؟» نه «میدان چقدر است؟»`,
        visual: String.raw`در شبیه‌ساز گاوس، سطح گاوسی خط‌چین را ببین و عدد شار و $q/\varepsilon_0$ را مقایسه کن؛ همیشه برابرند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک بار مثبت داخل کره ⇒ شار مثبت (میدان بیرون می‌رود). یک بار منفی داخل ⇒ شار منفی (میدان به داخل می‌کشد). دو بار مساوی و مخالف داخل ⇒ شار صفر.`,
        },
      },
      related: [
        { id: 'gaussian-surface', why: 'انتخاب سطح درست، کل هنر کاربرد گاوس است.' },
        { id: 'gauss-spherical', why: 'اولین کاربرد بزرگ قانون گاوس.' },
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'gaussian-surface',
      part: 'part-2',
      title: 'سطح گاوسی و تقارن',
      en: 'Gaussian Surface and Symmetry',
      sourceRefs: ['part-2#7'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['gauss-law'],
      keywords: ['سطح گاوسی', 'تقارن کروی', 'تقارن استوانه ای', 'تقارن صفحه ای', 'انتخاب سطح'],
      intuition: String.raw`سطح گاوسی یک **سطح فرضیِ بسته** است که خودمان می‌کشیم تا محاسبه را راحت کنیم. قوانینش ساده است: بسته باشد (همه‌ی میدان‌هایی که از آن عبور می‌کنند، حساب شوند) و با تقارن مسئله جور باشد.

سه تقارن اصلی و سطح‌های مناسبشان:

| تقارن | آرایش نمونه | سطح گاوسی مناسب |
|---|---|---|
| **کروی** | کره یا پوسته‌ی کروی | کره‌ی هم‌مرکز |
| **استوانه‌ای** | سیم بلند | استوانه‌ی هم‌محور با دو سر بسته |
| **صفحه‌ای** | صفحه‌ی بزرگ | جعبه‌ی نازک با یک سطح داخل و یک سطح بیرون |

منطق انتخاب ساده است: سطح را طوری بکش که میدان روی تمام آن یکنواخت باشد (تا $E\cdot A = EA$ بشود) و مؤلفه‌های افقیِ نامتقارن خودبه‌خود حذف شوند (تا فقط $E$ باقی بماند).

مثلاً برای سیم بلند: سطح را استوانه‌ای می‌گیریم تا میدان فقط شعاعی باشد؛ سرهای استوانه را می‌بندیم ولی میدان روی آن‌ها شعاعی است و از استوانه بیرون نمی‌زند، پس شار صفر می‌دهند و فقط سطح جانبی کار می‌کند.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'یک سطح، یک آرایش: انتخاب درست تقارن',
        controls: ['نوع سطح گاوسی', 'اندازه'],
        fallback: String.raw`به‌جای تصویر: سه ظرف را تصور کن. برای کره‌ی بار، یک کره‌ی هم‌مرکز بکش. برای سیم، یک استوانه‌ی باریک دور سیم. برای صفحه، یک جعبه‌ی نازک که یک رویش داخل صفحه و یک رویش بیرون است. سطح توپر (مثل یک جعبه‌ی نازک روی صفحه) شار صفر می‌دهد چون هیچ میدانی از آن عبور نمی‌کند — انتخاب غلط، پاسخ غلط می‌دهد.`,
      },
      formulas: [],
      mathNote: String.raw`در این صفحه فرمول نداریم؛ این صفحه درباره‌ی **انتخاب** سطح است و به‌صورت یک روش فکری ارائه می‌شود. فرمول‌ها در سه مفهوم بعدی (کروی، استوانه‌ای، صفحه‌ای) می‌آیند.`,
      examples: [
        {
          title: 'انتخاب غلط سطح',
          problem: String.raw`آیا می‌شود برای یک سیم بلند از کره‌ی گاوسی استفاده کرد؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`روی کره‌ی هم‌مرکز با سیم، میدان شعاعی است — ولی روی نقطه‌های مختلف کره **یکسان نیست** (چون فاصله تا سیم فرق می‌کند).`},
            { label: 'گام ۲', body: String.raw`پس $E\cdot A = EA$ معتبر نیست و مستقیم به میدان نمی‌رسیم.`},
            { label: 'گام ۳ — بهتر', body: String.raw`سطح استوانه‌ای هم‌محور با سیم انتخاب می‌کنیم؛ همه‌ی نقطه‌های سطح جانبی در یک فاصله از سیم‌اند.`},
          ],
          answer: { body: String.raw`می‌شود ولی به‌درد نمی‌خورد؛ سطح استوانه‌ای درست است چون $E$ روی آن یکنواخت است.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«سطح گاوسی باید میله‌ای یا کره‌ای باشد.»`, right: String.raw`هر سطح بسته‌ای می‌تواند باشد، ولی فقط سطحی کمک می‌کند که با تقارن آرایش جور باشد.` },
        { wrong: String.raw`«می‌توانیم یک کره‌ی کوچک *داخل* یک کره‌ی بزرگ‌ترِ خالی بگذاریم و همان جواب بگیریم.»`, right: String.raw`خیر. آن‌وقت $E$ روی سطح یکنواخت نیست و محاسبه غلط می‌شود؛ سطح باید کل آرایش متقارن را در بر بگیرد.` },
      ],
      practice: ['p2-gauss-1'],
      rescue: {
        prereq: 'gauss-law',
        simpler: String.raw`دو تا سؤال بپرس: (۱) میدان روی این سطح همه‌جا یکسان است؟ (۲) مؤلفه‌های جانبی خودبه‌خود حذف می‌شوند؟ اگر هر دو «بله» بود، سطح خوبی است.`,
        visual: String.raw`در شبیه‌ساز گاوس، بین حالت‌های کروی/استوانه‌ای/صفحه‌ای جابه‌جا شو و ببین کدام سطح واقعاً کار را راه می‌اندازد.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`کره‌ی بار → کره‌ی گاوسی. سیم بلند → استوانه. صفحه‌ی بزرگ → جعبه‌ی نازک. سه تقارن، سه سطح.`,
        },
      },
      related: [
        { id: 'gauss-spherical', why: 'کاربرد تقارن کروی.' },
        { id: 'gauss-cylindrical', why: 'کاربرد تقارن استوانه‌ای.' },
      ],
      examTips: [
        String.raw`در حل مسائل گاوس، اول یک جمله بنویس: «به‌دلیل تقارن …، میدان روی سطح گاوسی یکنواخت است». این نمره‌ی جهت‌گیری را می‌گیرد.`,
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'gauss-spherical',
      part: 'part-2',
      title: 'قانون گاوس برای تقارن کروی',
      en: 'Gauss for Spherical Symmetry',
      sourceRefs: ['part-2#8', 'part-2#9'],
      origin: 'course',
      difficulty: 3,
      effort: 20,
      prereqs: ['gauss-law', 'gaussian-surface'],
      keywords: ['کره باردار', 'پوسته کروی', 'داخل کره', 'خارج کره', 'q_net', 'چگالی حجمی'],
      intuition: String.raw`اینجا قانون گاوس بیشترین سود را می‌رساند، چون آرایش کاملاً متقارن است.

**بیرون کره ($r > R$)**: به‌خاطر تقارن، میدان روی کره‌ی گاوسی همه‌جا یکسان است. پس:

$$
E(4\pi r^2) = \frac{q_{net}}{\varepsilon_0}
\;\Rightarrow\;
\boxed{E = \frac{1}{4\pi\varepsilon_0}\frac{q_{net}}{r^2} = \frac{kQ}{r^2}}
$$

یعنی بیرون کره، همه‌چیز **مثل یک بار نقطه‌ای در مرکز** است — دقیقاً همان نتیجه‌ای که قانون کولن می‌دهد.

**داخل یک کره‌ی توپر با بار یکنواخت ($r < R$)**: اینجا نکته‌ی ظریف است. سطح گاوسی کوچک، فقط بخشی از بار را در بر می‌گیرد. برای بار یکنواخت، کسر حجمی برابر کسر حجمی است:

$$
q_{in} = Q\frac{r^3}{R^3}
$$

پس:

$$
\boxed{E = \frac{kQr}{R^3}}
$$

یعنی میدان **خطی** با فاصله از مرکز زیاد می‌شود، و در مرکز صفر است.

اگر کره به‌جای توپر، **پوسته‌ی نازک** (بار فقط روی سطح) باشد: داخل پوسته بار محصور صفر است، پس میدان صفر. این تفاوت میان «توپر» و «پوسته» یکی از دام‌های کلاسیک امتحان است.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'کره‌ی باردار: سطح گاوسی داخل و بیرون',
        controls: ['شعاع کره', 'فاصله‌ی سطح گاوسی', 'بار کل'],
        fallback: String.raw`به‌جای تصویر: یک کره‌ی باردار را تصور کن و یک دایره‌ی کوچک (سطح گاوسی) دور آن بکش. اگر دایره بیرون باشد، کل بار داخل است و میدان مثل بار نقطه‌ای. اگر داخل باشد، فقط بخشی از بار داخل است و برای کره‌ی توپر، میدان با شعاع زیاد می‌شود (نه مثل بار نقطه‌ای که با مربع فاصله کم می‌شود).`,
      },
      formulas: [
        {
          name: 'میدان بیرون کره',
          en: 'Field outside a spherical charge distribution',
          latex: String.raw`E = \frac{1}{4\pi\varepsilon_0}\frac{q_{net}}{r^2} = \frac{kQ}{r^2},\qquad r > R`,
          symbols: [{ sym: String.raw`Q`, meaning: 'بار کل کره', unit: 'C' }, { sym: String.raw`r`, meaning: 'فاصله از مرکز', unit: 'm' }],
          interpretation: String.raw`بیرون از هر توزیع کروی، میدان مثل یک بار نقطه‌ای است.`,
          whenToUse: String.raw`برای هر نقطه‌ی بیرون کره‌ی باردار.`,
          whenNotToUse: String.raw`داخل کره؛ آن‌جا بار محصور کل نیست.`,
        },
        {
          name: 'میدان داخل کره‌ی توپر یکنواخت',
          en: 'Field inside a uniformly charged solid sphere',
          latex: String.raw`E = \frac{kQr}{R^3},\qquad r < R`,
          symbols: [{ sym: String.raw`R`, meaning: 'شعاع کره', unit: 'm' }],
          interpretation: String.raw`با فاصله **خطی** زیاد می‌شود؛ در مرکز صفر است.`,
          whenToUse: String.raw`داخل کره‌ی توپری که بار در کل حجم به‌طور یکنواخت پخش شده.`,
          whenNotToUse: String.raw`داخل **پوسته‌ی کروی** (بار روی سطح): آن‌جا میدان صفر است، چون بار محصور صفر.`,
          notes: [String.raw`این میدان دقیقاً مثل میدان درون یک کره‌ی رسای باردار است.`],
        },
        {
          name: 'بار محصور در شعاع r',
          en: 'Enclosed charge',
          latex: String.raw`q_{in} = Q\frac{r^3}{R^3}`,
          symbols: [{ sym: String.raw`q_{in}`, meaning: 'بار داخل کره‌ی کوچک‌تر', unit: 'C' }],
          interpretation: String.raw`چون چگالی یکنواخت است، کسر حجم = کسر بار.`,
          whenToUse: String.raw`برای رسیدن به میدان داخل کره‌ی توپر.`,
          whenNotToUse: String.raw`برای پوسته‌ی نازک که توزیع یکنواخت نیست.`,
        },
      ],
      examples: [
        {
          title: 'میدان در سه نقطه‌ی یک کره',
          problem: String.raw`کره‌ای با شعاع $R=5\,cm$ و بار $Q=3\,\mu C$ روی سطح آن پخش شده (پوسته). میدان را در مرکز، در $r=R/2$ و در $r=2R$ پیدا کنید.`,
          steps: [
            { label: 'گام ۱ — تشخیص نوع کره', body: String.raw`گفته «روی سطح پخش شده» ⇒ **پوسته** است، نه توپر. این تفاوت، همه‌چیز را عوض می‌کند.`},
            { label: 'گام ۲ — مرکز و داخل', body: String.raw`در مرکز و در $r<R$ هیچ باری داخل سطح گاوسی نیست ⇒ $E = 0$ (نه «بی‌نهایت»).`},
            { label: 'گام ۳ — بیرون', body: String.raw`در $r = 2R = 0.1\,m$: $E = kQ/r^2 = 8.99\times10^9\times3\times10^{-6}/0.01 \approx 2.7\times10^{6}\,\text{N/C}$`},
          ],
          answer: { latex: String.raw`E(0) = E(R/2) = 0,\qquad E(2R) \approx 2.7\times10^{6}\,\text{N/C}`, body: String.raw`برای پوسته، میدان ناگهان از صفر به مقدار بیرونی می‌پرد (در سطح).`},
          tip: String.raw`همیشه اول بپرس: بار **توپر** است یا **روی سطح**؟ این دو، جواب کاملاً متفاوتی دارند.`,
        },
        {
          title: 'پیوستگی میدان',
          problem: String.raw`در سطح یک کره‌ی توپر باردار، میدان ناپیوسته است؟`,
          steps: [
            { label: 'گام ۱ — از داخل', body: String.raw`$E(R^-) = kQR/R^3 = kQ/R^2$`},
            { label: 'گام ۲ — از بیرون', body: String.raw`$E(R^+) = kQ/R^2$`},
            { label: 'گام ۳', body: String.raw`دو طرف برابرند ⇒ میدان روی سطح **پیوسته** است. برای پوسته‌ی نازک، این‌طور نیست (ناپیوستگی به‌خاطر سطح بار).`},
          ],
          answer: { body: String.raw`برای کره‌ی توپر پیوسته است؛ برای پوسته ناپیوسته — و همین ناپیوستگی نشانه‌ی «بار روی سطح» است.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«داخل کره میدان صفر است.»`, right: String.raw`برای **پوسته** صفر است. برای **کره‌ی توپر**، میدان با $r$ زیاد می‌شود و در مرکز صفر است.` },
        { wrong: String.raw`«میدان داخل کره هم مثل بار نقطه‌ای با $1/r^2$ کم می‌شود.»`, right: String.raw`اگر بار توپر باشد، با $r$ **زیاد** می‌شود (خطی). افت $1/r^2$ فقط برای بیرون (یا بار نقطه‌ای) است.` },
      ],
      practice: ['p2-sphere-1'],
      rescue: {
        prereq: 'gauss-law',
        simpler: String.raw`بیرون: مثل بار نقطه‌ای. داخل توپر: مثل شعاع کره (خطی). داخل پوسته: صفر. همین سه جمله، کل مبحث را پوشش می‌دهد.`,
        visual: String.raw`در شبیه‌ساز گاوس (حالت کروی)، شعاع سطح گاوسی را کم و زیاد کن و ببین کِی «داخل» و کِی «بیرون» می‌شود و میدان چطور عوض می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`کره‌ی رسا (بار روی سطح): داخل میدان صفر. مثل بیشتر چیزهای رسا در زندگی روزمره که میدانشان داخل صفر است.`,
        },
      },
      related: [
        { id: 'gauss-law', why: 'قانونی که اینجا استفاده می‌شود.' },
        { id: 'plane-field', why: 'دو بُعد دیگر (استوانه‌ای و صفحه‌ای) همین منطق را دارند.' },
      ],
      examTips: [
        String.raw`«بار روی سطح» = پوسته (میدان داخل صفر) و «بار در حجم» = کره‌ی توپر (میدان داخل صفر در مرکز ولی نه در همه‌جا). این تمایز، رایج‌ترین دام این مبحث است.`,
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'gauss-cylindrical',
      part: 'part-2',
      title: 'قانون گاوس برای تقارن استوانه‌ای',
      en: 'Gauss for Cylindrical Symmetry',
      sourceRefs: ['part-2#10', 'part-2#3'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['gauss-law', 'gaussian-surface'],
      keywords: ['سیم بلند', 'استوانه', 'میدان سیم', 'سطح جانبی', '1/r'],
      intuition: String.raw`یک سیم بلند باردار (یا استوانه‌ی باردار) آرایش **استوانه‌ای** دارد: میدان فقط شعاعی است (موازی سطح استوانه) و به فاصله از محور بستگی دارد، نه به ارتفاع.

سطح گاوسی: یک استوانه‌ی بلند **هم‌محور** با سیم که دو سرش بسته است.

- **سطح جانبی** ($2\pi r L$): میدان موازی این سطح است، پس کل شار از همین‌جاست: $\Phi_E = E\cdot 2\pi r L$.
- **دو سر استوانه**: میدان شعاعی است ولی سطحِ سرها **عمود** بر میدان است، پس شارشان صفر است. یعنی انگار وجود ندارند.

پس:

$$
E\,(2\pi r L) = \frac{\lambda L}{\varepsilon_0}
\quad\Rightarrow\quad
\boxed{E = \frac{\lambda}{2\pi\varepsilon_0 r}}
$$

نکته‌ی مهم و متفاوت: میدان سیم با $1/r$ کم می‌شود (نه $1/r^2$). دلیلش این است که با بزرگ شدن استوانه، بار محصور به‌صورت **خطی** زیاد می‌شود (طول بیشتری از سیم در بر می‌گیرد)، ولی مساحت سطح جانبی با مربع رشد می‌کند.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'استوانه‌ی گاوسی دور سیم؛ فقط سطح جانبی کار می‌کند',
        controls: ['چگالی خطی', 'فاصله از سیم'],
        fallback: String.raw`به‌جای تصویر: سیم را عمودی تصور کن و دورش یک استوانه‌ی هم‌مرکز. میدان از پوسته‌ی استوانه **عمود** بیرون می‌رود (سطح جانبی)، ولی از **درِ بالا و پایین** استوانه بیرون نمی‌رود (چون میدان شعاعی است، نه عمودی). پس سطح‌های بالا و پایین هیچ کاری نمی‌کنند و فقط سطح جانبی در معادله می‌ماند.`,
      },
      formulas: [
        {
          name: 'میدان سیم بلند باردار',
          en: 'Field of a long line charge',
          latex: String.raw`E = \frac{\lambda}{2\pi\varepsilon_0 r}`,
          symbols: [
            { sym: String.raw`\lambda`, meaning: 'چگالی خطی بار', unit: String.raw`$\text{C/m}$` },
            { sym: String.raw`r`, meaning: 'فاصله از محور سیم', unit: 'm' },
          ],
          interpretation: String.raw`با فاصله $1/r$ کم می‌شود — یک توان کمتر از بار نقطه‌ای ($1/r^2$).`,
          whenToUse: String.raw`برای سیم یا استوانه‌ی باردار در فاصله‌هایی که انتهای سیم اثر نکند (یعنی خیلی دور از دو سر).`,
          whenNotToUse: String.raw`خیلی نزدیک دو سر سیم؛ آن‌جا سطح استوانه‌ی متناهی به کار نمی‌آید.`,
          rearrangements: [{ latex: String.raw`r = \frac{\lambda}{2\pi\varepsilon_0 E}`, note: 'فاصله از روی میدان' }],
        },
        {
          name: 'مساحت سطح جانبی استوانه',
          en: 'Lateral area of the Gaussian cylinder',
          latex: String.raw`A = 2\pi r L`,
          symbols: [{ sym: String.raw`L`, meaning: 'طول استوانه‌ی گاوسی', unit: 'm' }],
          interpretation: String.raw`مساحتی که میدان از آن عبور می‌کند.`,
          whenToUse: String.raw`در استخراج فرمول میدان سیم با قانون گاوس.`,
          whenNotToUse: String.raw`برای سرهای استوانه که شار صفر دارند.`,
        },
      ],
      examples: [
        {
          title: 'میدان یک سیم در دو فاصله',
          problem: String.raw`سیمی با $\lambda = 2\times10^{-6}\,\text{C/m}$. میدان را در $r_1 = 2\,cm$ و $r_2 = 4\,cm$ حساب کنید و نسبت را بگویید.`,
          steps: [
            { label: 'گام ۱', body: String.raw`$E(0.02) = 2\times10^{-6}/(2\pi\times8.85\times10^{-12}\times0.02) \approx 1.8\times10^{6}\,\text{N/C}$`},
            { label: 'گام ۲', body: String.raw`$E(0.04) \approx 0.9\times10^{6}\,\text{N/C}$`},
            { label: 'گام ۳ — مقایسه', body: String.raw`فاصله دو برابر شد ⇒ میدان **نصف** شد. این تفاوت را با بار نقطه‌ای (که ¼ می‌شد) مقایسه کن — امضای تقارن استوانه‌ای است.`},
          ],
          answer: { latex: String.raw`E(2r) = \frac{E(r)}{2}`, body: String.raw`وابستگی $1/r$ به‌جای $1/r^2$.`},
          tip: String.raw`اگر نسبت نیرو/میدان شد ۴، احتمالاً اشتباه کرده‌ای — برای سیم باید ۲ باشد.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«میدان سیم مثل بار نقطه‌ای $1/r^2$ کم می‌شود.»`, right: String.raw`برای سیم $1/r$ است، چون سطح گاوسی استوانه‌ای با شعاع رشد **مربعی** می‌کند ولی بار محصور خطی.` },
        { wrong: String.raw`«سرهای استوانه هم شار دارند.»`, right: String.raw`میدان شعاعی است و سطحِ سرها عمود بر میدان؛ پس شار آن‌ها صفر است.` },
      ],
      practice: ['p2-wire-1'],
      rescue: {
        prereq: 'gaussian-surface',
        simpler: String.raw`میدان سیم مثل حلقه‌ی استوانه‌ای دور سیم است. مساحتِ حلقه $2\pi r$ است، پس میدان با $1/r$ کم می‌شود.`,
        visual: String.raw`در شبیه‌ساز گاوس، حالت استوانه‌ای را ببین و نشانگر «مسیر آمپری/استوانه‌ی گاوسی» را دنبال کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک سیم بی‌نهایت را مثل نخ نازکی تصور کن که میدانش مثل شعاع دایره دور آن است. هرچه دورتر بروی، شعاع دایره بزرگ‌تر و میدان ضعیف‌تر (ولی $1/r$).`,
        },
      },
      related: [
        { id: 'gauss-law', why: 'قانون پشت این محاسبه.' },
        { id: 'charge-density', why: 'چگالی خطی، ورودی این محاسبه است.' },
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'plane-field',
      part: 'part-2',
      title: 'میدان صفحه‌ی باردار',
      en: 'Field of a Charged Plane',
      sourceRefs: ['part-2#5', 'part-2#11'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['gauss-cylindrical'],
      keywords: ['صفحه باردار', 'میدان یکنواخت', 'sigma', 'صفحه بی نهایت', 'دو طرف صفحه'],
      intuition: String.raw`صفحه‌ی باردارِ خیلی بزرگ (تقریباً بی‌نهایت) آرایش **صفحه‌ای** دارد: میدان فقط عمود بر صفحه است و به فاصله بستگی ندارد.

سطح گاوسی: یک **جعبه‌ی نازک** که از دو طرف صفحه رد شده است.

- **دو سطح بیرونی** (بالا و پایین): میدان عمود بر آن‌هاست، پس $E\cdot A = EA$. هر کدام شار $EA$ می‌دهند.
- **چهار سطح کناری**: میدان موازی آن‌هاست، پس شار صفر.
- **بار داخل**: فقط بارِ قسمتی از صفحه که داخل جعبه است.

بار داخل جعبه می‌شود $\sigma A$ (اگر $A$ مساحت سطح بیرونی باشد، بارِ بین دو سطح بیرونی = $\sigma A$). پس:

$$
2EA = \frac{\sigma A}{\varepsilon_0}
\quad\Rightarrow\quad
\boxed{E = \frac{\sigma}{2\varepsilon_0}}
$$

نکته‌ی مهم: میدان در **هر دو طرف** صفحه برابر و رو به بیرون است (برای بار مثبت). یعنی میدان صفحه به فاصله بستگی ندارد — یک میدان یکنواخت، مثل میدان بین دو صفحه‌ی خازن (با مقدار $\sigma/\varepsilon_0$).`,
      visual: {
        sim: 'gauss-lab',
        caption: 'جعبه‌ی گاوسی نازک دو طرف صفحه',
        controls: ['چگالی سطحی', 'فاصله از صفحه'],
        fallback: String.raw`به‌جای تصویر: یک صفحه‌ی بزرگ را تصور کن و یک جعبه‌ی کتاب‌مانند که نیمش داخل صفحه است. از **دو** وجه بالا و پایین جعبه میدان بیرون می‌رود (شار دارند)، از چهار وجه کناری اصلاً میدان رد نمی‌شود (شار صفر). تقسیم بر دو، همان ضریب $\frac{1}{2}$ می‌دهد.`,
      },
      formulas: [
        {
          name: 'میدان صفحه‌ی باردار',
          en: 'Field of an infinite charged plane',
          latex: String.raw`E = \frac{\sigma}{2\varepsilon_0}`,
          symbols: [{ sym: String.raw`\sigma`, meaning: 'چگالی سطحی بار', unit: String.raw`$\text{C/m}^2$` }],
          interpretation: String.raw`یکنواخت، مستقل از فاصله، در هر دو طرف صفحه و رو به بیرون (برای بار مثبت).`,
          whenToUse: String.raw`برای صفحه‌های بزرگ در فاصله‌ای که لبه‌ها اثر نکنند.`,
          whenNotToUse: String.raw`نزدیک لبه‌ی صفحه‌ی کوچک؛ آن‌جا میدان یکنواخت نیست و باید انتگرال گرفت.`,
          notes: [
            String.raw`دو صفحه‌ی **موازی با هم** می‌دهد $E = \sigma/\varepsilon_0$ چون میدان‌هایشان جمع می‌شوند (این همان میدان خازن صفحات موازی است، پارت ۳).`,
          ],
        },
      ],
      examples: [
        {
          title: 'میدان بین دو صفحه‌ی موازی',
          problem: String.raw`دو صفحه‌ی موازی بزرگ با چگالی سطحی $\sigma$ روی هم (با فاصله‌ی $d$) بار دارند. میدان بین آن‌ها و بیرون‌شان چقدر است؟`,
          steps: [
            { label: 'گام ۱ — بین دو صفحه', body: String.raw`هر صفحه $\sigma/(2\varepsilon_0)$ می‌دهد و این دو میدان **هم‌جهت**‌اند (بین صفحه‌ها)، پس جمع می‌شوند: $E = \sigma/\varepsilon_0$.`},
            { label: 'گام ۲ — بیرون', body: String.raw`بیرون، میدان‌ها **خلاف‌جهت**‌اند و همدیگر را خنثی می‌کنند ⇒ $E = 0$.`},
            { label: 'گام ۳ — نتیجه', body: String.raw`پس خازن صفحات موازی بیرون از خودش میدان ندارد؛ میدان کاملاً داخل حبس شده.`},
          ],
          answer: { latex: String.raw`E_{in} = \frac{\sigma}{\varepsilon_0},\qquad E_{out} = 0`, body: String.raw`این نتیجه‌ی مستقیم تقارن صفحه‌ای است.`},
          tip: String.raw`همین نتیجه، پایه‌ی مبحث خازن صفحات موازی در پارت ۳ است: $C = \varepsilon_0 A/d$.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«میدان صفحه با فاصله کم می‌شود.»`, right: String.raw`میدان صفحه‌ی بی‌نهایت **یکنواخت** است و به فاصله بستگی ندارد — برخلاف بار نقطه‌ای و سیم.` },
        { wrong: String.raw`«ضریب ۲ در پیش‌نویس لازم نیست.»`, right: String.raw`چون **دو** سطح بیرونی جعبه شار می‌دهند، $2EA$ داریم نه $EA$.`},
      ],
      practice: ['p2-plane-1'],
      rescue: {
        prereq: 'gauss-cylindrical',
        simpler: String.raw`دو صفحه‌ی نازک، هرکدام نصف میدان، ولی در دو جهت مخالف. بین‌شان جمع و بیرون cancel.`,
        visual: String.raw`در شبیه‌ساز گاوس (حالت صفحه‌ای)، پیکان‌های میدان در دو طرف صفحه را ببین: برابر و رو به بیرون.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک صفحه‌ی خیلی بزرگ باردار مثل یک دیوار بی‌نهایت است: یک طرف میدان رو به بیرون، طرف دیگر هم رو به بیرون.`,
        },
      },
      related: [
        { id: 'gauss-cylindrical', why: 'همین منطق با سطح استوانه‌ای.' },
        { id: 'parallel-plate', why: 'دو صفحه‌ی موازی = خازن (پارت ۳).' },
      ],
    },
    'part-2',
  ),

  validateConcept(
    {
      id: 'ring-field',
      part: 'part-2',
      title: 'میدان حلقه‌ی باردار',
      en: 'Field of a Charged Ring',
      sourceRefs: ['part-2#4'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['continuous-distribution', 'gaussian-surface'],
      keywords: ['حلقه باردار', 'محور حلقه', 'بیشینه میدان', 'R/sqrt2', 'انتگرال'],
      intuition: String.raw`حلقه‌ی باردار (با بار یکنواخت) آرایش کروی/استوانه‌ای ندارد، پس **قانون گاوس اینجا کمک زیادی نمی‌کند** و باید انتگرال بگیریم.

ایده: میدان را روی **محور حلقه** حساب می‌کنیم. به‌دلیل تقارن، المان‌های روی محور، مؤلفه‌های جانبی (عمود بر محور) را همدیگر خنثی می‌کنند و فقط **مؤلفه‌ی محوری** باقی می‌ماند. یعنی انتگرال ساده می‌شود.

نتیجه‌ی نهایی:

$$
\boxed{E = \frac{kQx}{(R^2+x^2)^{3/2}}}
$$

که $R$ شعاع حلقه و $x$ فاصله روی محور است.

سه نکته‌ی مهم:
۱. در **مرکز حلقه** ($x=0$) میدان صفر است (تقارن کامل).
۲. میدان در فاصله‌های بزرگ مثل بار نقطه‌ای رفتار می‌کند ($1/x^2$).
۳. میدان یک **بیشینه** دارد در $x = R/\sqrt2$ — نه در مرکز! این نکته‌ی ظریفی است که در آزمون‌ها می‌آید.`,
      visual: {
        sim: 'gauss-lab',
        caption: 'حلقه‌ی باردار و میدان روی محور، با بیشینه در R/√۲',
        controls: ['شعاع حلقه', 'فاصله روی محور', 'بار کل'],
        fallback: String.raw`به‌جای تصویر: یک حلقه (مثل چرخ دوچرخه) را تصور کن که روی محور عمودی‌اش میدان می‌سازد. در مرکز حلقه، میدان از همه‌ی طرف برابر و مخالف است و صفر می‌شود. کمی بالاتر از حلقه، همه‌ی بردارها تقریباً به یک جهت (بالا) جمع می‌شوند، پس بیشترین میدان آنجاست.`,
      },
      formulas: [
        {
          name: 'میدان روی محور حلقه',
          en: 'Field on the axis of a charged ring',
          latex: String.raw`E = \frac{kQx}{(R^2+x^2)^{3/2}}`,
          symbols: [
            { sym: String.raw`R`, meaning: 'شعاع حلقه', unit: 'm' },
            { sym: String.raw`x`, meaning: 'فاصله روی محور از مرکز', unit: 'm' },
            { sym: String.raw`Q`, meaning: 'بار کل حلقه', unit: 'C' },
          ],
          interpretation: String.raw`فقط مؤلفه‌ی محوری میدان باقی می‌ماند؛ بقیه همدیگر را خنثی می‌کنند.`,
          whenToUse: String.raw`برای میدان محورِ حلقه‌ی باردار یکنواخت.`,
          whenNotToUse: String.raw`برای میدان در صفحه‌ی حلقه یا حلقه‌ی ناهمگن که انتگرال ساده نمی‌شود.`,
          rearrangements: [{ latex: String.raw`x = \frac{R}{\sqrt2}\ \Rightarrow\ E_{max} = \frac{kQ}{R^2}\cdot\frac{2\sqrt2}{3R}`, note: 'موقعیت و مقدار بیشینه' }],
          notes: [String.raw`در $x \gg R$ این فرمول به $kQ/x^2$ (بار نقطه‌ای) تبدیل می‌شود — یک چک خوب.`],
        },
      ],
      examples: [
        {
          title: 'پیدا کردن بیشینه',
          problem: String.raw`میدان روی محور حلقه در چه فاصله‌ای بیشینه است؟`,
          steps: [
            { label: 'گام ۱ — مشتق', body: String.raw`$E(x) = kQx(R^2+x^2)^{-3/2}$ ⇒ $dE/dx = kQ\left[(R^2+x^2)^{-3/2} - 3x^2(R^2+x^2)^{-5/2}\right]$`},
            { label: 'گام ۲ — صفر کردن', body: String.raw`$(R^2+x^2) - 3x^2 = 0$ ⇒ $R^2 = 2x^2$ ⇒ $x = R/\sqrt2$`},
            { label: 'گام ۳ — مقدار', body: String.raw`در این نقطه $E_{max} = kQ(R/\sqrt2)/(3R^2/2)^{3/2} = \frac{2\sqrt2}{3}\frac{kQ}{R^2}$`},
          ],
          answer: { latex: String.raw`x = \frac{R}{\sqrt2} \approx 0.71 R`, body: String.raw`بیشینه نه در مرکز، بلکه کمی بیرون از آن است.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«بیشترین میدان حلقه در مرکز آن است.»`, right: String.raw`در مرکز میدان **صفر** است (تقارن)؛ بیشینه در $R/\sqrt2$ است.` },
        { wrong: String.raw`«چون حلقه بار نقطه‌ای نیست، اصلاً نمی‌شود میدانش را حساب کرد.»`, right: String.raw`با تقارن محوری، انتگرال به یک انتگرال ساده‌ی یک‌بعدی تبدیل می‌شود.` },
      ],
      practice: ['p2-ring-1'],
      rescue: {
        prereq: 'continuous-distribution',
        simpler: String.raw`فقط به تقارن نگاه کن: روی محور، همه‌ی بردارهای میدان مؤلفه‌ی عمودی‌شان را همدیگر می‌کشند و فقط مؤلفه‌ی محوری می‌ماند.`,
        visual: String.raw`در شبیه‌ساز گاوس (حالت حلقه)، نقطه را روی محور بکش و ببین چطور میدان از صفر بالا می‌رود و بعد کم می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`در مرکز حلقه، یک بردار میدان از راست و یکی از چپ، هر دو به اندازه‌ی برابر ولی در جهت مخالف‌اند؛ جمعشان صفر است.`,
        },
      },
      related: [
        { id: 'gaussian-surface', why: 'چرا گاوس اینجا کار نمی‌کند و باید انتگرال گرفت.' },
        { id: 'plane-field', why: 'مقایسه‌ی تقارن‌های مختلف.' },
      ],
      examTips: [String.raw`«بیشینه در R/√۲» یکی از سؤال‌های کلاسیک امتحان است؛ حتماً آن را حفظ کن.`],
    },
    'part-2',
  ),
];