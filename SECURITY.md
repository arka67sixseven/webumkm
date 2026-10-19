# SECURITY NOTES — <nama proyek>

Catatan temuan keamanan & keputusan. Diperbarui: <tanggal>.
Cara menjalankan audit: `npm run security` (npm audit + gitleaks + semgrep) — exit code ≠ 0 artinya ada temuan.
Kebijakan allowlist ada di `scripts/security-audit.sh` — setiap penambahan WAJIB tercatat di tabel di bawah.

## ✅ Sudah diperbaiki

| Tanggal | Temuan | Severity | Fix |
|---|---|---|---|
| | | | |

## ⚠️ Diterima sadar (accepted risk) — tinjau ulang berkala

| Tanggal | Temuan | Kenapa diterima | Kapan tinjau ulang |
|---|---|---|---|
| | | | |

## 📋 Keputusan terbuka (belum diubah — butuh keputusan produk)

- (contoh: rate limiter in-memory → pindah ke Redis sebelum scale)

## 📜 Aturan

- Jangan pernah commit `.env` — dijaga `.gitignore` + gitleaks (`npm run security` **dan** pre-commit hook).
- Jalankan `npm run security` sebelum deploy; workflow 4-pass ada di `AGENTS.md`.
- Temuan baru / perubahan kebijakan allowlist → selalu tulis di sini.
