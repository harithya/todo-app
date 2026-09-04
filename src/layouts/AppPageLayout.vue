<template>
  <div class="pattern-primary">
    <header class="relative pt-5 pb-16 text-center">
      <RouterLink
        v-if="backTo"
        :to="backTo"
        class="absolute left-4 top-5 flex items-center justify-center text-white active:scale-95 transition-transform"
        aria-label="Kembali"
      >
        <PhArrowLeft :size="22" weight="bold" />
      </RouterLink>
      <h1 class="text-lg font-semibold text-white" :class="backTo ? 'px-10' : ''">{{ title }}</h1>
    </header>

    <!-- App bar fixed yang muncul saat scroll -->
    <div
      class="fixed top-0 inset-x-0 z-30 transition-transform duration-200 ease-out"
      :class="scrolled ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="max-w-lg mx-auto pattern-primary border-b border-white/10 shadow-sm">
        <div class="relative flex items-center justify-center h-14">
          <RouterLink
            v-if="backTo"
            :to="backTo"
            class="absolute left-2 flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="Kembali"
          >
            <PhArrowLeft :size="22" weight="bold" />
          </RouterLink>
          <h1 class="text-base font-semibold text-white px-10 truncate">{{ title }}</h1>
        </div>
      </div>
    </div>

    <div class="relative -mt-10 bg-surface rounded-t-3xl p-5 pb-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { PhArrowLeft } from "@phosphor-icons/vue"

defineProps({
  title: { type: String, required: true },
  backTo: { type: [Object, String], default: null },
})

const scrolled = ref(false)
const threshold = 72

function onScroll() {
  scrolled.value = window.scrollY > threshold
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>
