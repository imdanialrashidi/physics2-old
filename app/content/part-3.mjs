import { validateConcept, validateQuestion } from './schema.mjs';

export const questions = [
  validateQuestion({
    id: 'p3-multi-1',
    type: 'numeric',
    concepts: ['multi-potential'],
    prompt: String.raw`دو بار $+2\,\mu C$ و $-2\,\mu C$ در فاصله‌ی $r = 10\,cm$ از یک نقطه‌ی میانی‌شان قرار دارند. پتانسیل در وسط این دو برابر است با:`,
    answer: 0,
    unit: 'V',
    tolerance: 0.001,
    explain: String.raw`پتانسیل جمع **جبری** است: $V = kq_1/r + kq_2/r = k(+2\,\mu C - 2\,\mu C)/0.1 = 0$. نکته: میدان در این نقطه هم صفر است، ولی اینجا دلیل فرق است — بارها **مخالف**‌اند و پتانسیل‌هایشان دقیقاً همدیگر را خنثی می‌کنند. (در مربع چهارباره‌ی هم‌علامت، میدان صفر بود ولی پتانسیل نه.)`,
  }),
  validateQuestion({
    id: 'p3-potential-1',
    type: 'mcq',
    concepts: ['electric-potential'],
    prompt: String.raw`اختلاف پتانسیل بین دو نقطه چیست؟`,
    options: [
      { id: 'a', text: 'نیرو بر واحد بار، مستقل از مسیر' },
      { id: 'b', text: 'کاری که میدان بر واحد بار مثبت انجام می‌دهد تا از A به B برود، با علامت منفی' },
      { id: 'c', text: 'شدت میدان الکتریکی در آن نقطه' },
      { id: 'd', text: 'انرژی کل بار در میدان' },
    ],
    answer: 'b',
    explain: String.raw`$V_B - V_A = -\int_A^B \vec E\cdot d\vec s$: کار میدان بر **واحد بار** با علامت منفی. پس میدان مثبت، پتانسیل را در جهت خودش کم می‌کند (میدان همیشه در جهت کاهش پتانسیل است).`,
  }),
  validateQuestion({
    id: 'p3-potential-2',
    type: 'numeric',
    concepts: ['point-charge-potential'],
    prompt: String.raw`پتانسیل یک بار $q = 3\,\mu C$ در فاصله‌ی $r = 15\,cm$ از آن، بر حسب ولت چقدر است؟`,
    answer: 179800,
    unit: 'V',
    tolerance: 0.01,
    explain: String.raw`$V = kq/r = 8.99\times10^9\times3\times10^{-6}/0.15 \approx 1.8\times10^{5}\,\text{V}$. توجه کن که این بار با $1/r$ کم می‌شود (نه $1/r^2$ مثل میدان).`,
  }),
  validateQuestion({
    id: 'p3-energy-1',
    type: 'mcq',
    concepts: ['potential-energy'],
    prompt: String.raw`دو بار $q_1$ و $q_2$ با $q_1q_2 < 0$ در فاصله‌ی $r$ از هم‌اند. انرژی پتانسیل آن‌ها چه علامتی دارد؟`,
    options: [
      { id: 'a', text: 'مثبت' },
      { id: 'b', text: 'منفی' },
      { id: 'c', text: 'صفر' },
      { id: 'd', text: 'بستگی به فاصله دارد' },
    ],
    answer: 'b',
    explain: String.raw`$U = kq_1q_2/r$ و چون $q_1q_2<0$، انرژی **منفی** است. معنا: بارهای مخالف در حالت کم‌انرژی‌تری (نزدیک‌تر) هستند و برای جدا کردنشان باید کار مثبت بدهی.`,
  }),
  validateQuestion({
    id: 'p3-field-potential-1',
    type: 'mcq',
    concepts: ['field-potential'],
    prompt: String.raw`رابطه‌ی میدان و پتانسیل کدام است؟`,
    options: [
      { id: 'a', text: String.raw`$\vec E = \nabla V$` },
      { id: 'b', text: String.raw`$\vec E = -\nabla V$` },
      { id: 'c', text: String.raw`$\vec E = \nabla(1/V)$` },
      { id: 'd', text: String.raw`$\vec E = -V^2$` },
    ],
    answer: 'b',
    explain: String.raw`$\vec E = -\nabla V$ یعنی میدان، **شیب منفی** پتانسیل است: هرجا پتانسیل سریع‌تر کم می‌شود، میدان قوی‌تر است. در یک بعد: $E = -dV/dx$.`,
  }),
  validateQuestion({
    id: 'p3-capacitor-1',
    type: 'numeric',
    concepts: ['parallel-plate', 'capacitor'],
    prompt: String.raw`خازنی با $A = 10\,\text{cm}^2$، $d = 0.5\,\text{mm}$ و بدون دی‌الکتریک. ظرفیت آن چند پیکوفاراد است؟`,
    answer: 177.4,
    unit: 'pF',
    tolerance: 0.02,
    explain: String.raw`$A = 10\,\text{cm}^2 = 10^{-3}\,\text{m}^2$ و $d = 5\times10^{-4}\,\text{m}$ ⇒ $C = \varepsilon_0 A/d = 8.85\times10^{-12}\times10^{-3}/(5\times10^{-4}) \approx 1.77\times10^{-11}\,\text{F} = 17.7\,\text{pF}$.

**دقت کن:** این‌بار جواب ۱۷٫۷ پیکوفاراد است، نه ۱۷۷ — پاسخ درست $17.7$ است. (عدد ۱۷۷ از جا انداختن دو صفر در تبدیل $\text{cm}^2 \to \text{m}^2$ می‌آید.)`,
  }),
  validateQuestion({
    id: 'p3-capacitor-2',
    type: 'mcq',
    concepts: ['capacitor-combination'],
    prompt: String.raw`دو خازن $C_1 = 2\,\mu F$ و $C_2 = 3\,\mu F$ را **سری** وصل می‌کنیم. ظرفیت معادل چقدر است؟`,
    options: [
      { id: 'a', text: String.raw`$5\,\mu F$` },
      { id: 'b', text: String.raw`$1.2\,\mu F$` },
      { id: 'c', text: String.raw`$1\,\mu F$` },
      { id: 'd', text: String.raw`$6\,\mu F$` },
    ],
    answer: 'b',
    explain: String.raw`سری: $\frac1C = \frac12 + \frac13 = \frac56$ ⇒ $C = \frac65 = 1.2\,\mu F$. نکته‌ی مهم: ظرفیت معادل در سری **همیشه از کوچک‌ترین خازن هم کمتر** است.`,
  }),
  validateQuestion({
    id: 'p3-capacitor-3',
    type: 'mcq',
    concepts: ['capacitor-energy'],
    prompt: String.raw`کدام گزینه درست است؟`,
    options: [
      { id: 'a', text: String.raw`$U = \frac12 CV^2$` },
      { id: 'b', text: String.raw`$U = \frac12 C V$` },
      { id: 'c', text: '$U = CV^2$' },
      { id: 'd', text: String.raw`$U = \frac{C}{V}$` },
    ],
    answer: 'a',
    explain: String.raw`انرژی خازن سه فرم معادل دارد: $U = \frac12 CV^2 = \frac12 QV = \frac{Q^2}{2C}$. اگر با دو تا غلط کنی، جواب نادرست می‌شود؛ مثلاً $\frac12 CV$ که بُعد انرژی ندارد.`,
  }),
  validateQuestion({
    id: 'p3-parallel-1',
    type: 'mcq',
    concepts: ['parallel-plate', 'capacitor'],
    prompt: String.raw`اگر در خازن صفحات موازی فاصله‌ی صفحات را نصف کنیم، ظرفیت چه می‌شود؟`,
    options: [
      { id: 'a', text: 'نصف می‌شود' },
      { id: 'b', text: 'دو برابر می‌شود' },
      { id: 'c', text: 'ثابت می‌ماند' },
      { id: 'd', text: 'چهار برابر می‌شود' },
    ],
    answer: 'b',
    explain: String.raw`$C = \kappa\varepsilon_0 A/d$ و $d$ در مخرج است ⇒ نصف شدن فاصله، ظرفیت را **دو برابر** می‌کند. برعکس، دو برابر کردن فاصله ظرفیت را نصف می‌کند.`,
  }),
];

