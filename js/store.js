/* ============================================================================
   store.js  —  GLOBAL STATE  (theme + active persona filter)
   ----------------------------------------------------------------------------
   Single source of truth, persisted to localStorage so BOTH the active theme
   AND the active character filter survive:
     - theme switches (brief: "filters must remain intact across themes"), and
     - navigation between index.html and project.html.
   Components subscribe; they never read localStorage directly.
   ========================================================================== */
const Store = (() => {
  const KEY = "jc_portfolio_state";
  const defaults = { theme: "default", filter: null };  // filter = persona id | null
  let state = load();
  const subs = new Set();

  function load() {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
    catch { return { ...defaults }; }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }
  function emit() { subs.forEach((fn) => fn(state)); }

  return {
    get: () => ({ ...state }),
    set(patch) { state = { ...state, ...patch }; persist(); emit(); },
    subscribe(fn) { subs.add(fn); fn(state); return () => subs.delete(fn); },
  };
})();
