<template>
  <div class="flex flex-col pb-8">
    <header class="pattern-primary px-5 pt-6 pb-12">
      <p class="text-sm text-white/70">Selamat Datang</p>
      <h1 class="text-xl font-semibold text-white mt-0.5">Hallo Harithya Wisesa</h1>
    </header>

    <div class="px-5 flex flex-col gap-5 -mt-9">
      <section class="card">
        <div class="grid grid-cols-3 divide-x divide-black/10 dark:divide-white/15">
          <div v-for="s in statistik" :key="s.label" class="py-4 text-center">
            <p class="text-lg font-semibold text-foreground leading-none">{{ s.value }}</p>
            <p class="text-xs text-muted-foreground mt-1.5 px-1.5 line-clamp-1">{{ s.label }}</p>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3 -mx-5 px-5 overflow-x-auto tab-scroll">
          <div class="flex items-center gap-2 w-max" role="tablist">
            <button
              v-for="f in filter"
              :key="f.key"
              type="button"
              class="chip whitespace-nowrap"
              :class="{ 'chip--active': aktif === f.key }"
              @click="aktif = f.key"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div v-if="terfilter.length" class="flex flex-col gap-3">
          <TaskListItem v-for="t in terfilter" :key="t.id" :task="t" />
        </div>
        <div v-else class="empty-state empty-state--sm">
          <p class="empty-state__title">Tidak ada task</p>
          <p class="empty-state__text">Belum ada task dengan status ini.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import TaskListItem from "../../components/task/TaskListItem.vue"
import { tasks } from "../../data/tasks"

const aktif = ref("semua")

const hitung = (status) => tasks.filter((t) => t.status === status).length

const filter = [
  { key: "semua", label: "Semua" },
  { key: "dikerjakan", label: "Dikerjakan" },
  { key: "menunggu", label: "Perlu Diperiksa" },
  { key: "revisi", label: "Revisi" },
  { key: "tambahanWaktu", label: "Tambahan Waktu" },
  { key: "selesai", label: "Sudah Diperiksa" },
]

const perluPerhatian = (t) => (t.pk || t.status === "revisi" || t.status === "tambahanWaktu") && t.status !== "selesai"

const statistik = computed(() => [
  { label: "Dikerjakan", value: hitung("baru") + hitung("dikerjakan") },
  { label: "Menunggu", value: hitung("menunggu") },
  { label: "Revisi", value: hitung("revisi") },
])

const terfilter = computed(() => {
  let hasil = tasks
  if (aktif.value === "dikerjakan") {
    hasil = tasks.filter((t) => t.status === "dikerjakan" || t.status === "baru")
  } else if (aktif.value !== "semua") {
    hasil = tasks.filter((t) => t.status === aktif.value)
  } else {
    hasil = tasks.filter((t) => t.progres < 100)
  }
  // sort() memutasi array asli, jadi salin dulu.
  return [...hasil].sort((a, b) => perluPerhatian(b) - perluPerhatian(a))
})

</script>
