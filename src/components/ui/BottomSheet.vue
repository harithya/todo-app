<template>
  <VueBottomSheet
    ref="sheetRef"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :overlay-click-close="overlayClickClose"
    :can-swipe="canSwipe"
    @opened="emit('opened')"
    @closed="emit('closed')"
  >
    <template #header>
      <slot name="header" />
    </template>

    <slot />

    <template #footer>
      <slot name="footer" />
    </template>
  </VueBottomSheet>
</template>

<script setup>
import { ref } from "vue"
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet"

defineProps({
  maxWidth: { type: Number, default: 512 },
  maxHeight: { type: Number, default: 0 },
  overlayClickClose: { type: Boolean, default: true },
  canSwipe: { type: Boolean, default: true },
})

const emit = defineEmits(["opened", "closed"])

const sheetRef = ref(null)

function open() {
  sheetRef.value?.open()
}

function close() {
  sheetRef.value?.close()
}

defineExpose({ open, close })
</script>
