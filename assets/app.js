// Renders the guide from window.GUIDE (built by scripts/build_site.py).
(function () {
  const { categories, qa, datasets, previews } = window.GUIDE;
  const totalFunctions = categories.reduce((sum, c) => sum + c.functions.length, 0);

  // ---------- helpers ----------

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  // Escapes text and turns `backtick` parts into <code>.
  function richText(text) {
    return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function anchorId(category, fn) {
    return `${category.id}-${fn.id}`;
  }

  // ---------- page parts ----------

  function navHtml() {
    const links = categories.map((c) => `<a href="#${c.id}">${c.verb}</a>`).join("");
    return `
      <nav class="nav">
        <a class="brand" href="#top">pandas<span>.explained</span></a>
        <div class="nav-links">${links}<a href="#qa">Q&amp;A</a><a href="#cheatsheet">Cheat sheet</a></div>
      </nav>`;
  }

  function heroHtml() {
    return `
      <header class="hero" id="top">
        <p class="eyebrow">✦ ${totalFunctions} pandas functions · 7 stages · 1 workflow</p>
        <h1>Master data with Python,<br /><span class="grad">one function at a time.</span></h1>
        <p class="lead">Each function comes with a simple explanation, a shortcut tip, a common mistake to avoid,
          the code with its imports, and <strong>the output already shown</strong>, so you see exactly what it does.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#loading">Start learning →</a>
          <a class="btn" href="#cheatsheet">Open the cheat sheet</a>
        </div>
        <div class="mini-stats">
          <div class="mini-stat"><b>${totalFunctions}</b><span>functions</span></div>
          <div class="mini-stat"><b>7</b><span>workflow stages</span></div>
          <div class="mini-stat"><b>${qa.length}</b><span>Q&amp;A answers</span></div>
          <div class="mini-stat"><b>1</b><span>dataset to learn on</span></div>
        </div>
      </header>`;
  }

  function workflowHtml() {
    const steps = categories.map((c) => `
      <a class="flow-box" href="#${c.id}">
        <span class="step-num">${c.number}</span>
        <span class="flow-title">${c.verb}</span>
        <span class="tiny muted">${c.functions.length} functions</span>
      </a>`).join('<span class="flow-arrow">→</span>');

    return `
      <section class="section" id="workflow">
        <div class="section-header">
          <p class="section-label">The data workflow</p>
          <h2>Seven stages, in order</h2>
          <p class="lead">Every real project follows this path. Learn the stages in order and each one builds on the last.</p>
        </div>
        <div class="flow-row">${steps}</div>
      </section>`;
  }

  function dataHtml() {
    const otherFiles = datasets
      .filter((d) => !["sales.csv", "messy.csv"].includes(d.file))
      .map((d) => `<code>${d.file}</code>`).join(" ");

    return `
      <section class="section" id="data">
        <div class="section-header">
          <p class="section-label">The data</p>
          <h2>One dataset, used everywhere</h2>
          <p class="lead">Almost every example uses the same small sales table, so you can focus on what each
            function does to it. Only the Cleaning section uses a messy customer list, because clean data has nothing to fix.</p>
        </div>
        <div class="card preview">
          <div class="preview-head"><code>sales.csv</code><span class="tiny muted">40 orders · first 6 rows shown</span></div>
          <div class="out-table">${previews.sales}</div>
        </div>
        <div class="card preview">
          <div class="preview-head"><code>messy.csv</code><span class="tiny muted">used in Cleaning · blanks, a duplicate, extra spaces, mixed capitals</span></div>
          <div class="out-table">${previews.messy}</div>
        </div>
        <p class="muted small">The same data also comes in other formats for the Loading examples: ${otherFiles}</p>
      </section>`;
  }

  function outputHtml(output) {
    const parts = [];
    if (output.text) parts.push(`<pre class="out-text">${escapeHtml(output.text)}</pre>`);
    if (output.table) parts.push(`<div class="out-table">${output.table}</div>`);
    output.charts.forEach((src) => parts.push(`<img class="out-img" src="${src}" alt="Chart output" loading="lazy" />`));
    return parts.join("") || '<p class="muted small">Saves a file. Nothing is printed.</p>';
  }

  function functionCardHtml(category, fn) {
    const params = fn.params.map(([name, meaning]) => `
      <tr><td><code>${escapeHtml(name)}</code></td><td>${richText(meaning)}</td></tr>`).join("");

    return `
      <article class="fn-card card" id="${anchorId(category, fn)}">
        <div class="fn-info">
          <h3 class="fn-name">${escapeHtml(fn.name)}</h3>
          <p class="fn-summary">${richText(fn.summary)}</p>
          <pre class="signature">${escapeHtml(fn.signature)}</pre>
          <p>${richText(fn.explain)}</p>
          <div class="table-wrap"><table class="param-table">${params}</table></div>
          <div class="note tip"><span class="note-tag">⚡ Easy tip</span><p>${richText(fn.tip)}</p></div>
          <div class="note warn"><span class="note-tag">⚠ Common mistake</span><p>${richText(fn.mistake)}</p></div>
        </div>
        <div class="fn-demo">
          <div class="box">
            <div class="box-head"><span>Code</span><button class="small-btn copy-btn" data-copy="${anchorId(category, fn)}">Copy</button></div>
            <pre class="code hl">${fn.codeHtml}</pre>
          </div>
          <div class="box">
            <div class="box-head"><span>Output</span></div>
            <div class="output">${outputHtml(fn.output)}</div>
          </div>
        </div>
      </article>`;
  }

  function categoryHtml(category) {
    const jumps = category.functions.map((fn) => `
      <a class="chip" href="#${anchorId(category, fn)}">${escapeHtml(fn.name)}</a>`).join("");

    return `
      <section class="section category" id="${category.id}">
        <div class="section-header">
          <p class="section-label">${category.number} · ${category.title}</p>
          <h2>${category.title}</h2>
          <p class="lead">${escapeHtml(category.lead)}</p>
        </div>
        <div class="chips">${jumps}</div>
        ${category.functions.map((fn) => functionCardHtml(category, fn)).join("")}
      </section>`;
  }

  function qaHtml() {
    const stages = ["All", ...new Set(qa.map((item) => item.stage))];
    const filters = stages.map((stage, i) => `
      <button class="chip${i === 0 ? " active" : ""}" data-stage="${stage}">${stage}</button>`).join("");

    const rows = qa.map((item, i) => `
      <div class="qa-item" data-stage="${item.stage}">
        <button class="qa-row" aria-expanded="false">
          <span class="qa-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="qa-question">${richText(item.q)}</span>
          <span class="qa-answer">${richText(item.short)}</span>
          <span class="qa-cat">${item.stage}</span>
          <span class="qa-toggle">+</span>
        </button>
        <div class="qa-detail">
          <p>${richText(item.detail)}</p>
          <pre class="code hl">${item.codeHtml}</pre>
        </div>
      </div>`).join("");

    return `
      <section class="section" id="qa">
        <div class="section-header">
          <p class="section-label">Questions &amp; answers</p>
          <h2>Questions everyone asks</h2>
          <p class="lead">The confusing parts, answered quickly. Tap a question to see the full explanation and code.</p>
        </div>
        <div class="chips qa-filters">${filters}</div>
        <div class="qa-table">
          <div class="qa-head"><span>#</span><span>Question</span><span>Quick answer</span><span>Stage</span><span></span></div>
          ${rows}
        </div>
      </section>`;
  }

  function cheatSheetHtml() {
    const rows = categories.flatMap((category) => category.functions.map((fn) => `
      <tr data-target="${anchorId(category, fn)}" data-search="${escapeHtml(`${fn.name} ${fn.summary} ${category.title}`.toLowerCase())}">
        <td><span class="legend-tag">${category.verb}</span></td>
        <td><code>${escapeHtml(fn.name)}</code></td>
        <td>${richText(fn.summary)}</td>
      </tr>`)).join("");

    return `
      <section class="section" id="cheatsheet">
        <div class="section-header">
          <p class="section-label">Cheat sheet</p>
          <h2>All ${totalFunctions} functions on one page</h2>
          <p class="lead">Search by name or task, for example "missing", "join" or "chart". Click a row to jump to it.</p>
        </div>
        <input class="search" type="search" placeholder="Search functions…  (press / to focus)" />
        <div class="table-wrap card"><table class="recap-table">
          <thead><tr><th>Stage</th><th>Function</th><th>What it does</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        <p class="muted small empty-note" hidden>No function matches that search.</p>
      </section>`;
  }

  function footerHtml() {
    return `
      <footer class="footer">
        <p>pandas<span>.explained</span> · Simple guides to the functions you'll use every day.</p>
      </footer>`;
  }

  // ---------- interactions ----------

  function codeFor(anchor) {
    const [categoryId, ...rest] = anchor.split("-");
    const category = categories.find((c) => c.id === categoryId);
    return category.functions.find((f) => f.id === rest.join("-")).code;
  }

  function setupCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(codeFor(button.dataset.copy));
        button.textContent = "Copied ✓";
        setTimeout(() => { button.textContent = "Copy"; }, 1500);
      });
    });
  }

  function setupQa() {
    const section = document.getElementById("qa");
    section.querySelectorAll(".qa-row").forEach((row) => {
      row.addEventListener("click", () => {
        const open = row.parentElement.classList.toggle("open");
        row.setAttribute("aria-expanded", String(open));
      });
    });
    section.querySelector(".qa-filters").addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      section.querySelectorAll(".qa-filters .chip").forEach((c) => c.classList.toggle("active", c === chip));
      section.querySelectorAll(".qa-item").forEach((item) => {
        item.hidden = chip.dataset.stage !== "All" && item.dataset.stage !== chip.dataset.stage;
      });
    });
  }

  function setupCheatSheet() {
    const section = document.getElementById("cheatsheet");
    const search = section.querySelector(".search");
    const rows = [...section.querySelectorAll("tbody tr")];
    const emptyNote = section.querySelector(".empty-note");

    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      let shown = 0;
      rows.forEach((row) => {
        row.hidden = !row.dataset.search.includes(query);
        if (!row.hidden) shown += 1;
      });
      emptyNote.hidden = shown > 0;
    });

    rows.forEach((row) => row.addEventListener("click", () => {
      document.getElementById(row.dataset.target).scrollIntoView({ behavior: "smooth" });
    }));

    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !event.target.closest("input, textarea")) {
        event.preventDefault();
        search.focus();
        search.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  // ---------- start ----------

  document.getElementById("root").innerHTML = [
    navHtml(),
    "<main>",
    heroHtml(),
    workflowHtml(),
    dataHtml(),
    ...categories.map(categoryHtml),
    qaHtml(),
    cheatSheetHtml(),
    "</main>",
    footerHtml(),
  ].join("");

  setupCopyButtons();
  setupQa();
  setupCheatSheet();

  // The page is drawn by JavaScript, so jump to a #link only after it exists.
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
})();
