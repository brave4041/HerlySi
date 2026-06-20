// =========================================================================
// JAVASCRIPT OOP EMULATION CLASSES (Matches Dart Code)
// =========================================================================
class Kendaraan {
  constructor(platNomor, merk, model, hargaSewaPerHari, tersedia) {
    this.platNomor = platNomor;
    this.merk = merk;
    this.model = model;
    this.hargaSewaPerHari = hargaSewaPerHari;
    this.tersedia = tersedia;
    this.penyewa = null;
  }

  sewa(pelanggan) {
    if (this.tersedia) {
      this.tersedia = false;
      this.penyewa = pelanggan;
      appendLog(`Status kendaraan [${this.platNomor}] berhasil diubah menjadi: TIDAK TERSEDIA.`, 'system');
      return true;
    } else {
      appendLog(`Maaf, kendaraan [${this.platNomor}] saat ini sedang tidak tersedia.`, 'error');
      return false;
    }
  }

  kembalikan() {
    if (!this.tersedia) {
      this.tersedia = true;
      this.penyewa = null;
      appendLog(`Status kendaraan [${this.platNomor}] berhasil diubah menjadi: TERSEDIA.`, 'system');
      return true;
    } else {
      appendLog(`Kendaraan [${this.platNomor}] memang sudah tersedia di garasi.`, 'system');
      return false;
    }
  }
}

class Mobil extends Kendaraan {
  constructor(platNomor, merk, model, hargaSewaPerHari, tersedia, kapasitasPenumpang) {
    super(platNomor, merk, model, hargaSewaPerHari, tersedia);
    this.kapasitasPenumpang = kapasitasPenumpang;
  }
}

class Motor extends Kendaraan {
  constructor(platNomor, merk, model, hargaSewaPerHari, tersedia, kapasitasMesinCc) {
    super(platNomor, merk, model, hargaSewaPerHari, tersedia);
    this.kapasitasMesinCc = kapasitasMesinCc;
  }
}

class Pelanggan {
  constructor(nama, nik, jumlahSewaAktif) {
    this.nama = nama;
    this.nik = nik;
    this.jumlahSewaAktif = jumlahSewaAktif;
    this.sewaAktif = []; // array of Kendaraan
  }
}

class TransaksiSewa {
  constructor(idTransaksi, pelanggan, kendaraan, tanggalSewa) {
    this.idTransaksi = idTransaksi;
    this.pelanggan = pelanggan;
    this.kendaraan = kendaraan;
    this.tanggalSewa = tanggalSewa;
    this.tanggalKembali = null;
    this.totalBiaya = null;
    this.isSukses = false;
  }

  sewaKendaraan() {
    if (this.pelanggan.jumlahSewaAktif >= 2) {
      appendLog(`Pemberitahuan: Transaksi ${this.idTransaksi} Gagal! ${this.pelanggan.nama} sudah mencapai batas maksimal sewa (2 kendaraan).`, 'error');
      return false;
    }
    if (!this.kendaraan.tersedia) {
      appendLog(`Pemberitahuan: Transaksi ${this.idTransaksi} Gagal! Kendaraan [${this.kendaraan.platNomor}] sedang disewa.`, 'error');
      return false;
    }

    // Jika lolos validasi, lakukan transaksi sewa
    this.kendaraan.sewa(this.pelanggan);
    this.pelanggan.jumlahSewaAktif++;
    this.pelanggan.sewaAktif.push(this.kendaraan);
    this.isSukses = true;
    appendLog(`Pemberitahuan: Transaksi ${this.idTransaksi} Berhasil! ${this.pelanggan.nama} berhasil menyewa kendaraan [${this.kendaraan.platNomor}].`, 'success');
    return true;
  }

