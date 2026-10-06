<script setup lang="ts">
export interface FrameWindow {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

defineProps<{
  windowState: FrameWindow;
  active: boolean;
}>();

const emit = defineEmits<{
  focus: [];
  close: [];
  minimize: [];
  maximize: [];
  dragStart: [event: PointerEvent];
}>();
</script>

<template>
  <section
    v-if="!windowState.minimized"
    class="window"
    :class="{ active: active, maximized: windowState.maximized }"
    :style="{
      left: `${windowState.x}px`,
      top: `${windowState.y}px`,
      width: `${windowState.width}px`,
      height: `${windowState.height}px`,
      zIndex: windowState.zIndex,
    }"
    @pointerdown="emit('focus')"
  >
    <header class="window-titlebar" @pointerdown.stop="emit('dragStart', $event)">
      <strong>{{ windowState.title }}</strong>

      <div class="window-controls">
        <button aria-label="Minimize" @click.stop="emit('minimize')">_</button>
        <button aria-label="Maximize" @click.stop="emit('maximize')">□</button>
        <button aria-label="Close" @click.stop="emit('close')">×</button>
      </div>
    </header>

    <slot />
  </section>
</template>
