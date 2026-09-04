<template>
  <AppPageLayout title="Edit Profil" :back-to="{ name: 'profile' }">
    <form class="flex flex-col gap-4" @submit.prevent="simpan">
      <div class="field">
        <label class="field__label" for="nama">Nama lengkap</label>
        <input id="nama" v-model="form.nama" type="text" class="input" />
      </div>

      <div class="field">
        <label class="field__label" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="input" />
      </div>

      <div class="field">
        <label class="field__label" for="hp">No. HP</label>
        <input id="hp" v-model="form.hp" type="tel" class="input" />
      </div>

      <div class="field">
        <label class="field__label" for="divisi">Divisi</label>
        <input id="divisi" v-model="form.divisi" type="text" class="input" />
      </div>

      <button type="submit" class="button button--primary button--block mt-2">Simpan</button>
    </form>
  </AppPageLayout>
</template>

<script setup>
import { reactive } from "vue"
import AppPageLayout from "../../layouts/AppPageLayout.vue"

// UI dummy: perubahan hanya hidup selama halaman terbuka, tidak disimpan ke mana pun.
const form = reactive({
  nama: "Harithya Wisesa",
  email: "harithya@perusahaan.com",
  hp: "0812-3456-7890",
  divisi: "Admin",
})

function simpan() {}
</script>
