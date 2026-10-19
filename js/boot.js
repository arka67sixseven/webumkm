/* Penanda JS aktif — dipakai CSS agar animasi reveal hanya berjalan
   bila JavaScript tersedia (tanpa JS, konten tetap tampil normal). */
document.documentElement.classList.add("js");

/* Jaring pengaman: main.js menandai "js-siap" setelah render selesai.
   Bila tanda itu tidak muncul (skrip gagal dimuat atau error di tengah
   jalan), buka mode tanpa-JS agar konten tidak tertinggal transparan. */
window.setTimeout(function () {
  if (!document.documentElement.classList.contains("js-siap")) {
    document.documentElement.classList.remove("js");
  }
}, 2500);
