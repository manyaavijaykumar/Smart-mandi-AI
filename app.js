// ============================================================
// MandiPredict Karnataka — mandi.js
// Additions: All 31 Karnataka districts, 10 regional crops,
// Bilingual UI (English / ಕನ್ನಡ), Weather forecast on HOLD
// ============================================================

// ─── LANGUAGE STRINGS ────────────────────────────────────────
const API_KEYS = {
  agmarknet: "579b464db66ec23bdd0000019c845c5266eb4ff26b5dddbf60c31c1a",   // ← paste your data.gov.in API key
  openweather: "1586da3ef3a3b591fd5b9199348c2921" // ← paste your OpenWeatherMap API key
};

// ── If key is missing/placeholder, app uses realistic mock data ──
const HAS_AGMARKNET  = API_KEYS.agmarknet  !== "579b464db66ec23bdd0000019c845c5266eb4ff26b5dddbf60c31c1a"  && API_KEYS.agmarknet.length > 8;
const HAS_WEATHER    = API_KEYS.openweather !== "1586da3ef3a3b591fd5b9199348c2921" && API_KEYS.openweather.length > 8;

// ─── Agmarknet resource ID for Karnataka commodities ─────────────
const AGMARKNET_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const LANG = {
  en: {
    subtitle: "Karnataka Crop Price Forecast",
    district: "District", crop: "Crop",
    transport: "Transport Cost (₹/qt)", quantity: "Quantity (quintals)",
    predictBtn: "🔍 Predict Price",
    dataSource: "📡 Data: Agmarknet API + Mock",
    forecastEyebrow: "7-DAY FORECAST", forecastTitle: "Price Prediction",
    chartEyebrow: "HISTORICAL + FORECAST", chartTitle: "Price Trend",
    mandiEyebrow: "NEARBY MARKETS", mandiTitle: "Mandi Price Comparison",
    heroEyebrow: "KARNATAKA MANDI INTELLIGENCE",
    heroSub: "AI-powered price prediction for Karnataka farmers",
    loading: "Analyzing market data…",
    signalSell: "✅ SELL NOW", signalHold: "⏳ HOLD — Wait for better price", signalWait: "⚠️ WAIT",
    weatherTitle: "🌦 7-Day Weather Forecast & Crop Advisory",
    weatherAdviceTitle: "CROP PROTECTION ADVICE DURING HOLD PERIOD",
    metricPrice: "TODAY'S PRICE", metricNet: "NET PROFIT", metricPeak: "PEAK FORECAST", metricChange: "7D CHANGE",
    tableMarket: "Market", tableDistrict: "District", tablePrice: "Price (₹/qt)", tableDist: "Distance", tableStatus: "Status"
  },
  kn: {
    subtitle: "ಕರ್ನಾಟಕ ಬೆಳೆ ಬೆಲೆ ಮುನ್ಸೂಚನೆ",
    district: "ಜಿಲ್ಲೆ", crop: "ಬೆಳೆ",
    transport: "ಸಾಗಣೆ ವೆಚ್ಚ (₹/ಕ್ವಿ)", quantity: "ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್)",
    predictBtn: "🔍 ಬೆಲೆ ಊಹಿಸಿ",
    dataSource: "📡 ಮಾಹಿತಿ: Agmarknet + ಅಂದಾಜು",
    forecastEyebrow: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ", forecastTitle: "ಬೆಲೆ ಊಹೆ",
    chartEyebrow: "ಹಿಂದಿನ + ಮುನ್ಸೂಚನೆ", chartTitle: "ಬೆಲೆ ಪ್ರವೃತ್ತಿ",
    mandiEyebrow: "ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳು", mandiTitle: "ಮಂಡಿ ಬೆಲೆ ಹೋಲಿಕೆ",
    heroEyebrow: "ಕರ್ನಾಟಕ ಮಂಡಿ ವಿಶ್ಲೇಷಣೆ",
    heroSub: "ಕರ್ನಾಟಕ ರೈತರಿಗಾಗಿ AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ",
    loading: "ಮಾರುಕಟ್ಟೆ ದತ್ತಾಂಶ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…",
    signalSell: "✅ ಈಗ ಮಾರಿ", signalHold: "⏳ ತಡೆಹಿಡಿಯಿರಿ — ಉತ್ತಮ ಬೆಲೆಗಾಗಿ ಕಾಯಿರಿ", signalWait: "⚠️ ನಿರೀಕ್ಷಿಸಿ",
    weatherTitle: "🌦 7 ದಿನಗಳ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಸಲಹೆ",
    weatherAdviceTitle: "ತಡೆಹಿಡಿತದ ಅವಧಿಯಲ್ಲಿ ಬೆಳೆ ರಕ್ಷಣೆ ಸಲಹೆ",
    metricPrice: "ಇಂದಿನ ಬೆಲೆ", metricNet: "ನಿವ್ವಳ ಲಾಭ", metricPeak: "ಗರಿಷ್ಠ ಮುನ್ಸೂಚನೆ", metricChange: "7 ದಿನ ಬದಲಾವಣೆ",
    tableMarket: "ಮಾರುಕಟ್ಟೆ", tableDistrict: "ಜಿಲ್ಲೆ", tablePrice: "ಬೆಲೆ (₹/ಕ್ವಿ)", tableDist: "ದೂರ", tableStatus: "ಸ್ಥಿತಿ"
  }
};
let currentLang = 'en';

