<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Desktop, { type DesktopIconItem } from './components/Desktop.vue';
import FileExplorer from './components/FileExplorer.vue';
import Taskbar from './components/Taskbar.vue';
import WindowFrame, { type FrameWindow } from './components/WindowFrame.vue';
import { contactLinks } from './data/contact';
import {
  cvProjects,
  education,
  experience,
  extracurricular,
  languageSkills,
  languages,
  personalDetails,
  profile,
  skills,
} from './data/cv';
import { projects } from './data/projects';

type WindowId =
  | 'computer'
  | 'projects'
  | 'about'
  | 'cv'
  | 'contact'
  | 'skills'
  | 'interests'
  | 'paint'
  | 'music';

interface WindowState extends FrameWindow {
  id: WindowId;
}

type DragState = {
  type: 'icon' | 'window';
  id: string;
  offsetX: number;
  offsetY: number;
};

const desktopIcons = ref<DesktopIconItem[]>([
  { id: 'computer', label: 'My Computer', icon: '/icons/my_computer.png', x: 16, y: 16 },
  { id: 'projects', label: 'Projects', icon: '/icons/projects.gif', x: 16, y: 112 },
  { id: 'about', label: 'About Me', icon: '/icons/smiley.gif', x: 16, y: 208 },
  { id: 'cv', label: 'CV_latest.doc', icon: '/icons/cv.gif', x: 16, y: 304 },
  { id: 'contact', label: 'Contact Me', icon: '/icons/earth.gif', x: 16, y: 400 },
  { id: 'skills', label: 'Skills', icon: '/media/skills.svg', x: 120, y: 16 },
  { id: 'interests', label: 'Interests', icon: '/icons/smiley.gif', x: 120, y: 112 },
  { id: 'paint', label: 'portrait.jpg', icon: '/media/portrait.jpg', x: 120, y: 208 },
  { id: 'music', label: 'song.mp3', icon: '/media/music-icon.png', x: 120, y: 304 },
]);

const titles: Record<WindowId, string> = {
  computer: 'My Computer',
  projects: 'Projects - Windows Explorer',
  about: 'System Properties',
  cv: 'CV_latest.doc - WordPad',
  contact: 'Contact Me - Internet Explorer',
  skills: 'Skills - Control Panel',
  interests: 'Interests - Windows Explorer',
  paint: 'portrait.jpg - Paint',
  music: 'music.mp3 - Media Player',
};

const windowIcons: Record<WindowId, string> = {
  computer: '/icons/my_computer.png',
  projects: '/icons/projects.gif',
  about: '/icons/smiley.gif',
  cv: '/icons/cv.gif',
  contact: '/icons/earth.gif',
  skills: '/media/skills.svg',
  interests: '/icons/smiley.gif',
  paint: '/media/portrait.jpg',
  music: '/media/music-icon.png',
};

const windowDimensions: Record<WindowId, { width: number; height: number }> = {
  computer: { width: 700, height: 540 },
  projects: { width: 440, height: 310 },
  about: { width: 475, height: 410 },
  cv: { width: 700, height: 540 },
  contact: { width: 480, height: 460 },
  skills: { width: 490, height: 350 },
  interests: { width: 620, height: 500 },
  paint: { width: 390, height: 320 },
  music: { width: 560, height: 380 },
};

const openWindows = ref<WindowState[]>([
  {
    id: 'projects',
    title: titles.projects,
    icon: windowIcons.projects,
    x: 160,
    y: 260,
    width: 440,
    height: 310,
    zIndex: 1,
    minimized: false,
    maximized: false,
  },
  {
    id: 'skills',
    title: titles.skills,
    icon: windowIcons.skills,
    x: 500,
    y: 200,
    width: 490,
    height: 350,
    zIndex: 2,
    minimized: false,
    maximized: false,
  },
  {
    id: 'paint',
    title: titles.paint,
    icon: windowIcons.paint,
    x: 600,
    y: 12,
    width: 390,
    height: 320,
    zIndex: 3,
    minimized: false,
    maximized: false,
  },
  {
    id: 'about',
    title: titles.about,
    icon: windowIcons.about,
    x: 115,
    y: 35,
    width: 475,
    height: 410,
    zIndex: 4,
    minimized: false,
    maximized: false,
  },
]);
const selectedIcon = ref<string | null>('about');
const activeWindowId = ref<WindowId | null>('about');
const activeAboutTab = ref<'general' | 'focus' | 'desktop'>('general');
const startOpen = ref(false);
const currentTime = ref('');
const highestZIndex = ref(4);
const dragState = ref<DragState | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const musicProgress = ref(0);
const musicCurrentTime = ref(0);
const musicDuration = ref(0);
const musicError = ref('');
let clockTimer: ReturnType<typeof setInterval>;

