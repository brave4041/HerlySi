# LAPORAN TUGAS PEMROGRAMAN BERORIENTASI OBJEK (OOP)
**BAB 10: MEMAHAMI OOP DARI CONTOH KASUS**

**Anggota Kelompok:**
1. **Herly Afrizal** (NIM: 251410002)
2. **Marta Saputra** (NIM: 251410020)

**Topik Tugas:** Sistem Penyewaan Kendaraan (Vehicle Rental System)

---

## 1. Deskripsi Permasalahan
Dalam bisnis penyewaan kendaraan (seperti rental mobil dan motor), terdapat tantangan dalam mengelola inventaris kendaraan yang dinamis, data pelanggan yang bervariasi, serta pencatatan transaksi penyewaan secara akurat. Beberapa masalah utama yang sering dihadapi adalah:
* **Pelacakan Status Kendaraan**: Mengetahui dengan pasti apakah suatu kendaraan sedang tersedia, sedang disewa, atau sedang dalam perawatan.
* **Manajemen Pelanggan**: Mengontrol batas maksimal penyewaan kendaraan per pelanggan untuk meminimalkan risiko keamanan.
* **Pencatatan Transaksi**: Menghitung biaya sewa berdasarkan durasi pinjam dan tipe kendaraan yang disewa secara otomatis dan real-time.
* **Variasi Kendaraan**: Penanganan jenis kendaraan yang berbeda (mobil vs motor) yang masing-masing memiliki karakteristik unik (misalnya mobil memiliki kapasitas penumpang, sedangkan motor memiliki kapasitas mesin/CC).

---

## 2. Mengapa Masalah Ini Lebih Baik Diselesaikan dengan OOP?
Menggunakan paradigma pemrograman prosedural biasa untuk sistem ini akan menghasilkan banyak percabangan (`if-else`) yang rumit dan rentan bug ketika jenis kendaraan bertambah. Dengan OOP, masalah ini dapat dipecahkan secara elegan dan terstruktur menggunakan pilar-pilar berikut:

1. **Class dan Object (Kelas dan Objek)**:
   Kita dapat membuat blueprint/template untuk entitas nyata seperti `Kendaraan`, `Pelanggan`, dan `TransaksiSewa`. Setiap kendaraan atau pelanggan riil akan direpresentasikan sebagai objek tersendiri.
   
2. **Enkapsulasi (Encapsulation)**:
   Status ketersediaan kendaraan (`tersedia`) dan data jumlah sewa pelanggan (`jumlahSewaAktif`) disembunyikan (encapsulated) di dalam kelas masing-masing. Perubahan status hanya dapat dilakukan melalui metode resmi seperti `sewaKendaraan()` atau `kembalikanKendaraan()`, sehingga integritas data terjaga.

3. **Pewarisan (Inheritance)**:
   Kita dapat membuat kelas induk (superclass) bernama `Kendaraan` yang menyimpan atribut umum (plat nomor, merk, model, harga sewa). Kemudian kita dapat membuat subclass `Mobil` dan `Motor` yang mewarisi atribut tersebut sekaligus menambahkan atribut khusus (seperti `kapasitasPenumpang` untuk mobil dan `kapasitasMesinCc` untuk motor).

4. **Polimorfisme (Polymorphism)**:
   Metode seperti `tampilkanInfo()` dapat didefinisikan secara umum pada kelas induk `Kendaraan`, namun diimplementasikan ulang (override) pada kelas `Mobil` dan `Motor` untuk menampilkan detail yang berbeda sesuai spesifikasi kendaraan masing-masing.

5. **Interaksi Objek (Object Interaction)**:
   Objek `Pelanggan` dapat berinteraksi langsung dengan objek `Kendaraan` untuk mengubah statusnya, dan objek `TransaksiSewa` dapat menghubungkan kedua objek tersebut untuk menghitung total biaya sewa secara otomatis.

---

## 3. Langkah-langkah untuk Mengerjakan Masalah
Berikut adalah tahapan pengerjaan sistem penyewaan kendaraan ini:
1. **Mendefinisikan Kelas Kendaraan (Superclass)**:
   Membuat kelas dasar `Kendaraan` dengan properti umum dan metode untuk memperbarui status sewa.
2. **Membuat Kelas Turunan (Subclass) Mobil dan Motor**:
   Mengimplementasikan konsep inheritance dan polimorfisme dengan menambahkan fitur spesifik masing-masing jenis kendaraan.
3. **Mendefinisikan Kelas Pelanggan**:
   Membuat kelas `Pelanggan` untuk menyimpan data penyewa beserta batas maksimal sewa (misalnya maksimal 2 kendaraan sekaligus).
4. **Mendefinisikan Kelas TransaksiSewa**:
   Membuat kelas untuk mencatat relasi antara Pelanggan, Kendaraan, tanggal sewa, tanggal pengembalian, dan perhitungan total biaya.
5. **Membuat Simulasi Program (`main`)**:
   Menulis skenario di mana pelanggan menyewa beberapa kendaraan, sistem memvalidasi ketersediaan dan batas sewa, serta menghitung biaya saat kendaraan dikembalikan.

---

## 4. Perancangan Kelas (Class Design)

### A. Kelas `Kendaraan` (Superclass)
* **Atribut (State)**:
  * `platNomor` (String): Nomor plat kendaraan.
  * `merk` (String): Merk kendaraan (Toyota, Honda, dll).
  * `model` (String): Model kendaraan (Avanza, Beat, dll).
  * `hargaSewaPerHari` (double): Tarif sewa per hari.
  * `tersedia` (bool): Status ketersediaan (true/false).
