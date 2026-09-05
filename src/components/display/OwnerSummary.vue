<template>
  <div class="flex-1 min-h-0 flex flex-col gap-2">
    <div class="shrink-0 grid grid-cols-8 gap-2">
      <div
        v-for="k in KARTU"
        :key="k.kunci"
        class="bg-surface rounded-xl border px-2 py-[clamp(0.3rem,0.8vh,1rem)] text-center"
        :class="k.garis"
      >
        <p class="font-bold tabular-nums leading-none text-[clamp(1.1rem,2.1vw,3.2rem)]" :class="k.teks">
          {{ angka[k.kunci] }}
        </p>
        <p class="text-muted-foreground mt-1 leading-tight text-[clamp(0.48rem,0.62vw,0.85rem)]">
          {{ k.label }}
        </p>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto papan-scroll flex flex-col gap-2">
      <BoardTable
        v-for="d in papan"
        :key="d.nama"
        :judul="d.nama"
        jenis="rutin"
        :daftar="semua(d)"
        class="shrink-0"
      />
      <CompletionChart :papan="papan" />
    </div>
  </div>
</template>

<script setup>
import BoardTable from "./BoardTable.vue"
import CompletionChart from "./CompletionChart.vue"
import { urutkan } from "../../data/display"

defineProps({
  papan: { type: Array, required: true },
  angka: { type: Object, required: true },
})

const KARTU = [
  { kunci: "total", label: "Total Task", teks: "text-foreground", garis: "border-border" },
  { kunci: "belum", label: "On Progress", teks: "text-foreground", garis: "border-border" },
  { kunci: "pd", label: "Perlu Diperiksa", teks: "text-warning-emphasis", garis: "border-warning/40" },
  { kunci: "sd", label: "Sudah Diperiksa", teks: "text-primary-emphasis", garis: "border-primary/40" },
  { kunci: "rev", label: "Revisi", teks: "text-danger-emphasis", garis: "border-danger/40" },
  { kunci: "tw", label: "Tambahan Waktu", teks: "text-danger-emphasis", garis: "border-danger/40" },
  { kunci: "prioritas", label: "Prioritas", teks: "text-warning-emphasis", garis: "border-warning/40" },
  { kunci: "pk", label: "Perhatian Khusus", teks: "text-danger-emphasis", garis: "border-danger/40" },
]

// Tab Owner menggabung rutin dan insidentil: yang dilihat pemilik adalah
// beban satu divisi, bukan pembagian jenis tugasnya.
const semua = (d) => urutkan([...d.rutin, ...d.insidentil])
</script>
