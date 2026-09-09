// Pemetaan data aplikasi ke bentuk papan signage. Papan sengaja TIDAK punya
// dataset sendiri: dua sumber kebenaran berarti papan dan aplikasi bisa
// menampilkan angka berbeda tanpa ada yang tahu mana yang benar.
import { tasks } from "./tasks"

export const DIVISI = ["Admin", "Reservasi", "Creative"]

// Status papan lebih sedikit daripada status aplikasi. `baru` dan `dikerjakan`
// digabung jadi "Belum Selesai" karena dari jarak 5 meter bedanya tidak
// menolong siapa pun.
const PETA_STATUS = {
  baru: "belum",
  dikerjakan: "belum",
  menunggu: "pd",
  selesai: "sd",
  revisi: "rev",
  tambahanWaktu: "tw",
}

export const LABEL_PAPAN = {
  belum: "Belum Selesai",
  pd: "Perlu Diperiksa",
  sd: "Sudah Diperiksa",
  rev: "Revisi",
  tw: "Tambahan Waktu",
}

export const KODE_PAPAN = { pd: "PD", sd: "SD", rev: "REV", tw: "TW" }

export function statusPapan(t) {
  return PETA_STATUS[t.status] ?? "belum"
}

export function waktuSelesai(t) {
  return (t.riwayat || []).find((r) => r.tipe === "success")?.waktu ?? null
}

export function pernahRevisi(t) {
  return (t.riwayat || []).some((r) => r.teks.toLowerCase().includes("revisi"))
}

const BULAN = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 }

function nilaiTanggal(s) {
  const m = String(s || "").match(/(\d+)\s(\w+)/)
  if (!m) return 0
  return new Date(2026, BULAN[m[2]] ?? 0, Number(m[1])).getTime()
}

// Yang mendesak selalu di atas layar, yang selesai tenggelam ke bawah.
//
// PK dan prioritas hanya mengangkat task yang BELUM diperiksa. Task PK yang
// sudah selesai bukan lagi perhatian khusus, dan mendudukkannya di baris
// teratas papan berarti ruang paling terlihat dipakai oleh pekerjaan yang
// sudah beres. Aturan yang sama sudah dipakai `perluPerhatian` di HomePage.
function peringkat(t) {
  const s = statusPapan(t)
  if (s !== "sd") {
    if (t.pk) return 0
    if (t.prioritas) return 1
  }
  return { pd: 2, belum: 3, rev: 4, tw: 5, sd: 6 }[s] ?? 7
}

export function urutkan(list) {
  return [...list].sort((a, b) => {
    const pa = peringkat(a), pb = peringkat(b)
    if (pa !== pb) return pa - pb
    return nilaiTanggal(a.due) - nilaiTanggal(b.due)
  })
}

export function bangunPapan() {
  return DIVISI.map((nama) => {
    const milik = tasks.filter((t) => t.divisi === nama)
    return {
      nama,
      rutin: urutkan(milik.filter((t) => t.jenis === "rutin")),
      insidentil: urutkan(milik.filter((t) => t.jenis === "insidentil")),
      pk: milik.some((t) => t.pk),
    }
  })
}

export function ringkasan() {
  const n = { total: 0, belum: 0, pd: 0, sd: 0, rev: 0, tw: 0, prioritas: 0, pk: 0 }
  for (const t of tasks) {
    n.total++
    n[statusPapan(t)]++
    if (t.prioritas) n.prioritas++
    if (t.pk) n.pk++
  }
  return n
}

// Ember klasifikasi untuk grafik penyelesaian. Warnanya class Tailwind, bukan
// hex, supaya papan tetap tunduk pada token `@theme`.
export const EMBER = [
  { key: "ontime", label: "Ontime, tanpa revisi", warna: "bg-primary-600" },
  { key: "ontimeRev", label: "Ontime, pernah revisi", warna: "bg-primary-300" },
  { key: "telat", label: "Telat, tanpa revisi", warna: "bg-warning" },
  { key: "telatRev", label: "Telat, pernah revisi", warna: "bg-danger" },
  { key: "belum", label: "Belum selesai", warna: "bg-border-strong" },
]

export function ember(t) {
  if (statusPapan(t) !== "sd") return "belum"
  const telat = nilaiTanggal(waktuSelesai(t)) > nilaiTanggal(t.due)
  const rev = pernahRevisi(t)
  if (telat) return rev ? "telatRev" : "telat"
  return rev ? "ontimeRev" : "ontime"
}
