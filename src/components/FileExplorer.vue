<script setup lang="ts">
import type { ProjectEntry } from '../data/projects';

defineProps<{
  projects: ProjectEntry[];
  path: string;
}>();
</script>

<template>
  <div class="explorer-shell">
    <nav class="window-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; View&nbsp;&nbsp; Help</nav>

    <div class="window-toolbar">
      <button>Back</button>
      <button>Up</button>
      <span>{{ path }}</span>
    </div>

    <div class="file-area">
      <a
        v-for="project in projects"
        :key="project.name"
        class="file"
        :href="project.url"
        target="_blank"
        rel="noreferrer"
      >
        <img :src="project.icon" :alt="project.name" />
        <span>{{ project.name }}</span>
      </a>
    </div>

    <footer class="window-status">{{ projects.length }} object(s)</footer>
  </div>
</template>
