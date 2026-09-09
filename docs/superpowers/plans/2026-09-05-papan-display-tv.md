# Papan Display TV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Halaman `/display` yang menampilkan papan tugas Ostic di TV kantor, menyala terus tanpa dioperasikan siapa pun.

**Architecture:** Satu route Vue baru di luar shell `max-w-lg` aplikasi dan di luar guard login. Data diturunkan dari `src/data/tasks.js` lewat lapisan pemetaan murni di `src/data/display.js` — papan tidak punya dataset sendiri. Perilaku bergerak (jam, rotasi tab, auto-scroll) diisolasi ke dua composable supaya timer-nya bisa dibersihkan saat route ditinggalkan.

**Tech Stack:** Vue 3 `<script setup>`, Vue Router 5, Tailwind CSS v4, design system Stisla, `@phosphor-icons/vue`. Tanpa library chart.

**Spec:** `docs/superpowers/specs/2026-09-05-papan-display-tv-design.md`

## Global Constraints

- `<script setup>`, tanpa `export default`. Urutan file: `<template>` lalu `<script setup>`.
- Indentasi 2 spasi, tanpa titik koma, string pakai double quotes.
- Nama file `.vue` PascalCase, `.js` camelCase.
- Props wajib pakai `defineProps({ ... })` dengan tipe dan `required`. Model dua arah pakai `defineModel()`.
- UI text Bahasa Indonesia.
- Warna hanya dari token `@theme`: `primary`, `primary-50`…`primary-950`, `primary-emphasis`, `warning`, `danger`, `foreground`, `muted-foreground`, `surface`, `surface-2`, `border`, `border-strong`. Jangan hardcode hex.
- Papan selalu tema terang. Jangan pakai variant `dark:` di file mana pun dalam plan ini.
- Ukuran teks pakai `clamp()` lewat arbitrary value Tailwind, bukan px tetap.
- **Repo ini tidak punya test runner** (`package.json` hanya punya `dev`, `build`, `preview`). Menambah runner bukan bagian dari plan ini. Verifikasi logika murni memakai skrip Node sekali pakai yang dijalankan dari terminal; verifikasi tampilan memakai `npm run build` dan pengecekan di browser. Setiap task menyebutkan perintah persisnya.
- Perintah verifikasi wajib di tiap task: `npm run build` harus sukses.

---

## File Structure

| File | Tanggung jawab |
|---|---|
| `src/data/tasks.js` | *(diubah)* tambah field `prioritas` dan `pengecek` |
| `src/data/display.js` | *(baru)* pemetaan tasks → bentuk papan, murni, tanpa Vue |
| `src/composables/useJam.js` | *(baru)* jam & tanggal live |
| `src/composables/useRotasi.js` | *(baru)* rotasi tab + auto-scroll panel |
| `src/router/index.js` | *(diubah)* route `/display`, guard `meta.publik` |
| `src/App.vue` | *(diubah)* lewati shell kalau `meta.layar` |
| `src/pages/display/DisplayPage.vue` | *(baru)* shell papan, rakit semua bagian |
| `src/components/display/DisplayHeader.vue` | *(baru)* logo, judul, jam |
| `src/components/display/DisplayTabs.vue` | *(baru)* 4 tab + badge PK |
| `src/components/display/BoardTable.vue` | *(baru)* satu panel tabel |
| `src/components/display/OwnerSummary.vue` | *(baru)* kartu statistik + tabel per divisi |
| `src/components/display/CompletionChart.vue` | *(baru)* grafik titik |
| `src/style.css` | *(diubah)* keyframes sapuan header dan teks berjalan |
| `AGENTS.md` | *(diubah)* dokumentasi permukaan baru |

---

### Task 1: Lapisan data papan

**Files:**
- Modify: `src/data/tasks.js` (sisipkan dua field di tiap task)
- Create: `src/data/display.js`

**Interfaces:**
- Consumes: `tasks` dari `src/data/tasks.js`
- Produces:
  - `DIVISI: string[]` — `["Admin", "Reservasi", "Creative"]`
  - `LABEL_PAPAN: Record<string,string>`, `KODE_PAPAN: Record<string,string>`
  - `statusPapan(t): "belum"|"pd"|"sd"|"rev"|"tw"`
  - `waktuSelesai(t): string|null`
  - `pernahRevisi(t): boolean`
  - `urutkan(list): Task[]`
  - `bangunPapan(): { nama, rutin, insidentil, pk }[]`
  - `ringkasan(): { total, belum, pd, sd, rev, tw, prioritas, pk }`
  - `EMBER: { key, label, warna }[]`, `ember(t): string`

- [ ] **Step 1: Tambah field `prioritas` dan `pengecek` ke 30 task**

Jalankan skrip ini sekali. Dua gaya kutip dipakai karena task historis (id 9+) memakai key berkutip.

```bash
python3 - <<'PY'
import re
p = "src/data/tasks.js"
s = open(p).read()

# Pengecek adalah lawan dari pemberi. Papan menampilkannya sebagai rantai.
def pengecek(pemberi):
    if pemberi == "Bu Rina": return '["Pak Adi"]'
    if pemberi == "Pak Adi": return '["Bu Rina", "Pak Oskar"]'
    return '["Pak Adi"]'

def sisip(m):
    spasi, kutip, nama = m.group(1), m.group(2), m.group(3)
    q = '"' if kutip else ''
    return (f'{spasi}{q}pemberi{q}: "{nama}",\n'
            f'{spasi}{q}prioritas{q}: false,\n'
            f'{spasi}{q}pengecek{q}: {pengecek(nama)},')

s = re.sub(r'^(\s+)("?)pemberi\2: "([^"]*)",$', sisip, s, flags=re.M)
open(p, "w").write(s)
PY
```

