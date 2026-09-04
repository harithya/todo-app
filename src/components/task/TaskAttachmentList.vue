<template>
  <div>
    <h2 class="font-semibold text-foreground mb-1.5">Lampiran</h2>

    <div v-if="lampiran.length" class="card">
      <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
        <div v-for="l in lampiran" :key="l.nama" class="flex items-center gap-3 px-4 py-3">
          <span class="panel__icon shrink-0">
            <PhPaperclip :size="16" weight="bold" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-foreground line-clamp-1">{{ l.nama }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ l.ukuran }} · {{ l.tanggal }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="card__body p-6 text-center">
        <p class="text-sm text-muted-foreground">Belum ada lampiran.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhPaperclip } from "@phosphor-icons/vue"

defineProps({
  lampiran: { type: Array, required: true },
})
</script>
