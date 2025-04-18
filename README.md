# BackendTest Nexa - Alfiansah Erik Sugiarto

## 📌 Deskripsi Proyek

Project ini merupakan implementasi sistem backend menggunakan **Express.js**, **MySQL**, dan **Docker** yang berfungsi untuk:

- Autentikasi login admin menggunakan AES-128-CBC dan JWT
- Melakukan verifikasi input password dengan dekripsi AES dan perbandingan data
- Menyimpan data karyawan ke dalam database menggunakan **Stored Procedure**
- Menyimpan log aktivitas API ke dalam tabel `log_trx_api`
- Menampilkan daftar karyawan dengan pencarian dan pagination
- Mengedit dan memperbarui status karyawan (aktif/nonaktif)

---

## ⚙️ Teknologi yang Digunakan

- **Express.js** – Framework backend berbasis Node.js
- **MySQL** – Database relasional untuk penyimpanan data
- **Docker** – Containerization untuk deployment

---

## 🚀 Cara Menjalankan Proyek

### 📦 Prasyarat

- Sudah menginstall [Docker](https://www.docker.com/)
- Sudah menyiapkan file `.env` dengan isi seperti berikut:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=nama_database
JWT_SECRET=your_jwt_secret
AES_KEY=nexatest
```

### ✅ Jalankan dengan Dockerfile

```bash
# Build Docker image
docker build -t express-api .

# Jalankan container dengan file .env
docker run -p 3000:3000 --env-file .env express-api
```

> Pastikan database MySQL sudah berjalan secara lokal atau via Docker Compose jika digunakan.

---

## 📂 Struktur Folder

```bash
├── app.js                  # Entry point aplikasi Express
├── controllers/            # Logika untuk masing-masing endpoint API
├── routes/                 # Routing dari semua endpoint
├── utils/                  # Helper untuk AES, JWT, dan NIP generator
├── config/                 # Konfigurasi koneksi database MySQL
├── Dockerfile              # Konfigurasi image Docker
├── README.md               # Dokumentasi proyek
└── ...
```

---

## 🧪 Dokumentasi API

Dokumentasi lengkap endpoint tersedia di Postman Collection berikut:  
🔗 **[Klik untuk buka di Postman](https://www.postman.com/universal-comet-660064/workspace/tect-test-nexa)**

Endpoint mencakup:

- `POST /api/login` – Login admin
- `POST /api/karyawan` – Tambah data karyawan (dengan foto)
- `GET /api/karyawan` – Tampilkan daftar karyawan
- `PUT /api/karyawan/:nip` – Update data karyawan
- `PUT /api/karyawan/status/:nip` – Ubah status (nonaktifkan karyawan)

---

## 🛠️ Fitur Penting

### 🔐 Autentikasi & Enkripsi
- Password terenkripsi menggunakan AES-128-CBC 
- Verifikasi login membandingkan input dengan hasil dekripsi

### 🗃 Penyimpanan Karyawan via Stored Procedure
- Nama SP: `sp_add_kary_alfiansah_erik_sugiarto`
- Menyimpan data dan mencatat log ke tabel `log_trx_api`
- Validasi jika NIP sudah ada

### 👁 View Data Karyawan
- Menyediakan View `v_karyawan_alfiansah_erik_sugiarto` untuk tampilan terformat

---

## 🧾 Catatan

- Semua proses penyimpanan data penting dan perubahan status dilakukan dalam transaksi database
- Semua aktivitas (berhasil/gagal) dicatat dalam `log_trx_api`

---
