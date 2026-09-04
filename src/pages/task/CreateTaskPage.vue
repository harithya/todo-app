<template>
  <AppPageLayout title="Buat Task" :back-to="{ name: 'home' }">
    <form class="flex flex-col gap-5" @submit.prevent="simpan">
      <FormPanel title="Informasi Task">
        <div class="flex flex-col gap-4">
          <div class="field">
            <label class="field__label" for="judul">Judul</label>
            <input
              id="judul"
              v-model="form.judul"
              type="text"
              class="input"
              placeholder="Cth: Update laporan harian"
            />
          </div>
          <div class="field">
            <label class="field__label" for="catatan">Catatan</label>
            <textarea
              id="catatan"
              v-model="form.catatan"
              class="textarea"
              rows="3"
              placeholder="Jelaskan detail task..."
            ></textarea>
          </div>
        </div>
      </FormPanel>

      <FormPanel title="Klasifikasi">
        <div class="flex flex-col gap-4">
          <div>
            <label class="field__label">Divisi</label>
            <div class="flex gap-2 overflow-x-auto tab-scroll mt-1.5">
              <button
                v-for="d in divisiOptions"
                :key="d"
                type="button"
                class="chip shrink-0"
                :class="{ 'chip--active': form.divisi === d }"
                @click="form.divisi = d"
              >
                {{ d }}
              </button>
            </div>
          </div>
          <div>
            <label class="field__label">Jenis Task</label>
            <div class="flex gap-2 overflow-x-auto tab-scroll mt-1.5">
              <button
                v-for="j in jenisOptions"
                :key="j.value"
                type="button"
                class="chip shrink-0"
                :class="{ 'chip--active': form.jenis === j.value }"
                @click="form.jenis = j.value"
              >
                {{ j.label }}
              </button>
            </div>
          </div>
        </div>
      </FormPanel>

      <FormPanel title="Penanggung Jawab">
        <div class="flex flex-col gap-4">
          <div class="field">
            <label class="field__label" for="pemberi">Pemberi Tugas</label>
            <input
              id="pemberi"
              v-model="form.pemberi"
              type="text"
              class="input"
              placeholder="Cth: Bu Rina"
            />
          </div>
          <div class="field">
            <label class="field__label" for="due">Batas Waktu</label>
            <input
              id="due"
              v-model="form.due"
              type="date"
              class="input"
            />
          </div>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.pk"
              type="checkbox"
              class="checkbox"
            />
            <span class="text-sm text-foreground">Perhatian Khusus (PK)</span>
          </label>
        </div>
      </FormPanel>

      <FormPanel title="Lampiran">
        <div class="flex flex-col gap-3">
          <div
            v-for="(lamp, i) in form.lampiran"
            :key="i"
            class="flex items-center gap-3"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm text-foreground line-clamp-1">{{ lamp.nama }}</p>
              <p class="text-xs text-muted-foreground">{{ lamp.ukuran }}</p>
            </div>
            <button
              type="button"
              class="text-muted-foreground hover:text-danger transition-colors"
              @click="hapusLampiran(i)"
            >
              <PhX :size="18" />
            </button>
          </div>
          <div v-if="!form.lampiran.length" class="text-sm text-muted-foreground text-center py-2">
            Belum ada lampiran
          </div>
          <label class="button button--neutral button--block text-sm cursor-pointer">
            <PhPlus :size="18" />
            Tambah Lampiran
            <input
              ref="lampiranInput"
              type="file"
              class="hidden"
              multiple
              @change="tambahLampiran"
            />
          </label>
        </div>
      </FormPanel>

      <button
        type="submit"
        class="button button--primary button--block mt-2 active:scale-[0.98] transition-transform"
        :disabled="!bisaSimpan"
      >
        Buat Task
      </button>
    </form>
  </AppPageLayout>
</template>

<script setup>
import { reactive, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { PhPlus, PhX } from "@phosphor-icons/vue"
import AppPageLayout from "../../layouts/AppPageLayout.vue"
import FormPanel from "../../components/ui/FormPanel.vue"
import { tasks } from "../../data/tasks"

const router = useRouter()
const lampiranInput = ref(null)

const divisiOptions = ["General", "Admin", "Reservasi", "Creative"]
const jenisOptions = [
  { value: "rutin", label: "Rutin" },
  { value: "insidentil", label: "Insidentil" },
]

const form = reactive({
  judul: "",
  catatan: "",
  divisi: "General",
  jenis: "rutin",
  pemberi: "",
  due: "",
  pk: false,
  lampiran: [],
})

const bisaSimpan = computed(() => form.judul.trim() !== "")

function formatUkuran(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function tambahLampiran(e) {
  const files = Array.from(e.target.files || [])
  for (const f of files) {
    form.lampiran.push({ nama: f.name, ukuran: formatUkuran(f.size) })
  }
  if (lampiranInput.value) lampiranInput.value.value = ""
}

function hapusLampiran(index) {
  form.lampiran.splice(index, 1)
}

function simpan() {
  if (!bisaSimpan.value) return

  const now = new Date()
  const hari = now.getDate()
  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ][now.getMonth()]
  const jam = String(now.getHours()).padStart(2, "0")
  const menit = String(now.getMinutes()).padStart(2, "0")

  const dueDate = form.due ? new Date(form.due) : null
  const dueStr = dueDate
    ? `${dueDate.getDate()} ${[ "Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des" ][dueDate.getMonth()]}`
    : `${hari} ${bulan}`

  const newId = Math.max(...tasks.map((t) => t.id)) + 1

  tasks.unshift({
    id: newId,
    judul: form.judul.trim(),
    divisi: form.divisi,
    jenis: form.jenis,
    pemberi: form.pemberi.trim() || "Tidak diketahui",
    diassign: `${hari} ${bulan}, ${jam}:${menit}`,
    catatan: form.catatan.trim(),
    waktuUpdate: `${jam}:${menit}`,
    due: dueStr,
    pk: form.pk,
    progres: 0,
    status: "baru",
    catatanPengecek: null,
    lampiran: form.lampiran.map((l) => ({
      nama: l.nama,
      ukuran: l.ukuran,
      tanggal: `${hari} ${bulan}, ${jam}:${menit}`,
    })),
    updates: [],
    riwayat: [
      {
        waktu: `${hari} ${bulan}, ${jam}:${menit}`,
        teks: `Task diberikan oleh ${form.pemberi.trim() || "Tidak diketahui"}`,
        tipe: "info",
      },
    ],
  })

  router.push({ name: "home" })
}
</script>
