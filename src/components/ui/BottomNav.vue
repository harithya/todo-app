<template>
  <nav class="fixed bottom-0 inset-x-0 z-30 pointer-events-none">
    <!-- Scrim iOS: blur + gradien surface yang memudar ke atas, jadi konten
         yang lewat di bawah bar tidak terpotong keras. Mask membuat blur-nya
         ikut memudar, bukan berhenti mendadak di tepi elemen. -->
    <div
      aria-hidden="true"
      class="absolute inset-x-0 bottom-0 h-32 backdrop-blur-md bg-gradient-to-t from-surface/55 via-surface/20 to-transparent [mask-image:linear-gradient(to_top,black_45%,transparent)]"
    />

    <div class="relative max-w-lg mx-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div
        class="pointer-events-auto grid grid-cols-4 gap-1 rounded-full p-1.5
          bg-surface/70 dark:bg-surface/55 backdrop-blur-2xl backdrop-saturate-150
          ring-1 ring-black/5 dark:ring-white/10
          shadow-[inset_0_1px_0_0_rgb(255_255_255/0.7),0_10px_30px_-8px_rgb(0_0_0/0.28)]
          dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_10px_30px_-8px_rgb(0_0_0/0.6)]"
      >
        <RouterLink
          v-for="item in items"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex flex-col items-center justify-center gap-1 rounded-full py-2 transition-all active:scale-95"
          :class="
            route.name === item.name
              ? 'bg-primary-50 text-primary-emphasis'
              : 'text-muted-foreground'
          "
        >
          <component :is="item.icon" :size="22" :weight="route.name === item.name ? 'fill' : 'regular'" />
          <span class="text-[11px] font-medium leading-none">{{ item.label }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router"
import { PhHouse, PhChartLine, PhMegaphone, PhUser } from "@phosphor-icons/vue"

const route = useRoute()

const items = [
  { name: "home", label: "Beranda", icon: PhHouse },
  { name: "report", label: "Laporan", icon: PhChartLine },
  { name: "announcement", label: "Informasi", icon: PhMegaphone },
  { name: "profile", label: "Profil", icon: PhUser },
]
</script>