  selesaikanTransaksi(durasiHari) {
    if (!this.isSukses) {
      appendLog(`Transaksi ${this.idTransaksi} gagal diselesaikan karena transaksi sewa tidak aktif/sukses.`, 'error');
      return false;
    }
    if (this.tanggalKembali === null) {
      const index = this.pelanggan.sewaAktif.findIndex(k => k.platNomor === this.kendaraan.platNomor);
      if (index !== -1) {
        this.kendaraan.kembalikan();
        this.pelanggan.jumlahSewaAktif--;
        this.pelanggan.sewaAktif.splice(index, 1);

        this.tanggalKembali = new Date(this.tanggalSewa.getTime() + durasiHari * 24 * 60 * 60 * 1000);
        this.totalBiaya = durasiHari * this.kendaraan.hargaSewaPerHari;
        appendLog(`Transaksi ${this.idTransaksi} berhasil diselesaikan untuk durasi ${durasiHari} hari.`, 'success');
        return true;
      } else {
        appendLog(`Transaksi ${this.idTransaksi} gagal diselesaikan! Kendaraan [${this.kendaraan.platNomor}] tidak disewa oleh ${this.pelanggan.nama}.`, 'error');
        return false;
      }
    } else {
      appendLog(`Transaksi ${this.idTransaksi} ini sudah selesai sebelumnya.`, 'error');
      return false;
    }
  }
}

// =========================================================================
// STATE & INITIALIZATION
// =========================================================================
const DB_VEHICLES = {
  avanza: new Mobil("B 1234 ABC", "Toyota", "Avanza", 350000, true, 7),
  civic: new Mobil("D 9999 VVV", "Honda", "Civic Turbo", 800000, true, 5),
  xenia: new Mobil("B 5678 EEE", "Daihatsu", "Xenia", 300000, true, 7),
  pajero: new Mobil("F 1111 SSS", "Mitsubishi", "Pajero", 1200000, true, 7),
  ertiga: new Mobil("B 2222 GGG", "Suzuki", "Ertiga", 320000, true, 7),
  beat: new Motor("F 5678 XYZ", "Honda", "Beat", 80000, true, 110),
  nmax: new Motor("B 3456 JJJ", "Yamaha", "NMAX", 150000, true, 155),
  vario: new Motor("D 7890 KKK", "Honda", "Vario", 100000, true, 125),
  pcx: new Motor("F 4321 PPP", "Honda", "PCX", 180000, true, 160),
  mio: new Motor("B 8765 LLL", "Yamaha", "Mio", 75000, true, 125)
};

const DB_CUSTOMERS = [
  new Pelanggan("Herly Afrizal", "3201010101010001", 0),
  new Pelanggan("Marta Saputra", "3201010202020002", 0),
  new Pelanggan("Budi Santoso", "3201010303030003", 0),
  new Pelanggan("Siti Aminah", "3201010404040004", 0),
  new Pelanggan("Ahmad Fauzi", "3201010505050005", 0),
  new Pelanggan("Rizky Pratama", "3201010606060006", 0),
  new Pelanggan("Dewi Lestari", "3201010707070007", 0),
  new Pelanggan("Aditya Wijaya", "3201010808080008", 0),
  new Pelanggan("Eko Prasetyo", "3201010909090009", 0),
  new Pelanggan("Fitriani", "3201011010100010", 0),
  new Pelanggan("Hendra Kusuma", "3201011111110011", 0),
  new Pelanggan("Gracia Putri", "3201011212120012", 0)
];

let activeCustomerId = 0;
let transactionCounter = 14; // Start at 14 since 1-13 are simulated
let activeTransactions = []; // List of active TransaksiSewa objects
let pendingReturnVehicleKey = null;

// Run Init
window.onload = function () {
  appendLog("SYSTEM INITIALIZED", "system");
  appendLog("SIMULASI SISTEM PENYEWAAN KENDARAAN (HERLY & MARTA)", "info");
  appendLog("Armada kendaraan (10 unit) dan Pelanggan (12 orang) berhasil di-instansiasi di memori.", "info");

  // Menjalankan simulasi awal
  runInitialSimulation();

  updateUI();
  initDiagramZoomAndPan();
};

