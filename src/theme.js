// Sumber tunggal pengaturan tema. Tiga mode: "light", "dark", "system".
//
// Kunci localStorage harus sama persis dengan yang dibaca skrip inline di
// index.html — skrip itu jalan sebelum Vue mount supaya tidak ada flash putih.
// Kalau kuncinya beda, tema tersimpan tidak akan terbaca saat halaman dimuat.
import { ref, watch } from "vue"

export const THEME_KEY = "todo_theme"

const media = window.matchMedia("(prefers-color-scheme: dark)")

function bacaMode() {
  const tersimpan = localStorage.getItem(THEME_KEY)
  return tersimpan === "light" || tersimpan === "dark" ? tersimpan : "system"
}

export const mode = ref(bacaMode())

function terapkan() {
  const gelap = mode.value === "dark" || (mode.value === "system" && media.matches)
  document.documentElement.classList.toggle("dark", gelap)
}

watch(mode, (nilai) => {
  localStorage.setItem(THEME_KEY, nilai)
  terapkan()
})

// Saat mode "system", tema ikut berubah begitu pengaturan perangkat berubah —
// tanpa reload. Listener sengaja tidak pernah dilepas: modul ini hidup selama
// aplikasi hidup.
media.addEventListener("change", () => {
  if (mode.value === "system") terapkan()
})

terapkan()
