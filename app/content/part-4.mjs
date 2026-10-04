import { validateConcept, validateQuestion } from './schema.mjs';

export const questions = [
  validateQuestion({
    id: 'p4-current-1',
    type: 'numeric',
    concepts: ['current'],
    prompt: String.raw`در $t = 2\,s$، بار $Q = 6\,C$ از یک مقطع عبور می‌کند. جریان چند آمپر است؟`,
    answer: 3,
    unit: 'A',
    tolerance: 0.001,
    explain: String.raw`$I = Q/t = 6/2 = 3\,A$. جهت قراردادی جریان، جهت حرکت بار **مثبت** است — در فلز، یعنی خلاف حرکت الکترون‌ها.`,
  }),
  validateQuestion({
    id: 'p4-drift-1',
    type: 'mcq',
    concepts: ['drift-velocity'],
    prompt: String.raw`چرا سرعت رانشی الکترون‌ها در یک سیم فلزی بسیار کم است؟`,
    options: [
      { id: 'a', text: 'چون الکترون‌ها انرژی کمی دارند' },
      { id: 'b', text: 'چون بیشتر حرکت الکترون‌ها تصادفی و خنثی‌شونده است و فقط یک مولفه‌ی کوچک در راستای میدان باقی می‌ماند' },
      { id: 'c', text: 'چون میدان الکتریکی سیم صفر است' },
      { id: 'd', text: 'چون الکترون‌ها جرم ندارند' },
    ],
    answer: 'b',
    explain: String.raw`الکترون‌ها در دمای اتاق با سرعت‌های بسیار زیاد ولی **تصادفی** حرکت می‌کنند (این گرمای سیم است). میدان فقط یک مؤلفه‌ی کوچک و هم‌جهت اضافه می‌کند که «سرعت رانشی» نام دارد — معمولاً کمتر از $1\,mm/s$، در حالی که سرعت تصادفی حدود $10^6\,m/s$ است.`,
  }),
  validateQuestion({
    id: 'p4-ohm-1',
    type: 'numeric',
    concepts: ['resistance'],
    prompt: String.raw`مقاومتی $220\,\Omega$ روی دو سرش $11\,V$ افت ولتاژ دارد. جریان از آن چند میلی‌آمپر است؟`,
    answer: 50,
    unit: 'mA',
    tolerance: 0.005,
    explain: String.raw`$I = V/R = 11/220 = 0.05\,A = 50\,mA$. قانون اهم یعنی نمودار $V$ بر حسب $I$ خطی است: مقاومت ثابت (اهمی) یعنی شیب خط ثابت.`,
  }),
  validateQuestion({
    id: 'p4-resistivity-1',
    type: 'mcq',
    concepts: ['resistivity'],
    prompt: String.raw`یک سیم را از وسط ببریم و دو نیمه را به هم بچسبانیم. مقاومت کل تقریباً چه می‌شود؟`,
    options: [
      { id: 'a', text: 'نصف' },
      { id: 'b', text: 'همان (چون مقاومت ویژه و مساحت عوض نشده‌اند)' },
      { id: 'c', text: 'دو برابر' },
      { id: 'd', text: 'ربع' },
    ],
    answer: 'b',
    explain: String.raw`با دو برابر شدن طول، دو نیمه را **سری** کنیم و مقاومت‌ها جمع می‌شوند: $R = \rho(L/2)/A \times 2 = \rho L/A$. پس بریدن و چسباندن سیم، مقاومت را تغییر نمی‌دهد.`,
  }),
  validateQuestion({
    id: 'p4-power-1',
    type: 'mcq',
    concepts: ['power'],
    prompt: String.raw`کدام رابطه‌ی توان درست است؟`,
    options: [
      { id: 'a', text: String.raw`$P = \frac{V}{R}$` },
      { id: 'b', text: String.raw`$P = I^2R$ و $P = \frac{V^2}{R}$` },
      { id: 'c', text: String.raw`$P = \frac{R}{I}$` },
      { id: 'd', text: String.raw`$P = \frac{I}{V}$` },
    ],
    answer: 'b',
    explain: String.raw`سه فرم معادل: $P = VI = I^2R = V^2/R$. نکته: هرکدام را که انتخاب کنی، باید «معلوم بودن» کمیت‌ها را در نظر بگیری: اگر $R$ و $V$ را داری از فرم $V^2/R$ و اگر $R$ و $I$ را داری از فرم $I^2R$ استفاده کن.`,
  }),
  validateQuestion({
    id: 'p4-kirchhoff-1',
    type: 'mcq',
    concepts: ['kirchhoff'],
    prompt: String.raw`قانون گره‌ی کیرشهف چه می‌گوید؟`,
    options: [
      { id: 'a', text: 'مجموع جریان‌های واردشونده به یک گره برابر مجموع جریان‌های خارج‌شونده است' },
      { id: 'b', text: 'مجموع ولتاژها در یک حلقه صفر است' },
      { id: 'c', text: 'مقاومت‌های سری جمع می‌شوند' },
      { id: 'd', text: 'توان مصرفی ثابت است' },
    ],
    answer: 'a',
    explain: String.raw`قانون اول کیرشهف (گره): $\sum I = 0$ با علامت. قانون دوم (حلقه): $\sum \Delta V = 0$. اولی از بقای بار و دومی از بقای انرژی می‌آید.`,
  }),
  validateQuestion({
    id: 'p4-rc-1',
    type: 'mcq',
    concepts: ['rc-circuit'],
    prompt: String.raw`در مدار RC، در لحظه‌ی $t = \tau = RC$ چند درصد شارژ انجام شده است؟`,
    options: [
      { id: 'a', text: '۵۰٪' },
      { id: 'b', text: 'حدود ۶۳٪' },
      { id: 'c', text: 'حدود ۳۷٪' },
      { id: 'd', text: '۱۰۰٪' },
    ],
    answer: 'b',
    explain: String.raw`$V_C = \varepsilon(1-e^{-t/RC})$؛ در $t = \tau$ داریم $e^{-1}\approx0.368$ ⇒ شارژ $1-0.368 = 63.2\%$. عدد طلایی مدار RC همین **۶۳٪** است (و در تخلیه ۳۷٪ باقی می‌ماند).`,
  }),
  validateQuestion({
    id: 'p4-emf-1',
    type: 'mcq',
    concepts: ['emf'],
    prompt: String.raw`چرا ولتاژ ترمینال یک باتری کمتر از نیروی محرکه‌ی آن است؟`,
    options: [
      { id: 'a', text: 'چون مقاومت داخلی دارد و بخشی از ولتاژ روی آن می‌افتد' },
      { id: 'b', text: 'چون باتری خالی است' },
      { id: 'c', text: 'چون سیم‌ها مقاومت دارند' },
      { id: 'd', text: 'چون جریان خیلی زیاد است' },
    ],
    answer: 'a',
    explain: String.raw`$V = \varepsilon - Ir$: بخشی از انرژی نیروی محرکه در مقاومت داخلی $r$ تلف می‌شود. وقتی مدار باز است ($I=0$)، $V = \varepsilon$ است.`,
  }),
  validateQuestion({
    id: 'p4-series-1',
    type: 'mcq',
    concepts: ['circuits-series-parallel'],
    prompt: String.raw`دو مقاومت $6\,\Omega$ و $3\,\Omega$ **موازی** وصل شده‌اند. مقاومت معادل چقدر است؟`,
    options: [
      { id: 'a', text: String.raw`$9\,\Omega$` },
      { id: 'b', text: String.raw`$2\,\Omega$` },
      { id: 'c', text: String.raw`$1.8\,\Omega$` },
      { id: 'd', text: String.raw`$4.5\,\Omega$` },
    ],
    answer: 'b',
    explain: String.raw`$\frac{1}{R} = \frac16 + \frac13 = \frac12$ ⇒ $R = 2\,\Omega$. موازی همیشه از کوچک‌ترین مقاومت هم کوچک‌تر است ✔ (۲ < ۳).`,
  }),
];

