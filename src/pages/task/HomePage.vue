<template>
  <div class="flex flex-col pb-8">
    <header class="pattern-primary px-5 pt-6 pb-12">
      <p class="text-sm text-white/70">Selamat Datang</p>
      <h1 class="text-xl font-semibold text-white mt-0.5">Hallo {{ currentUser.nama }}</h1>
    </header>

    <div class="px-5 flex flex-col gap-5 -mt-6">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <PhMagnifyingGlass :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            v-model="search"
            type="text"
            class="input ps-10 focus:outline-none focus:ring-0"
            placeholder="Cari tasknya disini"
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

      <SegmentedControl v-model="scope" :options="scopeOptions" />

      <section>
        <div class="mb-3 -mx-5 px-5 overflow-x-auto tab-scroll">
          <div class="flex items-center gap-2 w-max" role="tablist">
            <button
              v-for="f in filter"
              :key="f.key"
              type="button"
              class="chip whitespace-nowrap"
              :class="{
                'chip--active': aktif === f.key,
                'opacity-45': !jumlah[f.key] && aktif !== f.key,
              }"
              @click="aktif = f.key"
            >
              {{ f.label }}
              <span class="ms-1.5 tabular-nums opacity-70">{{ jumlah[f.key] }}</span>
            </button>
          </div>
        </div>

        <div v-if="terfilter.length" class="flex flex-col gap-3">
          <TaskListItem
            v-for="t in terfilter"
            :key="t.id"
            :task="t"
            :peran="scope === 'dibuat' || (scope === 'semua' && t.pemberi === currentUser.nama) ? 'pembuat' : 'assignee'"
          />
        </div>
        <div v-else>
          <EmptyState title="Tidak ada task" :text="emptyText" />
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
import SegmentedControl from "../../components/ui/SegmentedControl.vue"
import { tasks } from "../../data/tasks"
import { currentUser } from "../../stores/auth"

const router = useRouter()
const aktif = ref("berjalan")
const scope = ref("saya")
const search = ref("")
const urut = ref("terbaru")
const fabVisible = ref(tasks.filter((t) => t.progres < 100).length <= 4)

const scopeOptions = [
  { key: "saya", label: "Untuk Saya" },
  { key: "dibuat", label: "Dari Saya" },
  { key: "semua", label: "Semua" },
]

const filter = [
  { key: "berjalan", label: "Berjalan" },
  { key: "dikerjakan", label: "Dikerjakan" },
  { key: "menunggu", label: "Perlu Diperiksa" },
  { key: "revisi", label: "Revisi" },
  { key: "tambahanWaktu", label: "Tambahan Waktu" },
  { key: "selesai", label: "Sudah Diperiksa" },
]

const emptyText = computed(() => {
  if (scope.value === "dibuat") return "Belum ada task yang Anda berikan ke orang lain."
  if (scope.value === "saya") return "Belum ada task yang ditugaskan ke Anda dengan status ini."
  return "Belum ada task dengan status ini."
})

const perluPerhatian = (t) => (t.pk || t.status === "revisi" || t.status === "tambahanWaktu") && t.status !== "selesai"

const bulan = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 }
function parseTanggal(s) {
  const m = s.match(/(\d+)\s(\w+)/)
  if (!m) return 0
  return new Date(2026, bulan[m[2]] ?? 0, Number(m[1])).getTime()
}

// Himpunan sebelum filter status. Angka di tiap chip dihitung dari sini supaya
// jumlahnya ikut scope dan pencarian, tapi tidak ikut chip yang sedang aktif.
const dasar = computed(() => {
  let hasil = tasks
  if (scope.value === "saya") {
    hasil = hasil.filter((t) => t.assignee === currentUser.value.nama)
  } else if (scope.value === "dibuat") {
    hasil = hasil.filter((t) => t.pemberi === currentUser.value.nama)
  }
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    hasil = hasil.filter((t) => t.judul.toLowerCase().includes(q))
  }
  return hasil
})

function cocokStatus(t, key) {
  if (key === "berjalan") return t.progres < 100
  if (key === "dikerjakan") return t.status === "dikerjakan" || t.status === "baru"
  return t.status === key
}

const jumlah = computed(() =>
  Object.fromEntries(filter.map((f) => [f.key, dasar.value.filter((t) => cocokStatus(t, f.key)).length]))
)

const terfilter = computed(() => {
  const hasil = dasar.value.filter((t) => cocokStatus(t, aktif.value))
  return [...hasil].sort((a, b) => {
    const pa = perluPerhatian(a), pb = perluPerhatian(b)
    if (pa !== pb) return pb - pa
    const da = parseTanggal(a.diassign), db = parseTanggal(b.diassign)
    return urut.value === "terbaru" ? db - da : da - db
  })
})

function onScroll() {
  fabVisible.value = !(window.scrollY < 10 && terfilter.value.length > 4)
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener("scroll", onScroll))

watch([aktif, scope], () => {
  window.scrollTo(0, 0)
  nextTick(() => { fabVisible.value = terfilter.value.length <= 4 })
})

watch(terfilter, (val) => { fabVisible.value = val.length <= 4 })
</script>
