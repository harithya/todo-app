# AGENTS.md

Panduan untuk AI agent / kontributor agar kode konsisten di repo ini.

## Struktur

```
src/
├── assets/       # gambar / svg
├── components/   # komponen reusable per domain (components/task/)
├── data/         # data statis (tasks.js)
├── layouts/      # AppPageLayout
├── pages/        # halaman per fitur (pages/task/)
├── router/       # index.js — definisi semua route
├── App.vue       # shell layout (container max-w-lg di center) + RouterView
├── main.js       # entry: import CSS + router + mount app
└── style.css     # Tailwind + theme + override global
```

Folder yang dipakai begitu aplikasi tumbuh, ikuti nama ini:

- `src/composables/` → logika reusable
- `src/api/` → HTTP client + call per domain

## Domain

Papan tugas Ostic. Pengguna bisa berperan sebagai **assignee** (task diberikan orang
lain ke dia) maupun **pemberi tugas** (dia membuat task untuk orang lain lewat halaman
Create Task). Layar pengecek tidak ada di sini.

- Tiap task punya `pemberi` (yang membuat/memberi task) dan `assignee` (yang mengerjakan).
  Pengguna aktif ada di `currentUser` (`src/stores/auth.js`).
- HomePage punya dua dimensi filter yang bisa dikombinasikan: **scope** (segmented control:
  Untuk Saya / Dari Saya / Semua) dan **status** (baris chip). Jangan gabungkan keduanya
  jadi satu baris. Default scope `saya`, default status `berjalan`.
- Chip status pertama bernama **"Berjalan"** (`progres < 100`), bukan "Semua" — dulu
  namanya "Semua" padahal menyembunyikan task selesai.
- Tiap chip status menampilkan jumlah task. Angkanya dihitung dari himpunan `dasar`
  (scope + pencarian, tanpa filter status). Chip berjumlah 0 di-*dim* dengan `opacity-45`,
  jangan disembunyikan — menyembunyikan bikin posisi chip lain bergeser saat ganti scope.
- `TaskListItem` menampilkan **lawan bicara** di baris meta, bukan diri sendiri: prop
  `peran="assignee"` menampilkan `pemberi`, `peran="pembuat"` menampilkan `assignee`.
- Halaman Laporan memakai seluruh data, tidak ikut scope.

- Task punya `divisi` (Admin / Reservasi / Creative) dan `jenis` (`rutin` / `insidentil`).
- `pk` = penanda Perhatian Khusus, tampil sebagai badge merah. Task PK dan task
  berstatus `revisi` TIDAK dipisah ke tab sendiri — keduanya diurutkan ke posisi teratas
  di dalam tab mana pun yang sedang dibuka.
- `catatan` adalah teks progres naratif (kolom "On Progress" di papan signage), terpisah
  dari `progres` yang berupa persen.
- Status: `baru` (0%) → `dikerjakan` (1–99%) → `menunggu` (100%, otomatis terkirim untuk
  dicek) → `revisi` atau `selesai`. **Menyentuh 100% langsung mengirim task untuk dicek**,
  tidak ada tombol kirim terpisah.
- Saat status `menunggu` atau `selesai`, progres dan lampiran dikunci dari assignee —
  daftarnya ada di `statusTerkunci` (`src/data/tasks.js`).
- Progres tidak diubah langsung di halaman. Tombol "Update progres" membuka bottom sheet
  berisi persen, deskripsi, dan lampiran gambar; ketiganya tersimpan sebagai satu entri
  `updates` (`persen`, `waktu`, `deskripsi`, `gambar`, `dikirim`).
- `updates` dan `riwayat` dua hal berbeda dan tidak boleh dicampur. `updates` = laporan
  kerja assignee, tampil di section "Update Progres" dan dibuka lewat bottom sheet.
  `riwayat` = kejadian pada task (diassign, dikirim, disetujui, diminta revisi), tampil
  sebagai timeline polos tanpa deskripsi atau gambar.

## Papan Display TV (`/display`)

Permukaan terpisah dari aplikasi mobile. Spec:
`docs/superpowers/specs/2026-09-05-papan-display-tv-design.md`.