function t(key) { return LANG[currentLang][key] || LANG['en'][key]; }

function setLang(lang) {
  currentLang = lang;
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
  document.getElementById('langKN').classList.toggle('active', lang === 'kn');
  const isKn = lang === 'kn';
  document.querySelectorAll('.brand-title,.brand-sub,.form-label,.btn-predict,.section-title,.section-eyebrow,.hero-eyebrow,.hero-sub,.metric-label,.signal-title,.signal-conf,.signal-bullets li,.mandi-table th,.mandi-table td,.weather-title,.crop-advice-title,.crop-advice-list li,.fc-day')
    .forEach(el => el.classList.toggle('kannada', isKn));
  applyLangLabels();
}

function applyLangLabels() {
  document.getElementById('lbl-subtitle').textContent = t('subtitle');
  document.getElementById('lbl-district').textContent = t('district');
  document.getElementById('lbl-crop').textContent = t('crop');
  document.getElementById('lbl-transport').textContent = t('transport');
  document.getElementById('lbl-quantity').textContent = t('quantity');
  document.getElementById('lbl-predict-btn').textContent = t('predictBtn');
  document.getElementById('lbl-data-source').textContent = t('dataSource');
  const el = (id, key) => { const e = document.getElementById(id); if(e) e.textContent = t(key); };
  el('lbl-forecast-eyebrow','forecastEyebrow'); el('lbl-forecast-title','forecastTitle');
  el('lbl-chart-eyebrow','chartEyebrow'); el('lbl-chart-title','chartTitle');
  el('lbl-mandi-eyebrow','mandiEyebrow'); el('lbl-mandi-title','mandiTitle');
  el('heroEyebrow','heroEyebrow'); el('heroSub','heroSub');
  document.getElementById('loadingText').textContent = t('loading');
}

