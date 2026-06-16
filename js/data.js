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

/* Shared radar axes — same order for all three personas so they're comparable.
   Each persona's `stats` array below supplies a value (0–10) per axis, in order. */
const STAT_AXES = ["Leadership", "Delivery", "Compliance", "Data / Tech", "Community"];

/* The three personas. `accentVar` maps to a token in tokens.css (--p-*).
   `stats` feeds the radar chart, `signature` the dossier skill chips,
   `quote` the dossier one-liner. */
const PERSONAS = [
  {
    id: "pm",
    alias: "The Operator",
    title: "The IT Project Manager & Event Organizer",
    tag: "Delivery · Logistics · Ops",
    accentVar: "--p-pm",
    blurb: "Leads cross-functional teams, runs large-scale events, and keeps complex operations on schedule.",
    quote: "Give me the scope and the deadline — I'll bring the team and the plan.",
    signature: ["Project Management", "Event Management", "Team Leadership", "Logistics"],
    stats: [9, 9, 6, 6, 7],
  },
  {
    id: "gov",
    alias: "The Auditor",
    title: "The Governance & Compliance Analyst",
    tag: "PDPA · Risk · Audit",
    accentVar: "--p-gov",
    blurb: "Translates regulation into controls — data protection, DPIAs, and policy assurance.",
    quote: "If it isn't in the source and it can't be verified, it doesn't ship.",
    signature: ["PDPA", "DPIAs", "Risk Assessment", "Data Management"],
    stats: [6, 7, 10, 9, 5],
  },
  {
    id: "social",
    alias: "The Connector",
    title: "The Social Impact & Community Lead",
    tag: "Volunteering · Seniors · NGOs",
    accentVar: "--p-social",
    blurb: "Mobilises volunteers and partners to deliver sustained, measurable community outcomes.",
    quote: "Behind every metric is a person — I build the teams that show up for them.",
    signature: ["Community Service", "Stakeholder Engagement", "Volunteer Leadership", "Event Planning"],
    stats: [8, 7, 5, 5, 10],
  },
];

/* Helper to keep quest phases consistent. Each project supplies 4 phases. */
const PHASE_META = [
  { key: "scope",      tag: "Initiative", label: "Scope & Community Need" },
  { key: "risk",       tag: "Analysis",   label: "Risk Assessment & Compliance Check" },
  { key: "execute",    tag: "Execution",  label: "Team Alignment & Event Logistics" },
  { key: "deliver",    tag: "Delivery",   label: "Systems Integration & Quantified Metrics" },
];

/* Feed groups, rendered in this order — mirrors your LinkedIn sections.
   Each PROJECTS entry sets `section` to one of these labels. */
const SECTION_ORDER = ["Experience", "Projects", "Volunteering"];

