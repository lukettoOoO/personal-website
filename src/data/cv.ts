export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  department: string;
  link?: string;
  technologies: string[];
  highlights: string[];
}

export interface EducationEntry {
  period: string;
  location: string;
  title: string;
  institution: string;
  website: string;
  field: string;
  skills: {
    languages: string[];
    systems: string[];
    devops: string[];
    web: string[];
  };
}

export interface CVProjectEntry {
  period: string;
  name: string;
  technologies: string[];
  highlights: string[];
  link: string;
}

export interface ExtracurricularEntry {
  period: string;
  title: string;
  institution: string;
  technologies: string[];
  highlights: string[];
  link: string;
}

export interface LanguageSkillItem {
  language: string;
  listening: string;
  reading: string;
  spokenProduction: string;
  spokenInteraction: string;
  writing: string;
}

export const personalDetails = {
  birthDate: '19/06/2004',
  birthPlace: 'Arad, Romania',
  nationality: 'Romanian',
  gender: 'Male',
  phone: '(+40) 753629772 (Mobile)',
  email: 'mihut.luca@yahoo.com',
  github: 'https://github.com/lukettoOoO',
  linkedin: 'www.linkedin.com/in/luca-mihut',
  homeAddress: 'Arad, Romania (Home)',
  secondAddress: 'Timișoara, Romania (Second Address)',
};

export const profile = {
  name: 'Luca-Adrian Mihuț',
  summary:
    'Computers & Information Technology student at Politehnica University of Timișoara, passionate about software engineering, Linux, and cloud infrastructure. Driven by practical learning, from developing applications and managing my own home lab to gaining hands-on industry experience.',
  location: 'Timișoara, Romania',
  email: 'mihut.luca@yahoo.com',
  github: 'https://github.com/lukettoOoO',
  linkedin: 'https://www.linkedin.com/in/luca-mihut',
};

export const experience: ExperienceEntry[] = [
  {
    role: 'CLOUD AI RAN INTERN',
    company: 'SC NOKIA NETWORKS SRL',
    period: '22/07/2026 – 16/09/2026',
    location: 'TIMISOARA, ROMANIA',
    department: 'Nokia Cloud AI RAN',
    technologies: [
      'Docker',
      'OpenShift (OCP/SNO)',
      'Kubernetes',
      'Linux (Rocky 9.4)',
      'SR-IOV',
      'HPE iLO',
      'SRE',
      'vCU / vDU',
    ],
    highlights: [
      'Planned and deployed containerized edge computing workloads (vCU / vDU) using Docker and Red Hat OpenShift (OCP / SNO).',
      'Executed bare-metal server bring-up for Single Node OpenShift (SNO), managing hardware cabling, prerequisites, and HPE iLO interfaces.',
      'Administered Rocky Linux 9.4 environments, configuring core IT services (DNS, DHCP) and high-performance SR-IOV network virtualization.',
      'Applied SRE principles, health monitoring, and system observability to ensure high availability across cloud nodes.',
    ],
  },
  {
    role: 'SOFTWARE ENGINEERING INTERN',
    company: 'NETROM SOFTWARE SRL',
    period: '22/06/2026 – 22/07/2026',
    location: 'TIMISOARA, ROMANIA',
    department: 'Netrom Summer Camp 2026',
    link: 'https://github.com/lukettoOoO/EcoMeal',
    technologies: ['C#', '.NET 8', 'Blazor Server', 'Entity Framework Core', 'SQL', 'Leaflet JS'],
    highlights: [
      'Developed EcoMeal, a full-stack web application built with ASP.NET Core Blazor Server (.NET 8) and Entity Framework Core following the Repository Pattern.',
      'Integrated Leaflet JS and OpenStreetMap REST APIs for interactive mapping, geocoding, and proximity-based business sorting.',
      'Implemented role-based access control (Customer/Business/Admin), relational database schemas in SQLite / SQL Server, and live order concurrency handling.',
    ],
  },
];

export const education: EducationEntry[] = [
  {
    period: '2023 – CURRENT',
    location: 'Timișoara, Romania',
    title: 'BACHELOR’S DEGREE IN COMPUTER SCIENCE AND INFORMATION TECHNOLOGY',
    institution:
      'Polytechnic University of Timisoara, Faculty of Automation and Computer Science, Computers & IT',
    website: 'https://ac.upt.ro/',
    field: 'Information and Communication Technologies',
    skills: {
      languages: ['Go', 'Python', 'C', 'Java', 'C#', 'PHP', 'TypeScript', 'SQL'],
      systems: ['Linux (Debian, Rocky Linux/Red Hat)', 'TCP/IP', 'SSH', 'Firewalls', 'DNS/DHCP'],
      devops: ['Docker', 'OpenShift', 'Kubernetes', 'Ansible', 'Nginx', 'Git'],
      web: ['Vue.js', 'ASP.NET Core', 'MySQL'],
    },
  },
];

