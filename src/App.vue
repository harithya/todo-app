<template>
  <div class="min-h-svh bg-surface-2">
    <main
      class="mx-auto min-h-svh w-full max-w-lg border-x border-border bg-surface"
      :class="route.meta.hideBottomNav ? '' : 'pb-32'"
    >
      <RouterView />
    </main>
    <BottomNav v-if="!route.meta.hideBottomNav" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import BottomNav from "./components/ui/BottomNav.vue"

const route = useRoute()
</script>
