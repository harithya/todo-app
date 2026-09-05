<template>
  <div class="flex gap-2 shrink-0" role="tablist">
    <button
      v-for="(t, i) in tabs"
      :key="t.key"
      type="button"
      role="tab"
      :aria-selected="model === i"
      class="relative flex-1 rounded-lg border px-3 py-[clamp(0.25rem,0.5vh,0.6rem)] flex items-center justify-center gap-2 transition-colors"
      :class="model === i
        ? 'bg-primary border-primary text-primary-foreground'
        : 'bg-surface border-border-strong text-muted-foreground'"
      @click="model = i"
    >
      <span class="font-semibold uppercase tracking-wider text-[clamp(0.62rem,0.85vw,1.15rem)]">
        {{ t.label }}
      </span>
      <span class="font-medium opacity-70 text-[clamp(0.5rem,0.62vw,0.85rem)]">— {{ t.sub }}</span>

      <span
        v-if="t.pk"
        class="absolute -top-1.5 -right-1 bg-danger text-danger-foreground font-bold rounded-full px-1.5 py-px tracking-wide text-[clamp(0.42rem,0.52vw,0.7rem)]"
      >
        PK
      </span>
    </button>
  </div>
</template>

<script setup>
const model = defineModel({ type: Number, required: true })

defineProps({
  tabs: { type: Array, required: true },
})
</script>
