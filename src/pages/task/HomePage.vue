<template>
  <div class="flex flex-col pb-8">
    <header class="pattern-primary px-5 pt-6 pb-12">
      <p class="text-sm text-white/70">Selamat Datang</p>
      <h1 class="text-xl font-semibold text-white mt-0.5">Hallo Harithya Wisesa</h1>
    </header>

    <div class="px-5 flex flex-col gap-5 -mt-6">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <PhMagnifyingGlass :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            v-model="search"
            type="text"
            class="input ps-10 focus:outline-none focus:ring-0"
            placeholder="Cari task..."
          />
        </div>
        <button
          type="button"
          class="flex items-center justify-center size-10 shrink-0 rounded-xl border border-border bg-surface active:scale-95 transition-transform"
          @click="urut = urut === 'terbaru' ? 'terlama' : 'terbaru'"
        >
          <PhArrowsDownUp :size="18" class="text-muted-foreground" />
        </button>
      </div>

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
        <div v-else>
          <EmptyState title="Tidak ada task" text="Belum ada task dengan status ini." />
        </div>
      </section>
    </div>

    <FloatingActionButton :visible="fabVisible" @click="router.push({ name: 'task-create' })" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { PhMagnifyingGlass, PhArrowsDownUp } from "@phosphor-icons/vue"
import TaskListItem from "../../components/task/TaskListItem.vue"
import FloatingActionButton from "../../components/ui/FloatingActionButton.vue"
import EmptyState from "../../components/ui/EmptyState.vue"
import { tasks } from "../../data/tasks"

const router = useRouter()
const aktif = ref("semua")
const search = ref("")
const urut = ref("terbaru")
const fabVisible = ref(tasks.filter((t) => t.progres < 100).length <= 4)

const filter = [
  { key: "semua", label: "Semua" },
  { key: "dikerjakan", label: "Dikerjakan" },
  { key: "menunggu", label: "Perlu Diperiksa" },
  { key: "revisi", label: "Revisi" },
  { key: "tambahanWaktu", label: "Tambahan Waktu" },
  { key: "selesai", label: "Sudah Diperiksa" },
]

const perluPerhatian = (t) => (t.pk || t.status === "revisi" || t.status === "tambahanWaktu") && t.status !== "selesai"

const bulan = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 }
function parseTanggal(s) {
  const m = s.match(/(\d+)\s(\w+)/)
  if (!m) return 0
  return new Date(2026, bulan[m[2]] ?? 0, Number(m[1])).getTime()
}

const terfilter = computed(() => {
  let hasil = tasks
  if (aktif.value === "dikerjakan") {
    hasil = tasks.filter((t) => t.status === "dikerjakan" || t.status === "baru")
  } else if (aktif.value !== "semua") {
    hasil = tasks.filter((t) => t.status === aktif.value)
  } else {
    hasil = tasks.filter((t) => t.progres < 100)
  }
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    hasil = hasil.filter((t) => t.judul.toLowerCase().includes(q))
  }
  const sorted = [...hasil].sort((a, b) => {
    const pa = perluPerhatian(a), pb = perluPerhatian(b)
    if (pa !== pb) return pb - pa
    const da = parseTanggal(a.diassign), db = parseTanggal(b.diassign)
    return urut.value === "terbaru" ? db - da : da - db
  })
  return sorted
})

let lastScroll = 0

function onScroll() {
  const y = window.scrollY
  lastScroll = y
  if (y < 10 && terfilter.value.length > 4) {
    fabVisible.value = false
  } else {
    fabVisible.value = true
  }
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener("scroll", onScroll))

watch(aktif, () => {
  window.scrollTo(0, 0)
  lastScroll = 0
  nextTick(() => { fabVisible.value = terfilter.value.length <= 4 })
})

watch(terfilter, (val) => { fabVisible.value = val.length <= 4 })
</script>
