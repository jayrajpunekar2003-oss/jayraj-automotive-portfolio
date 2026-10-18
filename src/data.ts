export const profile = {
  name: 'Jayraj Punekar',
  title: 'Automotive Design Engineer',
  location: 'Pune, Maharashtra, India',
  linkedIn: 'https://www.linkedin.com/in/jaypunekar811',
  email: 'jayrajpunekar2003@gmail.com',
  resumeUrl: '/Jayraj-Punekar-Resume.pdf',
}

export const projects = [
  {
    number: '01',
    title: 'MTE_MHD_S302_DP',
    type: 'AUTOONE ENGINEERING · AUTOMOTIVE INTERIOR PLASTICS',
    description: 'Front and rear door-panel armrest assembly development using CATIA V5. Project duration: approximately two months.',
    employer: 'AutoOne Engineering · Pune',
    component: 'Front & Rear Door Panel — Armrest Assembly',
    period: 'APPROX. 2 MONTHS',
    tags: ['CATIA V5', 'Close volume', 'Draft analysis', 'Clash analysis'],
    responsibilities: [
      'Inspected styling surfaces and assessed feasibility against manufacturing requirements.',
      'Developed close volumes for front and rear door-panel armrest components.',
      'Conducted draft analysis of styling surfaces and developed parts.',
      'Designed and integrated fixation features considering assembly and tooling requirements.',
      'Applied DFM principles and technical considerations throughout component development.',
      'Worked on associated armrest bezels and decorative trim.',
      'Performed clash analysis to identify potential interference within front and rear door-panel assemblies.',
    ],
    subprojects: [],
  },
  {
    number: '02',
    title: 'ATH_RSA_RM2_DP',
    type: 'AUTOONE ENGINEERING · AUTOMOTIVE INTERIOR PLASTICS',
    description: 'Automotive door-panel component development focused on styling-surface inspection, close volumes, and manufacturing-aware fixation features. Project duration: approximately two months.',
    employer: 'AutoOne Engineering · Pune',
    component: 'Automotive Door Panel Components',
    period: 'APPROX. 2 MONTHS',
    tags: ['CATIA V5', 'Surface inspection', 'Close volume', 'DFM'],
    responsibilities: [
      'Performed styling-surface inspection and draft analysis.',
      'Developed close volumes for automotive interior plastic components.',
      'Implemented fixation features considering manufacturing and assembly requirements.',
      'Applied technical and DFM considerations during component development.',
    ],
    subprojects: [],
  },
  {
    number: '03',
    title: 'ATH_TOG_TOGG_DP',
    type: 'AUTOONE ENGINEERING · AUTOMOTIVE INTERIOR PLASTICS',
    description: 'Front and rear door-panel assembly work spanning components from carriers to smaller interior trim parts.',
    employer: 'AutoOne Engineering · Pune',
    component: 'Front & Rear Door Panel Assemblies',
    period: '',
    tags: ['CATIA V5', 'Component development', 'Close volume', 'Door panels'],
    responsibilities: [
      'Worked on multiple front and rear door-panel components, from carrier components to smaller trim parts.',
      'Performed plastic component design activities involving close-volume development and associated technical requirements.',
      'Contributed to the development of multiple components within the door-panel assemblies.',
    ],
    subprojects: [],
  },
  {
    number: '04',
    title: 'Automotive Door Trim Panel',
    type: 'INDEPENDENT COMPONENT DESIGN STUDY',
    description: 'A practice study exploring door-trim surface development, component packaging, attachment features, and manufacturable geometry. The related map pocket and armrest studies are shown below.',
    employer: '',
    component: 'Interior Trim · Map Pocket · Armrest',
    period: 'PORTFOLIO STUDY',
    tags: ['Surface modelling', 'B-side features', 'Locators', 'Assembly'],
    responsibilities: [],
    subprojects: [
      {
        number: '04.1',
        title: 'Door Map Pocket',
        description: 'A visually exposed, function-oriented interior component. This design exercise focused on surface continuity, draft feasibility, and clean manufacturable geometry rather than complex engineering features.',
        approach: 'Starting from the supplied Class A surface, the approach prioritised visible-side aesthetic integrity, smooth mould release, and uniform wall thickness on the B-side.',
        considerations: [
          'Inspected and corrected Class A surface irregularities before proceeding.',
          'Established a Main Tooling Direction suitable for deep pocket geometry.',
          'Performed draft analysis (0.48°) to validate pocket walls in the main tooling direction.',
          'Created Class B surface with a controlled 2.5 mm offset to maintain consistent wall thickness.',
          'Built Class C surfaces carefully along pocket edges for proper closure.',
          'Converted the surface model into a solid and performed final draft checks.',
          'Created the parting line based on draft-analysis results.',
        ],
        tags: ['Class A surface', '0.48° draft', '2.5 mm Class B offset', 'Close volume'],
      },
      {
        number: '04.2',
        title: 'Automotive Armrest',
        description: 'A door-panel armrest design exercise focused on a clean visible surface, practical plastic geometry, and a manufacturable B-side.',
        approach: 'The design approach balances the styled Class A surface with the component envelope and supporting B-side geometry, then checks draft feasibility and surface closure for a mouldable part.',
        considerations: [
          'Reviewed the supplied styling surface and identified the visible Class A region.',
          'Defined a suitable tooling direction for the armrest geometry.',
          'Evaluated draft feasibility on relevant walls in the selected tooling direction.',
          'Developed offset B-side surfaces with attention to consistent wall thickness.',
          'Created closing surfaces around the component boundary.',
          'Developed the closed component and reviewed its draft and tooling considerations.',
          'Considered the armrest interface with adjacent door-trim components.',
        ],
        tags: ['Class A surface', 'Tooling direction', 'B-side development', 'Door trim'],
      },
    ],
  },
]

