<script setup lang="ts">
export interface DesktopIconItem {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

defineProps<{
  icons: DesktopIconItem[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
  open: [id: string];
  dragStart: [event: PointerEvent, id: string];
}>();
</script>

<template>
  <button
    v-for="icon in icons"
    :key="icon.id"
    class="desktop-icon"
    :class="{ selected: selectedId === icon.id, 'music-icon': icon.id === 'music' }"
    :style="{ left: `${icon.x}px`, top: `${icon.y}px` }"
    @pointerdown="emit('dragStart', $event, icon.id)"
    @click="emit('select', icon.id)"
    @dblclick="emit('open', icon.id)"
  >
    <img :src="icon.icon" :alt="icon.label" />
    <span>{{ icon.label }}</span>
  </button>
</template>