// ─── KARNATAKA — ALL 31 DISTRICTS ────────────────────────────
const KA_DISTRICTS = [
  { en: "Bagalkot",       kn: "ಬಾಗಲಕೋಟೆ" },
  { en: "Ballari",        kn: "ಬಳ್ಳಾರಿ" },
  { en: "Belagavi",       kn: "ಬೆಳಗಾವಿ" },
  { en: "Bengaluru Rural",kn: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ" },
  { en: "Bengaluru Urban",kn: "ಬೆಂಗಳೂರು ನಗರ" },
  { en: "Bidar",          kn: "ಬೀದರ್" },
  { en: "Chamarajanagar", kn: "ಚಾಮರಾಜನಗರ" },
  { en: "Chikkaballapur", kn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ" },
  { en: "Chikkamagaluru", kn: "ಚಿಕ್ಕಮಗಳೂರು" },
  { en: "Chitradurga",    kn: "ಚಿತ್ರದುರ್ಗ" },
  { en: "Dakshina Kannada",kn:"ದಕ್ಷಿಣ ಕನ್ನಡ" },
  { en: "Davanagere",     kn: "ದಾವಣಗೆರೆ" },
  { en: "Dharwad",        kn: "ಧಾರವಾಡ" },
  { en: "Gadag",          kn: "ಗದಗ" },
  { en: "Hassan",         kn: "ಹಾಸನ" },
  { en: "Haveri",         kn: "ಹಾವೇರಿ" },
  { en: "Kalaburagi",     kn: "ಕಲಬುರಗಿ" },
  { en: "Kodagu",         kn: "ಕೊಡಗು" },
  { en: "Kolar",          kn: "ಕೋಲಾರ" },
  { en: "Koppal",         kn: "ಕೊಪ್ಪಳ" },
  { en: "Mandya",         kn: "ಮಂಡ್ಯ" },
  { en: "Mysuru",         kn: "ಮೈಸೂರು" },
  { en: "Raichur",        kn: "ರಾಯಚೂರು" },
  { en: "Ramanagara",     kn: "ರಾಮನಗರ" },
  { en: "Shivamogga",     kn: "ಶಿವಮೊಗ್ಗ" },
  { en: "Tumakuru",       kn: "ತುಮಕೂರು" },
  { en: "Udupi",          kn: "ಉಡುಪಿ" },
  { en: "Uttara Kannada", kn: "ಉತ್ತರ ಕನ್ನಡ" },
  { en: "Vijayapura",     kn: "ವಿಜಯಪುರ" },
  { en: "Yadgir",         kn: "ಯಾದಗಿರಿ" },
  { en: "Vijayanagara",   kn: "ವಿಜಯನಗರ" }
];

// ─── 10 REGIONAL KARNATAKA CROPS ─────────────────────────────
const KA_CROPS = [
  { en: "Ragi (Finger Millet)",  kn: "ರಾಗಿ",        emoji: "🌾", base: 1800 },
  { en: "Jowar (Sorghum)",       kn: "ಜೋಳ",          emoji: "🌽", base: 2100 },
  { en: "Tur Dal (Pigeon Pea)",  kn: "ತೊಗರಿ",        emoji: "🫘", base: 6200 },
  { en: "Groundnut",             kn: "ಶೇಂಗಾ",        emoji: "🥜", base: 5400 },
  { en: "Sugarcane",             kn: "ಕಬ್ಬು",         emoji: "🎋", base: 3400 },
  { en: "Cotton",                kn: "ಹತ್ತಿ",         emoji: "🌿", base: 6800 },
  { en: "Sunflower",             kn: "ಸೂರ್ಯಕಾಂತಿ",   emoji: "🌻", base: 5800 },
  { en: "Maize",                 kn: "ಮೆಕ್ಕೆಜೋಳ",    emoji: "🌽", base: 2000 },
  { en: "Coffee (Arabica)",      kn: "ಕಾಫಿ",          emoji: "☕", base: 42000 },
  { en: "Arecanut (Betel Nut)",  kn: "ಅಡಿಕೆ",         emoji: "🌴", base: 48000 }
];

// ─── WEATHER SIMULATION ───────────────────────────────────────
const WEATHER_ICONS = ['☀️','🌤','⛅','🌥','🌦','🌧','⛈'];
const WEATHER_DESCS_EN = ['Sunny','Partly Cloudy','Cloudy','Mostly Cloudy','Light Rain','Rain','Thunderstorm'];
const WEATHER_DESCS_KN = ['ಬಿಸಿಲು','ಭಾಗಶಃ ಮೋಡ','ಮೋಡ','ಹೆಚ್ಚು ಮೋಡ','ತುಂಬಾ ಮಳೆ','ಮಳೆ','ಗುಡುಗು ಮಳೆ'];

function generateWeather(district) {
  const seed = district.charCodeAt(0) % 4;
  const days = [];
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dayLabelsKn = ['ಸೋಮ','ಮಂಗಳ','ಬುಧ','ಗುರು','ಶುಕ್ರ','ಶನಿ','ಭಾನು'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const wiIdx = (seed + i + Math.floor(Math.sin(seed * i) * 2 + 2)) % WEATHER_ICONS.length;
    days.push({
      label: dayLabels[d.getDay()],
      labelKn: dayLabelsKn[d.getDay()],
      icon: WEATHER_ICONS[wiIdx],
      descEn: WEATHER_DESCS_EN[wiIdx],
      descKn: WEATHER_DESCS_KN[wiIdx],
      temp: 26 + seed + i,
      rain: wiIdx >= 4
    });
  }
  return days;
}

function getCropWeatherAdvice(cropEn, weatherDays) {
  const hasRain = weatherDays.some(d => d.rain);
  const rainDays = weatherDays.filter(d => d.rain).length;
  const adviceMap = {
    "Ragi (Finger Millet)": {
      rain: [`Cover harvested ragi with tarpaulin sheets to prevent moisture damage`, `Ensure proper drainage in fields to avoid waterlogging`, `Delay threshing until dry weather — ${rainDays} rainy days expected`, `Monitor for blast disease which spreads in wet conditions`],
      dry: [`Ensure irrigated ragi gets water every 4–5 days`, `Good drying weather — ideal for post-harvest sun-drying`, `Apply potash fertilizer before expected rains`]
    },
    "Cotton": {
      rain: [`Spray fungicide to prevent boll rot during ${rainDays} wet days`, `Harvest open bolls before rain — wet cotton loses grade & price`, `Check for pink bollworm activity which increases in humidity`, `Avoid machine picking in muddy fields`],
      dry: [`Monitor for aphids and whitefly in dry hot conditions`, `Irrigate at 50% field capacity — cotton is drought sensitive`, `Good conditions for harvesting and ginning`]
    },
    "Groundnut": {
      rain: [`Hold harvest until soil dries — wet groundnuts develop aflatoxin mold`, `Do not pod in waterlogged soil; wait ${rainDays} days`, `Ensure windrows are elevated for air circulation`, `Check for late leaf spot disease in humid weather`],
      dry: [`Harvest when vines show yellowing — optimal moisture content`, `Sun-dry pods to 8% moisture before storage`, `Good weather for digging and curing`]
    },
    "Sugarcane": {
      rain: [`Heavy rain may lodge cane — use bamboo support staking`, `Delay crushing operations during peak rain to maintain juice quality`, `Monitor for red rot fungal disease in waterlogged areas`],
      dry: [`Drip-irrigate ratoon crop during dry spell`, `Good weather for mechanical harvesting`, `Check for internode borer activity`]
    },
    "Tur Dal (Pigeon Pea)": {
      rain: [`Spray copper oxychloride to prevent sterility mosaic during ${rainDays} wet days`, `Ensure good drainage — tur is highly sensitive to waterlogging`, `Delay harvesting if pods are still green and wet`],
      dry: [`Good drying conditions for mature pods`, `Ensure harvest before pods start shattering in heat`, `Store in moisture-proof gunny bags`]
    }
  };
  const crop = cropEn.split(' (')[0];
  const advice = adviceMap[cropEn] || {
    rain: [`Store produce in elevated, waterproof storage during ${rainDays} rainy days`, `Cover outdoor stock with tarpaulin sheets`, `Check for mold and fungal growth in stored produce`, `Delay transportation on heavy rain days to prevent spoilage`],
    dry: [`Good weather for sun-drying and storage`, `Ensure adequate irrigation for standing crop`, `Ideal conditions for sorting and grading produce`]
  };
  return hasRain ? advice.rain : advice.dry;
}

// ─── POPULATE DROPDOWNS ───────────────────────────────────────
function populateDistricts() {
  const sel = document.getElementById('districtSel');
  KA_DISTRICTS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.en;
    opt.textContent = currentLang === 'kn' ? `${d.kn} (${d.en})` : d.en;
    sel.appendChild(opt);
  });
}

