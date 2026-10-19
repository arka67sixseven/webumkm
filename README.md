# Dapur Bu Sari — Landing Page UMKM

Landing page **statis** untuk UMKM katering rumahan & frozen food: HTML + Tailwind CSS v4 + JavaScript murni.
Tanpa framework, tanpa backend, tanpa database — bisa di-host gratis di Vercel/Netlify/GitHub Pages.

🌐 **Demo live:** <https://webumkm-delta.vercel.app>

> ⚠️ **Semua data di situs ini masih CONTOH** (nama, nomor WA, alamat, harga, gambar ilustrasi).
> Ganti dengan data asli sebelum dipublikasikan — caranya ada di [Mengganti Data](#mengganti-data).

## Fitur

- Desain responsif (mobile-first), ramah aksesibilitas: kontras WCAG AA, navigasi keyboard, `prefers-reduced-motion`, skip-link.
- Menu produk dengan **filter kategori** dan tombol pesan **WhatsApp otomatis terisi** (deep link per produk).
- **Status buka/tutup** live dihitung dari jam operasional di `js/data.js`.
- Galeri dengan **lightbox** (native `<dialog>`, bisa ditutup dengan Esc).
- Peta lokasi *lazy-load* (Google Maps embed).
- Animasi halus (reveal-on-scroll, marquee, uap hero) yang otomatis nonaktif bila pengguna meminta *reduced motion*.
- Fallback tanpa JavaScript: konten statis tetap tampil dan tombol menu yang butuh JS disembunyikan otomatis. Bila `main.js` gagal dimuat, animasi reveal dibuka supaya teks tidak tertinggal transparan.
- SEO dasar: `canonical`, Open Graph/Twitter, JSON-LD `FoodEstablishment`, plus `sitemap.xml` dan `robots.txt`.
- Header keamanan produksi via `vercel.json` (CSP ketat, nosniff, HSTS, dll).

## Struktur Proyek

```
index.html            ← halaman utama (1 halaman utuh)
src/input.css         ← sumber Tailwind (token warna, font, komponen)
css/style.css         ← hasil build (di-commit agar bisa deploy tanpa build step)
js/data.js            ← ★ SEMUA DATA UMKM (edit di sini)
js/main.js            ← logika halaman
js/boot.js            ← penanda JS aktif + jaring pengaman bila main.js gagal
assets/img/           ← ilustrasi & favicon (ganti dengan foto asli)
scripts/security-audit.sh
.github/workflows/ci.yml
vercel.json           ← header keamanan untuk Vercel
```

## Menjalankan di Komputer

```bash
npm install       # sekali saja
npm run build     # kompilasi Tailwind → css/style.css
npm run serve     # buka http://localhost:4321
```

Saat mengedit tampilan, jalankan `npm run dev` di terminal terpisah (watch mode — CSS otomatis
di-build ulang setiap `index.html`/`src/input.css` berubah). **Commit `css/style.css`** hasil build
agar situs tetap jalan tanpa proses build (mis. di GitHub Pages).

## Mengganti Data

Buka **`js/data.js`** — semua nilai dengan komentar `← GANTI` wajib diganti:

| Field | Keterangan |
|---|---|
| `nama` | Nama usaha |
| `wa` | Nomor WhatsApp format internasional tanpa `+` (contoh: `628123456789`) |
| `waTampil` | Nomor untuk ditampilkan (contoh: `0812-3456-789`) |
| `instagram` | Username tanpa `@` |
| `alamat`, `area`, `mapsQuery` | Alamat tampil, area layanan, kata kunci lokasi peta |
| `jamOperasional` | Jadwal buka per hari + `bukaMenit`/`tutupMenit` (jam × 60) untuk badge buka/tutup |
| `produk` | Daftar menu: nama, kategori, harga, deskripsi, `gambar`, `label` badge (opsional) |
| `kategori` | Daftar filter kategori menu |
| `testimoni`, `galeri`, `stats`, `strip` | Konten bagian testimoni, galeri, statistik, strip berjalan |

Harga ditulis angka polos (`25000`) — otomatis diformat jadi `Rp 25.000`.

> Teks paragraf yang tidak ada di `data.js` (hero, cerita "Tentang Kami", langkah "Cara Pesan", tahun "sejak 2019",
> angka rating di hero) ditulis langsung di `index.html` — cari dan ubah di sana. Teks di `index.html` sengaja
> di luar `data.js` agar bagian yang butuh sentuhan editorial tidak harus ikut terstruktur.
>
> Beberapa nilai identitas juga ditulis langsung di `index.html` sebagai fallback tanpa-JS dan data SEO —
> ganti manual bila berubah: JSON-LD `FoodEstablishment` (nama, telepon, alamat, jam buka, Instagram),
> `canonical`/`og:url`, tautan `https://wa.me/...` di header, hero, CTA, tombol mengambang, dan footer,
> serta tautan `tel:`.

### Mengganti Gambar dengan Foto Asli

1. Simpan foto di `assets/img/` (disarankan JPG/WebP, lebar ±1200 px, rasio 4:3 untuk produk).
2. Perbarui `gambar` pada produk/galeri di `js/data.js`.
3. Khusus foto hero & bagian "Tentang", ganti `src` di `index.html`
   (`assets/img/hero-art.svg` dan `assets/img/galeri-dapur.svg`).
4. `alt` gambar galeri diambil dari `data.js`; `alt` produk dibuat otomatis dari `nama` dengan awalan
   "Ilustrasi". Kalau produk diganti foto asli, sesuaikan juga teks `alt`-nya di `js/main.js`.

## Deploy

1. **GitHub**: `git push` — CI menjalankan build, `npm audit`, gitleaks, dan semgrep.
2. **Vercel**: proyek sudah terhubung ke repo ini — setiap push ke `main` otomatis deploy.
   Build memakai `npm run vercel-build` (CSS + salin aset ke `public/`); header keamanan dari `vercel.json` aktif.
3. Situs live: <https://webumkm-delta.vercel.app>
   Catatan SEO: **alias tim** (`webumkm-lilajayyyy.vercel.app`) dan URL deployment selalu membawa
   `x-robots-tag: noindex` dari Vercel. Untuk SEO gunakan **domain proyek** (`webumkm-delta.vercel.app`)
   atau custom domain — jangan pakai alias tim sebagai URL kanonis.
4. Setelah punya domain sendiri, perbarui URL absolut di `index.html` (`canonical`, `og:url`, `og:image`),
   `sitemap.xml`, dan `robots.txt` — lalu daftarkan ke Google Search Console.

## Keamanan

- `npm run security` → npm audit + gitleaks + semgrep (dijalankan juga oleh pre-commit hook & CI).
- Temuan & keputusan dicatat di [`SECURITY.md`](./SECURITY.md).
- Situs ini statis: tidak ada input pengguna yang diproses server, tidak ada data sensitif.
  Prinsip render JavaScript: data dari `data.js` selalu ditulis lewat `textContent`/`createElement`
  (tidak memakai `innerHTML` untuk data) — aman dari XSS bila nanti `data.js` diisi dari tempat lain.

## Lisensi

Kode: bebas dipakai untuk keperluan UMKM ini. Ilustrasi di `assets/img/*.svg` dibuat khusus untuk
proyek ini (bukan aset pihak ketiga). Font: [Calistoga](https://fonts.google.com/specimen/Calistoga) &
[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (SIL Open Font License) —
di-self-host lokal di `assets/fonts/`, tanpa permintaan ke Google Fonts.