function updateClock() {
  currentTime.value = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function selectIcon(id: string) {
  selectedIcon.value = id;
}

function setAudioElement(element: unknown) {
  audioElement.value = element instanceof HTMLAudioElement ? element : null;
  if (audioElement.value) {
    musicDuration.value = Number.isFinite(audioElement.value.duration)
      ? audioElement.value.duration
      : 0;
  }
}

async function toggleMusic() {
  if (!audioElement.value) {
    musicError.value = 'Audio element is not ready. Reopen Media Player.';
    return;
  }

  if (audioElement.value.paused) {
    try {
      await audioElement.value.play();
      musicError.value = '';
      isPlaying.value = true;
    } catch {
      isPlaying.value = false;
      musicError.value = 'Audio could not be played in this browser.';
    }
  } else {
    audioElement.value.pause();
    isPlaying.value = false;
  }
}

function stopMusic() {
  if (!audioElement.value) return;
  audioElement.value.pause();
  audioElement.value.currentTime = 0;
  isPlaying.value = false;
  musicProgress.value = 0;
  musicCurrentTime.value = 0;
}

function updateMusicProgress() {
  if (!audioElement.value) return;
  musicCurrentTime.value = audioElement.value.currentTime;
  musicDuration.value = audioElement.value.duration || 0;
  musicProgress.value = musicDuration.value
    ? (musicCurrentTime.value / musicDuration.value) * 100
    : 0;
}

function handleMusicError() {
  isPlaying.value = false;
  musicError.value = 'Audio file unavailable.';
}

function seekMusic(event: Event) {
  if (!audioElement.value || !musicDuration.value) return;
  const input = event.target as HTMLInputElement;
  audioElement.value.currentTime = (Number(input.value) / 100) * musicDuration.value;
}

function formatMusicTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function findWindow(id: WindowId) {
  return openWindows.value.find((windowState) => windowState.id === id);
}

function focusWindow(id: WindowId) {
  const windowState = findWindow(id);
  if (!windowState) return;

  highestZIndex.value += 1;
  windowState.zIndex = highestZIndex.value;
  windowState.minimized = false;
  activeWindowId.value = id;
}

function openWindow(id: WindowId) {
  const existingWindow = findWindow(id);
  if (existingWindow) {
    focusWindow(id);
    return;
  }

  highestZIndex.value += 1;
  const offset = openWindows.value.length * 24;
  const dimensions = windowDimensions[id];
  openWindows.value.push({
    id,
    title: titles[id],
    icon: windowIcons[id],
    x: 180 + offset,
    y: 42 + offset,
    width: dimensions.width,
    height: dimensions.height,
    zIndex: highestZIndex.value,
    minimized: false,
    maximized: false,
  });
  selectedIcon.value = id;
  activeWindowId.value = id;
  startOpen.value = false;
}

function openFromComponent(id: string) {
  if (id in titles) {
    openWindow(id as WindowId);
  }
}

function closeWindow(id: WindowId) {
  openWindows.value = openWindows.value.filter((windowState) => windowState.id !== id);
  if (activeWindowId.value === id) {
    activeWindowId.value = openWindows.value[openWindows.value.length - 1]?.id ?? null;
  }
}

function minimizeWindow(id: WindowId) {
  const windowState = findWindow(id);
  if (!windowState) return;
  windowState.minimized = true;
  if (activeWindowId.value === id) activeWindowId.value = null;
}

function maximizeWindow(id: WindowId) {
  const windowState = findWindow(id);
  if (!windowState) return;
  windowState.maximized = !windowState.maximized;
  focusWindow(id);
}

function focusFromTaskbar(id: string) {
  if (id in titles) {
    focusWindow(id as WindowId);
  }
}

function startWindowDrag(event: PointerEvent, id: WindowId) {
  const windowState = findWindow(id);
  if (!windowState || windowState.maximized) return;
  focusWindow(id);
  dragState.value = {
    type: 'window',
    id,
    offsetX: event.clientX - windowState.x,
    offsetY: event.clientY - windowState.y,
  };
  window.addEventListener('pointermove', moveDraggedItem);
  window.addEventListener('pointerup', stopDragging, { once: true });
}

function startIconDrag(event: PointerEvent, id: string) {
  const icon = desktopIcons.value.find((desktopIcon) => desktopIcon.id === id);
  if (!icon) return;
  selectIcon(id);
  dragState.value = {
    type: 'icon',
    id,
    offsetX: event.clientX - icon.x,
    offsetY: event.clientY - icon.y,
  };
  window.addEventListener('pointermove', moveDraggedItem);
  window.addEventListener('pointerup', stopDragging, { once: true });
}

function moveDraggedItem(event: PointerEvent) {
  if (!dragState.value) return;

  if (dragState.value.type === 'icon') {
    const icon = desktopIcons.value.find((desktopIcon) => desktopIcon.id === dragState.value?.id);
    if (!icon) return;
    icon.x = Math.max(0, event.clientX - dragState.value.offsetX);
    icon.y = Math.max(0, event.clientY - dragState.value.offsetY);
    return;
  }

  const windowState = findWindow(dragState.value.id as WindowId);
  if (!windowState) return;
  windowState.x = Math.max(0, event.clientX - dragState.value.offsetX);
  windowState.y = Math.max(0, event.clientY - dragState.value.offsetY);
}

function stopDragging() {
  dragState.value = null;
  window.removeEventListener('pointermove', moveDraggedItem);
}

onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(clockTimer);
  window.removeEventListener('pointermove', moveDraggedItem);
});
</script>