// =========================================================================
// RUN SIMULATION
// =========================================================================
function runInitialSimulation() {
  appendLog("==========================================================", "system");
  appendLog("   SIMULASI SISTEM PENYEWAAN KENDARAAN (HERLY & MARTA)    ", "system");
  appendLog("      EKSPANSI SIMULASI: SKENARIO 15 TRANSAKSI OOP        ", "system");
  appendLog("==========================================================\n", "system");
  appendLog(">>> MEMULAI SIMULASI PENYEWAAN <<<\n", "info");

  // Transaksi 1: Herly sewa Avanza (nanti dikembalikan di TRX 13)
  // Transaksi 2: Marta sewa Civic
  // Transaksi 3: Budi sewa NMAX
  // Transaksi 4: Siti sewa Xenia
  // Transaksi 5: Ahmad sewa Beat
  // Transaksi 6: Rizky sewa Vario
  // Transaksi 7: Dewi sewa Ertiga
  // Transaksi 8: Aditya sewa PCX
  // Transaksi 9: Eko sewa Pajero
  // Transaksi 10: Fitriani sewa Mio

  // Kita buat transaksi-transaksi ini
  const initialTrxs = [
    { id: "TRX-001", custIdx: 0, vehKey: "avanza" }, // Herly sewa Avanza
    { id: "TRX-002", custIdx: 1, vehKey: "civic" },  // Marta sewa Civic
    { id: "TRX-003", custIdx: 2, vehKey: "nmax" },   // Budi sewa NMAX
    { id: "TRX-004", custIdx: 3, vehKey: "xenia" },  // Siti sewa Xenia
    { id: "TRX-005", custIdx: 4, vehKey: "beat" },   // Ahmad sewa Beat
    { id: "TRX-006", custIdx: 5, vehKey: "vario" },  // Rizky sewa Vario
    { id: "TRX-007", custIdx: 6, vehKey: "ertiga" }, // Dewi sewa Ertiga
    { id: "TRX-008", custIdx: 7, vehKey: "pcx" },    // Aditya sewa PCX
    { id: "TRX-009", custIdx: 8, vehKey: "pajero" }, // Eko sewa Pajero
    { id: "TRX-010", custIdx: 9, vehKey: "mio" }     // Fitriani sewa Mio
  ];

  initialTrxs.forEach(t => {
    appendLog(`>>> TRANSAKSI ${t.id.split('-')[1].replace(/^0+/, '')}: ${DB_CUSTOMERS[t.custIdx].nama} menyewa ${DB_VEHICLES[t.vehKey].merk} ${DB_VEHICLES[t.vehKey].model} <<<`, 'info');
    const trx = new TransaksiSewa(t.id, DB_CUSTOMERS[t.custIdx], DB_VEHICLES[t.vehKey], new Date());
    if (trx.sewaKendaraan()) {
      activeTransactions.push(trx);
    }
    appendLog("");

    // Selesaikan transaksi sewa segera untuk beberapa kendaraan agar tersedia di dashboard
    if (["ertiga", "pcx", "pajero", "mio"].includes(t.vehKey)) {
      trx.selesaikanTransaksi(3);
      const tIdx = activeTransactions.indexOf(trx);
      if (tIdx !== -1) {
        activeTransactions.splice(tIdx, 1);
      }
      appendLog("");
    }
  });

  // Transaksi 11: Hendra mencoba menyewa Avanza (Gagal karena sedang disewa Herly)
  appendLog(">>> TRANSAKSI 11: Hendra mencoba menyewa Avanza (Seharusnya Gagal) <<<", "info");
  const trx11 = new TransaksiSewa("TRX-011", DB_CUSTOMERS[10], DB_VEHICLES.avanza, new Date());
  trx11.sewaKendaraan();
  appendLog("");

  // Transaksi 12: Gracia mencoba menyewa NMAX (Gagal karena sedang disewa Budi)
  appendLog(">>> TRANSAKSI 12: Gracia mencoba menyewa NMAX (Seharusnya Gagal) <<<", "info");
  const trx12 = new TransaksiSewa("TRX-012", DB_CUSTOMERS[11], DB_VEHICLES.nmax, new Date());
  trx12.sewaKendaraan();
  appendLog("");

  // Transaksi 13: Herly mengembalikan Avanza setelah 4 hari sewa
  appendLog(">>> TRANSAKSI 13: Herly mengembalikan Avanza setelah 4 hari <<<", "info");
  const t1Idx = activeTransactions.findIndex(t => t.idTransaksi === "TRX-001");
  if (t1Idx !== -1) {
    const trx1 = activeTransactions[t1Idx];
    trx1.selesaikanTransaksi(4);

    // Cetak detail di virtual console
    appendLog("==================================================", "info");
    appendLog(`STRUK TRANSAKSI SEWA KENDARAAN:\nID Transaksi   : ${trx1.idTransaksi}\nPelanggan      : ${trx1.pelanggan.nama} (${trx1.pelanggan.nik})\nKendaraan      : ${trx1.kendaraan.merk} ${trx1.kendaraan.model} [${trx1.kendaraan.platNomor}]\nTanggal Sewa   : ${trx1.tanggalSewa.toISOString().split('T')[0]}\nTanggal Kembali: ${trx1.tanggalKembali.toISOString().split('T')[0]}\nTotal Biaya    : Rp ${trx1.totalBiaya.toLocaleString('id-ID')}\nStatus         : SELESAI ✅`, "info");
    appendLog("==================================================", "info");

    // Hapus dari transaksi aktif
    activeTransactions.splice(t1Idx, 1);
  }
  appendLog("");

  // Transaksi 14: Hendra sekarang bisa menyewa Avanza yang sudah dikembalikan
  appendLog(">>> TRANSAKSI 14: Hendra kini menyewa Avanza (Seharusnya Sukses) <<<", "info");
  const trx13 = new TransaksiSewa("TRX-013", DB_CUSTOMERS[10], DB_VEHICLES.avanza, new Date());
  if (trx13.sewaKendaraan()) {
    activeTransactions.push(trx13);
  }
  appendLog("");

  // Transaksi 15: Marta menyewa Vario (Gagal karena Vario sedang disewa Rizky)
  appendLog(">>> TRANSAKSI 15: Marta menyewa Vario (Seharusnya Gagal) <<<", "info");
  const trx14 = new TransaksiSewa("TRX-014", DB_CUSTOMERS[1], DB_VEHICLES.vario, new Date());
  trx14.sewaKendaraan();

  appendLog("\n----------------------------------------------------------\n", "system");
  appendLog(">>> SIMULASI SELESAI. Silakan berinteraksi lewat visual dashboard! <<<\n", "success");
}