function populateCrops() {
  const sel = document.getElementById('cropSel');
  KA_CROPS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.en;
    opt.textContent = currentLang === 'kn' ? `${c.emoji} ${c.kn}` : `${c.emoji} ${c.en}`;
    sel.appendChild(opt);
  });
}

// ─── PRICE GENERATION ────────────────────────────────────────
function generateHistory(crop, district) {
  const cropObj = KA_CROPS.find(c => c.en === crop) || KA_CROPS[0];
  const base = cropObj.base;
  const dSeed = district.charCodeAt(0);
  const history = [];
  let price = base * (0.9 + (dSeed % 20) / 100);
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    price += (Math.random() - 0.48) * base * 0.03;
    price = Math.max(base * 0.7, Math.min(base * 1.4, price));
    history.push({ date: d.toISOString().split('T')[0], price: Math.round(price) });
  }
  return history;
}

function predictPrices(history, days, crop) {
  const recent = history.slice(-7).map(h => h.price);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const trend = (recent[recent.length - 1] - recent[0]) / recent.length;
  const cropObj = KA_CROPS.find(c => c.en === crop) || KA_CROPS[0];
  const predictions = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const seasonalFactor = 1 + 0.015 * Math.sin((d.getMonth() / 12) * 2 * Math.PI);
    const noise = (Math.random() - 0.5) * cropObj.base * 0.015;
    const price = Math.round((recent[recent.length - 1] + trend * i * 0.8) * seasonalFactor + noise);
    predictions.push({ date: d.toISOString().split('T')[0], price: Math.max(cropObj.base * 0.6, price) });
  }
  return predictions;
}