<template>
  <main class="desktop" @click.self="startOpen = false">
    <Desktop
      :icons="desktopIcons"
      :selected-id="selectedIcon"
      @select="selectIcon"
      @open="openFromComponent"
      @drag-start="startIconDrag"
    />

    <div class="desktop-clippy">
      <div class="clippy-bubble">
        <span>Luca-Adrian Mihuț - Personal Website</span>
      </div>
      <img src="/icons/clippy.gif" alt="Clippy" class="clippy-img" />
    </div>

    <WindowFrame
      v-for="windowState in openWindows"
      :key="windowState.id"
      :window-state="windowState"
      :active="activeWindowId === windowState.id"
      @focus="focusWindow(windowState.id)"
      @close="closeWindow(windowState.id)"
      @minimize="minimizeWindow(windowState.id)"
      @maximize="maximizeWindow(windowState.id)"
      @drag-start="startWindowDrag($event, windowState.id)"
    >
      <template v-if="windowState.id === 'about'">
        <div class="sys-dialog">
          <!-- Windows 95 Tab Header -->
          <nav class="win-tabs" role="tablist">
            <button
              class="win-tab-btn"
              :class="{ active: activeAboutTab === 'general' }"
              role="tab"
              :aria-selected="activeAboutTab === 'general'"
              @click="activeAboutTab = 'general'"
            >
              General
            </button>
            <button
              class="win-tab-btn"
              :class="{ active: activeAboutTab === 'focus' }"
              role="tab"
              :aria-selected="activeAboutTab === 'focus'"
              @click="activeAboutTab = 'focus'"
            >
              Focus &amp; Diploma
            </button>
            <button
              class="win-tab-btn"
              :class="{ active: activeAboutTab === 'desktop' }"
              role="tab"
              :aria-selected="activeAboutTab === 'desktop'"
              @click="activeAboutTab = 'desktop'"
            >
              Desktop Guide
            </button>
          </nav>

          <!-- Tab Content Pane -->
          <div class="win-tab-pane" role="tabpanel">
            <!-- TAB 1: GENERAL -->
            <div v-if="activeAboutTab === 'general'" class="sys-tab-general">
              <div class="sys-general-grid">
                <div class="sys-general-media">
                  <img src="/icons/computer_man.gif" alt="Computer" class="sys-computer-man" />
                </div>

                <div class="sys-general-details">
                  <div class="sys-section-block">
                    <strong class="sys-name">Luca-Adrian Mihuț</strong>
                    <p class="sys-item">4th-Year Computer Science &amp; IT</p>
                    <p class="sys-item">Politehnica University of Timișoara</p>
                    <p class="sys-item">Faculty of Automation and Computer Science (AC)</p>
                    <p class="sys-item">Timișoara &amp; Arad, Romania</p>
                  </div>

                  <div class="sys-section-block">
                    <p class="sys-item-strong">
                      Software Engineering · Cloud Infrastructure · Linux
                    </p>
                    <p class="sys-item">Docker · Kubernetes · OpenShift · Networking · Proxmox</p>
                    <p class="sys-item">Go · Python · C# · TypeScript · C · PHP · SQL</p>
                  </div>
                </div>
              </div>

              <fieldset class="win-groupbox">
                <legend>Focus</legend>
                <p class="sys-desc-text">
                  Passionate about software engineering, Linux, and cloud infrastructure. Driven by
                  practical learning, from developing applications and managing my own homelab to
                  gaining hands-on industry experience.
                </p>
              </fieldset>
            </div>

            <!-- TAB 2: FOCUS & DIPLOMA -->
            <div v-else-if="activeAboutTab === 'focus'" class="sys-tab-focus">
              <fieldset class="win-groupbox">
                <legend>Diploma Project (Year 4)</legend>
                <div class="sys-project-row">
                  <img src="/icons/blueprint.gif" alt="Blueprint" class="sys-project-icon" />
                  <div class="sys-project-body">
                    <strong class="sys-project-name">DCTI Staff Timekeeping Plugin</strong>
                    <span class="sys-project-stack"
                      >Cloud Computing · PHP · Vue.js · Nextcloud API</span
                    >
                    <p class="sys-project-desc">
                      Automating university faculty timekeeping, administrative workflows, and
                      teaching activity management. Combines a PHP engine with a Vue.js front-end,
                      fully integrated into Nextcloud with compliance-ready reporting.
                    </p>
                    <a
                      href="https://github.com/lukettoOoO/DCTI-Staff-Timekeeping-App"
                      target="_blank"
                      rel="noreferrer"
                      class="win-btn"
                    >
                      <img src="/icons/projects.gif" alt="" class="win-btn-icon" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </fieldset>

              <fieldset class="win-groupbox">
                <legend>Homelab &amp; Networking Infrastructure</legend>
                <div class="sys-project-row">
                  <img src="/icons/network.gif" alt="Network" class="sys-project-icon" />
                  <div class="sys-project-body">
                    <strong class="sys-project-name">Private Multi-Node Cluster</strong>
                    <span class="sys-project-stack"
                      >Proxmox VE · Debian Linux · Docker · Tailscale · Nginx · UFW</span
                    >
                    <p class="sys-project-desc">
                      Self-hosting private cloud infrastructure with automated backups and
                      monitoring. Actively studying computer networking fundamentals and preparing
                      for the Cisco CCNA certification.
                    </p>
                    <a
                      href="https://github.com/lukettoOoO/homelab"
                      target="_blank"
                      rel="noreferrer"
                      class="win-btn"
                    >
                      <img src="/icons/home_lab.gif" alt="" class="win-btn-icon" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </fieldset>
            </div>

            <!-- TAB 3: DESKTOP GUIDE -->
            <div v-else-if="activeAboutTab === 'desktop'" class="sys-tab-desktop">
              <fieldset class="win-groupbox">
                <legend>Desktop Applications</legend>
                <p class="sys-hint">Click any application below to launch it on the desktop:</p>
                <div class="sys-apps-grid">
                  <div class="sys-app-card" @click="openWindow('cv')">
                    <img src="/icons/cv.gif" alt="" class="sys-app-icon" />
                    <div class="sys-app-info">
                      <strong>CV_latest.doc</strong>
                      <span
                        >Full resume: Nokia &amp; NetRom internships, education &amp; skills</span
                      >
                    </div>
                    <button class="win-btn sys-launch-btn">Open</button>
                  </div>

                  <div class="sys-app-card" @click="openWindow('projects')">
                    <img src="/icons/projects.gif" alt="" class="sys-app-icon" />
                    <div class="sys-app-info">
                      <strong>Projects</strong>
                      <span>Repositories, source code, and software experiments</span>
                    </div>
                    <button class="win-btn sys-launch-btn">Open</button>
                  </div>

                  <div class="sys-app-card" @click="openWindow('interests')">
                    <img src="/icons/smiley.gif" alt="" class="sys-app-icon" />
                    <div class="sys-app-info">
                      <strong>Interests</strong>
                      <span>Music stats (stats.fm), retro computers, films &amp; hobbies</span>
                    </div>
                    <button class="win-btn sys-launch-btn">Open</button>
                  </div>

                  <div class="sys-app-card" @click="openWindow('contact')">
                    <img src="/icons/earth.gif" alt="" class="sys-app-icon" />
                    <div class="sys-app-info">
                      <strong>Contact Me</strong>
                      <span>Direct email address, socials, and location details</span>
                    </div>
                    <button class="win-btn sys-launch-btn">Open</button>
                  </div>

                  <div class="sys-app-card" @click="openWindow('music')">
                    <img src="/icons/music.gif" alt="" class="sys-app-icon" />
                    <div class="sys-app-info">
                      <strong>song.mp3</strong>
                      <span>Built-in Media Player with audio playback</span>
                    </div>
                    <button class="win-btn sys-launch-btn">Open</button>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <footer class="sys-actions">
            <button class="win-btn sys-dialog-btn" @click="closeWindow('about')">OK</button>
            <button class="win-btn sys-dialog-btn" @click="closeWindow('about')">Cancel</button>
            <button class="win-btn sys-dialog-btn" disabled>Apply</button>
          </footer>
        </div>
      </template>

      <template v-else-if="windowState.id === 'computer'">
        <div class="explorer-shell">
          <nav class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Help</nav>
          <div class="window-toolbar">
            <button>Back</button>
            <button>Up</button>
            <span>My Computer</span>
          </div>

          <div class="computer-view computer-explorer">
            <section class="computer-heading">
              <img src="/icons/my_computer.png" alt="" />
              <div>
                <strong>My Computer</strong>
                <p>C:\</p>
                <small>Local file system</small>
              </div>
            </section>

            <aside class="computer-tree">
              <strong>Folders</strong>
              <button @dblclick="openWindow('projects')">Projects</button>
              <button @dblclick="openWindow('interests')">Interests</button>
              <button @dblclick="openWindow('music')">Media</button>
              <strong>Documents</strong>
              <button @dblclick="openWindow('about')">About Me</button>
              <button @dblclick="openWindow('cv')">CV_latest.doc</button>
              <button @dblclick="openWindow('contact')">CONTACT.URL</button>
            </aside>

            <div class="file-area computer-files">
              <button class="file" @dblclick="openWindow('projects')">
                <img src="/icons/projects.gif" alt="" /><span>Projects</span>
              </button>
              <button class="file" @dblclick="openWindow('about')">
                <img src="/icons/computer_man.gif" alt="" /><span>About Me</span>
              </button>
              <button class="file" @dblclick="openWindow('cv')">
                <img src="/icons/cv.gif" alt="" /><span>CV_latest.doc</span>
              </button>
              <button class="file" @dblclick="openWindow('contact')">
                <img src="/icons/earth.gif" alt="" /><span>CONTACT.URL</span>
              </button>
              <button class="file" @dblclick="openWindow('interests')">
                <img src="/icons/smiley.gif" alt="" /><span>Interests</span>
              </button>
              <button class="file" @dblclick="openWindow('music')">
                <img class="music-file-icon" src="/media/music-icon.png" alt="" /><span
                  >music.mp3</span
                >
              </button>
              <button class="file" @dblclick="openWindow('paint')">
                <img src="/media/portrait.jpg" alt="" /><span>portrait.jpg</span>
              </button>
              <button class="file" @dblclick="openWindow('skills')">
                <img src="/media/skills.png" alt="" /><span>Skills</span>
              </button>
            </div>
          </div>

          <footer class="window-status">8 object(s) · C:\</footer>
        </div>
      </template>

      <template v-else-if="windowState.id === 'projects'"
        ><FileExplorer :projects="projects" path="C:\\Luca\\Projects"
      /></template>

      <template v-else-if="windowState.id === 'cv'">
        <div class="wordpad-shell">
          <nav class="window-menu">
            File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Insert&nbsp;&nbsp; Format&nbsp;&nbsp;
            Help
          </nav>

          <div class="wordpad-body">
            <article class="document-area cv-document">
              <header class="cv-header">
                <h1 class="cv-name">{{ profile.name }}</h1>
                <div class="cv-personal-info">
                  <div class="cv-info-row">
                    <span><strong>Date of birth:</strong> {{ personalDetails.birthDate }}</span>
                    <span class="sep"></span>
                    <span><strong>Place of birth:</strong> {{ personalDetails.birthPlace }}</span>
                    <span class="sep"></span>
                    <span><strong>Nationality:</strong> {{ personalDetails.nationality }}</span>
                    <span class="sep"></span>
                    <span><strong>Gender:</strong> {{ personalDetails.gender }}</span>
                  </div>
                  <div class="cv-info-row">
                    <span><strong>Phone number:</strong> {{ personalDetails.phone }}</span>
                    <span class="sep"></span>
                    <span
                      ><strong>Email address:</strong>
                      <a :href="'mailto:' + personalDetails.email">{{
                        personalDetails.email
                      }}</a></span
                    >
                  </div>
                  <div class="cv-info-row">
                    <span
                      ><strong>Website:</strong>
                      <a :href="personalDetails.github" target="_blank" rel="noreferrer">{{
                        personalDetails.github
                      }}</a></span
                    >
                    <span class="sep"></span>
                    <span
                      ><strong>Website:</strong>
                      <a
                        :href="'https://' + personalDetails.linkedin"
                        target="_blank"
                        rel="noreferrer"
                        >{{ personalDetails.linkedin }}</a
                      ></span
                    >
                  </div>
                  <div class="cv-info-row">
                    <span><strong>Address:</strong> {{ personalDetails.homeAddress }}</span>
                    <span class="sep"></span>
                    <span><strong>Address:</strong> {{ personalDetails.secondAddress }}</span>
                  </div>
                </div>
              </header>

              <section class="cv-section">
                <h3 class="cv-section-title">ABOUT ME</h3>
                <p class="cv-summary">{{ profile.summary }}</p>
              </section>

              <section class="cv-section">
                <h3 class="cv-section-title">WORK EXPERIENCE</h3>
                <div v-for="entry in experience" :key="entry.company" class="cv-item">
                  <h4 class="cv-item-title">
                    {{ entry.role }} – {{ entry.company }} – {{ entry.period }} –
                    {{ entry.location }}
                  </h4>
                  <div class="cv-item-meta">
                    Department: {{ entry.department }}
                    <template v-if="entry.link">
                      &nbsp; Link :
                      <a :href="entry.link" target="_blank" rel="noreferrer">{{ entry.link }}</a>
                    </template>
                  </div>
                  <div class="cv-tech-line">{{ entry.technologies.join(', ') }}</div>
                  <ul class="cv-bullets">
                    <li v-for="highlight in entry.highlights" :key="highlight">{{ highlight }}</li>
                  </ul>
                </div>
              </section>

              <section class="cv-section">
                <h3 class="cv-section-title">EDUCATION AND TRAINING</h3>
                <div v-for="entry in education" :key="entry.period" class="cv-item">
                  <div class="cv-period-loc">{{ entry.period }} &nbsp; {{ entry.location }}</div>
                  <h4 class="cv-item-title">{{ entry.title }}</h4>
                  <p class="cv-institution">{{ entry.institution }}</p>
                  <div class="cv-skill-groups">
                    <p><strong>Languages:</strong> {{ entry.skills.languages.join(', ') }}</p>
                    <p>
                      <strong>Systems &amp; Networking:</strong>
                      {{ entry.skills.systems.join(', ') }}
                    </p>
                    <p><strong>DevOps &amp; Tools:</strong> {{ entry.skills.devops.join(', ') }}</p>
                    <p><strong>Web &amp; Databases:</strong> {{ entry.skills.web.join(', ') }}</p>
                  </div>
                  <div class="cv-edu-links">
                    <strong>Website</strong>
                    <a :href="entry.website" target="_blank" rel="noreferrer">{{
                      entry.website
                    }}</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Field of study</strong> {{ entry.field }}
                  </div>
                </div>
              </section>

              <section class="cv-section">
                <h3 class="cv-section-title">PROJECTS</h3>
                <div v-for="entry in cvProjects" :key="entry.name" class="cv-item">
                  <div class="cv-period-loc">{{ entry.period }}</div>
                  <h4 class="cv-item-title">{{ entry.name }}</h4>
                  <div class="cv-tech-line">{{ entry.technologies.join(', ') }}</div>
                  <ul class="cv-bullets">
                    <li v-for="highlight in entry.highlights" :key="highlight">{{ highlight }}</li>
                  </ul>
                  <div class="cv-link-row">
                    <strong>Link</strong>
                    <a :href="entry.link" target="_blank" rel="noreferrer">{{ entry.link }}</a>
                  </div>
                </div>
              </section>

              <section class="cv-section">
                <h3 class="cv-section-title">EXTRACURRICULAR ACTIVITIES</h3>
                <div class="cv-item">
                  <div class="cv-period-loc">{{ extracurricular.period }}</div>
                  <h4 class="cv-item-title">{{ extracurricular.title }}</h4>
                  <p class="cv-institution">{{ extracurricular.institution }}</p>
                  <div class="cv-tech-line">{{ extracurricular.technologies.join(', ') }}</div>
                  <ul class="cv-bullets">
                    <li v-for="highlight in extracurricular.highlights" :key="highlight">
                      {{ highlight }}
                    </li>
                  </ul>
                  <div class="cv-link-row">
                    <strong>Link</strong>
                    <a :href="extracurricular.link" target="_blank" rel="noreferrer">{{
                      extracurricular.link
                    }}</a>
                  </div>
                </div>
              </section>

              <section class="cv-section">
                <h3 class="cv-section-title">LANGUAGE SKILLS</h3>
                <p class="cv-lang-mother">
                  <strong>Mother tongue(s):</strong> {{ languageSkills.motherTongue }}
                </p>
                <p class="cv-lang-subhead">Other language(s):</p>
                <p class="cv-levels-note">
                  Levels: A1 and A2: Basic user; B1 and B2: Independent user; C1 and C2: Proficient
                  user
                </p>
                <table class="language-table">
                  <thead>
                    <tr>
                      <th rowspan="2" class="lang-col-header">Language</th>
                      <th colspan="2">UNDERSTANDING</th>
                      <th colspan="2">SPEAKING</th>
                      <th>WRITING</th>
                    </tr>
                    <tr>
                      <th>Listening</th>
                      <th>Reading</th>
                      <th>Spoken production</th>
                      <th>Spoken interaction</th>
                      <th>Writing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="lang in languageSkills.otherLanguages" :key="lang.language">
                      <th>{{ lang.language }}</th>
                      <td>{{ lang.listening }}</td>
                      <td>{{ lang.reading }}</td>
                      <td>{{ lang.spokenProduction }}</td>
                      <td>{{ lang.spokenInteraction }}</td>
                      <td>{{ lang.writing }}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </article>
          </div>
        </div>
      </template>

      <template v-else-if="windowState.id === 'contact'">
        <article class="document-area">
          <h1>Contact</h1>
          <p v-for="link in contactLinks" :key="link.label" class="contact-row">
            <strong>{{ link.label }}</strong
            ><a :href="link.href" target="_blank" rel="noreferrer">{{ link.value }}</a>
          </p>
          <p class="muted">Based in {{ profile.location }}.</p>
          <div class="contact-gif-container">
            <img src="/icons/contact.gif" alt="Contact" class="contact-gif" />
          </div>
        </article>
      </template>

      <template v-else-if="windowState.id === 'paint'">
        <div class="paint-view">
          <div class="paint-toolbar">
            File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Image&nbsp;&nbsp; Colors&nbsp;&nbsp;
            Help
          </div>
          <div class="paint-canvas">
            <img src="/media/portrait.jpg" alt="Portrait of Luca-Adrian Mihuț" />
          </div>
          <div class="paint-palette">
            <span
              v-for="color in 12"
              :key="color"
              :style="{ backgroundColor: `hsl(${color * 30}, 65%, 45%)` }"
            ></span>
          </div>
        </div>
      </template>

      <template v-else-if="windowState.id === 'skills'">
        <article class="skills-view">
          <h1>Skills & Technologies</h1>
          <div class="skill-grid">
            <section class="skill-card">
              <img src="/media/skill-programming.png" alt="" />
              <h3>Programming</h3>
              <p>Go · Python · C · Java · C# · PHP · TypeScript · SQL</p>
              <div class="meter"><i style="width: 80%"></i></div>
            </section>
            <section class="skill-card">
              <img src="/media/skill-linux.png" alt="" />
              <h3>Linux & Systems</h3>
              <p>Debian · Rocky Linux · TCP/IP · SSH · DNS/DHCP</p>
              <div class="meter"><i style="width: 100%"></i></div>
            </section>
            <section class="skill-card">
              <img src="/media/skill-devops.png" alt="" />
              <h3>Cloud & DevOps</h3>
              <p>Docker · OpenShift · Kubernetes · Ansible · Nginx · Git</p>
              <div class="meter"><i style="width: 80%"></i></div>
            </section>
            <section class="skill-card">
              <img src="/media/skill-web.png" alt="" />
              <h3>Web & Databases</h3>
              <p>Vue.js · ASP.NET Core · MySQL</p>
              <div class="meter"><i style="width: 60%"></i></div>
            </section>
            <section class="skill-card">
              <img src="/media/skill-homelab.png" alt="" />
              <h3>Servers</h3>
              <p>Proxmox · Debian · Nextcloud · Tailscale · UFW</p>
              <div class="meter"><i style="width: 100%"></i></div>
            </section>
          </div>
        </article>
      </template>

      <template v-else-if="windowState.id === 'interests'">
        <article class="interests-view">
          <div class="interests-toolbar">
            File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Favorites&nbsp;&nbsp; Help
          </div>
          <div class="interests-address-bar">
            <span>Address</span>
            <div class="interests-address-input">C:\Luca\Interests</div>
          </div>
          <div class="interests-list">
            <div class="interest-row">
              <div class="interest-icon-wrap">
                <img
                  src="/icons/linux.gif"
                  alt="Linux & Networking"
                  class="interest-icon linux-icon"
                />
              </div>
              <div class="interest-text">
                <strong>Linux & Networking</strong>
                <p>
                  Self-Hosting, Fediverse and more. I enjoy learning every bit of how the internet
                  and computers work in my free time.
                </p>
              </div>
            </div>

            <div class="interest-row reverse">
              <div class="interest-icon-wrap">
                <img src="/icons/retro_computer.png" alt="Retro Computers" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Retro Computers</strong>
                <p>
                  Big
                  <a href="https://www.youtube.com/@LGR" target="_blank" rel="noreferrer">LGR</a>
                  fan. I dream of owning an iMac G4 one day. I also enjoy exploring old 2000s
                  gadgets and technologies.
                </p>
              </div>
            </div>

            <div class="interest-row">
              <div class="interest-icon-wrap">
                <img src="/icons/server_burning.gif" alt="Homelabbing" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Homelabbing</strong>
                <p>
                  Running a multi-node homelab on Debian Linux and Proxmox VE for virtual machines.
                  I deploy Dockerized services (Nextcloud, GitLab, Netdata) with automated backups,
                  and configure secure remote access with Tailscale, Nginx reverse proxy, and UFW
                  firewall rules.
                </p>
              </div>
            </div>

            <div class="interest-row reverse">
              <div class="interest-icon-wrap">
                <img src="/icons/music.gif" alt="Music" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Music</strong>
                <p>
                  Heavy hyperpop, electroclash, and electronic listener. Top artists from my
                  <a
                    href="https://stats.fm/21kmbcrg6kgt7nefiailh3nbq"
                    target="_blank"
                    rel="noreferrer"
                    >stats.fm</a
                  >
                  include Charli xcx, Ninajirachi, Kim Petras, Frost Children, underscores, The
                  Hellp, and Blood Orange—with a soft spot for 2000s Romanian club & pop hits.
                </p>
              </div>
            </div>

            <div class="interest-row">
              <div class="interest-icon-wrap">
                <img src="/icons/films.gif" alt="Films" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Films</strong>
                <p>
                  I enjoy all kinds of films. A few of my favorites: Interstellar, Star Wars, Little
                  Miss Sunshine, Death Proof, and films by Tarantino and Sofia Coppola.
                </p>
              </div>
            </div>

            <div class="interest-row reverse">
              <div class="interest-icon-wrap">
                <img src="/icons/swimming.gif" alt="Swimming" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Swimming</strong>
                <p>
                  I enjoy swimming—it always clears up my mind—and long walks while listening to
                  music.
                </p>
              </div>
            </div>

            <div class="interest-row">
              <div class="interest-icon-wrap">
                <img src="/icons/games.png" alt="Gaming" class="interest-icon" />
              </div>
              <div class="interest-text">
                <strong>Gaming</strong>
                <p>
                  Some of my favorite games: old GTA games, Red Dead Redemption 2, Cyberpunk 2077,
                  Stardew Valley, Animal Crossing, The Legend of Zelda, Life is Strange, and The
                  Last of Us.
                </p>
              </div>
            </div>
          </div>
        </article>
      </template>

      <template v-else-if="windowState.id === 'music'">
        <article class="music-view">
          <div class="music-toolbar">
            File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Play&nbsp;&nbsp; Help
          </div>
          <div class="music-display">
            <span>TRACK 01</span>
            <strong>{{ isPlaying ? 'PLAYING' : 'STOPPED' }}</strong>
            <span
              >{{ formatMusicTime(musicCurrentTime) }} / {{ formatMusicTime(musicDuration) }}</span
            >
          </div>
          <div class="music-track">
            <div class="music-art-frame">
              <img src="/media/music-cover.jpg" alt="All At Once cover artwork" />
            </div>
            <div class="music-info">
              <strong>All At Once</strong><small>Ninajirachi</small><small>MP3 audio</small>
            </div>
          </div>
          <div class="music-transport">
            <button @click="toggleMusic">{{ isPlaying ? 'Pause' : 'Play' }}</button>
            <button @click="stopMusic">Stop</button>
            <input
              type="range"
              min="0"
              max="100"
              :value="musicProgress"
              aria-label="Track progress"
              @input="seekMusic"
            />
          </div>
          <audio
            :ref="setAudioElement"
            preload="auto"
            src="/media/song.mp3"
            @timeupdate="updateMusicProgress"
            @loadedmetadata="updateMusicProgress"
            @loadeddata="updateMusicProgress"
            @canplay="updateMusicProgress"
            @durationchange="updateMusicProgress"
            @ended="isPlaying = false"
            @error="handleMusicError"
          ></audio>
          <p v-if="musicError" class="music-error">{{ musicError }}</p>
        </article>
      </template>
    </WindowFrame>

    <aside v-if="startOpen" class="start-menu">
      <div class="start-brand">
        <img src="/icons/windows.gif" alt="" /><strong>Heavily inspired by Windows 95</strong>
      </div>
      <button v-for="icon in desktopIcons" :key="icon.id" @click="openFromComponent(icon.id)">
        {{ icon.label }}
      </button>
    </aside>

    <Taskbar
      :windows="openWindows"
      :active-id="activeWindowId"
      :start-open="startOpen"
      :time="currentTime"
      @toggle-start="startOpen = !startOpen"
      @focus-window="focusFromTaskbar"
    />
  </main>
