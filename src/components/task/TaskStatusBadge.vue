<template>
  <span class="badge badge--soft" :class="kelas">{{ statusLabel[status] }}</span>
</template>

<script setup>
import { computed } from "vue"
import { statusLabel } from "../../data/tasks"

const props = defineProps({
  status: { type: String, required: true },
})

const kelas = computed(
  () =>
    ({
      baru: "badge--info",
      dikerjakan: "badge--primary",
      menunggu: "badge--warning",
      revisi: "badge--danger",
      tambahanWaktu: "badge--danger",
      selesai: "badge--success",
    })[props.status],
)
</script>
