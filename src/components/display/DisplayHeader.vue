<template>
  <header class="sapuan relative overflow-hidden shrink-0 pattern-primary rounded-xl px-[clamp(1rem,1.6vw,2rem)] py-[clamp(0.5rem,0.9vh,1rem)] flex items-center justify-between">
    <div class="relative z-1 flex items-center gap-[clamp(0.75rem,1.1vw,1.5rem)]">
      <div class="bg-surface rounded-lg p-1.5 shrink-0 size-[clamp(2.4rem,3.2vw,4rem)] flex items-center justify-center">
        <img src="/logo.png" alt="Ostic" class="w-full h-full object-contain" />
      </div>
      <div>
        <p class="text-white/75 uppercase tracking-[0.22em] font-medium text-[clamp(0.5rem,0.62vw,0.85rem)]">
          Ostic Management
        </p>
        <h1 class="text-white font-semibold uppercase tracking-wide text-[clamp(0.95rem,1.35vw,2rem)] leading-tight">
          Papan Tugas Digital
        </h1>
      </div>
    </div>

    <div class="relative z-1 text-right">
      <p class="text-white/75 font-medium text-[clamp(0.6rem,0.75vw,1rem)]">{{ tanggal }}</p>
      <p class="text-white font-bold tabular-nums tracking-wider text-[clamp(1.3rem,2vw,3rem)] leading-tight">
        {{ jam }}
      </p>
    </div>
  </header>
</template>

<script setup>
import { useJam } from "../../composables/useJam"

const { tanggal, jam } = useJam()
</script>
