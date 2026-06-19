# SKRIP VIDEO PENJELASAN APLIKASI: SISTEM PENYEWAAN KENDARAAN (TUGAS KELOMPOK)
**Topik Tugas:** Sistem Penyewaan Kendaraan (Studi Kasus Pemrograman Berorientasi Objek - Bab 10)  
**Anggota Kelompok (SI2A):**  
1. **Herly Afrizal** (NIM: 251410002)  
2. **Marta Saputra** (NIM: 251410020)  

---

## Panduan Rekaman & Tips Umum:
* **Durasi Target:** 5 - 8 Menit.
* **Pembagian Suara:** Skrip ini dirancang agar **Herly Afrizal** membacakan dari awal hingga akhir Bagian 3, dan **Marta Saputra** membacakan sisanya (Bagian 4 dan Bagian 5).
* **Aktivitas Layar:** Lakukan rekaman layar (screen recording) menggunakan OBS Studio, Xbox Game Bar, atau alat perekam layar lainnya saat mensimulasikan web.
* **Nada Bicara:** Santai, profesional, jelas, dan percaya diri.

---

## STRUKTUR DAN SKRIP VIDEO

### BAGIAN 1: PEMBUKAAN & PENGENALAN (00:00 - 00:45)
**[Visual di Layar: Menampilkan halaman utama website SISTEM PENYEWAAN KENDARAAN (TUGAS KELOMPOK) secara utuh, scroll perlahan ke bagian identitas mahasiswa di bagian atas.]**

* **Herly Afrizal:**  
  > "Halo semuanya, selamat pagi/siang/sore. Perkenalkan, nama saya **Herly Afrizal** dengan NIM **251410002**, dan rekan kelompok saya adalah **Marta Saputra** dengan NIM **251410020**. Kami dari kelas **SI2A**.
  > 
  > Pada video kali ini, kami akan mempresentasikan hasil pengerjaan tugas besar mata kuliah Pemrograman Berorientasi Objek kami. Di sini, kami mengambil studi kasus **Sistem Penyewaan Kendaraan (Tugas Kelompok)**. 
  > 
  > Aplikasi ini kami bangun menggunakan bahasa pemrograman **Dart** untuk logika OOP-nya, dan kami visualisasikan secara interaktif dalam bentuk dashboard web menggunakan HTML, CSS modern, dan Javascript."

---

### BAGIAN 2: LATAR BELAKANG & DESKRIPSI SOAL (00:45 - 02:00)
**[Visual di Layar: Menampilkan file `laporan_tugas.md` di layar, atau scroll ke bagian "Penerapan Pilar OOP" pada web dashboard.]**

* **Herly Afrizal:**  
  > "Latar belakang tugas ini didasarkan pada soal Bab 10 tentang memahami OOP dari studi kasus nyata. Di buku panduan, dicontohkan sistem perpustakaan yang mengelola Buku, Anggota, dan Peminjaman. Namun, contoh di buku tersebut memiliki keterbatasan, yaitu belum mendemonstrasikan pilar **Pewarisan (Inheritance)** dan **Polimorfisme (Polymorphism)** secara langsung.
  > 
  > Oleh karena itu, kami mengembangkan studi kasus **Penyewaan Kendaraan** ini. Masalah utama dalam bisnis rental kendaraan adalah:
  > 1. Pelacakan status unit secara real-time.
  > 2. Batasan maksimal penyewaan per pelanggan untuk mengurangi risiko keamanan.
  > 3. Perhitungan tarif sewa otomatis berdasarkan durasi dan tipe kendaraan.
  > 4. Serta adanya perbedaan spesifik antara tipe kendaraan seperti Mobil dan Motor.
  > 
  > Mengapa masalah ini lebih baik diselesaikan dengan OOP? Karena jika menggunakan prosedural biasa, kode kita akan dipenuhi oleh percabangan `if-else` yang sangat rumit dan sulit dirawat apabila jenis kendaraan terus bertambah. Dengan OOP, struktur data menjadi modular, aman, dan mudah dikembangkan melalui konsep kelas, pewarisan, dan enkapsulasi."

---

### BAGIAN 3: ANALISIS KODE DART & PENERAPAN 4 PILAR OOP (02:00 - 04:00)
**[Visual di Layar: Berpindah ke tab Source Code di web, menampilkan file `penyewaan_kendaraan.dart`. Sorot baris-baris kelas sesuai penjelasan.]**

* **Herly Afrizal:**  
  > "Mari kita bedah kode Dart-nya terlebih dahulu. Di sini kami menerapkan empat pilar utama OOP:
  > 
  > Yang pertama, **Enkapsulasi (Encapsulation)**. Status ketersediaan kendaraan (`tersedia`) dan jumlah sewa aktif pelanggan (`jumlahSewaAktif`) kami sembunyikan di dalam objek. Data tersebut tidak bisa diubah langsung dari luar secara sembarangan, melainkan harus melalui metode resmi seperti `sewa()` dan `kembalikan()` untuk menjaga integritas data.
  > 
  > Pilar kedua adalah **Pewarisan (Inheritance)**. Kami memiliki *superclass* bernama `Kendaraan` yang menyimpan properti umum seperti `platNomor`, `merk`, `model`, dan `hargaSewaPerHari`. 
  > Kemudian, kami menurunkan kelas ini menjadi dua *subclass*, yaitu kelas `Mobil` yang memiliki atribut tambahan khusus `kapasitasPenumpang`, dan kelas `Motor` yang memiliki atribut khusus `kapasitasMesinCc`.
  > 
  > Pilar ketiga adalah **Polimorfisme (Polymorphism)**. Di kelas induk `Kendaraan`, terdapat metode `tampilkanInfo()`. Kami meng-*override* metode ini di kelas `Mobil` dan `Motor` menggunakan anotasi `@override`. Sehingga saat dipanggil, mobil akan mencetak kapasitas penumpang, sedangkan motor akan mencetak kapasitas mesin CC secara dinamis.
  > 
  > Pilar keempat adalah **Interaksi Objek (Object Interaction)**. Objek `Pelanggan` dan `Kendaraan` berinteraksi secara terstruktur melalui objek `TransaksiSewa`. Metode `sewaKendaraan()` dan `selesaikanTransaksi()` di dalam kelas `TransaksiSewa` inilah yang mengatur alur logika penyewaan, mulai dari validasi batas sewa pelanggan, mengubah ketersediaan unit, hingga mengkalkulasi durasi dan biaya transaksi secara otomatis."

