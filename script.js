// ===== Rüya Tabiri AI - Main JavaScript =====

// Sabitler
const STORAGE_KEY_API = 'ruya_tabiri_api_key';

// DOM Elementleri
const dreamForm = document.getElementById('dream-form');
const dreamInput = document.getElementById('dream-input');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const charCurrent = document.getElementById('char-current');
const newDreamBtn = document.getElementById('new-dream-btn');

// ===== API İşlemleri =====

function getApiKey() {
    return localStorage.getItem(STORAGE_KEY_API) || '';
}

function saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
        localStorage.setItem(STORAGE_KEY_API, key);
        closeApiModal();
        alert('API anahtarı kaydedildi!');
    }
}

// Detaylı rüya yorumu oluştur (API olmadan)
function generateDemoInterpretation(dream) {
    // Rüyadaki anahtar kelimeleri analiz et
    const dreamLower = dream.toLowerCase();
    
    // Sembol analizi
    const symbols = [];
    
    // Su ile ilgili semboller
    if (dreamLower.includes('su') || dreamLower.includes('deniz') || dreamLower.includes('okyanus') || dreamLower.includes('nehir') || dreamLower.includes('göl')) {
        symbols.push({
            symbol: '💧 Su',
            meaning: 'Su, bilinçaltınızı ve duygusal dünyanızı temsil eder. Berrak su iç huzuru, bulanık su ise çözülmemiş duygusal meseleleri simgeler.',
            psychology: 'Carl Jung\'a göre su, kolektif bilinçdışının ve derin duyguların arketipidir.',
            advice: 'Duygularınızı bastırmak yerine onları kabul edin ve ifade edin.'
        });
    }
    
    // Uçmak
    if (dreamLower.includes('uç') || dreamLower.includes('kanat') || dreamLower.includes('gökyüzü')) {
        symbols.push({
            symbol: '🦅 Uçmak',
            meaning: 'Uçmak, özgürlük arzunuzu ve sınırlarınızı aşma isteğinizi yansıtır. Yükseklere çıkmak hedeflerinize ulaşma kararlılığınızı gösterir.',
            psychology: 'Psikolojik açıdan uçuş rüyaları, kontrol ihtiyacı ve güçlenme hissiyle ilişkilidir.',
            advice: 'Kendinize güvenin, hedeflerinize ulaşma gücünüz var.'
        });
    }
    
    // Ev, bina
    if (dreamLower.includes('ev') || dreamLower.includes('bina') || dreamLower.includes('oda') || dreamLower.includes('kapı')) {
        symbols.push({
            symbol: '🏠 Ev/Bina',
            meaning: 'Ev, iç dünyanızı ve kişiliğinizin farklı yönlerini temsil eder. Farklı odalar, bilinçaltınızın farklı bölümlerini simgeler.',
            psychology: 'Ev rüyaları genellikle kendinizle ilgili düşüncelerinizi ve güvenlik ihtiyacınızı yansıtır.',
            advice: 'İç huzurunuzu ve güvenli alanınızı güçlendirmeye odaklanın.'
        });
    }
    
    // Hayvanlar
    if (dreamLower.includes('köpek') || dreamLower.includes('kedi') || dreamLower.includes('kuş') || dreamLower.includes('yılan') || dreamLower.includes('at')) {
        symbols.push({
            symbol: '🐾 Hayvanlar',
            meaning: 'Hayvanlar, içgüdüsel yanımızı ve bastırılmış duygularımızı temsil eder. Her hayvanın kendine özgü sembolik anlamı vardır.',
            psychology: 'Hayvan arketipleri, ilkel benliğimiz ve doğayla olan bağımızı simgeler.',
            advice: 'İçgüdülerinize kulak verin, onlar sizi doğru yöne yönlendirebilir.'
        });
    }
    
    // Düşmek
    if (dreamLower.includes('düş') || dreamLower.includes('kayıp') || dreamLower.includes('boşluk')) {
        symbols.push({
            symbol: '⬇️ Düşmek',
            meaning: 'Düşme rüyaları, kontrol kaybı korkusunu ve güvensizlik hissini yansıtır. Hayattaki belirsizliklerle başa çıkma sürecinizi gösterir.',
            psychology: 'Bu rüyalar genellikle stres dönemlerinde veya büyük değişiklikler öncesinde görülür.',
            advice: 'Endişelerinizi not edin ve üzerinde çalışın. Destek sistemlerinizi güçlendirin.'
        });
    }
    
    // Ölüm
    if (dreamLower.includes('ölüm') || dreamLower.includes('cenaze') || dreamLower.includes('mezar')) {
        symbols.push({
            symbol: '🔄 Ölüm/Dönüşüm',
            meaning: 'Rüyalarda ölüm genellikle bir sonun değil, dönüşümün ve yeni başlangıçların habercisidir. Eski alışkanlıklardan veya durumlardan kurtulmayı simgeler.',
            psychology: 'Psikanalitik yaklaşıma göre bu rüyalar, ego\'nun yeniden yapılanması sürecini gösterir.',
            advice: 'Değişime açık olun, bitişler yeni başlangıçların kapısını açar.'
        });
    }
    
    // Para, altın
    if (dreamLower.includes('para') || dreamLower.includes('altın') || dreamLower.includes('hazine') || dreamLower.includes('zengin')) {
        symbols.push({
            symbol: '💰 Para/Zenginlik',
            meaning: 'Para sembolleri, öz değerinizi ve başarı algınızı temsil eder. Maddi kazançtan çok, duygusal zenginliğe işaret eder.',
            psychology: 'Bu rüyalar genellikle güvenlik ihtiyacı ve tanınma arzusuyla bağlantılıdır.',
            advice: 'Değerinizi sadece maddi ölçütlerle değerlendirmeyin, iç zenginliğinize odaklanın.'
        });
    }
    
    // Koşmak, kaçmak
    if (dreamLower.includes('koş') || dreamLower.includes('kaç') || dreamLower.includes('takip')) {
        symbols.push({
            symbol: '🏃 Koşmak/Kaçmak',
            meaning: 'Kovalanma veya kaçma rüyaları, kaçındığınız durumları veya yüzleşmekten korktuğunuz duyguları temsil eder.',
            psychology: 'Bu rüyalar stres ve kaygı belirtisi olabilir. Bilinçaltınız sizi bir konuyla yüzleşmeye davet ediyor.',
            advice: 'Korktuğunuz veya ertelediğiniz konularla yüzleşme zamanı gelmiş olabilir.'
        });
    }

    // Aile üyeleri
    if (dreamLower.includes('anne') || dreamLower.includes('baba') || dreamLower.includes('kardeş') || dreamLower.includes('aile')) {
        symbols.push({
            symbol: '👨‍👩‍👧 Aile',
            meaning: 'Aile üyelerini görmek, onlarla ilişkinizi veya onların temsil ettiği değerleri yansıtır. Anne şefkat ve koruma, baba otorite ve rehberlik simgesidir.',
            psychology: 'Aile rüyaları genellikle çözülmemiş aile dinamiklerini veya çocukluk anılarını işler.',
            advice: 'Aile ilişkilerinizi gözden geçirin, gerekirse iyileştirme için adımlar atın.'
        });
    }

    // Yol, yolculuk
    if (dreamLower.includes('yol') || dreamLower.includes('araba') || dreamLower.includes('yolculuk') || dreamLower.includes('tren')) {
        symbols.push({
            symbol: '🛤️ Yol/Yolculuk',
            meaning: 'Yolculuk rüyaları, hayat yolculuğunuzu ve varoluşsal arayışınızı simgeler. Yolun durumu, hayatınızdaki akışı yansıtır.',
            psychology: 'Bu rüyalar kişisel gelişim ve hedeflere ulaşma sürecinizle ilgilidir.',
            advice: 'Hayat yolculuğunuzda nerede olduğunuzu değerlendirin ve hedeflerinizi netleştirin.'
        });
    }
    
    // Eğer hiç sembol bulunamadıysa genel bir analiz ekle
    if (symbols.length === 0) {
        symbols.push({
            symbol: '🌌 Genel Bilinçaltı',
            meaning: 'Rüyanız, günlük yaşamınızdaki deneyimlerin ve duyguların bilinçaltı tarafından işlendiğini gösteriyor.',
            psychology: 'Her rüya, zihnin gün içinde yaşananları düzenlemesi ve duygusal dengeyi sağlaması sürecidir.',
            advice: 'Rüyanızdaki duyguları ve detayları not alın, zamanla daha net anlamlar ortaya çıkabilir.'
        });
    }
    
    // Detaylı yorum oluştur
    let interpretation = `🌟 **DETAYLI RÜYA ANALİZİ**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Rüyanızın Özeti:**
Anlattığınız rüyada ${symbols.length} temel sembol tespit edildi. Bu semboller, bilinçaltınızın size iletmek istediği mesajları taşıyor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔮 **SEMBOL ANALİZLERİ:**

`;

    symbols.forEach((s, index) => {
        interpretation += `**${index + 1}. ${s.symbol}**

📖 *Geleneksel Yorum:*
${s.meaning}

🧠 *Psikolojik Perspektif:*
${s.psychology}

💡 *Tavsiye:*
${s.advice}

`;
    });

    interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **GENEL DEĞERLENDİRME:**

Bu rüya, bilinçaltınızın aktif bir şekilde çalıştığını ve size önemli mesajlar iletmeye çalıştığını gösteriyor. Rüyanızdaki semboller, hem geleneksel Türk rüya tabiri geleneğine hem de modern psikolojiye göre değerlendirildiğinde, iç dünyanızda önemli süreçlerin yaşandığına işaret ediyor.

🌙 **SONUÇ VE TAVSİYELER:**

• Rüyanızı bir günlüğe not almayı düşünebilirsiniz
• Tekrar eden temalar varsa bunlara özel dikkat gösterin
• Rüyadaki duygularınızı hatırlamaya çalışın - bunlar genellikle en önemli ipuçlarıdır
• Meditasyon ve öz-farkındalık çalışmaları, rüyalarınızı daha iyi anlamanıza yardımcı olabilir

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *Bu yorum, binlerce yıllık rüya tabiri geleneği ile modern psikoloji birleştirilerek yapay zeka tarafından oluşturulmuştur.*`;

    return interpretation;
}

// ChatGPT API ile detaylı rüya yorumu al
async function interpretDream(dream) {
    const apiKey = getApiKey();
    
    // API anahtarı yoksa demo modu
    if (!apiKey) {
        // 2-4 saniye beklet (gerçekçi görünsün)
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        return generateDemoInterpretation(dream);
    }
    
    const systemPrompt = `Sen son derece deneyimli ve bilgili bir rüya tabircisisin. Türk kültürü, İslami gelenek ve dünya rüya yorumlama tarihine hakimsin. Ayrıca Carl Jung, Sigmund Freud ve modern psikolojinin rüya analizi yöntemlerini de derinlemesine biliyorsun.

Görevin: Kullanıcının anlattığı rüyayı ÇOK DETAYLI bir şekilde yorumlamak.

Yanıtını şu formatta oluştur:

🌟 **DETAYLI RÜYA ANALİZİ**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Rüyanızın Özeti:**
(Rüyanın kısa bir özetini yaz)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔮 **SEMBOL ANALİZLERİ:**

Her sembol için:
- 📖 Geleneksel Yorum (Türk kültürü ve İslami gelenek)
- 🧠 Psikolojik Perspektif (Jung/Freud yaklaşımı)
- 💡 Kişisel Tavsiye

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **GENEL DEĞERLENDİRME:**
(Rüyanın bütünsel analizi - tüm sembollerin birlikte ne anlama geldiği)

🌙 **SONUÇ VE TAVSİYELER:**
(En az 4-5 madde halinde pratik tavsiyeler)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dikkat edilecekler:
- Çok detaylı ve uzun bir yorum yap (en az 500 kelime)
- Her sembolü ayrı ayrı analiz et
- Hem geleneksel hem modern perspektif sun
- Olumlu ve yapıcı bir dil kullan
- Korkutucu yorumlardan kaçın, olumsuz sembolleri bile umut verici şekilde yorumla
- Emoji kullanarak görsel zenginlik kat
- Türkçe ve samimi bir dil kullan`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Rüyam: ${dream}` }
                ],
                max_tokens: 2000,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            throw new Error('API hatası');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API Hatası:', error);
        // Hata durumunda demo moduna geç
        return generateDemoInterpretation(dream);
    }
}