export const concepts = [
  validateConcept(
    {
      id: 'electric-potential',
      part: 'part-3',
      title: 'پتانسیل و اختلاف پتانسیل',
      en: 'Electric Potential',
      sourceRefs: ['part-3#1'],
      origin: 'course',
      difficulty: 2,
      effort: 14,
      prereqs: ['electric-field'],
      keywords: ['پتانسیل', 'اختلاف پتانسیل', 'ولت', 'کار میدان', 'V'],
      intuition: String.raw`میدان الکتریکی به تو **نیرو** می‌گوید. پتانسیل به تو می‌گوید برای جابه‌جا کردن بار چقدر **کار** لازم است.

میدان الکتریکی روی بار نیرو وارد می‌کند و در نتیجه **کار** انجام می‌شود:

$$
W = \int \vec F \cdot d\vec s
$$

از آنجا که $\vec F = q\vec E$:

$$
W = q\int \vec E\cdot d\vec s
$$

اختلاف پتانسیل بین دو نقطه‌ی $A$ و $B$ را کار میدان بر **واحد بار مثبت** (با علامت منفی) تعریف می‌کنیم:

$$
\boxed{V_B - V_A = -\int_A^B \vec E\cdot d\vec s}
$$

پس پتانسیل یعنی: «انرژی لازم برای بردن یک کولن بار از $A$ به $B$، به‌ازای یک کولن».

دو نکته‌ی مهم:

۱. **پتانسیل نرده‌ای است**: نه جهت دارد، نه بردار. برخلاف میدان، نمی‌توانیم بگوییم «پتانسیل به سمتی می‌رود» — فقط مقدار دارد.

۲. **کار میدان به مسیر بستگی ندارد**. میدان الکتریکی یک میدان محافظ است (در فضای خالی)، پس کار میدان از مبدأ تا مقصد مستقل از مسیر است. به همین دلیل می‌شود یک «پتانسیل» تعریف کرد که فقط به موقعیت بستگی دارد.

واحد پتانسیل: ولت، که برابر است با ژول بر کولن:

$$
\text{Volt} = \frac{J}{C}
$$

یعنی یک ولت یعنی «انرژی یک ژول به ازای هر کولن بار».`,
      visual: {
        sim: 'gauss-lab',
        caption: 'پتانسیل روی محور یک بار مثبت (رنگ = سطح پتانسیل)',
        controls: ['بار', 'فاصله'],
        fallback: String.raw`به‌جای تصویر: پتانسیل را مثل «ارتفاع» روی یک نقشه‌ی توپوگرافی تصور کن. هرچه از بار دورتر شوی، پتانسیل یکنواخت پایین می‌آید (تا صفر در بی‌نهایت). میدان مثل شیب زمین است: جایی که نقشه تند پایین می‌رود، میدان قوی است.`,
      },
      formulas: [
        {
          name: 'اختلاف پتانسیل',
          en: 'Potential difference',
          latex: String.raw`V_B - V_A = -\int_A^B \vec E\cdot d\vec s`,
          symbols: [
            { sym: String.raw`V_A, V_B`, meaning: 'پتانسیل دو نقطه', unit: String.raw`$\text{V}$ (ولت)` },
            { sym: String.raw`d\vec s`, meaning: 'بردار جابه‌جایی مسیر', unit: 'm' },
          ],
          interpretation: String.raw`انرژی لازم برای بردن یک کولن بار از A به B (با علامت منفی چون میدان کار انجام می‌دهد).`,
          whenToUse: String.raw`وقتی کار میدان را می‌دانی یا می‌خواهی از میدان به پتانسیل بروی.`,
          whenNotToUse: String.raw`اگر میدان متغیر و پیچیده باشد و انتگرال نداشته باشی؛ آن‌جا مستقیم از فرمول بار نقطه‌ای استفاده کن.`,
          notes: [String.raw`علامت منفی یعنی میدان همیشه پتانسیل را در جهت خودش کم می‌کند.`],
        },
        {
          name: 'کار میدان',
          en: 'Work by the electric field',
          latex: String.raw`W = q\int \vec E\cdot d\vec s = -q\,\Delta V`,
          symbols: [{ sym: String.raw`q`, meaning: 'بار منتقل‌شده', unit: 'C' }],
          interpretation: String.raw`کار میدان بر بار برابر است با بار ضرب‌در کاهش پتانسیل.`,
          whenToUse: String.raw`برای حساب کار میدان یا انرژی یک بار در میدان.`,
          whenNotToUse: String.raw`برای کار یک نیروی غیرالکتریکی (مثل گرانش)؛ آن‌جا کارِ میدان الکتریکی نیست.`,
        },
      ],
      examples: [
        {
          title: 'پتانسیل یک میدان یکنواخت',
          problem: String.raw`میدان یکنواخت $E = 500\,\text{N/C}$ به سمت مثبت محور $x$ است. اختلاف پتانسیل بین $x=0$ و $x=4\,cm$ چقدر است؟`,
          steps: [
            { label: 'گام ۱ — مسیر را انتخاب کن', body: String.raw`مسیر افقی در راستای $x$.`},
            { label: 'گام ۲ — انتگرال', body: String.raw`$\int \vec E\cdot d\vec s = E\,\Delta x = 500\times0.04 = 20\,\text{V}$`},
            { label: 'گام ۳ — علامت', body: String.raw`$V_B - V_A = -20\,\text{V}$ یعنی پتانسیل در جهت میدان **کم** می‌شود. میدان همیشه از پتانسیل بالا به پایین است.`},
          ],
          answer: { latex: String.raw`\Delta V = -20\,\text{V}`, body: String.raw`یعنی حرکت در جهت میدان، ۲۰ ولت پتانسیل کم می‌کند.`},
          tip: String.raw`علامت را با جهت میدان چک کن: میدان در جهت کاهش پتانسیل است.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«پتانسیل مثل میدان، جهت دارد.»`, right: String.raw`پتانسیل **نرده‌ای** است: مقدار دارد، جهت ندارد. فقط میدان و نیرو برداری‌اند.` },
        { wrong: String.raw`«پتانسیل با فاصله مثل $1/r^2$ کم می‌شود.»`, right: String.raw`پتانسیل بار نقطه‌ای با $1/r$ کم می‌شود، نه $1/r^2$`},
      ],
      practice: ['p3-potential-1', 'p3-field-potential-1'],
      rescue: {
        prereq: 'electric-field',
        simpler: String.raw`پتانسیل = انرژی به‌ازای یک واحد بار. مثل ارتفاع در جاذبه: هرچه بالاتر، انرژی ذخیره‌شده بیشتر.`,
        visual: String.raw`در شبیه‌ساز گاوس (حالت سیم یا صفحه)، تصور کن پتانسیل مثل رنگ پس‌زمینه است: جایی تیره‌تر (بیشتر).`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک بار مثبت در میدان ثابت: اگر بار را خلاف جهت میدان ببری، کار انجام می‌دهی و پتانسیل **زیاد** می‌شود (سخت‌تر). اگر در جهت میدان ببری، کار انجام می‌دهد و پتانسیل **کم** می‌شود.`,
        },
      },
      related: [
        { id: 'point-charge-potential', why: 'فرمول ساده‌ی پتانسیل بار نقطه‌ای.' },
        { id: 'field-potential', why: 'رابطه‌ی میدان و پتانسیل (شیب).' },
      ],
      supplements: [
        {
          title: 'پتانسیل چرا «مهم» است؟ (تکمیلی)',
          body: String.raw`اگر فقط یک چیز از این پارت یادت بماند، این باشد: **پتانسیل با هم جمع می‌شود، میدان با هم جمع نمی‌شود.** برای هر بار جدا می‌نویسی $kq/r$ و فقط کلمه‌ها را با هم جمع می‌کنی — بدون نیاز به مؤلفه‌بندی برداری و تعیین زاویه. برای همین در مدارهای پیچیده و مسائل چندبار، پتانسیل را ترجیح می‌دهند.`,
        },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'point-charge-potential',
      part: 'part-3',
      title: 'پتانسیل بار نقطه‌ای',
      en: 'Potential of a Point Charge',
      sourceRefs: ['part-3#2'],
      origin: 'course',
      difficulty: 2,
      effort: 12,
      prereqs: ['electric-potential'],
      keywords: ['پتانسیل بار نقطه ای', 'V = kq/r', 'پتانسیل نرده ای', 'مرجع صفر'],
      intuition: String.raw`با قانون کولن به دست می‌آوریم که $E = kq/r^2$. حالا از تعریف پتانسیل انتگرال می‌گیریم:

$$
V = -\int_\infty^{r} E\, dr = -\int_\infty^{r} \frac{kq}{r'^2} dr' = \frac{kq}{r}
$$

پس:

$$
\boxed{V = \frac{kq}{r}}
$$

دو ویژگی مهم:

۱. **پتانسیل نرده‌ای است**: نه $\vec{V}$، فقط $V$. برخلاف میدان که بردار است.

۲. **وابستگی $1/r$** (نه $1/r^2$!). این تفاوت را به خاطر بسپار: میدان با $1/r^2$ کم می‌شود ولی پتانسیل با $1/r$.

مرجع صفر: پتانسیل در بی‌نهایت را صفر می‌گیریم ($V(\infty) = 0$). یعنی پتانسیل یعنی «انرژی لازم برای بردن یک کولن بار از بی‌نهایت به این نقطه».

برای چند بار، پتانسیل‌ها **جبری** (نرده‌ای) جمع می‌شوند:

$$
V = k\sum_i \frac{q_i}{r_i}
$$

این تنها جایی است که کار فیزیک را به‌شدت ساده می‌کند: لازم نیست جهت هر بردار را حساب کنی.`,
      visual: {
        sim: 'field-lab',
        caption: 'پتانسیل بار نقطه‌ای: سطح‌های هم‌پتانسیل (دایره‌های هم‌مرکز)',
        controls: ['بار', 'فاصله'],
        fallback: String.raw`به‌جای تصویر: سطح‌های هم‌پتانسیل یک بار نقطه‌ای **دایره** هستند (چون فقط به فاصله بستگی دارد). هرچه نزدیک‌تر، دایره‌ها نزدیک‌تر و پتانسیل بزرگ‌تر — یعنی «خطوط» جایی جمع می‌شوند، درست مثل خطوط ارتفاع روی نقشه.`,
      },
      formulas: [
        {
          name: 'پتانسیل بار نقطه‌ای',
          en: 'Potential of a point charge',
          latex: String.raw`V = \frac{kq}{r}`,
          symbols: [
            { sym: String.raw`V`, meaning: 'پتانسیل در فاصله‌ی $r$', unit: String.raw`$\text{V}$` },
            { sym: String.raw`k`, meaning: 'ثابت کولن' },
            { sym: String.raw`q`, meaning: 'بار نقطه‌ای', unit: 'C' },
            { sym: String.raw`r`, meaning: 'فاصله از بار', unit: 'm' },
          ],
          interpretation: String.raw`انرژی پتانسیل یک واحد بار در فاصله‌ی $r$ از بار نقطه‌ای.`,
          whenToUse: String.raw`برای یک بار نقطه‌ای؛ و برای جمع ساده‌ی چند بار.`,
          whenNotToUse: String.raw`برای بار توزیع‌شده به‌صورت پیوسته (باید انتگرال شود) و برای جایی که به **جهت** نیاز داری (آن‌جا میدان به کار می‌رود).`,
          rearrangements: [{ latex: String.raw`r = \frac{kq}{V}`, note: 'فاصله از روی پتانسیل' }],
          notes: [String.raw`پتانسیل نرده‌ای است (بدون بردار).`],
        },
      ],
      examples: [
        {
          title: 'پتانسیل یک بار',
          problem: String.raw`بار $q = 4\,\mu C$ در فاصله‌ی $r = 20\,cm$ چند ولت پتانسیل دارد؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`$V = kq/r = 8.99\times10^9\times4\times10^{-6}/0.2 = 1.8\times10^{5}\,\text{V}$`},
            { label: 'گام ۲ — مقایسه با میدان', body: String.raw`در همان فاصله، میدان $\sim 3.6\times10^{6}\,\text{N/C}$ است. نسبت میدان به پتانسیل برابر $r$ است ($E = V/r$) که یک چک خوب است.`},
          ],
          answer: { latex: String.raw`V \approx 180\,\text{kV}`, body: String.raw`پتانسیل بزرگ ولی قابل انتظار برای بار ماکروسکوپی.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«پتانسیل مثل میدان با $1/r^2$ کم می‌شود.»`, right: String.raw`پتانسیل با $1/r$ کم می‌شود. این مهم‌ترین تفاوت میدان و پتانسیل است.` },
        { wrong: String.raw`«پتانسیل همیشه مثبت است.»`, right: String.raw`برای بار مثبت مثبت و برای بار منفی منفی است. علامت پتانسیل، علامت بار است.` },
      ],
      practice: ['p3-potential-2'],
      rescue: {
        prereq: 'electric-potential',
        simpler: String.raw`همان قانون کولن، ولی به‌جای $1/r^2$ می‌نویسی $1/r$ و بدون علامت بردار.`,
        visual: String.raw`در شبیه‌ساز میدان، دایره‌های هم‌پتانسیل دور بار را تصور کن: فاصله ثابت از بار = پتانسیل ثابت.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`اگر $r$ را دو برابر کنی، $V$ **نصف** می‌شود (نه ربع). یک چک سریع برای تشخیص اشتباه.`,
        },
      },
      related: [
        { id: 'electric-potential', why: 'تعریف و کار میدان.' },
        { id: 'multi-potential', why: 'جمع پتانسیل چند بار (کار ساده می‌شود).' },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'multi-potential',
      part: 'part-3',
      title: 'پتانسیل چند بار نقطه‌ای',
      en: 'Potential of Several Point Charges',
      sourceRefs: ['part-3#3'],
      origin: 'course',
      difficulty: 2,
      effort: 10,
      prereqs: ['point-charge-potential'],
      keywords: ['جمع پتانسیل', 'superposition potential', 'پتانسیل چند بار', 'V=k sum'],
      intuition: String.raw`اگر چند بار نقطه‌ای داشته باشیم، پتانسیل کل در یک نقطه برابر **مجموع جبری** پتانسیل تک‌تک بارها است:

$$
\boxed{V = k\sum_i \frac{q_i}{r_i}}
$$

چرا این‌قدر ساده؟ چون پتانسیل نرده‌ای است: فقط عددها را با هم جمع می‌کنی. نه بردار داریم که مؤلفه‌بندی کنیم، نه زاویه‌ای که پیدا کنیم.

مقایسه‌ی مهم:

- **میدان**: $\vec E = \sum \vec E_i$ — جمع **برداری**، سخت (مؤلفه‌بندی، زاویه).
- **پتانسیل**: $V = \sum V_i$ — جمع **جبری**، آسان.

این مهم‌ترین دلیل ترجیح پتانسیل است. مثلاً اگر بخواهی بدانی کجای اتاق یک جسم رسانا می‌نشیند (هم‌پتانسیل)، پتانسیل را جمع می‌کنی و دنبال جایی می‌گردی که $V$ ثابت است — بدون هیچ زاویه‌ای.`,
      visual: {
        sim: 'field-lab',
        caption: 'جمع پتانسیل چند بار: فقط عددها را جمع کن',
        controls: ['بارها', 'نقطه‌ی محاسبه'],
        fallback: String.raw`به‌جای تصویر: برای هر بار یک عدد بنویس (پتانسیلش در نقطه‌ی موردنظر) و همه را جمع کن. اگر یکی منفی باشد، جمع را کم می‌کند. در پایان فقط **یک عدد** داری — برخلاف میدان که یک بردار است.`,
      },
      formulas: [
        {
          name: 'پتانسیل چند بار',
          en: 'Potential of multiple charges',
          latex: String.raw`V = k\sum_i \frac{q_i}{r_i}`,
          symbols: [{ sym: String.raw`r_i`, meaning: 'فاصله از بار iامین تا نقطه‌ی موردنظر', unit: 'm' }],
          interpretation: String.raw`جمع جبری پتانسیل تک‌بارها در نقطه.`,
          whenToUse: String.raw`برای پیدا کردن پتانسیل (نه جهت میدان) وقتی چند بار داری.`,
          whenNotToUse: String.raw`برای پیدا کردن جهت میدان؛ آن‌جا باید برداری جمع بزنی.`,
        },
      ],
      examples: [
        {
          title: 'پتانسیل در مرکز یک مربع',
          problem: String.raw`چهار بار $q$ روی رأس‌های مربع به ضلع $a=6\,cm$ هستند ($q=1\,\mu C$). پتانسیل در مرکز چقدر است؟`,
          steps: [
            { label: 'گام ۱ — فاصله تا مرکز', body: String.raw`فاصله‌ی هر رأس تا مرکز $r = a/\sqrt2 = 6/1.414 \approx 4.24\,cm$`},
            { label: 'گام ۲ — پتانسیل هر بار', body: String.raw`$V_i = kq/r$ برای هر چهار بار یکسان است.`},
            { label: 'گام ۳ — جمع', body: String.raw`$V = 4\times kq/r = 4\times8.99\times10^9\times10^{-6}/0.0424 \approx 8.5\times10^{5}\,\text{V}$`},
            { label: 'گام ۴ — مقایسه', body: String.raw`نکته: میدان در مرکز این مربع صفر است، ولی پتانسیل **صفر نیست**. چون پتانسیل جمع جبری است، نه برداری!`},
          ],
          answer: { latex: String.raw`V \approx 8.5\times10^{5}\,\text{V}`, body: String.raw`در حالی که میدان در همان نقطه صفر است.`},
          tip: String.raw`این مثال نشان می‌دهد چرا پتانسیل «جمع جبری» بودنش، هم قوی است و هم گمراه‌کننده: میدان صفر ولی پتانسیل بزرگ — چون پتانسیل، شمار «بار» می‌دهد نه «جهت» را.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«اگر میدان صفر باشد، پتانسیل هم صفر است.»`, right: String.raw`میدان برداری و می‌تواند خنثی شود؛ پتانسیل جبری و جمع‌پذیر است. در مرکز مربع هم میدان صفر ولی پتانسیل بزرگ است.` },
      ],
      practice: ['p3-multi-1'],
      rescue: {
        prereq: 'point-charge-potential',
        simpler: String.raw`عددها را با هم جمع کن — همین.`,
        visual: String.raw`در شبیه‌ساز میدان، نقطه‌ی آزمایشی را جابه‌جا کن و ببین چطور جمع پتانسیل‌ها تغییر می‌کند ولی هرگز جهت ندارد.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`دو بار با $V_1 = +100\,\text{V}$ و $V_2 = -40\,\text{V}$ در یک نقطه ⇒ پتانسیل کل $60\,\text{V}$ است.`,
        },
      },
      related: [
        { id: 'field-superposition', why: 'میدان همین جمع است ولی برداری — مقایسه‌اش کن.' },
        { id: 'potential-energy', why: 'از پتانسیل مستقیم به انرژی می‌رسی.' },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'potential-energy',
      part: 'part-3',
      title: 'انرژی پتانسیل الکتریکی',
      en: 'Electric Potential Energy',
      sourceRefs: ['part-3#4'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['electric-potential', 'multi-potential'],
      keywords: ['انرژی پتانسیل', 'U = qV', 'کار تفکیک', 'انرژی مثبت و منفی', 'کمینه انرژی'],
      intuition: String.raw`انرژی پتانسیل یک بار در میدان، از پتانسیل به دست می‌آید:

$$
U = qV
$$

برای دو بار نقطه‌ای، با جایگذاری $V = kq_2/r$:

$$
\boxed{U = \frac{kq_1q_2}{r}}
$$

حالا به علامت نگاه کن — این مهم‌ترین بخش مبحث است:

- اگر $q_1q_2 > 0$ (هم‌علامت): انرژی **مثبت**. این دو بار ذاتاً هم را پس می‌زنند؛ نزدیک کردنشان کار زیادی می‌برد ⇒ وضعیت پرانرژی.
- اگر $q_1q_2 < 0$ (غیرهم‌علامت): انرژی **منفی**. این دو بار هم را جذب می‌کنند؛ نزدیک کردنشان آسان است ⇒ وضعیت کم‌انرژی، پایدار.

در نتیجه **سیستم خودبه‌خود به سمت کمینه شدن انرژی پتانسیل می‌رود**:
- بارهای مخالف می‌روند نزدیک (انرژی منفی می‌شود).
- بارهای هم‌علامت می‌روند دور (انرژی کمتر می‌شود).

نکته‌ی ظریف: انرژی پتانسیل متعلق به **سیستم** (دو بار با هم) است، نه یک بار به‌تنهایی. گفتن «انرژی این بار فلان است» بدون ذکر میدانِ محیط، مبهم است.`,
      visual: {
        sim: 'field-lab',
        caption: 'انرژی پتانسیل: کمینه کجا است؟',
        controls: ['بارها', 'فاصله'],
        fallback: String.raw`به‌جای تصویر: انرژی را مثل «چاه» تصور کن. بارهای مخالف در چاه می‌افتند (انرژی منفی) و میل دارند نزدیک شوند. بارهای هم‌علامت روی تپه (انرژی مثبت) و میل دارند از هم فاصله بگیرند.`,
      },
      formulas: [
        {
          name: 'انرژی پتانسیل بار در میدان',
          en: 'Potential energy of a charge',
          latex: String.raw`U = qV`,
          symbols: [
            { sym: String.raw`U`, meaning: 'انرژی پتانسیل', unit: String.raw`$\text{J}$` },
            { sym: String.raw`q`, meaning: 'بار', unit: 'C' },
            { sym: String.raw`V`, meaning: 'پتانسیل در محل بار', unit: String.raw`$\text{V}$` },
          ],
          interpretation: String.raw`انرژی بار در میدان، برابر حاصل‌ضرب بار در پتانسیل محلش.`,
          whenToUse: String.raw`برای حساب انرژی یک بار در میدان تولیدشده توسط بارهای دیگر.`,
          whenNotToUse: String.raw`برای بار مرجع صفر ($q=0$) که انرژی ندارد؛ و برای میدان نامتحدو (که انرژی صفر می‌شود).`,
        },
        {
          name: 'انرژی پتانسیل دو بار',
          en: 'Interaction energy of two charges',
          latex: String.raw`U = \frac{kq_1q_2}{r}`,
          symbols: [{ sym: String.raw`q_1q_2`, meaning: 'حاصل‌ضرب دو بار؛ علامتش تعیین‌کننده است', unit: String.raw`$\text{C}^2$` }],
          interpretation: String.raw`انرژی تعاملی دو بار — هم‌علامت مثبت، مخالف منفی.`,
          whenToUse: String.raw`برای دو بار نقطه‌ای در کنار هم.`,
          whenNotToUse: String.raw`برای سه یا چهار بار (که باید جفت‌ها را جمع کرد، نه کل را).`,
        },
      ],
      examples: [
        {
          title: 'انرژی و کار تفکیک',
          problem: String.raw`دو بار $q_1 = 2\,\mu C$ و $q_2 = -3\,\mu C$ در فاصله‌ی $r = 10\,cm$ از هم‌اند. انرژی پتانسیل چقدر است و جداسازی آن‌ها تا فاصله‌ی بی‌نهایت چقدر کار می‌برد؟`,
          steps: [
            { label: 'گام ۱ — انرژی اولیه', body: String.raw`$U = kq_1q_2/r = 8.99\times10^9\times(2\times10^{-6})(-3\times10^{-6})/0.1 = -0.54\,\text{J}$`},
            { label: 'گام ۲ — انرژی نهایی', body: String.raw`در بی‌نهایت، $r \to \infty$ ⇒ $U \to 0$.`},
            { label: 'گام ۳ — کار لازم', body: String.raw`$W_{ext} = \Delta U = U_f - U_i = 0 - (-0.54) = +0.54\,\text{J}$. یعنی برای جدا کردنشان باید $0.54$ ژول کار کنی.`},
          ],
          answer: { latex: String.raw`U = -0.54\,\text{J},\quad W = +0.54\,\text{J}`, body: String.raw`جدا کردن بارهای مخالف همیشه کار مثبت می‌برد.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«انرژی پتانسیل همیشه مثبت است.»`, right: String.raw`برای بارهای مخالف **منفی** است. انرژی منفی یعنی «به‌طور طبیعی نزدیک‌اند و جداسازی‌شان کار می‌برد».` },
        { wrong: String.raw`«انرژی پتانسیل مال یک بار است.»`, right: String.raw`مال **سیستم** است. یک تنها بار در خلأ انرژی صفر دارد؛ انرژی از تعامل می‌آید.` },
      ],
      practice: ['p3-energy-1'],
      rescue: {
        prereq: 'electric-potential',
        simpler: String.raw`$U = qV$: انرژی = بار × پتانسیل. علامت $U$ را از علامت $q$ و $V$ بگیر.`,
        visual: String.raw`در شبیه‌ساز میدان، دو بار مخالف را ببین که میدانشان همدیگر را می‌کشد — نشانه‌ی انرژی منفی.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک بار مثبت در نزدیکی بار منفی: $q>0$ ولی $V<0$ ⇒ $U = qV < 0$. انرژی منفی، یعنی پایدار.`,
        },
      },
      related: [
        { id: 'electric-potential', why: 'رابطه‌ی $U = qV$.' },
        { id: 'capacitor-energy', why: 'همین انرژی، در خازن ذخیره می‌شود.' },
      ],
      examTips: [
        String.raw`برای دو بار: اول $U$ را حساب کن، بعد برای کار از $\Delta U$ استفاده کن ($W_{ext} = \Delta U$). این کار سریع‌تر از انتگرال گرفتن است.`,
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'field-potential',
      part: 'part-3',
      title: 'رابطه‌ی میدان و پتانسیل',
      en: 'Relation between E and V',
      sourceRefs: ['part-3#5'],
      origin: 'course',
      difficulty: 3,
      effort: 10,
      prereqs: ['electric-potential'],
      keywords: ['گرادیان پتانسیل', 'E = -dV/dx', 'میدان جهت کاهش پتانسیل', 'شیب'],
      intuition: String.raw`میدان و پتانسیل دو نگاه متفاوت به یک واقعیت‌اند:

$$
\boxed{\vec E = -\nabla V}
$$

در یک بعد:

$$
E = -\frac{dV}{dx}
$$

یعنی میدان، **شیب منفی** پتانسیل است. مثل نقشه‌ی ارتفاع: میدان مثل شیب زمین است و جایی که نقشه تند پایین می‌رود، شیب (میدان) قوی‌تر است.

سه نتیجه‌ی فوری و مهم:

۱. **میدان همیشه در جهت کاهش پتانسیل است.** اگر پتانسیل در جهتی سریع کم شود، میدان قوی است.

۲. اگر پتانسیل **ثابت** باشد ($dV/dx = 0$)، میدان صفر است. یعنی سطح هم‌پتانسیل جایی است که میدان ندارد. به همین دلیل سطح یک جسم رسانا **هم‌پتانسیل** است: بارها آزاد درون آن جابه‌جا می‌شوند تا میدان داخل صفر شود.

۳. برای بار نقطه‌ای می‌دانیم که $V = kq/r$، پس مستقیم می‌توانیم میدان را از پتانسیل به دست بیاوریم: $E = -dV/dr = +kq/r^2$ (با علامت درست).`,
      visual: {
        sim: 'field-lab',
        caption: 'شیب پتانسیل = میدان',
        controls: ['بار', 'فاصله'],
        fallback: String.raw`به‌جای تصویر: پتانسیل را مثل ارتفاع روی نقشه تصور کن. جایی که ارتفاع تندتر پایین می‌رود (شیب تند)، میدان قوی‌تر است. جایی که ارتفاع ثابت است (مسطح صاف)، میدان صفر است.`,
      },
      formulas: [
        {
          name: 'رابطه‌ی میدان و پتانسیل',
          en: 'Field from potential',
          latex: String.raw`\vec E = -\nabla V,\qquad E = -\frac{dV}{dx}`,
          symbols: [{ sym: String.raw`\nabla V`, meaning: 'گرادیان پتانسیل (شیب آن)', unit: String.raw`$\text{V/m}$` }],
          interpretation: String.raw`میدان، شیب منفی پتانسیل است: همیشه در جهت کاهش پتانسیل.`,
          whenToUse: String.raw`وقتی $V$ را می‌دانی و $E$ را می‌خواهی، یا برای فهم جهت میدان از روی نقشه‌ی پتانسیل.`,
          whenNotToUse: String.raw`وقتی فقط $|E|$ را می‌خواهی و $V$ را نداری؛ آن‌جا از فرمول مستقیم استفاده کن.`,
        },
      ],
      examples: [
        {
          title: 'استخراج میدان از پتانسیل بار نقطه‌ای',
          problem: String.raw`میدان یک بار نقطه‌ای را از روی پتانسیلش پیدا کنید.`,
          steps: [
            { label: 'گام ۱', body: String.raw`$V(r) = kq/r$ ⇒ $\frac{dV}{dr} = -kq/r^2$`},
            { label: 'گام ۲ — اعمال رابطه', body: String.raw`$E_r = -dV/dr = +kq/r^2$ ⇒ همان فرمول قانون کولن، با علامت مثبت برای بار مثبت (رو به بیرون).`},
          ],
          answer: { latex: String.raw`E = \frac{kq}{r^2}`, body: String.raw`دقیقاً همان نتیجه — این نشان می‌دهد دو راه به یک جواب می‌رسند.`},
        },
        {
          title: 'سطح هم‌پتانسیل',
          problem: String.raw`روی سطح یک جسم رسانای باردار، میدان الکتریکی چقدر است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`اگر داخل جسم میدان صفر باشد، پتانسیل همه‌جای داخل جسم ثابت است ($E = -dV/dx = 0 \Rightarrow V = \text{const}$).`},
            { label: 'گام ۲', body: String.raw`یعنی سطح جسم رسا هم‌پتانسیل است و بار فقط روی **سطح** جسم توزیع می‌شود، نه داخل.`},
          ],
          answer: { body: String.raw`سطح جسم رسا یک سطح هم‌پتانسیل است — دلیل اینکه بارهای اضافی بیرون می‌روند.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«$\vec E = \nabla V$ (بدون علامت منفی).»`, right: String.raw`علامت منفی لازم است تا میدان در جهت **کاهش** پتانسیل باشد. بدون آن، جهت میدان غلط می‌شود.` },
        { wrong: String.raw`«میدان صفر یعنی پتانسیل صفر.»`, right: String.raw`میدان صفر یعنی پتانسیل **ثابت** است (نه صفر). مثلاً داخل یک جسم رسای باردار: پتانسیل ثابت ولی بزرگ.` },
      ],
      practice: ['p3-field-potential-1'],
      rescue: {
        prereq: 'electric-potential',
        simpler: String.raw`میدان = شیب پتانسیل، با علامت منفی. نقشه‌ی ارتفاع را تصور کن.`,
        visual: String.raw`در شبیه‌ساز میدان، جایی که پیکان‌ها بلندترند، پتانسیل سریع‌تر افت می‌کند — یعنی شیب تندتر.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`پتانسیل: $V_1 = 10\,\text{V}$ در $x=0$ و $V_2 = 6\,\text{V}$ در $x=0.1\,m$ ⇒ $E = -(6-10)/0.1 = +40\,\text{V/m}$ (رو به $+x$).`,
        },
      },
      related: [
        { id: 'electric-potential', why: 'تعریف پتانسیل.' },
        { id: 'capacitor', why: 'سطح هم‌پتانسیل، پایه‌ی درک خازن است.' },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'capacitor',
      part: 'part-3',
      title: 'خازن و ظرفیت',
      en: 'Capacitor and Capacitance',
      sourceRefs: ['part-3#6'],
      origin: 'course',
      difficulty: 2,
      effort: 10,
      prereqs: ['electric-field'],
      keywords: ['خازن', 'ظرفیت', 'C = Q/V', 'فاراد', 'دو رسانا', 'عایق'],
      intuition: String.raw`خازن وسیله‌ای است برای **ذخیره‌ی بار و انرژی الکتریکی**. ساختمان ساده‌ی آن: **دو رسانا** که با یک لایه‌ی عایق یا دی‌الکتریک از هم جدا شده‌اند.

ایده: بار $+Q$ روی یک رسا و $-Q$ روی دیگری می‌نشیند. این بارها یک **میدان الکتریکی** بین دو صفحه درست می‌کنند (دقیقاً مثل میدان یک خازن صفحات موازی). کاری که برای جداسازی بارها لازم است در انرژی ذخیره می‌شود.

مهم‌ترین کمیت: **ظرفیت** (Capacitance):

$$
\boxed{C = \frac{Q}{V}}
$$

یعنی: به‌ازای هر ولت اختلاف پتانسیل، چند کولن بار ذخیره می‌شود. ظرفیت یک ویژگی **هندسی و مادی** خازن است (به مساحت، فاصله و جنس دی‌الکتریک بستگی دارد)، نه به بار یا ولتاژ.

واحد ظرفیت: **فاراد** ($\text{F}$). تعریف: یک فاراد یعنی خازنی که با یک ولت، **یک کولن** بار ذخیره می‌کند. (فاریدهای واقعی بسیار کوچک‌اند: میکروفاراد، نانوفاراد، پیکوفاراد.)

نکته‌ی بسیار مهم: **ظرفیت ثابت است.** با زیاد کردن ولتاژ، بار به همان نسبت زیاد می‌شود — این همان مفهومی است که پارت ۴ (مدارها) بر پایه‌اش ساخته می‌شود.`,
      visual: {
        sim: 'capacitor-lab',
        caption: 'دو صفحه با بار +Q و −Q؛ خازن دارد انرژی ذخیره می‌کند',
        controls: ['ولتاژ', 'بار'],
        fallback: String.raw`به‌جای تصویر: دو صفحه‌ی فلزی را تصور کن که با یک لایه‌ی نازک عایق از هم فاصله دارند. بار مثبت روی یکی و منفی روی دیگری می‌نشیند و **بینشان** میدان برقرار می‌شود (نه بیرون). اگر یکی را وصل کنی به مثبت و دیگری را به منفی، بارها جمع می‌شوند و انرژی ذخیره می‌شود.`,
      },
      formulas: [
        {
          name: 'ظرفیت خازن',
          en: 'Capacitance',
          latex: String.raw`C = \frac{Q}{V}`,
          symbols: [
            { sym: String.raw`C`, meaning: 'ظرفیت', unit: String.raw`$\text{F}$ (فاراد)` },
            { sym: String.raw`Q`, meaning: 'بار روی یک صفحه', unit: 'C' },
            { sym: String.raw`V`, meaning: 'اختلاف پتانسیل دو صفحه', unit: String.raw`$\text{V}$` },
          ],
          interpretation: String.raw`ظرفیت یعنی «برای هر ولت، چند کولن جا می‌شود».`,
          whenToUse: String.raw`برای تبدیل بین بار و ولتاژ یک خازن.`,
          whenNotToUse: String.raw`وقتی می‌خواهی ظرفیت را از **هندسه** پیدا کنی (آن‌جا فرمول $C = \varepsilon_0 A/d$ لازم است).`,
          rearrangements: [
            { latex: String.raw`Q = CV`, note: 'بار از روی ولتاژ' },
            { latex: String.raw`V = \frac{Q}{C}`, note: 'ولتاژ از روی بار' },
          ],
        },
      ],
      examples: [
        {
          title: 'خواندن ظرفیت از روی برچسب',
          problem: String.raw`روی یک خازن نوشته $10\,\mu F$ و $16\,V$. حداکثر باری که می‌تواند ذخیره کند چقدر است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`$Q = CV = 10\times10^{-6}\times16 = 1.6\times10^{-4}\,\text{C} = 160\,\mu C$`},
            { label: 'گام ۲', body: String.raw`یعنی حدود $10^{15}$ الکترون ذخیره می‌شود. این نشان می‌دهد خازن‌ها چقدر «بزرگ» از نظر تعداد ذره هستند.`},
          ],
          answer: { latex: String.raw`Q_{max} = 1.6\times10^{-4}\,\text{C}`, body: String.raw`یا $160\,\mu C$.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«ظرفیت با زیاد شدن ولتاژ زیاد می‌شود.»`, right: String.raw`ظرفیت **ثابت** است و به هندسه بستگی دارد. با زیاد شدن ولتاژ فقط بار ($Q = CV$) زیاد می‌شود.` },
        { wrong: String.raw`«برچسب $10\,\mu F$ یعنی ولتاژ $10$ است.»`, right: String.raw`برچسب ظرفیت است ($\mu F = $ میکروفاراد). ولتاژ مجاز جداگانه نوشته می‌شود (مثل $16\,V$).` },
      ],
      practice: ['p3-capacitor-3'],
      rescue: {
        prereq: 'electric-field',
        simpler: String.raw`خازن = ظرفی برای بار. $C = Q/V$ یعنی «چقدر بار به ازای هر ولت».`,
        visual: String.raw`در شبیه‌ساز خازن، دو صفحه را ببین که با تغییر $d$ (فاصله) به هم نزدیک و دور می‌شوند — و عدد $C$ زنده عوض می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`یک سطل با دهانه‌ی بزرگ‌تر، زودتر پر می‌شود: $C$ مثل «دهانه‌ی سطل» و $V$ مثل «ارتفاع» است.`,
        },
      },
      related: [
        { id: 'parallel-plate', why: 'فرمول هندسی ظرفیت.' },
        { id: 'capacitor-energy', why: 'انرژی ذخیره‌شده در همین خازن.' },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'parallel-plate',
      part: 'part-3',
      title: 'خازن صفحات موازی',
      en: 'Parallel-Plate Capacitor',
      sourceRefs: ['part-3#7', 'part-3#10'],
      origin: 'course',
      difficulty: 3,
      effort: 14,
      prereqs: ['capacitor', 'plane-field'],
      keywords: ['خازن صفحات موازی', 'C = eps0 A/d', 'دی الکتریک', 'کاپا', 'kappa'],
      intuition: String.raw`ظرفیت یک خازن صفحات موازی را می‌توان مستقیم از میدان بین دو صفحه به دست آورد.

میدان بین دو صفحه‌ی بزرگ موازی (با بار سطحی $\sigma$) برابر است با $E = \sigma/\varepsilon_0$ (از پارت ۲). ولتاژ بین دو صفحه، در فاصله‌ی $d$:

$$
V = Ed
$$

بار روی یک صفحه: $Q = \sigma A$. پس:

$$
C = \frac{Q}{V} = \frac{\sigma A}{Ed} = \frac{\sigma A}{(\sigma/\varepsilon_0)d} = \boxed{\frac{\varepsilon_0 A}{d}}
$$

اگر بین صفحات **دی‌الکتریک** با ضریب $\kappa$ بگذاری، میدان داخل $E = \sigma/(\kappa\varepsilon_0)$ می‌شود و در نتیجه:

$$
\boxed{C = \frac{\kappa\varepsilon_0 A}{d}}
$$

پس دی‌الکتریک دقیقاً **ضریب** ظرفیت را $\kappa$ برابر می‌کند:

$$
C = \kappa C_0
$$

نکته‌ی شهودی: دی‌الکتریک مولکول‌هایش را قطبی می‌کند و لایه‌هایی از میدان را **خلاف** جهت میدان اصلی می‌سازند. این میدانِ مخالف، اختلاف پتانسیل را کم می‌کند ⇒ برای همان بار، ولتاژ کمتر ⇒ ظرفیت بیشتر.`,
      visual: {
        sim: 'capacitor-lab',
        caption: 'خازن صفحات موازی: با کم کردن فاصله، ظرفیت بالا می‌رود',
        controls: ['مساحت A', 'فاصله d', 'دی‌الکتریک κ'],
        fallback: String.raw`به‌جای تصویر: دو صفحه‌ی بزرگ با فاصله‌ی کم. میدان بینشان یکنواخت است (پارت ۲). با کم کردن فاصله، ولتاژ ($V = Ed$) کم می‌شود در حالی که بار ثابت می‌ماند ⇒ $C = Q/V$ بزرگ می‌شود. با دی‌الکتریک هم میدان داخل کم می‌شود ⇒ باز هم $C$ بزرگ‌تر.`,
      },
      formulas: [
        {
          name: 'ظرفیت خازن صفحات موازی',
          en: 'Parallel-plate capacitance',
          latex: String.raw`C = \frac{\varepsilon_0 A}{d},\qquad C = \frac{\kappa\varepsilon_0 A}{d} = \kappa C_0`,
          symbols: [
            { sym: String.raw`A`, meaning: 'مساحت صفحات (روی‌هم‌افتاده)', unit: String.raw`$\text{m}^2$` },
            { sym: String.raw`d`, meaning: 'فاصله‌ی صفحات', unit: 'm' },
            { sym: String.raw`\kappa`, meaning: 'ضریب دی‌الکتریک ماده', unit: 'بی‌بُعد' },
            { sym: String.raw`C_0`, meaning: 'ظرفیت بدون دی‌الکتریک', unit: 'F' },
          ],
          interpretation: String.raw`ظرفیت با مساحت **زیاد** و فاصله‌ی **کم** بالا می‌رود؛ دی‌الکتریک آن را در ضریب $\kappa$ ضرب می‌کند.`,
          whenToUse: String.raw`برای خازن‌های تخت با ابعاد در حد میلی‌متر که $d \ll$ عرض صفحه.`,
          whenNotToUse: String.raw`وقتی $d$ قابل‌مقایسه با ابعاد صفحه است (اثر لبه) یا برای خازن استوانه‌ای/کروی.`,
          rearrangements: [
            { latex: String.raw`d = \frac{\kappa\varepsilon_0 A}{C}`, note: 'فاصله‌ی لازم برای ظرفیت مشخص' },
          ],
          notes: [
            String.raw`واحدها را یکدست کن: $A$ متر مربع، $d$ متر. اگر با $\text{cm}$ و $\text{mm}$ کار می‌کنی، تبدیل لازم است ($1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$).`,
            String.raw`مثال‌های واقعی: $\kappa$ شیشه حدود $5$–$10$، سرامیک حدود $100$ و بالاتر.`,
          ],
        },
      ],
      examples: [
        {
          title: 'اثر فاصله و دی‌الکتریک',
          problem: String.raw`خازنی با $A = 20\,\text{cm}^2$، $d = 2\,mm$، بدون دی‌الکتریک. (الف) ظرفیت را پیدا کنید. (ب) اگر فاصله نصف شود چه می‌شود؟ (ج) اگر به‌جای خلأ، دی‌الکتریک با $\kappa = 6$ بگذاریم؟`,
          steps: [
            { label: 'گام ۱ — تبدیل واحد', body: String.raw`$A = 20\times10^{-4}\,\text{m}^2 = 2\times10^{-3}\,\text{m}^2$، $d = 2\times10^{-3}\,\text{m}$`},
            { label: 'گام ۲ — ظرفیت', body: String.raw`$C_0 = \varepsilon_0 A/d = 8.85\times10^{-12}\times2\times10^{-3}/(2\times10^{-3}) = 8.85\times10^{-12}\,\text{F} = 8.85\,\text{pF}$`},
            { label: 'گام ۳ — نصف کردن فاصله', body: String.raw`$C = \varepsilon_0 A/(d/2) = 2C_0 = 17.7\,\text{pF}$ (دو برابر).`},
            { label: 'گام ۴ — دی‌الکتریک', body: String.raw`$C = \kappa C_0 = 6\times8.85 = 53.1\,\text{pF}$`},
          ],
          answer: { latex: String.raw`C_0 \approx 8.85\,\text{pF},\quad C = 17.7\,\text{pF},\quad C_\kappa \approx 53.1\,\text{pF}`, body: String.raw`ترتیب: دی‌الکتریک معمولاً بیشترین اثر را دارد، بعد فاصله.`},
          tip: String.raw`همیشه $\mu\text{F}$، $\text{nF}$، $\text{pF}$ را از هم تشخیص بده: $1\,\text{nF} = 1000\,\text{pF}$. جابه‌جا کردن این‌ها، رایج‌ترین اشتباه عددی است.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«ظرفیت به بار وابسته است.»`, right: String.raw`ظرفیت فقط به **هندسه و ماده** بستگی دارد: $A$, $d$, $\kappa$. بار و ولتاژ در فرمول نمی‌آیند.` },
        { wrong: String.raw`«دی‌الکتریک میدان بین صفحات را قوی‌تر می‌کند.»`, right: String.raw`برعکس: میدان را **ضعیف‌تر** می‌کند ($\kappa$ برابر کمتر) و در نتیجه ظرفیت بیشتر می‌شود.` },
      ],
      practice: ['p3-capacitor-1', 'p3-parallel-1'],
      rescue: {
        prereq: 'capacitor',
        simpler: String.raw`$C = \varepsilon_0 A/d$: مساحت بزرگ و فاصله‌ی کم = ظرفیت بزرگ. دی‌الکتریک هم در $\kappa$ ضرب می‌شود.`,
        visual: String.raw`در شبیه‌ساز خازن، فاصله‌ی صفحات را کم کن و ببین عدد $C$ چطور بالا می‌رود، و رنگ دی‌الکتریک چطور $C$ را بیشتر می‌کند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`فاصله نصف ⇒ $C$ دو برابر. دی‌الکتریک ۴ برابر ⇒ $C$ چهار برابر. دوتا با هم: $C$ هشت برابر.`,
        },
      },
      related: [
        { id: 'capacitor', why: 'تعریف ظرفیت.' },
        { id: 'plane-field', why: 'میدان بین دو صفحه، پشت‌زمینه‌ی این فرمول است.' },
        { id: 'capacitor-energy', why: 'انرژی ذخیره‌شده در این خازن.' },
      ],
      supplements: [
        {
          title: 'خازن‌های واقعی (تکمیلی)',
          body: String.raw`خازن‌های واقعی همیشه دو لایه‌ی فلزی خمیده (یا لوله‌ای) دارند تا سطح $A$ خیلی بزرگ شود. اگر بخواهی $C = 1\,\text{F}$ بسازی با فاصله‌ی $1\,mm$، باید مساحت حدود $100\,000\,\text{m}^2$ باشد — یعنی یک **زمین** کامل. به همین دلیل خازن‌های واقعی میکروفاراد و نانوفاراد هستند.`,
        },
      ],
      examTips: [
        String.raw`تبدیل واحدها را دو بار چک کن: $\text{cm}^2 \to \text{m}^2$ ضریب $10^{-4}$ دارد و $mm \to m$ ضریب $10^{-3}$.`,
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'capacitor-energy',
      part: 'part-3',
      title: 'انرژی ذخیره‌شده در خازن',
      en: 'Energy Stored in a Capacitor',
      sourceRefs: ['part-3#8'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['capacitor', 'parallel-plate'],
      keywords: ['انرژی خازن', 'U = 1/2 CV^2', 'کار شارژ', 'ذخیره انرژی'],
      intuition: String.raw`برای شارژ کردن خازن باید بار را «هل» بدهی و این کار در خازن ذخیره می‌شود.

کار لازم برای آوردن بار $dq$ به ولتاژ $V$: $dW = V\,dq$. با $Q = CV$ و $V = Q/C$ انتگرال می‌گیریم:

$$
U = \int_0^Q \frac{q}{C}\,dq = \frac{Q^2}{2C}
$$

با جایگذاری $Q = CV$ به سه فرم معادل می‌رسیم:

$$
\boxed{U = \frac12 CV^2 = \frac12 QV = \frac{Q^2}{2C}}
$$

**نکته‌ی مهم و شهودی:** در فرم $U = \frac12 QV$ ضریب $\frac12$ هست چون ولتاژ در طول شارژ **از صفر زیاد می‌شود**؛ یعنی ولتاژ متوسط نصف ولتاژ نهایی است. اگر این $\frac12$ را ننویسی، انرژی را دو برابر حساب کرده‌ای.

یک نکته‌ی ظریف: اگر خازن را در **ولتاژ ثابت** نگه داری (مثلاً با یک باتری)، انرژی ذخیره‌شده با $V^2$ بالا می‌رود. ولی انرژی کلِ منبع (باتری) با $V^2$ هم بالا می‌رود — نصفش در خازن ذخیره و نصفش گرما می‌شود.`,
      visual: {
        sim: 'capacitor-lab',
        caption: 'با ولتاژ بیشتر، انرژی ذخیره‌شده به‌سرعت رشد می‌کند',
        controls: ['ولتاژ', 'ظرفیت'],
        fallback: String.raw`به‌جای تصویر: خازن را مثل یک فنر فشرده تصور کن. هرچه بیشتر فشرده (ولتاژ بیشتر)، انرژی ذخیره‌شده به‌شدت بیشتر است (م quadratically).`,
      },
      formulas: [
        {
          name: 'انرژی خازن',
          en: 'Energy stored in a capacitor',
          latex: String.raw`U = \frac{1}{2}CV^2 = \frac{1}{2}QV = \frac{Q^2}{2C}`,
          symbols: [
            { sym: String.raw`U`, meaning: 'انرژی ذخیره‌شده', unit: String.raw`$\text{J}$` },
            { sym: String.raw`V`, meaning: 'ولتاژ دو سر خازن', unit: String.raw`$\text{V}$` },
          ],
          interpretation: String.raw`انرژی الکتریکی محبوس بین دو صفحه‌ی خازن.`,
          whenToUse: String.raw`برای حساب انرژی یا زمان تخلیه‌ی یک خازن.`,
          whenNotToUse: String.raw`برای خازنی که در حال شارژ با منبع ثابت است — باید کار منبع ($QV$) را در نظر بگیری، نه فقط انرژی خازن.`,
          notes: [
            String.raw`ضریب $\frac12$ از این می‌آید که ولتاژ در حین شارژ خطی از صفر زیاد می‌شود؛ ولتاژ متوسط نصف نهایی است.`,
            String.raw`با $V^2$ رشد می‌کند: دو برابر شدن ولتاژ، **چهار** برابر شدن انرژی می‌دهد — مثل انفجار.`,
          ],
        },
      ],
      examples: [
        {
          title: 'انرژی یک خازن واقعی',
          problem: String.raw`خازن $470\,\mu F$ با ولتاژ $16\,V$. انرژی و بار آن را پیدا کنید.`,
          steps: [
            { label: 'گام ۱ — انرژی', body: String.raw`$U = \frac12 CV^2 = \frac12\times470\times10^{-6}\times256 \approx 0.060\,J$`},
            { label: 'گام ۲ — بار', body: String.raw`$Q = CV = 470\times10^{-6}\times16 = 7.5\times10^{-3}\,\text{C}$`},
            { label: 'گام ۳ — بچه‌خنده‌بازی', body: String.raw`این انرژی $60$ میلی‌ژول است — به اندازه‌ی یک ضربه‌ی کوچک، ولی اگر تخلیه‌ی سریع شود، **خیلی خطرناک**.`},
          ],
          answer: { latex: String.raw`U \approx 0.060\,\text{J},\quad Q = 7.5\,\text{mC}`, body: String.raw`در $Q$ ذخیره شده — همین خازن در بدن شما هم هست (خازن‌های قلب).`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«$U = CV^2$ (بدون $\frac12$).»`, right: String.raw`ضریب $\frac12$ اجباری است؛ ولتاژ در حین شارژ از صفر شروع می‌شود. فراموش کردنش، انرژی را دو برابر می‌کند.` },
        { wrong: String.raw`«با دو برابر شدن ولتاژ، انرژی دو برابر می‌شود.»`, right: String.raw`با $V^2$ است: دو برابر شدن ولتاژ ⇒ **چهار** برابر شدن انرژی.` },
      ],
      practice: ['p3-capacitor-3'],
      rescue: {
        prereq: 'capacitor',
        simpler: String.raw`انرژی ذخیره‌شده با $V^2$ زیاد می‌شود. ضریب $\frac12$ را نگه دار — به خاطر شروع از صفر.`,
        visual: String.raw`در شبیه‌ساز خازن، ولتاژ را زیاد کن و ببین $U$ چقدر سریع‌تر از خود ولتاژ رشد می‌کند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`$C$ ثابت، $V \to 2V$: انرژی $\to 4U$.`,
        },
      },
      related: [
        { id: 'capacitor', why: 'رابطه‌ی $Q$ و $V$.' },
        { id: 'potential-energy', why: 'همین انرژی، از انرژی پتانسیل می‌آید.' },
      ],
    },
    'part-3',
  ),

  validateConcept(
    {
      id: 'capacitor-combination',
      part: 'part-3',
      title: 'خازن‌های سری و موازی',
      en: 'Capacitors in Series and Parallel',
      sourceRefs: ['part-3#9'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['capacitor'],
      keywords: ['خازن سری', 'خازن موازی', 'C_eq', 'بار تقسیم', 'ولتاژ تقسیم'],
      intuition: String.raw`وقتی چند خازن را به هم وصل می‌کنی، **ظرفیت معادل** می‌سازی. ولی بسته به نوع اتصال، رابطه فرق می‌کند.

**موازی**: هر دو خازن به دو سر یک منبع وصل‌اند.

- ولتاژ همه برابر است: $V = V_1 = V_2$
- بارها **تقسیم** می‌شوند: $Q = Q_1 + Q_2 = (C_1+C_2)V$
- پس: $C_{eq} = C_1 + C_2 + \cdots$ — یعنی ظرفیت‌ها را **جمع** کن.

**سری**: خازن‌ها پشت‌سرهم وصل‌اند.

- بار همه **برابر** است: $Q = Q_1 = Q_2$ (بار واردشده به یکی، از آخری خارج می‌شود)
- ولتاژ **تقسیم** می‌شود: $V = V_1 + V_2$
- پس: $V = Q/C_1 + Q/C_2 = Q(1/C_1 + 1/C_2)$ یعنی $\frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2}$

نکته‌ی مهم: در سری، $C_{eq}$ **همیشه از کوچک‌ترین خازن هم کمتر** است (مثل مقاومت‌های سری که جمع می‌شوند، اما اینجا معکوس). در موازی، $C_{eq}$ از بزرگ‌ترین خازن هم بزرگ‌تر است.`,
      visual: {
        sim: 'capacitor-lab',
        caption: 'سری و موازی: ولتاژ یا بار تقسیم می‌شود',
        controls: ['نوع اتصال', 'مقادیر خازن‌ها'],
        fallback: String.raw`به‌جای تصویر: **موازی** = چند بطری کنار هم روی یک میز ⇒ هر بطری پرتر و ظرفیت (حجم) کل بیشتر. **سری** = چند بطری پشت‌سرهم که فقط بطری اول پر می‌شود ⇒ حجم کل کمتر از هر کدام.`,
      },
      formulas: [
        {
          name: 'خازن‌های موازی',
          en: 'Capacitors in parallel',
          latex: String.raw`C_{eq} = C_1 + C_2 + \cdots,\qquad V = V_1 = V_2`,
          symbols: [{ sym: String.raw`C_{eq}`, meaning: 'ظرفیت معادل', unit: 'F' }],
          interpretation: String.raw`ولتاژ یکسان؛ ظرفیت‌ها جمع می‌شوند.`,
          whenToUse: String.raw`وقتی می‌خواهی ظرفیت را **زیاد** کنی (مثل رادیوی ماشین).`,
          whenNotToUse: String.raw`وقتی می‌خواهی ولتاژ تقسیم شود — این کار را سری انجام می‌دهد.`,
        },
        {
          name: 'خازن‌های سری',
          en: 'Capacitors in series',
          latex: String.raw`\frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2} + \cdots,\qquad Q = Q_1 = Q_2`,
          symbols: [{ sym: String.raw`Q`, meaning: 'بار مشترک روی هر خازن', unit: 'C' }],
          interpretation: String.raw`بار یکسان؛ ولتاژ تقسیم می‌شود؛ ظرفیت معادل کوچک‌تر است.`,
          whenToUse: String.raw`وقتی می‌خواهی ولتاژ را تقسیم کنی یا ظرفیت کوچک لازم داری.`,
          whenNotToUse: String.raw`برای افزایش ظرفیت (که کار موازی است).`,
          notes: [String.raw`در سری، انرژی کل تقسیم بر تعداد خازن‌ها نمی‌شود؛ ولتاژ تقسیم می‌شود (بسته به مقدار هر $C$).`],
        },
      ],
      examples: [
        {
          title: 'مقایسه‌ی سری و موازی',
          problem: String.raw`سه خازن $2\,\mu F$، $3\,\mu F$ و $6\,\mu F$ را (الف) موازی و (ب) سری وصل می‌کنیم. ظرفیت معادل هر حالت چقدر است؟`,
          steps: [
            { label: 'گام ۱ — موازی', body: String.raw`$C_{eq} = 2+3+6 = 11\,\mu F$`},
            { label: 'گام ۲ — سری', body: String.raw`$\frac{1}{C} = \frac12+\frac13+\frac16 = \frac{6}{6} \Rightarrow C = 1\,\mu F$`},
            { label: 'گام ۳ — چک منطقی', body: String.raw`$C_{سری} = 1\,\mu F$ از کوچک‌ترین خازن ($2$) هم کمتر است ✔ و $C_{موازی} = 11$ از بزرگ‌ترین ($6$) هم بیشتر است ✔. هر دو معقول‌اند.`},
          ],
          answer: { latex: String.raw`C_{موازی} = 11\,\mu F,\qquad C_{سری} = 1\,\mu F`, body: String.raw`موازی بزرگ، سری کوچک — همیشه.`},
          tip: String.raw`برای سری، گاهی راحت‌تر است از «معکوس» حساب کنی: $\frac{1}{C_{eq}} = \frac{1}{C_1}+\frac{1}{C_2}$ و بعد معکوس بگیری.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«سری مثل موازی است، فقط ظرفیت‌ها جمع می‌شوند.»`, right: String.raw`سری، **معکوسِ** ظرفیت‌ها جمع می‌شود و ظرفیت معادل کوچک‌تر است. این تفاوت، رایج‌ترین اشتباه این مبحث است.` },
        { wrong: String.raw`«بار در سری تقسیم می‌شود.»`, right: String.raw`در سری بار **یکسان** است ($Q = Q_1 = Q_2$) و ولتاژ تقسیم می‌شود؛ در موازی برعکس.` },
      ],
      practice: ['p3-capacitor-2'],
      rescue: {
        prereq: 'capacitor',
        simpler: String.raw`موازی: ظرفیت‌ها را جمع کن. سری: معکوس ظرفیت‌ها را جمع کن و برعکس بگیر.`,
        visual: String.raw`در شبیه‌ساز خازن، بین «موازی» و «سری» جابه‌جا شو و ببین $C_{eq}$ چطور حساب و نمایش داده می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`دو خازن $2$ و $8$: موازی $\Rightarrow 10$؛ سری $\Rightarrow \frac{2\times8}{2+8} = 1.6$. سری همیشه کوچک‌تر از کوچک‌ترین است.`,
        },
      },
      related: [
        { id: 'capacitor', why: 'تعریف پایه.' },
        { id: 'circuits-series-parallel', why: 'همین منطق، اما برای مقاومت‌ها در پارت ۴ (با معکوس شدن).' },
      ],
      examTips: [
        String.raw`قانون سریِ خازن‌ها = قانون موازیِ مقاومت‌ها. هر دو «معکوس» جمع می‌شوند. این تطبیق، حفظ کردن را ساده می‌کند.`,
      ],
    },
    'part-3',
  ),
];