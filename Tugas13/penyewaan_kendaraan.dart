// Nama Anggota Kelompok:
// 1. Herly Afrizal
// 2. Marta Saputra
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

  // LOGIKA UTAMA PENYEWAAN DI PINDAH KE KELAS TRANSAKSISEWA
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
  print("==========================================================\n");

  // 1. Membuat objek kendaraan (Mobil dan Motor)
  Mobil mobil1 = Mobil("B 1234 ABC", "Toyota", "Avanza", 350000, true, 7);
  Motor motor1 = Motor("F 5678 XYZ", "Honda", "Beat", 80000, true, 110);
  Mobil mobil2 = Mobil("D 9999 VVV", "Honda", "Civic Turbo", 800000, true, 5);

  // 2. Membuat objek pelanggan
  Pelanggan pelanggan1 = Pelanggan("Herly Afrizal", "3201010101010001", 0);
  Pelanggan pelanggan2 = Pelanggan("Marta Saputra", "3201010202020002", 0);

  // 3. Menampilkan info awal
  print(">>> INFO AWAL KENDARAAN DAN PELANGGAN <<<");
  mobil1.tampilkanInfo();
  print("");
  motor1.tampilkanInfo();
  print("");
  pelanggan1.tampilkanInfo();
  print("");
  pelanggan2.tampilkanInfo();
  print("\n----------------------------------------------------------\n");

  // 4. Simulasi Pelanggan 1 (Herly) menyewa mobil1
  print(">>> SIMULASI TRANSAKSI 1: Herly menyewa Avanza <<<");
  TransaksiSewa ts1 = TransaksiSewa("TRX-001", pelanggan1, mobil1, DateTime.now());
  if (ts1.sewaKendaraan()) {
    ts1.tampilkanDetailTransaksi();
  }
  print("");

  // 5. Herly mencoba menyewa Avanza lagi (seharusnya gagal karena sudah disewa)
  print(">>> SIMULASI TRANSAKSI 2: Herly mencoba menyewa Avanza lagi <<<");
  TransaksiSewa ts2 = TransaksiSewa("TRX-002", pelanggan1, mobil1, DateTime.now());
  ts2.sewaKendaraan();
  print("");

  // 6. Herly menyewa Motor Beat
  print(">>> SIMULASI TRANSAKSI 3: Herly menyewa Honda Beat <<<");
  TransaksiSewa ts3 = TransaksiSewa("TRX-003", pelanggan1, motor1, DateTime.now());
  if (ts3.sewaKendaraan()) {
    ts3.tampilkanDetailTransaksi();
  }
  print("");

  // 7. Herly mencoba menyewa Mobil Civic (seharusnya gagal karena batas sewa maksimal = 2)
  print(">>> SIMULASI TRANSAKSI 4: Herly menyewa Civic (Batas sewa tercapai) <<<");
  TransaksiSewa ts4 = TransaksiSewa("TRX-004", pelanggan1, mobil2, DateTime.now());
  ts4.sewaKendaraan();
  print("");

  // 8. Menampilkan detail status sewa Herly
  print(">>> STATUS SEWA AKTIF HERLY <<<");
  pelanggan1.tampilkanInfo();
  print("\n----------------------------------------------------------\n");

  // 9. Simulasi pengembalian mobil1 oleh Herly setelah 3 hari sewa
  print(">>> SIMULASI PENGEMBALIAN: Herly mengembalikan Avanza setelah 3 hari <<<");
  if (ts1.isSukses) {
    ts1.selesaikanTransaksi(3);
    print("");
    ts1.tampilkanDetailTransaksi();
  }
  print("");

  // 10. Sekarang Herly bisa menyewa Civic karena satu slot sewa sudah kosong
  print(">>> SIMULASI TRANSAKSI 5: Herly sekarang menyewa Civic <<<");
  TransaksiSewa ts5 = TransaksiSewa("TRX-005", pelanggan1, mobil2, DateTime.now());
  if (ts5.sewaKendaraan()) {
    ts5.tampilkanDetailTransaksi();
  }
  print("\n----------------------------------------------------------\n");

  print(">>> SIMULASI SELESAI <<<");
}