function getSignal(history, predictions) {
  const today = history[history.length - 1].price;
  const peak = Math.max(...predictions.map(p => p.price));
  const avg7 = predictions.reduce((a, b) => a + b.price, 0) / predictions.length;
  const upside = (avg7 - today) / today;
  if (upside > 0.05) return { signal: 'HOLD', confidence: Math.min(95, Math.round(60 + upside * 300)) };
  if (upside < -0.02) return { signal: 'SELL', confidence: Math.min(95, Math.round(65 + Math.abs(upside) * 200)) };
  return { signal: 'WAIT', confidence: 55 };
}

// ─── RENDER FUNCTIONS ─────────────────────────────────────────
function renderHero(crop, district) {
  const cropObj = KA_CROPS.find(c => c.en === crop) || KA_CROPS[0];
  const distObj = KA_DISTRICTS.find(d => d.en === district) || KA_DISTRICTS[0];
  const isKn = currentLang === 'kn';
  document.getElementById('heroEyebrow').textContent = t('heroEyebrow');
  document.getElementById('heroTitle').innerHTML =
    `${cropObj.emoji} <em>${isKn ? cropObj.kn : cropObj.en}</em> — ${isKn ? distObj.kn : distObj.en}`;
  document.getElementById('heroSub').textContent = t('heroSub');
}