- [ ] **Step 2: Tandai tiga task sebagai prioritas**

Prioritas berbeda dari PK: PK adalah perhatian khusus, prioritas hanya
mendahulukan. Task 2, 5, dan 8 dipilih karena ketiganya belum selesai, jadi
tag PR-nya benar-benar terlihat di papan.

```bash
python3 - <<'PY'
import re
p = "src/data/tasks.js"
s = open(p).read()
for judul in ["Rekap pengeluaran operasional mingguan",
              "Desain konten promo weekend getaway",
              "Follow up refund tamu no-show"]:
    i = s.index(f'judul: "{judul}"')
    j = s.index("\n  },\n", i)
    s = s[:i] + s[i:j].replace("prioritas: false", "prioritas: true") + s[j:]
open(p, "w").write(s)
PY
```

- [ ] **Step 3: Verifikasi field masuk ke semua task**

Run:
```bash
node --input-type=module -e '
import { tasks } from "./src/data/tasks.js"
const tanpa = tasks.filter(t => t.prioritas === undefined || !Array.isArray(t.pengecek))
console.log("task tanpa field baru:", tanpa.length)
console.log("prioritas true:", tasks.filter(t => t.prioritas).length)
'
```
Expected: `task tanpa field baru: 0` dan `prioritas true: 3`

- [ ] **Step 4: Buat `src/data/display.js`**

```js
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
```

- [ ] **Step 5: Verifikasi lapisan data**

`src/data/display.js` mengimpor `"./tasks"` tanpa ekstensi mengikuti konvensi
repo. Vite meresolusinya, Node polos tidak — jadi cek dijalankan atas salinan
yang specifier-nya ditulis lengkap, bukan dengan mengubah konvensi impor.

Run:
```bash
S=$(mktemp -d)
sed 's|from "./tasks"|from "'"$PWD"'/src/data/tasks.js"|' src/data/display.js > "$S/display.mjs"
node --input-type=module -e '
import { bangunPapan, ringkasan, statusPapan, ember, EMBER } from "'"$S"'/display.mjs"
import { tasks } from "./src/data/tasks.js"

const papan = bangunPapan()
console.log("divisi:", papan.map(d => `${d.nama} rutin=${d.rutin.length} ins=${d.insidentil.length} pk=${d.pk}`))

const r = ringkasan()
console.log("ringkasan:", r)
console.log("total cocok:", r.total === tasks.length)
console.log("jumlah per status cocok:", r.belum + r.pd + r.sd + r.rev + r.tw === r.total)

const sebar = papan.flatMap(d => [...d.rutin, ...d.insidentil]).length
console.log("semua task masuk papan:", sebar === tasks.length)

const kunci = new Set(EMBER.map(e => e.key))
console.log("semua ember dikenal:", tasks.every(t => kunci.has(ember(t))))

const admin = papan[0].rutin.map(t => `${t.pk?"PK":t.prioritas?"PR":"  "} ${statusPapan(t)}`)
console.log("urutan Admin/rutin:"); console.log(admin.join("\n"))
'
```
Expected: `total cocok: true`, `jumlah per status cocok: true`, `semua task masuk papan: true`, `semua ember dikenal: true`, dan daftar urutan Admin/rutin diawali `PK belum` lalu `PR belum`, diakhiri baris `sd`. Kalau baris teratas berbunyi `PK sd`, aturan `peringkat` salah: task PK yang sudah selesai tidak boleh menempati ruang paling terlihat.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 7: Commit**

```bash
git add src/data/tasks.js src/data/display.js
git commit -m "feat: lapisan data papan display

Menurunkan bentuk papan signage dari tasks.js, bukan dataset terpisah.
Menambah field prioritas dan pengecek yang tidak punya padanan di data
aplikasi; finish dan hadRevisi diturunkan dari riwayat, tidak disimpan."
```

---

### Task 2: Route `/display` di luar shell dan di luar guard

**Files:**
- Modify: `src/router/index.js`
- Modify: `src/App.vue`
- Create: `src/pages/display/DisplayPage.vue` (kerangka, diisi di task berikutnya)

**Interfaces:**
- Consumes: —
- Produces: route bernama `display` di `/display`; konvensi `meta.layar` (lewati shell) dan `meta.publik` (lewati guard login) yang dipakai halaman lain kalau nanti ada.

- [ ] **Step 1: Buat kerangka `src/pages/display/DisplayPage.vue`**

```vue
<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <p class="text-center text-muted-foreground">Papan display</p>
  </div>
</template>

<script setup>
</script>
```

- [ ] **Step 2: Daftarkan route**

Di `src/router/index.js`, tambah import di dekat import halaman lain:

```js
import DisplayPage from "../pages/display/DisplayPage.vue"
```

Tambah entri route di akhir array `routes`:

```js
  {
    path: "/display",
    name: "display",
    component: DisplayPage,
    // `layar`: halaman mengisi layar penuh, lewati shell max-w-lg di App.vue.
    // `publik`: TV tidak punya keyboard dan sesi di localStorage bisa hilang
    // kapan saja; tanpa ini papan berhenti di halaman login.
    meta: { layar: true, publik: true, hideBottomNav: true },
  },
```

- [ ] **Step 3: Lewati guard login untuk route publik**

Ganti isi `router.beforeEach` menjadi:

```js
router.beforeEach((to) => {
  if (to.meta.publik) return
  if (to.name !== "login" && !isAuthenticated.value) {
    return { name: "login" }
  }
  if (AUTH_PAGES.includes(to.name) && isAuthenticated.value) {
    return { name: "home" }
  }
})
```

- [ ] **Step 4: Lewati shell di `src/App.vue`**

Ganti seluruh `<template>` menjadi:

```vue
<template>
  <RouterView v-if="route.meta.layar" />

  <div v-else class="min-h-svh bg-surface-2">
    <main
      class="mx-auto min-h-svh w-full max-w-lg border-x border-border bg-surface"
      :class="route.meta.hideBottomNav ? '' : 'pb-32'"
    >
      <RouterView />
    </main>
    <BottomNav v-if="!route.meta.hideBottomNav" />
  </div>
</template>
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 6: Verifikasi di browser**

Jalankan `npm run dev`, lalu buka `http://localhost:5173/display` di jendela penyamaran (supaya `localStorage` kosong dan guard benar-benar diuji).

Expected:
- Halaman tampil, TIDAK dilempar ke `/`
- Tidak ada kolom putih selebar ponsel di tengah, tidak ada BottomNav
- Buka `http://localhost:5173/beranda` di jendela yang sama: harus dilempar ke halaman login

- [ ] **Step 7: Commit**

```bash
git add src/router/index.js src/App.vue src/pages/display/DisplayPage.vue
git commit -m "feat: route /display di luar shell aplikasi dan guard login

meta.layar melewati shell max-w-lg dan BottomNav; meta.publik melewati
guard login karena TV tidak punya keyboard."
```

---

### Task 3: Jam live dan header papan

**Files:**
- Create: `src/composables/useJam.js`
- Create: `src/components/display/DisplayHeader.vue`
- Modify: `src/pages/display/DisplayPage.vue`
- Modify: `src/style.css` (keyframes sapuan)

**Interfaces:**
- Consumes: —
- Produces: `useJam(): { tanggal: Ref<string>, jam: Ref<string> }`; komponen `DisplayHeader` tanpa props.

- [ ] **Step 1: Buat `src/composables/useJam.js`**

```js
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
```

- [ ] **Step 2: Tambah keyframes sapuan di `src/style.css`**

Sisipkan sebelum blok `@theme` paling bawah:

```css
/* Sapuan cahaya di header papan display. Hanya `transform`, tidak menyentuh
   layout — papan ini menyala 24 jam di TV. */
@keyframes sapuan {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(220%); }
}

.sapuan::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: -40%;
  width: 60%;
  background: linear-gradient(120deg, transparent, rgb(255 255 255 / 0.12), transparent);
  animation: sapuan 6s linear infinite;
}
```

- [ ] **Step 3: Buat `src/components/display/DisplayHeader.vue`**

```vue
<template>
  <header class="sapuan relative overflow-hidden shrink-0 pattern-primary rounded-xl px-[clamp(1rem,1.6vw,2rem)] py-[clamp(0.5rem,0.9vh,1rem)] flex items-center justify-between">
    <div class="relative z-1 flex items-center gap-[clamp(0.75rem,1.1vw,1.5rem)]">
      <div class="bg-surface rounded-lg p-1.5 shrink-0 size-[clamp(2.4rem,3.2vw,4rem)] flex items-center justify-center">
        <img src="/logo.png" alt="Ostic" class="w-full h-full object-contain" />
      </div>
      <div>
        <p class="text-white/75 uppercase tracking-[0.22em] font-medium text-[clamp(0.5rem,0.62vw,0.85rem)]">
          Ostic Management
        </p>
        <h1 class="text-white font-semibold uppercase tracking-wide text-[clamp(0.95rem,1.35vw,2rem)] leading-tight">
          Papan Tugas Digital
        </h1>
      </div>
    </div>

    <div class="relative z-1 text-right">
      <p class="text-white/75 font-medium text-[clamp(0.6rem,0.75vw,1rem)]">{{ tanggal }}</p>
      <p class="text-white font-bold tabular-nums tracking-wider text-[clamp(1.3rem,2vw,3rem)] leading-tight">
        {{ jam }}
      </p>
    </div>
  </header>
</template>

<script setup>
import { useJam } from "../../composables/useJam"

const { tanggal, jam } = useJam()
</script>
```

- [ ] **Step 4: Pasang header di `DisplayPage.vue`**

Ganti seluruh isi file:

```vue
<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <DisplayHeader />
  </div>
</template>

<script setup>
import DisplayHeader from "../../components/display/DisplayHeader.vue"
</script>
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 6: Verifikasi di browser**

Buka `/display`.

Expected:
- Jam berdetak tiap detik dan angkanya tidak bergeser kiri-kanan (`tabular-nums`)
- Tanggal berbahasa Indonesia lengkap, contoh `Sabtu, 05 September 2026`
- Ada sapuan cahaya melintas header tiap 6 detik
- Pindah ke `/beranda` lalu balik ke `/display`: jam tetap satu, tidak melompat dua kali per detik. Kalau melompat, `onUnmounted` tidak jalan.

- [ ] **Step 7: Commit**

```bash
git add src/composables/useJam.js src/components/display/DisplayHeader.vue src/pages/display/DisplayPage.vue src/style.css
git commit -m "feat: header papan display dengan jam live