- Route punya `meta: { layar: true, publik: true }`. `layar` membuat `App.vue`
  merender `RouterView` telanjang tanpa shell `max-w-lg` dan tanpa BottomNav;
  `publik` melewati guard login karena TV tidak punya keyboard. `publik` adalah
  kenyamanan, bukan keamanan — papan menampilkan seluruh task semua divisi ke
  siapa pun yang bisa membuka URL-nya.
- Papan tidak punya dataset sendiri. `src/data/display.js` memetakan
  `src/data/tasks.js` ke bentuk papan. Jangan bikin dataset signage terpisah.
- Enam status aplikasi dipetakan ke lima status papan: `baru` dan `dikerjakan`
  sama-sama jadi "Belum Selesai".
- `finish` dan `hadRevisi` diturunkan dari `riwayat`, tidak disimpan sebagai field.
- PK dan `prioritas` hanya mengangkat task yang BELUM diperiksa. Task PK yang
  sudah selesai tidak boleh menempati baris teratas — aturan yang sama dipakai
  `perluPerhatian` di HomePage.
- Papan **selalu tema terang**. Jangan tambahkan variant `dark:` di
  `src/components/display/` maupun `src/pages/display/`.
- Ukuran teks pakai `clamp()` berbasis viewport, bukan px tetap: papan dibaca
  dari 3-5 meter dan harus terbaca di 1080p maupun 4K.
- Semua timer (jam, rotasi, auto-scroll) hidup di `src/composables/useJam.js`
  dan `src/composables/useRotasi.js`, dan wajib dibersihkan di `onUnmounted`.
- Panel divisi dipilih dengan `v-show`, bukan `v-if`: `v-if` membongkar panel
  tiap rotasi dan posisi auto-scroll-nya hilang tiap 9 detik. Konsekuensinya
  auto-scroll harus melewati elemen ber-`clientHeight` 0, kalau tidak panel
  tersembunyi ikut digeser.
- Animasi hanya `transform`. Jangan animasikan `left`/`width`; papan menyala
  24 jam.

## Perintah yang Sering Dipakai

```bash
npm run dev       # dev server
npm run build     # build produksi ke dist/
```

Verifikasi wajib setelah mengubah kode: `npm run build` harus sukses.

## Aturan Umum

### Struktur File Vue
- Gunakan `<script setup>` — tidak ada `export default`.
- Urutan dalam file: `<template>` → `<script setup>`.
- Indentasi 2 spasi. Tanpa titik koma.
- String: gunakan **double quotes** (`"`), kecuali di file `.js` non-Vue boleh single quotes.
- Nama file `.vue`: `PascalCase.vue` (contoh: `TaskListItem.vue`).
- Nama file `.js`/`.css`: `camelCase` / huruf kecil (contoh: `tasks.js`, `style.css`).

### Komponen
- Komponen baru yang reusable taruh di `src/components/`. Cek dulu yang sudah ada sebelum bikin komponen baru yang mirip.
- Props wajib didefinisikan dengan `defineProps({ ... })` (tipe + `required`).
- Model dua arah pakai `defineModel()`.
- Komponen tombol/aksi emit event (`$emit`) — jangan mutasi prop di dalam komponen.
- Icons: pakai `@phosphor-icons/vue`, import per-icon (`import { PhX } from "@phosphor-icons/vue"`).

### Halaman & Layout
- Halaman detail dibungkus `AppPageLayout` — header `pattern-primary` dengan judul di tengah,
  tombol kembali di kiri, app bar fixed yang muncul setelah scroll 72px, lalu konten di panel
  `bg-surface rounded-t-3xl` yang menimpa header.
- Tombol kembali muncul kalau prop `back-to` diisi. Isinya objek route (`{ name: 'home' }`),
  bukan path mentah.
- Isi slot-nya pakai `flex flex-col gap-5`. Judul section pakai
  `<h2 class="font-semibold text-foreground mb-1.5">`.
- Daftar meta (label kiri + nilai kanan) pakai `.card` dengan `card__body p-0` dan
  `divide-y divide-black/10 dark:divide-white/15`, satu baris `px-4 py-3` per item.

### Bottom sheet
- Semua sheet lewat `src/components/ui/BottomSheet.vue` (pembungkus `@webzlodimir/vue-bottom-sheet`),
  jangan pakai library-nya langsung. Kontrol dengan `ref` + `.open()` / `.close()`.
