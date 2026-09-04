<template>
  <AppPageLayout title="Tampilan" :back-to="{ name: 'profile' }">
    <div class="card">
      <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
        <label
          v-for="o in opsi"
          :key="o.value"
          class="flex items-center gap-3 p-3.5 cursor-pointer active:bg-surface-2 transition-colors"
        >
          <span
            class="shrink-0 flex items-center justify-center size-10 rounded-full bg-primary-50 text-primary-emphasis"
          >
            <component :is="o.ikon" :size="18" />
          </span>

          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-foreground">{{ o.label }}</span>
            <span class="block text-xs text-muted-foreground mt-0.5">{{ o.deskripsi }}</span>
          </span>

          <input v-model="mode" class="radio shrink-0" type="radio" name="tema" :value="o.value" />
        </label>
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { PhDesktop, PhMoon, PhSun } from "@phosphor-icons/vue"
import AppPageLayout from "../../layouts/AppPageLayout.vue"
import { mode } from "../../theme"

const opsi = [
  { value: "light", label: "Terang", deskripsi: "Gunakan tema terang", ikon: PhSun },
  { value: "dark", label: "Gelap", deskripsi: "Gunakan tema gelap", ikon: PhMoon },
  { value: "system", label: "Sistem", deskripsi: "Ikuti pengaturan perangkat", ikon: PhDesktop },
]
</script>