Timer dibersihkan di onUnmounted; di SPA, pindah route tanpa itu
meninggalkan interval yang terus berjalan."
```

---

### Task 4: Tab divisi dan rotasi otomatis

**Files:**
- Create: `src/composables/useRotasi.js`
- Create: `src/components/display/DisplayTabs.vue`
- Modify: `src/pages/display/DisplayPage.vue`

**Interfaces:**
- Consumes: `bangunPapan()` dari `src/data/display.js`
- Produces:
  - `useRotasi({ jumlah, jeda }): { indeks: Ref<number>, pilih(i): void, hentikan(): void, mulai(): void }`
  - `DisplayTabs` dengan `defineModel({ type: Number })` dan prop `tabs: { key, label, sub, pk }[]`

- [ ] **Step 1: Buat `src/composables/useRotasi.js`**

```js
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
```

- [ ] **Step 2: Buat `src/components/display/DisplayTabs.vue`**

```vue
<template>
  <div class="flex gap-2 shrink-0" role="tablist">
    <button
      v-for="(t, i) in tabs"
      :key="t.key"
      type="button"
      role="tab"
      :aria-selected="model === i"
      class="relative flex-1 rounded-lg border px-3 py-[clamp(0.25rem,0.5vh,0.6rem)] flex items-center justify-center gap-2 transition-colors"
      :class="model === i
        ? 'bg-primary border-primary text-primary-foreground'
        : 'bg-surface border-border-strong text-muted-foreground'"
      @click="model = i"
    >
      <span class="font-semibold uppercase tracking-wider text-[clamp(0.62rem,0.85vw,1.15rem)]">
        {{ t.label }}
      </span>
      <span class="font-medium opacity-70 text-[clamp(0.5rem,0.62vw,0.85rem)]">— {{ t.sub }}</span>

      <span
        v-if="t.pk"
        class="absolute -top-1.5 -right-1 bg-danger text-danger-foreground font-bold rounded-full px-1.5 py-px tracking-wide text-[clamp(0.42rem,0.52vw,0.7rem)]"
      >
        PK
      </span>
    </button>
  </div>
</template>

<script setup>
const model = defineModel({ type: Number, required: true })

