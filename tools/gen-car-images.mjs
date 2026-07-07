/* ============================================================
   Carvi — batch car-image generation via Gemini API
   Generates consistent studio renders for priority cars and
   saves raw PNGs to img/cars/raw/{id}.png.
   Then run tools/convert-car-images.py to produce the WebP
   files the site actually serves (img/cars/{id}.webp).

   Setup (one time):
     1. Get a free API key at https://aistudio.google.com
     2. PowerShell:  $env:GEMINI_API_KEY = "your-key"

   Run:
     node tools/gen-car-images.mjs            # next 10 missing priority cars
     node tools/gen-car-images.mjs 25         # batch of 25
     node tools/gen-car-images.mjs toyota-camry lada-granta   # specific ids
   ============================================================ */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, 'img', 'cars', 'raw');
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

if (!API_KEY) {
  console.error('ERROR: set GEMINI_API_KEY first.');
  console.error('  PowerShell:  $env:GEMINI_API_KEY = "your-key"');
  console.error('  Get a key:   https://aistudio.google.com');
  process.exit(1);
}

/* ── Load car data ── */
const sandbox = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'cars-data.js'), 'utf8'), sandbox);
const cars = sandbox.getAllCars();
const byId = Object.fromEntries(cars.map((c) => [c.id, c]));

/* ── Priority: CIS market first (China/CIS/Korea + affordable mainstream) ── */
function priorityCars() {
  const cisBrands = new Set(['Lada', 'UAZ', 'Moskvich']);
  const chinaBrands = new Set(['Chery', 'Haval', 'Geely', 'Changan', 'Omoda', 'Jetour', 'Tank', 'Exeed', 'BYD', 'Li Auto', 'NIO']);
  const koreaBrands = new Set(['Hyundai', 'Kia', 'Genesis']);
  const mainstream = new Set(['Toyota', 'Volkswagen', 'Renault', 'Nissan', 'Skoda', 'Mazda', 'Honda', 'Suzuki', 'Mitsubishi']);
  const score = (c) => {
    if (cisBrands.has(c.brand)) return 0;
    if (chinaBrands.has(c.brand)) return 1;
    if (koreaBrands.has(c.brand) && c.price.min < 40000) return 2;
    if (mainstream.has(c.brand) && c.price.min < 40000) return 3;
    return 9;
  };
  return cars
    .filter((c) => score(c) < 9)
    .sort((a, b) => score(a) - score(b) || a.price.min - b.price.min);
}

/* ── The one fixed prompt template — consistency is the whole point ── */
function promptFor(car) {
  const bt = sandbox.carBodyType(car.category);
  const BODY = {
    sedan: 'sedan', suv: 'SUV crossover', hatch: 'hatchback', pickup: 'pickup truck',
    coupe: 'sports coupe', wagon: 'station wagon', minivan: 'minivan',
  }[bt] || 'car';
  return `Studio photo render of a ${car.year} ${car.brand} ${car.model} ${BODY}, ` +
    `3/4 front view, car facing left, pure white body color, ` +
    `light gray studio background, soft diffused lighting, glossy floor reflection, ` +
    `no license plate, no text anywhere on the car, no bumper stickers, ` +
    `single car only, centered, photorealistic, 16:9`;
}

/* ── Gemini image call ── */
async function generate(car) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: promptFor(car) }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 429) return { retry: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error('no image in response: ' + JSON.stringify(data).slice(0, 300));
  return { png: Buffer.from(part.inlineData.data, 'base64') };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Main ── */
const args = process.argv.slice(2);
let targets;
if (args.length && isNaN(Number(args[0]))) {
  targets = args.map((id) => byId[id]).filter(Boolean);
  const missing = args.filter((id) => !byId[id]);
  if (missing.length) console.warn('unknown ids skipped:', missing.join(', '));
} else {
  const batchSize = args.length ? Number(args[0]) : 10;
  targets = priorityCars()
    .filter((c) => !fs.existsSync(path.join(RAW_DIR, `${c.id}.png`)) &&
                   !fs.existsSync(path.join(ROOT, 'img', 'cars', `${c.id}.webp`)))
    .slice(0, batchSize);
}

fs.mkdirSync(RAW_DIR, { recursive: true });
console.log(`Generating ${targets.length} car image(s) with ${MODEL}…\n`);

let ok = 0, fail = 0;
for (const car of targets) {
  const out = path.join(RAW_DIR, `${car.id}.png`);
  process.stdout.write(`${car.brand} ${car.model} (${car.id}) … `);
  try {
    let r = await generate(car);
    if (r.retry) { console.log('rate-limited, waiting 30s'); await sleep(30000); r = await generate(car); }
    if (r.retry) throw new Error('still rate-limited — quota exhausted for today?');
    fs.writeFileSync(out, r.png);
    ok++;
    console.log(`OK (${Math.round(r.png.length / 1024)} KB)`);
  } catch (e) {
    fail++;
    console.log('FAIL: ' + e.message);
    if (/quota|exhausted|RESOURCE/i.test(e.message)) { console.log('\nStopping — daily quota reached.'); break; }
  }
  await sleep(4000); // be gentle with rate limits
}

console.log(`\nDone: ${ok} ok, ${fail} failed.`);
console.log('Review PNGs in img/cars/raw/, delete bad ones and re-run.');
console.log('Then convert:  python tools/convert-car-images.py');