</template>

<style>
/* Windows 95 Authentic Controls & Dialogs */
.sys-dialog {
  display: flex !important;
  flex: 1 1 auto !important;
  flex-direction: column !important;
  min-height: 0 !important;
  height: 100% !important;
  padding: 8px 10px 10px !important;
  background: #c0c0c0 !important;
  box-sizing: border-box !important;
  font-family: Tahoma, 'MS Sans Serif', sans-serif !important;
  font-size: 11px !important;
  color: #000000 !important;
  user-select: text !important;
  overflow: hidden !important;
}

/* Authentic Windows 95 Button (overrides macOS Safari default rounded buttons) */
.win-btn,
.sys-dialog-btn,
.sys-actions button,
.sys-app-card button {
  appearance: none !important;
  -webkit-appearance: none !important;
  border-radius: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 75px !important;
  height: 23px !important;
  padding: 0 12px !important;
  background: #c0c0c0 !important;
  color: #000000 !important;
  font-family: Tahoma, 'MS Sans Serif', sans-serif !important;
  font-size: 11px !important;
  font-weight: normal !important;
  border-top: 1px solid #ffffff !important;
  border-left: 1px solid #ffffff !important;
  border-right: 1px solid #000000 !important;
  border-bottom: 1px solid #000000 !important;
  box-shadow:
    inset 1px 1px 0 #dfdfdf,
    inset -1px -1px 0 #808080 !important;
  cursor: pointer !important;
  outline: none !important;
  text-decoration: none !important;
  box-sizing: border-box !important;
  user-select: none !important;
  line-height: normal !important;
}

