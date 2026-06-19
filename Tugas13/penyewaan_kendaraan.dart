// Nama Anggota Kelompok:
// 1. Herly Afrizal (NIM: 251410002)
// 2. Marta Saputra (NIM: 251410020)
// Topik: Sistem Penyewaan Kendaraan (Penerapan Bab 10 OOP)

class Kendaraan {
  String platNomor;
  String merk;
  String model;
  double hargaSewaPerHari;
  bool tersedia;

  Kendaraan(this.platNomor, this.merk, this.model, this.hargaSewaPerHari, this.tersedia);

  void tampilkanInfo() {
    print("Plat Nomor: $platNomor");
    print("Kendaraan : $merk $model");
    print("Tarif Sewa: Rp ${hargaSewaPerHari.toStringAsFixed(0)} / hari");
    print("Status    : ${tersedia ? 'Tersedia ✅' : 'Sedang Disewa ❌'}");
  }

  void sewa() {
    if (tersedia) {
      tersedia = false;
      print("Status kendaraan [$platNomor] berhasil diubah menjadi: TIDAK TERSEDIA.");
    } else {
      print("Maaf, kendaraan [$platNomor] saat ini sedang tidak tersedia.");
    }
  }

  void kembalikan() {
    if (!tersedia) {
      tersedia = true;
      print("Status kendaraan [$platNomor] berhasil diubah menjadi: TERSEDIA.");
    } else {
      print("Kendaraan [$platNomor] memang sudah tersedia di garasi.");
    }
  }
}

// Penerapan INHERITANCE (Pewarisan) & POLYMORPHISM (Polimorfisme)
class Mobil extends Kendaraan {
  int kapasitasPenumpang;

  Mobil(String platNomor, String merk, String model, double hargaSewaPerHari, bool tersedia, this.kapasitasPenumpang)
      : super(platNomor, merk, model, hargaSewaPerHari, tersedia);

  @override
  void tampilkanInfo() {
    print("--- [Info Mobil] ---");
    super.tampilkanInfo();
    print("Kapasitas : $kapasitasPenumpang Penumpang");
  }
}

class Motor extends Kendaraan {
  int kapasitasMesinCc;

  Motor(String platNomor, String merk, String model, double hargaSewaPerHari, bool tersedia, this.kapasitasMesinCc)
      : super(platNomor, merk, model, hargaSewaPerHari, tersedia);

  @override
  void tampilkanInfo() {
    print("--- [Info Motor] ---");
    super.tampilkanInfo();
    print("Kapasitas Mesin: $kapasitasMesinCc CC");
  }
}

// Penerapan ENKAPSULASI & INTERAKSI OBJEK
class Pelanggan {
  String nama;
  String nik;
  int jumlahSewaAktif;
  List<Kendaraan> sewaAktif = []; // Pelacakan daftar kendaraan yang sedang disewa

  Pelanggan(this.nama, this.nik, this.jumlahSewaAktif);

  void tampilkanInfo() {
    print("Nama Pelanggan  : $nama");
    print("NIK             : $nik");
    print("Sewa Aktif Saat Ini: $jumlahSewaAktif kendaraan");
  }
}

class TransaksiSewa {
  String idTransaksi;
  Pelanggan pelanggan;
  Kendaraan kendaraan;
  DateTime tanggalSewa;
  DateTime? tanggalKembali;
  double? totalBiaya;
  bool isSukses = false; // Menunjukkan apakah transaksi sewa ini aktif/berhasil

  TransaksiSewa(this.idTransaksi, this.pelanggan, this.kendaraan, this.tanggalSewa, [this.tanggalKembali]);

  void tampilkanDetailTransaksi() {
    print("==================================================");
    print("             STRUK TRANSAKSI SEWA KENDARAAN       ");
    print("==================================================");
    print("ID Transaksi   : $idTransaksi");
    print("Pelanggan      : ${pelanggan.nama} (${pelanggan.nik})");
    print("Kendaraan      : ${kendaraan.merk} ${kendaraan.model} [${kendaraan.platNomor}]");
    print("Tanggal Sewa   : ${tanggalSewa.toLocal().toString().split(' ')[0]}");
    if (tanggalKembali != null) {
      print("Tanggal Kembali: ${tanggalKembali!.toLocal().toString().split(' ')[0]}");
      print("Total Biaya    : Rp ${totalBiaya?.toStringAsFixed(0)}");
      print("Status         : SELESAI ✅");
    } else if (isSukses) {
      print("Tanggal Kembali: -");
      print("Total Biaya    : Rp - (Menunggu Pengembalian)");
      print("Status         : AKTIF (Sedang Sewa) 🔄");
    } else {
      print("Tanggal Kembali: -");
      print("Total Biaya    : Rp - (Gagal/Tidak Aktif)");
      print("Status         : BATAL / GAGAL ❌");
    }
    print("==================================================");
  }

