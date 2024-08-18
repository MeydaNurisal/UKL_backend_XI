// Mengimpor model Coffee dari file models/index.js
const coffeeModel = require('../models/index').Coffee;

// Mengimpor Operation dari Sequelize untuk digunakan dalam operasi pencarian
const Op = require('sequelize').Op;

// Mengimpor library 'path' dan 'filestream' untuk operasi terkait file
const path = require('path');
const fs = require('fs');

// Fungsi untuk mengambil semua data kopi dari database
exports.getAllCoffee = async (request, response) => {
    // Memanggil fungsi findAll() untuk mendapatkan semua data kopi
    let coffees = await coffeeModel.findAll()
    return response.json({
        success: true,
        data: coffees,
        message: 'Coffee has retrieved'
    })
}

// Fungsi untuk mencari data kopi berdasarkan kata kunci
exports.findCoffee = async (request, response) => {
    // Mendefinisikan kata kunci untuk pencarian data
    let keyword = request.params.key

    // Memanggil findAll() dengan klausa where dan operation untuk mencari data berdasarkan kata kunci
    let coffee = await coffeeModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword } },
                { size: { [Op.substring]: keyword } },
                { price: { [Op.substring]: keyword } }
            ]
        }
    })

    // Mengirim respons dengan data kopi yang ditemukan
    return response.json({
        success: true,
        data: coffee,
        message: 'Coffee has retrieved'
    })
}

// Fungsi untuk menambahkan data kopi baru ke dalam database
const upload = require('./upload-image').single('image')
exports.addCoffee = (request, response) => {
    // Jalankan fungsi upload gambar kopi
    upload(request, response, async (error) => {
        // Periksa apakah terjadi error saat upload
        if (error) {
            return response.json({ message: error });
        }

        // Periksa apakah tidak ada file yang diunggah
        if (!request.file) {
            return response.json({ message: 'Tidak ada yang diunggah' });
        }

        // Persiapkan data dari permintaan untuk kopi baru
        let newCoffee = {
            name: request.body.name,
            size: request.body.size,
            price: request.body.price,
            image: request.file.filename
        };

        // Jalankan proses penyisipan data ke dalam tabel kopi
        coffeeModel.create(newCoffee)
            .then((result) => {
                // Jika proses penyisipan berhasil, kirim respons sukses
                return response.json({
                    success: true,
                    data: result,
                    message: 'Coffee has created'
                });
            })
            .catch((error) => {
                // Jika proses penyisipan gagal, kirim pesan error dalam respons
                return response.json({
                    status: false,
                    message: error.message
                });
            });
    });
};

// Fungsi untuk memperbarui data kopi yang ada dalam database
exports.updateCoffee = async (request, response) => {
    // Jalankan fungsi upload gambar kopi
    upload(request, response, async error => {
        // Periksa apakah terjadi error saat upload
        if (error) {
            return response.json({ success: false, message: error });
        }

        // Simpan ID kopi yang dipilih untuk diperbarui
        let id = request.params.id;

        // Persiapkan data kopi yang akan diperbarui
        let dataCoffee = {
            name: request.body.name,
            size: request.body.size,
            price: request.body.price,
        };

        // Periksa apakah file tidak kosong, yang berarti data akan diperbarui dengan file yang diunggah ulang
        if (request.file) {
            // Dapatkan data kopi yang dipilih
            const selectedCoffee = await coffeeModel.findOne({
                where: { id: id }
            });

            // Dapatkan nama file lama dari gambar
            const oldImage = selectedCoffee.image;
            // Persiapkan path dari gambar lama untuk menghapus file
            const pathImage = path.join(__dirname, '../image', oldImage);

            // Periksa keberadaan file
            if (fs.existsSync(pathImage)) {
                // Hapus file gambar lama
                fs.unlink(pathImage, error => console.log(error));
            }

            // Tambahkan nama file gambar baru ke objek kopi
            dataCoffee.image = request.file.filename;
        }

        // Jalankan proses pembaruan data berdasarkan ID kopi yang ditentukan
        coffeeModel.update(dataCoffee, {
            where: { id: id }
        })
            .then(async () => {
                // Jika proses pembaruan berhasil, ambil data kopi yang diperbarui
                const updatedCoffee = await coffeeModel.findByPk(id);
                return response.json({
                    success: true,
                    data: updatedCoffee,
                    message: 'Coffee has been updated'
                });
            })
            .catch(error => {
                // Jika proses pembaruan gagal, kirim pesan error dalam respons
                return response.json({
                    success: false,
                    message: error.message
                });
            });
    });
};

// Fungsi untuk menghapus data kopi dari database
exports.deleteCoffee = async (request, response) => {
    // Simpan ID kopi yang dipilih untuk dihapus
    const coffeeID = request.params.id

    // -- Hapus file gambar -- 
    // Dapatkan data kopi yang dipilih
    const coffee = await coffeeModel.findOne({ where: { id: coffeeID } })

    // Dapatkan nama file lama dari gambar
    const oldImage = coffee.image

    // Persiapkan path dari gambar lama untuk menghapus file
    const pathImage = path.join(__dirname, '../image', oldImage)

    // Periksa keberadaan file
    if (fs.existsSync(pathImage)) {
        // Hapus file gambar lama
        fs.unlink(pathImage, error => console.log(error))
    }
    // -- Akhir penghapusan file gambar -- 

    // Jalankan proses penghapusan data berdasarkan ID kopi yang ditentukan
    coffeeModel.destroy({ where: { id: coffeeID } })
        .then(result => {
            // Jika proses penghapusan berhasil, kirim pesan sukses dalam respons
            return response.json({
                success: true,
                message: 'Data event has been deleted'
            })
        })
        .catch(error => {
            // Jika proses penghapusan gagal, kirim pesan error dalam respons
            return response.json({
                success: false,
                message: error.message
            })
        })
}