---

### BAGIAN 4: DEMONSTRASI SIMULATOR WEB INTERAKTIF (04:00 - 06:15)
**[Visual di Layar: Kembali ke atas ke bagian Simulator Dashboard. Gerakkan kursor dan tunjukkan log terminal dan grid kendaraan.]**

* **Marta Saputra:**  
  > "Halo semuanya, saya Marta Saputra. Di bagian ini, saya akan mendemonstrasikan simulator interaktif dari sistem penyewaan kendaraan tugas kelompok kami.
  > Di bagian atas dashboard simulator, kita memiliki form **Tambah Pelanggan Baru** dan daftar **Pilih Pelanggan Aktif**. Saat ini kita memiliki 12 pelanggan bawaan yang di-instansiasi di memori.
  > 
  > Jika Anda melihat di sisi kanan pada **Virtual Terminal Dart Log**, sistem secara otomatis telah mengeksekusi **15 transaksi simulasi** saat halaman dimuat pertama kali! 
  > Mulai dari TRX-001 hingga TRX-010 di mana pelanggan menyewa kendaraan berurutan, lalu TRX-011 dan TRX-012 yang menunjukkan kegagalan sewa karena unit sedang dipakai, transaksi pengembalian TRX-013, hingga penyewaan kembali pada TRX-014."

**[Tindakan: Scroll ke bawah di daftar Pelanggan Aktif, pilih pelanggan "Hendra Kusuma". Sorot Toyota Avanza yang berstatus "Sedang Disewa" oleh Hendra Kusuma.]**
* **Marta Saputra:**  
  > "Di sini kita bisa melihat status kendaraan sinkron secara real-time dengan log. Contohnya, Toyota Avanza saat ini sedang disewa oleh Hendra Kusuma, yang merupakan hasil dari kelanjutan transaksi 14 kita.
  > Mari kita simulasikan proses pengembalian Avanza oleh Hendra. Kita klik tombol **Kembalikan** pada kartu Toyota Avanza."

**[Tindakan: Klik tombol "Kembalikan" pada Toyota Avanza. Input durasi "5" hari pada modal pop-up yang muncul. Klik "Selesaikan Pengembalian & Cetak Struk".]**
* **Marta Saputra:**  
  > "Kita masukkan durasi sewa selama **5 hari**, lalu klik selesaikan. 
  > Boom! Secara instan, website memunculkan **Invoice Transaksi Selesai** digital yang sangat detail. Terlihat ID Transaksi baru, nama penyewa Hendra Kusuma, NIK, tipe unit, durasi sewa 5 hari, dan Total Biaya otomatis terhitung Rp 1.750.000.
  > Status unit Avanza di garasi juga otomatis kembali menjadi 'Tersedia' dengan warna hijau."

**[Tindakan: Close modal invoice, klik pelanggan "Gracia Putri", lalu klik "Sewa" pada Toyota Avanza yang baru saja bebas.]**
* **Marta Saputra:**  
  > "Kita tutup modal invoice. Sekarang, kita pilih pelanggan Gracia Putri, lalu kita sewa Toyota Avanza yang baru saja dikembalikan tadi.
  > Transaksi berhasil! Avanza kembali berwarna merah dan disewa oleh Gracia Putri. Log transaksi baru langsung tercetak di virtual terminal.
  > Di bagian bawah web, kami juga menyediakan **Source Code File Inspector** di mana dosen atau pengguna bisa langsung melihat kode Dart lengkap kami yang sudah diekspansi, menyalinnya, atau mengklik tombol **OPEN DARTPAD** untuk menjalankannya."

---

### BAGIAN 5: KESIMPULAN & PENUTUP (06:15 - END)
**[Visual di Layar: Sorot kembali header web, goyangkan sedikit kursor pada logo SISTEM PENYEWAAN KENDARAAN (TUGAS KELOMPOK), lalu tunjukkan wajah jika merekam menggunakan webcam.]**

* **Marta Saputra:**  
  > "Kesimpulannya, melalui sistem penyewaan kendaraan berskala kelompok ini, kami telah berhasil memetakan semua teori pilar OOP Dart dari Bab 10 ke dalam aplikasi yang lebih kompleks dan realistis. Dengan mensimulasikan lebih dari 10 transaksi secara simultan pada 10 unit armada dan 12 pelanggan, integritas enkapsulasi dan interaksi objek terbukti tetap terjaga dengan baik.
  > 
  > Demikian presentasi penjelasan aplikasi dari kelompok kami. Semoga penjelasan ini dapat memberikan gambaran yang jelas mengenai implementasi OOP dalam proyek ini. Kurang lebihnya mohon maaf, terima kasih banyak atas perhatiannya, dan sampai jumpa!"

---
*Skrip ini telah disesuaikan dengan file `index.html`, `app.js`, dan `laporan_tugas.md` yang ada di proyek Anda.*
