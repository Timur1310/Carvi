/* ================================================================
   Carvi — Internationalization (i18n)
   Supports: EN (English) | RU (Russian)
   ================================================================ */

const TRANSLATIONS = {
  en: {
    /* ── Navbar ── */
    'nav.battle':  '⚔️ Battle',
    'nav.cars':    '🚗 Cars',
    'nav.tops':    '🏆 Tops',
    'nav.compare': '📊 Compare',
    'nav.learn':   '📚 Learn',
    'nav.quiz':    '🧠 Quiz',

    'region.all':          'All',
    'region.china':        'China',
    'region.cis':          'CIS',
    'region.germany':      'Germany',
    'region.japan':        'Japan',
    'region.korea':        'Korea',
    'region.usa':          'USA',
    'region.italy':        'Italy',
    'region.europe':       'Europe',
    'region.allCountries': 'All countries',

    'tops.hero.title': '🏆 Tops by country',
    'tops.hero.sub':   'Best cars of each segment by average rating (performance, reliability, comfort, value, safety).',

    /* ── Battle (index.html) ── */
    'battle.hero.title':    'Which car would <span>you choose?</span>',
    'battle.hero.sub':      'Tap a car to vote · Swipe left/right · Use ← → keys',
    'battle.hint.left':     'Left car wins',
    'battle.hint.tap':      'Tap card to choose',
    'battle.hint.right':    'Right car wins',
    'battle.stat.power':    'Power',
    'battle.stat.speed':    '0–100',
    'battle.stat.score':    'Score',
    'battle.result.chose':  'You chose',
    'battle.result.over':   'over',
    'battle.result.compare':'📊 Full Comparison',
    'battle.result.next':   'Next Battle →',
    'battle.footer.new':    '↻ New Matchup',
    'battle.footer.browse': 'Browse All Cars',
    'battle.footer.compare':'📊 Detailed Compare',
    'battle.wins':          'wins! 🏆',
    'battle.cat':           'Category',

    /* ── Cars page ── */
    'cars.hero.title':  'Car Database',
    'cars.hero.sub':    'Explore detailed specs and ratings for every car in our catalogue.',
    'cars.search':      'Search brand or model…',
    'cars.cat.all':     'All Categories',
    'cars.sort.name':   'Sort: Name A–Z',
    'cars.sort.power':  'Sort: Most Power',
    'cars.sort.accel':  'Sort: Fastest 0–100',
    'cars.sort.econ':   'Sort: Most Economical',
    'cars.sort.price':  'Sort: Lowest Price',
    'cars.none':        'No cars match your search.',
    'cars.hp':          'HP',
    'cars.lkm':         'L/100km',

    /* ── Compare page ── */
    'compare.hero.title': 'Compare Two Cars',
    'compare.hero.sub':   'Select two cars to see a detailed head-to-head comparison of every spec.',
    'compare.btn':        '⚡ Compare Now',
    'compare.winner':     'Higher Rated',
    'compare.loser':      'Lower Rated',
    'compare.overall':    'Overall',
    'compare.view':       'View Details',
    'compare.spec':       'Spec',
    'compare.legend':     'Legend',
    'compare.green':      'Green = Better value',
    'compare.red':        'Red = Worse value',
    'compare.alert':      'Please select two different cars.',
    'compare.s.perf':     '⚡ Performance',
    'compare.s.engine':   '🔧 Engine',
    'compare.s.fuel':     '⛽ Fuel Consumption',
    'compare.s.dim':      '📐 Dimensions & Weight',
    'compare.s.price':    '💰 Price',
    'compare.r.power':    'Power',
    'compare.r.torque':   'Torque',
    'compare.r.accel':    '0–100 km/h',
    'compare.r.top':      'Top Speed',
    'compare.r.drive':    'Drive Type',
    'compare.r.disp':     'Displacement',
    'compare.r.config':   'Configuration',
    'compare.r.cyl':      'Cylinders',
    'compare.r.fuel':     'Fuel Type',
    'compare.r.asp':      'Aspiration',
    'compare.r.comp':     'Compression',
    'compare.r.city':     'City',
    'compare.r.hwy':      'Highway',
    'compare.r.comb':     'Combined',
    'compare.r.weight':   'Curb Weight',
    'compare.r.length':   'Length',
    'compare.r.width':    'Width',
    'compare.r.height':   'Height',
    'compare.r.wb':       'Wheelbase',
    'compare.r.gc':       'Ground Clearance',
    'compare.r.tank':     'Fuel Tank',
    'compare.r.trunk':    'Trunk Volume',
    'compare.r.start':    'Starting Price',
    'compare.r.top2':     'Top Trim',

    /* ── Ratings (shared) ── */
    'rt.performance':    'Performance',
    'rt.fuelEfficiency': 'Economy',
    'rt.comfort':        'Comfort',
    'rt.reliability':    'Reliability',
    'rt.value':          'Value',
    'rt.safety':         'Safety',

    /* ── Car detail page ── */
    'car.tab.overview':  'Overview',
    'car.tab.specs':     'Full Specs',
    'car.tab.exterior':  'Exterior',
    'car.tab.interior':  'Interior',
    'car.tab.safety':    'Safety',
    'car.tab.check':     "Buyer's Guide",
    'car.s.ratings':     'Performance Ratings',
    'car.s.proscons':    'Pros & Cons',
    'car.s.about':       'About This Car',
    'car.s.extdesign':   'Exterior Design',
    'car.s.extfeat':     'Notable Features',
    'car.s.cabin':       'Cabin Description',
    'car.s.intfeat':     'Interior Features',
    'car.s.saferating':  'Safety Rating',
    'car.s.safesys':     'Safety Systems',
    'car.crashlabel':    'Official crash test rating',
    'car.compare':       '📊 Compare This Car',
    'car.allcars':       '← All Cars',
    'car.sp.power':      'Power',
    'car.sp.torque':     'Torque',
    'car.sp.accel':      '0–100 km/h',
    'car.sp.top':        'Top Speed',
    'car.sp.drive':      'Drive Type',
    'car.sp.disp':       'Displacement',
    'car.sp.config':     'Configuration',
    'car.sp.cyl':        'Cylinders',
    'car.sp.fuel':       'Fuel Type',
    'car.sp.asp':        'Aspiration',
    'car.sp.comp':       'Compression Ratio',
    'car.sp.trans':      'Type',
    'car.sp.speeds':     'Speeds',
    'car.sp.city':       'City',
    'car.sp.hwy':        'Highway',
    'car.sp.comb':       'Combined',
    'car.sp.weight':     'Curb Weight',
    'car.sp.length':     'Length',
    'car.sp.width':      'Width',
    'car.sp.height':     'Height',
    'car.sp.wb':         'Wheelbase',
    'car.sp.gc':         'Ground Clearance',
    'car.sp.tank':       'Fuel Tank',
    'car.sp.trunk':      'Trunk Volume',
    'car.sp.sprice':     'Starting Price',
    'car.sp.tprice':     'Top Trim Price',
    'car.sp.seats':      'passengers',
    'car.sp.info':       'Infotainment',
    'car.sp.seating':    'Seating Capacity',
    'car.st.power':      'Max Power',
    'car.st.torque':     'Torque',
    'car.st.accel':      'Acceleration',
    'car.st.top':        'Top Speed',
    'car.st.engine':     'Engine',
    'car.st.comb':       'Combined',
    'car.st.weight':     'Curb Weight',
    'car.st.trunk':      'Trunk Volume',
    'car.check.title':   '⚠️ What to Check When Buying Used',
    'car.check.sub':     'These are the known issues and critical inspection points specific to this model. Always get a pre-purchase inspection from an independent mechanic.',
    'car.uni.title':     '📋 Universal Inspection Checklist',
    'car.uni.sub':       'Applies to any used car purchase:',
    'car.notfound':      'Car not found',
    'car.browse':        'Browse Cars',
    'car.seconds':       'seconds',
    'car.cyl':           'cyl',
    'car.stepless':      'Stepless (CVT)',

    /* ── Learn page ── */
    'learn.hero.title':  'Car Education Hub',
    'learn.hero.sub':    'Everything you need to know about how cars work — so you can buy with confidence.',
    'learn.pill.engines':     '🔧 Engines',
    'learn.pill.trans':       '⚙️ Transmission',
    'learn.pill.susp':        '🛞 Suspension',
    'learn.pill.brakes':      '🛑 Brakes',
    'learn.pill.safety':      '🛡️ Safety Tech',
    'learn.pill.buying':      '🛒 Buying Guide',
    'learn.pill.glossary':    '📖 Glossary',
    'learn.sec.engines':      '🔧 Engines',
    'learn.sec.trans':        '⚙️ Transmission',
    'learn.sec.susp':         '🛞 Suspension & Steering',
    'learn.sec.brakes':       '🛑 Braking Systems',
    'learn.sec.safety':       '🛡️ Modern Safety Technology',
    'learn.sec.buying':       "🛒 Used Car Buyer's Complete Guide",
    'learn.sec.glossary':     '📖 Car Terminology Glossary',
    'learn.footer':           'Carvi — Educational car information platform · ← Go to Battle',

    /* ── Quiz page ── */
    'quiz.hero.title':   '🧠 Car Quiz',
    'quiz.hero.sub':     'Guess legendary cars by their description. Are you a true car enthusiast?',
    'quiz.start.title':  'Ready for the Challenge?',
    'quiz.start.body':   '6 questions about iconic cars. Guess the make and model from the description.',
    'quiz.rule.1':       '6 questions of varying difficulty',
    'quiz.rule.2':       '1 hint per question (−10 points)',
    'quiz.rule.3':       '30-second timer — answer in time!',
    'quiz.rule.4':       'Your best score is saved',
    'quiz.start.btn':    'Start Quiz →',
    'quiz.hint.btn':     '💡 Hint (−10 points)',
    'quiz.hint.used':    '💡 Hint used',
    'quiz.lb.title':     '🏆 Leaderboard',
    'quiz.restart':      'Play Again',
    'quiz.tobattle':     '⚔️ Battle',
    'quiz.tolearn':      '📚 Learn',
    'quiz.maxpts':       'points out of 600',
  },

  ru: {
    /* ── Navbar ── */
    'nav.battle':  '⚔️ Батл',
    'nav.cars':    '🚗 Машины',
    'nav.tops':    '🏆 Топы',
    'nav.compare': '📊 Сравнить',
    'nav.learn':   '📚 Обучение',
    'nav.quiz':    '🧠 Викторина',

    'region.all':          'Все',
    'region.china':        'Китай',
    'region.cis':          'СНГ',
    'region.germany':      'Германия',
    'region.japan':        'Япония',
    'region.korea':        'Корея',
    'region.usa':          'США',
    'region.italy':        'Италия',
    'region.europe':       'Европа',
    'region.allCountries': 'Все страны',

    'tops.hero.title': '🏆 Топы по странам',
    'tops.hero.sub':   'Лучшие машины каждого сегмента по среднему рейтингу (производительность, надёжность, комфорт, цена, безопасность).',

    /* ── Battle ── */
    'battle.hero.title':    'Какую машину <span>ты выберешь?</span>',
    'battle.hero.sub':      'Нажми на машину · Свайп влево/вправо · Клавиши ← →',
    'battle.hint.left':     'Левая побеждает',
    'battle.hint.tap':      'Нажми на карточку',
    'battle.hint.right':    'Правая побеждает',
    'battle.stat.power':    'Мощность',
    'battle.stat.speed':    '0–100',
    'battle.stat.score':    'Рейтинг',
    'battle.result.chose':  'Вы выбрали',
    'battle.result.over':   'вместо',
    'battle.result.compare':'📊 Сравнение',
    'battle.result.next':   'Следующий →',
    'battle.footer.new':    '↻ Новая пара',
    'battle.footer.browse': 'Все машины',
    'battle.footer.compare':'📊 Сравнить',
    'battle.wins':          'побеждает! 🏆',
    'battle.cat':           'Категория',

    /* ── Cars ── */
    'cars.hero.title':  'База машин',
    'cars.hero.sub':    'Изучите характеристики и рейтинги каждой машины в нашем каталоге.',
    'cars.search':      'Поиск по марке или модели…',
    'cars.cat.all':     'Все категории',
    'cars.sort.name':   'Сортировка: А–Я',
    'cars.sort.power':  'Сортировка: Мощность',
    'cars.sort.accel':  'Сортировка: Разгон 0–100',
    'cars.sort.econ':   'Сортировка: Экономичность',
    'cars.sort.price':  'Сортировка: Цена',
    'cars.none':        'Машины не найдены.',
    'cars.hp':          'л.с.',
    'cars.lkm':         'л/100км',

    /* ── Compare ── */
    'compare.hero.title': 'Сравнение машин',
    'compare.hero.sub':   'Выберите две машины для детального сравнения всех характеристик.',
    'compare.btn':        '⚡ Сравнить',
    'compare.winner':     'Выше рейтинг',
    'compare.loser':      'Ниже рейтинг',
    'compare.overall':    'Итого',
    'compare.view':       'Подробнее',
    'compare.spec':       'Характеристика',
    'compare.legend':     'Легенда',
    'compare.green':      'Зелёный = лучше',
    'compare.red':        'Красный = хуже',
    'compare.alert':      'Выберите две разные машины.',
    'compare.s.perf':     '⚡ Динамика',
    'compare.s.engine':   '🔧 Двигатель',
    'compare.s.fuel':     '⛽ Расход топлива',
    'compare.s.dim':      '📐 Размеры и масса',
    'compare.s.price':    '💰 Цена',
    'compare.r.power':    'Мощность',
    'compare.r.torque':   'Кр. момент',
    'compare.r.accel':    '0–100 км/ч',
    'compare.r.top':      'Макс. скорость',
    'compare.r.drive':    'Привод',
    'compare.r.disp':     'Объём',
    'compare.r.config':   'Конфигурация',
    'compare.r.cyl':      'Цилиндры',
    'compare.r.fuel':     'Тип топлива',
    'compare.r.asp':      'Наддув',
    'compare.r.comp':     'Степень сжатия',
    'compare.r.city':     'Город',
    'compare.r.hwy':      'Трасса',
    'compare.r.comb':     'Смешанный',
    'compare.r.weight':   'Снаряж. масса',
    'compare.r.length':   'Длина',
    'compare.r.width':    'Ширина',
    'compare.r.height':   'Высота',
    'compare.r.wb':       'Колёсная база',
    'compare.r.gc':       'Клиренс',
    'compare.r.tank':     'Бак',
    'compare.r.trunk':    'Багажник',
    'compare.r.start':    'Цена от',
    'compare.r.top2':     'Топ комплект.',

    /* ── Ratings ── */
    'rt.performance':    'Динамика',
    'rt.fuelEfficiency': 'Экономичность',
    'rt.comfort':        'Комфорт',
    'rt.reliability':    'Надёжность',
    'rt.value':          'Ц/К',
    'rt.safety':         'Безопасность',

    /* ── Car detail ── */
    'car.tab.overview':  'Обзор',
    'car.tab.specs':     'Характеристики',
    'car.tab.exterior':  'Экстерьер',
    'car.tab.interior':  'Интерьер',
    'car.tab.safety':    'Безопасность',
    'car.tab.check':     'Гайд покупателя',
    'car.s.ratings':     'Рейтинги',
    'car.s.proscons':    'Плюсы и минусы',
    'car.s.about':       'Об автомобиле',
    'car.s.extdesign':   'Дизайн экстерьера',
    'car.s.extfeat':     'Особенности',
    'car.s.cabin':       'Описание салона',
    'car.s.intfeat':     'Особенности интерьера',
    'car.s.saferating':  'Рейтинг безопасности',
    'car.s.safesys':     'Системы безопасности',
    'car.crashlabel':    'Официальный рейтинг краш-теста',
    'car.compare':       '📊 Сравнить этот авто',
    'car.allcars':       '← Все машины',
    'car.sp.power':      'Мощность',
    'car.sp.torque':     'Кр. момент',
    'car.sp.accel':      '0–100 км/ч',
    'car.sp.top':        'Макс. скорость',
    'car.sp.drive':      'Привод',
    'car.sp.disp':       'Объём двигателя',
    'car.sp.config':     'Конфигурация',
    'car.sp.cyl':        'Цилиндры',
    'car.sp.fuel':       'Тип топлива',
    'car.sp.asp':        'Наддув',
    'car.sp.comp':       'Степень сжатия',
    'car.sp.trans':      'Тип',
    'car.sp.speeds':     'Ступени',
    'car.sp.city':       'Город',
    'car.sp.hwy':        'Трасса',
    'car.sp.comb':       'Смешанный',
    'car.sp.weight':     'Снаряж. масса',
    'car.sp.length':     'Длина',
    'car.sp.width':      'Ширина',
    'car.sp.height':     'Высота',
    'car.sp.wb':         'Колёсная база',
    'car.sp.gc':         'Клиренс',
    'car.sp.tank':       'Бак',
    'car.sp.trunk':      'Багажник',
    'car.sp.sprice':     'Цена от',
    'car.sp.tprice':     'Топ комплектация',
    'car.sp.seats':      'пасс.',
    'car.sp.info':       'Мультимедиа',
    'car.sp.seating':    'Вместимость',
    'car.st.power':      'Мощность',
    'car.st.torque':     'Момент',
    'car.st.accel':      'Разгон',
    'car.st.top':        'Макс. скорость',
    'car.st.engine':     'Двигатель',
    'car.st.comb':       'Смешанный',
    'car.st.weight':     'Масса',
    'car.st.trunk':      'Багажник',
    'car.check.title':   '⚠️ Что проверить при покупке с пробегом',
    'car.check.sub':     'Это известные проблемы и ключевые точки осмотра данной модели. Всегда заказывайте независимую предпродажную диагностику.',
    'car.uni.title':     '📋 Универсальный чеклист осмотра',
    'car.uni.sub':       'Применимо к любой покупке б/у авто:',
    'car.notfound':      'Автомобиль не найден',
    'car.browse':        'Все машины',
    'car.seconds':       'секунд',
    'car.cyl':           'цил.',
    'car.stepless':      'Бесступенчатая (вариатор)',

    /* ── Learn ── */
    'learn.hero.title':  'Автомобильный образовательный центр',
    'learn.hero.sub':    'Всё что нужно знать об устройстве машин — чтобы покупать уверенно.',
    'learn.pill.engines':     '🔧 Двигатели',
    'learn.pill.trans':       '⚙️ Трансмиссия',
    'learn.pill.susp':        '🛞 Подвеска',
    'learn.pill.brakes':      '🛑 Тормоза',
    'learn.pill.safety':      '🛡️ Безопасность',
    'learn.pill.buying':      '🛒 Гайд покупателя',
    'learn.pill.glossary':    '📖 Глоссарий',
    'learn.sec.engines':      '🔧 Двигатели',
    'learn.sec.trans':        '⚙️ Трансмиссия',
    'learn.sec.susp':         '🛞 Подвеска и рулевое',
    'learn.sec.brakes':       '🛑 Тормозные системы',
    'learn.sec.safety':       '🛡️ Современные системы безопасности',
    'learn.sec.buying':       '🛒 Полный гайд покупателя б/у авто',
    'learn.sec.glossary':     '📖 Глоссарий автомобильных терминов',
    'learn.footer':           'Carvi — Образовательная платформа об автомобилях · ← На батл',

    /* ── Quiz ── */
    'quiz.hero.title':   '🧠 Автовикторина',
    'quiz.hero.sub':     'Угадайте легендарные автомобили по описанию. Проверьте, настоящий ли вы автомобилист!',
    'quiz.start.title':  'Готовы к испытанию?',
    'quiz.start.body':   '6 вопросов о самых знаковых автомобилях в истории. Угадайте марку и модель по описанию.',
    'quiz.rule.1':       '6 вопросов разной сложности',
    'quiz.rule.2':       'По 1 подсказке на вопрос (−10 очков)',
    'quiz.rule.3':       'Таймер 30 секунд — успейте ответить',
    'quiz.rule.4':       'Лучший результат сохраняется',
    'quiz.start.btn':    'Начать викторину →',
    'quiz.hint.btn':     '💡 Подсказка (−10 очков)',
    'quiz.hint.used':    '💡 Подсказка использована',
    'quiz.lb.title':     '🏆 Таблица рекордов',
    'quiz.restart':      'Сыграть снова',
    'quiz.tobattle':     '⚔️ На батл',
    'quiz.tolearn':      '📚 Учиться',
    'quiz.maxpts':       'очков из 600',
  }
};

