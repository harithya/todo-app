<template>
  <AppPageLayout title="Pengumuman">
    <div v-if="announcements.length" class="flex flex-col gap-3">
      <RouterLink
        v-for="a in announcements"
        :key="a.id"
        :to="{ name: 'announcement-detail', params: { id: a.id } }"
        class="card block active:scale-[0.99] transition-transform"
      >
        <div class="card__body p-3.5">
          <p class="font-medium text-foreground leading-snug">{{ a.judul }}</p>
          <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">{{ a.ringkasan }}</p>
          <div class="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <span>{{ a.pengirim }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ a.waktu }}</span>
            <PhCaretRight :size="14" class="ms-auto shrink-0 text-muted-foreground/50" />
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-else class="empty-state">
      <p class="empty-state__title">Belum ada pengumuman</p>
      <p class="empty-state__text">Kabar dari manajemen dan HRD akan muncul di sini.</p>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { PhCaretRight } from "@phosphor-icons/vue"
import AppPageLayout from "../layouts/AppPageLayout.vue"
import { announcements } from "../data/announcements"
</script>
