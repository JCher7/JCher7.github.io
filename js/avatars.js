/* ============================================================================
   avatars.js  —  PRESENTATION: "Select Your Character" portraits
   ----------------------------------------------------------------------------
   Inline SVG character busts (no emojis). Keyed by persona id from data.js.
   Accent parts use class hooks (.av-cloth/.av-badge/.av-frame) that inherit the
   card's --p token, so each portrait re-tints per persona AND per theme.
   Swap these freely — only the markup changes, not the wiring.
   ========================================================================== */
const AVATARS = {
  /* The Operator — headset + clipboard energy (IT PM / Event Organizer) */
  pm: `
  <svg viewBox="0 0 120 120" class="av-svg" role="img" aria-label="The Operator">
    <defs><clipPath id="clip-pm"><circle cx="60" cy="60" r="56"/></clipPath></defs>
    <circle class="av-frame" cx="60" cy="60" r="56"/>
    <g clip-path="url(#clip-pm)">
      <path class="av-cloth" d="M16 124 Q18 86 60 86 Q102 86 104 124 Z"/>
      <rect class="av-skin" x="51" y="70" width="18" height="20" rx="7"/>
      <circle class="av-skin" cx="60" cy="52" r="23"/>
      <path class="av-hair" d="M36 50 Q37 25 60 25 Q83 25 84 50 Q73 39 60 39 Q47 39 36 50Z"/>
      <circle class="av-eye" cx="52" cy="53" r="2.4"/>
      <circle class="av-eye" cx="68" cy="53" r="2.4"/>
      <path class="av-smile" d="M52 62 Q60 68 68 62"/>
      <path class="av-gear" d="M35 53 Q35 27 60 27 Q85 27 85 53"/>
      <rect class="av-badge" x="30" y="50" width="9" height="15" rx="3"/>
      <rect class="av-badge" x="81" y="50" width="9" height="15" rx="3"/>
      <path class="av-gear" d="M35 60 Q28 73 45 73"/>
      <circle class="av-badge" cx="47" cy="73" r="3"/>
    </g>
  </svg>`,

  /* The Auditor — glasses + shield (Governance / Compliance) */
  gov: `
  <svg viewBox="0 0 120 120" class="av-svg" role="img" aria-label="The Auditor">
    <defs><clipPath id="clip-gov"><circle cx="60" cy="60" r="56"/></clipPath></defs>
    <circle class="av-frame" cx="60" cy="60" r="56"/>
    <g clip-path="url(#clip-gov)">
      <path class="av-cloth" d="M16 124 Q18 86 60 86 Q102 86 104 124 Z"/>
      <path class="av-cloth-2" d="M54 86 L60 100 L66 86 Z"/>
      <rect class="av-skin" x="51" y="70" width="18" height="20" rx="7"/>
      <circle class="av-skin" cx="60" cy="52" r="23"/>
      <path class="av-hair" d="M36 48 Q36 24 60 24 Q86 24 84 52 Q80 36 58 38 Q44 39 41 52 Q38 50 36 48Z"/>
      <rect class="av-glass" x="44" y="49" width="13" height="10" rx="3"/>
      <rect class="av-glass" x="63" y="49" width="13" height="10" rx="3"/>
      <path class="av-glass" d="M57 54 H63"/>
      <path class="av-smile av-flat" d="M53 64 H67"/>
      <path class="av-badge" d="M86 78 L98 82 L98 92 Q98 100 86 104 Q74 100 74 92 L74 82 Z"/>
      <path class="av-frame" d="M82 90 l3 4 6 -8"/>
    </g>
  </svg>`,

  /* The Connector — warm smile + heart (Social Impact / Community) */
  social: `
  <svg viewBox="0 0 120 120" class="av-svg" role="img" aria-label="The Connector">
    <defs><clipPath id="clip-soc"><circle cx="60" cy="60" r="56"/></clipPath></defs>
    <circle class="av-frame" cx="60" cy="60" r="56"/>
    <g clip-path="url(#clip-soc)">
      <path class="av-cloth" d="M16 124 Q18 86 60 86 Q102 86 104 124 Z"/>
      <rect class="av-skin" x="51" y="70" width="18" height="20" rx="7"/>
      <circle class="av-skin" cx="60" cy="52" r="23"/>
      <path class="av-hair" d="M34 56 Q32 24 60 24 Q88 24 86 56 Q84 44 78 42 Q80 52 74 54 Q70 40 60 40 Q50 40 46 54 Q40 52 42 42 Q36 44 34 56Z"/>
      <circle class="av-cheek" cx="48" cy="60" r="4"/>
      <circle class="av-cheek" cx="72" cy="60" r="4"/>
      <circle class="av-eye" cx="52" cy="52" r="2.6"/>
      <circle class="av-eye" cx="68" cy="52" r="2.6"/>
      <path class="av-smile" d="M50 60 Q60 71 70 60"/>
      <path class="av-badge" d="M86 84 q-5 -5 -9 0 q-4 4 9 12 q13 -8 9 -12 q-4 -5 -9 0Z"/>
    </g>
  </svg>`,
};