function renderMetrics(history, predictions, transport, quantity) {
  const today = history[history.length - 1].price;
  const prev7 = history[history.length - 8]?.price || today;
  const peak = Math.max(...predictions.map(p => p.price));
  const net = Math.round((today - transport) * quantity);
  const change = today - prev7;
  const pct = ((change / prev7) * 100).toFixed(1);
  const isKn = currentLang === 'kn';
  const row = document.getElementById('metricsRow');
  row.style.display = 'grid';
  row.innerHTML = `
    <div class="metric-card"><div class="metric-accent acc-green"></div>
      <span class="metric-icon">💰</span>
      <div class="metric-label ${isKn?'kannada':''}">${t('metricPrice')}</div>
      <div class="metric-value">₹${today.toLocaleString('en-IN')}</div>
      <div class="${change>=0?'delta-up':'delta-down'}">${change>=0?'▲':'▼'} ${Math.abs(pct)}%</div>
    </div>
    <div class="metric-card"><div class="metric-accent acc-yellow"></div>
      <span class="metric-icon">📈</span>
      <div class="metric-label ${isKn?'kannada':''}">${t('metricNet')}</div>
      <div class="metric-value">₹${net.toLocaleString('en-IN')}</div>
      <div class="delta-up">After transport</div>
    </div>
    <div class="metric-card"><div class="metric-accent acc-dark"></div>
      <span class="metric-icon">🎯</span>
      <div class="metric-label ${isKn?'kannada':''}">${t('metricPeak')}</div>
      <div class="metric-value">₹${peak.toLocaleString('en-IN')}</div>
      <div class="delta-up">7-day high</div>
    </div>
    <div class="metric-card"><div class="metric-accent acc-warm"></div>
      <span class="metric-icon">📊</span>
      <div class="metric-label ${isKn?'kannada':''}">${t('metricChange')}</div>
      <div class="metric-value ${change>=0?'delta-up':'delta-down'}">${change>=0?'+':''}${change.toLocaleString('en-IN')}</div>
      <div class="${change>=0?'delta-up':'delta-down'}">vs last week</div>
    </div>`;
}

function renderSignal(signal, confidence, crop, district, predictions) {
  const isKn = currentLang === 'kn';
  const colorMap = { HOLD:'signal-hold', SELL:'signal-sell', WAIT:'signal-wait' };
  const labelMap = { HOLD: t('signalHold'), SELL: t('signalSell'), WAIT: t('signalWait') };
  const bullets = {
    HOLD: [
      isKn ? `ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ಹೆಚ್ಚಳ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ` : `Price expected to rise over next 7 days`,
      isKn ? `ಗರಿಷ್ಠ ₹${Math.max(...predictions.map(p=>p.price)).toLocaleString('en-IN')} ತಲುಪಬಹುದು` : `Peak forecast: ₹${Math.max(...predictions.map(p=>p.price)).toLocaleString('en-IN')}`,
      isKn ? `ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ ಊರ್ಧ್ವಮುಖ` : `Market trend is upward`,
      isKn ? `ಸರಿಯಾದ ಸಂಗ್ರಹ ಮಾಡಿ ಮತ್ತು ಹವಾಮಾನ ಸಲಹೆ ಅನುಸರಿಸಿ` : `Ensure proper storage and follow weather advisory below`
    ],
    SELL: [
      isKn ? `ಈಗ ಮಾರಾಟ ಮಾಡಲು ಉತ್ತಮ ಅವಕಾಶ` : `Good opportunity to sell now`,
      isKn ? `ಬೆಲೆ ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಇಳಿಯಬಹುದು` : `Prices may decline in coming days`,
      isKn ? `ಸಾಗಣೆ ವೆಚ್ಚ ಗಣನೆಗೆ ತೆಗೆದುಕೊಂಡು ಇಂದೇ ಮಾರಿ` : `Factor in transport costs and sell today`,
      isKn ? `ಹತ್ತಿರದ ಮಂಡಿ ಬೆಲೆ ಹೋಲಿಕೆ ಮಾಡಿ` : `Compare nearby mandi prices before selling`
    ],
    WAIT: [
      isKn ? `ಮಾರುಕಟ್ಟೆ ಅನಿಶ್ಚಿತ — ಇನ್ನೆರಡು ದಿನ ನಿರೀಕ್ಷಿಸಿ` : `Market is uncertain — wait 2 more days`,
      isKn ? `ಬೆಲೆ ಏರಿಳಿತ ನಡೆಯುತ್ತಿದೆ` : `Price volatility is high right now`,
      isKn ? `ಸ್ಥಳೀಯ ಮಂಡಿ ಅಧಿಕಾರಿಗಳ ಜೊತೆ ಸಮಾಲೋಚಿಸಿ` : `Consult local mandi officials`
    ]
  };
  const sec = document.getElementById('signalSection');
  sec.style.display = 'block';
  sec.innerHTML = `<div class="signal-card ${colorMap[signal]}">
    <div class="signal-title ${isKn?'kannada':''}">${labelMap[signal]}</div>
    <div class="signal-conf">${t('metricChange')}: Confidence ${confidence}%</div>
    <ul class="signal-bullets">${bullets[signal].map(b=>`<li class="${isKn?'kannada':''}">${b}</li>`).join('')}</ul>
  </div>`;
}

