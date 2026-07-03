# Carvi

Static car-comparison web app. Swipe battles, car database (242 cars), side-by-side compare, quiz, and programmatic Russian SEO comparison pages.

No backend, no build step — just static HTML/CSS/JS.

## Structure

- `index.html` — swipe battles (pick which car you'd choose)
- `cars.html` — car database with search/filter
- `car.html?id=…` — car detail page
- `compare.html?a=…&b=…` — interactive side-by-side comparison
- `learn.html`, `quiz.html` — car knowledge & quiz
- `vs/` — 842 generated static Russian SEO comparison pages + hub `vs/index.html`
- `js/cars-data.js` — all car data + `buildCarSVG` body-type illustrations
- `js/i18n.js` — EN/RU UI translations
- `tools/gen-compare.js` — generator for the `vs/` SEO pages
- `sitemap.xml` — sitemap for the comparison pages (submit to Yandex.Webmaster / Google Search Console)

## Regenerate SEO comparison pages

After editing `js/cars-data.js`, rebuild the `vs/` pages and sitemap:

```bash
node tools/gen-compare.js https://YOUR-DOMAIN
```

Pass your live domain as the argument so `canonical` links and `sitemap.xml` use the correct URLs. Default is `https://carbattle.app`.

## Run locally

```bash
python -m http.server 8091
# open http://localhost:8091/
```