  bool sewaKendaraan() {
    if (pelanggan.jumlahSewaAktif >= 2) {
      print("Pemberitahuan: Transaksi $idTransaksi Gagal! ${pelanggan.nama} sudah mencapai batas maksimal sewa (2 kendaraan).");
      return false;
    }
    if (!kendaraan.tersedia) {
      print("Pemberitahuan: Transaksi $idTransaksi Gagal! Kendaraan [${kendaraan.platNomor}] sedang disewa.");
      return false;
    }

    // Jika lolos validasi, lakukan transaksi sewa
    kendaraan.sewa();
    pelanggan.jumlahSewaAktif++;
    pelanggan.sewaAktif.add(kendaraan);
    isSukses = true;
    print("Pemberitahuan: Transaksi $idTransaksi Berhasil! ${pelanggan.nama} berhasil menyewa kendaraan [${kendaraan.platNomor}].");
    return true;
  }

  bool selesaikanTransaksi(int durasiHari) {
    if (!isSukses) {
      print("Transaksi $idTransaksi gagal diselesaikan karena transaksi sewa tidak aktif/sukses.");
      return false;
    }
    if (tanggalKembali == null) {
      if (pelanggan.sewaAktif.contains(kendaraan)) {
        kendaraan.kembalikan();
        pelanggan.jumlahSewaAktif--;
        pelanggan.sewaAktif.remove(kendaraan);
        
        tanggalKembali = tanggalSewa.add(Duration(days: durasiHari));
        totalBiaya = durasiHari * kendaraan.hargaSewaPerHari;
        print("Transaksi $idTransaksi berhasil diselesaikan untuk durasi $durasiHari hari.");
        return true;
      } else {
        print("Transaksi $idTransaksi gagal diselesaikan! Kendaraan [${kendaraan.platNomor}] tidak disewa oleh ${pelanggan.nama}.");
        return false;
      }
    } else {
      print("Transaksi $idTransaksi ini sudah selesai sebelumnya.");
      return false;
    }
  }
}

