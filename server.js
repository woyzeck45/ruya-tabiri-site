/**
 * Rüya Tabiri AI - Backend Server
 * iyzico ödeme entegrasyonu
 */

const express = require('express');
const cors = require('cors');
const Iyzipay = require('iyzipay');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// iyzico yapılandırması
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'sandbox-api-key',
    secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-secret-key',
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

// Paket bilgileri
const packages = {
    'credit10': {
        id: 'credit10',
        name: '10 Kredi Paketi',
        price: '19.99',
        description: '10 rüya yorumu hakkı'
    },
    'monthly': {
        id: 'monthly',
        name: 'Aylık Premium',
        price: '29.99',
        description: 'Aylık sınırsız rüya yorumu'
    },
    'yearly': {
        id: 'yearly',
        name: 'Yıllık Premium',
        price: '249.99',
        description: 'Yıllık sınırsız rüya yorumu'
    }
};

// Geçici ödeme kayıtları (production'da veritabanı kullanın)
const paymentRecords = new Map();

// ===== API ENDPOINTS =====

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        message: 'Rüya Tabiri AI - Payment API',
        version: '1.0.0',
        endpoints: {
            packages: 'GET /api/packages',
            createPayment: 'POST /api/payment/create',
            paymentCallback: 'POST /api/payment/callback',
            checkPayment: 'GET /api/payment/check/:token'
        }
    });
});

// Paket listesi
app.get('/api/packages', (req, res) => {
    res.json({
        success: true,
        packages: Object.values(packages)
    });
});

// Ödeme başlatma
app.post('/api/payment/create', async (req, res) => {
    try {
        const {
            package: pkg,
            cardName,
            cardNumber,
            cardExpiry,
            cardCvv,
            email,
            phone
        } = req.body;

        // Paket kontrolü
        const selectedPackage = packages[pkg.id];
        if (!selectedPackage) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz paket seçimi'
            });
        }

        // Son kullanma tarihi parse
        const [expireMonth, expireYear] = cardExpiry.split('/');

        // Benzersiz sipariş ID'si
        const conversationId = uuidv4();
        const basketId = 'B' + Date.now();

        // iyzico ödeme isteği
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: conversationId,
            price: selectedPackage.price,
            paidPrice: selectedPackage.price,
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: basketId,
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard: {
                cardHolderName: cardName,
                cardNumber: cardNumber,
                expireMonth: expireMonth,
                expireYear: '20' + expireYear,
                cvc: cardCvv,
                registerCard: '0'
            },
            buyer: {
                id: 'BY' + Date.now(),
                name: cardName.split(' ')[0] || 'Ad',
                surname: cardName.split(' ').slice(1).join(' ') || 'Soyad',
                gsmNumber: '+90' + phone.replace(/\D/g, '').slice(-10),
                email: email,
                identityNumber: '11111111111', // TC kimlik (test için)
                registrationAddress: 'Türkiye',
                ip: req.ip || '127.0.0.1',
                city: 'Istanbul',
                country: 'Turkey'
            },
            shippingAddress: {
                contactName: cardName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Türkiye'
            },
            billingAddress: {
                contactName: cardName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Türkiye'
            },
            basketItems: [
                {
                    id: selectedPackage.id,
                    name: selectedPackage.name,
                    category1: 'Premium Üyelik',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: selectedPackage.price
                }
            ]
        };

        // iyzico'ya ödeme isteği gönder
        iyzipay.payment.create(request, function(err, result) {
            if (err) {
                console.error('iyzico Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Ödeme işlemi başlatılamadı',
                    error: err.message
                });
            }

            console.log('iyzico Response:', result);

            if (result.status === 'success') {
                // Ödeme başarılı
                paymentRecords.set(conversationId, {
                    packageId: selectedPackage.id,
                    email: email,
                    amount: selectedPackage.price,
                    status: 'completed',
                    paymentId: result.paymentId,
                    createdAt: new Date()
                });

                return res.json({
                    success: true,
                    message: 'Ödeme başarılı',
                    paymentId: result.paymentId,
                    conversationId: conversationId
                });
            } else {
                // Ödeme başarısız
                return res.json({
                    success: false,
                    message: result.errorMessage || 'Ödeme başarısız',
                    errorCode: result.errorCode
                });
            }
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// 3D Secure callback (opsiyonel - 3D ödeme için)
app.post('/api/payment/callback', (req, res) => {
    const { token } = req.body;

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: token,
        paymentId: req.body.paymentId
    };

    iyzipay.threedsPayment.create(request, function(err, result) {
        if (err || result.status !== 'success') {
            return res.redirect(process.env.FRONTEND_URL + '/odeme-sonuc.html?status=failed');
        }

        return res.redirect(process.env.FRONTEND_URL + '/odeme-sonuc.html?status=success&package=' + result.basketItems[0].id);
    });
});

// Ödeme durumu kontrol
app.get('/api/payment/check/:token', (req, res) => {
    const { token } = req.params;
    const record = paymentRecords.get(token);

    if (!record) {
        return res.status(404).json({
            success: false,
            message: 'Ödeme kaydı bulunamadı'
        });
    }

    res.json({
        success: true,
        payment: record
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🌙 Rüya Tabiri AI - Payment Server                       ║
║                                                            ║
║   Server running on: http://localhost:${PORT}                ║
║   Mode: ${process.env.NODE_ENV || 'development'}                                  ║
║                                                            ║
║   Endpoints:                                               ║
║   - GET  /api/packages          - Paket listesi            ║
║   - POST /api/payment/create    - Ödeme başlat             ║
║   - POST /api/payment/callback  - iyzico callback          ║
║   - GET  /api/payment/check/:id - Ödeme durumu             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
