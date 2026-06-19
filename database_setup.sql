-- Database Setup Script untuk Aplikasi Bantuan Siswa
-- Jalankan script ini di MySQL untuk membuat database dan tabel

CREATE DATABASE IF NOT EXISTS dapoy_bantuan_siswa;
USE dapoy_bantuan_siswa;

-- Tabel useradmin untuk login admin
CREATE TABLE IF NOT EXISTS useradmin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama_admin VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel datasiswa untuk data siswa
CREATE TABLE IF NOT EXISTS datasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20),
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') DEFAULT NULL,
    kode_pos VARCHAR(10),
    no_hp VARCHAR(20),
    status_ortu ENUM('Lengkap', 'Yatim', 'Piatu', 'Yatim Piatu') DEFAULT 'Lengkap',
    nik_siswa VARCHAR(20) UNIQUE,
    nisn VARCHAR(20),
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    agama VARCHAR(20),
    no_kk VARCHAR(20),
    nik_ayah VARCHAR(20),
    nama_ayah VARCHAR(100),
    nik_ibu VARCHAR(20),
    nama_ibu VARCHAR(100),
    alamat TEXT,
    rt VARCHAR(5),
    rw VARCHAR(5),
    kelurahan VARCHAR(50),
    kecamatan VARCHAR(50),
    kota VARCHAR(50),
    provinsi VARCHAR(50),
    dtks VARCHAR(20),
    desil VARCHAR(10),
    program_bantuan VARCHAR(100),
    status_pencairan VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel captcha untuk menyimpan kode captcha sementara
CREATE TABLE IF NOT EXISTS captcha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Password di-hash dengan bcrypt, default: admin123
INSERT INTO useradmin (username, password_hash, nama_admin) VALUES 
('admin', '$2a$10$YourHashedPasswordHere', 'Administrator');

-- Trigger untuk auto-generate UUID
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS before_insert_siswa
BEFORE INSERT ON datasiswa
FOR EACH ROW
BEGIN
    IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
        SET NEW.uuid = UUID();
    END IF;
END$$
DELIMITER ;
