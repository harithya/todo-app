<template>
  <!-- `auto`: tinggi ikut isi, bukan ikut sisa layar. Dibatasi 45% supaya
       daftar insidentil yang panjang tidak mendorong panel rutin keluar layar
       — induknya `overflow-hidden`, jadi yang terdorong hilang, bukan bisa
       di-scroll. -->
  <section
    class="min-h-0 flex flex-col bg-surface rounded-xl border border-border overflow-hidden"
    :class="auto ? 'flex-none max-h-[45%]' : 'flex-1'"
  >
    <div class="shrink-0 flex items-center justify-between px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.35rem,0.7vh,0.85rem)] border-b-2 border-border">
      <h2 class="flex items-center gap-2 font-semibold uppercase tracking-wider text-primary-emphasis text-[clamp(0.72rem,0.95vw,1.35rem)]">
        <span
          class="rounded-full shrink-0 size-[clamp(0.35rem,0.45vw,0.6rem)]"
          :class="jenis === 'rutin' ? 'bg-primary' : 'bg-warning-emphasis'"
        />
        {{ judul }}
      </h2>
      <span class="bg-primary-50 text-primary-emphasis font-semibold rounded-full px-2.5 py-0.5 text-[clamp(0.55rem,0.68vw,0.95rem)]">
        {{ daftar.length }} Task
      </span>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto papan-scroll">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              v-for="k in KOLOM"
              :key="k.label"
              :style="{ width: k.lebar }"
              class="sticky top-0 z-1 bg-surface-2 text-left font-semibold uppercase tracking-wider text-muted-foreground border-b border-border px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.25rem,0.5vh,0.6rem)] text-[clamp(0.52rem,0.65vw,0.9rem)]"
            >
              {{ k.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!daftar.length">
            <td :colspan="KOLOM.length" class="text-center text-muted-foreground py-6 text-[clamp(0.65rem,0.8vw,1.1rem)]">
              Tidak ada tugas
            </td>
          </tr>

          <tr
            v-for="(t, i) in daftar"
            :key="t.id"
            class="border-b border-border align-top"
            :class="t.pk ? 'bg-danger/5' : t.prioritas ? 'bg-warning/10' : ''"
          >
            <td class="tabular-nums text-muted-foreground px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.58rem,0.72vw,1rem)]">
              {{ String(i + 1).padStart(2, "0") }}
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <p class="font-medium line-clamp-2 text-[clamp(0.65rem,0.85vw,1.2rem)]">
                <span
                  v-if="t.prioritas"
                  class="bg-warning text-warning-foreground font-bold rounded px-1 me-1.5 text-[clamp(0.45rem,0.55vw,0.75rem)]"
                >PR</span>
                {{ t.judul }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-[clamp(0.5rem,0.65vw,0.9rem)]">
                Maker: {{ t.assignee }} · Pengecek: {{ t.pengecek.join(" → ") || "—" }}
              </p>
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <p class="line-clamp-2 text-[clamp(0.6rem,0.78vw,1.1rem)]">
                <span
                  v-if="t.pk"
                  class="bg-danger text-danger-foreground font-bold rounded px-1 me-1.5 text-[clamp(0.45rem,0.55vw,0.75rem)]"
                >PK</span>
                {{ t.catatan }}
              </p>
              <p class="text-muted-foreground mt-0.5 tabular-nums text-[clamp(0.5rem,0.65vw,0.9rem)]">
                {{ t.waktuUpdate }} WIB
              </p>
            </td>

            <td class="tabular-nums px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.6rem,0.75vw,1.05rem)]">
              {{ t.due }}
            </td>

            <td
              class="tabular-nums font-semibold px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.62rem,0.8vw,1.1rem)]"
              :class="t.progres >= 100
                ? (statusPapan(t) === 'sd' ? 'text-primary-emphasis' : 'text-warning-emphasis')
                : 'text-foreground'"
            >
              {{ t.progres }}%
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <span
                v-if="KODE_PAPAN[statusPapan(t)]"
                class="font-bold rounded px-1.5 py-px me-1.5 text-[clamp(0.48rem,0.6vw,0.8rem)]"
                :class="KELAS_BADGE[statusPapan(t)]"
              >
                {{ KODE_PAPAN[statusPapan(t)] }}
              </span>
              <span class="text-muted-foreground text-[clamp(0.55rem,0.7vw,0.95rem)]">
                {{ LABEL_PAPAN[statusPapan(t)] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { KODE_PAPAN, LABEL_PAPAN, statusPapan } from "../../data/display"

defineProps({
  judul: { type: String, required: true },
  jenis: { type: String, required: true },
  daftar: { type: Array, required: true },
  auto: { type: Boolean, default: false },
})

const KOLOM = [
  { label: "No", lebar: "3rem" },
  { label: "Task / Tugas", lebar: "auto" },
  { label: "On Progress", lebar: "28%" },
  { label: "Due", lebar: "6rem" },
  { label: "Progress", lebar: "5.5rem" },
  { label: "Status", lebar: "13rem" },
]

const KELAS_BADGE = {
  pd: "bg-warning text-warning-foreground",
  sd: "bg-primary text-primary-foreground",
  rev: "bg-danger text-danger-foreground",
  tw: "bg-danger text-danger-foreground",
}
</script>