const PROJECTS = [
  {
    id: "pdpa-agent",
    section: "Projects",
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
    section: "Experience",
    title: "President",
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
    section: "Projects",
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
    section: "Experience",
    title: "Air Defense Weapon Specialist (Short-term Contract)",
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
    section: "Projects",
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

  /* ---- Shorter roles below are "profile entries": same card, but no quest
          case study (omit `quest`). They still group + filter by persona. ---- */

  {
    id: "income-dpo",
    section: "Experience",
    title: "Data Protection Intern",
    org: "Income Insurance Limited",
    period: "May 2026 – Present",
    personas: ["gov"],
    summary: "Supporting the Regulatory Compliance team in ensuring adherence to the PDPA — monitoring personal-data protection policies, reviewing Data Privacy Impact Assessments (DPIAs), and supporting data-breach management.",
    skills: ["PDPA", "DPIAs", "Data Breach Management"],
  },
  {
    id: "archery-secretary",
    section: "Experience",
    title: "Honorary General Secretary",
    org: "SMU Archery",
    period: "Jan 2026 – Present",
    personas: ["pm"],
    summary: "Overseeing administrative operations for the club — managing official documentation and stakeholder correspondence, and supporting the exco on event-participation records and membership matters for smooth day-to-day operations.",
    skills: ["Operations", "Documentation", "Stakeholder Management"],
  },
  {
    id: "maven-data",
    section: "Experience",
    title: "Data and Production Assistant",
    org: "Maven Potter",
    period: "Dec 2021 – Feb 2022",
    personas: ["gov", "pm"],
    summary: "Processed and organised client social-media data to support quantitative analysis of engagement, reach, and campaign performance, and assisted in producing marketing advertisements for clients.",
    skills: ["Data Management", "On-set Production", "Analytics"],
  },

  {
    id: "inspirar-volunteer",
    section: "Volunteering",
    title: "Student Volunteer",
    org: "SMU Inspirar (2024)",
    period: "Aug 2024 – Jan 2025",
    personas: ["social"],
    summary: "Ran weekly engagement sessions for seniors across various centres, promoting social connection and active ageing. This formative experience motivated me to take on greater responsibility as President of Inspirar 2025.",
    skills: ["Community Service", "Senior Care", "Teamwork"],
  },
  {
    id: "willing-hearts",
    section: "Volunteering",
    title: "Student Volunteer",
    org: "Willing Hearts",
    period: "Social Services",
    personas: ["social"],
    summary: "Assisted in preparing meals at the soup kitchen, contributing to daily efforts to provide food for communities in need.",
    skills: ["Community Service", "Volunteering"],
  },
  {
    id: "go-green",
    section: "Volunteering",
    title: "Go Green Volunteer",
    org: "Temasek Junior College",
    period: "Environment",
    personas: ["social"],
    summary: "Participated annually in Go Green Day, collecting recyclables such as old newspapers and unwanted clothes from HDB estates. Proceeds were donated to charity in support of sustainability and community causes.",
    skills: ["Sustainability", "Community Service"],
  },
];

/* ============================================================================
   PROFILE SECTIONS (non-feed, info-only). Rendered below the case studies.
   Edit freely — these drive the Skills / Education / Honors / Certs blocks.
   ========================================================================== */

const SKILLS = [
  { group: "Leadership & Management", items: ["Project Management", "Team Leadership", "Event Planning", "Event Management", "HR Management", "Training Delivery"] },
  { group: "Data & Engineering", items: ["AI Application Development", "Data Management", "Python", "Microsoft Excel", "Tableau", "MySQL", "PHP", "Node.js", "React.js", "Vue.js", "JavaScript", "HTML", "CSS", "Bootstrap", "Google Maps API"] },
  { group: "Design & Production", items: ["Figma", "User Interface Design", "On-set Production"] },
];

const EDUCATION = [
  { school: "Singapore Management University", detail: "Information Systems", period: "2024 – 2028" },
  { school: "Temasek Junior College", detail: "GCE 'A' Levels · Integrated Programme (IP)", period: "" },
];

const HONORS = [
  { title: "Professor Tan Teck Meng Endeavour Award", issuer: "Singapore Management University", date: "Jun 2026",
    note: "Awarded by SMU School of Accountancy in recognition of fortitude and resilience throughout my undergraduate journey — honouring students who embody perseverance and serve as role models." },
  { title: "Serviceman of the Year (2023)", issuer: "Republic of Singapore Air Force", date: "Dec 2023" },
  { title: "Airman of the Month", issuer: "Republic of Singapore Air Force", date: "Mar 2023" },
  { title: "Best-in-Knowledge Award", issuer: "Republic of Singapore Air Force", date: "" },
];

const CERTIFICATIONS = [
  { name: "Pilot Pen Community Champion Award (Elderly Issues)", authority: "Singapore Management University", date: "Apr 2026",
    url: "https://accredify.io/verify?id=28042bf7-8ba9-485e-b102-ffd12eea7548" },
  { name: "LIB001 Library Research Skills 2024-25", authority: "SMU Libraries", date: "Oct 2024",
    url: "https://accredify.io/verify?id=c8cd6a22-dc25-49e4-86f8-092460b381de" },
];
