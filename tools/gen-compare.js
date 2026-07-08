/* ============================================================
   Carvi — Programmatic SEO comparison-page generator
   Reads js/cars-data.js, emits static Russian /vs/*.html pages
   for meaningful car pairs (same body type + similar price),
   a hub index, and sitemap.xml.

   Run:  node tools/gen-compare.js  [siteOrigin]
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'vs');
const ORIGIN = (process.argv[2] || 'https://carvi.app').replace(/\/$/, '');

/* ── Load car data by evaluating cars-data.js in a sandbox ── */
const sandbox = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'cars-data.js'), 'utf8'), sandbox);
const cars = sandbox.getAllCars();
const buildCarSVG = sandbox.buildCarSVG;
const carBodyType = sandbox.carBodyType;

/* Static pages embed a real photo when the file exists at build time. */
function carVisual(car, size) {
  const photo = path.join(ROOT, 'img', 'cars', `${car.id}.webp`);
  if (fs.existsSync(photo)) {
    return `<img class="car-photo" src="../img/cars/${car.id}.webp" alt="${car.brand} ${car.model}" loading="lazy" style="max-width:${Math.round(size * 1.8)}px;margin:0 auto;">`;
  }
  return buildCarSVG(car.color, size, car.category);
}

/* ── Russian helpers ── */
const SEGMENT_RU = {
  sedan: 'седаны', suv: 'кроссоверы и внедорожники', hatch: 'хэтчбеки',
  pickup: 'пикапы', coupe: 'купе и спорткары', wagon: 'универсалы', minivan: 'минивэны',
};
const SEGMENT_ONE_RU = {
  sedan: 'седан', suv: 'кроссовер', hatch: 'хэтчбек',
  pickup: 'пикап', coupe: 'купе', wagon: 'универсал', minivan: 'минивэн',
};
const DRIVE_RU = { FWD: 'передний', RWD: 'задний', AWD: 'полный', '4WD': 'полный' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* Rubles only — same formatter and editorial rate as the site (cars-data.js). */
const money = (n) => sandbox.fmtRub(n);
const drive = (d) => DRIVE_RU[d] || d;
const name = (c) => `${c.brand} ${c.model}`;

/* ── Pair selection: same body type + similar price, top rivals per car ── */
const RIVALS_PER_CAR = 6;
const PRICE_RATIO_MIN = 0.6; // cheaper/dearer must be within ~1.67x

function priceOf(c) { return c.price.min; }

const pairs = new Map(); // key "idA__idB" (sorted) -> [a,b]
for (const car of cars) {
  const bt = carBodyType(car.category);
  const rivals = cars
    .filter((o) => o.id !== car.id && carBodyType(o.category) === bt)
    .map((o) => ({ o, ratio: Math.min(priceOf(car), priceOf(o)) / Math.max(priceOf(car), priceOf(o)) }))
    .filter((x) => x.ratio >= PRICE_RATIO_MIN)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, RIVALS_PER_CAR)
    .map((x) => x.o);
  for (const r of rivals) {
    const [x, y] = [car.id, r.id].sort();
    pairs.set(`${x}__${y}`, [car.id < r.id ? car : r, car.id < r.id ? r : car]);
  }
}

/* ── Winner logic (returns 'a' | 'b' | 'tie') ── */
const cmp = {
  cheaper: (a, b) => sign(b.price.min - a.price.min),
  faster: (a, b) => sign(b.performance.acceleration - a.performance.acceleration),
  powerful: (a, b) => sign(a.performance.power - b.performance.power),
  economical: (a, b) => sign(b.engine.consumption.combined - a.engine.consumption.combined),
  clearance: (a, b) => sign(a.dimensions.groundClearance - b.dimensions.groundClearance),
  trunk: (a, b) => sign(a.dimensions.trunkVolume - b.dimensions.trunkVolume),
};
function sign(x) { return x > 0 ? 'a' : x < 0 ? 'b' : 'tie'; }
function winnerName(w, a, b) { return w === 'a' ? name(a) : w === 'b' ? name(b) : '—'; }

