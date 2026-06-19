require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

async function setupDatabase() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║           SETUP DATABASE - BANTUAN SISWA                 ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    };

    let connection;

    try {
        console.log('[1/5] Menghubungi MySQL server...');
        connection = await mysql.createConnection(connectionConfig);
        console.log('       ✓ Koneksi berhasil!');
        console.log('');

        console.log('[2/5] Membuat database...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'dapoy_bantuan_siswa'}`);
        await connection.query(`USE ${process.env.DB_NAME || 'dapoy_bantuan_siswa'}`);
        console.log('       ✓ Database berhasil dibuat!');
        console.log('');

        console.log('[3/5] Membuat tabel...');

        // Tabel useradmin
        await connection.query(`
            CREATE TABLE IF NOT EXISTS useradmin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                nama_admin VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('       ✓ Tabel useradmin dibuat');

        // Tabel datasiswa
        await connection.query(`
            CREATE TABLE IF NOT EXISTS datasiswa (
                id INT AUTO_INCREMENT PRIMARY KEY,
                uuid VARCHAR(36) UNIQUE,
                nama VARCHAR(100) NOT NULL,
                kelas VARCHAR(20),
                jenis_kelamin ENUM('Laki-laki', 'Perempuan') DEFAULT NULL,
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
                nik_wali VARCHAR(20),
                nama_wali VARCHAR(100),
                hubungan VARCHAR(20),
                alamat TEXT,
                rt VARCHAR(5),
                rw VARCHAR(5),
                kelurahan VARCHAR(50),
                kecamatan VARCHAR(50),
                kota VARCHAR(50),
                provinsi VARCHAR(50),
                kode_pos VARCHAR(10),
                no_hp VARCHAR(20),
                dtks VARCHAR(20),
                desil VARCHAR(10),
                program_bantuan VARCHAR(100),
                status_pencairan VARCHAR(50),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('       ✓ Tabel datasiswa dibuat');
        console.log('');

        console.log('[4/5] Membuat admin default...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const [existingAdmin] = await connection.query('SELECT id FROM useradmin WHERE username = ?', ['admin']);
        if (existingAdmin.length === 0) {
            await connection.query(
                'INSERT INTO useradmin (username, password_hash, nama_admin) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'Administrator']
            );
            console.log('       ✓ Admin default dibuat: admin / admin123');
        } else {
            console.log('       ℹ Admin sudah ada');
        }
        console.log('');

        console.log('[5/5] Import data dari Excel...');
        try {
            const workbook = XLSX.readFile('datasiswa.xlsx');
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Find header row
            let startRow = 0;
            for (let i = 0; i < Math.min(data.length, 5); i++) {
                if (data[i][1] && typeof data[i][1] === 'string' && data[i][1].toLowerCase().includes('nama')) {
                    startRow = i + 1;
                    break;
                }
            }

            let importedCount = 0;
            for (let i = startRow; i < data.length; i++) {
                const row = data[i];
                if (!row[1]) continue;

                const nikSiswa = row[4] ? row[4].toString() : null;
                if (!nikSiswa) continue;

                // Check if already exists
                const [existing] = await connection.query('SELECT id FROM datasiswa WHERE nik_siswa = ?', [nikSiswa]);
                if (existing.length > 0) continue;

                const newUuid = uuidv4();
                let tglLahir = row[7];
                if (typeof tglLahir === 'number') {
                    const date = new Date((tglLahir - 25569) * 86400 * 1000);
                    tglLahir = date.toISOString().split('T')[0];
                } else if (typeof tglLahir === 'string') {
                    if (tglLahir.includes('/')) {
                        const parts = tglLahir.split('/');
                        if (parts.length === 3) tglLahir = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    } else if (tglLahir.includes('-')) {
                        const parts = tglLahir.split('-');
                        if (parts.length === 3 && parts[0].length !== 4) tglLahir = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                }

                await connection.query(`
                    INSERT INTO datasiswa (
                        uuid, nama, kelas, nik_siswa, nisn, tempat_lahir, tanggal_lahir,
                        no_kk, nik_ayah, nama_ayah, nik_ibu, nama_ibu,
                        alamat, rt, rw, kelurahan, kecamatan, kota, provinsi,
                        dtks, desil, program_bantuan, status_pencairan
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    newUuid, row[1], row[2], nikSiswa, row[5] ? row[5].toString() : null,
                    row[6], tglLahir, row[9] ? row[9].toString() : null,
                    row[18] ? row[18].toString() : null, row[19],
                    row[21] ? row[21].toString() : null, row[22],
                    row[26], row[27] ? row[27].toString() : null, row[28] ? row[28].toString() : null,
                    row[29], row[30], row[31], row[32],
                    row[34], row[35], row[40], row[42]
                ]);
                importedCount++;
            }
            console.log(`       ✓ ${importedCount} data siswa berhasil diimport!`);
        } catch (excelError) {
            console.log('       ℹ File Excel tidak ditemukan atau error, skip import');
        }
        console.log('');

        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        console.log('  ✅ SETUP BERHASIL!');
        console.log('');
        console.log('  📌 Login Admin:');
        console.log('     Username: admin');
        console.log('     Password: admin123');
        console.log('');
        console.log('  📌 Siswa Login:');
        console.log('     Gunakan NIK dan Tanggal Lahir dari data Excel');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');

    } catch (error) {
        console.error('');
        console.error('  ❌ ERROR:', error.message);
        console.error('');

        if (error.code === 'ECONNREFUSED') {
            console.error('  Pastikan MySQL server sudah berjalan!');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();
