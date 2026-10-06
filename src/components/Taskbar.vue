<script setup lang="ts">
import type { FrameWindow } from './WindowFrame.vue';

defineProps<{
  windows: FrameWindow[];
  activeId: string | null;
  startOpen: boolean;
  time: string;
}>();

const emit = defineEmits<{
  toggleStart: [];
  focusWindow: [id: string];
}>();
</script>

<template>
  <footer class="taskbar">
    <button class="start-button" @click.stop="emit('toggleStart')">
      <img src="/icons/windows.gif" alt="" />
      Start
    </button>

    <button
      v-for="windowState in windows"
      :key="windowState.id"
      class="taskbar-window"
      :class="{ active: activeId === windowState.id, 'music-window': windowState.id === 'music' }"
      @click="emit('focusWindow', windowState.id)"
    >
      <img :src="windowState.icon" alt="" />
      {{ windowState.title }}
    </button>

    <time class="taskbar-time">{{ time }}</time>
  </footer>
</template>
