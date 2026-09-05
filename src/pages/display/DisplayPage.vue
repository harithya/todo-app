<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <DisplayHeader />

    <!-- Satu arah, bukan v-model: `pilih` adalah satu-satunya yang menulis
         `indeks`, karena ia juga yang memutuskan rotasi jalan atau berhenti. -->
    <DisplayTabs :model-value="indeks" :tabs="tabs" @update:model-value="pilih" />

    <div class="flex-1 min-h-0 flex items-center justify-center text-muted-foreground">
      Tab aktif: {{ tabs[indeks].label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import DisplayHeader from "../../components/display/DisplayHeader.vue"
import DisplayTabs from "../../components/display/DisplayTabs.vue"
import { useRotasi } from "../../composables/useRotasi"
import { bangunPapan } from "../../data/display"

const papan = bangunPapan()

const tabs = computed(() => [
  ...papan.map((d) => ({ key: d.nama, label: d.nama, sub: "Dasbor Divisi", pk: d.pk })),
  { key: "owner", label: "Owner", sub: "Ringkasan", pk: false },
])

// Hanya tiga tab divisi yang ikut berputar; tab Owner dibaca, bukan dilewati.
const { indeks, pilih } = useRotasi({ jumlah: papan.length, jeda: 9000 })
</script>
