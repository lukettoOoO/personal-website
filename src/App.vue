<script setup lang="ts">
import { ref } from 'vue';

const projectsOpen = ref(false);

function toggleProjects() {
  projectsOpen.value = !projectsOpen.value;
}
</script>

<template>
  \
  <main class="desktop">
    <button class="desktop-icon" @click="toggleProjects">
      <img src="/icons/my_computer.gif" alt="" />
      <span>My Computer</span>
    </button>

    <button class="desktop-icon" @click="toggleProjects">
      <img src="/icons/projects.gif" alt="" />
      <span>Projects</span>
    </button>

    <button class="desktop-icon" @click="toggleProjects">
      <img src="/icons/smiley.gif" alt="" />
      <span>About me</span>
    </button>

    <button class="desktop-icon" @click="toggleProjects">
      <img src="/icons/cv.gif" alt="" />
      <span>CV_latest.doc</span>
    </button>

    <section v-if="projectsOpen" class="window">
      <header class="window-titlebar">
        <strong>Projects</strong>

        <button class="window-close" @click="projectsOpen = false">×</button>
      </header>

      <div class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Help</div>

      <div class="window-toolbar">
        <button>Back</button>
        <button>Up</button>
        <span>C:\Luca\Projects</span>
      </div>

      <div class="file-area">
        <button class="file">
          <img src="/icons/project.png" alt="" />
          <span>Nextcloud Timekeeping Plugin</span>
        </button>

        <button class="file">
          <img src="/icons/project.png" alt="" />
          <span>Home Lab</span>
        </button>

        <button class="file">
          <img src="/icons/project.png" alt="" />
          <span>EcoMeal</span>
        </button>

        <button class="file">
          <img src="/icons/project.png" alt="" />
          <span>TCP Chat</span>
        </button>

        <button class="file">
          <img src="/icons/project.png" alt="" />
          <span>Personal website</span>
        </button>
      </div>

      <footer class="window-status">5 object(s)</footer>
    </section>

    <footer class="taskbar">
      <button class="start-button">Luca</button>
      <span class="taskbar-time">12:00 PM</span>
    </footer>
  </main>
</template>