/* ================================================================
   ENGINE
   ================================================================ */
/* Russian-only product: the language is fixed, no toggle. */
let _lang = 'ru';

function getLang() { return _lang; }

function t(key) {
  return (TRANSLATIONS[_lang] && TRANSLATIONS[_lang][key])
      || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key])
      || key;
}

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('carbattle_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  applyI18n();
  if (typeof window.onLangChange === 'function') window.onLangChange(lang);
}

function toggleLang() {
  setLang(_lang === 'en' ? 'ru' : 'en');
}

function applyI18n() {
  /* textContent replacements */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.getAttribute('data-i18n'));
    if (v) el.textContent = v;
  });
  /* innerHTML replacements (for elements containing child tags like <span>) */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t(el.getAttribute('data-i18n-html'));
    if (v) el.innerHTML = v;
  });
  /* placeholder replacements */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = t(el.getAttribute('data-i18n-ph'));
    if (v) el.placeholder = v;
  });
  /* data-lang show/hide (for long bilingual content blocks) */
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === _lang ? '' : 'none';
  });
  /* lang toggle button */
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = _lang === 'en' ? 'RU' : 'EN';
  /* html lang attribute */
  document.documentElement.setAttribute('lang', _lang);
}

/* Auto-apply on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyI18n);
} else {
  applyI18n();
}
