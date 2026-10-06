export interface ProjectEntry {
  name: string;
  description: string;
  stack: string[];
  highlights: string[];
  period: string;
  icon: string;
  url: string;
}

export const projects: ProjectEntry[] = [
  {
    name: 'Home Lab',
    description:
      'Multi-node Proxmox and Debian homelab with Dockerized services, backups, and secure remote access.',
    stack: ['Proxmox VE', 'Debian', 'Docker', 'Nginx', 'Tailscale'],
    highlights: [
      'Built a multi-node homelab running Debian Linux and Proxmox VE for virtual machines.',
      'Deployed Nextcloud, GitLab, and Netdata with automated backup scripts.',
      'Configured secure remote access with Tailscale, Nginx reverse proxy, and UFW firewall rules.',
    ],
    period: '2026 - Current',
    icon: '/icons/home_lab.gif',
    url: 'https://github.com/lukettoOoO/homelab',
  },
  {
    name: 'Nextcloud Staff Timekeeping Plugin',
    description:
      'Diploma project: Nextcloud plugin for faculty timetable parsing, teaching activity management, and compliance-ready reports.',
    stack: ['PHP', 'Vue.js', 'Nextcloud'],
    highlights: [
      'Developing a Nextcloud plugin to automate faculty timekeeping and administrative workflows.',
      'Using a PHP engine for timetable parsing and a Vue.js interface for teaching activities.',
      'Generating compliance-ready reports integrated with the Nextcloud API.',
    ],
    period: '2026 - Current',
    icon: '/icons/projects.gif',
    url: 'https://github.com/lukettoOoO/DCTI-Staff-Timekeeping-App',
  },
  {
    name: 'Multi-threaded TCP Chat System',
    description:
      'Concurrent chat server and CLI client with pthreads and a checksum-validated binary protocol.',
    stack: ['C', 'POSIX Threads', 'Sockets', 'TCP/IP'],
    highlights: [
      'Built a concurrent chat server and CLI client.',
      'Implemented thread-safe message handling using pthreads.',
      'Designed a custom binary protocol with checksum validation.',
    ],
    period: '2025',
    icon: '/icons/projects.gif',
    url: 'https://github.com/lukettoOoO/TCP-client-server-chat-system',
  },
  {
    name: 'EcoMeal',
    description:
      'Full-stack food marketplace built during the Netrom summer camp with maps, roles, and live orders.',
    stack: ['C#', '.NET 8', 'Blazor', 'EF Core', 'Leaflet'],
    highlights: [
      'Developed a full-stack food marketplace during the Netrom summer camp.',
      'Implemented maps, roles, relational data, and live order handling.',
    ],
    period: '2026',
    icon: '/icons/projects.gif',
    url: 'https://github.com/lukettoOoO/EcoMeal',
  },
];
