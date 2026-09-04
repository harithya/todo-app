// Data dummy papan tugas Ostic. Field mengikuti dashboard signage:
// judul, catatan progres (on progress), jam update, due date, penanda PK.
// Tambahan untuk aplikasi assignee: progres persen, lampiran, dan status review.
//
// Aturan status: progres 0 = "baru", 1-99 = "dikerjakan", 100 = otomatis
// "menunggu" review. "revisi" dan "selesai" diset oleh pengecek.

export const tasks = [
  {
    id: 1,
    judul: "Update laporan check-in & check-out harian",
    divisi: "Admin",
    jenis: "rutin",
    pemberi: "Bu Rina",
    diassign: "09 Agu, 08:00",
    catatan: "Rekap harian sudah diinput ke sistem",
    waktuUpdate: "09:15",
    due: "09 Agu",
    pk: false,
    progres: 100,
    status: "selesai",
    catatanPengecek: "Rekap sudah cocok dengan data front office. Diterima.",
    lampiran: [
      { nama: "rekap-checkin-09agu.xlsx", ukuran: "42 KB", tanggal: "09 Agu, 09:18" },
    ],
    updates: [
      {
        persen: 100,
        waktu: "09 Agu, 09:15",
        deskripsi: "Semua data check-in dan check-out sudah diinput dan dicocokkan dengan catatan front office.",
        gambar: "/lampiran/3.svg",
        dikirim: true,
      },
    ],
    riwayat: [
      { waktu: "09 Agu, 08:00", teks: "Task diberikan oleh Bu Rina", tipe: "info" },
      { waktu: "09 Agu, 09:20", teks: "Disetujui oleh Pak Adi", tipe: "success" },
    ],
  },
  {
    id: 2,
    judul: "Rekap pengeluaran operasional mingguan",
    divisi: "Admin",
    jenis: "rutin",
    pemberi: "Bu Rina",
    diassign: "08 Agu, 16:00",
    catatan: "Sedang kompilasi nota dari 4 properti",
    waktuUpdate: "11:00",
    due: "09 Agu",
    pk: false,
    progres: 45,
    status: "dikerjakan",
    catatanPengecek: null,
    lampiran: [{ nama: "nota-properti-1.pdf", ukuran: "1,2 MB", tanggal: "09 Agu, 10:40" }],
    updates: [
      {
        persen: 45,
        waktu: "09 Agu, 11:00",
        deskripsi: "Nota dari 2 properti sudah dikompilasi. Sisa AT Paviliun dan OSTIC menyusul sore ini.",
        gambar: "/lampiran/3.svg",
        dikirim: false,
      },
    ],
    riwayat: [
      { waktu: "08 Agu, 16:00", teks: "Task diberikan oleh Bu Rina", tipe: "info" },
    ],
  },
  {
    id: 3,
    judul: "Approval cuti staff housekeeping",
    divisi: "Admin",
    jenis: "rutin",
    pemberi: "Pak Adi",
    diassign: "08 Agu, 14:00",
    catatan: "Menunggu tanda tangan HRD, belum ada kepastian",
    waktuUpdate: "09:00",
    due: "10 Agu",
    pk: true,
    progres: 20,
    status: "dikerjakan",
    catatanPengecek: null,
    lampiran: [],
    updates: [],
    riwayat: [
      { waktu: "08 Agu, 14:00", teks: "Task diberikan oleh Pak Adi", tipe: "info" },
    ],
  },
  {
    id: 4,
    judul: "Perbaikan AC ruang meeting OSTIC",
    divisi: "Admin",
    jenis: "insidentil",
    pemberi: "Pak Adi",
    diassign: "09 Agu, 09:50",
    catatan: "Teknisi sedang cek unit, estimasi selesai sore ini",
    waktuUpdate: "10:30",
    due: "09 Agu",
    pk: true,
    progres: 60,
    status: "dikerjakan",
    catatanPengecek: null,
    lampiran: [{ nama: "foto-unit-ac.jpg", ukuran: "820 KB", tanggal: "09 Agu, 10:28" }],
    updates: [
      {
        persen: 60,
        waktu: "09 Agu, 10:30",
        deskripsi: "Teknisi sudah bongkar unit, ketahuan kompresornya lemah. Sparepart dipesan siang ini.",
        gambar: "/lampiran/1.svg",
        dikirim: false,
      },
    ],
    riwayat: [
      { waktu: "09 Agu, 09:50", teks: "Task diberikan oleh Pak Adi", tipe: "info" },
    ],
  },
  {
    id: 5,
    judul: "Desain konten promo weekend getaway",
    divisi: "Creative",
    jenis: "rutin",
    pemberi: "Bu Rina",
    diassign: "07 Agu, 09:00",
    catatan: "Draft desain 80%, tinggal revisi warna",
    waktuUpdate: "10:00",
    due: "09 Agu",
    pk: false,
    progres: 100,
    status: "menunggu",
    catatanPengecek: null,
    lampiran: [
      { nama: "promo-weekend-v3.png", ukuran: "2,4 MB", tanggal: "09 Agu, 09:58" },
    ],
    updates: [
      {
        persen: 100,
        waktu: "09 Agu, 10:00",
        deskripsi: "Revisi warna sudah selesai, palet disamakan dengan brand guideline terbaru.",
        gambar: "/lampiran/2.svg",
        dikirim: true,
      },
    ],
    riwayat: [
      { waktu: "07 Agu, 09:00", teks: "Task diberikan oleh Bu Rina", tipe: "info" },
    ],
  },
  {
    id: 6,
    judul: "Revisi banner promo mendadak dari owner",
    divisi: "Creative",
    jenis: "insidentil",
    pemberi: "Pak Adi",
    diassign: "09 Agu, 08:30",
    catatan: "Sedang proses revisi ke-2, menunggu approval",
    waktuUpdate: "11:30",
    due: "09 Agu",
    pk: true,
    progres: 70,
    status: "revisi",
    catatanPengecek: "Ukuran teks headline masih terlalu kecil untuk layar lobby. Tolong dinaikkan dan kirim ulang.",
    lampiran: [{ nama: "banner-revisi-2.png", ukuran: "3,1 MB", tanggal: "09 Agu, 11:25" }],
    updates: [
      {
        persen: 100,
        waktu: "09 Agu, 10:50",
        deskripsi: "Banner versi 2 selesai, headline dan foto sudah diganti sesuai arahan owner.",
        gambar: "/lampiran/4.svg",
        dikirim: true,
      },
    ],
    riwayat: [
      { waktu: "09 Agu, 08:30", teks: "Task diberikan oleh Pak Adi", tipe: "info" },
      { waktu: "09 Agu, 11:30", teks: "Diminta revisi oleh Pak Adi", tipe: "danger" },
    ],
  },
  {
    id: 7,
    judul: "Foto produk kamar deluxe AT Paviliun",
    divisi: "Creative",
    jenis: "rutin",
    pemberi: "Bu Rina",
    diassign: "09 Agu, 09:30",
    catatan: "Menunggu pinjam kamera, belum bisa mulai",
    waktuUpdate: "09:30",
    due: "10 Agu",
    pk: true,
    progres: 0,
    status: "baru",
    catatanPengecek: null,
    lampiran: [],
    updates: [],
    riwayat: [
      { waktu: "09 Agu, 09:30", teks: "Task diberikan oleh Bu Rina", tipe: "info" },
    ],
  },
  {
    id: 8,
    judul: "Follow up refund tamu no-show",
    divisi: "Reservasi",
    jenis: "rutin",
    pemberi: "Bu Rina",
    diassign: "08 Agu, 15:00",
    catatan: "Menunggu balasan tamu, sudah 2x follow up",
    waktuUpdate: "13:00",
    due: "09 Agu",
    pk: false,
    progres: 35,
    status: "dikerjakan",
    catatanPengecek: null,
    lampiran: [],
    updates: [
      {
        persen: 35,
        waktu: "09 Agu, 13:00",
        deskripsi: "Sudah follow up kedua lewat WhatsApp dan email. Tamu belum membalas.",
        gambar: null,
        dikirim: false,
      },
    ],
    riwayat: [
      { waktu: "08 Agu, 15:00", teks: "Task diberikan oleh Bu Rina", tipe: "info" },
    ],
  },
  // --- Task historis 28 Jul - 08 Agu, dibangkitkan agar halaman Laporan punya
  // garis progres yang berbentuk. Hari penyelesaian ditarik dari distribusi
  // berbobot (akhir pekan kosong), bukan dibagi rata. Task selesai wajib punya
  // entri `riwayat` bertipe "success" — dari situlah durasi dihitung.
  {
    "id": 9,
    "judul": "Rekap tamu rombongan akhir pekan",
    "divisi": "Reservasi",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "31 Jul, 21:38",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "14:30",
    "due": "01 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "01 Agu, 14:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "31 Jul, 21:38",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "01 Agu, 14:30",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 10,
    "judul": "Konfirmasi ulang booking OTA",
    "divisi": "Reservasi",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "29 Jul, 09:24",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "10:15",
    "due": "30 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "29 Jul, 10:15",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "29 Jul, 09:24",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "29 Jul, 10:15",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 11,
    "judul": "Balas komplain tamu kamar 214",
    "divisi": "Reservasi",
    "jenis": "insidentil",
    "pemberi": "Pak Adi",
    "diassign": "07 Agu, 13:28",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "14:15",
    "due": "08 Agu",
    "pk": true,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "07 Agu, 14:15",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "07 Agu, 13:28",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "07 Agu, 14:15",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 12,
    "judul": "Input data walk-in guest",
    "divisi": "Reservasi",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "01 Agu, 14:43",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "16:45",
    "due": "02 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "01 Agu, 16:45",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "01 Agu, 14:43",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "01 Agu, 16:45",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 13,
    "judul": "Update ketersediaan kamar di channel manager",
    "divisi": "Reservasi",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "31 Jul, 09:06",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "09:45",
    "due": "01 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "31 Jul, 09:45",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "31 Jul, 09:06",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "31 Jul, 09:45",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 14,
    "judul": "Desain flyer promo Ramadan",
    "divisi": "Creative",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "28 Jul, 08:51",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "15:00",
    "due": "29 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "28 Jul, 15:00",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "28 Jul, 08:51",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "28 Jul, 15:00",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 15,
    "judul": "Edit video tur kamar suite",
    "divisi": "Creative",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "03 Agu, 13:39",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "11:15",
    "due": "04 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "05 Agu, 11:15",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "03 Agu, 13:39",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "05 Agu, 11:15",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 16,
    "judul": "Konten Instagram mingguan",
    "divisi": "Creative",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "04 Agu, 14:48",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "15:30",
    "due": "05 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "04 Agu, 15:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "04 Agu, 14:48",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "04 Agu, 15:30",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 17,
    "judul": "Retouch foto restoran",
    "divisi": "Creative",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "29 Jul, 12:50",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "13:15",
    "due": "30 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "29 Jul, 13:15",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "29 Jul, 12:50",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "29 Jul, 13:15",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 18,
    "judul": "Banner ucapan HUT RI",
    "divisi": "Creative",
    "jenis": "insidentil",
    "pemberi": "Pak Adi",
    "diassign": "04 Agu, 08:36",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "12:00",
    "due": "05 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "04 Agu, 12:00",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "04 Agu, 08:36",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "04 Agu, 12:00",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 19,
    "judul": "Rekap absensi staff",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "05 Agu, 10:41",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "12:30",
    "due": "06 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "05 Agu, 12:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "05 Agu, 10:41",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "05 Agu, 12:30",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 20,
    "judul": "Arsip nota pembelian Juli",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "01 Agu, 14:10",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "15:00",
    "due": "02 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "01 Agu, 15:00",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "01 Agu, 14:10",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "01 Agu, 15:00",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 21,
    "judul": "Perpanjangan izin operasional",
    "divisi": "Admin",
    "jenis": "insidentil",
    "pemberi": "Pak Adi",
    "diassign": "06 Agu, 11:51",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "16:45",
    "due": "07 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "06 Agu, 16:45",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "06 Agu, 11:51",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "06 Agu, 16:45",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 22,
    "judul": "Rekap komplain bulanan",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "28 Jul, 09:59",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "16:30",
    "due": "29 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "28 Jul, 16:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "28 Jul, 09:59",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "28 Jul, 16:30",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 23,
    "judul": "Cek stok amenities kamar",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "04 Agu, 04:57",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "09:00",
    "due": "05 Agu",
    "pk": true,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "04 Agu, 09:00",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "04 Agu, 04:57",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "04 Agu, 09:00",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 24,
    "judul": "Koordinasi laundry pihak ketiga",
    "divisi": "Admin",
    "jenis": "insidentil",
    "pemberi": "Pak Adi",
    "diassign": "29 Jul, 14:49",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "15:15",
    "due": "30 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "29 Jul, 15:15",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "29 Jul, 14:49",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "29 Jul, 15:15",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 25,
    "judul": "Update harga menu restoran",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "27 Jul, 17:32",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "12:45",
    "due": "28 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "30 Jul, 12:45",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "27 Jul, 17:32",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "30 Jul, 12:45",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 26,
    "judul": "Perbaikan pompa air blok B",
    "divisi": "Admin",
    "jenis": "insidentil",
    "pemberi": "Pak Adi",
    "diassign": "28 Jul, 06:29",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "12:30",
    "due": "29 Jul",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "28 Jul, 12:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "28 Jul, 06:29",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "28 Jul, 12:30",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 27,
    "judul": "Rekap pendapatan harian",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Pak Adi",
    "diassign": "29 Jul, 10:18",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "11:00",
    "due": "30 Jul",
    "pk": true,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "29 Jul, 11:00",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "29 Jul, 10:18",
        "teks": "Task diberikan oleh Pak Adi",
        "tipe": "info"
      },
      {
        "waktu": "29 Jul, 11:00",
        "teks": "Disetujui oleh Bu Rina",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 28,
    "judul": "Briefing shift malam",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "04 Agu, 10:01",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "10:30",
    "due": "05 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "04 Agu, 10:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "04 Agu, 10:01",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "04 Agu, 10:30",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 29,
    "judul": "Inventarisasi linen",
    "divisi": "Admin",
    "jenis": "rutin",
    "pemberi": "Bu Rina",
    "diassign": "08 Agu, 09:09",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "16:45",
    "due": "09 Agu",
    "pk": true,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "08 Agu, 16:45",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "08 Agu, 09:09",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "08 Agu, 16:45",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
  {
    "id": 30,
    "judul": "Setting ulang wifi lantai 3",
    "divisi": "Admin",
    "jenis": "insidentil",
    "pemberi": "Bu Rina",
    "diassign": "31 Jul, 13:19",
    "catatan": "Sudah diserahkan dan diterima pengecek",
    "waktuUpdate": "15:30",
    "due": "01 Agu",
    "pk": false,
    "progres": 100,
    "status": "selesai",
    "catatanPengecek": "Hasil sesuai. Diterima.",
    "lampiran": [],
    "updates": [
      {
        "persen": 100,
        "waktu": "31 Jul, 15:30",
        "deskripsi": "Pekerjaan selesai dan diserahkan untuk dicek.",
        "dikirim": true
      }
    ],
    "riwayat": [
      {
        "waktu": "31 Jul, 13:19",
        "teks": "Task diberikan oleh Bu Rina",
        "tipe": "info"
      },
      {
        "waktu": "31 Jul, 15:30",
        "teks": "Disetujui oleh Pak Adi",
        "tipe": "success"
      }
    ]
  },
]

export const statusLabel = {
  baru: "Baru",
  dikerjakan: "Dikerjakan",
  menunggu: "Perlu Diperiksa",
  revisi: "Revisi",
  tambahanWaktu: "Tambahan Waktu",
  selesai: "Sudah Diperiksa",
}

// Status yang mengunci progres dan lampiran dari assignee.
export const statusTerkunci = ["menunggu", "selesai"]