// =========================================================================
// CORE EVENT HANDLERS & LOGIC
// =========================================================================
function selectCustomer(index) {
  activeCustomerId = index;
  renderCustomers();
  appendLog(`Pelanggan aktif dialihkan ke: ${DB_CUSTOMERS[activeCustomerId].nama}`, 'info');
}

function renderCustomers() {
  const container = document.getElementById('customer-list-container');
  if (!container) return;

  container.innerHTML = '';
  DB_CUSTOMERS.forEach((cust, index) => {
    const button = document.createElement('button');
    button.className = `cust-btn ${index === activeCustomerId ? 'active' : ''}`;
    button.id = `btn-cust-${index}`;
    button.onclick = () => selectCustomer(index);

    button.innerHTML = `
      <div class="cust-name">${cust.nama}</div>
      <div class="cust-meta">NIK: ${cust.nik}</div>
      <div class="cust-status-badge" id="badge-cust-${index}">Sewa: ${cust.jumlahSewaAktif}/2 Kendaraan</div>
    `;
    container.appendChild(button);
  });
}

function addNewCustomer() {
  const nameInput = document.getElementById('new-cust-name');
  const nikInput = document.getElementById('new-cust-nik');
  const name = nameInput.value.trim();
  const nik = nikInput.value.trim();

  if (!name) {
    alert("Nama pelanggan tidak boleh kosong!");
    return;
  }
  if (!/^\d{16}$/.test(nik)) {
    alert("NIK harus berupa 16 digit angka!");
    return;
  }

  // Instansiasi Objek Pelanggan Baru (OOP)
  const newCust = new Pelanggan(name, nik, 0);
  DB_CUSTOMERS.push(newCust);

  // Pilih pelanggan baru tersebut
  activeCustomerId = DB_CUSTOMERS.length - 1;

  // Log ke terminal
  appendLog(`\n[OOP INSTANTIATION] Membuat objek Pelanggan baru:`, 'success');
  appendLog(`Nama: ${newCust.nama}`, 'success');
  appendLog(`NIK : ${newCust.nik}`, 'success');
  appendLog(`Objek Pelanggan berhasil ditambahkan ke memori.`, 'success');

  // Reset input
  nameInput.value = '';
  nikInput.value = '';

  // Update UI
  updateUI();
}

