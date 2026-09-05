# Papan Display TV — `/display`

Tanggal: 2026-09-05
Status: menunggu review

## Tujuan

Menampilkan papan tugas Ostic di TV kantor, menyala terus tanpa ada yang
mengoperasikan. Sumber visualnya adalah prototipe HTML statis
`osticsignagedashboardv2_1_6_6.html`; yang dibawa ke sini adalah **struktur dan
perilakunya**, bukan gaya visualnya. Gaya mengikuti design system aplikasi yang
sekarang.

Bukan tujuan: mengganti halaman Laporan, menambah cara input data, atau membuat
papan bisa disentuh. Papan ini hanya membaca.

## Bentuk layar

Berbeda dari seluruh halaman lain di aplikasi ini. Halaman lain hidup di dalam
shell `max-w-lg` bergaris tepi di `src/App.vue` — bentuk ponsel di tengah layar.
Papan ini mengisi `100vw` × `100svh`, tanpa shell, tanpa BottomNav, tanpa
scrollbar. Tidak ada yang men-scroll TV; papannya yang bergerak sendiri.

Route diberi `meta: { layar: true }`. `App.vue` membaca meta itu dan merender
`<RouterView />` telanjang, melewati `<main>` dan BottomNav.

`meta: { publik: true }` melewati guard login. TV tidak punya keyboard, dan
sesi di `localStorage` bisa hilang kapan saja; tanpa ini papan berhenti di
halaman login sampai ada yang mengetik. Ini keputusan kenyamanan, bukan
keamanan — papan menampilkan seluruh task semua divisi ke siapa pun yang bisa
membuka URL-nya. Kalau nanti ada data yang tidak boleh terlihat orang lewat,
batasnya harus di sisi server, bukan di guard router.

## Susunan

```
┌──────────────────────────────────────────────────────────┐
│ [logo] OSTIC MANAGEMENT          Minggu, 09 Agustus 2026 │
│        PAPAN TUGAS DIGITAL                      14:32:07 │
├──────────────────────────────────────────────────────────┤
│  Admin      │  Reservasi  │  Creative   │  Owner         │
├──────────────────────────────────────────────────────────┤
│  ┌─ Tugas Rutin ──────────────────────────── 12 Task ─┐  │
│  │ No │ Task / Tugas │ On Progress │ Due │ % │ Status │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌─ Tugas Insidentil ──────────────────────── 5 Task ─┐  │
│  │ …                                                  │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│ Info │ teks berjalan …                                   │
└──────────────────────────────────────────────────────────┘
```

Tiga tab pertama adalah divisi (Admin, Reservasi, Creative), masing-masing dua
panel: Tugas Rutin dan Tugas Insidentil. Tab keempat, Owner, berisi delapan
kartu statistik, tabel seluruh task per divisi, dan grafik titik penyelesaian.

Tab divisi yang punya task PK memunculkan badge merah "PK" di sudut tab, supaya
divisi bermasalah terlihat walau tabnya sedang tidak aktif.

## Kolom tabel

| Kolom | Isi | Sumber |
|---|---|---|
| No | nomor urut dua digit | urutan setelah disortir |
| Task / Tugas | judul, tag PR kalau prioritas, baris kedua: maker & pengecek | `judul`, `prioritas`, `assignee`, `pengecek` |
| On Progress | catatan progres naratif, tag PK, baris kedua: waktu update | `catatan`, `pk`, `waktuUpdate` |
| Due | tanggal tenggat | `due` |
| Progress | persen | `progres` |
| Status | badge + label | `status` |

## Data

Satu sumber kebenaran: `src/data/tasks.js`. Papan tidak punya dataset sendiri —
kalau punya, dua papan yang sama bisa menampilkan angka berbeda dan tidak ada
yang tahu mana yang benar.

`src/data/display.js` memetakan data aplikasi ke bentuk papan.

### Pemetaan status

| Status aplikasi | Papan | Badge | Label |
|---|---|---|---|
| `baru`, `dikerjakan` | belum selesai | — | Belum Selesai |
| `menunggu` | `pd` | PD | Perlu Diperiksa |
| `selesai` | `sd` | SD | Sudah Diperiksa |
| `revisi` | `rev` | REV | Revisi |
| `tambahanWaktu` | `tw` | TW | Tambahan Waktu |

### Field yang perlu ditambahkan ke `tasks.js`

- `prioritas` (boolean) — tag "PR" di papan. Tidak ada padanannya sekarang;
  `pk` adalah hal lain (perhatian khusus, lebih tinggi dari prioritas).
- `pengecek` (array string) — papan menampilkan rantai pengecek
  ("Ningsih → Pak Oskar"). Aplikasi cuma punya `pemberi` tunggal.

### Field turunan, tidak disimpan