void main() {
  print("==========================================================");
  print("   SIMULASI SISTEM PENYEWAAN KENDARAAN (HERLY & MARTA)    ");
  print("      EKSPANSI SIMULASI: SKENARIO 15 TRANSAKSI OOP        ");
  print("==========================================================\n");

  // 1. Membuat objek-objek Kendaraan (5 Mobil, 5 Motor)
  Mobil mobil1 = Mobil("B 1234 ABC", "Toyota", "Avanza", 350000, true, 7);
  Mobil mobil2 = Mobil("D 9999 VVV", "Honda", "Civic Turbo", 800000, true, 5);
  Mobil mobil3 = Mobil("B 5678 EEE", "Daihatsu", "Xenia", 300000, true, 7);
  Mobil mobil4 = Mobil("F 1111 SSS", "Mitsubishi", "Pajero", 1200000, true, 7);
  Mobil mobil5 = Mobil("B 2222 GGG", "Suzuki", "Ertiga", 320000, true, 7);

  Motor motor1 = Motor("F 5678 XYZ", "Honda", "Beat", 80000, true, 110);
  Motor motor2 = Motor("B 3456 JJJ", "Yamaha", "NMAX", 150000, true, 155);
  Motor motor3 = Motor("D 7890 KKK", "Honda", "Vario", 100000, true, 125);
  Motor motor4 = Motor("F 4321 PPP", "Honda", "PCX", 180000, true, 160);
  Motor motor5 = Motor("B 8765 LLL", "Yamaha", "Mio", 75000, true, 125);

  // 2. Membuat objek-objek Pelanggan (12 Pelanggan)
  Pelanggan p1 = Pelanggan("Herly Afrizal", "3201010101010001", 0);
  Pelanggan p2 = Pelanggan("Marta Saputra", "3201010202020002", 0);
  Pelanggan p3 = Pelanggan("Budi Santoso", "3201010303030003", 0);
  Pelanggan p4 = Pelanggan("Siti Aminah", "3201010404040004", 0);
  Pelanggan p5 = Pelanggan("Ahmad Fauzi", "3201010505050005", 0);
  Pelanggan p6 = Pelanggan("Rizky Pratama", "3201010606060006", 0);
  Pelanggan p7 = Pelanggan("Dewi Lestari", "3201010707070007", 0);
  Pelanggan p8 = Pelanggan("Aditya Wijaya", "3201010808080008", 0);
  Pelanggan p9 = Pelanggan("Eko Prasetyo", "3201010909090009", 0);
  Pelanggan p10 = Pelanggan("Fitriani", "3201011010100010", 0);
  Pelanggan p11 = Pelanggan("Hendra Kusuma", "3201011111110011", 0);
  Pelanggan p12 = Pelanggan("Gracia Putri", "3201011212120012", 0);

  // 3. Eksekusi 15 Transaksi Simulasi
  print(">>> MEMULAI SIMULASI PENYEWAAN <<<\n");

  // Transaksi 1: Herly menyewa Avanza
  print(">>> TRANSAKSI 1: Herly menyewa Avanza <<<");
  TransaksiSewa ts1 = TransaksiSewa("TRX-001", p1, mobil1, DateTime.now());
  ts1.sewaKendaraan();
  print("");

  // Transaksi 2: Marta menyewa Civic Turbo
  print(">>> TRANSAKSI 2: Marta menyewa Civic Turbo <<<");
  TransaksiSewa ts2 = TransaksiSewa("TRX-002", p2, mobil2, DateTime.now());
  ts2.sewaKendaraan();
  print("");

  // Transaksi 3: Budi menyewa NMAX
  print(">>> TRANSAKSI 3: Budi menyewa NMAX <<<");
  TransaksiSewa ts3 = TransaksiSewa("TRX-003", p3, motor2, DateTime.now());
  ts3.sewaKendaraan();
  print("");

  // Transaksi 4: Siti menyewa Xenia
  print(">>> TRANSAKSI 4: Siti menyewa Xenia <<<");
  TransaksiSewa ts4 = TransaksiSewa("TRX-004", p4, mobil3, DateTime.now());
  ts4.sewaKendaraan();
  print("");

  // Transaksi 5: Ahmad menyewa Beat
  print(">>> TRANSAKSI 5: Ahmad menyewa Beat <<<");
  TransaksiSewa ts5 = TransaksiSewa("TRX-005", p5, motor1, DateTime.now());
  ts5.sewaKendaraan();
  print("");

  // Transaksi 6: Rizky menyewa Vario
  print(">>> TRANSAKSI 6: Rizky menyewa Vario <<<");
  TransaksiSewa ts6 = TransaksiSewa("TRX-006", p6, motor3, DateTime.now());
  ts6.sewaKendaraan();
  print("");

  // Transaksi 7: Dewi menyewa Ertiga
  print(">>> TRANSAKSI 7: Dewi menyewa Ertiga <<<");
  TransaksiSewa ts7 = TransaksiSewa("TRX-007", p7, mobil5, DateTime.now());
  ts7.sewaKendaraan();
  print("");

  // Transaksi 8: Aditya menyewa PCX
  print(">>> TRANSAKSI 8: Aditya menyewa PCX <<<");
  TransaksiSewa ts8 = TransaksiSewa("TRX-008", p8, motor4, DateTime.now());
  ts8.sewaKendaraan();
  print("");

  // Transaksi 9: Eko menyewa Pajero
  print(">>> TRANSAKSI 9: Eko menyewa Pajero <<<");
  TransaksiSewa ts9 = TransaksiSewa("TRX-009", p9, mobil4, DateTime.now());
  ts9.sewaKendaraan();
  print("");

  // Transaksi 10: Fitriani menyewa Mio
  print(">>> TRANSAKSI 10: Fitriani menyewa Mio <<<");
  TransaksiSewa ts10 = TransaksiSewa("TRX-010", p10, motor5, DateTime.now());
  ts10.sewaKendaraan();
  print("");

  // Transaksi 11: Hendra mencoba menyewa Avanza (Gagal karena sedang disewa Herly)
  print(">>> TRANSAKSI 11: Hendra mencoba menyewa Avanza (Seharusnya Gagal) <<<");
  TransaksiSewa ts11 = TransaksiSewa("TRX-011", p11, mobil1, DateTime.now());
  ts11.sewaKendaraan();
  print("");

  // Transaksi 12: Gracia mencoba menyewa NMAX (Gagal karena sedang disewa Budi)
  print(">>> TRANSAKSI 12: Gracia mencoba menyewa NMAX (Seharusnya Gagal) <<<");
  TransaksiSewa ts12 = TransaksiSewa("TRX-012", p12, motor2, DateTime.now());
  ts12.sewaKendaraan();
  print("");

  // Transaksi 13: Herly mengembalikan Avanza setelah 4 hari sewa
  print(">>> TRANSAKSI 13: Herly mengembalikan Avanza setelah 4 hari <<<");
  if (ts1.isSukses) {
    ts1.selesaikanTransaksi(4);
    ts1.tampilkanDetailTransaksi();
  }
  print("");

  // Transaksi 14: Hendra sekarang bisa menyewa Avanza yang sudah dikembalikan
  print(">>> TRANSAKSI 14: Hendra kini menyewa Avanza (Seharusnya Sukses) <<<");
  TransaksiSewa ts13 = TransaksiSewa("TRX-013", p11, mobil1, DateTime.now());
  ts13.sewaKendaraan();
  print("");

  // Transaksi 15: Marta menyewa Vario (Gagal karena Vario sedang disewa Rizky)
  print(">>> TRANSAKSI 15: Marta menyewa Vario (Seharusnya Gagal) <<<");
  TransaksiSewa ts14 = TransaksiSewa("TRX-014", p2, motor3, DateTime.now());
  ts14.sewaKendaraan();
  print("\n----------------------------------------------------------\n");

  print(">>> PROFIL STATUS AKHIR PELANGGAN UTAMA <<<");
  p1.tampilkanInfo();
  print("");
  p2.tampilkanInfo();
  print("");
  p11.tampilkanInfo();
  print("\n----------------------------------------------------------\n");
  print(">>> SIMULASI DART SELESAI <<<");
}
