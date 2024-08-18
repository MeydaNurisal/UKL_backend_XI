// Mengimpor model-model yang diperlukan dari file models/index.js dan Operation (Op) dari Sequelize
const { Coffee, OrderDetail, OrderList, sequelize } = require('../models/index');
const { Op } = require('sequelize');

// Fungsi untuk menemukan semua pesanan beserta detail pesanan yang terkait
exports.findAll = async (req, res) => {
    try {
        // Menggunakan metode findAll untuk menemukan semua daftar pesanan
        let orders = await OrderList.findAll({
            // Menggunakan include untuk menyertakan model OrderDetail dengan alias 'OrderDetails' 
            // dan model Coffee yang berhubungan dengan OrderDetail
            include: [{
                model: OrderDetail,
                as: 'OrderDetails', // Menggunakan alias yang sesuai dengan yang didefinisikan dalam asosiasi
                include: [Coffee]
            }]
        });
        // Mengirim respons JSON dengan data pesanan dan pesan sukses
        return res.json({
            success: true,
            data: orders,
            message: 'Order list has been retrieved along with order details'
        });
    } catch (error) {
        // Menangani kesalahan jika terjadi saat mencari pesanan
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fungsi untuk menambahkan pesanan baru beserta detail pesanannya
exports.addOrder = async (req, res) => {
    // Memulai transaksi menggunakan objek transaksi sequelize
    const t = await sequelize.transaction();
    try {
        console.log("Data permintaan:", req.body);

        // Mendapatkan data pelanggan, jenis pesanan, tanggal pesanan, dan detail pesanan dari permintaan
        const { customer_name, order_type, order_date, order_detail: orderDetailData } = req.body;

        // Memeriksa keberadaan data yang diperlukan
        if (!customer_name || !order_type || !order_date || !orderDetailData || !Array.isArray(orderDetailData)) {
            throw new Error("Data input tidak valid");
        }

        // Membuat daftar pesanan baru dalam transaksi
        const orderList = await OrderList.create({
            customer_name,
            order_type,
            order_date,
        }, { transaction: t });

        console.log("Daftar pesanan:", orderList);

        // Menambahkan detail pesanan ke dalam daftar pesanan yang baru dibuat
        for (const item of orderDetailData) {
            const { coffee_id, price, quantity } = item;
            console.log("Membuat detail pesanan:", item);

            // Membuat detail pesanan baru dalam transaksi
            await OrderDetail.create({
                order_id: orderList.id,
                coffee_id,
                price,
                quantity,
            }, { transaction: t });
        }

        // Melakukan commit transaksi jika tidak ada kesalahan
        await t.commit();

        // Mengirim respons JSON dengan data pesanan yang baru dibuat dan pesan sukses
        res.status(201).json({
            data: {
                id: orderList.id,
                customer_name,
                order_type,
                order_date,
            },
            message: "Pesanan berhasil dibuat",
        });
    } catch (error) {
        // Melakukan rollback transaksi jika terjadi kesalahan
        await t.rollback();
        console.error("Kesalahan saat menambahkan pesanan:", error);
        // Mengirim respons JSON dengan pesan kesalahan
        res.status(500).json({ error: "Internal server error" });
    }
};