.win-btn:active,
.sys-dialog-btn:active,
.sys-actions button:active,
.sys-app-card button:active {
  border-top: 1px solid #000000 !important;
  border-left: 1px solid #000000 !important;
  border-right: 1px solid #ffffff !important;
  border-bottom: 1px solid #ffffff !important;
  box-shadow:
    inset 1px 1px 0 #808080,
    inset -1px -1px 0 #dfdfdf !important;
  padding-top: 1px !important;
  padding-left: 13px !important;
}

.win-btn:focus,
.sys-dialog-btn:focus,
.sys-actions button:focus {
  outline: 1px dotted #000000 !important;
  outline-offset: -4px !important;
}

.win-btn:disabled,
.sys-dialog-btn:disabled,
.sys-actions button:disabled {
  color: #808080 !important;
  text-shadow: 1px 1px #ffffff !important;
  border-top: 1px solid #ffffff !important;
  border-left: 1px solid #ffffff !important;
  border-right: 1px solid #808080 !important;
  border-bottom: 1px solid #808080 !important;
  box-shadow: none !important;
  cursor: default !important;
}

.win-btn-icon {
  width: 14px !important;
  height: 14px !important;
  max-width: 14px !important;
  max-height: 14px !important;
  object-fit: contain !important;
  image-rendering: pixelated !important;
  margin-right: 6px !important;
  flex-shrink: 0 !important;
  background: transparent !important;
}

