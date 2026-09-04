<template>
  <section class="card panel">
    <h3 class="panel__title">
      <span class="panel__icon">
        <PhAsteriskSimple :size="16" weight="bold" />
      </span>
      {{ title }}
    </h3>
    <slot />
  </section>
</template>

<script setup>
import { PhAsteriskSimple } from "@phosphor-icons/vue"

defineProps({
  title: { type: String, required: true },
})
</script>
