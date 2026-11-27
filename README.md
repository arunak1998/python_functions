# pandas.explained

A simple guide to 56 pandas functions across 7 stages: Load, Explore, Clean, Transform, Aggregate, Analyze, Visualize.
Each function has an explanation, key parameters, an easy tip, a common mistake, the code, and its output.

## Open it

Double-click `index.html`. Nothing to install, no server needed.

## Edit content

1. Change text or code in `src/data/categories/*.js` (or `src/data/qa.js`).
2. Rebuild the outputs:  `python3 scripts/build_site.py`
   (runs every example with pandas and saves outputs to `assets/content.js` and charts to `assets/charts/`)
3. Refresh the page.

`python3 scripts/make_data.py` regenerates the practice data in `data/`.

## Put it online

Upload the folder to Vercel (or Netlify / GitHub Pages) as a static site. There's no build step.