/* Tabs Header */
.win-tabs {
  display: flex !important;
  gap: 2px !important;
  padding: 0 4px !important;
  margin-bottom: -1px !important;
  position: relative !important;
  z-index: 2 !important;
  flex-shrink: 0 !important;
}

.win-tab-btn {
  appearance: none !important;
  -webkit-appearance: none !important;
  border-radius: 2px 2px 0 0 !important;
  background: #c0c0c0 !important;
  color: #000000 !important;
  font-family: Tahoma, 'MS Sans Serif', sans-serif !important;
  font-size: 11px !important;
  padding: 3px 10px 4px !important;
  border-top: 1px solid #ffffff !important;
  border-left: 1px solid #ffffff !important;
  border-right: 1px solid #000000 !important;
  border-bottom: 1px solid #808080 !important;
  box-shadow:
    inset 1px 1px 0 #dfdfdf,
    inset -1px 0 0 #808080 !important;
  cursor: pointer !important;
  outline: none !important;
  position: relative !important;
  user-select: none !important;
}

.win-tab-btn:hover {
  background: #d4d4d4 !important;
}

.win-tab-btn.active {
  padding-top: 4px !important;
  padding-bottom: 5px !important;
  margin-top: -2px !important;
  border-top: 2px solid #ffffff !important;
  border-left: 2px solid #ffffff !important;
  border-right: 2px solid #000000 !important;
  border-bottom: 1px solid #c0c0c0 !important;
  box-shadow:
    inset 1px 1px 0 #dfdfdf,
    inset -1px 0 0 #808080 !important;
  background: #c0c0c0 !important;
  font-weight: bold !important;
  z-index: 3 !important;
}

