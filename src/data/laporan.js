// Turunan angka untuk halaman Laporan. Semua perhitungan tinggal di sini supaya
// ReportPage.vue hanya menyusun tampilan, dan kalau nanti sumbernya pindah ke
// API cukup ganti impor `tasks` di berkas ini.
import { tasks } from "./tasks"

const BULAN = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 }

// Data dummy menyimpan waktu sebagai "09 Agu, 08:00" — tanpa tahun. Tahun
// diasumsikan 2025; begitu data asli menyertakan tahun, ganti parser ini saja.
const TAHUN = 2025

export function parseWaktu(teks) {
  if (!teks) return null
  const m = /^(\d{1,2})\s+([A-Za-z]{3}),?\s*(\d{1,2}):(\d{2})$/.exec(teks.trim())
  if (!m) return null
  const bulan = BULAN[m[2]]
  if (bulan === undefined) return null
  return new Date(TAHUN, bulan, Number(m[1]), Number(m[3]), Number(m[4]))
}

// Waktu selesai = entri riwayat bertipe "success" (disetujui pengecek).
// Task yang belum disetujui tidak punya durasi, dan itu bukan nol — itu null.
export function selesaiPada(task) {
  if (task.status !== "selesai") return null
  const sukses = task.riwayat?.find((r) => r.tipe === "success")
  return sukses ? parseWaktu(sukses.waktu) : null
}

export function durasiMenit(task) {
  const mulai = parseWaktu(task.diassign)
  const selesai = selesaiPada(task)
  if (!mulai || !selesai) return null
  const menit = (selesai - mulai) / 60000
  return menit > 0 ? menit : null
}

export function formatDurasi(menit) {
  if (menit == null) return "—"
  if (menit < 60) return `${Math.round(menit)}m`
  const jam = Math.floor(menit / 60)
  const sisa = Math.round(menit % 60)
  if (jam < 24) return sisa ? `${jam}j ${sisa}m` : `${jam}j`
  const hari = Math.floor(jam / 24)
  return `${hari}h ${jam % 24}j`
}

// Ambang bin sengaja dipatok pada batas yang berarti secara operasional:
// selesai dalam sejam, dalam satu sesi kerja, dalam sehari kerja, lewat sehari.
const BIN = [
  { label: "<1j", batas: 60 },
  { label: "1–3j", batas: 180 },
  { label: "3–8j", batas: 480 },
  { label: "8–24j", batas: 1440 },
  { label: ">24j", batas: Infinity },
]

function median(angka) {
  if (!angka.length) return null
  const urut = [...angka].sort((a, b) => a - b)
  const t = Math.floor(urut.length / 2)
  return urut.length % 2 ? urut[t] : (urut[t - 1] + urut[t]) / 2
}

// Rentang default: 30 hari terakhir.
//
// Acuannya task terbaru, bukan Date.now(), karena data dummy berhenti di Agustus
// 2025 — memakai hari ini akan membuka halaman dalam keadaan kosong. Saat data
// asli masuk, ganti `acuan` di bawah dengan `new Date()`.
export function rentangDefault(hari = 30) {
  const waktu = tasks.map((t) => parseWaktu(t.diassign)).filter(Boolean)
  const acuan = waktu.length ? new Date(Math.max(...waktu)) : new Date()
  const mulai = new Date(acuan)
  mulai.setDate(mulai.getDate() - (hari - 1))
  // Keduanya dibulatkan ke tengah malam: nilai ini mengisi v-model date picker,
  // dan `taskRentang()` yang memuaikan ujung atasnya ke akhir hari saat memfilter.
  return { dari: awalHari(mulai), sampai: awalHari(acuan) }
}

export function awalHari(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function akhirHari(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

// Format yang dimengerti <input type="date">: selalu YYYY-MM-DD dalam waktu
// lokal. toISOString() tidak bisa dipakai — hasilnya UTC dan menggeser tanggal
// satu hari di WIB.
export function keInputTanggal(d) {
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function dariInputTanggal(teks) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(teks || "")
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null
}

// Task masuk rentang berdasarkan tanggal diassign — konsisten dengan cara
// periode lama dihitung, jadi angka ringkasan tidak berubah maknanya.
export function taskRentang(dari, sampai) {
  const a = dari ? awalHari(dari) : null
  const b = sampai ? akhirHari(sampai) : null
  return tasks.filter((t) => {
    const mulai = parseWaktu(t.diassign)
    if (!mulai) return false
    if (a && mulai < a) return false
    if (b && mulai > b) return false
    return true
  })
}

export function ringkasan(daftar) {
  const durasi = daftar.map(durasiMenit).filter((d) => d != null)
  const selesai = daftar.filter((t) => t.status === "selesai").length
  return {
    total: daftar.length,
    selesai,
    belum: daftar.length - selesai,
    persenSelesai: daftar.length ? Math.round((selesai / daftar.length) * 100) : 0,
    rataMenit: durasi.length ? durasi.reduce((a, b) => a + b, 0) / durasi.length : null,
    medianMenit: median(durasi),
  }
}

export function sebaranDurasi(daftar) {
  const durasi = daftar.map(durasiMenit).filter((d) => d != null)
  let bawah = 0
  return BIN.map((bin) => {
    const jumlah = durasi.filter((d) => d >= bawah && d < bin.batas).length
    bawah = bin.batas
    return { label: bin.label, jumlah }
  })
}

export function komposisiStatus(daftar) {
  const hitung = {}
  daftar.forEach((t) => (hitung[t.status] = (hitung[t.status] || 0) + 1))
  return hitung
}

// Hanya task yang punya durasi yang masuk daftar rincian. Task yang belum
// selesai tidak punya angka untuk dibandingkan, dan barisnya cuma berisi strip.
// Konsekuensinya jumlah baris di sini tidak sama dengan total task di donat —
// itu memang disengaja.
export function rincian(daftar, urut = "durasi") {
  return daftar
    .map((t) => ({
      id: t.id,
      judul: t.judul,
      divisi: t.divisi,
      status: t.status,
      menit: durasiMenit(t),
      mulai: parseWaktu(t.diassign),
      selesai: selesaiPada(t),
    }))
    .filter((r) => r.menit != null)
    .sort((a, b) => (urut === "durasi" ? b.menit - a.menit : b.selesai - a.selesai))
}

export function kumulatifSelesai(daftar) {
  const selesai = daftar.map(selesaiPada).filter(Boolean).sort((a, b) => a - b)
  if (!selesai.length) return []

  const mulaiSemua = daftar.map((t) => parseWaktu(t.diassign)).filter(Boolean)
  const awal = tengahMalam(new Date(Math.min(...mulaiSemua)))
  const akhir = tengahMalam(selesai[selesai.length - 1])

  // Kunci bertipe "2025-07-28", bukan epoch dibagi 86400000: pembagian epoch
  // menggeser tanggal satu hari di zona waktu non-UTC seperti WIB.
  const perHari = {}
  selesai.forEach((d) => {
    const k = kunciHari(d)
    perHari[k] = (perHari[k] || 0) + 1
  })

  const deret = []
  let kumulatif = 0
  const kursor = new Date(awal)
  while (kursor <= akhir) {
    kumulatif += perHari[kunciHari(kursor)] || 0
    deret.push({
      hari: deret.length,
      tanggal: new Date(kursor),
      label: `${kursor.getDate()} ${NAMA_BULAN[kursor.getMonth()]}`,
      harian: perHari[kunciHari(kursor)] || 0,
      kumulatif,
    })
    kursor.setDate(kursor.getDate() + 1)
  }
  return deret
}

function tengahMalam(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function kunciHari(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
