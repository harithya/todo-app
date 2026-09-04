<template>
  <AppPageLayout title="Laporan">
    <div class="flex flex-col gap-5">
      <section class="flex flex-col gap-2">
        <VueDatePicker
          v-model="rentang"
          :range="{ partialRange: false }"
          :locale="id"
          :formats="{ input: formatRentang }"
          :time-config="{ enableTimePicker: false }"
          :input-attrs="{ clearable: false }"
          :action-row="{ selectBtnLabel: 'Terapkan', cancelBtnLabel: 'Batal', nowBtnLabel: 'Hari ini' }"
          placeholder="Pilih rentang tanggal"
          auto-apply
        />

        <button
          v-if="bukanDefault"
          type="button"
          class="self-end text-xs font-medium text-primary-emphasis active:opacity-70"
          @click="resetRentang"
        >
          Kembali ke 30 hari
        </button>
      </section>

      <section class="grid grid-cols-2 gap-3">
        <div v-for="s in statistik" :key="s.label" class="card">
          <div class="card__body py-4 px-3 text-center">
            <p class="text-lg font-semibold text-foreground leading-none tabular-nums">{{ s.value }}</p>
            <p class="text-xs text-muted-foreground mt-1.5 line-clamp-1">{{ s.label }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-semibold text-foreground mb-1.5">Progres penyelesaian</h2>
        <div class="card">
          <div class="card__body p-4">
            <ProgressLine v-if="deret.length" :deret="deret" />
            <p v-else class="text-sm text-muted-foreground text-center py-6">
              Belum ada task selesai di rentang ini.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-semibold text-foreground mb-1.5">Selesai vs belum</h2>
        <div class="card">
          <div class="card__body p-4">
            <StatusDonut
              :selesai="ringkas.selesai"
              :belum="ringkas.belum"
              :persen="ringkas.persenSelesai"
            />
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between gap-3 mb-1.5">
          <h2 class="font-semibold text-foreground">Rincian per task</h2>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-primary-emphasis active:opacity-70"
            @click="urut = urut === 'durasi' ? 'terbaru' : 'durasi'"
          >
            <component :is="urut === 'durasi' ? PhArrowDown : PhArrowUp" :size="14" />
            {{ urut === "durasi" ? "Terlama" : "Terbaru" }}
          </button>
        </div>

        <div class="card">
          <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
            <RouterLink
              v-for="r in baris"
              :key="r.id"
              :to="{ name: 'task-detail', params: { id: r.id } }"
              class="flex items-center gap-3 px-4 py-3 active:bg-surface-2 transition-colors"
            >
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-foreground line-clamp-1">{{ r.judul }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ r.divisi }} · {{ statusLabel[r.status] }}
                </p>
              </div>
              <span class="text-sm font-semibold text-foreground tabular-nums shrink-0">
                {{ formatDurasi(r.menit) }}
              </span>
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, ref } from "vue"
import { PhArrowDown, PhArrowUp } from "@phosphor-icons/vue"
import { VueDatePicker } from "@vuepic/vue-datepicker"
import { format as formatTanggal } from "date-fns"
import { id } from "date-fns/locale"
import AppPageLayout from "../layouts/AppPageLayout.vue"
import ProgressLine from "../components/report/ProgressLine.vue"
import StatusDonut from "../components/report/StatusDonut.vue"
import { statusLabel } from "../data/tasks"
import {
  formatDurasi,
  kumulatifSelesai,
  rentangDefault,
  rincian,
  ringkasan,
  taskRentang,
} from "../data/laporan"

const awalan = rentangDefault(30)
const bawaan = [awalan.dari, awalan.sampai]

const rentang = ref([...bawaan])

function formatRentang(tanggal) {
  const daftar = (Array.isArray(tanggal) ? tanggal : [tanggal]).filter(Boolean)
  if (!daftar.length) return ""
  const tulis = (d) => formatTanggal(d, "d MMMM yyyy", { locale: id })
  return daftar.length === 1 ? tulis(daftar[0]) : `${tulis(daftar[0])} - ${tulis(daftar[1])}`
}
const urut = ref("durasi")

const daftar = computed(() => {
  const [dari, sampai] = rentang.value ?? []
  return taskRentang(dari, sampai)
})

const bukanDefault = computed(() => {
  const [dari, sampai] = rentang.value ?? []
  return +dari !== +bawaan[0] || +sampai !== +bawaan[1]
})

function resetRentang() {
  rentang.value = [...bawaan]
}
const ringkas = computed(() => ringkasan(daftar.value))
const deret = computed(() => kumulatifSelesai(daftar.value))
const baris = computed(() => rincian(daftar.value, urut.value))

const statistik = computed(() => [
  { label: "Total task", value: ringkas.value.total },
  { label: "Selesai", value: ringkas.value.selesai },
  { label: "Rata-rata durasi", value: formatDurasi(ringkas.value.rataMenit) },
  { label: "Median durasi", value: formatDurasi(ringkas.value.medianMenit) },
])
</script>
