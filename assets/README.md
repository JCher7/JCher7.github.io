# assets/

Drop your downloadable files here.

- **`Joshua-Cher-Resume.pdf`** — referenced by every "Download Resume" button.
  Set the exact filename in `js/data.js` → `PROFILE.resume`.
  (You can rename the `Profile (1).pdf` you exported from LinkedIn to this.)

- **Per-project case-study PDFs** — referenced by the "Download Full Project PDF"
  button that unlocks at 100% quest completion. Set each path in
  `js/data.js` → `PROJECTS[].pdf` (currently `"#"` placeholders).

- **Featured section** (`js/data.js` → `FEATURED`). Add:
  - `campus-buzz-csp-finale.pdf` — the Campus Buzz PDF (the card opens this).
  - `featured-campus-buzz.png` — thumbnail (the Q&A spotlight cover).
  - `featured-smu-newsroom.jpg` — thumbnail for the SMU Newsroom article.
  - `featured-cna938.jpg` — thumbnail for the CNA938 interview.
  Thumbnails are optional — if a file is missing the card still renders with a
  ★ placeholder. The SMU Newsroom and CNA938 cards link out to their URLs.
