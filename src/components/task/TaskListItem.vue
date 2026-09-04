<template>
  <RouterLink
    :to="{ name: 'task-detail', params: { id: task.id } }"
    class="card active:scale-[0.99] transition-transform block"
    :class="{ 'border-danger/40': task.pk }"
  >
    <div class="card__body p-3 gap-2.5">
      <div class="flex items-start gap-2">
        <span v-if="task.pk" class="badge badge--danger shrink-0 mt-0.5">PK</span>
        <p class="font-medium text-foreground leading-snug line-clamp-2 flex-1">{{ task.judul }}</p>
        <TaskStatusBadge :status="task.status" class="shrink-0" />
      </div>

      <p class="text-xs text-muted-foreground line-clamp-1">{{ task.catatan }}</p>

      <div class="flex items-center gap-2">
        <ProgressBar :nilai="task.progres" class="flex-1" />
        <span class="text-xs font-medium text-muted-foreground tabular-nums shrink-0">
          {{ task.progres }}%
        </span>
      </div>

      <div class="flex items-center gap-3 text-xs text-muted-foreground">
        <span class="inline-flex items-center gap-1">
          <PhUserCircle :size="13" class="shrink-0" />
          {{ task.pemberi }}
        </span>
        <span class="inline-flex items-center gap-1">
          <PhCalendarBlank :size="13" class="shrink-0" />
          {{ task.due }}
        </span>
        <span class="ms-auto">{{ task.divisi }} · {{ task.jenis }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { PhCalendarBlank, PhUserCircle } from "@phosphor-icons/vue"
import ProgressBar from "./ProgressBar.vue"
import TaskStatusBadge from "./TaskStatusBadge.vue"

defineProps({
  task: { type: Object, required: true },
})
</script>
