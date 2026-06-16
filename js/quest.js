/* ============================================================================
   quest.js  —  CORE CONCEPT 2: the "Progress-Bar Reading Quest"
   ----------------------------------------------------------------------------
   Renders one PROJECTS entry (chosen by ?p=ID) as a case study with a fixed
   sidebar tracker. An IntersectionObserver checks off each lifecycle node as
   its section scrolls into view; 100% unlocks confetti + the PDF button.
   ========================================================================== */
(function Quest() {
  const $ = (s, r = document) => r.querySelector(s);
  const params = new URLSearchParams(location.search);
  const project = PROJECTS.find((p) => p.id === params.get("p")) || PROJECTS[0];

  /* ---- shared chrome (brand, resume, theme engine) ---- */
  $("#brand").innerHTML = `${PROFILE.name.split(" ")[0]}<span>.</span>`;
  document.querySelectorAll("[data-resume]").forEach((b) => (b.href = PROFILE.resume));
  document.title = `${project.title} — ${PROFILE.name}`;
  Theme.init();

  // Carry the selected character's colour tint into the case study (continuity).
  const character = Store.get().filter;
  if (character) document.documentElement.dataset.character = character;
  else document.documentElement.removeAttribute("data-character");

  // Esc returns to the main page. If the cheat keyboard is armed, theme.js
  // consumes the Esc first (stopImmediatePropagation) to just exit that mode,
  // so this only runs when the console isn't capturing.
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Escape") return;
    const t = e.target, tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable) return;
    window.location.href = "index.html#projects";
  });

  /* ---- header / lede ---- */
  $("#case-org").textContent = `${project.org} · ${project.period}`;
  $("#case-title").textContent = project.title;
  $("#case-lede").textContent = project.summary;
  $("#case-skills").innerHTML = project.skills
    .map((s) => `<span class="chip">${s}</span>`).join("");

  /* ---- render the 4 lifecycle phases (article) + sidebar nodes ---- */
  const article = $("#case-body");
  const nodeList = $("#quest-nodes");

  PHASE_META.forEach((meta, i) => {
    const phase = project.quest[meta.key] || {};
    const num = i + 1;

    // Article section
    const sec = document.createElement("section");
    sec.className = "phase";
    sec.id = `phase-${meta.key}`;
    sec.dataset.index = i;
    let metricsHTML = "";
    if (phase.metrics) {
      metricsHTML = `<div class="metric-grid">${phase.metrics
        .map((m) => `<div class="metric"><b>${m.value}</b><span>${m.label}</span></div>`)
        .join("")}</div>`;
    }
    sec.innerHTML = `
      <span class="phase__tag">Milestone ${num} · ${meta.tag}</span>
      <h2>${meta.label}</h2>
      ${phase.body || "<p class='muted'>Content coming soon.</p>"}
      ${metricsHTML}`;
    article.appendChild(sec);

    // Sidebar node (also a button → keyboard-jump to section)
    const node = document.createElement("button");
    node.type = "button";
    node.className = "quest__node";
    node.dataset.done = "false";
    node.dataset.target = sec.id;
    node.innerHTML = `
      <span class="quest__dot" aria-hidden="true">${num}</span>
      <span>
        <span class="quest__phase">${meta.tag}</span><br>
        <span class="quest__label">${meta.label}</span>
      </span>`;
    node.addEventListener("click", () =>
      sec.scrollIntoView({ behavior: "smooth", block: "start" }));
    nodeList.appendChild(node);
  });

  /* ---- progress + check-off logic ---- */
  const total = PHASE_META.length;
  const seen = new Set();
  const fill = $("#quest-fill");
  const pctEl = $("#quest-pct");
  const pdfBtn = $("#quest-pdf");
  pdfBtn.href = project.pdf || "#";
  let celebrated = false;

  const nodes = [...nodeList.children];
  const sections = PHASE_META.map((m) => $(`#phase-${m.key}`));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const idx = +e.target.dataset.index;
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        seen.add(idx);
        markDone(idx);
        setCurrent(idx);
      }
    });
    updateProgress();
  }, { threshold: [0.5], rootMargin: `-${0}px 0px -35% 0px` });

  sections.forEach((s) => io.observe(s));

  // Fallback: a short final section near the footer may never cross the 50%
  // threshold, so reaching the bottom of the page also completes the quest.
  window.addEventListener("scroll", () => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
    if (!nearBottom) return;
    sections.forEach((_, i) => { seen.add(i); markDone(i); });
    updateProgress();
  }, { passive: true });

  function markDone(idx) {
    const node = nodes[idx];
    if (node.dataset.done === "true") return;
    node.dataset.done = "true";
    // micro-animation: pop the dot
    const dot = node.querySelector(".quest__dot");
    dot.textContent = "✓";
    dot.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.4)" }, { transform: "scale(1.12)" }],
      { duration: 320, easing: "cubic-bezier(.2,1.5,.3,1)" }
    );
  }
  function setCurrent(idx) {
    nodes.forEach((n, i) => n.setAttribute("data-current", String(i === idx)));
  }
  function updateProgress() {
    const pct = Math.round((seen.size / total) * 100);
    fill.style.width = pct + "%";
    pctEl.textContent = pct + "% complete";
    if (pct === 100 && !celebrated) {
      celebrated = true;
      pdfBtn.classList.add("is-unlocked");
      celebrate();
    }
  }

  /* ---- celebration: stamp + confetti ---- */
  function celebrate() {
    const layer = $("#celebrate");
    // confetti
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = ["var(--accent)", "var(--accent-2)", "var(--p-social)", "var(--p-gov)"][i % 4];
      c.style.animationDelay = Math.random() * 0.4 + "s";
      layer.appendChild(c);
    }
    layer.classList.add("show");
    setTimeout(() => {
      layer.classList.remove("show");
      layer.querySelectorAll(".confetti").forEach((c) => c.remove());
    }, 2600);
  }
})();
