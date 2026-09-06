<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <DisplayHeader :gerak="GERAK" />

    <!-- Satu arah, bukan v-model: `pilih` adalah satu-satunya yang menulis
         `indeks`, karena ia juga yang memutuskan rotasi jalan atau berhenti. -->
    <DisplayTabs :model-value="indeks" :tabs="tabs" @update:model-value="pilih" />

    <!-- v-show, bukan v-if: panel yang di-v-if dibongkar-pasang tiap rotasi
         dan posisi auto-scroll-nya hilang tiap 9 detik. -->
    <div
      v-for="(d, i) in papan"
      v-show="indeks === i"
      :key="d.nama"
      class="flex-1 min-h-0 flex flex-col gap-2"
    >
      <!-- Insidentil hanya muncul saat ada isinya: divisi tanpa tugas insidentil
           tidak perlu menyerahkan ruang layar untuk baris "Tidak ada tugas". -->
      <BoardTable
        v-if="d.insidentil.length"
        judul="Tugas Insidentil"
        jenis="insidentil"
        :daftar="d.insidentil"
        auto
      />
      <BoardTable judul="Tugas Rutin" jenis="rutin" :daftar="d.rutin" />
    </div>

    <OwnerSummary v-show="indeks === papan.length" :papan="papan" :angka="angka" />

    <footer class="shrink-0 flex items-center gap-3 bg-surface rounded-xl border border-border px-3 py-[clamp(0.2rem,0.5vh,0.6rem)] overflow-hidden">
      <span class="shrink-0 bg-primary text-primary-foreground font-semibold uppercase tracking-wider rounded px-2 py-0.5 text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Info
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <!-- Isi diulang dua kali dan animasinya berhenti di -50%: satu salinan
             akan menyisakan celah kosong tiap putaran. -->
        <span
          class="text-muted-foreground text-[clamp(0.55rem,0.7vw,0.95rem)]"
          :class="GERAK ? 'berjalan' : 'block truncate'"
        >
          <!-- Salinan kedua hanya berguna saat teksnya berjalan; diam, ia cuma
               mengulang kalimat yang sama di layar. -->
          <template v-for="n in GERAK ? 2 : 1" :key="n">
            Catatan progres diperbarui tiap ada perubahan pekerjaan &nbsp;&bull;&nbsp;
            Baris merah bertanda PK butuh perhatian khusus segera &nbsp;&bull;&nbsp;
            Papan menampilkan data contoh &nbsp;&bull;&nbsp;
          </template>
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, watch } from "vue"
import DisplayHeader from "../../components/display/DisplayHeader.vue"
import DisplayTabs from "../../components/display/DisplayTabs.vue"
import BoardTable from "../../components/display/BoardTable.vue"
import OwnerSummary from "../../components/display/OwnerSummary.vue"
import { useAutoScroll, useRotasi } from "../../composables/useRotasi"
import { bangunPapan, ringkasan } from "../../data/display"

// Sakelar sementara atas SEMUA gerakan papan: rotasi tab, auto-scroll panel,
// teks berjalan footer, dan kilau header. Kembalikan ke `true` untuk
// menghidupkannya lagi — tidak ada tempat lain yang perlu disentuh.
const GERAK = false

const papan = bangunPapan()
const angka = ringkasan()

const tabs = computed(() => [
  ...papan.map((d) => ({ key: d.nama, label: d.nama, sub: "Dasbor Divisi", pk: d.pk })),
  { key: "owner", label: "Owner", sub: "Ringkasan", pk: false },
])

// Hanya tiga tab divisi yang ikut berputar; tab Owner dibaca, bukan dilewati.
const { indeks, pilih } = useRotasi({ jumlah: papan.length, jeda: 9000, aktif: GERAK })

useAutoScroll(".papan-scroll", 5000, GERAK)

// Tab yang baru muncul selalu mulai dari baris teratas: di situ task paling
// mendesak berada, dan itu yang harus terlihat lebih dulu.
watch(indeks, () => {
  nextTick(() => {
    document.querySelectorAll(".papan-scroll").forEach((el) => { el.scrollTop = 0 })
  })
})
</script>
