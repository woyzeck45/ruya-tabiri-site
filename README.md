# 🌙 Rüya Tabiri AI

Yapay zeka destekli rüya yorumlama web uygulaması. Türk halkının falı, burçları ve rüyaları sevmesinden yola çıkarak tasarlanmış, kullanıcı dostu bir arayüz.

![Rüya Tabiri AI](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Özellikler

- **🤖 Yapay Zeka Destekli Yorumlama**: ChatGPT API entegrasyonu ile akıllı rüya yorumları
- **🎁 Günlük Ücretsiz Haklar**: Her gün 3 ücretsiz yorum hakkı
- **💎 Premium Üyelik**: Sınırsız yorum için iyzico ödeme sistemi
- **💳 Güvenli Ödeme**: iyzico altyapısı ile kredi kartı/banka kartı ödemesi
- **📱 Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **🌌 Mistik Tasarım**: Yıldızlı arka plan ve modern UI
- **🔒 Gizlilik**: Rüyalar sunucuda saklanmaz

## 🚀 Hızlı Başlangıç

### 1. Dosyaları İndirin

```bash
git clone <repo-url>
cd ruya-tabiri-ai
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

### 3. iyzico Hesabı Açın ve API Anahtarı Alın

1. [iyzico Merchant Panel](https://merchant.iyzipay.com) adresine gidin
2. "Üye Ol" butonuna tıklayın
3. Şirket/bireysel bilgilerinizi girin
4. Hesabınız onaylandıktan sonra:
   - Panel → Ayarlar → API Anahtarları
   - **API Key** ve **Secret Key** değerlerini kopyalayın

### 4. Ortam Değişkenlerini Ayarlayın

`backend` klasöründe `.env` dosyası oluşturun:

```env
# TEST (Sandbox) - Geliştirme için
IYZICO_API_KEY=sandbox-xxxxxxxxxxxx
IYZICO_SECRET_KEY=sandbox-xxxxxxxxxxxx
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Sunucu Ayarları
PORT=3000
FRONTEND_URL=http://127.0.0.1:5500

# Callback URL (ödeme sonrası dönüş)
CALLBACK_URL=http://localhost:3000/api/payment/callback
```

### 5. Backend'i Başlatın

```bash
npm start
```

### 6. Frontend'i Açın

`index.html` dosyasını tarayıcıda açın veya VS Code Live Server kullanın.

## 💰 Para Nasıl Banka Hesabınıza Geçer?

### iyzico ile Ödeme Alma Süreci:

1. **Kullanıcı Ödeme Yapar** → Kredi kartı/banka kartı ile
2. **iyzico Parayı Alır** → Güvenli ödeme işlemi
3. **Onay Süreci** → iyzico parayı tutar (1-2 iş günü)
4. **Hesabınıza Transfer** → Tanımladığınız banka hesabına otomatik aktarım

### iyzico Panel'de Yapmanız Gerekenler:

1. **Banka Hesabı Tanımlama**:
   - Panel → Ayarlar → Banka Hesapları
   - IBAN ve hesap bilgilerinizi girin

2. **Ödeme Ayarları**:
   - Otomatik transfer periyodu seçin (günlük/haftalık)
   - Minimum transfer tutarı belirleyin

3. **Komisyon Oranları** (yaklaşık):
   - Kredi Kartı: %2.49 + 0.25 TL
   - Banka Kartı: %1.79 + 0.25 TL

## 📁 Proje Yapısı

```
ruya-tabiri-ai/
├── index.html          # Ana sayfa
├── odeme.html          # Ödeme sayfası
├── odeme-sonuc.html    # Ödeme sonuç sayfası
├── style.css           # Stiller
├── script.js           # Frontend JavaScript
├── README.md           # Dokümantasyon
└── backend/
    ├── server.js       # Express API sunucusu
    ├── package.json    # Node.js bağımlılıkları
    └── env-example.txt # Örnek .env dosyası
```

## 🔧 Production'a Geçiş

### 1. iyzico Canlı API Anahtarları

```env
# .env dosyasında değiştirin:
IYZICO_API_KEY=your-live-api-key
IYZICO_SECRET_KEY=your-live-secret-key
IYZICO_BASE_URL=https://api.iyzipay.com
```

### 2. Domain Ayarları

```env
FRONTEND_URL=https://your-domain.com
CALLBACK_URL=https://your-domain.com/api/payment/callback
```

### 3. Hosting Önerileri

**Frontend (Statik Dosyalar):**
- Netlify (Ücretsiz)
- Vercel (Ücretsiz)
- GitHub Pages (Ücretsiz)

**Backend (Node.js):**
- Railway (Ücretsiz tier)
- Render (Ücretsiz tier)
- DigitalOcean ($5/ay)
- Heroku

### 4. SSL Sertifikası

iyzico canlı ortam için **HTTPS zorunludur**. Hosting servislerinin çoğu ücretsiz SSL sağlar.

## 💳 Ödeme Paketleri

| Paket | Fiyat | Özellikler |
|-------|-------|------------|
| 10 Kredi | ₺19.99 | Tek seferlik, süresiz |
| Aylık Premium | ₺29.99/ay | Sınırsız yorum |
| Yıllık Premium | ₺249.99/yıl | %30 indirim |

## 🛠️ API Endpoints

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/packages` | GET | Paket bilgileri |
| `/api/payment/create` | POST | Ödeme başlat |
| `/api/payment/callback` | POST | iyzico callback |
| `/api/payment/check/:token` | GET | Ödeme durumu |

## 🔐 Güvenlik Notları

- API anahtarları `.env` dosyasında tutulur
- `.env` dosyasını asla git'e eklemeyin
- Production'da HTTPS kullanın
- iyzico webhook signature'ları doğrulayın

## 📱 Test Kartları (Sandbox)

| Kart No | Son Kullanma | CVV |
|---------|--------------|-----|
| 5528790000000008 | 12/30 | 123 |
| 4766620000000001 | 12/30 | 123 |
| 5406670000000009 | 12/30 | 123 |

## 🤝 Destek

- iyzico Teknik Destek: entegrasyon@iyzico.com
- iyzico Dokümantasyon: https://dev.iyzipay.com

## 📄 Lisans

MIT License

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