/* ── Spec rows for the comparison table ── */
function specRows(a, b) {
  const rows = [
    ['Цена', 'от ' + money(a.price.min), 'от ' + money(b.price.min), cmp.cheaper(a, b), 'меньше'],
    ['Мощность, л.с.', a.performance.power, b.performance.power, cmp.powerful(a, b), 'больше'],
    ['Разгон 0–100 км/ч, с', a.performance.acceleration, b.performance.acceleration, cmp.faster(a, b), 'меньше'],
    ['Макс. скорость, км/ч', a.performance.topSpeed, b.performance.topSpeed, sign(a.performance.topSpeed - b.performance.topSpeed), 'больше'],
    ['Крутящий момент, Нм', a.performance.torque, b.performance.torque, sign(a.performance.torque - b.performance.torque), 'больше'],
    ['Привод', drive(a.performance.driveType), drive(b.performance.driveType), 'tie', ''],
    ['Двигатель', a.engine.configuration + (a.engine.displacement ? ` ${a.engine.displacement} л` : ''), b.engine.configuration + (b.engine.displacement ? ` ${b.engine.displacement} л` : ''), 'tie', ''],
    ['Коробка передач', a.transmission.type, b.transmission.type, 'tie', ''],
    ['Расход (смеш.), л/100км', a.engine.consumption.combined || '—', b.engine.consumption.combined || '—', cmp.economical(a, b), 'меньше'],
    ['Клиренс, мм', a.dimensions.groundClearance, b.dimensions.groundClearance, cmp.clearance(a, b), 'больше'],
    ['Багажник, л', a.dimensions.trunkVolume, b.dimensions.trunkVolume, cmp.trunk(a, b), 'больше'],
    ['Длина, мм', a.dimensions.length, b.dimensions.length, 'tie', ''],
    ['Масса, кг', a.dimensions.weight, b.dimensions.weight, 'tie', ''],
    ['Мест', a.interior.seats, b.interior.seats, 'tie', ''],
  ];
  return rows;
}

/* ── FAQ (schema.org Q&A + visible) ── */
function faq(a, b) {
  const cheaper = cmp.cheaper(a, b), faster = cmp.faster(a, b), econ = cmp.economical(a, b), clr = cmp.clearance(a, b);
  const items = [
    [`Что дешевле — ${name(a)} или ${name(b)}?`,
      cheaper === 'tie' ? `Стартовые цены ${name(a)} и ${name(b)} примерно равны.` :
      `Дешевле ${winnerName(cheaper, a, b)} — стартовая цена от ${money(Math.min(a.price.min, b.price.min))} против ${money(Math.max(a.price.min, b.price.min))}.`],
    [`Что быстрее разгоняется до 100 км/ч?`,
      faster === 'tie' ? `Разгон почти одинаковый — около ${a.performance.acceleration} с.` :
      `Быстрее ${winnerName(faster, a, b)}: ${Math.min(a.performance.acceleration, b.performance.acceleration)} с против ${Math.max(a.performance.acceleration, b.performance.acceleration)} с.`],
    [`Что экономичнее по расходу топлива?`,
      (!a.engine.consumption.combined || !b.engine.consumption.combined) ? `Одна из машин — электромобиль или гибрид, прямое сравнение расхода некорректно.` :
      econ === 'tie' ? `Расход в смешанном цикле примерно равный.` :
      `Экономичнее ${winnerName(econ, a, b)}: ${Math.min(a.engine.consumption.combined, b.engine.consumption.combined)} л/100км против ${Math.max(a.engine.consumption.combined, b.engine.consumption.combined)} л/100км.`],
    [`У какой машины больше клиренс?`,
      clr === 'tie' ? `Клиренс одинаковый — ${a.dimensions.groundClearance} мм.` :
      `Больше клиренс у ${winnerName(clr, a, b)}: ${Math.max(a.dimensions.groundClearance, b.dimensions.groundClearance)} мм против ${Math.min(a.dimensions.groundClearance, b.dimensions.groundClearance)} мм — это важно для плохих дорог.`],
    [`Какая машина мощнее?`,
      cmp.powerful(a, b) === 'tie' ? `Мощность одинаковая — ${a.performance.power} л.с.` :
      `Мощнее ${winnerName(cmp.powerful(a, b), a, b)}: ${Math.max(a.performance.power, b.performance.power)} л.с. против ${Math.min(a.performance.power, b.performance.power)} л.с.`],
  ];
  return items;
}

