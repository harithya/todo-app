import { ref, computed } from "vue"

const TOKEN_KEY = "todo_token"

const token = ref(localStorage.getItem(TOKEN_KEY) || "")

// Pengguna yang sedang login. Dipakai untuk membedakan task yang ditugaskan
// ke pengguna dan task yang dia berikan ke orang lain.
export const currentUser = ref({ nama: "Harithya Wisesa" })

export const isAuthenticated = computed(() => !!token.value)

export function setSession(t) {
  token.value = t
  localStorage.setItem(TOKEN_KEY, t)
}

export function clearSession() {
  token.value = ""
  localStorage.removeItem(TOKEN_KEY)
}
