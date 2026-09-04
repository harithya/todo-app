<template>
  <AppPageLayout title="Detail Pengumuman" :back-to="{ name: 'announcement' }">
    <div v-if="pengumuman" class="flex flex-col gap-5">
      <div>
        <span class="badge badge--soft" :class="gaya[pengumuman.kategori].badge">
          {{ kategoriLabel[pengumuman.kategori] }}
        </span>
        <h1 class="text-lg font-semibold text-foreground leading-snug mt-2">
          {{ pengumuman.judul }}
        </h1>
      </div>

      <div class="card">
        <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <span class="flex items-center gap-2 text-sm text-muted-foreground">
              <PhUserCircle :size="16" class="shrink-0" />
              Dikirim oleh
            </span>
            <span class="text-sm font-medium text-foreground">{{ pengumuman.pengirim }}</span>
          </div>
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <span class="flex items-center gap-2 text-sm text-muted-foreground">
              <PhCalendarDots :size="16" class="shrink-0" />
              Tanggal
            </span>
            <span class="text-sm font-medium text-foreground">{{ pengumuman.tanggal }}</span>
          </div>
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <span class="flex items-center gap-2 text-sm text-muted-foreground">
              <PhPaperclip :size="16" class="shrink-0" />
              Lampiran
            </span>
            <span class="text-sm font-medium text-foreground">
              {{ pengumuman.lampiran.length }} berkas
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-foreground mb-1.5">Isi pengumuman</h2>
        <div class="card">
          <div class="card__body p-4 gap-3">
            <p
              v-for="(paragraf, i) in pengumuman.isi"
              :key="i"
              class="text-sm text-foreground leading-relaxed"
            >
              {{ paragraf }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-foreground mb-1.5">Lampiran</h2>

        <div v-if="pengumuman.lampiran.length" class="card">
          <div class="card__body p-0 divide-y divide-black/10 dark:divide-white/15">
            <div
              v-for="l in pengumuman.lampiran"
              :key="l.nama"
              class="flex items-center gap-3 px-4 py-3"
            >
              <span class="panel__icon shrink-0">
                <PhPaperclip :size="16" weight="bold" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-foreground line-clamp-1">{{ l.nama }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ l.ukuran }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="card">
          <div class="card__body p-6 text-center">
            <p class="text-sm text-muted-foreground">Tidak ada lampiran.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p class="empty-state__title">Pengumuman tidak ditemukan</p>
      <p class="empty-state__text">Pengumuman ini mungkin sudah dihapus.</p>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { PhCalendarDots, PhPaperclip, PhUserCircle } from "@phosphor-icons/vue"
import AppPageLayout from "../layouts/AppPageLayout.vue"
import { announcements, kategoriLabel } from "../data/announcements"

const route = useRoute()

const pengumuman = computed(() =>
  announcements.find((a) => String(a.id) === String(route.params.id)),
)

const gaya = {
  penting: { badge: "badge--danger" },
  libur: { badge: "badge--warning" },
  sop: { badge: "badge--primary" },
  kegiatan: { badge: "badge--info" },
}
</script>