/* ── Verdict bullets ── */
function verdict(a, b) {
  const out = [];
  const push = (w, txtA, txtB) => { if (w === 'a') out.push(`✓ <b>${esc(name(a))}</b> ${txtA}`); else if (w === 'b') out.push(`✓ <b>${esc(name(b))}</b> ${txtB}`); };
  push(cmp.cheaper(a, b), 'дешевле при покупке', 'дешевле при покупке');
  push(cmp.faster(a, b), 'быстрее разгоняется', 'быстрее разгоняется');
  push(cmp.powerful(a, b), 'мощнее', 'мощнее');
  push(cmp.economical(a, b), 'экономичнее по топливу', 'экономичнее по топливу');
  push(cmp.clearance(a, b), 'выше клиренс для плохих дорог', 'выше клиренс для плохих дорог');
  push(cmp.trunk(a, b), 'вместительнее багажник', 'вместительнее багажник');
  return out;
}

/* ── Related comparisons (internal links) ── */
function relatedFor(carId, allKeys, limit = 6) {
  const rel = [];
  for (const key of allKeys) {
    const [x, y] = key.split('__');
    if (x === carId || y === carId) rel.push(key);
    if (rel.length >= limit) break;
  }
  return rel;
}

/* ── Shared nav + head ── */
const CSP = `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; frame-ancestors 'none';`;

function navHTML() {
  return `<nav class="navbar">
  <a href="../index.html" class="nav-brand"><div class="logo-icon">🏎</div>Carvi</a>
  <div class="nav-links">
    <a href="../index.html" class="nav-link">Подбор</a>
    <a href="../cars.html" class="nav-link">Машины</a>
    <a href="../tops.html" class="nav-link">Топы</a>
    <a href="../compare.html" class="nav-link">Сравнение</a>
    <a href="index.html" class="nav-link active">Сравнения</a>
  </div>
</nav>`;
}

function footerHTML() {
  return `<footer>
  <p>Carvi — в образовательных целях · <a href="https://t.me/+L7u6oPMltUFkODVi" rel="noopener">Telegram</a> · <a href="https://vk.com/public221880789" rel="noopener">ВКонтакте</a></p>
</footer>`;
}

const PAGE_CSS = `
  .vs-wrap{max-width:960px;margin:0 auto;padding:24px 20px 64px}
  .vs-crumbs{font-size:.82rem;color:var(--text-3);margin-bottom:14px}
  .vs-crumbs a{color:var(--text-2)}
  .vs-h1{margin-bottom:10px}
  .vs-lede{color:var(--text-2);font-size:1.02rem;margin-bottom:28px}
  .vs-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
  .vs-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;text-align:center}
  .vs-card .brand{color:var(--text-2);font-size:.8rem;text-transform:uppercase;letter-spacing:.05em}
  .vs-card .model{font-size:1.25rem;font-weight:700;margin:2px 0 6px}
  .vs-card .price{color:var(--accent);font-weight:600}
  .vs-svg{display:flex;justify-content:center;margin:8px 0}
  table.vs-tab{width:100%;border-collapse:collapse;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);overflow:hidden;margin-bottom:32px;font-size:.92rem}
  .vs-tab th,.vs-tab td{padding:11px 14px;text-align:center;border-bottom:1px solid var(--border-light)}
  .vs-tab th{background:rgba(255,255,255,.03);color:var(--text-2);font-weight:600}
  .vs-tab td.lbl{text-align:left;color:var(--text-2)}
  .vs-tab td.win{color:var(--success);font-weight:700}
  .vs-sec{margin:0 0 16px;font-size:1.3rem}
  .vs-verdict{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:18px 22px;margin-bottom:32px}
  .vs-verdict ul{list-style:none;display:grid;gap:8px}
  .vs-verdict li{color:var(--text-1)}
  .vs-faq{margin-bottom:32px}
  .vs-faq details{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 16px;margin-bottom:8px}
  .vs-faq summary{cursor:pointer;font-weight:600;color:var(--text-1)}
  .vs-faq p{margin-top:8px}
  .vs-rel{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
  .vs-rel a{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:.85rem;color:var(--text-2)}
  .vs-rel a:hover{border-color:var(--accent);color:var(--accent);text-decoration:none}
  .vs-cta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px}
  .vs-cta a{background:var(--accent);color:#fff;padding:10px 18px;border-radius:var(--r-sm);font-weight:600}
  .vs-cta a.ghost{background:transparent;border:1px solid var(--border);color:var(--text-1)}
  @media(max-width:560px){.vs-cards{grid-template-columns:1fr}}
`;

