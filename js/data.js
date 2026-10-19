/* ============================================================
   DATA UMKM — GANTI DI SINI
   ------------------------------------------------------------
   Semua yang tampil di halaman ini bersumber dari objek UMKM.
   Cukup ubah nilainya, tidak perlu menyentuh index.html.
   Komentar "← GANTI" menandai data yang wajib diganti pemilik.
   ============================================================ */

const UMKM = {
  /* ---------- Identitas ---------- */
  nama: "Dapur Bu Sari",
  wa: "6281200000000", // ← GANTI: nomor WhatsApp format internasional tanpa "+" (contoh: 628123456789)
  waTampil: "0812‑0000‑0000", // ← GANTI: nomor WhatsApp untuk ditampilkan
  instagram: "dapurbusari", // ← GANTI: username Instagram tanpa "@"
  alamat: "Jl. Kaliurang KM 8, Ngaglik, Sleman, Yogyakarta", // ← GANTI
  area: "Sleman & Kota Yogyakarta",
  mapsQuery: "Ngaglik, Sleman, Yogyakarta", // ← GANTI: kata kunci lokasi untuk peta & Google Maps

  /* ---------- Jam operasional ----------
     bukaMenit/tutupMenit = jam buka dalam satuan menit (08.00 = 480).
     hari: 0 = Minggu, 1 = Senin, ... 6 = Sabtu. */
  jamOperasional: [
    { hari: [1, 2, 3, 4, 5, 6], label: "Senin–Sabtu", buka: "08.00", tutup: "20.00", bukaMenit: 480, tutupMenit: 1200 },
    { hari: [0], label: "Minggu", buka: "09.00", tutup: "15.00", bukaMenit: 540, tutupMenit: 900 }
  ],

  /* ---------- Teks strip menu berjalan ---------- */
  strip: ["Nasi Box", "Tumpeng Mini", "Frozen Food", "Sambal Botol", "Bolu Pandan", "Hampers", "Ayam Bakar", "Layanan Antar"],

  /* ---------- Statistik di bagian "Tentang" (angka contoh — ← GANTI) ---------- */
  stats: [
    { angka: "7+", label: "Tahun memasak" },
    { angka: "12rb+", label: "Nasi box terkirim" },
    { angka: "4,9/5", label: "Rating pelanggan" },
    { angka: "36+", label: "Menu & paket" }
  ],

  /* ---------- Kategori menu ---------- */
  kategori: [
    { id: "semua", label: "Semua" },
    { id: "nasi-box", label: "Nasi & Tumpeng" },
    { id: "frozen", label: "Frozen Food" },
    { id: "sambal", label: "Sambal" },
    { id: "kue", label: "Kue & Hampers" }
  ],

  /* ---------- Produk ----------
     gambar: file di assets/img (boleh diganti foto .jpg/.webp).
     label: teks badge opsional (boleh dihapus). */
  produk: [
    {
      id: "nasi-box-ayam-bakar",
      nama: "Nasi Box Ayam Bakar",
      kategori: "nasi-box",
      harga: 25000,
      satuan: "box",
      deskripsi: "Ayam bakar madu, tumis sayur, telur iris, dan sambal bawang. Lengkap dengan lalapan segar.",
      gambar: "assets/img/produk-nasi-box-ayam-bakar.svg",
      label: "Paling laris"
    },
    {
      id: "nasi-box-ayam-ungkep",
      nama: "Nasi Box Ayam Ungkep",
      kategori: "nasi-box",
      harga: 23000,
      satuan: "box",
      deskripsi: "Ayam ungkep bumbu kuning, tahu-tempe goreng, tumis kacang panjang, dan sambal terasi.",
      gambar: "assets/img/produk-nasi-box-ayam-ungkep.svg"
    },
    {
      id: "tumpeng-mini",
      nama: "Tumpeng Mini",
      kategori: "nasi-box",
      kategoriLabel: "Tumpeng",
      harga: 185000,
      satuan: "paket 6–8 porsi",
      deskripsi: "Tumpeng kuning dengan 7 lauk pendamping. Rapi untuk syukuran, ulang tahun, dan tasyakuran.",
      gambar: "assets/img/produk-tumpeng.svg",
      label: "Favorit acara"
    },
    {
      id: "risoles-mayo",
      nama: "Risoles Mayo",
      kategori: "frozen",
      kategoriLabel: "Frozen food",
      harga: 35000,
      satuan: "isi 10",
      deskripsi: "Isi ayam suwir & mayones, siap goreng tanpa perlu dicairkan. Lima menit langsung hangat.",
      gambar: "assets/img/produk-risoles.svg"
    },
    {
      id: "pastel-abon",
      nama: "Pastel Abon",
      kategori: "frozen",
      kategoriLabel: "Frozen food",
      harga: 32000,
      satuan: "isi 10",
      deskripsi: "Kulit renyah dengan isi abon sapi gurih. Stok andalan isi freezer keluarga.",
      gambar: "assets/img/produk-pastel.svg"
    },
    {
      id: "sambal-bawang",
      nama: "Sambal Bawang Botol",
      kategori: "sambal",
      harga: 28000,
      satuan: "botol 200 ml",
      deskripsi: "Pedas gurih dari bawang segar, tanpa pengawet. Tahan ±2 minggu di kulkas.",
      gambar: "assets/img/produk-sambal.svg",
      label: "Paling dicari"
    },
    {
      id: "bolu-pandan",
      nama: "Bolu Pandan Lembut",
      kategori: "kue",
      harga: 45000,
      satuan: "loyang",
      deskripsi: "Bolu pandan tanpa pewarna buatan, taburan keju. Dipanggang pagi, diantar hari itu.",
      gambar: "assets/img/produk-bolu-pandan.svg"
    },
    {
      id: "hampers-kecil",
      nama: "Hampers Kecil",
      kategori: "kue",
      kategoriLabel: "Hampers",
      harga: 75000,
      satuan: "paket",
      deskripsi: "Kue kering pilihan + sambal botol dalam satu paket. Bisa custom nama pemesan & kartu ucapan.",
      gambar: "assets/img/produk-hampers.svg"
    }
  ],

  /* ---------- Testimoni pelanggan (contoh — ← GANTI dengan kutipan asli) ---------- */
  testimoni: [
    {
      nama: "Anisa R.",
      peran: "Karyawan swasta, Sleman",
      bintang: 5,
      kutipan: "Pesan 20 box buat rapat kantor, semua bilang rasanya seperti masakan ibu. Sampai masih hangat pula!"
    },
    {
      nama: "Pak Yanto",
      peran: "Ketua RT, Ngaglik",
      bintang: 5,
      kutipan: "Tumpeng pesanan syukuran rapi dan lauknya banyak. Tamu pada nanya, akhirnya banyak yang ikut pesan."
    },
    {
      nama: "Maria",
      peran: "Mahasiswa, Kota Yogyakarta",
      bintang: 5,
      kutipan: "Risoles frozen-nya penyelamat malam deadline. Tinggal goreng sebentar, rasanya seperti masakan rumah."
    }
  ],

  /* ---------- Galeri (ganti src dengan foto asli, mis. assets/img/dapur-1.jpg) ---------- */
  galeri: [
    { src: "assets/img/galeri-dapur.svg", alt: "Ilustrasi dapur tempat memasak setiap pagi", caption: "Dari dapur kami" },
    { src: "assets/img/galeri-meja.svg", alt: "Ilustrasi meja makan dengan menu rumahan lengkap", caption: "Menu rumahan lengkap" },
    { src: "assets/img/produk-tumpeng.svg", alt: "Ilustrasi tumpeng mini pesanan acara", caption: "Tumpeng pesanan acara" },
    { src: "assets/img/galeri-kemasan.svg", alt: "Ilustrasi kemasan pesanan yang rapi", caption: "Dikemas rapi & higienis" },
    { src: "assets/img/produk-sambal.svg", alt: "Ilustrasi sambal bawang botolan", caption: "Sambal bawang botolan" },
    { src: "assets/img/produk-bolu-pandan.svg", alt: "Ilustrasi bolu pandan yang baru dipanggang", caption: "Bolu pandan fresh" }
  ]
};
