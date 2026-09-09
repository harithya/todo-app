import { onMounted, onUnmounted, ref } from "vue"

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const dua = (n) => String(n).padStart(2, "0")

export function useJam() {
  const tanggal = ref("")
  const jam = ref("")
  let timer = null

  function detak() {
    const n = new Date()
    tanggal.value = `${HARI[n.getDay()]}, ${dua(n.getDate())} ${BULAN[n.getMonth()]} ${n.getFullYear()}`
    jam.value = `${dua(n.getHours())}:${dua(n.getMinutes())}:${dua(n.getSeconds())}`
  }

  onMounted(() => {
    detak()
    timer = setInterval(detak, 1000)
  })

  // Wajib. Papan hidup di dalam SPA: pindah route tanpa ini meninggalkan
  // timer yang terus berjalan dan terus menulis ke ref yang sudah tidak
  // dirender siapa pun.
  onUnmounted(() => clearInterval(timer))

  return { tanggal, jam }
}
