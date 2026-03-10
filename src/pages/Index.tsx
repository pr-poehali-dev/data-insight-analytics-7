import { useState, useEffect, useMemo } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "rules" | "glossary" | "quiz";

const allRules = [
  { num: "01", icon: "KeyRound", title: "Сложные и уникальные пароли", desc: "Используй пароли длиной от 12 символов с буквами, цифрами и спецсимволами. Для каждого сайта — отдельный пароль." },
  { num: "02", icon: "ShieldCheck", title: "Двухфакторная аутентификация", desc: "Включи 2FA везде, где это возможно: в почте, соцсетях, банке. Это дополнительный замок на твоём аккаунте." },
  { num: "03", icon: "MailX", title: "Осторожно с подозрительными ссылками", desc: "Не переходи по ссылкам из писем и сообщений от незнакомцев. Мошенники маскируют вредоносные сайты под настоящие." },
  { num: "04", icon: "RefreshCw", title: "Регулярные обновления ПО", desc: "Обновляй операционную систему, браузер и приложения. В обновлениях закрываются известные уязвимости безопасности." },
  { num: "05", icon: "UserX", title: "Осторожность в соцсетях", desc: "Не публикуй адрес, телефон, фото документов. Ограничь доступ к профилю для незнакомых людей." },
  { num: "06", icon: "Wifi", title: "Публичный Wi-Fi и VPN", desc: "Избегай передачи важных данных через открытые сети. Используй VPN при подключении к публичному Wi-Fi." },
  { num: "07", icon: "HardDrive", title: "Регулярное резервное копирование", desc: "Делай резервные копии важных файлов на внешний диск или в облако. При вирусной атаке это спасёт твои данные." },
  { num: "08", icon: "Bug", title: "Антивирус и защита в реальном времени", desc: "Установи надёжный антивирус и держи его всегда включённым. Он предупредит об угрозах до того, как они навредят." },
  { num: "09", icon: "CreditCard", title: "Безопасность онлайн-платежей", desc: "Покупай только на сайтах с https:// в адресе. Используй виртуальные карты или карты с лимитом для онлайн-покупок." },
  { num: "10", icon: "Download", title: "Осторожно со скачиванием файлов", desc: "Скачивай программы только с официальных сайтов. Пиратский софт часто содержит вредоносный код." },
  { num: "11", icon: "Eye", title: "Проверяй адресную строку сайта", desc: "Перед вводом логина и пароля убедись, что адрес сайта написан правильно. Фишинговые сайты отличаются одной буквой." },
  { num: "12", icon: "MessageSquareX", title: "Не доверяй срочным сообщениям", desc: "Сообщения вроде «ваш аккаунт заблокирован — действуйте немедленно» — типичный приём мошенников. Не торопись." },
  { num: "13", icon: "Globe", title: "Используй безопасные браузеры и расширения", desc: "Установи расширения для блокировки рекламы и трекеров (uBlock Origin). Используй браузеры с хорошей репутацией безопасности." },
  { num: "14", icon: "Phone", title: "Защита мобильного устройства", desc: "Установи PIN-код или биометрическую блокировку. Не оставляй телефон разблокированным в общественных местах." },
  { num: "15", icon: "Baby", title: "Контролируй цифровой след детей", desc: "Расскажи детям об интернет-безопасности. Используй родительский контроль и обсуждай, с кем они общаются онлайн." },
  { num: "16", icon: "Lock", title: "Блокируй экран при отходе от компьютера", desc: "Всегда блокируй компьютер, если отходишь, даже ненадолго. Горячие клавиши: Win+L (Windows), Cmd+Control+Q (Mac)." },
  { num: "17", icon: "Trash2", title: "Правильно удаляй данные", desc: "Обычное удаление файлов не уничтожает их полностью. Используй программы безопасного удаления перед продажей устройства." },
];

