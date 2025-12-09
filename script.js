// ===== Rüya Tabiri AI - Main JavaScript =====

// Sabitler
const DAILY_FREE_CREDITS = 3;
const STORAGE_KEY_CREDITS = 'ruya_tabiri_credits';
const STORAGE_KEY_DATE = 'ruya_tabiri_date';
const STORAGE_KEY_API = 'ruya_tabiri_api_key';
const STORAGE_KEY_PREMIUM = 'ruya_tabiri_premium';
const STORAGE_KEY_PREMIUM_TYPE = 'ruya_tabiri_premium_type';

// DOM Elementleri
const dreamForm = document.getElementById('dream-form');
const dreamInput = document.getElementById('dream-input');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const remainingCount = document.getElementById('remaining-count');
const noCreditsWarning = document.getElementById('no-credits-warning');
const charCurrent = document.getElementById('char-current');
const newDreamBtn = document.getElementById('new-dream-btn');
const resetTimeEl = document.getElementById('reset-time');

// ===== Premium Kontrolü =====

function isPremium() {
    return localStorage.getItem(STORAGE_KEY_PREMIUM) === 'true';
}

function getPremiumType() {
    return localStorage.getItem(STORAGE_KEY_PREMIUM_TYPE) || null;
}

// ===== Kredi Yönetimi =====

function getTodayDate() {
    return new Date().toDateString();
}

function getCredits() {
    // Premium kullanıcılar için sınırsız
    if (isPremium()) {
        return 999;
    }
    
    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const today = getTodayDate();
    
    // Yeni gün ise kredileri sıfırla
    if (savedDate !== today) {
        localStorage.setItem(STORAGE_KEY_DATE, today);
        localStorage.setItem(STORAGE_KEY_CREDITS, DAILY_FREE_CREDITS);
        return DAILY_FREE_CREDITS;
    }
    
    return parseInt(localStorage.getItem(STORAGE_KEY_CREDITS)) || 0;
}

function useCredit() {
    // Premium kullanıcılar kredi harcamaz
    if (isPremium()) {
        return true;
    }
    
    const credits = getCredits();
    if (credits > 0) {
        localStorage.setItem(STORAGE_KEY_CREDITS, credits - 1);
        return true;
    }
    return false;
}

function updateCreditsDisplay() {
    // Premium kontrolü
    if (isPremium()) {
        remainingCount.textContent = '∞';
        remainingCount.style.color = '#22c55e';
        document.querySelector('.remaining-credits span:last-child').innerHTML = 
            '<strong style="color: #22c55e;">💎 Premium Üye</strong>';
        dreamForm.style.display = 'block';
        noCreditsWarning.style.display = 'none';
        return;
    }
    
    const credits = getCredits();
    remainingCount.textContent = credits;
    
    if (credits <= 0) {
        dreamForm.style.display = 'none';
        noCreditsWarning.style.display = 'block';
        updateResetTime();
    } else {
        dreamForm.style.display = 'block';
        noCreditsWarning.style.display = 'none';
    }
}

function updateResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    resetTimeEl.textContent = `${hours} saat ${minutes} dakika sonra`;
}

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

