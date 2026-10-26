// All site copy lives here. Edit this file to update the website.
// Write powers as 10^20; <Rich> renders them with a proper superscript.

export const profile = {
  name: "Heiko Hoppe",
  role: "AI Researcher",
  tagline: "Reinforcement learning for large and structured action spaces",
  affiliations: [
    { org: "MIT", detail: "Visiting Researcher", href: "https://www.mit.edu" },
    { org: "TU Munich", detail: "Ph.D. Candidate", href: "https://www.tum.de" },
  ],
  photo: "/heiko.jpg",
  email: "heiko.hoppe@tum.de",
  cv: "/Heiko_Hoppe_CV.pdf",
  bio: [
    "I'm a Ph.D. candidate at the Technical University of Munich, working with Maximilian Schiffer on reinforcement learning and operations research. Since July 2026 I'm also a visiting researcher at MIT, working with Cathy Wu.",
    "My research develops reinforcement learning algorithms that scale to the decisions real operations are made of: action spaces with up to 10^20 options, hard feasibility constraints, and many interacting agents. I build on combinatorial optimization, embedding it directly into learning pipelines, and apply the results to autonomous mobility, transportation and supply chains.",
    "Beyond papers, I work with industry partners to bring these methods into practice, from supply chain optimization to production scheduling. I enjoy teaching reinforcement learning and Python programming. When I'm not at a keyboard, I enjoy rowing, hiking, history and reading.",
  ],
};

export const links = {
  github: "https://github.com/heikofhh",
  scholar: "https://scholar.google.com/citations?user=_NDHCDwAAAAJ&hl=de",
  linkedin: "https://www.linkedin.com/in/heiko-hoppe-338983172/",
};

export const stats = [
  { value: "3", label: "first-author papers" },
  { value: "2×", label: "NeurIPS" },
  { value: "10^20", label: "actions, largest space tackled" },
  { value: "16", label: "theses & projects supervised" },
];

export const themes = [
  {
    title: "RL for large action spaces",
    text: "Policies that stay tractable with up to 10^20 discrete or hybrid actions, by reasoning about distance instead of enumerating options.",
  },
  {
    title: "RL for combinatorial problems",
    text: "Learning pipelines with optimization layers inside, so that every decision is feasible by construction, even under uncertainty.",
  },
  {
    title: "Multi-agent RL",
    text: "Aligning the incentives of individual agents with a global objective, so that large fleets of cooperating agents act in the system's interest.",
  },
  {
    title: "Autonomous mobility",
    text: "Dispatching and control of autonomous vehicle fleets and other transportation systems, evaluated on real-world data with up to 2000 agents.",
  },
];

export interface News {
  date: string;
  text: string;
  link?: { label: string; href: string };
}

export const news: News[] = [
  { date: "Sep 2026", text: "“Breaking the Grid” accepted at NeurIPS 2026." },
  { date: "Jul 2026", text: "Started as a visiting researcher at MIT, working with Cathy Wu." },
  {
    date: "Jun 2026",
    text: "Blog post on Structured Reinforcement Learning published on the MDSI Science Blog.",
    link: {
      label: "Read it",
      href: "https://www.mdsi.tum.de/en/mdsi/research/mdsi-science-blog/structured-reinforcement-learning/",
    },
  },
  { date: "Jan 2026", text: "Survey on Combinatorial Optimization Augmented Machine Learning on arXiv; revision received in Jul 2026." },
  { date: "Sep 2025", text: "“Structured Reinforcement Learning for Combinatorial Decision-Making” accepted at NeurIPS 2025." },
  { date: "Jul 2024", text: "Started my Ph.D. at TU Munich as a Linde/MDSI Ph.D. Fellow." },
];

export interface Figure {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  summary: string;
  highlight: string;
  tags: string[];
  links: { label: string; href: string }[];
  /** Interactive canvas figure shown inside the card. */
  figure?: "action-space" | "polytope" | "fleet";
  blogNote?: { text: string; label: string; href: string };
  /** Redrawn algorithm schemes (SVG components), collapsed by default. */
  scheme?: { kind: "dgrl" | "marl"; title: string };
  /** Static figures from elsewhere, collapsed by default. */
  schematics?: { title: string; figures: Figure[] };
}