const allTerms = [
  { term: "Фишинг", def: "Вид интернет-мошенничества, целью которого является получение доступа к конфиденциальным данным пользователей — логинам и паролям.", icon: "Fish" },
  { term: "VPN", def: "Технология, позволяющая создать зашифрованное соединение между устройством и интернетом. Скрывает реальный IP-адрес пользователя.", icon: "Lock" },
  { term: "Антивирус", def: "Программа для обнаружения, блокировки и удаления вредоносных файлов и программ с компьютера или устройства.", icon: "Bug" },
  { term: "Двухфакторная аутентификация (2FA)", def: "Метод защиты аккаунта, требующий подтверждения входа вторым способом: кодом из SMS, приложением или биометрией.", icon: "Smartphone" },
  { term: "Брандмауэр (Firewall)", def: "Программа или устройство, которое контролирует входящий и исходящий сетевой трафик и блокирует нежелательные подключения.", icon: "Shield" },
  { term: "Шифрование", def: "Преобразование данных в нечитаемый вид с помощью алгоритма. Только обладатель ключа может расшифровать информацию.", icon: "Binary" },
  { term: "Малварь (Malware)", def: "Вредоносное программное обеспечение, созданное для нанесения вреда устройству или кражи данных: вирусы, трояны, шпионы.", icon: "AlertTriangle" },
  { term: "Куки (Cookies)", def: "Небольшие файлы, которые сайты сохраняют на устройстве пользователя для запоминания настроек и данных сессии.", icon: "Cookie" },
  { term: "Троян", def: "Вредоносная программа, маскирующаяся под полезное приложение. После запуска может похищать данные или открывать доступ злоумышленникам.", icon: "AlertOctagon" },
  { term: "Спам", def: "Нежелательные массовые рассылки сообщений или электронных писем, часто содержащие рекламу или мошеннические предложения.", icon: "MailX" },
  { term: "HTTPS", def: "Защищённый протокол передачи данных в интернете. Сайт с https:// шифрует всё, что ты отправляешь — в отличие от http://.", icon: "Globe" },
  { term: "IP-адрес", def: "Уникальный числовой идентификатор устройства в сети, по которому можно определить примерное местоположение пользователя.", icon: "MapPin" },
  { term: "Социальная инженерия", def: "Манипулирование людьми с целью получения конфиденциальной информации. Мошенники эксплуатируют доверие, страх или спешку.", icon: "Users" },
  { term: "Программа-вымогатель (Ransomware)", def: "Вредоносная программа, которая шифрует файлы на устройстве и требует выкуп за их восстановление.", icon: "DollarSign" },
  { term: "Менеджер паролей", def: "Приложение для безопасного хранения и генерации уникальных паролей. Запоминать нужно только один мастер-пароль.", icon: "KeyRound" },
  { term: "Брутфорс", def: "Метод взлома, при котором злоумышленник перебирает все возможные комбинации пароля до нахождения верной.", icon: "Zap" },
  { term: "Нулевой день (Zero-day)", def: "Уязвимость в программном обеспечении, которая стала известна, но ещё не исправлена разработчиком. Особенно опасна для пользователей.", icon: "Clock" },
];

