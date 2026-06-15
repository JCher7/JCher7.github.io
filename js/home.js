/* ============================================================================
   home.js  —  CORE CONCEPT 1: "Select Your Character" dashboard + project feed
   ----------------------------------------------------------------------------
   Renders PROFILE, PERSONAS, and PROJECTS from data.js, then handles the
   global persona filter. Filtering is reflected through Store so it persists
   across themes and into project.html.
   ========================================================================== */
(function Home() {
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---- 1. Immediate-value identity block (renders synchronously) ---- */
  $("#brand").innerHTML = `${PROFILE.name.split(" ")[0]}<span>.</span>`;
  $("#hero-name").textContent = PROFILE.name;
  $("#hero-role").textContent = PROFILE.role;
  $("#hero-tagline").textContent = PROFILE.tagline;
  $("#hero-location").textContent = "📍 " + PROFILE.location;
  $("#hero-email").href = "mailto:" + PROFILE.email;
  const resumeBtns = document.querySelectorAll("[data-resume]");
  resumeBtns.forEach((b) => (b.href = PROFILE.resume));
  document.querySelectorAll("[data-linkedin]").forEach((a) => (a.href = PROFILE.linkedin));

  /* ---- 2. Render persona cards ---- */
  const personaGrid = $("#persona-grid");
  PERSONAS.forEach((p) => {
    const count = PROJECTS.filter((pr) => pr.personas.includes(p.id)).length;
    const card = document.createElement("button");
    card.className = "persona";
    card.type = "button";
    card.style.setProperty("--p", `var(${p.accentVar})`);
    card.dataset.persona = p.id;
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <span class="persona__portrait" aria-hidden="true">${AVATARS[p.id] || ""}</span>
      <span class="persona__alias">${p.alias}</span>
      <span class="persona__tag">${p.tag}</span>
      <span class="persona__title">${p.title}</span>
      <span class="muted" style="font-size:.88rem">${p.blurb}</span>
      <span class="persona__count">▸ ${count} case stud${count === 1 ? "y" : "ies"}</span>`;
    card.addEventListener("click", () => {
      const cur = Store.get().filter;
      Store.set({ filter: cur === p.id ? null : p.id });  // toggle
    });
    personaGrid.appendChild(card);
  });

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
      : `<span class="card__cta card__cta--static">Profile entry</span>`;
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

  // 3b. Info sections (no cards, not affected by the persona filter).
  const addBlock = (title, count, inner) => {
    const block = document.createElement("section");
    block.className = "block";
    block.innerHTML = head(title, count) + inner;
    root.appendChild(block);
  };

  if (typeof SKILLS !== "undefined") addBlock("Skills", null,
    `<div class="skills-wrap">${SKILLS.map((g) => `
      <div class="skills-group">
        <h4>${g.group}</h4>
        <div class="skill-chips">${g.items.map((s) => `<span class="skill">${s}</span>`).join("")}</div>
      </div>`).join("")}</div>`);

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

  /* ---- 4. Apply filter state to DOM (the actual Concept-1 behaviour) ---- */
  const statusEl = $("#feed-status");
  const clearBtn = $("#clear-filter");

  Store.subscribe(({ filter }) => {
    // Persona card active states
    document.querySelectorAll(".persona").forEach((c) =>
      c.setAttribute("aria-pressed", String(c.dataset.persona === filter)));

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

    // Status line + clear button visibility
    if (filter) {
      const meta = PERSONAS.find((p) => p.id === filter);
      statusEl.textContent = `Filtered → ${meta.title} · ${matches} shown`;
      clearBtn.hidden = false;
    } else {
      statusEl.textContent = `Showing all ${PROJECTS.length} entries`;
      clearBtn.hidden = true;
    }
  });

  clearBtn.addEventListener("click", () => Store.set({ filter: null }));

  /* ---- 5. Boot the cheat-code theme engine on this page ---- */
  Theme.init();
})();