export const skillGroups = [
  {
    title: 'CAD SOFTWARE',
    code: '01',
    items: [
      ['CATIA V5', 'Primary CAD platform — Generative Shape Design, Part Design, surface operations, assemblies, drafting, and analysis.'],
      ['Siemens NX', 'Basic part modelling, assembly modelling, and drafting.'],
      ['AutoCAD', '2D drafting, engineering drawings, and basic dimensioning.'],
    ],
  },
  {
    title: 'PLASTIC PRODUCT DESIGN',
    code: '02',
    items: [
      ['Interior trim', 'Automotive plastic trim component development and packaging considerations.'],
      ['B-side engineering', 'Foundational design of ribs, bosses, locators, snaps, and mounting interfaces.'],
      ['Mouldability', 'Close volume, draft, tooling direction, and design-for-manufacturability fundamentals.'],
    ],
  },
  {
    title: 'ENGINEERING PRACTICE',
    code: '03',
    items: [
      ['Surface development', 'Wireframe and surface workflow, trimming, joining, offsetting, and continuity awareness.'],
      ['DFM / DFA', 'Manufacturability and assembly considerations applied during component development.'],
      ['Engineering drawings', 'Drawing interpretation, GD&T fundamentals, and technical documentation.'],
    ],
  },
]

export const hotspots = [
  ['Class-A surface', 'The visible styling surface is the reference for transitions, appearance, and downstream component development.'],
  ['Close volume', 'A surface-based definition is closed into a manufacturable solid while preserving the intended design envelope.'],
  ['Screw boss', 'A mounting feature for fastening; wall thickness, support, and tool access should be considered.'],
  ['Ribs & dog houses', 'Reinforcing and attachment geometry supports stiffness and packaging while managing moulding risk.'],
  ['Locators & snaps', 'Positioning and retention interfaces help components locate and engage during assembly.'],
  ['Tooling direction', 'A direction assessment informs draft, parting strategy, and potential undercut review.'],
]
