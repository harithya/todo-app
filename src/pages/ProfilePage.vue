<template>
  <AppPageLayout title="Profil">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center text-center -mt-1">
        <img
          :src="`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(nama)}`"
          :alt="nama"
          class="w-24 h-24 rounded-full object-cover bg-surface-2"
          loading="lazy"
        />
        <h2 class="text-xl font-medium mb-1 text-foreground mt-3.5 leading-none">{{ nama }}</h2>
        <p class="text-sm text-muted-foreground mt-1">{{ email }}</p>
      </div>

      <div class="card">
        <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
          <RouterLink
            v-for="m in menu"
            :key="m.label"
            :to="m.to"
            class="flex items-center gap-3 p-3.5 active:bg-surface-2 transition-colors"
          >
            <component :is="m.icon" :size="18" weight="regular" class="text-primary-emphasis shrink-0" />
            <p class="text-sm font-medium text-foreground flex-1">{{ m.label }}</p>
            <PhCaretRight :size="16" class="text-muted-foreground/50 shrink-0" />
          </RouterLink>
        </div>
      </div>

      <button type="button" class="card text-left active:scale-[0.99] transition-transform">
        <div class="card__body flex-row items-center gap-3 p-3.5">
          <PhSignOut :size="18" weight="regular" class="text-danger shrink-0" />
          <p class="text-sm font-medium text-danger flex-1">Keluar</p>
          <PhCaretRight :size="16" class="text-muted-foreground/50 shrink-0" />
        </div>
      </button>
    </div>
  </AppPageLayout>
</template>

<script setup>
import AppPageLayout from "../layouts/AppPageLayout.vue"
import { PhUser, PhLockKey, PhMoonStars, PhCaretRight, PhSignOut } from "@phosphor-icons/vue"

const nama = "Harithya Wisesa"
const email = "harithya77@gmail.com"

const menu = [
  { label: "Edit Profil", icon: PhUser, to: { name: "profile-edit" } },
  { label: "Kata Sandi", icon: PhLockKey, to: { name: "profile-password" } },
  { label: "Tampilan", icon: PhMoonStars, to: { name: "profile-appearance" } },
]
</script>
