<template>
  <div class="min-h-svh flex flex-col bg-surface-2">
    <div class="pattern-primary pt-16 pb-20 text-center">
      <img
        src="https://wpmedia.tealium.com/wp-content/uploads/2025/02/Tealium_Logo-Teal.png"
        alt="Logo"
        class="h-14 mx-auto brightness-0 invert"
      />
    </div>

    <div class="flex-1 bg-surface p-6 pt-8 -mt-10 rounded-t-3xl">
      <div class="mb-8 text-center">
        <h2 class="text-xl font-semibold text-foreground">Masuk</h2>
        <p class="text-sm text-muted-foreground mt-1">Silahkan masuk untuk melanjutkan</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="nama@email.com"
            autocomplete="email"
          />
        </div>

        <div class="field">
          <label class="field__label" for="password">Kata Sandi</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              @click="showPassword = !showPassword"
            >
              <component :is="showPassword ? PhEyeSlash : PhEye" :size="18" />
            </button>
          </div>
        </div>

        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="remember" type="checkbox" class="checkbox" />
          <span class="text-sm text-foreground">Ingat saya</span>
        </label>

        <button
          type="submit"
          class="button button--primary button--block mt-2 active:scale-[0.98] transition-transform"
          :disabled="!canSubmit"
        >
          Masuk
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { PhEye, PhEyeSlash } from "@phosphor-icons/vue"
import { setSession } from "../../stores/auth"

const router = useRouter()
const email = ref("")
const password = ref("")
const showPassword = ref(false)
const remember = ref(false)

const canSubmit = computed(() => email.value.trim() !== "" && password.value.trim() !== "")

function handleLogin() {
  if (!canSubmit.value) return
  setSession("mock-token")
  router.push({ name: "home" })
}
</script>
