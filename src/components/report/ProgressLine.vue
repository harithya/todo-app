<template>
  <div>
    <VisXYContainer
      :data="deret"
      :height="200"
      :margin="{ left: 8, right: 12, top: 8, bottom: 4 }"
      :yDomain="[0, maks]"
    >
      <VisArea :x="(d) => d.hari" :y="(d) => d.kumulatif" color="var(--color-primary)" :opacity="0.12" />
      <VisLine
        :x="(d) => d.hari"
        :y="(d) => d.kumulatif"
        color="var(--color-primary)"
        :lineWidth="2"
      />
      <VisAxis
        type="x"
        :tickFormat="(v) => deret[v]?.label ?? ''"
        :tickValues="tickX"
        :gridLine="false"
        :domainLine="false"
      />
      <VisAxis type="y" :numTicks="4" :tickLine="false" :domainLine="false" />
      <VisCrosshair color="var(--color-primary)" :template="tooltip" />
      <VisTooltip />
    </VisXYContainer>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from "@unovis/vue"

const props = defineProps({
  deret: { type: Array, required: true },
})

// Sumbu diberi ruang di atas titik tertinggi supaya garisnya tidak menempel
// ke tepi atas kanvas.
const maks = computed(() => {
  const puncak = props.deret.at(-1)?.kumulatif ?? 0
  return Math.max(1, Math.ceil((puncak + 1) / 5) * 5)
})

// Di layar HP, 14 label tanggal pasti bertabrakan. Ambil maksimal 5 titik yang
// jaraknya merata dan sudah mencakup kedua ujung — memaksa titik terakhir masuk
// setelah pembagian bertahap justru membuatnya menempel ke tetangganya.
const tickX = computed(() => {
  const n = props.deret.length
  if (n <= 1) return [0]
  const jumlah = Math.min(5, n)
  const nilai = []
  for (let i = 0; i < jumlah; i++) {
    nilai.push(Math.round((i * (n - 1)) / (jumlah - 1)))
  }
  return [...new Set(nilai)]
})

function tooltip(d) {
  if (!d) return ""
  const tambahan = d.harian ? `+${d.harian} hari ini` : "tidak ada yang selesai"
  return `<div style="font-size:12px;line-height:1.5">
    <strong>${d.label}</strong><br/>
    Total ${d.kumulatif} selesai<br/>
    <span style="opacity:.7">${tambahan}</span>
  </div>`
}
</script>