function renderWeather(district, crop) {
  const isKn = currentLang === 'kn';
  const weatherDays = generateWeather(district);
  const advice = getCropWeatherAdvice(crop, weatherDays);
  const weatherSec = document.getElementById('weatherSection');
  weatherSec.style.display = 'block';
  weatherSec.innerHTML = `
  <div class="weather-card">
    <div class="weather-title ${isKn?'kannada':''}">${t('weatherTitle')}</div>
    <div class="weather-days">
      ${weatherDays.map(d => `
        <div class="weather-day">
          <div class="wd-label ${isKn?'kannada':''}">${isKn ? d.labelKn : d.label}</div>
          <div class="wd-icon">${d.icon}</div>
          <div class="wd-temp">${d.temp}°C</div>
          <div class="wd-desc ${isKn?'kannada':''}">${isKn ? d.descKn : d.descEn}</div>
        </div>`).join('')}
    </div>
    <div class="crop-advice">
      <div class="crop-advice-title ${isKn?'kannada':''}">${t('weatherAdviceTitle')}</div>
      <ul class="crop-advice-list">
        ${advice.map(a => `<li class="${isKn?'kannada':''}">${a}</li>`).join('')}
      </ul>
    </div>
  </div>`;
}

function renderForecast(predictions, todayPrice) {
  const isKn = currentLang === 'kn';
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const daysKn = ['ಸೋಮ','ಮಂಗಳ','ಬುಧ','ಗುರು','ಶುಕ್ರ','ಶನಿ','ಭಾನು'];
  document.getElementById('forecastSection').style.display = 'block';
  document.getElementById('lbl-forecast-eyebrow').textContent = t('forecastEyebrow');
  document.getElementById('lbl-forecast-title').textContent = t('forecastTitle');
  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = predictions.map((p, i) => {
    const d = new Date(p.date);
    const chg = p.price - todayPrice;
    const pct = ((chg / todayPrice) * 100).toFixed(1);
    return `<div class="fc-card">
      <div class="fc-day ${isKn?'kannada':''}">${isKn ? daysKn[d.getDay()] : days[d.getDay()]}</div>
      <div class="fc-price">₹${p.price.toLocaleString('en-IN')}</div>
      <div class="fc-chg ${chg>=0?'delta-up':'delta-down'}">${chg>=0?'▲':'▼'}${Math.abs(pct)}%</div>
    </div>`;
  }).join('');
}

let chartInstance = null;
function renderChart(history, predictions, crop) {
  const cropObj = KA_CROPS.find(c => c.en === crop) || KA_CROPS[0];
  document.getElementById('chartWrap').style.display = 'block';
  const labels = [...history.map(h => h.date.slice(5)), ...predictions.map(p => p.date.slice(5))];
  const histData = [...history.map(h => h.price), ...new Array(predictions.length).fill(null)];
  const predData = [...new Array(history.length - 1).fill(null), history[history.length-1].price, ...predictions.map(p => p.price)];
  if (chartInstance) { chartInstance.destroy(); }
  chartInstance = new Chart(document.getElementById('priceChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Historical', data: histData, borderColor: '#2d7a4f', backgroundColor: 'rgba(45,122,79,.08)', tension: .4, pointRadius: 0 },
        { label: 'Forecast', data: predData, borderColor: '#f5b731', backgroundColor: 'rgba(245,183,49,.08)', borderDash: [6,3], tension: .4, pointRadius: 3, pointBackgroundColor: '#f5b731' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { grid: { color: '#d0e4d6' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } } } }
  });
}