/* ── Build one comparison page ── */
function buildPage(a, b, allKeys) {
  const bt = carBodyType(a.category);
  const seg = SEGMENT_ONE_RU[bt] || 'автомобиль';
  const title = `${name(a)} или ${name(b)} — что выбрать? Сравнение характеристик`;
  const desc = `Подробное сравнение ${name(a)} и ${name(b)}: цена, мощность, разгon, расход, клиренс и багажник. Что лучше купить — разбираем по цифрам.`
    .replace('разгon', 'разгон');
  const rows = specRows(a, b);
  const faqItems = faq(a, b);
  const vd = verdict(a, b);
  const related = relatedFor(a.id, allKeys).concat(relatedFor(b.id, allKeys))
    .filter((k) => k !== `${a.id}__${b.id}`)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 8);

  const lede = `${name(a)} и ${name(b)} — два ${seg}а в близком ценовом диапазоне (от ${money(a.price.min)} против от ${money(b.price.min)}). ` +
    `${name(a)} предлагает ${a.performance.power} л.с. и разгон до 100 км/ч за ${a.performance.acceleration} с, ` +
    `${name(b)} — ${b.performance.power} л.с. и ${b.performance.acceleration} с. Ниже — сравнение по всем ключевым характеристикам.`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(([q, ans]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: ans.replace(/<[^>]+>/g, '') },
    })),
  };

  const rowsHTML = rows.map(([lbl, va, vb, w]) => `
      <tr><td class="lbl">${esc(lbl)}</td><td class="${w === 'a' ? 'win' : ''}">${esc(va)}</td><td class="${w === 'b' ? 'win' : ''}">${esc(vb)}</td></tr>`).join('');

  const faqHTML = faqItems.map(([q, ans]) => `
      <details><summary>${esc(q)}</summary><p>${ans}</p></details>`).join('');

  const relHTML = related.map((k) => {
    const [x, y] = k.split('__');
    const ca = cars.find((c) => c.id === x), cb = cars.find((c) => c.id === y);
    return `<a href="${x}-vs-${y}.html">${esc(name(ca))} vs ${esc(name(cb))}</a>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="referrer" content="no-referrer">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${ORIGIN}/vs/${a.id}-vs-${b.id}.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Carvi">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${ORIGIN}/og.png">
  <meta property="og:url" content="${ORIGIN}/vs/${a.id}-vs-${b.id}.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${ORIGIN}/og.png">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/themes.css">
  <script src="../js/theme.js"></script>
  <style>${PAGE_CSS}</style>
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
${navHTML()}
<div class="vs-wrap">
  <div class="vs-crumbs"><a href="../index.html">Carvi</a> → <a href="index.html">Сравнения</a> → ${esc(name(a))} vs ${esc(name(b))}</div>
  <h1 class="vs-h1">${esc(name(a))} или ${esc(name(b))} — что выбрать?</h1>
  <p class="vs-lede">${esc(lede)}</p>

  <div class="vs-cards">
    <div class="vs-card">
      <div class="vs-svg">${carVisual(a, 200)}</div>
      <div class="brand">${esc(a.brand)}</div>
      <div class="model">${esc(a.model)}</div>
      <div class="price">от ${money(a.price.min)}</div>
    </div>
    <div class="vs-card">
      <div class="vs-svg">${carVisual(b, 200)}</div>
      <div class="brand">${esc(b.brand)}</div>
      <div class="model">${esc(b.model)}</div>
      <div class="price">от ${money(b.price.min)}</div>
    </div>
  </div>

  <h2 class="vs-sec">Сравнение характеристик</h2>
  <table class="vs-tab">
    <thead><tr><th>Параметр</th><th>${esc(name(a))}</th><th>${esc(name(b))}</th></tr></thead>
    <tbody>${rowsHTML}
    </tbody>
  </table>

  <h2 class="vs-sec">Итог: кто в чём выигрывает</h2>
  <div class="vs-verdict"><ul>${vd.map((v) => `<li>${v}</li>`).join('')}</ul></div>

  <h2 class="vs-sec">Частые вопросы</h2>
  <div class="vs-faq">${faqHTML}
  </div>

  <div class="vs-cta">
    <a href="../compare.html?a=${a.id}&b=${b.id}">📊 Интерактивное сравнение</a>
    <a class="ghost" href="../car.html?id=${a.id}">${esc(name(a))} подробно</a>
    <a class="ghost" href="../car.html?id=${b.id}">${esc(name(b))} подробно</a>
  </div>

  <h2 class="vs-sec">Похожие сравнения</h2>
  <div class="vs-rel">
      ${relHTML}
  </div>
</div>
${footerHTML()}
</body>
</html>`;
}

/* ── Hub index page ── */
function buildIndex(keys) {
  const bySeg = {};
  for (const key of keys) {
    const [x] = key.split('__');
    const car = cars.find((c) => c.id === x);
    const bt = carBodyType(car.category);
    (bySeg[bt] ||= []).push(key);
  }
  const sections = Object.entries(bySeg).map(([bt, ks]) => {
    const links = ks.map((k) => {
      const [x, y] = k.split('__');
      const ca = cars.find((c) => c.id === x), cb = cars.find((c) => c.id === y);
      return `<a href="${x}-vs-${y}.html">${esc(name(ca))} vs ${esc(name(cb))}</a>`;
    }).join('\n      ');
    return `<h2 class="vs-sec">${esc((SEGMENT_RU[bt] || bt)[0].toUpperCase() + (SEGMENT_RU[bt] || bt).slice(1))}</h2>
  <div class="vs-rel">
      ${links}
  </div>`;
  }).join('\n\n  ');

  return `<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="referrer" content="no-referrer">
  <title>Сравнения автомобилей — Carvi</title>
  <meta name="description" content="Сравнения популярных автомобилей по характеристикам: цена, мощность, разгон, расход, клиренс. Китайские кроссоверы, бюджетные седаны и другие.">
  <link rel="canonical" href="${ORIGIN}/vs/index.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Carvi">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="Сравнения автомобилей — Carvi">
  <meta property="og:description" content="${keys.length} сравнений популярных машин по цене, мощности, разгону, расходу и клиренсу.">
  <meta property="og:image" content="${ORIGIN}/og.png">
  <meta property="og:url" content="${ORIGIN}/vs/index.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${ORIGIN}/og.png">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/themes.css">
  <script src="../js/theme.js"></script>
  <style>${PAGE_CSS}</style>
</head>
<body>
${navHTML()}
<div class="vs-wrap">
  <h1 class="vs-h1">Сравнения автомобилей</h1>
  <p class="vs-lede">${keys.length} подробных сравнений по цене, мощности, разгону, расходу и клиренсу. Выбирайте пару и разбирайтесь по цифрам.</p>
  ${sections}
</div>
${footerHTML()}
</body>
</html>`;
}

/* ── Sitemap ── */
function buildSitemap(keys) {
  const urls = [`${ORIGIN}/vs/index.html`].concat(keys.map((k) => {
    const [x, y] = k.split('__');
    return `${ORIGIN}/vs/${x}-vs-${y}.html`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
}

/* ── Write everything ── */
fs.mkdirSync(OUT_DIR, { recursive: true });
const keys = [...pairs.keys()].sort();
let n = 0;
for (const key of keys) {
  const [a, b] = pairs.get(key);
  const [x, y] = key.split('__');
  fs.writeFileSync(path.join(OUT_DIR, `${x}-vs-${y}.html`), buildPage(a, b, keys), 'utf8');
  n++;
}
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildIndex(keys), 'utf8');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(keys), 'utf8');

console.log(`Generated ${n} comparison pages + index + sitemap`);
console.log(`Output: ${OUT_DIR}`);
console.log(`Sitemap: ${path.join(ROOT, 'sitemap.xml')}`);
