<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <DisplayHeader />

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
      <BoardTable judul="Tugas Rutin" jenis="rutin" :daftar="d.rutin" />
      <BoardTable judul="Tugas Insidentil" jenis="insidentil" :daftar="d.insidentil" />
    </div>

    <OwnerSummary v-show="indeks === papan.length" :papan="papan" :angka="angka" />
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

const papan = bangunPapan()
const angka = ringkasan()

const tabs = computed(() => [
  ...papan.map((d) => ({ key: d.nama, label: d.nama, sub: "Dasbor Divisi", pk: d.pk })),
  { key: "owner", label: "Owner", sub: "Ringkasan", pk: false },
])

// Hanya tiga tab divisi yang ikut berputar; tab Owner dibaca, bukan dilewati.
const { indeks, pilih } = useRotasi({ jumlah: papan.length, jeda: 9000 })

useAutoScroll(".papan-scroll", 5000)

// Tab yang baru muncul selalu mulai dari baris teratas: di situ task paling
// mendesak berada, dan itu yang harus terlihat lebih dulu.
watch(indeks, () => {
  nextTick(() => {
    document.querySelectorAll(".papan-scroll").forEach((el) => { el.scrollTop = 0 })
  })
})
</script>
