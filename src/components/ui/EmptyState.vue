<template>
  <div class="flex flex-col items-center text-center py-8">
    <svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gl" x1=".15" y1=".05" x2=".85" y2=".95">
          <stop offset="0" stop-color="oklch(0.884451 0.03473 189.977)" />
          <stop offset="1" stop-color="oklch(0.802891 0.0592102 189.977)" />
        </linearGradient>
        <linearGradient id="gm" x1=".15" y1=".05" x2=".85" y2=".95">
          <stop offset="0" stop-color="oklch(0.802891 0.0592102 189.977)" />
          <stop offset="1" stop-color="oklch(0.721331 0.0836904 189.977)" />
        </linearGradient>
        <linearGradient id="gd" x1=".15" y1=".05" x2=".85" y2=".95">
          <stop offset="0" stop-color="oklch(0.721331 0.0836904 189.977)" />
          <stop offset="1" stop-color="rgb(47, 166, 160)" />
        </linearGradient>
        <filter id="sh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="5" dy="9" stdDeviation="5.5" flood-color="oklch(0.660161 0.102051 189.977 / 0.26)" />
        </filter>
      </defs>
      <circle cx="100" cy="94" r="72" fill="oklch(0.660161 0.102051 189.977 / 0.06)" />
      <circle cx="100" cy="94" r="55" fill="oklch(0.660161 0.102051 189.977 / 0.1)" />
      <g filter="url(#sh)">
        <path d="M69 48h47l18 18v69a9 9 0 0 1-9 9H69a9 9 0 0 1-9-9V57a9 9 0 0 1 9-9z" fill="url(#gl)" />
        <path d="M116 48l18 18h-9a9 9 0 0 1-9-9z" fill="url(#gd)" />
        <rect x="72" y="74" width="42" height="5" rx="2.5" fill="rgb(47, 166, 160)" opacity="0.32" />
        <rect x="72" y="86" width="52" height="5" rx="2.5" fill="rgb(47, 166, 160)" opacity="0.26" />
        <rect x="72" y="98" width="34" height="5" rx="2.5" fill="rgb(47, 166, 160)" opacity="0.2" />
        <line x1="142" y1="134" x2="158" y2="150" stroke="url(#gd)" stroke-width="9px" stroke-linecap="round" />
        <circle cx="124" cy="116" r="23" fill="rgb(255, 255, 255)" opacity="0.4" />
        <circle cx="124" cy="116" r="23" fill="none" stroke="url(#gd)" stroke-width="7px" />
      </g>
    </svg>
    <p class="text-sm font-medium text-foreground mt-4">{{ title }}</p>
    <p v-if="text" class="text-xs text-muted-foreground mt-1">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
})
</script>
