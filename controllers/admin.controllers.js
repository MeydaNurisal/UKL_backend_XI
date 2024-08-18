const adminModel = require('../models/index').Admin
// Mengimpor model Admin dari file models/index.js
const md5 = require('md5')
// Mengimpor library md5 untuk hashing password
const jwt = require('jsonwebtoken')
// Mengimpor library jsonwebtoken untuk pembuatan token JWT
const secret = "mokleters"; // Secret key Anda
// Mendefinisikan secret key untuk penandatanganan token

// Fungsi untuk menambahkan admin baru ke dalam sistem
exports.addAdmin = (request, response) => {
    // Membuat objek baru untuk admin dengan data dari permintaan
    let newAdmin = {
        name: request.body.name,
        email: request.body.email,
        // Meng-hash password sebelum disimpan ke dalam database
        password: md5(request.body.password),
    }
    // Memanggil fungsi create() pada model admin untuk menambahkan admin baru
    adminModel.create(newAdmin)
        .then(result => {
            // Setelah admin berhasil ditambahkan, kita buat token untuk admin tersebut
            const adminToken = generateToken(result);
// Mengirim respons dengan informasi admin baru, pesan sukses, dan token JWT
            return response.json({
                success: true,
                data: result,
                message: 'New admin has been inserted',
                token: adminToken // Menambahkan token ke respons
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// Fungsi untuk menghasilkan token berdasarkan data admin
const generateToken = (adminData) => {
    // Konversi data admin menjadi payload yang dapat digunakan untuk token
    const payload = {
        id: adminData.id,
        email: adminData.email
        // Anda bisa menambahkan informasi tambahan di sini jika diperlukan
    };

    // Menghasilkan token menggunakan payload dan secret key
    const token = jwt.sign(payload, secret);
    return token;
};