export const concepts = [
  validateConcept(
    {
      id: 'current',
      part: 'part-4',
      title: 'جریان الکتریکی',
      en: 'Electric Current',
      sourceRefs: ['part-4#1'],
      origin: 'course',
      difficulty: 1,
      effort: 10,
      prereqs: ['charge-atom', 'conductors'],
      keywords: ['جریان الکتریکی', 'آمپر', 'I = Q/t', 'جهت قراردادی', 'دQ/dt'],
      intuition: String.raw`جریان الکتریکی یعنی **میزان عبور بار از یک سطح در واحد زمان**:

$$
I = \frac{dQ}{dt}
$$

و اگر جریان ثابت باشد:

$$
\boxed{I = \frac{Q}{t}}
$$

واحد جریان: **آمپر** ($\text{A}$). یعنی یک آمپر = یک کولن در هر ثانیه.

نکته‌ی بسیار مهم: **جهت قراردادی جریان**، جهت حرکت بار **مثبت** است. در فلز، بارهای متحرک الکترون‌های **منفی**‌اند، پس جریان قراردادی **خلاف** حرکت واقعی الکترون‌هاست. این قرارداد از روزهای اول ثابت مانده و تغییرش نمی‌کند.

این یعنی وقتی در یک سیم جریان مثبت است، الکترون‌ها واقعاً به سمت دیگری در حرکت‌اند.

برای فهم بهتر: اگر یک آمپر یعنی «هر ثانیه یک کولن»، پس $I = 1\,A$ یعنی حدود $6\times10^{18}$ الکترون در ثانیه از مقطع عبور می‌کنند!`,
      visual: {
        sim: 'drift-lab',
        caption: 'جریان: عبور بار از یک مقطع',
        controls: ['ولتاژ', 'سطح مقطع', 'چگالی حامل'],
        fallback: String.raw`به‌جای تصویر: یک لوله‌ی آب را تصور کن. جریان آب (لیتر بر ثانیه) همان جریان برق (کولن بر ثانیه) است. هرچه سطح لوله بزرگ‌تر باشد، با همان سرعت آب بیشتری رد می‌شود — درست مثل سطح مقطع سیم.`,
      },
      formulas: [
        {
          name: 'جریان الکتریکی',
          en: 'Electric current',
          latex: String.raw`I = \frac{dQ}{dt} \quad\Rightarrow\quad I = \frac{Q}{t} \ \text{(جریان ثابت)}`,
          symbols: [
            { sym: String.raw`I`, meaning: 'جریان', unit: String.raw`$\text{A}$ (آمپر)` },
            { sym: String.raw`Q`, meaning: 'بار عبوری', unit: 'C' },
            { sym: String.raw`t`, meaning: 'زمان', unit: String.raw`$\text{s}$` },
          ],
          interpretation: String.raw`نرخ عبور بار از یک مقطع؛ مثل لیتر بر ثانیه در یک لوله.`,
          whenToUse: String.raw`برای هر مسئله‌ای که با بار عبوری و زمان سروکار دارد.`,
          whenNotToUse: String.raw`وقتی با سرعت رانشی و چگالی حامل کار می‌کنی (آن‌جا از $I = nqv_dA$ استفاده می‌شود).`,
          notes: [String.raw`جهت قراردادی جریان = جهت بار مثبت = **خلاف** حرکت الکترون در فلز.`],
        },
      ],
      examples: [
        {
          title: 'جریان یک لامپ',
          problem: String.raw`لامپی $60\,W$ با ولتاژ $120\,V$. جریان آن چند آمپر است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`از رابطه‌ی توان: $I = P/V = 60/120 = 0.5\,A$`},
            { label: 'گام ۲ — حس فیزیکی', body: String.raw`نیم آمپر یعنی هر ثانیه $0.5$ کولن بار — یعنی حدود $3\times10^{18}$ الکترون در ثانیه، در حالی که هر الکترون خیلی آهسته راه می‌رود. این تصویر، فهم جریان را کامل می‌کند.`},
          ],
          answer: { latex: String.raw`I = 0.5\,\text{A}`, body: String.raw`جریان نیم آمپر.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«جریان یعنی الکترون‌ها سریع می‌دوند.»`, right: String.raw`جریان یعنی **تعداد** الکترون عبوری در واحد زمان. الکترون‌ها خیلی کند حرکت می‌کنند ولی تعدادشان آن‌قدر زیاد است که جریان قابل‌توجه باشد.` },
        { wrong: String.raw`«جریان در جهت حرکت الکترون‌هاست.»`, right: String.raw`قرارداد: جهت جریان = جهت بار **مثبت**؛ در فلز، خلاف حرکت الکترون‌ها.` },
      ],
      practice: ['p4-current-1'],
      rescue: {
        prereq: 'conductors',
        simpler: String.raw`جریان = بار بر زمان. مثل آب در لوله: لیتر بر ثانیه.`,
        visual: String.raw`در شبیه‌ساز سرعت رانشی، «ذرات» را در سیم ببین و عرض لوله (سطح مقطع) را عوض کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`اگر در یک ثانیه $3\,C$ بار عبور کند، $I = 3\,A$.`,
        },
      },
      related: [
        { id: 'drift-velocity', why: 'جریان از کجا می‌آید؟ الکترون‌های رانشی.' },
          { id: 'resistance', why: 'مقاومت، رابطه‌ی ولتاژ و جریان را می‌دهد.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'drift-velocity',
      part: 'part-4',
      title: 'چگالی جریان و سرعت رانشی',
      en: 'Current Density and Drift Velocity',
      sourceRefs: ['part-4#2', 'part-4#3'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['current'],
      keywords: ['چگالی جریان', 'سرعت رانشی', 'J = nqv_d', 'حامل بار', 'drift velocity'],
      intuition: String.raw`سؤال طبیعی بعد از «جریان چیست؟» این است: **از کجا** می‌آید؟ یعنی الکترون‌ها در سیم دقیقاً چه می‌کنند.

**سرعت رانشی**: در سیم، الکترون‌ها در حالت عادی (بدون میدان) حرکت **تصادفی** دارند (این گرمای سیم است). وقتی میدان الکتریکی برقرار می‌کنیم، یک **مولفه‌ی کوچک و هم‌جهت** به حرکت تصادفی اضافه می‌شود. به این مولفه‌ی خالص «سرعت رانشی» ($v_d$) می‌گویند.

نکته‌ی شگفت‌انگیز: $v_d$ **بسیار** کوچک است (کمتر از $1\,mm/s$)، در حالی که سرعت تصادفی الکترون حدود $10^6\,m/s$ است. پس چرا جریان قابل‌توجه است؟ چون تعداد الکترون‌های آزاد در حجم کوچک، **بسیار** زیاد است.

**چگالی جریان** ($J$): جریان بر واحد سطح مقطع:

$$
J = \frac{I}{A}
$$

و رابطه‌ی کلیدی با سرعت رانشی:

$$
\boxed{J = nqv_d}
$$

که $n$ تعداد حامل‌های بار در واحد حجم، $q$ بار هر حامل و $v_d$ سرعت رانشی است.

اگر بخواهی سرعت رانشی را از جریان پیدا کنی:

$$
v_d = \frac{I}{nqA}
$$

این رابطه به تو می‌گوید: اگر سطح مقطع سیم را کم کنی (سیم نازک‌تر)، سرعت رانشی **زیاد** می‌شود (برای همان جریان).`,
      visual: {
        sim: 'drift-lab',
        caption: 'سرعت رانشی بسیار کم، ولی تعداد الکترون‌ها بسیار زیاد',
        controls: ['چگالی حامل n', 'سطح مقطع A', 'ولتاژ'],
        fallback: String.raw`به‌جای تصویر: یک سیم را مثل یک صف شطرنج پر از مهره‌های ریز تصور کن. هر مهره یک الکترون است که با سرعت تصادفی بالا می‌پرد اما آرام‌آرام به سمتی می‌خزد. سرعت خزید خیلی کم است، ولی میلیون‌ها مهره هم‌زمان می‌خزند و جریان می‌سازند.`,
      },
      formulas: [
        {
          name: 'چگالی جریان',
          en: 'Current density',
          latex: String.raw`J = \frac{I}{A} \quad \text{واحد: } \text{A/m}^2`,
          symbols: [
            { sym: String.raw`J`, meaning: 'چگالی جریان', unit: String.raw`$\text{A/m}^2$` },
            { sym: String.raw`A`, meaning: 'سطح مقطع سیم', unit: String.raw`$\text{m}^2$` },
          ],
          interpretation: String.raw`جریان به‌ازای هر متر مربع از مقطع سیم.`,
          whenToUse: String.raw`برای سیم‌هایی که سطح مقطع در طولشان ثابت نیست، یا برای مقایسه‌ی چگالی جریان در مواد مختلف.`,
          whenNotToUse: String.raw`برای سیم نازک و یکنواخت، جریان $I$ به‌تنهایی کافی است.`,
        },
        {
          name: 'رابطه‌ی چگالی جریان و سرعت رانشی',
          en: 'Relation of J and drift velocity',
          latex: String.raw`J = nqv_d \quad\Rightarrow\quad I = nqv_dA \quad\Rightarrow\quad v_d = \frac{I}{nqA}`,
          symbols: [
            { sym: String.raw`n`, meaning: 'چگالی تعداد حامل‌های بار', unit: String.raw`$\text{m}^{-3}$` },
            { sym: String.raw`q`, meaning: 'بار هر حامل', unit: 'C' },
            { sym: String.raw`v_d`, meaning: 'سرعت رانشی', unit: String.raw`$\text{m/s}$` },
          ],
          interpretation: String.raw`جریان از «تعداد حامل‌ها × بارشان × سرعت حرکتشان × سطح» ساخته می‌شود.`,
          whenToUse: String.raw`برای محاسبه‌ی سرعت رانشی یا توضیح اینکه چرا سیم نازک‌تر جریان بیشتری با همان ولتاژ می‌گیرد.`,
          whenNotToUse: String.raw`در فلزات که $n$ تقریباً ثابت است؛ جایی که $n$ با میدان تغییر می‌کند (مثل گاز یا نیمه‌رسانا در حالت‌های خاص).`,
        },
      ],
      examples: [
        {
          title: 'سرعت رانشی یک سیم مسی',
          problem: String.raw`سیم مسی با سطح مقطع $A = 2\,mm^2$، جریان $I = 5\,A$ دارد. سرعت رانشی الکترون‌ها را پیدا کنید ($n \approx 8.5\times10^{28}\,m^{-3}$).`,
          steps: [
            { label: 'گام ۱ — تبدیل سطح', body: String.raw`$A = 2\times10^{-6}\,\text{m}^2$، $q = 1.6\times10^{-19}\,\text{C}$`},
            { label: 'گام ۲ — فرمول', body: String.raw`$v_d = I/(nqA) = 5/(8.5\times10^{28}\times1.6\times10^{-19}\times2\times10^{-6})$`},
            { label: 'گام ۳ — عدد', body: String.raw`$v_d \approx 1.8\times10^{-4}\,\text{m/s} = 0.18\,mm/s$`},
            { label: 'گام ۴ — تفسیر', body: String.raw`یعنی هر الکترون فقط $0.18$ میلی‌متر در ثانیه جابه‌جا می‌شود! ولی چون $8.5\times10^{28}$ الکترون در هر متر مکعب هست، جریان محسوس می‌شود.`},
          ],
          answer: { latex: String.raw`v_d \approx 1.8\times10^{-4}\,\text{m/s}`, body: String.raw`حدود $0.2\,mm/s$.`},
          tip: String.raw`این مثال نشان می‌دهد چرا «سرعت برق» یک باور غلط است: برق مثل «جریان سیال» سریع است، ولی الکترون‌های آن مثل «ریگ‌های آهسته» حرکت می‌کنند.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«الکترون‌ها با میدان سریع می‌دوند.»`, right: String.raw`سرعت رانشی بسیار کم است؛ اکثر حرکت الکترون تصادفی است. میدان فقط یک مولفه‌ی کوچک اضافه می‌کند.` },
        { wrong: String.raw`«سرعت رانشی به سطح مقطع سیم ربطی ندارد.»`, right: String.raw`برای جریان ثابت، $v_d = I/(nqA)$ پس با کم شدن $A$، سرعت رانشی **زیاد** می‌شود.` },
      ],
      practice: ['p4-drift-1'],
      rescue: {
        prereq: 'current',
        simpler: String.raw`جریان = تعداد الکترون‌های عبوری در ثانیه. الکترون‌ها کند راه می‌روند ولی بی‌نهایت زیادند.`,
        visual: String.raw`در شبیه‌ساز سرعت رانشی، عرض سیم (سطح مقطع) را کم کن و ببین چگونه سرعت رانشی و جریان تغییر می‌کنند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`اگر سطح مقطع را نصف کنی و همان جریان را بخواهی، سرعت رانشی دو برابر می‌شود.`,
        },
      },
      related: [
        { id: 'current', why: 'جریان چیست و از کجا می‌آید.' },
          { id: 'resistivity', why: 'سطح مقطع، یکی از پارامترهای مقاومت است.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'resistance',
      part: 'part-4',
      title: 'مقاومت و قانون اهم',
      en: 'Resistance and Ohm’s Law',
      sourceRefs: ['part-4#4', 'part-4#5'],
      origin: 'course',
      difficulty: 2,
      effort: 12,
      prereqs: ['current', 'electric-field'],
      keywords: ['مقاومت', 'قانون اهم', 'اهم', 'V = IR', 'نمودار'],
      intuition: String.raw`مقاومت یک رسانا یعنی «مقاومت او در برابر عبور جریان». تعریف رسمی:

$$
\boxed{R = \frac{V}{I}}
$$

واحد مقاومت: **اهم** ($\Omega$). یعنی مقاومت $1\,\Omega$ وقتی است که با $1\,V$ اختلاف پتانسیل، $1\,A$ جریان بگیرد.

**قانون اهم**: برای بسیاری از رساناها (به‌ویژه فلزات با دمای ثابت)، رابطه‌ی $V$ و $I$ خطی است:

$$
\boxed{V = IR}
$$

یعنی اگر نمودار $V$ بر حسب $I$ را بکشی، یک **خط مستقیم** از مبدأ می‌گذرد و شیب آن همان مقاومت است.

نکته‌ی ظریف: «مقاومت» یک ویژگی از **شیء** است (در دمای معین)، اما «مقاومت الکتریکی» یک ماده‌ی مشخص یعنی **همان مقاومت ثابت** است. در فلزات، مقاومت تقریباً با دما ثابت است (تا دماهای خیلی بالا) — و همین است که «مقاومت اهمی» را می‌سازد.`,
      visual: {
        sim: 'circuit-lab',
        caption: 'نمودار V بر حسب I خطی است: قانون اهم',
        controls: ['مقاومت‌ها', 'نیروی محرکه'],
        fallback: String.raw`به‌جای تصویر: مقاومت مثل لوله‌ای با تنگ‌شدگی است. هرچه تنگ‌تر، جریان کمتر برای همان اختلاف فشار (ولتاژ). قانون اهم می‌گوید این رابطه خطی و ثابت است — مخصوصاً برای فلزات.`,
      },
      formulas: [
        {
          name: 'تعریف مقاومت',
          en: 'Definition of resistance',
          latex: String.raw`R = \frac{V}{I}`,
          symbols: [
            { sym: String.raw`R`, meaning: 'مقاومت', unit: String.raw`$\Omega$ (اهم)` },
            { sym: String.raw`V`, meaning: 'اختلاف پتانسیل دو سر', unit: String.raw`$\text{V}$` },
            { sym: String.raw`I`, meaning: 'جریان', unit: String.raw`$\text{A}$` },
          ],
          interpretation: String.raw`مقاومت یعنی «برای هر آمپر جریان، چند ولت لازم است».`,
          whenToUse: String.raw`برای حساب مقاومت از روی ولتاژ و جریان، یا برای یکی از آن دو از روی دیگری.`,
          whenNotToUse: String.raw`برای رساناهای غیر اهمی (مثل دیود) که رابطه خطی نیست.`,
          rearrangements: [
            { latex: String.raw`I = \frac{V}{R}`, note: 'جریان از ولتاژ' },
            { latex: String.raw`V = IR`, note: 'قانون اهم' },
          ],
        },
      ],
      examples: [
        {
          title: 'محاسبه‌ی مقاومت از نمودار',
          problem: String.raw`یک رسانا $3\,A$ جریان در $12\,V$ می‌گیرد. مقاومت آن چقدر است و اگر ولتاژ $20\,V$ شود جریان چقدر می‌شود؟`,
          steps: [
            { label: 'گام ۱ — مقاومت', body: String.raw`$R = V/I = 12/3 = 4\,\Omega$`},
            { label: 'گام ۲ — جریان جدید', body: String.raw`$I = V/R = 20/4 = 5\,A$`},
          ],
          answer: { latex: String.raw`R = 4\,\Omega,\quad I = 5\,\text{A}`, body: String.raw`با ثابت بودن مقاومت، ولتاژ و جریان با هم متناسب‌اند.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«مقاومت به ولتاژ وابسته است.»`, right: String.raw`برای یک مقاومت اهمی در دمای ثابت، $R$ ثابت است؛ ولتاژ و جریان با هم تغییر می‌کنند، نه $R$.` },
        { wrong: String.raw`«هر رسانایی از قانون اهم پیروی می‌کند.»`, right: String.raw`فلزات در دمای ثابت اهمی‌اند. نیمه‌رساناها، دیودها و لامپ‌ها اهمی **نیستند** (نمودارشان خطی نیست).` },
      ],
      practice: ['p4-ohm-1'],
      rescue: {
        prereq: 'current',
        simpler: String.raw`$R = V/I$: مقاومت یعنی «هر آمپر، چند ولت». قانون اهم فقط می‌گوید این نسبت ثابت است.`,
        visual: String.raw`در شبیه‌ساز مدار، مقاومت‌ها را سری و موازی ببین و اثرشان را روی جریان حس کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`مقاومت $10\,\Omega$ با $5\,V$: $I = 0.5\,A$.`,
        },
      },
      related: [
        { id: 'current', why: 'جریان، یکی از دو کمیت قانون اهم.' },
          { id: 'resistivity', why: 'مقاومت ویژه، مقاومت هندسی را تعیین می‌کند.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'resistivity',
      part: 'part-4',
      title: 'مقاومت ویژه و اثر دما',
      en: 'Resistivity and Temperature',
      sourceRefs: ['part-4#6', 'part-4#7'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['resistance'],
      keywords: ['مقاومت ویژه', 'rho', 'R = rho L/A', 'دما', 'ضریب دمایی', 'آلیاژ'],
      intuition: String.raw`مقاومت یک سیم به سه چیز بستگی دارد: **جنس**، **طول** و **سطح مقطع**. برای جدا کردن سهم جنس، کمیت **مقاومت ویژه** (Resistivity, $\rho$) را تعریف می‌کنیم: مقاومت یک متر از سیم با سطح مقطع یک متر مربع.

$$
\boxed{R = \rho\frac{L}{A}}
$$

پس: مقاومت با **طول** نسبت مستقیم و با **سطح مقطع** نسبت معکوس دارد. سیم بلندتر ⇒ مقاومت بیشتر. سیم ضخیم‌تر ⇒ مقاومت کمتر.

واحد مقاومت ویژه: $\Omega\cdot m$.

مقاومت‌های نوعی: مس ($\rho \approx 1.7\times10^{-8}$)، آلومینیوم ($\approx 2.7\times10^{-8}$)، آهن ($\approx 10\times10^{-8}$)، و چیز جالب: **کربن** خیلی کم ($\approx 10^{-5}$). توجه کن که آلومینیوم از مس بزرگ‌تر است ولی در سیم‌کشی معمولاً از مس استفاده می‌شود چون سبک‌تر و ارزان‌تر است.

**اثر دما**: در فلزات، با افزایش دما، مقاومت **زیاد** می‌شود (یون‌ها بیشتر تکان می‌خورند و الکترون‌ها کندتر می‌شوند):

$$
\boxed{R = R_0[1 + \alpha(T - T_0)]}
$$

نکته: در **نیمه‌رساناها** برعکس است — با گرم شدن، مقاومت **کم** می‌شود. این تفاوت، پایه‌ی ساخت ترانزیستور و کار کردن آن است.`,
      visual: {
        sim: 'circuit-lab',
        caption: 'دما چطور مقاومت سیم را عوض می‌کند',
        controls: ['دما', 'مقاومت پایه'],
        fallback: String.raw`به‌جای تصویر: یک لوله‌ی آب را تصور کن که با گرم شدن آب، لزج‌تر (غلیظ‌تر) می‌شود و عبور آب سخت‌تر. مقاومت الکتریکی فلز هم مثل همین است: با گرم شدن، بیشتر می‌شود.`,
      },
      formulas: [
        {
          name: 'مقاومت یک سیم',
          en: 'Resistance of a wire',
          latex: String.raw`R = \rho\frac{L}{A}`,
          symbols: [
            { sym: String.raw`\rho`, meaning: 'مقاومت ویژه‌ی ماده', unit: String.raw`$\Omega\cdot m$` },
            { sym: String.raw`L`, meaning: 'طول سیم', unit: 'm' },
            { sym: String.raw`A`, meaning: 'سطح مقطع سیم', unit: String.raw`$\text{m}^2$` },
          ],
          interpretation: String.raw`مقاومت با طول زیاد و با سطح مقطع کم زیاد می‌شود.`,
          whenToUse: String.raw`وقتی ماده، طول و سطح مقطع سیم را می‌دانی.`,
          whenNotToUse: String.raw`برای مقاومت‌های ساختگی (که فقط یک مقدار عددی دارند) — آن‌جا $R$ داده می‌شود.`,
          rearrangements: [{ latex: String.raw`A = \rho\frac{L}{R}`, note: 'سطح مقطع لازم برای مقاومت مشخص' }],
        },
        {
          name: 'تغییر مقاومت با دما',
          en: 'Temperature dependence of resistance',
          latex: String.raw`R = R_0\left[1 + \alpha(T - T_0)\right]`,
          symbols: [
            { sym: String.raw`R_0`, meaning: 'مقاومت در دمای $T_0$', unit: String.raw`$\Omega$` },
            { sym: String.raw`\alpha`, meaning: 'ضریب دمایی مقاومت', unit: String.raw`$\text{K}^{-1}$` },
            { sym: String.raw`T, T_0`, meaning: 'دمای فعلی و دمای مرجع', unit: String.raw`$\text{K}$ یا $^\circ\text{C}$` },
          ],
          interpretation: String.raw`در فلزات با گرم شدن مقاومت زیاد می‌شود؛ در نیمه‌رساناها کم.`,
          whenToUse: String.raw`برای سیم‌های گرم (مثل هیتر) یا دمای متغیر محیط.`,
          whenNotToUse: String.raw`وقتی تغییر دما ناچیز است؛ آن‌جا $R \approx R_0$ کافی است.`,
          notes: [String.raw`دمای دو نقطه باید با یک مقیاس باشد؛ اختلاف $100\,K$ برابر $100\,^\circ C$ است.`],
        },
      ],
      examples: [
        {
          title: 'سیم بلند و داغ',
          problem: String.raw`سیم مسی $L = 50\,m$، $A = 2\,mm^2$ در دمای $20^\circ C$. (الف) مقاومت اولیه؟ (ب) در $120^\circ C$؟`,
          steps: [
            { label: 'گام ۱ — مقاومت اولیه', body: String.raw`$R_0 = \rho L/A = 1.7\times10^{-8}\times50/(2\times10^{-6}) \approx 0.43\,\Omega$`},
            { label: 'گام ۲ — دما', body: String.raw`برای مس $\alpha \approx 0.0039\,\text{K}^{-1}$.`},
            { label: 'گام ۳ — مقاومت داغ', body: String.raw`$R = 0.43[1 + 0.0039\times100] = 0.43\times1.39 \approx 0.59\,\Omega$`},
          ],
          answer: { latex: String.raw`R_0 \approx 0.43\,\Omega,\quad R(120^\circ C) \approx 0.59\,\Omega`, body: String.raw`افزایش ~۳۹٪ با گرم شدن $100\,K$.`},
          tip: String.raw`این اثر دلیل سیم‌کشی هیترهای برقی است: سیم داغ مقاومت بیشتری دارد و جریان محدود می‌شود — یک ترمستات طبیعی.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«با گرم شدن همه‌ی مواد مقاومتشان کم می‌شود.»`, right: String.raw`در **فلزات** مقاومت با گرم شدن **زیاد** می‌شود ($\alpha>0$)؛ در **نیمه‌رساناها** کم می‌شود ($\alpha<0$).` },
        { wrong: String.raw`«بریدن سیم مقاومتش را کم می‌کند.»`, right: String.raw`با نصف شدن طول، دو نیمه را سری می‌کنی و $R_{eq} = \rho(L/2)/A \times 2 = \rho L/A$: مقاومت **همان** می‌ماند.` },
      ],
      practice: ['p4-resistivity-1'],
      rescue: {
        prereq: 'resistance',
        simpler: String.raw`$R = \rho L/A$: بلندتر = مقاوم‌تر، ضخیم‌تر = رساناتر، و $\rho$ سهم جنس است.`,
        visual: String.raw`در شبیه‌ساز مدار، دما را بالا ببر و ببین مقاومت‌ها و جریان کل چطور تغییر می‌کنند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`سیم را دو برابر ضخیم کن (A دو برابر) ⇒ مقاومت **نصف** می‌شود.`,
        },
      },
      related: [
        { id: 'resistance', why: 'مقاومت تعریف و قانون اهم.' },
          { id: 'power', why: 'توان مصرفی $I^2R$ با دما زیاد می‌شود.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'power',
      part: 'part-4',
      title: 'توان الکتریکی',
      en: 'Electric Power',
      sourceRefs: ['part-4#8'],
      origin: 'course',
      difficulty: 2,
      effort: 12,
      prereqs: ['resistance'],
      keywords: ['توان', 'P = VI', 'P = I2R', 'P = V2/R', 'وات', 'مصرف'],
      intuition: String.raw`توان یعنی **میزان مصرف یا انتقال انرژی در واحد زمان**:

$$
P = \frac{W}{t}
$$

برای انرژی الکتریکی، با استفاده از قانون اهم سه فرم معادل به دست می‌آید:

$$
\boxed{P = VI = I^2 R = \frac{V^2}{R}}
$$

واحد: **وات** ($\text{W}$). یک وات یعنی یک ژول بر ثانیه.

هر فرم وقتی بهتر است که کمیت‌های **معلوم** را ببینی:
- $P = VI$: وقتی $V$ و $I$ را داری (مثلاً روی برچسب وسیله).
- $P = I^2R$: وقتی $I$ و $R$ را داری.
- $P = V^2/R$: وقتی $V$ و $R$ را داری.

نکته‌ی بسیار مهم (و اغلب امتحانی): اگر **ولتاژ ثابت** باشد و مقاومت را دو برابر کنی، با فرم $V^2/R$ توان **نصف** می‌شود؛ ولی اگر **جریان ثابت** باشد و مقاومت دو برابر شود، با فرم $I^2R$ توان **چهار برابر** می‌شود. پس باید اول ببینی کدام کمیت ثابت است!

مثال کلاسیک: یک هیتر برقی را روی ولتاژ $220\,V$ می‌گذاری. توان آن $P = V^2/R$ است. اگر مقاومت لامپ را (که با دما زیاد می‌شود) در نظر بگیری، همان $V^2/R$ توان اولیه را می‌دهد.`,
      visual: {
        sim: 'circuit-lab',
        caption: 'توان روی هر مقاومت',
        controls: ['مقاومت', 'جریان', 'ولتاژ'],
        fallback: String.raw`به‌جای تصویر: توان یعنی «چقدر انرژی در ثانیه تلف می‌شود». مقاومت بزرگ با جریان زیاد ⇒ گرم شدن شدید (مثل هیتر). مقاومت کوچک با جریان زیاد ⇒ سیم داغ (اتصال کوتاه، خطرناک).`,
      },
      formulas: [
        {
          name: 'توان الکتریکی',
          en: 'Electric power',
          latex: String.raw`P = \frac{W}{t} = VI = I^2R = \frac{V^2}{R}`,
          symbols: [
            { sym: String.raw`P`, meaning: 'توان', unit: String.raw`$\text{W}$ (وات)` },
            { sym: String.raw`W`, meaning: 'انرژی مصرفی', unit: String.raw`$\text{J}$` },
            { sym: String.raw`I, V, R`, meaning: 'جریان، ولتاژ، مقاومت', unit: String.raw`$\text{A},\,\text{V},\,\Omega$` },
          ],
          interpretation: String.raw`انرژی مصرفی در هر ثانیه — همان چیزی که به گرما تبدیل می‌شود.`,
          whenToUse: String.raw`برای مصرف برق یک وسیله یا گرمای تولیدی مقاومت‌ها.`,
          whenNotToUse: String.raw`وقتی هنوز نمی‌دانی کدام کمیت ثابت است — اول آن را مشخص کن (بالا توضیح داده شد).`,
          notes: [String.raw`با قانون اهم، هر سه فرم کاملاً معادل‌اند و هرکدام که داده‌هایت دارد را انتخاب کن.`],
        },
      ],
      examples: [
        {
          title: 'توان یک هیتر',
          problem: String.raw`هیتری با $V = 220\,V$ و $R = 100\,\Omega$. توان و جریان آن چقدر است؟`,
          steps: [
            { label: 'گام ۱ — توان', body: String.raw`$P = V^2/R = 220^2/100 = 484\,W$`},
            { label: 'گام ۲ — جریان', body: String.raw`$I = V/R = 220/100 = 2.2\,A$`},
            { label: 'گام ۳ — چک', body: String.raw`$VI = 220\times2.2 = 484\,W$ ✔`},
          ],
          answer: { latex: String.raw`P = 484\,\text{W},\quad I = 2.2\,\text{A}`, body: String.raw`هیتر حدود نیم کیلووات است — که در خانه‌های ما معمولی است.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«پیاده کردن یک لامپ ۶۰ وات با لامپ ۱۰۰ وات، جریان را دو برابر می‌کند.»`, right: String.raw`جریان با **توان** نسبت مستقیم دارد ($I = P/V$)، پس بله دو برابر. ولی اگر مقاومت لامپ را در نظر بگیری، رابطه با $R$ پیچیده‌تر می‌شود.` },
        { wrong: String.raw`«توان فقط با مقاومت تعیین می‌شود.»`, right: String.raw`توان به سه کمیت وابسته است؛ مهم این است که کدام ثابت است. اگر $V$ ثابت باشد، $R$ بزرگ‌تر یعنی توان کمتر ($V^2/R$).` },
      ],
      practice: ['p4-power-1'],
      rescue: {
        prereq: 'resistance',
        simpler: String.raw`$P = VI$ (وات = ولت × آمپر). بعد با قانون اهم، دو فرم دیگر به دست می‌آید.`,
        visual: String.raw`در شبیه‌ساز مدار، دمای هر مقاومت را نگاه کن: هرچه توان بیشتر، داغ‌تر.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`$10\,V$ روی $5\,\Omega$: $I = 2\,A$ و $P = 20\,W$.`,
        },
      },
      related: [
        { id: 'resistance', why: 'قانون اهم، سه فرم توان را می‌سازد.' },
          { id: 'emf', why: String.raw`باتری هم توان تولید می‌کند ($P = \varepsilon I$).` },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'circuits-series-parallel',
      part: 'part-4',
      title: 'مدارهای سری و موازی',
      en: 'Series and Parallel Circuits',
      sourceRefs: ['part-4#9'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['resistance', 'current'],
      keywords: ['مدار سری', 'مدار موازی', 'R_eq', 'تقسیم ولتاژ', 'تقسیم جریان'],
      intuition: String.raw`دو راه برای ترکیب مقاومت‌ها:

**سری**: مقاومت‌ها پشت‌سرهم. فقط **یک** راه برای عبور جریان ⇒ جریان همه یکی است:

$$
I = I_1 = I_2,\qquad V = V_1 + V_2 \Rightarrow \boxed{R_{eq} = R_1 + R_2 + \cdots}
$$

**موازی**: مقاومت‌ها کنار هم بین دو گره. هر شاخه ولتاژ یکسان دارد ⇒ ولتاژ تقسیم می‌شود:

$$
V = V_1 = V_2,\qquad I = I_1 + I_2 \Rightarrow \boxed{\frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2}}
$$

نتیجه‌ی مهم و چک‌پذیر:
- **سری**: $R_{eq}$ از بزرگ‌ترین هم بزرگ‌تر است (جمع).
- **موازی**: $R_{eq}$ از کوچک‌ترین هم کوچک‌تر است (معکوس).

مقایسه با خازن‌ها (پارت ۳) — یک نکته‌ی ظریف: خازن‌ها **برعکسِ** مقاومت‌ها رفتار می‌کنند. مقاومت سری جمع می‌شود، خازن سری «معکوس» جمع می‌شود. برای همین باید مراقب باشی قوانین را جابه‌جا نکنی.

مثال: اگر دو مقاومت متفاوت را سری و سپس موازی کنی، در سری بزرگ‌تر و در موازی کوچک‌تر می‌شود.`,
      visual: {
        sim: 'circuit-lab',
        caption: 'سری و موازی: جریان یا ولتاژ کجا ثابت است؟',
        controls: ['نوع اتصال', 'مقادیر مقاومت'],
        fallback: String.raw`به‌جای تصویر: سری = یک لوله‌ی باریک پشت‌سرهم (همه‌ی آب از یک مسیر ⇒ فشار تقسیم می‌شود). موازی = چند لوله‌ی موازی (فشار یکسان، ولی آب بیشتر).`,
      },
      formulas: [
        {
          name: 'مقاومت سری',
          en: 'Series resistance',
          latex: String.raw`R_{eq} = R_1 + R_2 + \cdots,\qquad I = \text{ثابت}`,
          symbols: [{ sym: String.raw`R_{eq}`, meaning: 'مقاومت معادل', unit: String.raw`$\Omega$` }],
          interpretation: String.raw`جریان یکسان، ولتاژ تقسیم می‌شود، مقاومت‌ها جمع می‌شوند.`,
          whenToUse: String.raw`وقتی مقاومت‌ها پشت‌سرهم‌اند (مثل لامپ‌های یک ریسمان).`,
          whenNotToUse: String.raw`وقتی شاخه‌ها موازی‌اند.`,
        },
        {
          name: 'مقاومت موازی',
          en: 'Parallel resistance',
          latex: String.raw`\frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots,\qquad V = \text{ثابت}`,
          symbols: [{ sym: String.raw`R_{eq}`, meaning: 'مقاومت معادل', unit: String.raw`$\Omega$` }],
          interpretation: String.raw`ولتاژ یکسان، جریان تقسیم می‌شود، مقاومت معادل کوچک‌تر است.`,
          whenToUse: String.raw`وقتی چند مصرف‌کننده را به یک منبع وصل می‌کنی (مثل لامپ‌های خانه که همه $220\,V$ می‌گیرند).`,
          whenNotToUse: String.raw`وقتی مقاومت‌ها سری‌اند.`,
          notes: [String.raw`برای دو مقاومت موازی می‌توان از میان‌بر $R_{eq} = \frac{R_1R_2}{R_1+R_2}$ استفاده کرد.`],
        },
      ],
      examples: [
        {
          title: 'ترکیب سه مقاومت',
          problem: String.raw`مقاومت‌های $4\,\Omega$، $6\,\Omega$ و $12\,\Omega$ را طوری وصل کن که اول $4$ را با $6$ **سری** و حاصل را با $12$ **موازی** کنیم. $R_{eq}$ چقدر است؟`,
          steps: [
            { label: 'گام ۱ — سری', body: String.raw`$R_1 = 4+6 = 10\,\Omega$`},
            { label: 'گام ۲ — موازی با ۱۲', body: String.raw`$\frac{1}{R} = \frac{1}{10}+\frac{1}{12} = \frac{11}{60}$ ⇒ $R = \frac{60}{11} \approx 5.45\,\Omega$`},
            { label: 'گام ۳ — چک', body: String.raw`$5.45 < 10$ ✔ (موازی همیشه کمتر از کوچک‌ترین شاخه).`},
          ],
          answer: { latex: String.raw`R_{eq} = \frac{60}{11} \approx 5.45\,\Omega`, body: String.raw`گام‌به‌گام، از درونی‌ترین اتصال شروع کن.`},
          tip: String.raw`در مسائل ترکیبی، همیشه از اتصالی شروع کن که **قطعی** سری یا موازی است.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«مقاومت موازی = مقاومت سری.»`, right: String.raw`موازی معکوس جمع می‌شود. همین باعث می‌شود $R_{eq}$ موازی همیشه از هر شاخه کوچک‌تر باشد.` },
        { wrong: String.raw`«در سری، ولتاژ بین هر مقاومت یکسان است.»`, right: String.raw`در سری **جریان** یکسان است؛ ولتاژ تقسیم می‌شود (متناسب با مقاومت). در موازی برعکس.` },
      ],
      practice: ['p4-series-1'],
      rescue: {
        prereq: 'resistance',
        simpler: String.raw`سری: جریان یکی ⇒ $R$ جمع. موازی: ولتاژ یکی ⇒ $1/R$ جمع.`,
        visual: String.raw`در شبیه‌ساز مدار، بین سری و موازی جابه‌جا شو و ببین کدام کمیت ثابت می‌ماند.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`دو مقاومت $3$ و $6$: سری $\Rightarrow 9$؛ موازی $\Rightarrow 2$.`,
        },
      },
      related: [
        { id: 'resistance', why: 'مقاومت پایه.' },
        { id: 'kirchhoff', why: 'برای مدارهای پیچیده‌تر از سری و موازی.' },
          { id: 'capacitor-combination', why: 'همین منطق برای خازن‌ها (با معکوس شدن).' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'emf',
      part: 'part-4',
      title: 'نیروی محرکه الکتریکی',
      en: 'Electromotive Force (EMF)',
      sourceRefs: ['part-4#10'],
      origin: 'course',
      difficulty: 3,
      effort: 12,
      prereqs: ['current', 'power'],
      keywords: ['نیروی محرکه', 'emf', 'باتری', 'مقاومت داخلی', 'ولتاژ ترمینال'],
      intuition: String.raw`باتری‌ها انرژی غیرالکتریکی (شیمیایی) را به انرژی الکتریکی تبدیل می‌کنند. نیروی محرکه (EMF) این توانایی را اندازه می‌گیرد:

$$
\boxed{\varepsilon = \frac{W}{q}}
\]

یعنی: انرژی که باتری به **واحد بار** می‌دهد. واحد آن هم ولت است، چون انرژی بر بار داریم.

نکته‌ی کلیدی: هر باتری واقعی یک **مقاومت داخلی** ($r$) دارد. بخشی از انرژی در این مقاومت داخلی تلف می‌شود، پس ولتاژی که به مدار می‌رسد کمتر از $\varepsilon$ است:

$$
\boxed{V = \varepsilon - Ir}
$$

دو حالت حدی که باید بدانی:
- مدار باز ($I = 0$): $V = \varepsilon$ (ولتاژ ترمینال = نیروی محرکه).
- اتصال کوتاه ($V = 0$): $I = \varepsilon/r$ (بیشترین جریان — و بیشترین گرما).

در یک مدار تک‌حلقه با مقاومت خارجی $R$:

$$
I = \frac{\varepsilon}{R + r}
$$

این فرمول مثل سری کردن مقاومت داخلی با خارجی است — یک ترفند ذهنی مفید.`,
      visual: {
        sim: 'circuit-lab',
        caption: 'مقاومت داخلی: ولتاژ ترمینال کمتر از ε',
        controls: ['نیروی محرکه', 'مقاومت داخلی', 'مقاومت خارجی'],
        fallback: String.raw`به‌جای تصویر: باتری مثل یک پمپ آب است که آب را با فشار $\varepsilon$ بالا می‌برد، ولی خودش هم مقاومت داخلی دارد. وقتی آب (جریان) زیاد بکشد، بخشی از فشار در لوله‌ی داخلی تلف می‌شود و فشار خروجی کم می‌شود.`,
      },
      formulas: [
        {
          name: 'نیروی محرکه',
          en: 'EMF',
          latex: String.raw`\varepsilon = \frac{W}{q}`,
          symbols: [
            { sym: String.raw`\varepsilon`, meaning: 'نیروی محرکه', unit: String.raw`$\text{V}$` },
            { sym: String.raw`W`, meaning: 'انرژی تبدیل‌شده', unit: String.raw`$\text{J}$` },
          ],
          interpretation: String.raw`انرژی داده‌شده به واحد بار توسط منبع.`,
          whenToUse: String.raw`برای توصیف توانایی باتری و انرژی‌ای که می‌دهد.`,
          whenNotToUse: String.raw`برای ولتاژی که واقعاً به مدار می‌رسد (آن‌جا $V = \varepsilon - Ir$).`,
        },
        {
          name: 'ولتاژ ترمینال',
          en: 'Terminal voltage',
          latex: String.raw`V = \varepsilon - Ir,\qquad I = \frac{\varepsilon}{R + r}`,
          symbols: [
            { sym: String.raw`r`, meaning: 'مقاومت داخلی باتری', unit: String.raw`$\Omega$` },
            { sym: String.raw`R`, meaning: 'مقاومت خارجی مدار', unit: String.raw`$\Omega$` },
          ],
          interpretation: String.raw`ولتاژی که واقعاً به بار می‌رسد، کمتر از $\varepsilon$ است.`,
          whenToUse: String.raw`برای مدارهای با باتری واقعی و جریان غیرصفر.`,
          whenNotToUse: String.raw`برای منبع ایده‌آل ($r=0$) که در آن $V = \varepsilon$ همیشه.`,
        },
      ],
      examples: [
        {
          title: 'باتری با مقاومت داخلی',
          problem: String.raw`باتری با $\varepsilon = 12\,V$ و $r = 0.5\,\Omega$ به مقاومت $R = 5.5\,\Omega$ وصل شده. جریان و ولتاژ روی مقاومت را پیدا کنید.`,
          steps: [
            { label: 'گام ۱ — جریان', body: String.raw`$I = \varepsilon/(R+r) = 12/(5.5+0.5) = 2\,A$`},
            { label: 'گام ۲ — افت داخلی', body: String.raw`$Ir = 2\times0.5 = 1\,V$ روی مقاومت داخلی`},
            { label: 'گام ۳ — ولتاژ ترمینال', body: String.raw`$V = 12 - 1 = 11\,V$ (همان $IR = 2\times5.5 = 11$ ✔)`},
          ],
          answer: { latex: String.raw`I = 2\,\text{A},\quad V = 11\,\text{V}`, body: String.raw`ولتاژ ترمینال کمی کمتر از نیروی محرکه است.`},
        },
      ],
      misconceptions: [
        { wrong: String.raw`«ولتاژ باتری همیشه برابر $\varepsilon$ است.»`, right: String.raw`فقط در مدار باز. وقتی جریان عبور می‌کند، بخشی از ولتاژ روی مقاومت داخلی می‌افتد: $V = \varepsilon - Ir$.` },
        { wrong: String.raw`«$\varepsilon$ و $V$ یکی هستند.»`, right: String.raw`$\varepsilon$ ویژگی **باتری** است، ولی $V$ ولتاژی است که به **مدار** می‌رسد.`},
      ],
      practice: ['p4-emf-1'],
      rescue: {
        prereq: 'current',
        simpler: String.raw`باتری هم انرژی می‌دهد، هم کمی «مقاومت» دارد. بخشی از انرژی در خودِ باتری هدر می‌رود.`,
        visual: String.raw`در شبیه‌ساز مدار، بار را کم و زیاد کن و ببین ولتاژ ترمینال چطور با جریان کم می‌شود.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`باتری $\varepsilon = 9\,V$، $r = 1\,\Omega$، جریان $2\,A$ ⇒ $V = 9 - 2 = 7\,V$.`,
        },
      },
      related: [
        { id: 'power', why: String.raw`توان باتری = $\varepsilon I$.` },
          { id: 'kirchhoff', why: 'برای حل مدارهای چندحلقه‌ای.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'kirchhoff',
      part: 'part-4',
      title: 'قوانین کیرشهف',
      en: "Kirchhoff's Rules",
      sourceRefs: ['part-4#11'],
      origin: 'course',
      difficulty: 3,
      effort: 16,
      prereqs: ['circuits-series-parallel', 'emf'],
      keywords: ['کیرشهف', 'قانون گره', 'قانون حلقه', 'sum I = 0', 'sum V = 0'],
      intuition: String.raw`وقتی مدار آن‌قدر پیچیده می‌شود که نه سری است و نه موازی، نوبت **دو قانون کیرشهف** می‌رسد. این دو قانون از بنیادی‌ترین مفاهیم فیزیک می‌آیند: **بقای بار** و **بقای انرژی**.

**قانون اول (گره)**: مجموع جریان‌های واردشونده به یک گره برابر مجموع جریان‌های خارج‌شونده است:

$$
\boxed{\sum I = 0}
$$

(با قرارداد علامت: واردشونده مثبت، خارج‌شونده منفی.)

**قانون دوم (حلقه)**: مجموع تغییرات پتانسیل در یک مسیر بسته صفر است:

$$
\boxed{\sum \Delta V = 0}
$$

یعنی اگر از یک نقطه شروع کنی و در یک حلقه‌ی بسته برگردی، باید به **همان** پتانسیل برسی (انرژی نه از ناکجاآباد می‌آید نه گم می‌شود).

روش حل:
۱. **گره‌ها** را شماره‌گذاری کن.
۲. برای هر گره یک معادله‌ی جریان بنویس.
۳. برای هر حلقه یک معادله‌ی ولتاژ بنویس.
۴. دستگاه را حل کن.

نکته‌ی مهم: اگر $n$ گره داشته باشی، فقط $n-1$ معادله‌ی گره مستقل است (معادله‌ی آخر تکراری است).`,
      visual: {
        sim: 'circuit-lab',
        caption: 'گره و حلقه: کجا بنویسیم؟',
        controls: ['نوع اتصال', 'مقادیر'],
        fallback: String.raw`به‌جای تصویر: قانون گره مثل «انبار آب» است: هرچه آب وارد شود باید به اندازه‌اش خارج شود. قانون حلقه مثل «پیاده‌روی در شهر»: اگر از یک نقطه شروع کنی و برگردی، باید به همان ارتفاع برسی — نمی‌توانی خودت را بالا ببری.`,
      },
      formulas: [
        {
          name: 'قانون گره‌ی کیرشهف',
          en: "Kirchhoff's junction rule",
          latex: String.raw`\sum I = 0`,
          symbols: [{ sym: String.raw`I`, meaning: 'جریان‌های وارد/خارج گره (با علامت)', unit: String.raw`$\text{A}$` }],
          interpretation: String.raw`بار در گره انباشته یا ناپدید نمی‌شود.`,
          whenToUse: String.raw`برای هر گره در مدار پیچیده.`,
          whenNotToUse: String.raw`برای مدارهای سری/موازی ساده که با تقسیم جریان حل می‌شوند.`,
        },
        {
          name: 'قانون حلقه‌ی کیرشهف',
          en: "Kirchhoff's loop rule",
          latex: String.raw`\sum \Delta V = 0`,
          symbols: [{ sym: String.raw`\Delta V`, meaning: 'تغییر ولتاژ در هر عنصر', unit: String.raw`$\text{V}$` }],
          interpretation: String.raw`با برگشت به نقطه‌ی شروع، همان پتانسیل خواهی داشت.`,
          whenToUse: String.raw`برای هر حلقه‌ی بسته در مدار.`,
          whenNotToUse: String.raw`در مدارهایی که فقط یک حلقه‌ی ساده دارند و با یک معادله حل می‌شوند.`,
          notes: [String.raw`از مقاومت در جهت جریان ⇒ $-IR$؛ از باتری در جهت نیروی محرکه ⇒ $+\varepsilon$.`],
        },
      ],
      examples: [
        {
          title: 'گره با سه شاخه',
          problem: String.raw`در یک گره، $2\,A$ وارد و $1.5\,A$ خارج می‌شود. جریان شاخه‌ی سوم چقدر است و در کدام جهت؟`,
          steps: [
            { label: 'گام ۱ — علامت‌ها', body: String.raw`واردشونده مثبت: $+2$؛ خارج‌شونده منفی: $-1.5$`},
            { label: 'گام ۲ — قانون', body: String.raw`$\sum I = 0 \Rightarrow +2 - 1.5 + I_3 = 0 \Rightarrow I_3 = -0.5\,A$`},
            { label: 'گام ۳ — تفسیر', body: String.raw`منفی یعنی فرض کرده بودیم خارج می‌شود، ولی در واقع $0.5\,A$ **وارد** گره می‌شود.`},
          ],
          answer: { latex: String.raw`I_3 = 0.5\,\text{A} \text{ (ورودی)}`, body: String.raw`علامت منفی در معادله، جهت واقعی را نشان می‌دهد.`},
          tip: String.raw`در قانون گره، اگر جواب منفی شد یعنی فرضت درباره‌ی **جهت** غلط بوده، نه ریاضیات. این کاملاً طبیعی است.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«قانون گره یعنی جریان‌ها برابرند.»`, right: String.raw`یعنی **مجموع** صفر است. سه شاخه می‌توانند $2$، $1$ و $1$ آمپر باشند.` },
        { wrong: String.raw`«قانون حلقه می‌گوید ولتاژها برابرند.»`, right: String.raw`می‌گوید **مجموع تغییرات** صفر است. تا وقتی مجموع صفر نشود، ولتاژها لازم نیست برابر باشند.` },
      ],
      practice: ['p4-kirchhoff-1'],
      rescue: {
        prereq: 'circuits-series-parallel',
        simpler: String.raw`گره: «بار وارد = بار خارج». حلقه: «از یک نقطه برمی‌گردم و همان‌جا هستم».`,
        visual: String.raw`در شبیه‌ساز مدار، گره‌ها را پیدا کن و مسیر حلقه را با انگشت دنبال کن.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`سری کردن یک مقاومت با باتری در یک حلقه: $\varepsilon - IR = 0$ ⇒ $I = \varepsilon/R$ (با $r=0$).`,
        },
      },
      related: [
        { id: 'emf', why: 'باتری در معادلات حلقه ظاهر می‌شود.' },
        { id: 'circuits-series-parallel', why: 'حالت ساده‌ی همین قوانین.' },
      ],
    },
    'part-4',
  ),

  validateConcept(
    {
      id: 'rc-circuit',
      part: 'part-4',
      title: 'مدار RC، شارژ و تخلیه',
      en: 'RC Circuit, Charging and Discharging',
      sourceRefs: ['part-4#12', 'part-4#13', 'part-4#14'],
      origin: 'course',
      difficulty: 3,
      effort: 20,
      prereqs: ['capacitor', 'resistance', 'emf'],
      keywords: ['مدار RC', 'ثابت زمانی', 'شارژ', 'تخلیه', 'تایو RC', '63 درصد'],
      intuition: String.raw`مدار RC یعنی یک خازن و یک مقاومت. این ساده‌ترین مداری است که **زمان** در آن نقش دارد: یعنی وضعیت مدار به‌تدریج تغییر می‌کند.

**ثابت زمانی**: $\tau = RC$. این عدد می‌گوید مدار در چه مدتی «یک واحد» از تغییر را انجام می‌دهد. واحدش ثانیه است.

**شارژ**: خازن خالی را با منبع $\varepsilon$ وصل می‌کنی. ولتاژ خازن با زمان به‌آرامی بالا می‌رود:

$$
q(t) = C\varepsilon\left(1 - e^{-t/RC}\right)
$$

$$
V_C = \varepsilon\left(1 - e^{-t/RC}\right),\qquad I = I_0 e^{-t/RC}
$$

**تخلیه**: خازن پر را از منبع جدا می‌کنی. ولتاژ با زمان کم می‌شود:

$$
q(t) = Q_0 e^{-t/RC},\qquad I = I_0 e^{-t/RC}
$$

نکته‌ی طلایی (و امتحانی): در لحظه‌ی $t = \tau$:

- شارژ: حدود **۶۳٪** کامل شده ($1 - e^{-1} = 63.2\%$)
- تخلیه: حدود **۳۷٪** باقی مانده ($e^{-1} = 36.8\%$)

جریان همیشه با همان نرخ کم می‌شود: در لحظه‌ی شروع، جریان بیشترین است، و به‌تدریج صفر می‌شود.`,
      visual: {
        sim: 'rc-lab',
        caption: 'شارژ و تخلیه: منحنی نمایی و ثابت زمانی',
        controls: ['مقاومت R', 'خازن C', 'ولتاژ'],
        fallback: String.raw`به‌جای تصویر: یک لیوان را با آب پر کن (شارژ). اگر شیر را باز کنی، آب **اول تند** بیرون می‌ریزد و بعد **کند** می‌شود (تخلیه). این «تند اول، کند بعد» همان شکل نمایی مدار RC است. اگر ظرف را دو برابر کنی (C بزرگ‌تر)، زمان پر شدن دو برابر می‌شود.`,
      },
      formulas: [
        {
          name: 'ثابت زمانی',
          en: 'Time constant',
          latex: String.raw`\tau = RC`,
          symbols: [
            { sym: String.raw`R`, meaning: 'مقاومت', unit: String.raw`$\Omega$` },
            { sym: String.raw`C`, meaning: 'خازن', unit: 'F' },
            { sym: String.raw`\tau`, meaning: 'ثابت زمانی', unit: String.raw`$\text{s}$` },
          ],
          interpretation: String.raw`زمانی که مدار برای رسیدن به ~۶۳٪ تغییر لازم دارد.`,
          whenToUse: String.raw`برای تخمین سرعت شارژ/تخلیه. $R$ یا $C$ بزرگ‌تر ⇒ کندتر.`,
          whenNotToUse: String.raw`در مدارهای بدون خازن (که گذرا نیستند).`,
        },
        {
          name: 'شارژ خازن',
          en: 'Charging a capacitor',
          latex: String.raw`q(t) = C\varepsilon\left(1 - e^{-t/RC}\right),\qquad V_C = \varepsilon\left(1 - e^{-t/RC}\right),\qquad I = I_0 e^{-t/RC}`,
          symbols: [{ sym: String.raw`\varepsilon`, meaning: 'ولتاژ منبع', unit: String.raw`$\text{V}$` }],
          interpretation: String.raw`ولتاژ با زمان به‌صورت نمایی به $\varepsilon$ می‌رسد و جریان نمایی کم می‌شود.`,
          whenToUse: String.raw`برای محاسبه‌ی وضعیت خازن در هر لحظه از لحظه‌ی اتصال.`,
          whenNotToUse: String.raw`در لحظه‌ی $t=0$ (که خازن خالی است) — آن‌جا $V_C = 0$ و $I$ بیشترین است.`,
        },
        {
          name: 'تخلیه خازن',
          en: 'Discharging a capacitor',
          latex: String.raw`q(t) = Q_0 e^{-t/RC},\qquad I = I_0 e^{-t/RC}`,
          symbols: [{ sym: String.raw`Q_0`, meaning: 'بار اولیه', unit: 'C' }],
          interpretation: String.raw`بار با زمان نمایی کم می‌شود تا صفر.`,
          whenToUse: String.raw`وقتی خازن پر را از منبع جدا می‌کنی و می‌خواهی بدانی چقدر انرژی باقی مانده.`,
          whenNotToUse: String.raw`اگر منبع هنوز وصل باشد (آن‌جا شارژ است، نه تخلیه).`,
        },
      ],
      examples: [
        {
          title: 'شارژ در چند ثابت زمانی',
          problem: String.raw`در یک مدار RC، در چند لحظه‌ی مشخص چند درصد شارژ انجام شده است؟`,
          steps: [
            { label: 'گام ۱', body: String.raw`در $t = \tau$: $1-e^{-1} \approx 63\%$`},
            { label: 'گام ۲', body: String.raw`در $t = 2\tau$: $1-e^{-2} \approx 86\%$`},
            { label: 'گام ۳', body: String.raw`در $t = 3\tau$: $1-e^{-3} \approx 95\%$`},
            { label: 'گام ۴', body: String.raw`در $t = 5\tau$: $1-e^{-5} \approx 99.3\%$ — یعنی عملاً کامل.`},
          ],
          answer: { body: String.raw`تا ۵ برابر ثابت زمانی صبر کن، عملاً کامل می‌شود. این «۵ تایو» یک قاعده‌ی سرانگشتی است.`},
          tip: String.raw`«۵ تایو» یعنی بعد از $5RC$ مدار به حالت پایدار رسیده و می‌توانی آن را کامل فرض کنی. یک تقریب مهندسی پرکاربرد.`,
        },
      ],
      misconceptions: [
        { wrong: String.raw`«خازن مثل مقاومت است و بلافاصله جریان می‌گیرد.»`, right: String.raw`خازن در لحظه‌ی اول مثل **سیم** رفتار می‌کند (جریان زیاد)، ولی به‌تدریج جریان کم می‌شود.` },
        { wrong: String.raw`«مدار RC خیلی سریع پر می‌شود.»`, right: String.raw`با $\tau = RC$ مشخص می‌شود. $C$ بزرگ (خازن بزرگ) ⇒ شارژ **کند**. این در خازن‌های بزرگ کاربردی و در فلاش دوربین‌ها می‌بینی.` },
      ],
      practice: ['p4-rc-1'],
      rescue: {
        prereq: 'capacitor',
        simpler: String.raw`خازن با شیر آب بند: خالی کردنش زمان می‌برد. $\tau = RC$ یعنی بعد از $RC$ ثانیه، حدود ۶۳٪ خالی/پر شده.`,
        visual: String.raw`در شبیه‌ساز RC، دکمه‌ی پخش/توقف/بازنشانی را بزن و منحنی را با خط $t=\tau$ ببین.`,
        tiny: {
          title: 'مثال خیلی کوچک',
          body: String.raw`$R = 1\,k\Omega$، $C = 1\,\mu F$ ⇒ $\tau = 1\,ms$. در ۱ میلی‌ثانیه، ۶۳٪ شارژ.`,
        },
      },
      related: [
        { id: 'capacitor', why: 'عنصر اصلی مدار.' },
          { id: 'emf', why: 'منبع شارژکننده.' },
      ],
    },
    'part-4',
  ),
];