function toggleRent(vehicleKey) {
  const kendaraan = DB_VEHICLES[vehicleKey];
  const pelanggan = DB_CUSTOMERS[activeCustomerId];

  if (kendaraan.tersedia) {
    // Proses Penyewaan (Sewa)
    appendLog(`\n>>> TRANSAKSI BARU: ${pelanggan.nama} ingin menyewa ${kendaraan.merk} ${kendaraan.model} <<<`, 'info');

    const trxId = `TRX-` + String(transactionCounter++).padStart(3, '0');
    const transaksi = new TransaksiSewa(trxId, pelanggan, kendaraan, new Date());

    const success = transaksi.sewaKendaraan();
    if (success) {
      activeTransactions.push(transaksi);

      appendLog("==================================================", "info");
      appendLog(`STRUK BARU DIBUAT (AKTIF):\nID Transaksi : ${transaksi.idTransaksi}\nPelanggan    : ${transaksi.pelanggan.nama}\nKendaraan    : ${transaksi.kendaraan.merk} ${transaksi.kendaraan.model} [${transaksi.kendaraan.platNomor}]\nTarif        : Rp ${transaksi.kendaraan.hargaSewaPerHari.toLocaleString('id-ID')} / hari`, "info");
      appendLog("==================================================", "info");
    }
  } else {
    // Proses Pengembalian (Kembalikan)
    // Cari transaksi sewa aktif untuk kendaraan ini
    const trxIndex = activeTransactions.findIndex(t => t.kendaraan.platNomor === kendaraan.platNomor && t.tanggalKembali === null);
    if (trxIndex === -1) {
      appendLog(`Error: Transaksi aktif untuk kendaraan [${kendaraan.platNomor}] tidak ditemukan.`, 'error');
      return;
    }

    // Tampilkan modal durasi sewa
    pendingReturnVehicleKey = vehicleKey;
    document.getElementById('modal-return-title').innerText = `KEMBALIKAN: ${kendaraan.merk} ${kendaraan.model}`;
    document.getElementById('rental-days').value = 1;
    openModal('returnModal');
  }
  updateUI();
}