defineProps({
  tabs: { type: Array, required: true },
})
</script>
```

- [ ] **Step 3: Rakit tab di `DisplayPage.vue`**

Ganti seluruh isi file:

```vue
<template>
  <div class="w-screen h-svh overflow-hidden bg-surface-2 text-foreground flex flex-col gap-2 p-3">
    <DisplayHeader />
    <DisplayTabs v-model="indeks" :tabs="tabs" @update:model-value="pilih" />

    <div class="flex-1 min-h-0 flex items-center justify-center text-muted-foreground">
      Tab aktif: {{ tabs[indeks].label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import DisplayHeader from "../../components/display/DisplayHeader.vue"
import DisplayTabs from "../../components/display/DisplayTabs.vue"
import { useRotasi } from "../../composables/useRotasi"
import { bangunPapan } from "../../data/display"

const papan = bangunPapan()

const tabs = computed(() => [
  ...papan.map((d) => ({ key: d.nama, label: d.nama, sub: "Dasbor Divisi", pk: d.pk })),
  { key: "owner", label: "Owner", sub: "Ringkasan", pk: false },
])

// Hanya tiga tab divisi yang ikut berputar; tab Owner dibaca, bukan dilewati.
const { indeks, pilih } = useRotasi({ jumlah: papan.length, jeda: 9000 })
</script>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 5: Verifikasi di browser**

Buka `/display` dan tunggu 30 detik.

Expected:
- Tab berpindah Admin → Reservasi → Creative → Admin tiap 9 detik, tidak pernah mampir ke Owner
- Tab Admin punya badge PK merah di sudut (data punya task PK di divisi Admin)
- Klik tab Owner: rotasi berhenti, tab tidak berpindah sendiri lagi
- Klik tab Reservasi: rotasi jalan lagi
- Pindah ke `/beranda` lalu balik: rotasi tetap 9 detik sekali, bukan makin cepat

- [ ] **Step 6: Commit**

```bash
git add src/composables/useRotasi.js src/components/display/DisplayTabs.vue src/pages/display/DisplayPage.vue
git commit -m "feat: tab divisi papan display dengan rotasi otomatis

Tab Owner di luar rotasi: isinya dibaca, bukan dilewati. Memilih tab
manual menyalakan ulang hitungan supaya tidak langsung berpindah."
```

---

### Task 5: Panel tabel divisi dan auto-scroll

**Files:**
- Create: `src/components/display/BoardTable.vue`
- Modify: `src/composables/useRotasi.js` (tambah `useAutoScroll`)
- Modify: `src/pages/display/DisplayPage.vue`

**Interfaces:**
- Consumes: `LABEL_PAPAN`, `KODE_PAPAN`, `statusPapan` dari `src/data/display.js`
- Produces:
  - `useAutoScroll(selector, jeda): void`
  - `BoardTable` dengan props `judul: String`, `jenis: String` (`"rutin"` | `"insidentil"`), `daftar: Array`

- [ ] **Step 1: Tambah `useAutoScroll` di `src/composables/useRotasi.js`**

Sisipkan di akhir file:

```js
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
```

- [ ] **Step 2: Buat `src/components/display/BoardTable.vue`**

```vue
<template>
  <section class="flex-1 min-h-0 flex flex-col bg-surface rounded-xl border border-border overflow-hidden">
    <div class="shrink-0 flex items-center justify-between px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.35rem,0.7vh,0.85rem)] border-b-2 border-border">
      <h2 class="flex items-center gap-2 font-semibold uppercase tracking-wider text-primary-emphasis text-[clamp(0.72rem,0.95vw,1.35rem)]">
        <span class="rounded-full shrink-0 size-[clamp(0.35rem,0.45vw,0.6rem)]" :class="jenis === 'rutin' ? 'bg-primary' : 'bg-warning-emphasis'" />
        {{ judul }}
      </h2>
      <span class="bg-primary-50 text-primary-emphasis font-semibold rounded-full px-2.5 py-0.5 text-[clamp(0.55rem,0.68vw,0.95rem)]">
        {{ daftar.length }} Task
      </span>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto papan-scroll">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-surface-2">
            <th v-for="k in KOLOM" :key="k.label" :style="{ width: k.lebar }"
              class="sticky top-0 z-1 bg-surface-2 text-left font-semibold uppercase tracking-wider text-muted-foreground border-b border-border px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.25rem,0.5vh,0.6rem)] text-[clamp(0.52rem,0.65vw,0.9rem)]">
              {{ k.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!daftar.length">
            <td :colspan="KOLOM.length" class="text-center text-muted-foreground py-6 text-[clamp(0.65rem,0.8vw,1.1rem)]">
              Tidak ada tugas
            </td>
          </tr>

          <tr
            v-for="(t, i) in daftar"
            :key="t.id"
            class="border-b border-border align-top"
            :class="t.pk ? 'bg-danger/5' : t.prioritas ? 'bg-warning/10' : ''"
          >
            <td class="tabular-nums text-muted-foreground px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.58rem,0.72vw,1rem)]">
              {{ String(i + 1).padStart(2, "0") }}
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <p class="font-medium line-clamp-2 text-[clamp(0.65rem,0.85vw,1.2rem)]">
                <span v-if="t.prioritas" class="bg-warning text-warning-foreground font-bold rounded px-1 me-1.5 text-[clamp(0.45rem,0.55vw,0.75rem)]">PR</span>
                {{ t.judul }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-[clamp(0.5rem,0.65vw,0.9rem)]">
                Maker: {{ t.assignee }} · Pengecek: {{ t.pengecek.join(" → ") || "—" }}
              </p>
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <p class="line-clamp-2 text-[clamp(0.6rem,0.78vw,1.1rem)]">
                <span v-if="t.pk" class="bg-danger text-danger-foreground font-bold rounded px-1 me-1.5 text-[clamp(0.45rem,0.55vw,0.75rem)]">PK</span>
                {{ t.catatan }}
              </p>
              <p class="text-muted-foreground mt-0.5 tabular-nums text-[clamp(0.5rem,0.65vw,0.9rem)]">
                {{ t.waktuUpdate }} WIB
              </p>
            </td>

            <td class="tabular-nums px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.6rem,0.75vw,1.05rem)]">
              {{ t.due }}
            </td>

            <td class="tabular-nums font-semibold px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)] text-[clamp(0.62rem,0.8vw,1.1rem)]"
              :class="t.progres >= 100 ? (statusPapan(t) === 'sd' ? 'text-primary-emphasis' : 'text-warning-emphasis') : 'text-foreground'">
              {{ t.progres }}%
            </td>

            <td class="px-[clamp(0.5rem,0.9vw,1.4rem)] py-[clamp(0.3rem,0.6vh,0.7rem)]">
              <span v-if="KODE_PAPAN[statusPapan(t)]"
                class="font-bold rounded px-1.5 py-px me-1.5 text-[clamp(0.48rem,0.6vw,0.8rem)]"
                :class="KELAS_BADGE[statusPapan(t)]">
                {{ KODE_PAPAN[statusPapan(t)] }}
              </span>
              <span class="text-muted-foreground text-[clamp(0.55rem,0.7vw,0.95rem)]">
                {{ LABEL_PAPAN[statusPapan(t)] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { KODE_PAPAN, LABEL_PAPAN, statusPapan } from "../../data/display"

defineProps({
  judul: { type: String, required: true },
  jenis: { type: String, required: true },
  daftar: { type: Array, required: true },
})

const KOLOM = [
  { label: "No", lebar: "3rem" },
  { label: "Task / Tugas", lebar: "auto" },
  { label: "On Progress", lebar: "28%" },
  { label: "Due", lebar: "6rem" },
  { label: "Progress", lebar: "5.5rem" },
  { label: "Status", lebar: "13rem" },
]

const KELAS_BADGE = {
  pd: "bg-warning text-warning-foreground",
  sd: "bg-primary text-primary-foreground",
  rev: "bg-danger text-danger-foreground",
  tw: "bg-danger text-danger-foreground",
}
</script>
```

- [ ] **Step 3: Sembunyikan scrollbar panel di `src/style.css`**

Sisipkan di dekat `.tab-scroll`:

```css
/* Panel papan display digeser oleh timer, tidak pernah oleh tangan. Scrollbar
   yang terlihat di TV hanya sampah visual. */
.papan-scroll {
  scrollbar-width: none;
}

.papan-scroll::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 4: Pasang panel di `DisplayPage.vue`**

Ganti blok `<div class="flex-1 min-h-0 ...">` yang berisi teks "Tab aktif" dengan:

```vue
    <div v-for="(d, i) in papan" v-show="indeks === i" :key="d.nama" class="flex-1 min-h-0 flex flex-col gap-2">
      <BoardTable judul="Tugas Rutin" jenis="rutin" :daftar="d.rutin" />
      <BoardTable judul="Tugas Insidentil" jenis="insidentil" :daftar="d.insidentil" />
    </div>
```

Tambah import dan panggilan auto-scroll di `<script setup>`:

```js
import BoardTable from "../../components/display/BoardTable.vue"
import { useAutoScroll, useRotasi } from "../../composables/useRotasi"
```

```js
useAutoScroll(".papan-scroll", 5000)
```

`v-show` dipakai, bukan `v-if`: panel yang di-`v-if` dibongkar-pasang tiap
rotasi dan posisi scroll-nya hilang tiap 9 detik.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 6: Verifikasi di browser**

Buka `/display` pada 1280×720 dan 1920×1080.

Expected:
- Dua panel per tab, tinggi keduanya sama dan mengisi layar sampai bawah
- Baris PK berlatar kemerahan dan ada di paling atas; baris PR berlatar kekuningan tepat di bawahnya
- Baris paling bawah berstatus "Sudah Diperiksa"
- Tab Reservasi punya panel Insidentil berisi 1 task; panel tidak menyusut
- Panel yang isinya lebih panjang dari kotaknya bergeser sendiri tiap 5 detik lalu kembali ke atas
- Tidak ada scrollbar terlihat di mana pun
- Tidak ada scrollbar horizontal pada `<body>`

- [ ] **Step 7: Commit**

```bash
git add src/components/display/BoardTable.vue src/composables/useRotasi.js src/pages/display/DisplayPage.vue src/style.css
git commit -m "feat: panel tabel divisi papan display dengan auto-scroll

Panel dipilih dengan v-show, bukan v-if: v-if membongkar panel tiap
rotasi dan posisi scroll-nya hilang tiap 9 detik."
```

---

### Task 6: Tab Owner — kartu statistik dan tabel per divisi

**Files:**
- Create: `src/components/display/OwnerSummary.vue`
- Modify: `src/pages/display/DisplayPage.vue`

**Interfaces:**
- Consumes: `ringkasan()`, `bangunPapan()`, `urutkan()` dari `src/data/display.js`; komponen `BoardTable` dari Task 5
- Produces: `OwnerSummary` dengan props `papan: Array`, `angka: Object`

- [ ] **Step 1: Buat `src/components/display/OwnerSummary.vue`**

```vue
<template>
  <div class="flex-1 min-h-0 flex flex-col gap-2">
    <div class="shrink-0 grid grid-cols-8 gap-2">
      <div
        v-for="k in KARTU"
        :key="k.kunci"
        class="bg-surface rounded-xl border px-2 py-[clamp(0.3rem,0.8vh,1rem)] text-center"
        :class="k.garis"
      >
        <p class="font-bold tabular-nums leading-none text-[clamp(1.1rem,2.1vw,3.2rem)]" :class="k.teks">
          {{ angka[k.kunci] }}
        </p>
        <p class="text-muted-foreground mt-1 leading-tight text-[clamp(0.48rem,0.62vw,0.85rem)]">
          {{ k.label }}
        </p>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto papan-scroll flex flex-col gap-2">
      <BoardTable
        v-for="d in papan"
        :key="d.nama"
        :judul="d.nama"
        jenis="rutin"
        :daftar="semua(d)"
        class="shrink-0"
      />
    </div>
  </div>
</template>

<script setup>
import BoardTable from "./BoardTable.vue"
import { urutkan } from "../../data/display"

defineProps({
  papan: { type: Array, required: true },
  angka: { type: Object, required: true },
})

const KARTU = [
  { kunci: "total", label: "Total Task", teks: "text-foreground", garis: "border-border" },
  { kunci: "belum", label: "On Progress", teks: "text-foreground", garis: "border-border" },
  { kunci: "pd", label: "Perlu Diperiksa", teks: "text-warning-emphasis", garis: "border-warning/40" },
  { kunci: "sd", label: "Sudah Diperiksa", teks: "text-primary-emphasis", garis: "border-primary/40" },
  { kunci: "rev", label: "Revisi", teks: "text-danger-emphasis", garis: "border-danger/40" },
  { kunci: "tw", label: "Tambahan Waktu", teks: "text-danger-emphasis", garis: "border-danger/40" },
  { kunci: "prioritas", label: "Prioritas", teks: "text-warning-emphasis", garis: "border-warning/40" },
  { kunci: "pk", label: "Perhatian Khusus", teks: "text-danger-emphasis", garis: "border-danger/40" },
]

// Tab Owner menggabung rutin dan insidentil: yang dilihat pemilik adalah
// beban satu divisi, bukan pembagian jenis tugasnya.
const semua = (d) => urutkan([...d.rutin, ...d.insidentil])
</script>
```

- [ ] **Step 2: Pasang tab Owner di `DisplayPage.vue`**

Tepat setelah blok `v-for="(d, i) in papan"`, tambahkan:

```vue
    <OwnerSummary v-show="indeks === papan.length" :papan="papan" :angka="angka" />
```

Tambah di `<script setup>`:

```js
import OwnerSummary from "../../components/display/OwnerSummary.vue"
import { bangunPapan, ringkasan } from "../../data/display"
```

```js
const angka = ringkasan()
```

Import `bangunPapan` yang sudah ada digabung ke satu baris di atas — jangan
ada dua baris import dari modul yang sama.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 4: Verifikasi di browser**

Buka `/display`, klik tab Owner.

Expected:
- Delapan kartu sejajar dalam satu baris, angka Total = 30
- Jumlah kartu On Progress + Perlu Diperiksa + Sudah Diperiksa + Revisi + Tambahan Waktu = 30
- Tiga tabel divisi berurutan: Admin (16 task), Reservasi (6), Creative (8)
- Rotasi berhenti selama tab Owner terbuka
- Area tabel bergeser sendiri tiap 5 detik

- [ ] **Step 5: Commit**

```bash
git add src/components/display/OwnerSummary.vue src/pages/display/DisplayPage.vue
git commit -m "feat: tab Owner papan display

Kartu statistik dan tabel seluruh task per divisi. Rutin dan insidentil
digabung: yang dilihat pemilik adalah beban satu divisi."
```

---

### Task 7: Grafik titik penyelesaian

**Files:**
- Create: `src/components/display/CompletionChart.vue`
- Modify: `src/components/display/OwnerSummary.vue`

**Interfaces:**
- Consumes: `EMBER`, `ember` dari `src/data/display.js`
- Produces: `CompletionChart` dengan props `papan: Array`

- [ ] **Step 1: Buat `src/components/display/CompletionChart.vue`**

Titik dibuat dengan elemen biasa, bukan `@unovis`. Ini lingkaran berwarna
berjajar; menariknya ke library chart menambah bundle tanpa menambah apa pun.

```vue
<template>
  <section class="bg-surface rounded-xl border border-border overflow-hidden shrink-0">
    <div class="flex items-center justify-between px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.35rem,0.7vh,0.85rem)] border-b-2 border-border">
      <h2 class="font-semibold uppercase tracking-wider text-primary-emphasis text-[clamp(0.72rem,0.95vw,1.35rem)]">
        Grafik Penyelesaian Task
      </h2>
      <div class="flex items-center gap-[clamp(0.5rem,0.9vw,1.4rem)]">
        <span v-for="e in EMBER" :key="e.key" class="flex items-center gap-1.5 text-muted-foreground text-[clamp(0.48rem,0.62vw,0.85rem)]">
          <span class="rounded-full size-[clamp(0.35rem,0.45vw,0.6rem)]" :class="e.warna" />
          {{ e.label }}
        </span>
      </div>
    </div>

    <div class="px-[clamp(0.75rem,1.2vw,1.75rem)] py-[clamp(0.4rem,0.8vh,1rem)] flex flex-col gap-[clamp(0.25rem,0.5vh,0.6rem)]">
      <p class="text-muted-foreground uppercase tracking-wider font-semibold text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Per Divisi
      </p>
      <div v-for="b in perDivisi" :key="b.label" class="flex items-center gap-3">
        <span class="shrink-0 text-muted-foreground w-[clamp(4rem,7vw,10rem)] text-[clamp(0.55rem,0.7vw,0.95rem)]">
          {{ b.label }}
        </span>
        <div class="flex flex-wrap items-center gap-[clamp(0.15rem,0.22vw,0.3rem)]">
          <span
            v-for="(t, i) in b.titik"
            :key="i"
            class="rounded-full size-[clamp(0.4rem,0.55vw,0.75rem)]"
            :class="t.warna"
            :title="`${t.label} — ${t.judul}`"
          />
        </div>
      </div>

      <p class="text-muted-foreground uppercase tracking-wider font-semibold mt-1 text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Per Orang
      </p>
      <div v-for="b in perOrang" :key="b.label" class="flex items-center gap-3">
        <span class="shrink-0 text-muted-foreground w-[clamp(4rem,7vw,10rem)] text-[clamp(0.55rem,0.7vw,0.95rem)]">
          {{ b.label }}
        </span>
        <div class="flex flex-wrap items-center gap-[clamp(0.15rem,0.22vw,0.3rem)]">
          <span
            v-for="(t, i) in b.titik"
            :key="i"
            class="rounded-full size-[clamp(0.4rem,0.55vw,0.75rem)]"
            :class="t.warna"
            :title="`${t.label} — ${t.judul}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"
import { EMBER, ember } from "../../data/display"

const props = defineProps({
  papan: { type: Array, required: true },
})

const URUTAN = EMBER.map((e) => e.key)

// Titik diurutkan per ember supaya baris terbaca sebagai proporsi, bukan
// taburan acak: hijau menumpuk di kiri, merah di kanan.
function baris(label, daftar) {
  const titik = [...daftar]
    .sort((a, b) => URUTAN.indexOf(ember(a)) - URUTAN.indexOf(ember(b)))
    .map((t) => {
      const e = EMBER.find((x) => x.key === ember(t))
      return { warna: e.warna, label: e.label, judul: t.judul }
    })
  return { label, titik }
}

const perDivisi = computed(() =>
  props.papan.map((d) => baris(d.nama, [...d.rutin, ...d.insidentil]))
)

const perOrang = computed(() => {
  const map = {}
  for (const d of props.papan) {
    for (const t of [...d.rutin, ...d.insidentil]) {
      ;(map[t.assignee] ||= []).push(t)
    }
  }
  return Object.keys(map).sort().map((nama) => baris(nama, map[nama]))
})
</script>
```

- [ ] **Step 2: Pasang grafik di `OwnerSummary.vue`**

Di dalam `<div class="flex-1 min-h-0 overflow-y-auto papan-scroll ...">`, tepat
setelah `v-for` BoardTable, tambahkan:

```vue
      <CompletionChart :papan="papan" />
```

Tambah import:

```js
import CompletionChart from "./CompletionChart.vue"
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 4: Verifikasi di browser**

Buka `/display`, klik tab Owner, geser ke bawah (atau tunggu auto-scroll).

Expected:
- Legenda lima warna di kanan judul grafik
- Tiga baris "Per Divisi": Admin 16 titik, Reservasi 6, Creative 8
- Baris "Per Orang" berisi nama assignee, jumlah seluruh titiknya 30
- Titik terurut: warna primary di kiri, abu (belum selesai) di kanan
- Arahkan kursor ke satu titik: muncul tooltip berisi label ember dan judul task

- [ ] **Step 5: Commit**

```bash
git add src/components/display/CompletionChart.vue src/components/display/OwnerSummary.vue
git commit -m "feat: grafik titik penyelesaian di tab Owner

Titik dibuat dengan elemen biasa, bukan @unovis: ini lingkaran berwarna
berjajar, library chart tidak menambah apa pun selain bundle."
```

---

### Task 8: Footer teks berjalan dan dokumentasi

**Files:**
- Modify: `src/style.css` (keyframes teks berjalan)
- Modify: `src/pages/display/DisplayPage.vue`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: —
- Produces: papan lengkap sesuai spec

- [ ] **Step 1: Tambah keyframes teks berjalan di `src/style.css`**

Sisipkan tepat setelah blok `.sapuan::after`:

```css
/* Teks berjalan di kaki papan display. `transform` saja; menganimasikan
   `left` memaksa layout dihitung ulang tiap frame, selamanya. */
@keyframes berjalan {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.berjalan {
  display: inline-block;
  white-space: nowrap;
  animation: berjalan 30s linear infinite;
}
```

- [ ] **Step 2: Pasang footer di `DisplayPage.vue`**

Tepat sebelum `</div>` penutup terluar:

```vue
    <footer class="shrink-0 flex items-center gap-3 bg-surface rounded-xl border border-border px-3 py-[clamp(0.2rem,0.5vh,0.6rem)] overflow-hidden">
      <span class="shrink-0 bg-primary text-primary-foreground font-semibold uppercase tracking-wider rounded px-2 py-0.5 text-[clamp(0.48rem,0.6vw,0.8rem)]">
        Info
      </span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <span class="berjalan text-muted-foreground text-[clamp(0.55rem,0.7vw,0.95rem)]">
          <template v-for="n in 2" :key="n">
            Catatan progres diperbarui tiap ada perubahan pekerjaan &nbsp;•&nbsp;
            Baris merah bertanda PK butuh perhatian khusus segera &nbsp;•&nbsp;
            Papan menampilkan data contoh &nbsp;•&nbsp;
          </template>
        </span>
      </div>
    </footer>
```

Isi diulang dua kali dan animasinya berhenti di `-50%` supaya sambungannya
mulus; satu salinan akan menyisakan celah kosong tiap putaran.

- [ ] **Step 3: Catat permukaan baru di `AGENTS.md`**

Tambah section baru setelah section "Domain":

```markdown
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
- Papan **selalu tema terang**. Jangan tambahkan variant `dark:` di
  `src/components/display/` maupun `src/pages/display/`.
- Ukuran teks pakai `clamp()` berbasis viewport, bukan px tetap: papan dibaca
  dari 3–5 meter dan harus terbaca di 1080p maupun 4K.
- Semua timer (jam, rotasi, auto-scroll) hidup di `src/composables/useJam.js`
  dan `src/composables/useRotasi.js`, dan wajib dibersihkan di `onUnmounted`.
- Panel divisi dipilih dengan `v-show`, bukan `v-if`: `v-if` membongkar panel
  tiap rotasi dan posisi auto-scroll-nya hilang tiap 9 detik.
- Animasi hanya `transform`. Jangan animasikan `left`/`width`; papan menyala
  24 jam.
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `✓ built`

- [ ] **Step 5: Verifikasi penuh di browser**

Buka `/display` di 1280×720 lalu 1920×1080, biarkan berjalan dua menit penuh.

Expected:
- Teks berjalan bergerak mulus tanpa celah kosong tiap putaran
- Seluruh papan muat dalam satu layar: tidak ada scrollbar pada `<body>`, baik vertikal maupun horizontal
- Rotasi tab, auto-scroll, jam, dan sapuan header berjalan bersamaan tanpa tersendat
- Buka DevTools → Performance, rekam 10 detik: tidak ada layout thrashing berulang dari animasi

- [ ] **Step 6: Commit**

```bash
git add src/style.css src/pages/display/DisplayPage.vue AGENTS.md
git commit -m "feat: footer teks berjalan papan display

Isi footer diulang dua kali dan animasi berhenti di -50% supaya
sambungannya mulus. AGENTS.md mencatat permukaan baru ini."
```

---

## Self-Review

**Cakupan spec** — tiap bagian spec punya task: bentuk layar (Task 2), susunan
dan kolom tabel (Task 5), pemetaan status dan field turunan (Task 1), urutan
baris (Task 1), lima timer (Task 3, 4, 5, 8), aturan warna dan `clamp()`
(Global Constraints, dipakai di Task 3–8), tema terang (Global Constraints),
kasus tepi divisi kosong dan panel pendek (Task 5), grafik tanpa `@unovis`
(Task 7), verifikasi (tiap task).

**Konsistensi tipe** — `statusPapan` mengembalikan lima kunci yang sama di
`LABEL_PAPAN`, `KELAS_BADGE`, dan `peringkat`. `KODE_PAPAN` sengaja tidak punya
kunci `belum`; `BoardTable` menjaganya dengan `v-if="KODE_PAPAN[...]"`.
`bangunPapan()` mengembalikan `{ nama, rutin, insidentil, pk }` dan ketiga
konsumennya (`DisplayPage`, `OwnerSummary`, `CompletionChart`) memakai nama
yang sama. `ringkasan()` mengembalikan delapan kunci yang persis dipakai
`KARTU` di `OwnerSummary`.

**Catatan yang diketahui** — status `tambahanWaktu` tidak ada di data sekarang
(0 task), jadi kartu TW dan badge TW hanya bisa diverifikasi lewat pembacaan
kode, bukan lewat layar. Ini bukan cacat; `statusLabel` di `tasks.js` sudah
memuatnya dan aplikasi bisa menghasilkannya.
