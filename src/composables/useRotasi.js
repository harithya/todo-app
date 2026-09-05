import { onMounted, onUnmounted, ref } from "vue"

// Rotasi tab papan. `jumlah` adalah banyaknya tab yang IKUT berputar, bukan
// total tab: tab Owner sengaja di luar rotasi karena isinya dibaca, bukan
// dilewati.
export function useRotasi({ jumlah, jeda = 9000 }) {
  const indeks = ref(0)
  let timer = null

  function mulai() {
    clearInterval(timer)
    timer = setInterval(() => {
      indeks.value = (indeks.value + 1) % jumlah
    }, jeda)
  }

  function hentikan() {
    clearInterval(timer)
    timer = null
  }

  // Memilih tab manual berarti ada orang yang sedang membaca. Tab di luar
  // rotasi menghentikannya; tab di dalam rotasi menyalakannya lagi dari nol
  // supaya tidak langsung berpindah sedetik kemudian.
  function pilih(i) {
    indeks.value = i
    if (i < jumlah) mulai()
    else hentikan()
  }

  onMounted(mulai)
  onUnmounted(hentikan)

  return { indeks, pilih, hentikan, mulai }
}

// Menggeser tiap panel yang lebih tinggi dari kotaknya, lalu kembali ke atas
// di ujung. Panel yang muat penuh dilewati: gerakan tanpa isi baru cuma
// membuat papan terlihat gelisah.
export function useAutoScroll(selector, jeda = 5000) {
  let timer = null

  function geser() {
    document.querySelectorAll(selector).forEach((el) => {
      const maks = el.scrollHeight - el.clientHeight
      if (maks <= 2) return
      const langkah = Math.max(70, Math.min(el.clientHeight * 0.6, 260))
      const tujuan = el.scrollTop >= maks - 1 ? 0 : Math.min(el.scrollTop + langkah, maks)
      el.scrollTo({ top: tujuan, behavior: "smooth" })
    })
  }

  onMounted(() => { timer = setInterval(geser, jeda) })
  onUnmounted(() => clearInterval(timer))
}
