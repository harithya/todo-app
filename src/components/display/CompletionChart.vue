<template>
  <section class="bg-surface rounded-xl border border-border overflow-hidden shrink-0">
    <div class="flex items-center justify-between gap-4 px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.35rem,0.7vh,0.85rem)] border-b-2 border-border">
      <h2 class="font-semibold uppercase tracking-wider text-primary-emphasis text-[clamp(0.72rem,0.95vw,1.35rem)]">
        Grafik Penyelesaian Task
      </h2>
      <div class="flex items-center flex-wrap justify-end gap-x-[clamp(0.5rem,0.9vw,1.4rem)] gap-y-1">
        <span
          v-for="e in EMBER"
          :key="e.key"
          class="flex items-center gap-1.5 text-muted-foreground text-[clamp(0.48rem,0.62vw,0.85rem)]"
        >
          <span class="rounded-full size-[clamp(0.35rem,0.45vw,0.6rem)]" :class="e.warna" />
          {{ e.label }}
        </span>
      </div>
    </div>

    <div class="px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.4rem,0.8vh,1rem)] flex flex-col gap-[clamp(0.25rem,0.5vh,0.6rem)]">
      <p class="text-muted-foreground uppercase tracking-wider font-semibold text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Per Divisi
      </p>
      <div v-for="b in perDivisi" :key="b.label" class="flex items-start gap-3">
        <span class="shrink-0 text-muted-foreground w-[clamp(4rem,7vw,10rem)] text-[clamp(0.55rem,0.7vw,0.95rem)]">
          {{ b.label }}
        </span>
        <div class="flex flex-wrap items-center gap-[clamp(0.15rem,0.22vw,0.3rem)]">
          <span
            v-for="(t, i) in b.titik"
            :key="i"
            class="rounded-full size-[clamp(0.4rem,0.55vw,0.75rem)]"
            :class="t.warna"
            :title="`${t.label} — ${t.judul}`"
          />
        </div>
      </div>

      <p class="text-muted-foreground uppercase tracking-wider font-semibold mt-1 text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Per Orang
      </p>
      <div v-for="b in perOrang" :key="b.label" class="flex items-start gap-3">
        <span class="shrink-0 text-muted-foreground w-[clamp(4rem,7vw,10rem)] text-[clamp(0.55rem,0.7vw,0.95rem)]">
          {{ b.label }}
        </span>
        <div class="flex flex-wrap items-center gap-[clamp(0.15rem,0.22vw,0.3rem)]">
          <span
            v-for="(t, i) in b.titik"
            :key="i"
            class="rounded-full size-[clamp(0.4rem,0.55vw,0.75rem)]"
            :class="t.warna"
            :title="`${t.label} — ${t.judul}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"
import { EMBER, ember } from "../../data/display"

const props = defineProps({
  papan: { type: Array, required: true },
})

const URUTAN = EMBER.map((e) => e.key)

// Titik diurutkan per ember supaya baris terbaca sebagai proporsi, bukan
// taburan acak: yang tuntas menumpuk di kiri, yang bermasalah di kanan.
function baris(label, daftar) {
  const titik = [...daftar]
    .sort((a, b) => URUTAN.indexOf(ember(a)) - URUTAN.indexOf(ember(b)))
    .map((t) => {
      const e = EMBER.find((x) => x.key === ember(t))
      return { warna: e.warna, label: e.label, judul: t.judul }
    })
  return { label, titik }
}

const perDivisi = computed(() =>
  props.papan.map((d) => baris(d.nama, [...d.rutin, ...d.insidentil]))
)

const perOrang = computed(() => {
  const map = {}
  for (const d of props.papan) {
    for (const t of [...d.rutin, ...d.insidentil]) {
      ;(map[t.assignee] ||= []).push(t)
    }
  }
  return Object.keys(map).sort().map((nama) => baris(nama, map[nama]))
})
</script>
