<template>
  <AppPageLayout title="Detail Task" :back-to="{ name: 'home' }">
    <div v-if="task" class="flex flex-col gap-5">
      <div>
        <h1 class="text-lg font-semibold text-foreground leading-snug">{{ task.judul }}</h1>
        <div class="flex items-center justify-between gap-3 mt-1">
          <p class="text-sm text-primary-emphasis">
            <span v-if="task.pk" class="badge badge--danger me-1.5">PK</span>
            {{ task.divisi }} · {{ task.jenis }}
          </p>
          <TaskStatusBadge :status="task.status" class="shrink-0" />
        </div>
      </div>

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
            <span class="text-sm font-medium text-foreground">{{ lampiran.length }} berkas</span>
          </div>
        </div>
      </div>

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

      <div>
        <h2 class="font-semibold text-foreground mb-1.5">Progres</h2>
        <div class="card">
          <div class="card__body p-4 gap-3 items-center text-center">
            <ProgressRing :nilai="task.progres" />

            <p class="text-xs text-muted-foreground leading-relaxed">
              <template v-if="terkunci">
                Dikunci karena task sedang {{ statusLabel[task.status].toLowerCase() }}.
              </template>
              <template v-else>
                Update terakhir {{ task.waktuUpdate }} WIB.
              </template>
            </p>

            <button
              type="button"
              class="button button--primary w-full"
              :disabled="terkunci"
              @click="bukaSheet"
            >
              Update progres
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-foreground mb-1.5">Update Progres</h2>

        <div v-if="updates.length" class="card">
          <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
            <button
              v-for="(u, i) in updates"
              :key="i"
              type="button"
              class="flex items-center gap-3 px-4 py-3 text-left active:bg-surface-2 transition-colors"
              @click="lihatUpdate(u)"
            >
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-foreground tabular-nums">{{ u.persen }}%</span>
                  <span v-if="u.dikirim" class="badge badge--soft badge--warning">Dikirim</span>
                  <span
                    class="ms-auto flex items-center gap-1.5 text-xs text-muted-foreground/80 shrink-0"
                  >
                    {{ u.waktu }}
                  </span>
                </span>
                <span class="block text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {{ u.deskripsi || "Tanpa deskripsi" }}
                </span>
              </span>
            </button>
          </div>
        </div>
        <div v-else class="card">
          <div class="card__body p-6 text-center">
            <p class="text-sm text-muted-foreground">Belum ada update progres.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-foreground mb-1.5">Riwayat approval</h2>
        <div class="card">
          <div class="card__body p-4">
            <ul class="timeline">
              <li v-for="(r, i) in riwayat" :key="i" class="timeline__item">
                <span class="timeline__marker" :class="`timeline__marker--${r.tipe}`"></span>
                <div class="timeline__body">
                  <p class="timeline__title">{{ r.teks }}</p>
                  <p class="timeline__time">{{ r.waktu }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="task.catatanPengecek" class="panel mt-3">
          <p class="panel__title">
            <span class="panel__icon">
              <PhChatCircleText :size="16" weight="bold" />
            </span>
            Catatan pengecek
          </p>
          <p class="text-sm text-foreground leading-relaxed">{{ task.catatanPengecek }}</p>
        </div>
      </div>

      <BottomSheet ref="sheet" @closed="resetForm">
        <template #header>
          <div class="px-5 pt-1 pb-3">
            <h3 class="text-base font-semibold text-foreground">Update Progres</h3>
            <p class="text-sm text-muted-foreground mt-0.5">
              Ceritakan apa yang sudah dikerjakan, lampirkan bukti kalau ada.
            </p>
          </div>
        </template>

        <div class="px-5 flex flex-col gap-4">

          <div class="flex flex-col gap-2">
            <div class="flex items-end justify-between">
              <label class="text-sm font-medium text-foreground" for="progres">Progres</label>
              <span class="text-2xl font-semibold text-foreground tabular-nums leading-none">
                {{ progres }}<span class="text-base text-muted-foreground">%</span>
              </span>
            </div>
            <input
              id="progres"
              v-model.number="progres"
              type="range"
              min="0"
              max="100"
              step="5"
              class="range"
              :style="{ '--range-fill': `${progres}%` }"
            />
            <p v-if="progres === 100" class="text-xs text-warning-emphasis">
              Di 100% task langsung dikirim untuk dicek dan tidak bisa diubah lagi.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi"
              v-model="deskripsi"
              class="textarea"
              rows="3"
              placeholder="mis. Nota dari 2 properti sudah dikompilasi, sisanya menyusul sore ini."
            ></textarea>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-sm font-medium text-foreground">Lampiran gambar</span>

            <div v-if="gambar" class="relative">
              <img
                :src="gambar"
                alt="Pratinjau lampiran"
                class="w-full rounded-xl border border-border object-cover"
              />
              <button
                type="button"
                class="button button--neutral button--sm button--icon-only absolute top-2 right-2"
                aria-label="Hapus gambar"
                @click="gambar = null"
              >
                <PhX :size="14" weight="bold" />
              </button>
            </div>

            <button
              v-else
              type="button"
              class="flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl border border-dashed border-border-strong text-muted-foreground active:scale-[0.99] transition-transform"
              @click="pilihGambar"
            >
              <PhImageSquare :size="24" />
              <span class="text-sm">Pilih gambar</span>
            </button>
          </div>
        </div>

        <template #footer>
          <div class="grid grid-cols-2 gap-2.5 px-5 pb-5 pt-4">
            <button
              type="button"
              class="button button--neutral button--block"
              @click="sheet.close()"
            >
              Batal
            </button>
            <button
              type="button"
              class="button button--primary button--block"
              :disabled="!bisaSimpan"
              @click="simpan"
            >
              Simpan
            </button>
          </div>
        </template>
      </BottomSheet>

      <BottomSheet ref="sheetLihat">
        <template #header>
          <div class="px-5 pt-1 pb-3">
            <h3 class="text-base font-semibold text-foreground">
              Progres {{ dilihat?.persen }}%
            </h3>
            <p class="text-sm text-muted-foreground mt-0.5">{{ dilihat?.waktu }}</p>
          </div>
        </template>

        <div v-if="dilihat" class="px-5 flex flex-col gap-4">
          <img
            v-if="dilihat.gambar"
            :src="dilihat.gambar"
            alt="Lampiran progres"
            class="w-full rounded-xl border border-border object-cover"
          />
          <p class="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {{ dilihat.deskripsi || "Tidak ada deskripsi untuk update ini." }}
          </p>
        </div>

        <template #footer>
          <div class="px-5 pb-5 pt-4">
            <button
              type="button"
              class="button button--neutral button--block"
              @click="sheetLihat.close()"
            >
              Tutup
            </button>
          </div>
        </template>
      </BottomSheet>
    </div>

    <div v-else class="empty-state">
      <p class="empty-state__title">Task tidak ditemukan</p>
      <RouterLink :to="{ name: 'home' }" class="empty-state__action button button--primary">
        Kembali ke beranda
      </RouterLink>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import {
  PhCalendarDots,
  PhCalendarPlus,
  PhChatCircleText,
  PhClock,
  PhPaperclip,
  PhImageSquare,
  PhUserCircle,
  PhX,
} from "@phosphor-icons/vue"
import AppPageLayout from "../../layouts/AppPageLayout.vue"
import BottomSheet from "../../components/ui/BottomSheet.vue"
import ProgressRing from "../../components/task/ProgressRing.vue"
import TaskStatusBadge from "../../components/task/TaskStatusBadge.vue"
import { statusLabel, statusTerkunci, tasks } from "../../data/tasks"

const route = useRoute()
const task = computed(() => tasks.find((t) => t.id === Number(route.params.id)))

const lampiran = ref([...(task.value?.lampiran ?? [])])
const riwayat = ref([...(task.value?.riwayat ?? [])].reverse())

const terkunci = computed(() => statusTerkunci.includes(task.value?.status))

const updates = ref([...(task.value?.updates ?? [])].reverse())

const sheet = ref(null)
const sheetLihat = ref(null)
const dilihat = ref(null)
const progres = ref(task.value?.progres ?? 0)
const deskripsi = ref("")
const gambar = ref(null)

const bisaSimpan = computed(
  () => progres.value !== task.value.progres || deskripsi.value.trim() || gambar.value,
)

function lihatUpdate(u) {
  dilihat.value = u
  sheetLihat.value?.open()
}

function bukaSheet() {
  progres.value = task.value.progres
  sheet.value?.open()
}

function resetForm() {
  deskripsi.value = ""
  gambar.value = null
}

function pilihGambar() {
  const contoh = ["/lampiran/1.svg", "/lampiran/2.svg", "/lampiran/3.svg", "/lampiran/4.svg"]
  gambar.value = contoh[Math.floor(Math.random() * contoh.length)]
}

function simpan() {
  task.value.progres = progres.value
  task.value.status =
    progres.value === 100 ? "menunggu" : progres.value === 0 ? "baru" : "dikerjakan"
  if (deskripsi.value.trim()) task.value.catatan = deskripsi.value.trim()

  updates.value.unshift({
    persen: progres.value,
    waktu: "Baru saja",
    deskripsi: deskripsi.value.trim(),
    gambar: gambar.value,
    dikirim: progres.value === 100,
  })

  if (progres.value === 100) {
    riwayat.value.unshift({
      waktu: "Baru saja",
      teks: "Dikirim untuk dicek",
      tipe: "warning",
    })
  }

  if (gambar.value) {
    lampiran.value.push({
      nama: `progres-${progres.value}persen.svg`,
      ukuran: "24 KB",
      tanggal: "Baru saja",
    })
  }

  sheet.value?.close()
}
</script>