- Isi utama di slot default, tombol aksi di slot `#footer`, judul di `#header`.
- Library ini teleport ke `<body>`, jadi tema gelapnya diatur lewat selector global
  `.bottom-sheet__*` di `src/style.css` — bukan CSS scoped.
- Kosongkan state form di handler `@closed` supaya sisa isian tidak terbawa saat sheet dibuka lagi.

### Routing
- Semua route didefinisikan di `src/router/index.js` dengan `name`.
- Navigasi pakai `RouterLink` / `router.push({ name: '...' })`, bukan path mentah.
- Parameter antar halaman: gunakan `query` dan baca dengan `useRoute()`.

### Styling
- Pakai **Tailwind CSS v4** + design system **Stisla** (`.card`, `.button`, `.input`, `.field`, `.tabs`, dst).
- Token aplikasi didefinisikan di blok `@theme` paling bawah `src/style.css` (warna brand, font, radius). Ubah warna dari situ, jangan hardcode di komponen.
- Warna brand: `#2fa6a0` (`--color-primary`), ramp `primary-50` … `primary-950` ada di `@theme`. Gunakan utility Tailwind (`bg-primary`, `text-primary-emphasis`, `bg-primary-50`, dst).
- Teks di atas `bg-primary` / `.pattern-primary` pakai **putih** (`--color-primary-foreground`). Ini keputusan desain yang diambil sadar: putih di atas `#2fa6a0` hanya 2,96:1 dan tidak lolos WCAG AA. Jangan "perbaiki" jadi teks gelap tanpa menanyakan pemilik dulu. Kalau suatu saat kontras mau dikejar, gelapkan primary-nya (mis. `#00837e` → putih 4,62:1), bukan membalik warna teksnya.
- Untuk primary sebagai teks di atas latar terang tetap pakai `text-primary-emphasis` (`#007873`, 5,34:1) — `primary-500`/`600` terlalu muda dan gagal AA.
- Palet default Tailwind tetap tersedia (`bg-gray-100`, dst) — `src/style.css` sengaja TIDAK meng-import `@stisla/style/theme.css`, karena file itu menjalankan `--color-*: initial` dan akan menghapus palet yang dipakai `.panel` dan `body`.
- Setiap token baru yang mau dipakai sebagai utility harus ada di blok `@theme`. Kalau `border-border` atau sejenisnya tidak muncul, penyebabnya token itu belum dideklarasikan di sana.
- Latar biru bermotif pakai class `.pattern-primary`.
- Tombol utama: `.button .button--primary`. Efek tekan: `active:scale-95` / `active:scale-[0.99]`.
- Dua baris filter di HomePage dibedakan lewat bentuk wadahnya. `SegmentedControl` (scope)
  memakai track `rounded-full` abu dengan pill putih terangkat yang **meluncur** antar segmen
  (satu elemen absolut + `translateX`, jangan animasikan `left`/`width`). Baris chip status
  tidak punya wadah dan chip aktifnya tetap primary solid + teks putih.
- Scrollbar TIDAK disembunyikan global. Area yang bisa digeser horizontal (baris tab)
  pakai class `.tab-scroll` — scrollbar tetap tampil tapi ditipiskan jadi 4px.
- Dark mode di-toggle lewat class `.dark` di `<html>` (variant didefinisikan di `src/style.css`). Nilai awalnya diset oleh script inline di `index.html` dari `localStorage.todo_theme`.

### JavaScript Stisla
- `@stisla/vanilla` auto-init hanya sekali saat modul dievaluasi, jadi komponen Vue yang render belakangan tidak ikut ter-init. Panggil ulang di `onMounted`:
  ```js
  import { Stisla } from "@stisla/vanilla"
  onMounted(() => Stisla.init(el.value))
  ```

### Data
- Data statis di `src/data/`. Jangan campur logika UI (class style status, dll) ke dalam file data — pisahkan ke komponen.
- UI text dalam Bahasa Indonesia (kecuali label teknis).

## Git

- Jangan commit `node_modules`, `dist`, file cache (`.vite/`), file `.env`.
- Pesan commit: prefix konvensional — `feat:`, `fix:`, `style:`, `refactor:`, `docs:`.
- Commit hanya saat diminta user.