/* Tab Card Body */
.win-tab-pane {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 14px 16px !important;
  background: #c0c0c0 !important;
  border-top: 2px solid #ffffff !important;
  border-left: 2px solid #ffffff !important;
  border-right: 2px solid #000000 !important;
  border-bottom: 2px solid #000000 !important;
  box-shadow:
    inset -1px -1px 0 #808080,
    inset 1px 1px 0 #dfdfdf !important;
  position: relative !important;
  z-index: 1 !important;
  box-sizing: border-box !important;
}

/* Windows 95 Group Box */
.win-groupbox {
  border: 1px solid #808080 !important;
  box-shadow:
    1px 1px 0 #ffffff,
    inset 1px 1px 0 #ffffff !important;
  padding: 8px 12px 10px !important;
  margin: 0 0 10px 0 !important;
  background: transparent !important;
  flex-shrink: 0 !important;
}

.win-groupbox legend {
  padding: 0 4px !important;
  font-weight: bold !important;
  font-size: 11px !important;
  color: #000000 !important;
}

/* General Tab */
.sys-general-grid {
  display: flex !important;
  gap: 16px !important;
  margin-bottom: 10px !important;
  align-items: flex-start !important;
  flex-shrink: 0 !important;
}

.sys-general-media {
  display: flex !important;
  justify-content: center !important;
  align-items: flex-start !important;
  width: 68px !important;
  flex-shrink: 0 !important;
  padding-top: 4px !important;
}

