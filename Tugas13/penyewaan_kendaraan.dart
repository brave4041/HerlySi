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

  bool sewaKendaraan(Kendaraan kendaraan) {
    if (jumlahSewaAktif < 2) { // Batas maksimal sewa 2 kendaraan sekaligus
      if (kendaraan.tersedia) {
        kendaraan.sewa();
        jumlahSewaAktif++;
        sewaAktif.add(kendaraan);
        print("Pemberitahuan: $nama berhasil menyewa kendaraan [${kendaraan.platNomor}].");
        return true;
      } else {
        print("Pemberitahuan: Transaksi gagal! Kendaraan [${kendaraan.platNomor}] sedang disewa.");
        return false;
      }
    } else {
      print("Pemberitahuan: Transaksi gagal! $nama sudah mencapai batas maksimal sewa (2 kendaraan).");
      return false;
    }
  }

  bool kembalikanKendaraan(Kendaraan kendaraan) {
    if (jumlahSewaAktif > 0) {
      if (sewaAktif.contains(kendaraan)) {
        kendaraan.kembalikan();
        jumlahSewaAktif--;
        sewaAktif.remove(kendaraan);
        print("Pemberitahuan: $nama berhasil mengembalikan kendaraan [${kendaraan.platNomor}].");
        return true;
      } else {
        print("Pemberitahuan: Transaksi gagal! Kendaraan [${kendaraan.platNomor}] tidak disewa oleh $nama.");
        return false;
      }
    } else {
      print("Pemberitahuan: Pelanggan $nama tidak memiliki riwayat sewa aktif.");
      return false;
    }
  }
}

class TransaksiSewa {
  String idTransaksi;
  Pelanggan pelanggan;
  Kendaraan kendaraan;
  DateTime tanggalSewa;
  DateTime? tanggalKembali;
  double? totalBiaya;

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
    } else {
      print("Tanggal Kembali: -");
      print("Total Biaya    : Rp - (Menunggu Pengembalian)");
      print("Status         : AKTIF (Sedang Sewa) 🔄");
    }
    print("==================================================");
  }

  void selesaikanTransaksi(int durasiHari) {
    if (tanggalKembali == null) {
      bool suksesKembali = pelanggan.kembalikanKendaraan(kendaraan);
      if (suksesKembali) {
        tanggalKembali = tanggalSewa.add(Duration(days: durasiHari));
        totalBiaya = durasiHari * kendaraan.hargaSewaPerHari;
        print("Transaksi $idTransaksi berhasil diselesaikan untuk durasi $durasiHari hari.");
      } else {
        print("Transaksi $idTransaksi gagal diselesaikan karena proses pengembalian tidak valid.");
      }
    } else {
      print("Transaksi $idTransaksi ini sudah selesai sebelumnya.");
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
  TransaksiSewa? ts1;
  if (pelanggan1.sewaKendaraan(mobil1)) {
    ts1 = TransaksiSewa("TRX-001", pelanggan1, mobil1, DateTime.now());
    ts1.tampilkanDetailTransaksi();
  }
  print("");

  // 5. Herly mencoba menyewa Avanza lagi (seharusnya gagal karena sudah disewa)
  print(">>> SIMULASI TRANSAKSI 2: Herly mencoba menyewa Avanza lagi <<<");
  pelanggan1.sewaKendaraan(mobil1);
  print("");

  // 6. Herly menyewa Motor Beat
  print(">>> SIMULASI TRANSAKSI 3: Herly menyewa Honda Beat <<<");
  if (pelanggan1.sewaKendaraan(motor1)) {
    var ts2 = TransaksiSewa("TRX-002", pelanggan1, motor1, DateTime.now());
    ts2.tampilkanDetailTransaksi();
  }
  print("");

  // 7. Herly mencoba menyewa Mobil Civic (seharusnya gagal karena batas sewa maksimal = 2)
  print(">>> SIMULASI TRANSAKSI 4: Herly menyewa Civic (Batas sewa tercapai) <<<");
  pelanggan1.sewaKendaraan(mobil2);
  print("");

  // 8. Menampilkan detail status sewa Herly
  print(">>> STATUS SEWA AKTIF HERLY <<<");
  pelanggan1.tampilkanInfo();
  print("\n----------------------------------------------------------\n");

  // 9. Simulasi pengembalian mobil1 oleh Herly setelah 3 hari sewa
  print(">>> SIMULASI PENGEMBALIAN: Herly mengembalikan Avanza setelah 3 hari <<<");
  if (ts1 != null) {
    ts1.selesaikanTransaksi(3);
    print("");
    ts1.tampilkanDetailTransaksi();
  }
  print("");

  // 10. Sekarang Herly bisa menyewa Civic karena satu slot sewa sudah kosong
  print(">>> SIMULASI TRANSAKSI 5: Herly sekarang menyewa Civic <<<");
  if (pelanggan1.sewaKendaraan(mobil2)) {
    var ts3 = TransaksiSewa("TRX-003", pelanggan1, mobil2, DateTime.now());
    ts3.tampilkanDetailTransaksi();
  }
  print("\n----------------------------------------------------------\n");

  print(">>> SIMULASI SELESAI <<<");
}