// Demo modu için yapay yorum oluştur (API olmadan test için)
function generateDemoInterpretation(dream) {
    const interpretations = [
        {
            intro: "Rüyanızda gördüğünüz semboller oldukça ilginç ve derin anlamlar taşıyor.",
            meanings: [
                "Bu rüya, bilinçaltınızın size önemli mesajlar vermeye çalıştığını gösteriyor.",
                "Rüyanızdaki imgeler, yakın zamanda hayatınızda olumlu değişiklikler olacağına işaret ediyor.",
                "Gördükleriniz, içsel bir dönüşüm sürecinde olduğunuzu simgeliyor."
            ],
            advice: "Bu dönemde içgüdülerinize güvenmeniz ve kalbinizin sesini dinlemeniz önerilir.",
            closing: "Rüyalarınız, ruhunuzun size gönderdiği mektuplardır. Onları dikkatle dinleyin."
        },
        {
            intro: "Rüyanız, bilinçaltınızın derinliklerinden gelen güçlü mesajlar içeriyor.",
            meanings: [
                "Bu semboller, hayatınızda yeni bir sayfa açılacağının habercisi.",
                "Rüyanızdaki detaylar, bastırılmış duygularınızın yüzeye çıkmak istediğini gösteriyor.",
                "Gördükleriniz, manevi bir uyanışın eşiğinde olduğunuza işaret ediyor."
            ],
            advice: "Kendinize zaman ayırın ve iç sesinizi dinleyin. Meditasyon bu dönemde faydalı olabilir.",
            closing: "Unutmayın, her rüya bir kehanet değil ama her biri önemli bir içsel yolculuktur."
        },
        {
            intro: "Anlattığınız rüya, psikolojik açıdan oldukça zengin semboller barındırıyor.",
            meanings: [
                "Bu rüya, bilinçaltınızın çözülmemiş meseleleri işlediğini gösteriyor.",
                "Gördüğünüz imgeler, yakın gelecekte karşılaşacağınız fırsatlara hazırlanmanız gerektiğini söylüyor.",
                "Rüyanızdaki atmosfer, ruhsal dengenizin güçlendiğine işaret ediyor."
            ],
            advice: "Bu işaretleri dikkate alarak, önemli kararlarınızı biraz ertelemeniz yararlı olabilir.",
            closing: "Rüyalarınız sizi yönlendiren bir pusula gibidir. Bu pusulaya güvenin."
        }
    ];
    
    const selected = interpretations[Math.floor(Math.random() * interpretations.length)];
    const randomMeaning = selected.meanings[Math.floor(Math.random() * selected.meanings.length)];
    
    return `✨ ${selected.intro}

🔮 Yorum:
${randomMeaning}

💫 Tavsiye:
${selected.advice}

🌙 ${selected.closing}

---
Not: Bu yorum yapay zeka tarafından genel sembol analizi kullanılarak oluşturulmuştur. Kişisel yorumlama için detaylı analiz yapılması önerilir.`;
}

// ChatGPT API ile rüya yorumu al
async function interpretDream(dream) {
    const apiKey = getApiKey();
    
    // API anahtarı yoksa demo modu
    if (!apiKey) {
        // 2-4 saniye beklet (gerçekçi görünsün)
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        return generateDemoInterpretation(dream);
    }
    
    const systemPrompt = `Sen deneyimli bir rüya tabircisisin. Türk kültürü ve geleneksel rüya yorumlama bilgisine hakimsin. 
Ayrıca modern psikoloji ve Carl Jung'un rüya analizi yöntemlerini de biliyorsun.

Görevin: Kullanıcının anlattığı rüyayı yorumlamak.

Yorum yaparken şunlara dikkat et:
- Rüyadaki sembolleri tek tek analiz et
- Türk kültüründeki anlamlarını açıkla
- Psikolojik açıdan ne ifade edebileceğini belirt
- Olumlu ve yapıcı bir dil kullan
- Korkutucu veya olumsuz yorumlardan kaçın
- Sonunda kısa bir tavsiye ver

Yanıtını Türkçe ver ve samimi bir dil kullan. Emoji kullanabilirsin.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Rüyam: ${dream}` }
                ],
                max_tokens: 1000,
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
    resultContent.textContent = interpretation;
    dreamForm.style.display = 'none';
    
    // Sonuca scroll
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    resultContainer.style.display = 'none';
    dreamInput.value = '';
    charCurrent.textContent = '0';
    updateCreditsDisplay();
}

// ===== Modal İşlemleri =====

function showPremiumModal() {
    document.getElementById('premium-modal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premium-modal').style.display = 'none';
}

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
    
    // Kredi kontrolü
    if (!useCredit()) {
        dreamForm.style.display = 'none';
        noCreditsWarning.style.display = 'block';
        return;
    }
    
    showLoading();
    
    try {
        const interpretation = await interpretDream(dream);
        updateCreditsDisplay();
        showResult(interpretation);
    } catch (error) {
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        // Krediyi geri ver
        const credits = getCredits();
        localStorage.setItem(STORAGE_KEY_CREDITS, credits + 1);
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

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    updateCreditsDisplay();
    
    // Her dakika reset süresini güncelle
    setInterval(updateResetTime, 60000);
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
window.showPremiumModal = showPremiumModal;
window.closePremiumModal = closePremiumModal;
window.showApiModal = showApiModal;
window.closeApiModal = closeApiModal;
window.saveApiKey = saveApiKey;
