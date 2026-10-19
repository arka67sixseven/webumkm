# SECURITY NOTES — Landing Page Dapur Bu Sari

Catatan temuan keamanan & keputusan. Diperbarui: 19 Oktober 2026.
Cara menjalankan audit: `npm run security` (npm audit + gitleaks + semgrep) — exit code ≠ 0 artinya ada temuan.
Kebijakan allowlist ada di `scripts/security-audit.sh` — setiap penambahan WAJIB tercatat di tabel di bawah.

## Ringkasan risiko (situs statis)

Situs ini sepenuhnya statis (HTML/CSS/JS + gambar): tidak ada backend, database, form, autentikasi,
atau input pengguna yang diproses server. Permukaan serangan sangat kecil:

- Konten dinamis (produk, galeri, testimoni) ditulis dari `js/data.js` lewat `textContent`/`createElement`
  — tidak ada `innerHTML` untuk data, sehingga XSS dari data tidak mungkin terjadi.
- Semua tautan keluar memakai `target="_blank"` + `rel="noopener noreferrer"`.
- Header keamanan produksi diatur di `vercel.json`: CSP ketat (tanpa inline script, `script-src 'self'`),
  `nosniff`, `X-Frame-Options: DENY`, HSTS, `Permissions-Policy` minimal, `form-action 'none'`,
  `frame-ancestors 'none'`.
- Embed peta hanya boleh dari `google.com` (`frame-src`), dimuat lazy.
- Tidak ada secret/API key di repo (dijaga gitleaks pre-commit + CI).

## ✅ Sudah diperbaiki

| Tanggal | Temuan | Severity | Fix |
|---|---|---|---|
| 2026-10-19 | Audit awal fitur (gitleaks + semgrep): tidak ada temuan | — | — |

## ⚠️ Diterima sadar (accepted risk) — tinjau ulang berkala

| Tanggal | Temuan | Kenapa diterima | Kapan tinjau ulang |
|---|---|---|---|
| 2026-10-19 | `GHSA-vfj7-8cjw-p6xm` — `braces` ≤3.0.3 stack-exhaustion DoS (rantai: `@tailwindcss/cli` → `@parcel/watcher` → `micromatch` → `braces`) | Dependency **dev-only** (alat build Tailwind, tidak pernah ikut ke artefak yang di-deploy). Tidak ada input tak terpercaya yang diproses glob matcher — hanya file proyek sendiri saat `npm run build/dev`. Belum ada rilis `braces` yang menutup advisory (`micromatch` terbaru, 4.0.8, tetap memakai 3.0.3). Downgrade CLI ke 4.3.0 tidak menyelesaikan (rantai sama). Sudah di-allowlist di `scripts/security-audit.sh`. | Setiap upgrade Tailwind: cek apakah rantai `@parcel/watcher`/`micromatch` sudah memakai `braces` yang dipatch — bila ya, hapus URL dari allowlist dan pastikan audit hijau. |

## 📋 Keputusan terbuka (belum diubah — butuh keputusan produk)

- Nomor WA, alamat, harga & gambar di `js/data.js` masih **data contoh** — wajib diganti pemilik sebelum dipromosikan.
- Bila nanti ditambah form/kontak backend, seluruh checklist di `AGENTS.md` berlaku ulang (validasi input,
  rate limit, error handling, dsb.) — situs statis ini tidak memiliki backend sama sekali.

## 📜 Aturan

- Jangan pernah commit `.env` — dijaga `.gitignore` + gitleaks (`npm run security` **dan** pre-commit hook).
- Jalankan `npm run security` sebelum deploy; workflow 4-pass ada di `AGENTS.md`.
- Temuan baru / perubahan kebijakan allowlist → selalu tulis di sini.
