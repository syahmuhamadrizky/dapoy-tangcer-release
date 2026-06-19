# Aplikasi Pendataan Bantuan Tangerang Cerdas & Program Indonesia Pintar

## 1. Konsep & Visi

Aplikasi web-based untuk mendata dan mengelola siswa penerima Bantuan Tangerang Cerdas dan Program Indonesia Pintar. Desain menggunakan tema pendidikan yang modern dengan warna biru-cyan yang melambangkan kecerdasan dan ketenangan. Aplikasi memiliki dua portal login: Admin untuk pengelolaan data dan Siswa untuk melihat status bantuan mereka.

## 2. Design Language

### Aesthetic Direction
Tampilan modern education-tech dengan sentuhan Indonesia yang hangat, menggunakan gradien biru-cyan yang profesional namun ramah.

### Color Palette
- **Primary**: `#1E3A5F` (Navy Blue - Profesional)
- **Secondary**: `#3B82F6` (Bright Blue - CTA)
- **Accent**: `#06B6D4` (Cyan - Highlights)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)
- **Background**: `#F0F9FF` (Light Blue)
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`

### Typography
- **Headings**: 'Poppins', sans-serif (600-700 weight)
- **Body**: 'Inter', sans-serif (400-500 weight)

### Motion Philosophy
- Subtle fade-in dan slide-up untuk page transitions
- Smooth hover transitions (200ms ease)
- Loading spinner dengan pulse animation
- Toast notifications slide-in dari atas

## 3. Layout & Struktur

### Halaman Login
- Split layout: kiri branding, kanan form login
- Mobile: full-width dengan stacking
- Captcha visual dengan refresh button
- Toggle antara login Admin dan Siswa

### Dashboard Admin
- Sidebar navigation (collapsible di mobile)
- Header dengan user info dan logout
- Content area dengan cards dan data tables
- Quick stats di atas

### Dashboard Siswa
- Single page dengan cards
- Profile card dengan info siswa
- Status bantuan yang diterima
- Timeline/status pencairan

## 4. Features & Interactions

### Login System
- **Admin Login**: Username + Password (stored in useradmin table)
- **Siswa Login**: NIK + Tanggal Lahir (DD-MM-YYYY format)
- **Captcha**: 6 karakter alphanumeric, case-insensitive
- **Error Handling**: Invalid credentials, captcha mismatch, empty fields
- **Session**: JWT-based dengan expiry 24 jam

### Admin Features
- Dashboard dengan statistik total siswa, bantuan aktif, dll
- CRUD lengkap data siswa
- Import data dari Excel
- Export data ke Excel
- Filter dan search data
- View detail siswa

### Siswa Features
- Lihat profil diri
- Lihat status bantuan (Tangerang Cerdas / PIP)
- Lihat status pencairan
- Update data diri (limited)

## 5. Component Inventory

### Login Form
- Input fields dengan floating labels
- Select dropdown untuk role (Admin/Siswa)
- Captcha image dengan reload button
- Primary button dengan loading state
- Error message dengan icon

### Data Table
- Sortable columns
- Pagination
- Row actions (view, edit, delete)
- Search bar
- Responsive: card view di mobile

### Cards
- Stat cards dengan icon dan trend
- Profile cards dengan avatar
- Status cards dengan badges
- Action cards dengan buttons

### Navigation
- Sidebar dengan icons dan labels
- Active state dengan background highlight
- Mobile: bottom navigation atau hamburger menu

## 6. Technical Approach

### Stack
- **Backend**: Python Flask
- **Database**: SQLite
- **Frontend**: HTML5, CSS3 (Tailwind-inspired custom), Vanilla JS
- **Data Processing**: Pandas untuk Excel

### API Endpoints
```
POST /api/auth/login          - Login user
POST /api/auth/logout         - Logout user
GET  /api/admin/dashboard     - Get dashboard stats
GET  /api/admin/siswa         - List all siswa
POST /api/admin/siswa         - Create siswa
PUT  /api/admin/siswa/<id>    - Update siswa
DELETE /api/admin/siswa/<id>  - Delete siswa
POST /api/admin/import        - Import from Excel
GET  /api/siswa/profile       - Get own profile
PUT  /api/siswa/profile       - Update own profile
GET  /api/captcha             - Generate new captcha
```

### Data Model

**useradmin**
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password_hash (TEXT)
- nama_admin (TEXT)
- created_at (DATETIME)

**datasiswa**
- id (INTEGER PRIMARY KEY)
- uuid (TEXT UNIQUE)
- nama (TEXT)
- kelas (TEXT)
- jenis_kelamin (TEXT)
- nik_siswa (TEXT UNIQUE)
- nisn (TEXT)
- tempat_lahir (TEXT)
- tanggal_lahir (TEXT)
- agama (TEXT)
- no_kk (TEXT)
- nik_ayah (TEXT)
- nama_ayah (TEXT)
- nik_ibu (TEXT)
- nama_ibu (TEXT)
- alamat (TEXT)
- rt (TEXT)
- rw (TEXT)
- kelurahan (TEXT)
- kecamatan (TEXT)
- kota (TEXT)
- provinsi (TEXT)
- dtks (TEXT)
- desil (TEXT)
- program_bantuan (TEXT)
- status_pencairan (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

**captcha**
- id (INTEGER PRIMARY KEY)
- code (TEXT)
- expires_at (DATETIME)
