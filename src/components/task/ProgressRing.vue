<template>
  <!-- SVG polos, bukan komponen chart: ini satu busur tanpa sumbu, tooltip, atau
       skala. Menarik library chart ke sini menambah bundle tanpa menambah apa pun. -->
  <svg
    :width="ukuran"
    :height="ukuran"
    :viewBox="`0 0 ${ukuran} ${ukuran}`"
    class="shrink-0"
    role="img"
    :aria-label="`Progres ${nilai} persen`"
  >
    <g :transform="`rotate(-90 ${pusat} ${pusat})`">
      <circle
        :cx="pusat"
        :cy="pusat"
        :r="jari"
        fill="none"
        stroke="var(--color-border-strong)"
        :stroke-width="tebal"
      />
      <circle
        :cx="pusat"
        :cy="pusat"
        :r="jari"
        fill="none"
        stroke="var(--color-primary)"
        :stroke-width="tebal"
        stroke-linecap="round"
        :stroke-dasharray="keliling"
        :stroke-dashoffset="offset"
        class="transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </g>

    <text
      :x="pusat"
      :y="pusat"
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-foreground text-lg font-semibold tabular-nums"
    >
      {{ nilai }}<tspan class="fill-muted-foreground text-[11px]">%</tspan>
    </text>
  </svg>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  nilai: { type: Number, required: true },
  ukuran: { type: Number, default: 84 },
  tebal: { type: Number, default: 7 },
})

const pusat = computed(() => props.ukuran / 2)

// Jari-jari dikurangi setengah tebal garis supaya goresan tidak terpotong tepi
// viewBox — stroke digambar di tengah garis lingkaran, separuhnya keluar.
const jari = computed(() => props.ukuran / 2 - props.tebal / 2)
const keliling = computed(() => 2 * Math.PI * jari.value)

const offset = computed(() => {
  const persen = Math.min(100, Math.max(0, props.nilai))
  return keliling.value * (1 - persen / 100)
})
</script>