export const publications: Publication[] = [
  {
    title: "Breaking the Grid: Distance-Guided Reinforcement Learning in Large Discrete Action Spaces",
    authors: ["Heiko Hoppe", "Fabian Akkerman", "Wouter van Heeswijk", "Maximilian Schiffer"],
    venue: "NeurIPS 2026",
    summary:
      "Distance-Guided RL explores through sampled dynamic neighborhoods in a latent action space and turns policy optimization into a regression task. It provably improves value locally on structured tasks and extends to hybrid continuous-discrete actions.",
    highlight: "Up to 10^20 actions · +66%",
    tags: ["Large action spaces", "Latent actions"],
    links: [{ label: "Paper", href: "https://arxiv.org/abs/2602.08616" }],
    figure: "action-space",
    scheme: { kind: "dgrl", title: "Show the algorithm schemes" },
  },
  {
    title: "Structured Reinforcement Learning for Combinatorial Decision-Making",
    authors: ["Heiko Hoppe", "Léo Baty", "Louis Bouvier", "Axel Parmentier", "Maximilian Schiffer"],
    venue: "NeurIPS 2025",
    summary:
      "An actor-critic method that places combinatorial optimization layers inside the actor and trains it end-to-end with Fenchel-Young losses, interpreted geometrically as a primal-dual algorithm. Evaluated on six environments with exogenous and endogenous uncertainty.",
    highlight: "Up to +92% on dynamic problems",
    tags: ["Combinatorial actions", "Fenchel-Young losses"],
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2505.19053" },
      {
        label: "NeurIPS",
        href: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/fe100e5e7bca984803f0e4c6e94a6a88-Abstract-Conference.html",
      },
      { label: "Blog", href: "https://www.mdsi.tum.de/en/mdsi/research/mdsi-science-blog/structured-reinforcement-learning/" },
      { label: "Code", href: "https://github.com/tumBAIS/Structured-RL" },
    ],
    figure: "polytope",
    blogNote: {
      text: "Prefer a gentler introduction? I wrote one for the MDSI Science Blog.",
      label: "Read the blog post",
      href: "https://www.mdsi.tum.de/en/mdsi/research/mdsi-science-blog/structured-reinforcement-learning/",
    },
    schematics: {
      title: "Show the training pipeline",
      figures: [
        {
          src: "/figures/srl-pipeline.svg",
          alt: "Diagram of the SRL pipeline. Inference: an encoder produces scores theta, and the combinatorial optimization layer returns a feasible action. Training: the scores are perturbed with Gaussian noise, the critic scores the resulting candidate actions, a softmax aggregates them into a target, and the Fenchel-Young loss updates the encoder.",
          width: 936,
          height: 333,
          caption: "The SRL pipeline: blue is inference, red is training. Figure from the MDSI Science Blog post on SRL.",
        },
      ],
    },
  },
  {
    title: "Global Rewards in Multi-Agent Deep Reinforcement Learning for Autonomous Mobility on Demand Systems",
    authors: ["Heiko Hoppe", "Tobias Enders", "Quentin Cappart", "Maximilian Schiffer"],
    venue: "L4DC 2024",
    summary:
      "Combines SAC with counterfactual Q-values so that each vehicle's learning signal reflects its contribution to the global objective, aligning individual incentives with the operator's profit.",
    highlight: "Global rewards, per-agent credit",
    tags: ["Multi-agent RL", "Mobility on demand"],
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2312.08884" },
      { label: "PMLR", href: "https://proceedings.mlr.press/v242/hoppe24a.html" },
      { label: "Code", href: "https://github.com/tumBAIS/GR-MADRL-AMoD" },
    ],
    figure: "fleet",
    scheme: { kind: "marl", title: "Show the algorithm" },
  },
  {
    title: "Combinatorial Optimization Augmented Machine Learning",
    authors: ["Maximilian Schiffer", "Heiko Hoppe", "Yue Su", "Louis Bouvier", "Axel Parmentier"],
    venue: "Received Revision",
    summary:
      "A methodological guide and research outlook on algorithms that embed combinatorial optimization oracles into learning pipelines, with a unifying framework and a taxonomy of problem settings.",
    highlight: "Survey & roadmap",
    tags: ["Survey", "ML + optimization"],
    links: [{ label: "Paper", href: "https://arxiv.org/abs/2601.10583" }],
  },
];

export interface Entry {
  org: string;
  orgHref?: string;
  role: string;
  period: string;
  points?: string[];
}