function renderMandi(district, crop) {
  const isKn = currentLang === 'kn';
  const cropObj = KA_CROPS.find(c => c.en === crop) || KA_CROPS[0];
  const distObj = KA_DISTRICTS.find(d => d.en === district) || KA_DISTRICTS[0];
  const nearby = KA_DISTRICTS.filter(d => d.en !== district).slice(0, 5);
  document.getElementById('mandiWrap').style.display = 'block';
  document.getElementById('lbl-mandi-eyebrow').textContent = t('mandiEyebrow');
  document.getElementById('lbl-mandi-title').textContent = t('mandiTitle');
  const base = cropObj.base;
  const rows = nearby.map(d => {
    const price = Math.round(base * (0.88 + Math.random() * 0.24));
    const dist = 30 + Math.floor(Math.random() * 180);
    const status = price > base * 1.05 ? '🟢 High' : price < base * 0.95 ? '🔴 Low' : '🟡 Avg';
    return `<tr>
      <td>${d.en} Mandi</td>
      <td><span class="badge-dist">${isKn ? d.kn : d.en}</span></td>
      <td><strong>₹${price.toLocaleString('en-IN')}</strong></td>
      <td>${dist} km</td>
      <td>${status}</td>
    </tr>`;
  }).join('');
  document.getElementById('mandiTable').innerHTML = `
    <thead><tr>
      <th class="${isKn?'kannada':''}">${t('tableMarket')}</th>
      <th class="${isKn?'kannada':''}">${t('tableDistrict')}</th>
      <th class="${isKn?'kannada':''}">${t('tablePrice')}</th>
      <th class="${isKn?'kannada':''}">${t('tableDist')}</th>
      <th class="${isKn?'kannada':''}">${t('tableStatus')}</th>
    </tr></thead>
    <tbody>${rows}</tbody>`;
}

// ─── MAIN RUN ────────────────────────────────────────────────
async function runAnalysis() {
  const district = document.getElementById('districtSel').value;
  const crop = document.getElementById('cropSel').value;
  const transport = +document.getElementById('transportSlider').value;
  const quantity = +document.getElementById('quantitySlider').value;

  document.getElementById('loadingOverlay').classList.add('active');
  document.getElementById('predictBtn').disabled = true;

  await new Promise(r => setTimeout(r, 800));

  try {
    const history = generateHistory(crop, district);
    const predictions = predictPrices(history, 7, crop);
    const { signal, confidence } = getSignal(history, predictions);

    renderHero(crop, district);
    renderMetrics(history, predictions, transport, quantity);
    renderSignal(signal, confidence, crop, district, predictions);

    // Show weather only on HOLD
    if (signal === 'HOLD') {
      renderWeather(district, crop);
    } else {
      document.getElementById('weatherSection').style.display = 'none';
    }

    renderForecast(predictions, history[history.length - 1].price);
    renderChart(history, predictions, crop);
    renderMandi(district, crop);

    const content = document.getElementById('mainContent');
    content.classList.add('fade-in');
    setTimeout(() => content.classList.remove('fade-in'), 600);
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
  }

  document.getElementById('loadingOverlay').classList.remove('active');
  document.getElementById('predictBtn').disabled = false;
}

// ─── INIT ────────────────────────────────────────────────────
document.getElementById('transportSlider').addEventListener('input', e => {
  document.getElementById('transportVal').textContent = e.target.value;
});
document.getElementById('quantitySlider').addEventListener('input', e => {
  document.getElementById('quantityVal').textContent = e.target.value;
});

function updateTime() {
  const el = document.getElementById('heroBadgeTime');
  if (el) el.textContent = '🕐 ' + new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) + ' IST';
}

populateDistricts();
populateCrops();
applyLangLabels();
updateTime();
setInterval(updateTime, 60000);
window.addEventListener('load', runAnalysis);