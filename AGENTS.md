<!-- SECURITY-PROTOCOL:START (dikelola manual — pertahankan blok ini) -->

# 🔐 Protokol Keamanan & Workflow Audit (WAJIB)

Stack default: Next.js (App Router) + TypeScript strict + Zod + Prisma/PostgreSQL + tRPC (sesuaikan bila berbeda).
File kunci: `src/server/trpc/trpc.ts` (procedure) · `src/server/auth.ts` (sesi) · `src/server/validators.ts` (Zod) · `src/server/rate-limit.ts`.

## Aturan kode (non-negotiable)

1. **Validasi** — setiap endpoint/procedure yang menerima input WAJIB validasi schema (Zod). Schema baru ditulis di `src/server/validators.ts`, bukan inline di router. Dilarang `z.any()`.
2. **Authz via procedure** — data user → `protectedProcedure`, admin → `adminProcedure`. Jangan bikin cek login/role manual di dalam handler.
3. **Ownership check (anti-IDOR)** — setiap query/mutation atas data milik user WAJIB memfilter dengan `ctx.session.id` atau membandingkan `row.userId === ctx.session.id` sebelum read/update/delete. Ini celah #1 aplikasi web.
4. **Jangan percaya client** — harga, diskon, stok, role, total: selalu hitung ulang di server dari data DB.
5. **Database** — pakai Prisma. `$queryRaw` hanya bila perlu dan WAJIB tagged template (parameterized). Dilarang string concatenation SQL.
6. **Secret** — hanya dari `process.env`; tidak ada fallback secret hardcoded di production; `NEXT_PUBLIC_*` hanya untuk nilai yang memang publik; `.env*` tidak pernah di-commit.
7. **Sesi** — cookie `httpOnly` + `sameSite` + `secure` di production. Token tidak pernah di localStorage. Jangan menambah endpoint yang mengembalikan token.
8. **Rate limit** — endpoint sensitif (auth, checkout, review, ubah password) lewat `rateLimit()` dengan key unik per ip + aksi.
9. **Error handling** — pesan error auth tidak membocorkan info akun (pakai pesan generik). Detail error hanya di-log server-side, bukan dikirim ke client.
10. **Logging** — dilarang `console.log` berisi password, token, atau isi order.
11. **Response data** — kirim field minimal (select eksplisit); jangan pernah kirim `passwordHash` atau field internal.
12. **Pre-commit & CI** — hook gitleaks aktif (via `git config core.hooksPath scripts/hooks`); jangan `git commit --no-verify` tanpa sadar. Setiap push harus melewati CI dan berakhir hijau.

## Workflow 4-pass setiap fitur selesai

| Pass | Aksi |
|---|---|
| 1. Build | vibecode bebas |
| 2. Mesin | `npm run typecheck && npm run lint && npm run security` |
| 3. Audit | **Sesi baru** (context bersih) → command `/security-audit` atau skill `security-reviewer` — audit diff fitur terakhir |
| 4. Adversarial | Fitur auth/uang/admin → skill `penetration-tester` + browser MCP (Playwright): login user A, coba akses data user B; login user biasa, coba akses admin |

Prompt audit siap pakai:

> Audit keamanan fitur [X]. Cari: IDOR (ganti ID milik user lain), missing authz, input tanpa Zod, injection, XSS, secret hardcoded, rate-limit hilang. Untuk setiap temuan tuliskan file:line, cara eksploitasi, dampak, dan fix. Jangan bilang "aman" sebelum menuliskan area apa yang diperiksa dan apa yang TIDAK diperiksa.

## Definition of Done fitur baru

- [ ] `npm run typecheck` + `npm run lint` bersih
- [ ] `npm run security` bersih, atau setiap temuan didokumentasikan di `SECURITY.md`
- [ ] Zod schema + procedure type + ownership check benar
- [ ] Pass 3 (dan pass 4 untuk fitur sensitif) dijalankan di sesi baru
- [ ] Tidak ada secret / data sensitif ikut di-commit
- [ ] CI hijau (setelah repo punya remote GitHub)

<!-- SECURITY-PROTOCOL:END -->