function submitReturn() {
  const days = parseInt(document.getElementById('rental-days').value);
  if (isNaN(days) || days < 1) {
    alert("Durasi sewa minimal adalah 1 hari!");
    return;
  }

  closeModal('returnModal');
  const vehicleKey = pendingReturnVehicleKey;
  const kendaraan = DB_VEHICLES[vehicleKey];

  // Cari transaksi
  const trxIndex = activeTransactions.findIndex(t => t.kendaraan.platNomor === kendaraan.platNomor && t.tanggalKembali === null);
  if (trxIndex === -1) return;

  const transaksi = activeTransactions[trxIndex];

  appendLog(`\n>>> PENGEMBALIAN KENDARAAN: ${transaksi.pelanggan.nama} mengembalikan ${kendaraan.merk} ${kendaraan.model} <<<`, 'info');

  // Selesaikan Transaksi
  const sukses = transaksi.selesaikanTransaksi(days);
  if (!sukses) return;

  // Cetak detail di virtual console
  appendLog("==================================================", "success");
  appendLog(`STRUK SELESAI DIHITUNG:\nID Transaksi   : ${transaksi.idTransaksi}\nPelanggan      : ${transaksi.pelanggan.nama}\nKendaraan      : ${transaksi.kendaraan.merk} ${transaksi.kendaraan.model}\nDurasi         : ${days} Hari\nTotal Biaya    : Rp ${transaksi.totalBiaya.toLocaleString('id-ID')}\nStatus         : SELESAI ✅`, "success");
  appendLog("==================================================", "success");

  // Tampilkan Struk Nota Digital Ke User
  document.getElementById('r-trx-id').innerText = transaksi.idTransaksi;
  document.getElementById('r-cust-name').innerText = transaksi.pelanggan.nama;
  document.getElementById('r-cust-nik').innerText = transaksi.pelanggan.nik;
  document.getElementById('r-veh-name').innerText = `${transaksi.kendaraan.merk} ${transaksi.kendaraan.model}`;
  document.getElementById('r-veh-plat').innerText = transaksi.kendaraan.platNomor;
  document.getElementById('r-date-rent').innerText = transaksi.tanggalSewa.toISOString().split('T')[0];
  document.getElementById('r-date-return').innerText = transaksi.tanggalKembali.toISOString().split('T')[0];
  document.getElementById('r-price-day').innerText = `Rp ${transaksi.kendaraan.hargaSewaPerHari.toLocaleString('id-ID')}`;
  document.getElementById('r-duration').innerText = `${days} Hari`;
  document.getElementById('r-total-price').innerText = `Rp ${transaksi.totalBiaya.toLocaleString('id-ID')}`;

  openModal('receiptModal');

  // Hapus transaksi aktif yang selesai
  activeTransactions.splice(trxIndex, 1);

  updateUI();
}

// =========================================================================
// UI RENDERING & UPDATES
// =========================================================================
function renderVehicles() {
  const container = document.getElementById('vehicle-list-container');
  if (!container) return;

  container.innerHTML = '';
  for (let key in DB_VEHICLES) {
    const k = DB_VEHICLES[key];
    const isMobil = k instanceof Mobil;
    const specLabel = isMobil ? 'Kapasitas' : 'Mesin / CC';
    const specVal = isMobil ? `${k.kapasitasPenumpang} Penumpang` : `${k.kapasitasMesinCc} CC`;
    const typeLabel = isMobil ? `MOBIL (Seat: ${k.kapasitasPenumpang})` : `MOTOR (${k.kapasitasMesinCc} CC)`;

    const card = document.createElement('div');
    card.className = `vehicle-card ${k.tersedia ? '' : 'rented'}`;
    card.id = `card-${key}`;

    card.innerHTML = `
      <div class="vehicle-header">
        <span class="vehicle-type">${typeLabel}</span>
        <span class="vehicle-plat">${k.platNomor}</span>
      </div>
      <div>
        <div class="vehicle-title">${k.merk} ${k.model}</div>
        <div class="vehicle-desc">${isMobil ? 'Mobil MPV/SUV rental premium yang bersih, terawat, dan nyaman.' : 'Motor matic/sport rental lincah, irit, dan ber-CC tinggi.'}</div>
        <div class="vehicle-specs">
          <div class="spec-item">
            <span>${specLabel}</span>
            <span>${specVal}</span>
          </div>
          <div class="spec-item">
            <span>Penyewa Aktif</span>
            <span id="tenant-${key}" style="color: ${k.tersedia ? 'var(--text-dim)' : 'var(--accent-light-red)'}; font-weight: ${k.tersedia ? 'normal' : 'bold'}">${k.tersedia ? '-' : k.penyewa.nama}</span>
          </div>
        </div>
      </div>
      <div class="vehicle-footer">
        <div class="price-tag"><b id="price-${key}">Rp ${k.hargaSewaPerHari.toLocaleString('id-ID')}</b>/hari</div>
        <button class="btn-action ${k.tersedia ? '' : 'return'}" id="btn-${key}" onclick="toggleRent('${key}')">${k.tersedia ? 'Sewa' : 'Kembalikan'}</button>
      </div>
    `;
    container.appendChild(card);
  }
}

