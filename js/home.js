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

  /* ---- 3. Render project feed ---- */
  const feed = $("#project-grid");
  PROJECTS.forEach((pr) => {
    const chips = pr.personas
      .map((id) => {
        const meta = PERSONAS.find((x) => x.id === id);
        return `<span class="chip" data-p="${id}">${meta.tag.split(" · ")[0]}</span>`;
      })
      .join("");
    const el = document.createElement("article");
    el.className = "card is-match";
    el.dataset.personas = pr.personas.join(",");
    el.innerHTML = `
      <div class="card__top">
        <div class="chips">${chips}</div>
        <span class="card__org">${pr.period}</span>
      </div>
      <h3 class="card__title"><a href="project.html?p=${pr.id}">${pr.title}</a></h3>
      <div class="card__org">${pr.org}</div>
      <p class="card__summary">${pr.summary}</p>
      <div class="card__skills eyebrow">${pr.skills.slice(0, 3).join(" · ")}</div>
      <a class="btn card__cta" href="project.html?p=${pr.id}">▶ Start Quest</a>`;
    feed.appendChild(el);
  });

  /* ---- 4. Apply filter state to DOM (the actual Concept-1 behaviour) ---- */
  const statusEl = $("#feed-status");
  const clearBtn = $("#clear-filter");

  Store.subscribe(({ filter }) => {
    // Persona card active states
    document.querySelectorAll(".persona").forEach((c) =>
      c.setAttribute("aria-pressed", String(c.dataset.persona === filter)));

    // Project cards: match → top, others → dim then collapse
    let matches = 0;
    document.querySelectorAll(".card").forEach((card) => {
      const tags = (card.dataset.personas || "").split(",");
      const isMatch = !filter || tags.includes(filter);
      card.classList.toggle("is-match", isMatch);
      card.classList.toggle("is-hidden", !!filter && !isMatch);
      card.classList.toggle("is-dim", false);
      if (isMatch) matches++;
    });

    // Status line + clear button visibility
    if (filter) {
      const meta = PERSONAS.find((p) => p.id === filter);
      statusEl.textContent = `Filtered → ${meta.title} · ${matches} shown`;
      clearBtn.hidden = false;
    } else {
      statusEl.textContent = `Showing all ${PROJECTS.length} projects`;
      clearBtn.hidden = true;
    }
  });

  clearBtn.addEventListener("click", () => Store.set({ filter: null }));

  /* ---- 5. Boot the cheat-code theme engine on this page ---- */
  Theme.init();
})();
