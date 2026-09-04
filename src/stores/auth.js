import { ref, computed } from "vue"

const TOKEN_KEY = "todo_token"

const token = ref(localStorage.getItem(TOKEN_KEY) || "")

export const isAuthenticated = computed(() => !!token.value)

export function setSession(t) {
  token.value = t
  localStorage.setItem(TOKEN_KEY, t)
}

export function clearSession() {
  token.value = ""
  localStorage.removeItem(TOKEN_KEY)
}