function updateUI() {
  // 1. Render/Update Customer List
  renderCustomers();

  // 2. Render/Update Vehicle List
  renderVehicles();
}

// =========================================================================
// AUXILIARY HELPER FUNCTIONS
// =========================================================================
function appendLog(message, type = 'info') {
  const logBody = document.getElementById('log-body');
  if (!logBody) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.innerText = message;
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
}

function clearLogs() {
  document.getElementById('log-body').innerHTML = '';
  appendLog("LOGS CLEARED. TERMINAL RUNNING...", "system");
}

function switchTab(evt, tabId) {
  // Hide all contents
  const contents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove('active');
  }

  // Deactivate all buttons
  const buttons = document.getElementsByClassName('tab-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }

  document.getElementById(tabId).classList.add('active');
  evt.currentTarget.classList.add('active');
}

function switchDiagramTab(evt, tabId) {
  // Hide all diagram contents
  const contents = document.getElementsByClassName('diag-tab-content');
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove('active');
    contents[i].classList.add('hidden-tab');
  }

  // Deactivate all diagram buttons
  const buttons = document.getElementsByClassName('diag-tab-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }

  const activeContent = document.getElementById(tabId);
  activeContent.classList.remove('hidden-tab');
  activeContent.classList.add('active');
  evt.currentTarget.classList.add('active');
}

function copyCode(codeElementId) {
  const codeText = document.getElementById(codeElementId).innerText;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeText).then(() => {
      alert("Kode berhasil disalin!");
    }).catch(err => {
      fallbackCopyText(codeText);
    });
  } else {
    fallbackCopyText(codeText);
  }
}

function fallbackCopyText(text) {
  const textSpace = document.createElement("textarea");
  textSpace.value = text;
  textSpace.style.top = "0";
  textSpace.style.left = "0";
  textSpace.style.position = "fixed";

  document.body.appendChild(textSpace);
  textSpace.focus();
  textSpace.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert("Kode berhasil disalin!");
    } else {
      alert("Gagal menyalin kode.");
    }
  } catch (err) {
    alert("Gagal menyalin kode: " + err);
  }

  document.body.removeChild(textSpace);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  document.body.style.overflow = "hidden";
}

// Global closeModal wrapper
window.closeModal = closeModal;

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = "none";
    const iframeContainer = modal.querySelector('#modalIframeContainer');
    if (iframeContainer) {
      iframeContainer.innerHTML = '';
    }
    const diagramContainer = modal.querySelector('#diagram-modal-body');
    if (diagramContainer) {
      diagramContainer.innerHTML = '';
    }
  }, 300);
  document.body.style.overflow = "";
}

// =========================================================================
// ZOOMABLE DIAGRAM MODAL LOGIC
// =========================================================================
let baseWidth = 0;
let currentZoom = 1.0;

function openZoomableDiagram(diagramElementId, titleText) {
  const sourceElement = document.querySelector(`#${diagramElementId} .mermaid`);
  if (!sourceElement) return;

  // 1. Open the modal first so that the layout engine displays the modal
  // and computes width values (modalBody.clientWidth) correctly.
  document.getElementById('modal-diagram-title').innerText = titleText;
  openModal('diagramModal');

  const modalBody = document.getElementById('diagram-modal-body');
  modalBody.innerHTML = '';

  // Create a centered wrapper that allows scroll boundary extension without top-left cutoff
  const wrapper = document.createElement('div');
  wrapper.style.margin = 'auto';
  wrapper.style.display = 'inline-block';

  // Clone the rendered diagram structure
  const cloned = sourceElement.cloneNode(true);
  wrapper.appendChild(cloned);
  modalBody.appendChild(wrapper);

  const svg = cloned.querySelector('svg');
  if (svg) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');

    // Determine the base width from viewBox or style
    let widthVal = 800; // default fallback
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(/\s+/);
      if (parts.length >= 3) {
        widthVal = parseFloat(parts[2]);
      }
    } else {
      const styleMaxWidth = svg.style.maxWidth;
      if (styleMaxWidth && styleMaxWidth.includes('px')) {
        widthVal = parseFloat(styleMaxWidth);
      }
    }

    baseWidth = widthVal;

    // Fit to container width initially (with viewport width fallback if layout is not fully painted yet)
    let containerWidth = modalBody.clientWidth - 40;
    if (containerWidth <= 0) {
      containerWidth = (window.innerWidth * 0.9) - 40;
    }

    if (baseWidth > containerWidth && containerWidth > 0) {
      currentZoom = containerWidth / baseWidth;
    } else {
      currentZoom = 1.0;
    }

    applyZoom();
  }
}