.sys-computer-man {
  width: 60px !important;
  height: 60px !important;
  object-fit: contain !important;
  image-rendering: pixelated !important;
  background: transparent !important;
  mix-blend-mode: multiply !important;
}

.sys-general-details {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.sys-section-block {
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
}

.sys-name {
  font-size: 13px !important;
  font-weight: bold !important;
  color: #000080 !important;
  margin-bottom: 2px !important;
  letter-spacing: 0.2px !important;
}

.sys-title {
  font-size: 11px !important;
  font-weight: bold !important;
  color: #000000 !important;
  margin-bottom: 1px !important;
}

.sys-item {
  margin: 0 !important;
  font-size: 11px !important;
  color: #000000 !important;
  line-height: 1.35 !important;
}

.sys-item-strong {
  margin: 0 !important;
  font-size: 11px !important;
  font-weight: bold !important;
  color: #000000 !important;
  line-height: 1.35 !important;
}

.sys-desc-text {
  margin: 0 !important;
  font-size: 11px !important;
  line-height: 1.45 !important;
  color: #000000 !important;
}

/* Focus & Diploma Tab */
.sys-project-row {
  display: flex !important;
  gap: 12px !important;
  align-items: flex-start !important;
}

.sys-project-icon {
  width: 32px !important;
  height: auto !important;
  max-height: 40px !important;
  object-fit: contain !important;
  image-rendering: pixelated !important;
  flex-shrink: 0 !important;
  margin-top: 2px !important;
  background: transparent !important;
}

.sys-project-body {
  flex: 1 !important;
  min-width: 0 !important;
}

.sys-project-name {
  display: block !important;
  font-size: 12px !important;
  font-weight: bold !important;
  color: #000080 !important;
  margin-bottom: 2px !important;
}

.sys-project-stack {
  display: block !important;
  font-size: 10px !important;
  font-style: italic !important;
  color: #444444 !important;
  margin-bottom: 4px !important;
}

.sys-project-desc {
  margin: 0 0 8px 0 !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
  color: #000000 !important;
}

/* Desktop Guide Tab */
.sys-hint {
  margin: 0 0 8px 0 !important;
  font-size: 11px !important;
  color: #333333 !important;
}

.sys-apps-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
}

.sys-app-card {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 5px 8px !important;
  border: 1px solid #808080 !important;
  box-shadow:
    1px 1px 0 #ffffff,
    inset 1px 1px 0 #ffffff !important;
  background: #c0c0c0 !important;
  cursor: pointer !important;
}

.sys-app-card:hover {
  background: #000080 !important;
  color: #ffffff !important;
}

.sys-app-card:hover .sys-app-info strong,
.sys-app-card:hover .sys-app-info span {
  color: #ffffff !important;
}

.sys-app-icon {
  width: 24px !important;
  height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  object-fit: contain !important;
  image-rendering: pixelated !important;
  flex-shrink: 0 !important;
  background: transparent !important;
}

.sys-app-info {
  flex: 1 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
}

.sys-app-info strong {
  font-size: 11px !important;
  color: #000000 !important;
}

.sys-app-info span {
  font-size: 10px !important;
  color: #444444 !important;
}

/* Contact Tab */
.sys-contact-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.sys-contact-item {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 6px 10px !important;
  border: 1px solid #808080 !important;
  box-shadow:
    1px 1px 0 #ffffff,
    inset 1px 1px 0 #ffffff !important;
  background: #c0c0c0 !important;
  text-decoration: none !important;
  color: #000000 !important;
}

.sys-contact-item:hover {
  background: #000080 !important;
  color: #ffffff !important;
}

.sys-contact-item:hover strong,
.sys-contact-item:hover span {
  color: #ffffff !important;
}

.sys-contact-bullet {
  font-family: monospace !important;
  font-size: 12px !important;
  font-weight: bold !important;
  color: #000080 !important;
  user-select: none !important;
}

.sys-contact-item:hover .sys-contact-bullet {
  color: #ffffff !important;
}

.sys-contact-text {
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
}

.sys-contact-text strong {
  font-size: 11px !important;
  color: inherit !important;
}

.sys-contact-text span {
  font-size: 10px !important;
  color: inherit !important;
}

/* Dialog Bottom Actions */
.sys-actions {
  display: flex !important;
  justify-content: flex-end !important;
  gap: 6px !important;
  margin-top: 8px !important;
  flex-shrink: 0 !important;
}
</style>