export const skills = {
  languages: ['Go', 'Python', 'C', 'Java', 'C#', 'PHP', 'TypeScript', 'SQL'],
  systems: ['Linux (Debian, Rocky Linux/Red Hat)', 'TCP/IP', 'SSH', 'Firewalls', 'DNS/DHCP'],
  devops: ['Docker', 'OpenShift', 'Kubernetes', 'Ansible', 'Nginx', 'Git'],
  web: ['Vue.js', 'ASP.NET Core', 'MySQL'],
};

export const cvProjects: CVProjectEntry[] = [
  {
    period: '01/02/2026 – CURRENT',
    name: 'Home Lab',
    technologies: [
      'Proxmox VE',
      'Windows Server',
      'Debian Server',
      'Docker',
      'Linux',
      'Networking',
      'Nginx',
    ],
    highlights: [
      'Built a multi-node homelab running Debian Linux and Proxmox VE for virtual machines.',
      'Deployed Dockerized services (Nextcloud, GitLab, Netdata) with automated backup scripts.',
      'Configured secure remote access with Tailscale, Nginx reverse proxy, and UFW firewall rules.',
      'Administered a Windows Server 2022 virtual machine hosting Active Directory and local DNS services.',
    ],
    link: 'https://github.com/lukettoOoO/homelab',
  },
  {
    period: '01/03/2026 – CURRENT',
    name: 'Nextcloud Staff Timekeeping Plugin',
    technologies: ['Cloud Computing', 'PHP', 'Vue.js', 'Nextcloud'],
    highlights: [
      'Developing a Nextcloud plugin to automate faculty timekeeping and administrative workflows.',
      'Using a PHP engine for timetable parsing and a Vue.js interface for managing teaching activities.',
      'Generating compliance-ready reports, fully integrated with the Nextcloud API.',
    ],
    link: 'https://github.com/lukettoOoO/DCTI-Staff-Timekeeping-App',
  },
  {
    period: '01/10/2025 – 01/12/2025',
    name: 'Multi-threaded TCP Chat System',
    technologies: ['C', 'POSIX Threads', 'Sockets', 'TCP/IP'],
    highlights: [
      'Built a concurrent chat server and CLI client.',
      'Implemented thread-safe message handling using pthreads.',
      'Designed a custom binary protocol with checksum validation.',
    ],
    link: 'https://github.com/lukettoOoO/TCP-client-server-chat-system',
  },
];

export const extracurricular: ExtracurricularEntry = {
  period: '01/10/2025 – 01/02/2026',
  title: 'AI-Assisted Software Development Course',
  institution: 'Politehnica University Timisoara',
  technologies: ['GitHub Copilot', 'Google AI Studio', 'Gemini API'],
  highlights: [
    'Applied LLMs and prompt engineering for code generation, debugging, and rapid prototyping.',
    'Built an AI-driven interactive detective game using structured prompting techniques.',
    'Explored integrating AI tools into full-stack development workflows.',
  ],
  link: 'https://github.com/lukettoOoO/Noir',
};

export const languageSkills = {
  motherTongue: 'ROMANIAN',
  otherLanguages: [
    {
      language: 'ENGLISH',
      listening: 'B2',
      reading: 'B2',
      spokenProduction: 'B2',
      spokenInteraction: 'B2',
      writing: 'B2',
    },
    {
      language: 'GERMAN',
      listening: 'A2',
      reading: 'A2',
      spokenProduction: 'A2',
      spokenInteraction: 'A2',
      writing: 'A2',
    },
  ],
};

// Backwards compatibility alias
export const languages = languageSkills.otherLanguages.map((l) => ({
  name: l.language === 'ENGLISH' ? 'English' : 'German',
  level: l.language === 'ENGLISH' ? 'B2 - Independent user' : 'A2 - Basic user',
  listening: l.listening,
  reading: l.reading,
  spokenProduction: l.spokenProduction,
  spokenInteraction: l.spokenInteraction,
  writing: l.writing,
}));