- `finish` — waktu dari entri `riwayat` bertipe `success`. Kalau tidak ada,
  task belum pernah disetujui.
- `hadRevisi` — true kalau ada entri `riwayat` yang menyebut revisi. Dipakai
  grafik untuk membedakan "selesai mulus" dari "selesai setelah revisi".

### Urutan baris

Sama seperti referensi, dari atas: PK → prioritas → perlu diperiksa → sedang
dikerjakan → revisi → tambahan waktu → sudah diperiksa. Setelah itu tanggal due
menaik. Yang mendesak selalu di atas layar, yang selesai tenggelam ke bawah.

## Perilaku

| Perilaku | Interval | Catatan |
|---|---|---|
| Jam & tanggal | 1 detik | format Indonesia lengkap |
| Rotasi tab divisi | 9 detik | hanya tab 0–2; tab Owner tidak ikut rotasi |
| Auto-scroll panel | 5 detik | turun 60% tinggi panel, kembali ke atas di ujung |
| Sapuan cahaya header | 6 detik | animasi hias, `transform` saja |
| Teks berjalan footer | 30 detik | `transform` saja |

Membuka tab Owner secara manual menghentikan rotasi — orang sedang membaca.
Kembali ke tab divisi menyalakannya lagi.

**Semua timer dibersihkan di `onUnmounted`.** Di halaman HTML statis timer tidak
pernah bocor karena halamannya tidak pernah ditinggalkan. Di SPA, berpindah
route meninggalkan empat timer yang terus berjalan dan terus menyentuh DOM yang
sudah tidak ada.

## Gaya

Palet enam warna referensi (hijau, teal, dua biru, indigo, ungu, pink) dibuang.
Warna di papan hanya boleh berarti sesuatu:

- `primary` — aksen, header, hitungan task
- `warning` — perlu diperiksa
- `danger` — PK dan revisi
- `muted-foreground` — teks sekunder
- `border` — garis tabel

Font Oswald dan Roboto Mono dibuang, pakai font aplikasi. Jam memakai
`tabular-nums` supaya angka tidak bergeser tiap detik.

### Ukuran teks

Pakai `clamp()` berbasis viewport, bukan px tetap. Referensi mengunci 10–14px;
itu ukuran untuk dilihat dari jarak meja. Papan TV dibaca dari 3–5 meter, dan di
layar 4K px tetap menyusut jadi separuh ukuran fisiknya. Dengan `clamp()` papan
yang sama terbaca di 1080p maupun 4K tanpa dua set gaya.

### Tema

Papan **selalu terang**, tidak ikut class `.dark`. TV kantor bukan perangkat
pribadi; preferensi tema orang terakhir yang memakai aplikasi bukan alasan yang
benar untuk menggelapkan papan bersama.

## Struktur file

```
src/pages/display/DisplayPage.vue           shell papan, rotasi, footer
src/components/display/DisplayHeader.vue    logo + judul + jam
src/components/display/DisplayTabs.vue      4 tab + badge PK
src/components/display/BoardTable.vue       satu panel tabel
src/components/display/OwnerSummary.vue     kartu statistik + tabel per divisi
src/components/display/CompletionChart.vue  grafik titik
src/composables/useJam.js                   jam & tanggal live
src/composables/useRotasi.js                rotasi tab + auto-scroll
src/data/display.js                         pemetaan tasks.js → bentuk papan
```

`src/composables/` sudah disebut AGENTS.md sebagai tempat logika reusable.

Grafik titik dibuat dengan elemen biasa, **bukan** `@unovis`. Titik-titik itu
hanya lingkaran berwarna berjajar; menariknya ke library chart menambah bundle
tanpa menambah apa pun.

## Kasus tepi

- **Divisi tanpa task** — panel tetap tampil dengan hitungan "0 Task" dan satu
  baris kosong bertuliskan tidak ada tugas. Panel jangan disembunyikan; tinggi
  panel yang berubah-ubah membuat papan terlihat rusak dari jauh.
- **Panel lebih pendek dari layar** — auto-scroll dilewati, tidak ada gerakan
  percuma.
- **Judul atau catatan sangat panjang** — dipotong dua baris dengan elipsis.
  Baris yang tingginya berbeda-beda merusak keterbacaan tabel dari jauh.
- **Task tanpa pengecek** — kolomnya diisi tanda pisah, bukan dikosongkan.
- **Layar sangat lebar (ultrawide)** — papan tetap penuh; tabel melebar mengikuti.

## Verifikasi

`npm run build` harus sukses. Selain itu, dicek langsung di browser pada 1280×720
dan 1920×1080: keempat tab tampil benar, rotasi berjalan, jam hidup, dan tidak
ada scrollbar yang muncul di mana pun.
