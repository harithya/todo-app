<template>
  <div class="progress progress--sm">
    <div class="progress__track">
      <div class="progress__bar progress__bar--primary" :style="{ width: `${nilai}%` }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nilai: { type: Number, required: true },
})
</script>