// ===== Form İşlemleri =====

function showLoading() {
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-icon').style.display = 'none';
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
}

function hideLoading() {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-icon').style.display = 'inline';
    submitBtn.querySelector('.btn-text').style.display = 'inline';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
}

function showResult(interpretation) {
    resultContainer.style.display = 'block';
    // Markdown benzeri formatlamayı HTML'e çevir
    const formattedContent = interpretation
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    resultContent.innerHTML = formattedContent;
    dreamForm.style.display = 'none';
    
    // Sonuca scroll
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    resultContainer.style.display = 'none';
    dreamInput.value = '';
    charCurrent.textContent = '0';
    dreamForm.style.display = 'block';
}

// ===== Modal İşlemleri =====

function showApiModal() {
    document.getElementById('api-modal').style.display = 'flex';
}

function closeApiModal() {
    document.getElementById('api-modal').style.display = 'none';
}

// ===== Event Listeners =====

// Form gönderimi
dreamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dream = dreamInput.value.trim();
    if (!dream) {
        alert('Lütfen rüyanızı yazın.');
        return;
    }
    
    if (dream.length < 20) {
        alert('Lütfen rüyanızı daha detaylı anlatın (en az 20 karakter).');
        return;
    }
    
    showLoading();
    
    try {
        const interpretation = await interpretDream(dream);
        showResult(interpretation);
    } catch (error) {
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        console.error(error);
    } finally {
        hideLoading();
    }
});

// Karakter sayacı
dreamInput.addEventListener('input', () => {
    charCurrent.textContent = dreamInput.value.length;
});

// Yeni rüya butonu
newDreamBtn.addEventListener('click', resetForm);

// Modal dışına tıklama
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Klavye kısayolu - API modal (Ctrl + Shift + A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        showApiModal();
    }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Global fonksiyonları window'a ekle
window.showApiModal = showApiModal;
window.closeApiModal = closeApiModal;
window.saveApiKey = saveApiKey;
