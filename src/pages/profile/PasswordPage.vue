<template>
  <AppPageLayout title="Kata Sandi" :back-to="{ name: 'profile' }">
    <form class="flex flex-col gap-4" @submit.prevent="simpan">
      <div class="field">
        <label class="field__label" for="lama">Kata sandi saat ini</label>
        <input id="lama" v-model="form.lama" type="password" class="input" autocomplete="current-password" />
      </div>

      <div class="field">
        <label class="field__label" for="baru">Kata sandi baru</label>
        <input id="baru" v-model="form.baru" type="password" class="input" autocomplete="new-password" />
      </div>

      <div class="field">
        <label class="field__label" for="konfirmasi">Konfirmasi kata sandi baru</label>
        <input
          id="konfirmasi"
          v-model="form.konfirmasi"
          type="password"
          class="input"
          autocomplete="new-password"
        />
      </div>

      <button type="submit" class="button button--primary button--block mt-2">Simpan</button>
    </form>
  </AppPageLayout>
</template>

<script setup>
import { reactive } from "vue"
import AppPageLayout from "../../layouts/AppPageLayout.vue"

const form = reactive({ lama: "", baru: "", konfirmasi: "" })

function simpan() {}
</script>