* **Metode (Behavior)**:
  * `tampilkanInfo()`: Menampilkan informasi dasar kendaraan.
  * `sewa()`: Mengubah status `tersedia` menjadi `false`.
  * `kembalikan()`: Mengubah status `tersedia` menjadi `true`.

### B. Kelas `Mobil` (Subclass dari `Kendaraan`)
* **Atribut Tambahan**:
  * `kapasitasPenumpang` (int): Jumlah maksimal penumpang.
* **Metode (Override)**:
  * `tampilkanInfo()`: Menampilkan info dasar ditambah kapasitas penumpang.

### C. Kelas `Motor` (Subclass dari `Kendaraan`)
* **Atribut Tambahan**:
  * `kapasitasMesinCc` (int): Ukuran mesin dalam CC.
* **Metode (Override)**:
  * `tampilkanInfo()`: Menampilkan info dasar ditambah kapasitas CC mesin.

### D. Kelas `Pelanggan` (Member)
* **Atribut (State)**:
  * `nama` (String): Nama pelanggan.
  * `nik` (String): Nomor Induk Kependudukan.
  * `jumlahSewaAktif` (int): Jumlah kendaraan yang sedang disewa saat ini.
  * `sewaAktif` (List<Kendaraan>): Daftar objek kendaraan yang sedang disewa secara aktif oleh pelanggan ini.
* **Metode (Behavior)**:
  * `tampilkanInfo()`: Menampilkan nama pelanggan, NIK, dan jumlah unit yang sedang disewa aktif.

### E. Kelas `TransaksiSewa` (Loan/Transaction)
* **Atribut (State)**:
  * `idTransaksi` (String): Kode transaksi unik.
  * `pelanggan` (Pelanggan): Objek pelanggan yang melakukan transaksi.
  * `kendaraan` (Kendaraan): Objek kendaraan yang disewa.
  * `tanggalSewa` (DateTime): Tanggal dan waktu mulai penyewaan.
  * `tanggalKembali` (DateTime?): Tanggal dan waktu pengembalian kendaraan (null saat aktif).
  * `totalBiaya` (double?): Total biaya sewa yang dihitung setelah kendaraan dikembalikan (null saat aktif).
  * `isSukses` (bool): Status penanda apakah transaksi penyewaan ini aktif dan berhasil (true/false).
* **Metode (Behavior)**:
  * `tampilkanDetailTransaksi()`: Mencetak/menampilkan struk nota detail transaksi secara lengkap (termasuk status aktif/selesai, tanggal sewa/kembali, dan biaya).
  * `sewaKendaraan()`: Memvalidasi ketersediaan kendaraan dan batas maksimal sewa pelanggan (maksimal 2). Jika lolos validasi, mengubah status ketersediaan kendaraan menjadi tidak tersedia, memperbarui hitungan sewa aktif pelanggan, menandai transaksi aktif (`isSukses = true`), dan mencatat kendaraan ke daftar sewa pelanggan.
  * `selesaikanTransaksi(int durasiHari)`: Mengubah status ketersediaan kendaraan kembali menjadi tersedia, memperbarui hitungan dan daftar sewa aktif pelanggan, menetapkan tanggal pengembalian, serta menghitung total biaya sewa berdasarkan tarif harian.

---

## 5. Skenario Simulasi & Uji Coba (15 Transaksi)
Untuk memenuhi instruksi pengujian kelompok, kami mensimulasikan skenario kompleks dengan **10 unit kendaraan** (5 mobil, 5 motor) dan **12 pelanggan** yang melakukan transaksi penyewaan secara bergantian.

Berikut adalah ringkasan skenario uji coba yang diimplementasikan:
1. **TRX-001 s/d TRX-010 (Sewa Beruntun - Sukses)**: 10 pelanggan pertama menyewa seluruh 10 unit kendaraan yang tersedia. Seluruh status unit berubah menjadi **Tidak Tersedia**.
2. **TRX-011 s/d TRX-012 (Validasi Ketersediaan - Gagal)**: Pelanggan ke-11 dan ke-12 mencoba menyewa kendaraan yang sudah disewa (Avanza dan NMAX). Transaksi dibatalkan oleh sistem karena unit tidak tersedia.
3. **TRX-013 (Pengembalian Unit & Hitung Biaya - Sukses)**: Pelanggan ke-1 (Herly) mengembalikan Avanza setelah 4 hari sewa. Sistem mengubah status unit menjadi **Tersedia**, menghitung total tarif (4 hari x Rp 350.000 = Rp 1.400.000), dan mencetak struk transaksi.
4. **TRX-014 (Penyewaan Kembali Unit Bebas - Sukses)**: Pelanggan ke-11 (Hendra) yang sebelumnya gagal menyewa kini berhasil menyewa Avanza karena statusnya sudah bebas.
5. **TRX-015 (Validasi Batasan Unit - Gagal)**: Pelanggan mencoba menyewa unit yang sedang aktif disewa orang lain. Transaksi ditolak oleh sistem.

Semua alur pengujian di atas berjalan otomatis secara OOP di fungsi `main()` Dart dan langsung direpresentasikan secara dinamis pada terminal log saat visualizer web pertama kali dibuka.

