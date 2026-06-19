# Dapoy Bantuan Siswa (Tangerang Cerdas & PIP)

Sistem Informasi Manajemen Bantuan Siswa (Tangerang Cerdas & Program Indonesia Pintar) yang dilengkapi dengan manajemen pencairan dana, laporan, dan verifikasi keamanan terpusat.

## Fitur Utama
1. **Manajemen Data Siswa**: Pencatatan data siswa penerima bantuan (Tangerang Cerdas / PIP).
2. **Riwayat Pencairan**: Laporan pencairan dana bank beserta bukti transaksinya.
3. **Portal Akses Ganda**:
   - **Admin**: Mengelola data siswa, laporan, dan mengekspor data ke Excel.
   - **Siswa**: Portal pengecekan mandiri menggunakan NIK dan Tanggal Lahir.
4. **Dapoy Hub Integration**: Dilengkapi dengan sistem otentikasi lisensi berbasis Hardware ID (HWID) yang terhubung dengan Dapoy Hub Server.
5. **Keamanan Ekstra**: Sistem session management yang aman dan perlindungan captcha untuk mencegah serangan otomatis.

## Persyaratan Sistem
- Node.js v16+
- MySQL / MariaDB (Dianjurkan menggunakan Docker)
- Koneksi internet untuk verifikasi lisensi (Dapoy Hub)

## Cara Instalasi
1. Clone repositori ini atau salin semua file.
2. Jalankan `npm install` untuk menginstal dependensi.
3. Buat database di MySQL (contoh: `dapoy_bantuan_siswa`).
4. Import struktur database dari file SQL atau jalankan `node setup-db.js`.
5. Salin file `.env.example` ke `.env` (jika ada) dan konfigurasikan `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME`.

## Menjalankan Aplikasi
- Mode Development: `npm run dev` atau jalankan `start_server.bat` (Windows).
- Mode Production: `npm start` atau menggunakan PM2 (`pm2 start server.js --name "dapoy-bantuan-siswa"`).
- Aplikasi akan berjalan secara default di `http://localhost:7122`.

## Verifikasi Lisensi (Dapoy Hub)
Aplikasi ini dilindungi oleh lisensi Dapoy Hub. Pada saat pertama kali dijalankan, sistem akan memberikan **Free Trial selama 2 jam**. Jika masa trial habis, akses admin akan diblokir hingga lisensi diaktivasi.
Untuk aktivasi:
1. Login ke Dashboard Admin.
2. Klik tombol `Aktivasi` pada *banner* lisensi.
3. Masukkan `License Key` yang valid dari Dapoy Hub.

## Versioning
- Versi saat ini: **v1.1.0**
- Pembaruan versi mengikuti standar [Semantic Versioning (SemVer)](https://semver.org/).
