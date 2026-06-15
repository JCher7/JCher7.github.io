/* ============================================================================
   data.js  —  CONTENT LAYER  (the ONLY file you edit to update the site)
   ----------------------------------------------------------------------------
   Business content is fully decoupled from rendering logic and theme tokens.
   - PROFILE: the always-visible identity block (Concept: "immediate value").
   - PERSONAS: the three "Select Your Character" cards. `id` is the filter key.
   - PROJECTS: the feed + case-study source. `personas: []` wires each project
     to one or more persona filter keys. `quest[]` holds the 4 lifecycle
     milestones rendered by the Reading Quest on project.html.

   HOW TO ADD A PROJECT:
     1) Copy a PROJECTS entry, give it a unique `id` (used in project.html?p=ID).
     2) Tag it with personas: ["pm" | "gov" | "social"].
     3) Fill the four `quest` phases (keep the 4-phase lifecycle order).
     4) Set `pdf` to your exported case-study PDF path (or "#").
   ========================================================================== */

const PROFILE = {
  name: "Joshua Cher",
  role: "Information Systems Undergraduate · SMU",
  tagline: "Bridging IT delivery, governance & compliance, and community impact.",
  location: "Singapore",
  email: "joshua.cher.2024@computing.smu.edu.sg",
  linkedin: "https://www.linkedin.com/in/joshuacher",
  resume: "assets/Joshua-Cher-Resume.pdf",   // ← drop your résumé here
};

/* The three personas. `accentVar` maps to a token in tokens.css (--p-*). */
const PERSONAS = [
  {
    id: "pm",
    alias: "The Operator",
    title: "The IT Project Manager & Event Organizer",
    tag: "Delivery · Logistics · Ops",
    accentVar: "--p-pm",
    blurb: "Leads cross-functional teams, runs large-scale events, and keeps complex operations on schedule.",
  },
  {
    id: "gov",
    alias: "The Auditor",
    title: "The Governance & Compliance Analyst",
    tag: "PDPA · Risk · Audit",
    accentVar: "--p-gov",
    blurb: "Translates regulation into controls — data protection, DPIAs, and policy assurance.",
  },
  {
    id: "social",
    alias: "The Connector",
    title: "The Social Impact & Community Lead",
    tag: "Volunteering · Seniors · NGOs",
    accentVar: "--p-social",
    blurb: "Mobilises volunteers and partners to deliver sustained, measurable community outcomes.",
  },
];

/* Helper to keep quest phases consistent. Each project supplies 4 phases. */
const PHASE_META = [
  { key: "scope",      tag: "Initiative", label: "Scope & Community Need" },
  { key: "risk",       tag: "Analysis",   label: "Risk Assessment & Compliance Check" },
  { key: "execute",    tag: "Execution",  label: "Team Alignment & Event Logistics" },
  { key: "deliver",    tag: "Delivery",   label: "Systems Integration & Quantified Metrics" },
];

