// Data dummy pengumuman internal untuk assignee. Kategori dipakai untuk memilih
// ikon dan warna badge:
// - "penting"  : wajib dibaca, ada konsekuensi operasional
// - "libur"    : jadwal libur / cuti bersama
// - "sop"      : perubahan prosedur kerja
// - "kegiatan" : agenda internal (briefing, gathering, training)
//
// `ringkasan` dipakai di daftar, `isi` (array paragraf) di halaman detail.
// Berbeda dari task: pengumuman tidak punya progres dan tidak bisa diupdate.

export const announcements = [
  {
    id: 1,
    kategori: "penting",
    judul: "SOP check-in baru berlaku mulai Senin",
    ringkasan:
      "Verifikasi identitas tamu kini wajib difoto dan diunggah ke sistem sebelum kunci kamar diserahkan. Berlaku untuk semua shift front office.",
    pengirim: "Manajemen Operasional",
    waktu: "2 jam lalu",
    tanggal: "12 Agu 2025, 08:30",
    isi: [
      "Mulai Senin, 18 Agustus 2025, seluruh proses check-in wajib menyertakan foto identitas tamu yang diunggah ke sistem sebelum kunci kamar diserahkan.",
      "Foto diambil langsung di konter memakai tablet front office, bukan hasil kiriman tamu. Pastikan nama pada identitas terbaca jelas dan cocok dengan nama pemesanan.",
      "Jika sistem sedang gangguan, catat nomor identitas di buku manual dan unggah menyusul paling lambat akhir shift. Shift berikutnya tidak menanggung tunggakan unggahan shift sebelumnya.",
    ],
    lampiran: [{ nama: "sop-check-in-v3.pdf", ukuran: "310 KB" }],
    dibaca: false,
  },
  {
    id: 2,
    kategori: "libur",
    judul: "Libur bersama 17 Agustus",
    ringkasan:
      "Kantor tutup pada 17 Agustus. Shift hotel tetap berjalan normal dengan rotasi yang sudah dibagikan koordinator masing-masing divisi.",
    pengirim: "HRD",
    waktu: "Kemarin, 16:40",
    tanggal: "11 Agu 2025, 16:40",
    isi: [
      "Kantor pusat tutup pada Minggu, 17 Agustus 2025 untuk memperingati HUT RI. Tidak ada aktivitas administrasi pada tanggal tersebut.",
      "Operasional hotel tetap berjalan normal 24 jam. Rotasi shift sudah dibagikan koordinator masing-masing divisi lewat grup internal.",
      "Pengajuan cuti tambahan di sekitar tanggal tersebut ditutup mulai 14 Agustus.",
    ],
    lampiran: [{ nama: "rotasi-shift-17agu.xlsx", ukuran: "88 KB" }],
    dibaca: false,
  },
  {
    id: 3,
    kategori: "kegiatan",
    judul: "Briefing bulanan pindah ke Sabtu",
    ringkasan:
      "Briefing bulanan yang biasanya Jumat sore dimajukan ke Sabtu pukul 09.00 di ruang meeting OSTIC. Kehadiran seluruh divisi diharapkan.",
    pengirim: "Pak Adi",
    waktu: "2 hari lalu",
    tanggal: "10 Agu 2025, 14:05",
    isi: [
      "Briefing bulanan yang biasanya digelar Jumat sore dimajukan ke Sabtu pukul 09.00 di ruang meeting OSTIC.",
      "Agenda: evaluasi okupansi bulan berjalan, keluhan tamu yang berulang, dan rencana promo kuartal berikutnya.",
      "Setiap divisi menyiapkan ringkasan satu halaman dan mengirimkannya paling lambat Jumat pukul 17.00.",
    ],
    lampiran: [],
    dibaca: true,
  },
  {
    id: 4,
    kategori: "sop",
    judul: "Format laporan mingguan diseragamkan",
    ringkasan:
      "Mulai periode ini semua laporan mingguan memakai template yang sama. Template bisa diunduh dari folder bersama divisi.",
    pengirim: "Bu Rina",
    waktu: "5 hari lalu",
    tanggal: "07 Agu 2025, 09:15",
    isi: [
      "Mulai periode ini seluruh laporan mingguan memakai template yang sama, supaya rekap lintas divisi tidak perlu dirapikan ulang.",
      "Template bisa diunduh dari folder bersama divisi masing-masing. Kolom yang sudah ada jangan dihapus atau diubah urutannya.",
      "Laporan dengan format lama masih diterima sampai akhir bulan ini, setelah itu akan dikembalikan untuk disesuaikan.",
    ],
    lampiran: [{ nama: "template-laporan-mingguan.xlsx", ukuran: "54 KB" }],
    dibaca: true,
  },
]

export const kategoriLabel = {
  penting: "Penting",
  libur: "Libur",
  sop: "SOP",
  kegiatan: "Kegiatan",
}
