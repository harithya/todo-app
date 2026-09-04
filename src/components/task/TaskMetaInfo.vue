<template>
  <div class="card">
    <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <PhUserCircle :size="16" class="shrink-0" />
          Diberikan oleh
        </span>
        <span class="text-sm font-medium text-foreground">{{ task.pemberi }}</span>
      </div>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <PhCalendarPlus :size="16" class="shrink-0" />
          Diassign
        </span>
        <span class="text-sm font-medium text-foreground">{{ task.diassign }}</span>
      </div>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <PhCalendarDots :size="16" class="shrink-0" />
          Batas waktu
        </span>
        <span class="text-sm font-medium text-foreground">{{ task.due }}</span>
      </div>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <PhClock :size="16" class="shrink-0" />
          Update terakhir
        </span>
        <span class="text-sm font-medium text-foreground">{{ task.waktuUpdate }} WIB</span>
      </div>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <PhPaperclip :size="16" class="shrink-0" />
          Lampiran
        </span>
        <span class="text-sm font-medium text-foreground">{{ jumlahLampiran }} berkas</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhCalendarDots, PhCalendarPlus, PhClock, PhPaperclip, PhUserCircle } from "@phosphor-icons/vue"

defineProps({
  task: { type: Object, required: true },
  jumlahLampiran: { type: Number, required: true },
})
</script>
