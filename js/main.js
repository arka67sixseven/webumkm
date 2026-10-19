/* ============================================================
   Dapur Bu Sari — logika halaman (vanilla JS, tanpa framework)
   Semua data diambil dari js/data.js (objek UMKM).
   Prinsip: konten dinamis dirender lewat textContent/createElement,
   tidak memakai innerHTML untuk data.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- util singkat ---------- */
  const $ = (sel, akar = document) => akar.querySelector(sel);
  const $$ = (sel, akar = document) => Array.from(akar.querySelectorAll(sel));
  const el = (tag, kelas, teks) => {
    const n = document.createElement(tag);
    if (kelas) n.className = kelas;
    if (teks !== undefined) n.textContent = teks;
    return n;
  };
  const ikon = (id, kelas) => {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    if (kelas) svg.setAttribute("class", kelas);
    const use = document.createElementNS(NS, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  };
  const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
  const kurangiGerak = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  /* ---------- tautan WhatsApp ---------- */
  const pesanUmum = () => "Halo " + UMKM.nama + "! Saya mau pesan. Boleh minta info menu dan jadwal pengantarannya?";
  const pesanProduk = (p) => "Halo " + UMKM.nama + "! Saya mau pesan *" + p.nama + "*. Boleh info ketersediaan dan tanggal pengantarannya?";
  const tautanWa = (teks) => "https://wa.me/" + UMKM.wa + "?text=" + encodeURIComponent(teks);

  function isiTautanWa() {
    $$("[data-wa]").forEach((a) => {
      a.href = tautanWa(pesanUmum());
    });
  }

  function isiIdentitas() {
    $$("[data-nama-umkm]").forEach((n) => (n.textContent = UMKM.nama));
    $$("[data-wa-tampil]").forEach((n) => (n.textContent = UMKM.waTampil));
    $$("[data-alamat]").forEach((n) => (n.textContent = UMKM.alamat));
    $$("[data-area]").forEach((n) => (n.textContent = UMKM.area));
    const ig = $("[data-ig]");
    if (ig) {
      ig.href = "https://instagram.com/" + UMKM.instagram;
      const nama = $("span", ig);
      if (nama) nama.textContent = "@" + UMKM.instagram;
    }
    $$("[data-tel]").forEach((a) => {
      a.href = "tel:+" + UMKM.wa;
    });
  }

  /* ---------- strip menu berjalan ---------- */
  function renderStrip() {
    const track = $("#marquee-track");
    if (!track || !Array.isArray(UMKM.strip)) return;
    const buatGrup = () => {
      const grup = el("div", "marquee-grup");
      UMKM.strip.forEach((teks) => {
        grup.appendChild(el("span", "whitespace-nowrap font-display text-xl text-pandan-800", teks));
        grup.appendChild(ikon("ikon-kilau", "size-4 shrink-0 text-kunyit-500"));
      });
      return grup;
    };
    const g1 = buatGrup();
    const g2 = buatGrup();
    g2.setAttribute("aria-hidden", "true");
    track.append(g1, g2);
  }

  /* ---------- menu produk ---------- */
  const gridMenu = $("#menu-grid");
  const statusMenu = $("#menu-status");

  function labelKategori(p) {
    if (p.kategoriLabel) return p.kategoriLabel;
    const k = (UMKM.kategori || []).find((x) => x.id === p.kategori);
    return k ? k.label : p.kategori;
  }

  function kartuProduk(p, indeks) {
    const kartu = el("article", "card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift");
    kartu.setAttribute("data-reveal", "naik-" + ((indeks % 4) + 1));

    const bungkusGambar = el("div", "relative overflow-hidden");
    const img = el("img", "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]");
    img.src = p.gambar;
    img.alt = "Foto " + p.nama;
    img.loading = "lazy";
    img.width = 400;
    img.height = 300;
    bungkusGambar.appendChild(img);
    if (p.label) {
      bungkusGambar.appendChild(el("span", "absolute left-3 top-3 rounded-full bg-cabai-600 px-3 py-1 text-xs font-bold text-white", p.label));
    }
    kartu.appendChild(bungkusGambar);

    const isi = el("div", "flex flex-1 flex-col p-5");
    isi.appendChild(el("p", "text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-kunyit-700", labelKategori(p)));
    isi.appendChild(el("h3", "mt-1.5 text-lg leading-snug font-bold", p.nama));
    isi.appendChild(el("p", "mt-2 text-sm leading-relaxed text-muted", p.deskripsi));

    const kaki = el("div", "mt-auto pt-5");
    const harga = el("p", "text-lg font-extrabold text-pandan-800");
    harga.textContent = rupiah.format(p.harga);
    if (p.satuan) harga.appendChild(el("span", "ml-1 text-xs font-semibold text-muted", "/ " + p.satuan));
    kaki.appendChild(harga);

    const tombol = el("a", "btn btn-primary btn-sm mt-3 w-full");
    tombol.href = tautanWa(pesanProduk(p));
    tombol.setAttribute("aria-label", "Pesan " + p.nama + " lewat WhatsApp");
    tombol.appendChild(ikon("ikon-wa", "size-4"));
    tombol.appendChild(document.createTextNode("Pesan"));
    kaki.appendChild(tombol);

    isi.appendChild(kaki);
    kartu.appendChild(isi);
    return kartu;
  }

  function renderMenu(kategori, umumkan) {
    if (!gridMenu || !Array.isArray(UMKM.produk)) return;
    const kat = kategori || "semua";
    const daftar = UMKM.produk.filter((p) => kat === "semua" || p.kategori === kat);
    gridMenu.replaceChildren();
    const frag = document.createDocumentFragment();
    daftar.forEach((p, i) => frag.appendChild(kartuProduk(p, i)));
    gridMenu.appendChild(frag);

    /* keadaan kosong — bila kategori tidak punya produk */
    if (daftar.length === 0) {
      const kosong = el("div", "col-span-full rounded-3xl border border-dashed border-line bg-card p-10 text-center");
      kosong.appendChild(el("p", "font-bold", "Belum ada menu di kategori ini."));
      const tanya = el("a", "btn btn-primary btn-sm mt-4", "Tanya menu via WhatsApp");
      tanya.href = tautanWa(pesanUmum());
      kosong.appendChild(tanya);
      gridMenu.appendChild(kosong);
    }

    /* umumkan ke pembaca layar hanya saat pengguna mengganti filter */
    if (statusMenu && umumkan) {
      const k = (UMKM.kategori || []).find((x) => x.id === kat);
      statusMenu.textContent = daftar.length + " menu ditampilkan" + (kat === "semua" || !k ? "." : " — kategori " + k.label + ".");
    }
    amatiReveal();
  }

  function renderFilter() {
    const wadah = $("#filter-kategori");
    if (!wadah || !Array.isArray(UMKM.kategori)) return;
    UMKM.kategori.forEach((k, i) => {
      const b = el("button", "chip", k.label);
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        $$("button[aria-pressed]", wadah).forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        renderMenu(k.id, true);
      });
      wadah.appendChild(b);
    });
  }

  /* ---------- galeri + lightbox ---------- */
  const daftarGaleri = Array.isArray(UMKM.galeri) ? UMKM.galeri : [];
  const dialogGaleri = $("#lightbox");
  let indeksGaleri = 0;
  let pemicuGaleri = null;

  function tampilkanGaleri(i) {
    if (!dialogGaleri || daftarGaleri.length === 0) return;
    const n = daftarGaleri.length;
    indeksGaleri = ((i % n) + n) % n;
    const item = daftarGaleri[indeksGaleri];
    const img = $("#lightbox-img");
    const ket = $("#lightbox-caption");
    if (img) {
      img.src = item.src;
      img.alt = item.alt || "";
    }
    if (ket) ket.textContent = (item.caption ? item.caption + " — " : "") + (indeksGaleri + 1) + "/" + n;
  }

  function bukaGaleri(i, pemicu) {
    if (!dialogGaleri || typeof dialogGaleri.showModal !== "function") {
      const item = daftarGaleri[i];
      if (item) window.open(item.src, "_blank", "noopener");
      return;
    }
    pemicuGaleri = pemicu || null;
    tampilkanGaleri(i);
    dialogGaleri.showModal();
  }

  function renderGaleri() {
    const grid = $("#galeri-grid");
    if (!grid) return;
    daftarGaleri.forEach((item, i) => {
      const b = el("button", "group relative overflow-hidden rounded-3xl border border-line bg-card text-left transition-shadow duration-300 hover:shadow-lift");
      b.type = "button";
      b.setAttribute("data-reveal", "naik-" + ((i % 3) + 1));
      b.setAttribute("aria-label", "Perbesar: " + (item.caption || item.alt || "foto"));

      const img = el("img", "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]");
      img.src = item.src;
      img.alt = item.alt || "";
      img.loading = "lazy";
      img.width = 400;
      img.height = 300;
      b.appendChild(img);

      const bar = el("span", "flex items-center justify-between gap-3 border-t border-line bg-card px-4 py-3 text-sm font-semibold text-ink");
      bar.appendChild(el("span", "truncate", item.caption || ""));
      bar.appendChild(ikon("ikon-zoom", "size-4 shrink-0 text-muted"));
      b.appendChild(bar);

      b.addEventListener("click", () => bukaGaleri(i, b));
      grid.appendChild(b);
    });
  }

  function initLightbox() {
    if (!dialogGaleri) return;
    const tutup = $("#lightbox-tutup");
    const sebelum = $("#lightbox-sebelum");
    const lanjut = $("#lightbox-lanjut");
    if (tutup) tutup.addEventListener("click", () => dialogGaleri.close());
    if (sebelum) sebelum.addEventListener("click", () => tampilkanGaleri(indeksGaleri - 1));
    if (lanjut) lanjut.addEventListener("click", () => tampilkanGaleri(indeksGaleri + 1));
    dialogGaleri.addEventListener("click", (e) => {
      if (e.target === dialogGaleri) dialogGaleri.close();
    });
    dialogGaleri.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") tampilkanGaleri(indeksGaleri - 1);
      if (e.key === "ArrowRight") tampilkanGaleri(indeksGaleri + 1);
    });
    dialogGaleri.addEventListener("close", () => {
      if (pemicuGaleri) pemicuGaleri.focus();
      pemicuGaleri = null;
    });
  }

  /* ---------- testimoni ---------- */
  function renderTestimoni() {
    const wadah = $("#testimoni-grid");
    if (!wadah || !Array.isArray(UMKM.testimoni)) return;
    UMKM.testimoni.forEach((t, i) => {
      const li = el("li", "card flex flex-col p-6 transition-shadow duration-300 hover:shadow-lift");
      li.setAttribute("data-reveal", "naik-" + ((i % 3) + 1));
      li.appendChild(ikon("ikon-kutip", "size-8 text-kunyit-500"));

      const bintang = el("p", "mt-4 flex items-center gap-1 text-kunyit-600");
      const jumlah = Math.max(1, Math.min(5, t.bintang || 5));
      for (let s = 0; s < jumlah; s++) bintang.appendChild(ikon("ikon-bintang", "size-4"));
      bintang.setAttribute("role", "img");
      bintang.setAttribute("aria-label", "Nilai " + jumlah + " dari 5 bintang");
      li.appendChild(bintang);

      li.appendChild(el("blockquote", "mt-4 text-[0.95rem] leading-relaxed text-ink", "\u201C" + t.kutipan + "\u201D"));

      const kaki = el("footer", "mt-auto flex items-center gap-3 pt-6");
      const inisial = el("span", "grid size-10 shrink-0 place-items-center rounded-full bg-pandan-100 font-display text-sm text-pandan-800", t.nama.charAt(0).toUpperCase());
      inisial.setAttribute("aria-hidden", "true");
      const info = el("div", "min-w-0");
      info.appendChild(el("p", "text-sm font-bold", t.nama));
      info.appendChild(el("p", "text-xs text-muted", t.peran));
      kaki.append(inisial, info);
      li.appendChild(kaki);
      wadah.appendChild(li);
    });
  }

  /* ---------- statistik ---------- */
  function renderStats() {
    const wadah = $("#tentang-stats");
    if (!wadah || !Array.isArray(UMKM.stats)) return;
    UMKM.stats.forEach((s) => {
      const bungkus = el("div", "flex flex-col");
      bungkus.setAttribute("data-reveal", "naik-2");
      const label = el("dt", "order-2 mt-1 text-sm text-muted", s.label);
      const nilai = el("dd", "order-1 font-display text-3xl text-pandan-800", s.angka);
      bungkus.append(label, nilai);
      wadah.appendChild(bungkus);
    });
  }

  /* ---------- status buka / tutup ---------- */
  function hitungStatusBuka() {
    const sekarang = new Date();
    const hari = sekarang.getDay();
    const menit = sekarang.getHours() * 60 + sekarang.getMinutes();
    const jadwal = UMKM.jamOperasional || [];
    const hariIni = jadwal.find((j) => j.hari.includes(hari));
    if (hariIni && menit >= hariIni.bukaMenit && menit < hariIni.tutupMenit) {
      return { buka: true, teks: "Buka sekarang — sampai " + hariIni.tutup + " WIB" };
    }
    if (hariIni && menit < hariIni.bukaMenit) {
      return { buka: false, teks: "Tutup — buka hari ini " + hariIni.buka + " WIB" };
    }
    for (let d = 1; d <= 7; d++) {
      const h = (hari + d) % 7;
      const j = jadwal.find((x) => x.hari.includes(h));
      if (j) {
        const kapan = d === 1 ? "besok" : HARI[h];
        return { buka: false, teks: "Tutup — buka " + kapan + " " + j.buka + " WIB" };
      }
    }
    return { buka: false, teks: "Tutup — cek jadwal via WhatsApp" };
  }

  function terapkanStatusBuka() {
    const st = hitungStatusBuka();
    $$("[data-jam-teks]").forEach((n) => {
      n.textContent = st.teks;
    });
    $$("[data-jam-warna]").forEach((n) => {
      n.classList.toggle("text-pandan-800", st.buka);
      n.classList.toggle("text-cabai-700", !st.buka);
    });
    $$("[data-jam-titik]").forEach((n) => {
      n.classList.toggle("bg-pandan-500", st.buka);
      n.classList.toggle("bg-cabai-600", !st.buka);
    });
  }

  function renderJamBuka() {
    const wadah = $("#kontak-jam");
    if (!wadah || !Array.isArray(UMKM.jamOperasional)) return;
    UMKM.jamOperasional.forEach((j) => {
      wadah.appendChild(el("p", "text-muted", j.label + " · " + j.buka + "–" + j.tutup + " WIB"));
    });
  }

  /* ---------- peta ---------- */
  function renderPeta() {
    const fr = $("[data-peta]");
    if (fr && UMKM.mapsQuery) {
      fr.src = "https://www.google.com/maps?q=" + encodeURIComponent(UMKM.mapsQuery) + "&z=14&output=embed";
    }
    const tautan = $("[data-maps-link]");
    if (tautan && UMKM.mapsQuery) {
      tautan.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(UMKM.mapsQuery);
    }
  }

  /* ---------- navigasi ---------- */
  function initNav() {
    const tombol = $("#tombol-menu");
    const panel = $("#menu-mobile");
    const ikonBuka = $("#ikon-menu-buka");
    const ikonTutup = $("#ikon-menu-tutup");

    const setTerbuka = (terbuka) => {
      if (!panel || !tombol) return;
      panel.hidden = !terbuka;
      tombol.setAttribute("aria-expanded", String(terbuka));
      tombol.setAttribute("aria-label", terbuka ? "Tutup menu navigasi" : "Buka menu navigasi");
      if (ikonBuka) ikonBuka.classList.toggle("hidden", terbuka);
      if (ikonTutup) ikonTutup.classList.toggle("hidden", !terbuka);
    };

    if (tombol && panel) {
      tombol.addEventListener("click", () => setTerbuka(panel.hidden));
      $$("a", panel).forEach((a) => a.addEventListener("click", () => setTerbuka(false)));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !panel.hidden) {
          setTerbuka(false);
          tombol.focus();
        }
      });
      document.addEventListener("click", (e) => {
        if (!panel.hidden && !panel.contains(e.target) && !tombol.contains(e.target)) setTerbuka(false);
      });
    }

    const header = $("#header");
    const toTop = $("#to-top");
    const saatGulir = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 10);
      if (toTop) toTop.classList.toggle("is-show", y > 700);
    };
    window.addEventListener("scroll", saatGulir, { passive: true });
    saatGulir();

    if (toTop) {
      toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: kurangiGerak() ? "auto" : "smooth" }));
    }
  }

  function initScrollspy() {
    const tautan = $$("[data-nav]");
    const bagian = [];
    tautan.forEach((a) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target && !bagian.includes(target)) bagian.push(target);
    });
    if (bagian.length === 0 || !("IntersectionObserver" in window)) return;

    const terlihat = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => terlihat.set(en.target, en.isIntersecting ? en.intersectionRatio : 0));
        let teratas = null;
        let rasio = 0;
        terlihat.forEach((v, k) => {
          if (v > rasio) {
            rasio = v;
            teratas = k;
          }
        });
        tautan.forEach((a) => {
          if (teratas && a.getAttribute("href") === "#" + teratas.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    bagian.forEach((b) => io.observe(b));
  }

  /* ---------- reveal saat scroll ---------- */
  let observerReveal = null;
  function amatiReveal() {
    const elemen = $$("[data-reveal]:not(.is-visible)");
    if (elemen.length === 0) return;
    if (!("IntersectionObserver" in window) || kurangiGerak()) {
      elemen.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    if (!observerReveal) {
      observerReveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible");
              observerReveal.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
    }
    elemen.forEach((n) => observerReveal.observe(n));
  }

  /* ---------- mulai ---------- */
  function mulai() {
    isiIdentitas();
    isiTautanWa();
    renderStrip();
    renderFilter();
    renderMenu("semua");
    renderGaleri();
    renderTestimoni();
    renderStats();
    renderJamBuka();
    terapkanStatusBuka();
    window.setInterval(terapkanStatusBuka, 60000);
    renderPeta();
    initNav();
    initScrollspy();
    initLightbox();
    const tahun = $("#tahun");
    if (tahun) tahun.textContent = String(new Date().getFullYear());
    amatiReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();
})();
