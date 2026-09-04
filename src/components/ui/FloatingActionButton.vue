<template>
  <div class="fixed bottom-28 left-0 right-0 z-20 flex justify-center pointer-events-none">
    <Transition name="fab">
      <button
        v-show="visible"
        type="button"
        class="button button--primary rounded-full pointer-events-auto"
      >
        <PhPlus :size="20" weight="bold" />
        Tambah
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { PhPlus } from "@phosphor-icons/vue"

defineProps({
  visible: { type: Boolean, default: true },
})
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style>