function zoomDiagram(factor) {
  currentZoom *= factor;
  if (currentZoom < 0.1) currentZoom = 0.1;
  if (currentZoom > 5.0) currentZoom = 5.0;
  applyZoom();
}

function resetDiagramZoom() {
  const modalBody = document.getElementById('diagram-modal-body');
  if (!modalBody) return;
  let containerWidth = modalBody.clientWidth - 40;
  if (containerWidth <= 0) {
    containerWidth = (window.innerWidth * 0.9) - 40;
  }
  if (baseWidth > containerWidth && containerWidth > 0) {
    currentZoom = containerWidth / baseWidth;
  } else {
    currentZoom = 1.0;
  }
  applyZoom();
}

function applyZoom() {
  const svg = document.querySelector('#diagram-modal-body .mermaid svg');
  if (svg && baseWidth > 0) {
    svg.style.width = (baseWidth * currentZoom) + 'px';
    svg.style.height = 'auto';
  }
}

function initDiagramZoomAndPan() {
  const modalBody = document.getElementById('diagram-modal-body');
  if (!modalBody) return;

  let isDown = false;
  let startX;
  let startY;
  let scrollLeft;
  let scrollTop;

  modalBody.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left click
    isDown = true;
    startX = e.pageX - modalBody.offsetLeft;
    startY = e.pageY - modalBody.offsetTop;
    scrollLeft = modalBody.scrollLeft;
    scrollTop = modalBody.scrollTop;
  });

  modalBody.addEventListener('mouseleave', () => {
    isDown = false;
  });

  modalBody.addEventListener('mouseup', () => {
    isDown = false;
  });

  modalBody.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - modalBody.offsetLeft;
    const y = e.pageY - modalBody.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    modalBody.scrollLeft = scrollLeft - walkX;
    modalBody.scrollTop = scrollTop - walkY;
  });

  modalBody.addEventListener('wheel', (e) => {
    if (document.getElementById('diagramModal').classList.contains('active')) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomDiagram(1.1);
      } else {
        zoomDiagram(0.9);
      }
    }
  }, { passive: false });
}

function openDartpadInline() {
  const iframeContainer = document.getElementById('modalIframeContainer');

  const iframe = document.createElement('iframe');
  iframe.src = `https://dartpad.dev/embed-inline.html?theme=dark&run=true&id=8ee96434d62e2ec0c4f2cad890ce7104`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframeContainer.innerHTML = '';
  iframeContainer.appendChild(iframe);

  openModal('codeModal');
}

// =========================================================================
// SECURITY PROTOCOL (Anti-Copy, Anti-Inspect, Anti-Ctrl+U)
// =========================================================================
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  appendLog("Tindakan diblokir: Klik kanan dinonaktifkan untuk keamanan.", "error");
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    appendLog("Tindakan diblokir: F12 (Developer Tools) dinonaktifkan.", "error");
    return false;
  }

  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
    e.preventDefault();
    appendLog("Tindakan diblokir: Pintasan Inspect Element dinonaktifkan.", "error");
    return false;
  }

  if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
    e.preventDefault();
    appendLog("Tindakan diblokir: View Source (Ctrl+U) dinonaktifkan.", "error");
    return false;
  }

  if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
    e.preventDefault();
    appendLog("Tindakan diblokir: Menyimpan halaman (Ctrl+S) dinonaktifkan.", "error");
    return false;
  }
});

document.addEventListener('selectstart', function (e) {
  const tagName = e.target.tagName;
  if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
});