const PROJECTS = [
  {
    id: "pdpa-agent",
    title: "PDPA Compliance AI Agent",
    org: "Income Insurance Limited",
    period: "May 2026 – Present",
    personas: ["gov", "pm"],
    summary: "A conversational AI that answers PDPA questions from source documents with verifiable citations, and diffs internal notices against approved templates — runnable fully on-device.",
    skills: ["AI Application Development", "Python", "FastAPI", "RAG / Vector DB", "PDPA"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>The PDPA and related personal-data guidelines span hundreds of pages, making them hard to absorb during day-to-day compliance work at Income Insurance. The need: let a reviewer ask a plain-English question and get a trustworthy, source-grounded answer in seconds.</p>
        <p>Built as an exploratory project into AI engineering, scoped to two jobs reviewers actually do: <em>answering policy questions</em> and <em>checking internal documents against approved templates</em>.</p>`,
      },
      risk: {
        body: `<p>Because the tool handles sensitive regulatory and personal data, the core design constraint was that <strong>queries must never have to leave the machine</strong> — "a data-protection tool that ships its own queries to a cloud would be a funny irony."</p>
        <ul>
          <li>Answers are generated strictly from retrieved source passages; if the answer isn't in the sources, it says so rather than inventing one.</li>
          <li>Every answer carries clickable citations back to the source clause for human verification.</li>
          <li>Model layer is pluggable: cloud (Claude / GPT) for quality, or fully local (Ollama, open-weight) for zero data egress — switched by one config flag.</li>
        </ul>`,
      },
      execute: {
        body: `<p>Architected as decoupled services so each part can be swapped without touching the others:</p>
        <ul>
          <li><strong>Ingestion:</strong> source documents parsed and embedded locally with sentence-transformers.</li>
          <li><strong>Retrieval:</strong> a local vector database returns relevant passages per question.</li>
          <li><strong>Comparison:</strong> consent clauses / PDUS notices scored against approved templates with a word-level diff surfacing exactly what changed.</li>
          <li><strong>Interface:</strong> FastAPI backend with a lightweight web chat front end.</li>
        </ul>`,
      },
      deliver: {
        body: `<p>The result is a compliance assistant reviewers can trust because they can verify it — and that respects the data it handles by being able to run entirely offline.</p>`,
        metrics: [
          { value: "100%", label: "Citations on every answer" },
          { value: "0", label: "Bytes leave device (local mode)" },
          { value: "3", label: "Pluggable model providers" },
        ],
      },
    },
  },

  {
    id: "inspirar",
    title: "SMU Inspirar — Presidency & CSP Finale",
    org: "SMU Inspirar",
    period: "Jun 2025 – Jan 2026",
    personas: ["pm", "social"],
    summary: "Led 120 volunteers running weekly senior-engagement sessions across 27 centres, and co-organised the Community Service Project Finale uniting ~200 beneficiaries and partners.",
    skills: ["Project Management", "Team Leadership", "Event Management", "Stakeholder Engagement"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>Inspirar exists to enrich seniors' lives through meaningful weekly engagement. As President, the mandate was to sustain quality programming across a wide network of nursing homes, senior day-care, and active-ageing centres — while keeping 120 volunteers motivated.</p>`,
      },
      risk: {
        body: `<p>Running recurring sessions for a vulnerable beneficiary group across many sites raised real operational risks: volunteer reliability, session safety, partner expectations, and consistency of experience.</p>
        <ul>
          <li>Aligned with community partners on standards and expectations per centre.</li>
          <li>Designed sessions to be both impactful and <em>sustainable</em> — repeatable by rotating volunteers.</li>
          <li>Focused on a culture of empathy and inclusivity to keep volunteer drop-off low.</li>
        </ul>`,
      },
      execute: {
        body: `<p>Coordinated weekly sessions blending fun, learning, and social connection, while serving on the organising committee for the CSP Finale — a single large-scale event bringing partners and beneficiaries together.</p>
        <ul>
          <li>Volunteer scheduling and centre allocation across 27 sites.</li>
          <li>Cross-functional work with partners, volunteers, and staff to design initiatives.</li>
          <li>End-to-end event logistics for the ~200-person Finale.</li>
        </ul>`,
      },
      deliver: {
        body: `<p>Sharpened the ability to lead teams, manage complex multi-site programmes, and connect with diverse stakeholders — and reinforced a long-term commitment to social impact.</p>`,
        metrics: [
          { value: "120", label: "Volunteers led" },
          { value: "27", label: "Centres served" },
          { value: "~200", label: "Finale beneficiaries & partners" },
        ],
      },
    },
  },

  {
    id: "volunteerconnect",
    title: "VolunteerConnect",
    org: "Singapore Management University",
    period: "Aug 2025 – Nov 2025",
    personas: ["social", "pm"],
    summary: "A web app (team of 6) streamlining NGO volunteer recruitment, with an AI chatbot, an interactive opportunity map, community and impact tracking.",
    skills: ["React.js", "Node.js", "Supabase", "Google Maps API", "Firebase Auth"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>NGOs struggle to recruit volunteers, and volunteers struggle to find opportunities that fit. VolunteerConnect's goal: streamline recruitment for NGOs while helping volunteers discover suitable opportunities.</p>`,
      },
      risk: {
        body: `<p>Handling user accounts and location data meant authentication and data-handling had to be considered up front.</p>
        <ul>
          <li>Firebase Authentication for secure sign-in.</li>
          <li>Supabase as the managed data backend.</li>
          <li>Location features scoped to opt-in discovery rather than tracking.</li>
        </ul>`,
      },
      execute: {
        body: `<p><strong>My role:</strong> built the Opportunity Mapping feature with the Google Maps API — letting users visualise and filter opportunities by location, skills, and beneficiary type, with 3D street view to preview venues. Also contributed frontend styling across the app.</p>
        <ul>
          <li>Coordinated within a 6-person team on overlapping features.</li>
          <li>Integrated map, listings, community feed, analytics, and impact pages.</li>
        </ul>`,
      },
      deliver: {
        body: `<p>Delivered a working platform connecting volunteers and organisers, with location-based discovery and contribution tracking.</p>`,
        metrics: [
          { value: "6", label: "Team members" },
          { value: "5", label: "Core feature areas" },
          { value: "3D", label: "Street-view venue previews" },
        ],
      },
    },
  },

  {
    id: "rsaf-logistics",
    title: "Reservist Training Logistics & HR",
    org: "Republic of Singapore Air Force",
    period: "Jan 2024 – May 2024",
    personas: ["pm", "gov"],
    summary: "Managed NSmen HR functions and the logistical preparation of reservist training as a trainer, ensuring full compliance with training standards.",
    skills: ["Logistics Planning", "HR Management", "Microsoft Excel", "Training Delivery", "Compliance"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>Reservist (NSmen) call-ups require precise scheduling, selection, and record-keeping, plus training that meets fixed standards. As a trainer, the scope covered officer/specialist cadets and NSmen.</p>`,
      },
      risk: {
        body: `<p>Training must be delivered <strong>in compliance with training standards</strong> — a governance constraint with safety and readiness stakes.</p>
        <ul>
          <li>Maintained accurate NSmen records for selection and call-up.</li>
          <li>Ensured logistical preparation met facilitation and compliance requirements.</li>
        </ul>`,
      },
      execute: {
        body: `<p>Owned the HR and logistics pipeline end-to-end:</p>
        <ul>
          <li>Scheduling, selection, and record-keeping for reservist call-ups.</li>
          <li>Built Excel-based data management to organise NSmen records and logistical planning.</li>
          <li>Facilitated reservist training preparation as a trainer.</li>
        </ul>`,
      },
      deliver: {
        body: `<p>Recognised for performance and knowledge across the contract.</p>`,
        metrics: [
          { value: "3", label: "Awards (Serviceman of the Year & more)" },
          { value: "100%", label: "Training-standard compliance" },
          { value: "Excel", label: "Data system built for records" },
        ],
      },
    },
  },

  {
    id: "sportytown",
    title: "SportyTown — Sports Matchmaking App",
    org: "Singapore Management University",
    period: "Aug 2025 – Nov 2025",
    personas: ["pm"],
    summary: "A UI/UX Figma prototype (team of 6) for a sports matchmaking app — AI skill evaluation, smart game discovery, real-time slots, cost-splitting, and reliability ratings.",
    skills: ["Figma", "User Interface Design", "UX Research", "Prototyping"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>Everyday athletes find it hard to discover and organise games with players of similar skill. SportyTown's scope: a matchmaking app to find, join, and manage sports matches.</p>`,
      },
      risk: {
        body: `<p>Matchmaking quality and trust were the key UX risks addressed in the design.</p>
        <ul>
          <li>AI skill evaluation via video upload to keep games balanced.</li>
          <li>Player reliability ratings to reduce no-shows.</li>
          <li>Automated reminders and cost-splitting to reduce coordination friction.</li>
        </ul>`,
      },
      execute: {
        body: `<p>Worked with 5 other members to design the full prototype in Figma, including a theme that dynamically adapts to the user's primary sport, and smart filters for sport, time, and location.</p>`,
      },
      deliver: {
        body: `<p>Delivered a complete interactive Figma prototype covering the core matchmaking journey.</p>`,
        metrics: [
          { value: "6", label: "Team members" },
          { value: "AI", label: "Skill evaluation flow" },
          { value: "Dynamic", label: "Sport-based theming" },
        ],
      },
    },
  },

  {
    id: "community-service",
    title: "Grassroots Volunteering — Willing Hearts & Go Green",
    org: "Willing Hearts · Temasek JC",
    period: "Ongoing",
    personas: ["social"],
    summary: "Hands-on community service: preparing soup-kitchen meals at Willing Hearts and running annual Go Green recycling drives across HDB estates for charity.",
    skills: ["Community Service", "Volunteering", "Sustainability"],
    pdf: "#",
    quest: {
      scope: {
        body: `<p>Direct community need: daily meals for those who depend on them, and neighbourhood sustainability. Scope spans a soup kitchen and recurring estate-level recycling drives.</p>`,
      },
      risk: {
        body: `<p>Food-prep volunteering and estate collections need reliability and care for the people served and the partners involved.</p>
        <ul>
          <li>Consistent participation in daily meal-prep efforts.</li>
          <li>Annual, repeatable Go Green collection routes across HDB estates.</li>
        </ul>`,
      },
      execute: {
        body: `<p>Assisted meal preparation at the Willing Hearts soup kitchen, and collected recyclables — old newspapers and unwanted clothes — from HDB estates during Go Green Day.</p>`,
      },
      deliver: {
        body: `<p>Proceeds from recycling were donated to charity, supporting sustainability and community causes; meals contributed to daily provision for communities in need.</p>`,
        metrics: [
          { value: "Daily", label: "Meal-prep contribution" },
          { value: "Annual", label: "Go Green recycling drives" },
          { value: "→ Charity", label: "Recycling proceeds donated" },
        ],
      },
    },
  },
];
