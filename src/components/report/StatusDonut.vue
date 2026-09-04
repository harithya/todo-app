<template>
  <div class="flex flex-col items-center">
    <!-- Donat dan legenda ditumpuk, bukan disandingkan: di kartu selebar layar HP
         keduanya berebut ruang dan teks legenda yang kalah. -->
    <div class="w-full max-w-[190px]">
      <VisSingleContainer :data="data" :height="170">
        <VisDonut
          :value="(d) => d.jumlah"
          :color="(d) => d.warna"
          :arcWidth="16"
          :cornerRadius="4"
          :padAngle="0.03"
          :centralLabel="`${persen}%`"
          centralSubLabel="selesai"
        />
      </VisSingleContainer>
    </div>

    <!-- Legenda wajib ada: warna irisan tidak boleh jadi satu-satunya pembeda.
         Angkanya memakai token teks, bukan warna serinya. -->
    <dl class="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mt-3">
      <div v-for="d in data" :key="d.label" class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full shrink-0" :style="{ background: d.warna }" />
        <dt class="text-xs text-muted-foreground">{{ d.label }}</dt>
        <dd class="text-sm font-semibold text-foreground tabular-nums">{{ d.jumlah }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { VisDonut, VisSingleContainer } from "@unovis/vue"

const props = defineProps({
  selesai: { type: Number, required: true },
  belum: { type: Number, required: true },
  persen: { type: Number, required: true },
})

// Figure/ground, bukan dua kategori setara: yang selesai memakai warna merek,
// sisanya peredam netral. Pemisahannya lolos simulasi buta warna dengan margin
// lebar (ΔE 16 di tema terang, 27 di gelap).
const data = computed(() => [
  { label: "Selesai", jumlah: props.selesai, warna: "var(--color-primary)" },
  { label: "Belum selesai", jumlah: props.belum, warna: "var(--color-border-strong)" },
])
</script>
