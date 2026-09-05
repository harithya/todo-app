<template>
  <div class="relative flex items-center p-1 rounded-full bg-gray-100 dark:bg-white/10" role="tablist">
    <!-- Pill aktif dianimasikan sebagai satu elemen yang meluncur, bukan warna
         yang berpindah antar tombol. `transform` aman dianimasikan; jangan
         diganti dengan animasi left/width yang memicu layout. -->
    <span
      aria-hidden="true"
      class="absolute top-1 bottom-1 left-1 rounded-full bg-surface shadow-sm transition-transform duration-300 motion-reduce:transition-none"
      :style="{
        width: `calc((100% - 0.5rem) / ${options.length})`,
        transform: `translateX(${index * 100}%)`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }"
    />
    <button
      v-for="o in options"
      :key="o.key"
      type="button"
      role="tab"
      :aria-selected="model === o.key"
      class="relative flex-1 px-3 py-2 rounded-full text-sm transition-colors"
      :class="model === o.key
        ? 'text-primary-emphasis font-semibold'
        : 'text-muted-foreground font-medium'"
      @click="model = o.key"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue"

const model = defineModel({ type: String, required: true })

const props = defineProps({
  options: { type: Array, required: true },
})

const index = computed(() => Math.max(0, props.options.findIndex((o) => o.key === model.value)))
</script>
