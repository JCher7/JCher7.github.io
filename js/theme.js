/* ============================================================================
   theme.js  —  CORE CONCEPT 3: gamepad cheat-code theme engine
   ----------------------------------------------------------------------------
   Two ways to change theme:
     1) CHEAT CONSOLE: press a SEQUENCE on the pad (up/down/left/right + A/B).
        - By CLICK: always works.
        - By KEYBOARD: must be ACTIVATED first (press Enter, or click "Activate").
          While active, arrow keys + A/B drive the pad and do NOT scroll the
          page; Esc (or Enter again) exits. State is shown at all times via the
          Activate button + a floating "ACTIVE" badge.
     2) INSTANT BUTTONS (footer): one click = one theme, no combo.

   Only writes `data-theme` on <html> + Store, so the persona filter survives.
   Wire-up:  Theme.init();
   ========================================================================== */
const Theme = (() => {
  const COMBOS = [
    { seq: ["L", "L", "B"],      theme: "cyber"  },
    { seq: ["U", "U", "A"],      theme: "cosmic" },
    { seq: ["D", "D", "A", "B"], theme: "arcade" },
  ];
  const LABELS = {
    default: "Enterprise", cyber: "Cyber Terminal",
    cosmic: "Constellation", arcade: "Retro Arcade",
  };
  const GLYPH = { U: "▲", D: "▼", L: "◀", R: "▶", A: "A", B: "B" };
  const KEYMAP = {
    ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
    KeyA: "A", KeyB: "B", KeyR: "C",   // "R" key = center ● (reset theme)
  };
  const MAXLEN = Math.max(...COMBOS.map((c) => c.seq.length));

  let buffer = [];
  let screenEl, hud, codesHud, idle = "default", idleTimer, armed = false;

  const apply = (t) => document.documentElement.setAttribute("data-theme", t);
  const isField = (el) => {
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  };
  const isInteractive = (el) =>
    !!(el.closest && el.closest("button, a, [tabindex]"));

  function init() {
    screenEl = document.querySelector(".cheat__screen");
    buildHud();
    buildCodesHud();

    document.querySelectorAll(".cbtn").forEach((b) =>
      b.addEventListener("click", () => press(b.dataset.key, b)));
    document.querySelectorAll("[data-theme-pill]").forEach((b) =>
      b.addEventListener("click", () => Store.set({ theme: b.dataset.themePill })));
    document.querySelectorAll(".cheat__power").forEach((p) =>
      p.addEventListener("click", () => setArmed(!armed)));

    document.addEventListener("keydown", onKey);

    Store.subscribe(({ theme }) => {
      apply(theme); idle = theme; renderIdle();
      document.querySelectorAll("[data-theme-pill]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.themePill === theme)));
    });

    renderPower(); renderIdle();
  }

  function onKey(e) {
    const t = e.target;
    if (isField(t)) return;                      // never interfere while typing

    // Enter toggles activation — but only when focus isn't on a real control
    // (so links/buttons keep working; the Activate button handles its own Enter).
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      if (!isInteractive(t)) { e.preventDefault(); setArmed(!armed); }
      return;
    }
    // Esc: if the keyboard is armed, just exit (and stop the event so page-level
    // Esc handlers — e.g. "back to home" on case studies — don't also fire).
    if (e.code === "Escape") {
      if (armed) { e.preventDefault(); e.stopImmediatePropagation(); setArmed(false); }
      return;
    }

    if (!armed) return;                          // inactive → arrows scroll normally
    const key = KEYMAP[e.code];
    if (!key) return;
    e.preventDefault();                          // active → capture, never scroll
    press(key, document.querySelector(`.cbtn[data-key="${key}"]`));
  }

  function setArmed(v) {
    armed = v;
    document.querySelectorAll(".cheat").forEach((c) => c.classList.toggle("is-armed", armed));
    if (hud) hud.hidden = !armed;
    if (codesHud) codesHud.hidden = !armed;       // top-right code list while active
    renderPower();
    if (armed) { screen("● keyboard active — use the pad", true); queueIdle(); }
    else { renderIdle(); }
  }
  function renderPower() {
    document.querySelectorAll(".cheat__power").forEach((p) => {
      p.setAttribute("aria-pressed", String(armed));
      p.classList.toggle("is-on", armed);
      p.innerHTML = armed
        ? '<span class="cheat__dot"></span> Keyboard ACTIVE'
        : 'Activate keyboard · <kbd>Enter</kbd>';
    });
  }
  function buildHud() {
    hud = document.createElement("div");
    hud.className = "cheat-hud"; hud.hidden = true;
    hud.setAttribute("role", "status");
    hud.innerHTML = '⌨ Cheat keyboard <b>ACTIVE</b> — use arrow keys + A/B · <kbd>Esc</kbd> to exit';

    // Small PERSISTENT reminder (always visible) that Enter opens the console.
    // On case-study pages it also notes Esc returns home.
    const reminder = document.createElement("div");
    reminder.className = "cheat-reminder";
    const onCase = !!document.querySelector(".case");
    reminder.innerHTML = 'Press <kbd>Enter</kbd> to activate console'
      + (onCase ? ' · <kbd>Esc</kbd> back' : '');

    const attach = () => { document.body.appendChild(hud); document.body.appendChild(reminder); };
    if (document.body) attach();
    else document.addEventListener("DOMContentLoaded", attach);
  }

  // Fixed top-right list of cheat codes — shown while the keyboard is active so
  // the codes are visible even when the console itself is scrolled out of view.
  function buildCodesHud() {
    const NAME = { cyber: "Cyber", cosmic: "Cosmic", arcade: "Arcade" };
    const cap = (k) => (k === "A" || k === "B")
      ? `<kbd>${k}</kbd>` : `<kbd data-dir="${k}"></kbd>`;
    const rows = COMBOS.map((c) =>
      `<li><b>${NAME[c.theme] || c.theme}</b><span>${c.seq.map(cap).join("")}</span></li>`).join("");
    codesHud = document.createElement("aside");
    codesHud.className = "codes-hud"; codesHud.hidden = true;
    codesHud.setAttribute("aria-label", "Cheat codes");
    codesHud.innerHTML = `
      <p class="codes-hud__title">⛶ Cheat Codes</p>
      <ul class="cheat__codes cheat__codes--hud">
        ${rows}
        <li><b>Reset</b><span><kbd>R</kbd></span></li>
        <li><b>Exit</b><span><kbd>Esc</kbd></span></li>
      </ul>`;
    const attach = () => document.body.appendChild(codesHud);
    if (document.body) attach();
    else document.addEventListener("DOMContentLoaded", attach);
  }

  function press(key, btn) {
    flashBtn(btn);
    if (key === "C") return reset();
    buffer.push(key);
    if (buffer.length > MAXLEN) buffer.shift();
    renderBuffer();
    const hit = COMBOS.find((c) => endsWith(buffer, c.seq));
    if (hit) { unlock(hit.theme); buffer = []; }
  }
  function unlock(theme) { Store.set({ theme }); screen(`✓ ${LABELS[theme]} unlocked`, true); queueIdle(); }
  function reset() { buffer = []; Store.set({ theme: "default" }); screen("↺ reset", true); queueIdle(); }

  function renderIdle() { if (screenEl && !buffer.length) screen(`theme: ${LABELS[idle]}`); }
  function renderBuffer() { clearTimeout(idleTimer); screen(buffer.map((k) => GLYPH[k]).join(" ") || "—"); queueIdle(); }
  function queueIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(() => { buffer = []; renderIdle(); }, 1600); }
  function screen(text, flash) {
    if (!screenEl) return;
    screenEl.textContent = text;
    if (flash) { screenEl.classList.remove("flash"); void screenEl.offsetWidth; screenEl.classList.add("flash"); }
  }
  function flashBtn(btn) { if (!btn) return; btn.classList.add("is-press"); setTimeout(() => btn.classList.remove("is-press"), 130); }
  const endsWith = (buf, seq) =>
    buf.length >= seq.length && seq.every((s, i) => buf[buf.length - seq.length + i] === s);

  return { init, COMBOS, LABELS };
})();