export const experience: Entry[] = [
  {
    org: "Technical University of Munich",
    orgHref: "https://www.tum.de",
    role: "Research Scientist",
    period: "Jul 2024 – today",
    points: [
      "Thesis topic: Scalable Reinforcement Learning for Industrial Applications.",
      "First-authored 3 papers in 2 years (2× NeurIPS, 1× L4DC).",
      "Invited talks at ICSP, MIT and the University of Twente.",
      "Reviewer for ICML and EJOR.",
      "Developed a machine learning algorithm for supply chain optimization for an enterprise software company: >80% solution time reduction at equal cost.",
      "Built a reinforcement learning algorithm for production scheduling: 50% improvement over baseline.",
      "Taught Introduction to Deep Reinforcement Learning (lecture & exercise, 400 participants) and Python Programming (seminar, 20 participants).",
      "Supervised 6 master's theses and 10 student projects.",
    ],
  },
  {
    org: "Boston Consulting group",
    role: "Consulting Intern",
    period: "Apr – Jun 2024",
    points: ["Received a 5.0 / 5.0 evaluation and a full-time return offer."],
  },
  {
    org: "Infineon Technologies",
    role: "Data Science Intern",
    period: "Jan – Mar 2024",
    points: ["Developed an explainable revenue forecasting algorithm that explained >90% of forecast variance."],
  },
  {
    org: "PwC",
    role: "Consulting Intern",
    period: "Jul – Sep 2021",
    points: ["Developed digital infrastructure strategies for government agencies."],
  },
  {
    org: "P3",
    role: "Working Student",
    period: "Mar – Nov 2020",
    points: [
      "Developed an IoT module for the automotive industry.",
    ],
  },
];

export const volunteering: Entry[] = [
  {
    org: "MIT Visiting Student Association",
    role: "Board Member, Treasury Officer",
    period: "Jul 2026 – today",
    points: ["Plan events for the visiting student community and ensure the association's financial continuity."],
  },
  {
    org: "Academy Consult München",
    role: "Student Consultant",
    period: "May 2019 – May 2024",
    points: [
      "Led the finance team, served as treasurer and key account manager.",
    ],
  },
  {
    org: "Because We Care",
    role: "Personal Finance Coach",
    period: "Jan 2022 – Mar 2024",
    points: ["Ran personal finance workshops at high schools and youth sports clubs, training >100 students."],
  },
  {
    org: "Integreat",
    role: "External Strategy Consultant",
    period: "May – Sep 2019",
    points: ["Led a student consulting team supporting the Europe-wide scaling of a refugee integration app."],
  },
];

export const education: Entry[] = [
  {
    org: "Massachusetts Institute of Technology",
    orgHref: "https://www.mit.edu",
    role: "Visiting Researcher · Advisor: Cathy Wu",
    period: "Jul 2026 – today",
  },
  {
    org: "Technical University of Munich",
    orgHref: "https://www.tum.de",
    role: "Ph.D., Reinforcement Learning and Operations Research · Advisor: Maximilian Schiffer",
    period: "Jul 2024 – today",
  },
  {
    org: "Polytechnique Montréal",
    orgHref: "https://www.polymtl.ca",
    role: "Visiting Researcher · Advisor: Quentin Cappart",
    period: "Jul – Oct 2023",
  },
  {
    org: "Technical University of Munich",
    orgHref: "https://www.tum.de",
    role: "M.Sc. Finance and Information Management · Grade 4.0 / 4.0, top 5%",
    period: "Oct 2021 – Dec 2023",
  },
  {
    org: "Technical University of Munich",
    orgHref: "https://www.tum.de",
    role: "B.Sc. Management and Technology · Grade 3.7 / 4.0, top 5%",
    period: "Oct 2018 – Sep 2021",
  },
  {
    org: "Gymnasium Gars",
    role: "Abitur (high school diploma) · Grade 4.0 / 4.0",
    period: "Feb 2015 – Jun 2018",
  },
];

export const honors = [
  {
    title: "Linde/MDSI Ph.D. Fellowship",
    date: "Jul 2024",
    text: "3-year Ph.D. scholarship of the Munich Data Science Institute for outstanding Ph.D. students in data science & AI at TUM",
  },
  { title: "FIM Scholarship", date: "Oct 2021", text: "Scholarship of FIM Alumni e.V. supporting outstanding FIM students" },
  {
    title: "TUMfast",
    date: "Oct 2020",
    text: "TUM scholarship for selected talents in finance, accounting and controlling, <10% acceptance rate",
  },
  {
    title: "Max Weber Program",
    date: "Oct 2018",
    text: "Part of the Studienstiftung, <10% acceptance rate",
  },
];

export const skills = [
  { label: "Programming", items: ["Python", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Julia", "R", "SQL"] },
  { label: "Infrastructure", items: ["Git", "Slurm (HPC)", "Linux / Bash", "Docker"] },
  {
    label: "Languages",
    items: ["German (native)", "English (full proficiency)", "French (basic knowledge)", "Latin (Großes Latinum)"],
  },
];

// Legal pages. Replace the bracketed placeholders before publishing.
export const legal = {
  name: "Heiko Hoppe",
  street: "[Street and house number]",
  city: "[Postal code, City]",
  country: "Germany",
  email: "heiko.hoppe@tum.de",
  updated: "October 2026",
};
