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

  sewaKendaraan(kendaraan) {
    if (this.jumlahSewaAktif < 2) {
      if (kendaraan.tersedia) {
        kendaraan.sewa(this);
        this.jumlahSewaAktif++;
        this.sewaAktif.push(kendaraan);
        appendLog(`Pemberitahuan: ${this.nama} berhasil menyewa kendaraan [${kendaraan.platNomor}].`, 'success');
        return true;
      } else {
        appendLog(`Pemberitahuan: Transaksi gagal! Kendaraan [${kendaraan.platNomor}] sedang disewa.`, 'error');
        return false;
      }
    } else {
      appendLog(`Pemberitahuan: Transaksi gagal! ${this.nama} sudah mencapai batas maksimal sewa (2 kendaraan).`, 'error');
      return false;
    }
  }

  kembalikanKendaraan(kendaraan) {
    if (this.jumlahSewaAktif > 0) {
      const index = this.sewaAktif.findIndex(k => k.platNomor === kendaraan.platNomor);
      if (index !== -1) {
        kendaraan.kembalikan();
        this.jumlahSewaAktif--;
        this.sewaAktif.splice(index, 1);
        appendLog(`Pemberitahuan: ${this.nama} berhasil mengembalikan kendaraan [${kendaraan.platNomor}].`, 'success');
        return true;
      } else {
        appendLog(`Pemberitahuan: Kendaraan [${kendaraan.platNomor}] tidak disewa oleh ${this.nama}.`, 'error');
        return false;
      }
    } else {
      appendLog(`Pemberitahuan: Pelanggan ${this.nama} tidak memiliki riwayat sewa aktif.`, 'error');
      return false;
    }
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
  }

  selesaikanTransaksi(durasiHari) {
    this.tanggalKembali = new Date(this.tanggalSewa.getTime() + durasiHari * 24 * 60 * 60 * 1000);
    this.totalBiaya = durasiHari * this.kendaraan.hargaSewaPerHari;
    this.pelanggan.kembalikanKendaraan(this.kendaraan);
    appendLog(`Transaksi ${this.idTransaksi} berhasil diselesaikan untuk durasi ${durasiHari} hari.`, 'success');
    return this;
  }
}

// =========================================================================
// STATE & INITIALIZATION
// =========================================================================
const DB_VEHICLES = {
  avanza: new Mobil("B 1234 ABC", "Toyota", "Avanza", 350000, true, 7),
  civic: new Mobil("D 9999 VVV", "Honda", "Civic Turbo", 800000, true, 5),
  beat: new Motor("F 5678 XYZ", "Honda", "Beat", 80000, true, 110)
};

const DB_CUSTOMERS = [
  new Pelanggan("Herly Afrizal", "3201010101010001", 0),
  new Pelanggan("Marta Saputra", "3201010202020002", 0)
];

let activeCustomerId = 0;
let transactionCounter = 1;
let activeTransactions = []; // List of active TransaksiSewa objects
let pendingReturnVehicleKey = null;

// Run Init
window.onload = function () {
  appendLog("SYSTEM INITIALIZED", "system");
  appendLog("SIMULASI SISTEM PENYEWAAN KENDARAAN (HERLY & MARTA)", "info");
  appendLog("Objek kendaraan dan pelanggan berhasil di-instansiasi di memori.", "info");
  updateUI();
};

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

    const success = pelanggan.sewaKendaraan(kendaraan);
    if (success) {
      const trxId = `TRX-` + String(transactionCounter++).padStart(3, '0');
      const transaksi = new TransaksiSewa(trxId, pelanggan, kendaraan, new Date());
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
    const customerWhoRented = kendaraan.penyewa;
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
  transaksi.selesaikanTransaksi(days);

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
// UI UPDATES
// =========================================================================
function updateUI() {
  // 1. Render/Update Customer List
  renderCustomers();

  // 2. Update Vehicle Cards UI
  for (let key in DB_VEHICLES) {
    const k = DB_VEHICLES[key];
    const card = document.getElementById(`card-${key}`);
    const btn = document.getElementById(`btn-${key}`);
    const tenantText = document.getElementById(`tenant-${key}`);

    if (k.tersedia) {
      card.classList.remove('rented');
      btn.classList.remove('return');
      btn.innerText = "Sewa";
      tenantText.innerText = "-";
      tenantText.style.color = "var(--text-dim)";
    } else {
      card.classList.add('rented');
      btn.classList.add('return');
      btn.innerText = "Kembalikan";
      tenantText.innerText = k.penyewa.nama;
      tenantText.style.color = "var(--accent-light-red)";
    }
  }
}

// =========================================================================
// AUXILIARY HELPER FUNCTIONS
// =========================================================================
function appendLog(message, type = 'info') {
  const logBody = document.getElementById('log-body');
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
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
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
  
  document.body.removeChild(textArea);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = "none";
    // Clean up iframe container inside modal to save resources
    const iframeContainer = modal.querySelector('#modalIframeContainer');
    if (iframeContainer) {
      iframeContainer.innerHTML = '';
    }
  }, 300);
  document.body.style.overflow = "";
}

function openDartpadInline() {
  const iframeContainer = document.getElementById('modalIframeContainer');

  const iframe = document.createElement('iframe');
  iframe.src = `https://dartpad.dev/embed-inline.html?theme=dark&run=true&id=7a31adf504470e5c6e6e0412ad718458`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframeContainer.innerHTML = '';
  iframeContainer.appendChild(iframe);

  openModal('codeModal');
}