const allQuizSets = [
  [
    { q: "Что такое фишинг?", options: ["Рыбалка в интернете", "Вид мошенничества для кражи личных данных", "Программа для защиты от вирусов", "Способ ускорить интернет"], correct: 1, explain: "Фишинг — когда мошенники маскируются под доверенные сайты, чтобы выманить твои данные." },
    { q: "Какой пароль наиболее надёжный?", options: ["123456", "имя_и_дата_рождения", "K#9mP!qL2@wX", "password"], correct: 2, explain: "Надёжный пароль — длинный, с разными типами символов, без личной информации." },
    { q: "Что делает VPN?", options: ["Ускоряет интернет", "Шифрует соединение и скрывает IP-адрес", "Удаляет вирусы", "Блокирует рекламу"], correct: 1, explain: "VPN создаёт зашифрованный туннель между твоим устройством и интернетом." },
    { q: "Зачем нужна двухфакторная аутентификация?", options: ["Чтобы входить без пароля", "Для ускорения входа", "Для защиты даже при краже пароля", "Чтобы сбросить пароль"], correct: 2, explain: "Даже если пароль украден, без второго фактора войти не получится." },
    { q: "Что опасно делать в публичной Wi-Fi сети?", options: ["Читать новости", "Вводить пароли и банковские данные", "Слушать музыку", "Смотреть видео"], correct: 1, explain: "В открытых сетях трафик может перехватываться. Никогда не вводи важные данные без VPN." },
  ],
  [
    { q: "Как выглядит безопасный сайт в адресной строке?", options: ["http://сайт.ру", "https://сайт.ру", "ftp://сайт.ру", "www.сайт.ру"], correct: 1, explain: "Буква 's' в https означает шифрование. Все важные сайты должны его использовать." },
    { q: "Что такое брандмауэр?", options: ["Противопожарная стена", "Программа контроля сетевого трафика", "Вид антивируса", "Тип шифрования"], correct: 1, explain: "Брандмауэр фильтрует трафик и блокирует нежелательные подключения к твоему устройству." },
    { q: "Что такое троян?", options: ["Антивирусная программа", "Игра в интернете", "Вредоносная программа, маскирующаяся под полезную", "Тип VPN"], correct: 2, explain: "Троян скрывается под видом полезной программы, а после запуска вредит пользователю." },
    { q: "Как часто нужно обновлять пароли?", options: ["Никогда", "Раз в 10 лет", "При подозрении на взлом или раз в год", "Каждый день"], correct: 2, explain: "Меняй пароли при утечке данных сервиса или подозрительной активности в аккаунте." },
    { q: "Что такое менеджер паролей?", options: ["Человек, который помнит пароли", "Приложение для безопасного хранения паролей", "Программа для взлома", "Браузерная игра"], correct: 1, explain: "Менеджер паролей генерирует и хранит сложные пароли. Тебе нужно помнить только один мастер-пароль." },
  ],
  [
    { q: "Что такое социальная инженерия в контексте безопасности?", options: ["Строительство социальных объектов", "Манипулирование людьми для получения данных", "Социальные сети", "Разработка приложений"], correct: 1, explain: "Мошенники используют психологические приёмы — страх, срочность, доверие — чтобы выманить данные." },
    { q: "Что делает программа-вымогатель (ransomware)?", options: ["Ускоряет компьютер", "Шифрует файлы и требует выкуп", "Чистит диск от мусора", "Блокирует рекламу"], correct: 1, explain: "Ransomware блокирует доступ к твоим файлам и требует деньги за восстановление." },
    { q: "Что такое 'нулевой день' (zero-day)?", options: ["Первый день работы компьютера", "Неисправленная уязвимость в ПО", "Бесплатный день интернета", "Обнуление настроек"], correct: 1, explain: "Zero-day — уязвимость, которую нашли раньше, чем разработчики успели её закрыть." },
    { q: "Какой способ аутентификации самый надёжный?", options: ["Только пароль", "Пароль + SMS-код", "Пароль + приложение-аутентификатор", "Только биометрия"], correct: 2, explain: "Приложение-аутентификатор надёжнее SMS — его нельзя перехватить при подмене SIM-карты." },
    { q: "Что нужно сделать перед продажей смартфона?", options: ["Просто удалить приложения", "Сделать сброс до заводских настроек и удалить данные", "Поменять обои", "Ничего особенного"], correct: 1, explain: "Сброс к заводским настройкам удаляет все личные данные. Обычное удаление их не уничтожает." },
  ],
  [
    { q: "Что значит 'куки' (cookies) в интернете?", options: ["Вкусное печенье", "Файлы, которые сайты сохраняют на устройстве", "Пароль от Wi-Fi", "Тип вируса"], correct: 1, explain: "Куки помогают сайтам запоминать тебя, но могут использоваться и для отслеживания." },
    { q: "Как проверить, не утекли ли твои данные?", options: ["Позвонить в полицию", "Проверить на сайте haveibeenpwned.com", "Спросить у знакомых", "Это невозможно"], correct: 1, explain: "Сайт haveibeenpwned.com показывает, попадал ли твой email в известные утечки данных." },
    { q: "Что такое IP-адрес?", options: ["Адрес офиса интернет-провайдера", "Уникальный идентификатор устройства в сети", "Тип интернет-соединения", "Пароль от роутера"], correct: 1, explain: "IP-адрес — это как почтовый адрес в интернете. По нему можно определить примерное местоположение." },
    { q: "Почему нельзя использовать один пароль для всех сайтов?", options: ["Это разрешено, просто неудобно", "При взломе одного сайта взломают все аккаунты", "Браузер запрещает", "Это устаревшее правило"], correct: 1, explain: "Если один сервис взломан, мошенники сразу попробуют твой пароль везде — это называется credential stuffing." },
    { q: "Что такое спам?", options: ["Вид мясных консервов", "Нежелательные массовые рассылки", "Быстрый интернет", "Тип антивируса"], correct: 1, explain: "Спам — нежелательные письма и сообщения. Они могут содержать фишинговые ссылки или вредоносные файлы." },
  ],
  [
    { q: "Что делать, если получил письмо с просьбой срочно перейти по ссылке?", options: ["Сразу перейти", "Переслать всем знакомым", "Проверить отправителя и не торопиться", "Ответить на письмо"], correct: 2, explain: "Срочность — любимый приём мошенников. Всегда проверяй отправителя и думай перед кликом." },
    { q: "Какой метод входа самый небезопасный?", options: ["Биометрия", "Длинный пароль + 2FA", "Простой PIN-код без дополнительной защиты", "Пароль + приложение"], correct: 2, explain: "Простой PIN-код легко подобрать брутфорсом или подглядеть через плечо." },
    { q: "Что такое брутфорс-атака?", options: ["Физическое повреждение компьютера", "Перебор всех возможных паролей", "Вирус на USB-флешке", "Атака на Wi-Fi"], correct: 1, explain: "Брутфорс — автоматический перебор комбинаций. Именно поэтому короткие и простые пароли опасны." },
    { q: "Зачем делать резервные копии данных?", options: ["Это не нужно", "Чтобы восстановить данные при вирусе или поломке", "Для ускорения компьютера", "Чтобы поделиться с другими"], correct: 1, explain: "Резервные копии — твоя страховка. При атаке вымогателя или поломке диска они спасут важные файлы." },
    { q: "Что значит 'шифрование данных'?", options: ["Удаление данных", "Преобразование данных в нечитаемый вид", "Сжатие файлов", "Копирование файлов"], correct: 1, explain: "Зашифрованные данные невозможно прочитать без ключа, даже если их перехватили." },
  ],
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [quizSetIndex, setQuizSetIndex] = useState(() => Math.floor(Math.random() * allQuizSets.length));
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(5).fill(null));

  const currentSet = allQuizSets[quizSetIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleNav = (s: Section) => {
    setActiveSection(s);
    setMobileOpen(false);
  };

  const handleAnswer = (i: number) => {
    if (answered) return;
    const isCorrect = i === currentSet[quizStep].correct;
    setSelected(i);
    setAnswered(true);
    if (isCorrect) setScore((p) => p + 1);
    setAnswers((prev) => {
      const next = [...prev];
      next[quizStep] = isCorrect;
      return next;
    });
  };

  const handleNext = () => {
    if (quizStep + 1 >= currentSet.length) {
      setFinished(true);
    } else {
      setQuizStep((p) => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    const nextIndex = (quizSetIndex + 1) % allQuizSets.length;
    setQuizSetIndex(nextIndex);
    setQuizStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
    setAnswers(Array(5).fill(null));
  };

  const navItems: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "rules", label: "Главные правила" },
    { key: "glossary", label: "Словарь терминов" },
    { key: "quiz", label: "Тест" },
  ];

  return (
    <div className="font-montserrat min-h-screen bg-white text-navy">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button onClick={() => handleNav("home")} className="flex items-center gap-2 font-bold text-navy text-lg">
            <Icon name="ShieldCheck" size={24} className="text-lime" />
            <span className="font-black text-navy">Азбука <span className="text-lime-dark">Безопасности</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeSection === item.key ? "bg-navy text-white" : "text-navy hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen((v) => !v)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} className="text-navy" />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${
                  activeSection === item.key ? "bg-navy text-white" : "text-navy hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ===================== HOME ===================== */}
      {activeSection === "home" && (
        <main>
          <section className="bg-navy text-white py-20 sm:py-32 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-lime/20 rounded-full p-5">
                  <Icon name="ShieldCheck" size={56} className="text-lime" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-6">
                Твоя цифровая безопасность<br />
                <span className="text-lime">начинается здесь</span>
              </h1>
              <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
                Каждый день миллионы людей становятся жертвами интернет-мошенников. Знание простых правил защищает тебя и твоих близких. Мы расскажем о безопасности в сети — просто и понятно.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleNav("rules")}
                  className="bg-lime text-navy font-bold px-8 py-3 rounded-xl hover:bg-lime-light transition-all duration-200 shadow-lg hover:scale-105"
                >
                  Узнать правила
                </button>
                <button
                  onClick={() => handleNav("quiz")}
                  className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white hover:text-navy transition-all duration-200"
                >
                  Пройти тест
                </button>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-center text-navy mb-12">Что тебя защищает в сети?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "Lock", label: "Надёжные пароли" },
                  { icon: "Shield", label: "Антивирус" },
                  { icon: "Wifi", label: "VPN-защита" },
                  { icon: "Smartphone", label: "2FA аутентификация" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className="flex justify-center mb-3">
                      <div className="bg-lime/10 rounded-full p-3">
                        <Icon name={item.icon} size={28} className="text-lime-dark" />
                      </div>
                    </div>
                    <p className="font-semibold text-navy text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {[
                  { num: "3.4 млрд", label: "фишинговых писем отправляется каждый день" },
                  { num: "95%", label: "взломов происходят из-за человеческой ошибки" },
                  { num: "2 сек", label: "— каждые 2 секунды происходит новая кибератака" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl sm:text-4xl font-black text-lime-dark mb-2">{s.num}</div>
                    <div className="text-navy/70 text-sm leading-relaxed">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-navy">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Проверь свои знания прямо сейчас</h2>
              <p className="text-blue-100 mb-8">5 вопросов — узнай, насколько ты защищён в интернете</p>
              <button
                onClick={() => handleNav("quiz")}
                className="bg-lime text-navy font-bold px-10 py-4 rounded-xl hover:bg-lime-light transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Начать тест
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ===================== RULES ===================== */}
      {activeSection === "rules" && (
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="mb-10">
            <span className="text-lime-dark font-bold text-sm uppercase tracking-widest">Инструкция</span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy mt-1 mb-3">Главные правила безопасности</h2>
            <p className="text-navy/60 max-w-xl">Следуй этим правилам — и ты защитишь себя от большинства интернет-угроз.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allRules.map((r) => (
              <div key={r.num} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-lime/40 transition-all duration-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                    <Icon name={r.icon} size={20} className="text-lime" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-lime-dark mb-1">ПРАВИЛО {r.num}</div>
                  <h3 className="font-bold text-navy mb-2">{r.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-lime/10 border border-lime/30 rounded-2xl p-6 flex gap-4 items-start">
            <Icon name="Lightbulb" size={24} className="text-lime-dark flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-navy mb-1">Совет</div>
              <p className="text-navy/70 text-sm">Используй менеджер паролей — он запомнит все сложные пароли за тебя. Популярные варианты: Bitwarden (бесплатный), 1Password, KeePass.</p>
            </div>
          </div>
        </main>
      )}

      {/* ===================== GLOSSARY ===================== */}
      {activeSection === "glossary" && (
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-10">
            <span className="text-lime-dark font-bold text-sm uppercase tracking-widest">Справочник</span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy mt-1 mb-3">Словарь терминов</h2>
            <p className="text-navy/60">Разбираемся в ключевых понятиях кибербезопасности простым языком.</p>
          </div>

          <div className="flex flex-col gap-4">
            {allTerms.map((t) => (
              <div key={t.term} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-lime/40 transition-all duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                  <Icon name={t.icon} size={18} className="text-lime" />
                </div>
                <div>
                  <span className="font-black text-navy">{t.term}</span>
                  <span className="text-navy/60"> — {t.def}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ===================== QUIZ ===================== */}
      {activeSection === "quiz" && (
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-8">
            <span className="text-lime-dark font-bold text-sm uppercase tracking-widest">Интерактивный</span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy mt-1">Проверь свои знания</h2>
            <p className="text-navy/50 text-sm mt-1">Вариант теста {quizSetIndex + 1} из {allQuizSets.length}</p>
          </div>

          {!finished ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-navy/50 font-medium">Вопрос {quizStep + 1} из {currentSet.length}</span>
                <div className="flex gap-1.5">
                  {currentSet.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded-full transition-all duration-300 ${
                        i === quizStep
                          ? "bg-navy"
                          : answers[i] === true
                          ? "bg-lime-dark"
                          : answers[i] === false
                          ? "bg-red-500"
                          : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-navy mb-6">{currentSet[quizStep].q}</h3>

              <div className="flex flex-col gap-3 mb-6">
                {currentSet[quizStep].options.map((opt, i) => {
                  const isCorrect = i === currentSet[quizStep].correct;
                  const isSelected = i === selected;

                  let cls = "w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-200 ";
                  if (!answered) {
                    cls += "border-gray-200 text-navy hover:border-navy hover:bg-gray-50 cursor-pointer";
                  } else if (isCorrect) {
                    cls += "border-lime-dark bg-lime/10 text-lime-dark";
                  } else if (isSelected && !isCorrect) {
                    cls += "border-red-500 bg-red-50 text-red-600";
                  } else {
                    cls += "border-gray-100 text-navy/30 cursor-default";
                  }

                  return (
                    <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                      <span className="mr-3 font-black text-xs">{["А", "Б", "В", "Г"][i]}.</span>
                      {opt}
                      {answered && isCorrect && (
                        <span className="ml-2 inline-flex items-center gap-1 text-lime-dark text-xs font-bold">
                          ✓ Верно
                        </span>
                      )}
                      {answered && isSelected && !isCorrect && (
                        <span className="ml-2 inline-flex items-center gap-1 text-red-500 text-xs font-bold">
                          ✗ Неверно
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`rounded-xl p-4 mb-4 text-sm flex gap-3 items-start ${
                  selected === currentSet[quizStep].correct
                    ? "bg-lime/10 border border-lime/30"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <Icon
                    name={selected === currentSet[quizStep].correct ? "CheckCircle2" : "XCircle"}
                    size={18}
                    className={`${selected === currentSet[quizStep].correct ? "text-lime-dark" : "text-red-500"} flex-shrink-0 mt-0.5`}
                  />
                  <p className={selected === currentSet[quizStep].correct ? "text-lime-dark" : "text-red-600"}>
                    {currentSet[quizStep].explain}
                  </p>
                </div>
              )}

              {answered && (
                <button onClick={handleNext} className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-light transition-all duration-200 hover:scale-[1.02]">
                  {quizStep + 1 >= currentSet.length ? "Узнать результат" : "Следующий вопрос →"}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className={`rounded-full p-5 ${score >= 4 ? "bg-lime/20" : score >= 2 ? "bg-yellow-50" : "bg-red-50"}`}>
                  <Icon
                    name={score >= 4 ? "Trophy" : score >= 2 ? "ThumbsUp" : "RefreshCw"}
                    size={48}
                    className={score >= 4 ? "text-lime-dark" : score >= 2 ? "text-yellow-500" : "text-red-400"}
                  />
                </div>
              </div>
              <div className="text-5xl font-black text-navy mb-2">{score}/{currentSet.length}</div>
              <p className="text-navy/60 mb-2">правильных ответов</p>
              <p className="font-semibold text-navy text-lg mb-8">
                {score === currentSet.length
                  ? "Отлично! Ты эксперт по кибербезопасности 🏆"
                  : score >= 4
                  ? "Хороший результат! Почти всё знаешь."
                  : score >= 2
                  ? "Неплохо, но есть над чем поработать."
                  : "Читай правила — и пробуй снова!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={resetQuiz} className="bg-navy text-white font-bold px-8 py-3 rounded-xl hover:bg-navy-light transition-all duration-200">
                  Другой вариант теста
                </button>
                <button onClick={() => handleNav("rules")} className="border-2 border-navy text-navy font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  Читать правила
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center text-navy/40 text-sm mt-8">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Icon name="ShieldCheck" size={16} className="text-lime" />
          <span className="font-semibold text-navy/60">Азбука Безопасности</span>
        </div>
        <p>Будь в безопасности в сети — это проще, чем кажется.</p>
      </footer>
    </div>
  );
}