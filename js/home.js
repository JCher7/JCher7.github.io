/* ============================================================================
   home.js  —  CORE CONCEPT 1: "Select Your Character" dashboard + project feed
   ----------------------------------------------------------------------------
   Renders PROFILE, PERSONAS, and PROJECTS from data.js, then handles the
   global persona filter. Filtering is reflected through Store so it persists
   across themes and into project.html.
   ========================================================================== */
(function Home() {
  const $ = (sel, root = document) => root.querySelector(sel);
  let openSkillByRole = null;          // set by initMindmap; called on character change

  /* ---- 1. Immediate-value identity block (renders synchronously) ---- */
  $("#hero-name").textContent = PROFILE.name;
  $("#hero-role").textContent = PROFILE.role;
  $("#hero-tagline").textContent = PROFILE.tagline;
  $("#hero-location").textContent = "📍 " + PROFILE.location;
  const resumeBtns = document.querySelectorAll("[data-resume]");
  resumeBtns.forEach((b) => (b.href = PROFILE.resume));
  document.querySelectorAll("[data-linkedin]").forEach((a) => (a.href = PROFILE.linkedin));

  /* ---- 2. Render the persistent persona RAIL (3 circles + clear) ---- */
  const rail = $("#rail");
  const select = (id) => {
    const cur = Store.get().filter;
    Store.set({ filter: cur === id ? null : id });   // toggle
  };

  PERSONAS.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "rail__btn";
    btn.type = "button";
    btn.style.setProperty("--p", `var(${p.accentVar})`);
    btn.dataset.persona = p.id;
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", `${p.alias} — ${p.title}`);
    btn.title = `${p.alias} · ${p.title}`;
    btn.innerHTML = `
      <span class="rail__avatar" aria-hidden="true">${AVATARS[p.id] || ""}</span>
      <span class="rail__label">${p.alias.replace(/^The /, "")}</span>`;
    btn.addEventListener("click", () => { select(p.id); btn.blur(); });  // blur → Enter hits console, not this
    rail.appendChild(btn);
  });

  // Clear / deactivate filtering, available any time from the rail.
  const railClear = document.createElement("button");
  railClear.className = "rail__clear";
  railClear.type = "button";
  railClear.title = "Show all / clear role";
  railClear.setAttribute("aria-label", "Show all — clear role filter");
  railClear.textContent = "⊘";
  railClear.addEventListener("click", () => { Store.set({ filter: null }); railClear.blur(); });
  rail.appendChild(railClear);

  /* ---- 3. Render everything into #sections ---- */
  const root = $("#sections");
  let blockNo = 0;

  // Prominent, numbered section header shared by every block.
  const head = (title, count) => {
    blockNo += 1;
    const no = String(blockNo).padStart(2, "0");
    const badge = count != null ? `<span class="block__count">${count}</span>` : "";
    return `<header class="block__head">
        <span class="block__no">${no}</span>
        <h2 class="block__title">${title}</h2>
        ${badge}<span class="block__rule"></span>
      </header>`;
  };

  // Append a non-card section block (used by Featured + the info sections).
  const addBlock = (title, count, inner) => {
    const block = document.createElement("section");
    block.className = "block";
    block.innerHTML = head(title, count) + inner;
    root.appendChild(block);
  };

  // Featured — press / media highlights (always shown, not persona-filtered).
  if (typeof FEATURED !== "undefined") addBlock("Featured", FEATURED.length,
    `<div class="feat-grid">${FEATURED.map((f) => `
      <a class="feat-card" href="${f.url}" target="_blank" rel="noopener">
        <span class="feat-card__thumb" data-type="${f.type}">
          <img src="${f.thumb}" alt="" loading="lazy" onerror="this.remove()">
          <span class="feat-card__badge">${f.type === "pdf" ? "PDF" : "Link"}</span>
        </span>
        <span class="feat-card__body">
          <span class="feat-card__src">${f.source}</span>
          <span class="feat-card__title">${f.title}</span>
          <span class="feat-card__desc">${f.description}</span>
          <span class="feat-card__cta">${f.type === "pdf" ? "Open PDF" : "Read more"} ↗</span>
        </span>
      </a>`).join("")}</div>`);

  // A project/role card. Rich entries (with `quest`) get a Start Quest CTA;
  // shorter profile entries render the same card without one.
  const cardHTML = (pr) => {
    const chips = pr.personas
      .map((id) => {
        const meta = PERSONAS.find((x) => x.id === id);
        return `<span class="chip" data-p="${id}">${meta.tag.split(" · ")[0]}</span>`;
      })
      .join("");
    const hasQuest = !!pr.quest;
    const title = hasQuest
      ? `<a href="project.html?p=${pr.id}">${pr.title}</a>` : pr.title;
    const cta = hasQuest
      ? `<a class="btn card__cta" href="project.html?p=${pr.id}">▶ Start Quest</a>`
      : "";
    return `
      <article class="card is-match${hasQuest ? "" : " card--plain"}" data-personas="${pr.personas.join(",")}">
        <div class="card__top">
          <div class="chips">${chips}</div>
          <span class="card__org">${pr.period}</span>
        </div>
        <h3 class="card__title">${title}</h3>
        <div class="card__org">${pr.org}</div>
        <p class="card__summary">${pr.summary}</p>
        <div class="card__skills eyebrow">${pr.skills.slice(0, 3).join(" · ")}</div>
        ${cta}
      </article>`;
  };

  // 3a. Card sections, grouped by LinkedIn section in SECTION_ORDER.
  const sections = [...SECTION_ORDER,
    ...[...new Set(PROJECTS.map((p) => p.section))].filter((s) => !SECTION_ORDER.includes(s))];
  sections.forEach((name) => {
    const items = PROJECTS.filter((p) => p.section === name);
    if (!items.length) return;
    const block = document.createElement("section");
    block.className = "block feed-section";
    block.dataset.section = name;
    block.innerHTML = head(name, items.length)
      + `<div class="project-grid">${items.map(cardHTML).join("")}</div>`;
    root.appendChild(block);
  });

  // Info sections (no cards, not affected by the persona filter).
  if (typeof SKILLS !== "undefined") {
    addBlock("Skills", null, mindmapHTML());
    const mapEl = root.querySelector(".mmap");
    if (mapEl) initMindmap(mapEl);
  }

  if (typeof EDUCATION !== "undefined") addBlock("Education", null,
    `<div class="mini-grid">${EDUCATION.map((e) => `
      <div class="mini">
        <h4>${e.school}</h4>
        <p class="muted" style="margin:.15rem 0 0">${e.detail}</p>
        ${e.period ? `<p class="eyebrow" style="margin:.4rem 0 0">${e.period}</p>` : ""}
      </div>`).join("")}</div>`);

  if (typeof HONORS !== "undefined") addBlock("Honors & Awards", HONORS.length,
    `<div class="mini-grid">${HONORS.map((h) => `
      <div class="mini">
        <h4>${h.title}</h4>
        <p class="eyebrow" style="margin:.3rem 0 0">${h.issuer}${h.date ? " · " + h.date : ""}</p>
        ${h.note ? `<p class="muted" style="margin:.5rem 0 0;font-size:.88rem">${h.note}</p>` : ""}
      </div>`).join("")}</div>`);

  if (typeof CERTIFICATIONS !== "undefined") addBlock("Certifications", CERTIFICATIONS.length,
    `<div class="mini-grid">${CERTIFICATIONS.map((c) => `
      <div class="mini">
        <h4>${c.name}</h4>
        <p class="eyebrow" style="margin:.3rem 0 0">${c.authority}${c.date ? " · " + c.date : ""}</p>
        ${c.url ? `<a class="cert-link" href="${c.url}" target="_blank" rel="noopener">Verify ↗</a>` : ""}
      </div>`).join("")}</div>`);

  /* ---- 4. Character dossier (stat sheet) helpers ---- */
  const dossierEl = $("#dossier");

  // SVG radar/spider chart from a persona's `stats` (values aligned to STAT_AXES).
  function buildRadar(values) {
    const n = values.length, cx = 50, cy = 50, R = 30, labelR = 40;
    const ang = (i) => (-90 + (360 / n) * i) * Math.PI / 180;
    const at = (i, r) => [(cx + r * Math.cos(ang(i))).toFixed(1), (cy + r * Math.sin(ang(i))).toFixed(1)];
    const ring = (f) => `<polygon class="radar-grid" points="${values.map((_, i) => at(i, R * f).join(",")).join(" ")}"/>`;
    const grid = [0.25, 0.5, 0.75, 1].map(ring).join("");
    const axes = values.map((_, i) => { const [x, y] = at(i, R); return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; }).join("");
    const dpts = values.map((v, i) => at(i, R * Math.max(0, Math.min(10, v)) / 10));
    const area = `<polygon class="radar-area" points="${dpts.map((p) => p.join(",")).join(" ")}"/>`;
    const dots = dpts.map((p) => `<circle class="radar-dot" cx="${p[0]}" cy="${p[1]}" r="1.5"/>`).join("");
    const labels = values.map((_, i) => { const [x, y] = at(i, labelR); return `<text class="radar-label" x="${x}" y="${(+y + 1.6).toFixed(1)}" text-anchor="middle">${STAT_AXES[i]}</text>`; }).join("");
    return `<svg viewBox="-12 -8 124 116" role="img" aria-label="Competency radar">${grid}${axes}${area}${dots}${labels}</svg>`;
  }

  function renderDossier(id) {
    if (!dossierEl) return;
    const p = id && PERSONAS.find((x) => x.id === id);
    if (!p) { dossierEl.hidden = true; dossierEl.innerHTML = ""; return; }
    dossierEl.style.setProperty("--p", `var(${p.accentVar})`);
    dossierEl.innerHTML = `
      <div class="dossier__portrait" aria-hidden="true">${AVATARS[p.id] || ""}</div>
      <div class="dossier__info">
        <span class="dossier__eyebrow">▶ Now playing · Class</span>
        <h3 class="dossier__name">${p.alias}</h3>
        <p class="dossier__role">${p.title}</p>
        <p class="dossier__quote">“${p.quote}”</p>
        <div class="dossier__skills">${p.signature.map((s) => `<span class="skill">${s}</span>`).join("")}</div>
      </div>
      <div class="dossier__radar">${buildRadar(p.stats)}</div>`;
    dossierEl.hidden = false;
  }

  /* ---- 5. Apply filter state to DOM (the actual Concept-1 behaviour) ---- */
  const statusEl = $("#feed-status");
  const filterbar = statusEl.closest(".filterbar");
  const dashHint = $("#dash-hint");

  Store.subscribe(({ filter }) => {
    // Rail circle active states + podium/dim on the rail
    document.querySelectorAll(".rail__btn").forEach((c) =>
      c.setAttribute("aria-pressed", String(c.dataset.persona === filter)));
    rail.classList.toggle("has-selection", !!filter);
    railClear.classList.toggle("is-shown", !!filter);
    if (dashHint) dashHint.hidden = !!filter;

    // Persona-tint the whole page (token override in tokens.css)
    if (filter) document.documentElement.dataset.character = filter;
    else document.documentElement.removeAttribute("data-character");

    // Reveal / hide the character dossier
    renderDossier(filter);

    // Open the matching skill group in the mindmap (accordion)
    if (openSkillByRole) openSkillByRole(filter);

    // Project cards: matches stay, non-matches collapse
    let matches = 0;
    document.querySelectorAll(".card").forEach((card) => {
      const tags = (card.dataset.personas || "").split(",");
      const isMatch = !filter || tags.includes(filter);
      card.classList.toggle("is-match", isMatch);
      card.classList.toggle("is-hidden", !!filter && !isMatch);
      if (isMatch) matches++;
    });

    // Hide whole section blocks that have no visible cards under the filter
    document.querySelectorAll(".feed-section").forEach((sec) => {
      const visible = sec.querySelectorAll(".card:not(.is-hidden)").length;
      sec.classList.toggle("is-empty", visible === 0);
    });

    // "NOW PLAYING AS" cue (clearing the role is handled by the rail's ⊘ button)
    if (filter) {
      const meta = PERSONAS.find((p) => p.id === filter);
      statusEl.textContent = `▶ NOW PLAYING AS: ${meta.alias} · ${matches} quest${matches === 1 ? "" : "s"}`;
      filterbar.classList.add("is-active");
    } else {
      statusEl.textContent = `Showing all ${PROJECTS.length} entries`;
      filterbar.classList.remove("is-active");
    }
  });

  /* ---- 6. Boot the cheat-code theme engine on this page ---- */
  Theme.init();

  /* ---- Skills mindmap: root on the left, collapsible category branches right ---- */
  function mindmapHTML() {
    const branch = (g) => `
      <div class="mbranch" data-roles="${(g.roles || []).join(",")}" style="--c: var(${g.colour || "--accent"})">
        <button class="mnode mnode--cat" type="button" aria-expanded="false">${g.group}</button>
        <div class="mleaves">${g.items.map((s) => `<span class="mnode mnode--leaf">${s}</span>`).join("")}</div>
      </div>`;
    return `<div class="mmap">
      <svg class="mmap__links" aria-hidden="true"></svg>
      <span class="mnode mnode--root">Skills</span>
      <div class="mmap__col mmap__col--right">${SKILLS.map(branch).join("")}</div>
    </div>`;
  }

  function initMindmap(map) {
    const svg = map.querySelector(".mmap__links");
    const root = map.querySelector(".mnode--root");
    const branches = [...map.querySelectorAll(".mbranch")];

    const draw = () => {
      const mr = map.getBoundingClientRect();
      const anchor = (el, side) => {
        const r = el.getBoundingClientRect();
        return { x: (side === "right" ? r.right : r.left) - mr.left, y: r.top + r.height / 2 - mr.top };
      };
      const curve = (a, b, col, w, op) => {
        const mx = (a.x + b.x) / 2;
        return `<path d="M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${mx.toFixed(1)} ${a.y.toFixed(1)} ${mx.toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
      };
      let d = "";
      branches.forEach((branch) => {
        const cat = branch.querySelector(".mnode--cat");
        const col = getComputedStyle(cat).color;
        d += curve(anchor(root, "right"), anchor(cat, "left"), col, 2.6, 0.85);
        if (branch.classList.contains("is-open")) {       // only draw to visible skills
          branch.querySelectorAll(".mnode--leaf").forEach((leaf) =>
            (d += curve(anchor(cat, "right"), anchor(leaf, "left"), col, 1.6, 0.45)));
        }
      });
      svg.innerHTML = d;
    };

    let raf;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };

    // Open exactly the given set of branches (closing the rest).
    const applyOpen = (set) => {
      branches.forEach((b) => {
        const open = set.includes(b);
        b.classList.toggle("is-open", open);
        b.querySelector(".mnode--cat").setAttribute("aria-expanded", String(open));
      });
      schedule();
    };
    // Manual click stays single-focus: open just this one (or close it).
    branches.forEach((b) =>
      b.querySelector(".mnode--cat").addEventListener("click", () =>
        applyOpen(b.classList.contains("is-open") ? [] : [b])));

    // Expose: a character opens ALL its related branches (up to 2);
    // no character (or no match) → everything closed.
    openSkillByRole = (role) =>
      applyOpen(role ? branches.filter((b) => (b.dataset.roles || "").split(",").includes(role)) : []);
    applyOpen([]);                                      // start with all branches closed

    requestAnimationFrame(draw);
    window.addEventListener("resize", schedule, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(map);
    new MutationObserver(schedule).observe(document.documentElement,
      { attributes: true, attributeFilter: ["data-theme"] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  }
})();
