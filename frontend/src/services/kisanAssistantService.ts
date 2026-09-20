export interface AgriResponse {
  text: string;
  voiceText: string;
  tags: string[];
  actionLink?: { text: string; url: string };
  category: "disease" | "market" | "fertilizer" | "weather" | "scheme" | "general";
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  greeting: string;
  placeholder: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    greeting: "नमस्ते किसान साथी! 🙏 बोलिए, आपकी फसल या मंडी भाव में क्या सहायता चाहिए?",
    placeholder: "बोलकर पूछें, जैसे: टमाटर का रोग, गेहूं का भाव, या खाद की मात्रा...",
  },
  {
    code: "en-IN",
    name: "English",
    nativeName: "English (India)",
    greeting: "Namaste Ramesh ji! 🙏 I am your Kisan Voice Advisor. How can I assist with your crops or mandi rates today?",
    placeholder: "Speak now, e.g., Tomato early blight cure, potato mandi prices, or urea dosage...",
  },
  {
    code: "pa-IN",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! 🙏 ਆਪਣੀ ਫ਼ਸਲ, ਖਾਦ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਬੋਲ ਕੇ ਪੁੱਛੋ।",
    placeholder: "ਬੋਲੋ, ਜਿਵੇਂ: ਕਣਕ ਦਾ ਪੀਲਾ ਰਤੂਆ, ਝੋਨੇ ਵਿੱਚ ਖਾਦ, ਜਾਂ ਆਲੂ ਦਾ ਭਾਅ...",
  },
  {
    code: "mr-IN",
    name: "Marathi",
    nativeName: "मराठी",
    greeting: "नमस्कार शेतकरी बंधूंनो! 🙏 पिके, खते किंवा बाजारभावाबद्दल बोला आणि विचारा.",
    placeholder: "बोला, जसे की: टोमॅटो रोग, खतांचा डोस, किंवा बाजारभाव...",
  },
  {
    code: "gu-IN",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    greeting: "નમસ્તે ખેડૂત મિત્રો! 🙏 તમારા પાક, ખાતર કે મંડી ભાવ વિશે બોલીને પૂછો.",
    placeholder: "બોલો, જેમ કે: કપાસના રોગ, ખાતરની માત્રા, કે મંડી ભાવ...",
  },
  {
    code: "bn-IN",
    name: "Bengali",
    nativeName: "বাংলা",
    greeting: "নমস্কার কৃষক বন্ধু! 🙏 আপনার ফসল, সার বা বাজার দর সম্পর্কে কথা বলে জানুন।",
    placeholder: "বলুন, যেমন: ধানের রোগ, সারের ডোজ, বা আলুর দর...",
  },
  {
    code: "te-IN",
    name: "Telugu",
    nativeName: "తెలుగు",
    greeting: "నమస్కారం రైతు మిత్రులారా! 🙏 మీ పంటలు, ఎరువులు లేదా మార్కెట్ ధరల గురించి మాట్లాడండి.",
    placeholder: "మాట్లాడండి, ఉదాహరణకు: తెగుళ్ల నివారణ, ఎరువుల మోతాదు...",
  },
];

export const VOICE_SAMPLE_QUERIES = [
  {
    category: "Disease",
    hi: "टमाटर में पत्ती धब्बा और झुलसा रोग का क्या इलाज है?",
    en: "What is the treatment for tomato early blight and leaf spot?",
    icon: "Bug",
  },
  {
    category: "Mandi Rates",
    hi: "आज का गेहूं, धान और आलू का मंडी भाव क्या है?",
    en: "What is the current mandi price trend for wheat, paddy, and potato?",
    icon: "TrendingUp",
  },
  {
    category: "Fertilizer",
    hi: "धान और गेहूं में यूरिया और जिंक की सही मात्रा क्या है?",
    en: "What is the recommended NPK and zinc dosage for paddy tillering?",
    icon: "Sprout",
  },
  {
    category: "Storage",
    hi: "क्या आलू को कोल्ड स्टोरेज में रखना चाहिए या मंडी में बेचें?",
    en: "Should I store 50 quintals of potato in cold storage or sell now?",
    icon: "Package",
  },
  {
    category: "Weather",
    hi: "अगले तीन दिन मौसम कैसा रहेगा, क्या कीटनाशक छिड़काव करें?",
    en: "How is the weather forecast for spraying chemical fungicides this week?",
    icon: "CloudSun",
  },
  {
    category: "PM-Kisan",
    hi: "पीएम किसान योजना 17वीं किस्त और केसीसी लोन की जानकारी दीजिए।",
    en: "What are the latest guidelines for PM-KISAN subsidy and KCC credit?",
    icon: "Landmark",
  },
];

export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/#{1,6}\s+/g, "") // headers
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/[🔍🌾📊✅💡⚠️🌦️🏛️🌱🧪🥔💰]/gu, "") // emojis
    .replace(/\n+/g, ". ") // new lines to pauses
    .replace(/\s{2,}/g, " ")
    .trim();
}

export interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence?: number;
}

export interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
}

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    [index: number]: SpeechRecognitionResultLike;
    length: number;
  };
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

export interface SpeechRecognitionInstanceLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function getBrowserSpeechRecognition(): (new () => SpeechRecognitionInstanceLike) | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstanceLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export function generateKisanResponse(query: string, langCode: string): AgriResponse {
  const q = query.toLowerCase().trim();
  const isHindiMode = langCode.startsWith("hi") || /[\u0900-\u097F]/.test(query);

  // 1. Tomato / Disease / Blight / Rust / Pest
  if (
    q.includes("disease") ||
    q.includes("blight") ||
    q.includes("rust") ||
    q.includes("tomato") ||
    q.includes("leaf") ||
    q.includes("pest") ||
    q.includes("रोग") ||
    q.includes("झुलसा") ||
    q.includes("रतुआ") ||
    q.includes("कीड़ा") ||
    q.includes("टमाटर") ||
    q.includes("धब्बा") ||
    q.includes("पत्ती") ||
    q.includes("इलाज") ||
    q.includes("दवा")
  ) {
    if (isHindiMode) {
      const text = `🔍 **रोग निदान: टमाटर अगेती झुलसा (Early Blight - Alternaria solani)**

**ICAR अनुशंसित त्वरित उपाय:**
1. **रासायनिक छिड़काव:** मैंकोजेब (Mancozeb 75% WP) @ 2 ग्राम/लीटर पानी या एज़ोक्सीस्ट्रोबिन (Azoxystrobin 23% SC) @ 1 मिली/लीटर का छिड़काव करें।
2. **जैविक नियंत्रण:** ट्राइकोडर्मा विरिडी (Trichoderma viride) @ 5 ग्राम/लीटर अथवा नीम का तेल (10,000 ppm) @ 3 मिली/लीटर सुबह के समय छिड़कें।
3. **सिंचाई प्रबंधन:** पत्तों पर फव्वारा सिंचाई न करें, हमेशा टपक (ड्रिप) या जड़ के पास पानी दें ताकि नमी से कवक न फैले।

💡 *सुझाव: पत्ती की सटीक जांच के लिए आप हमारी **AI Disease Detection** में फोटो अपलोड कर सकते हैं।*`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "टमाटर में अगेती झुलसा रोग के लक्षण हैं। इसके लिए मैंकोजेब 75 प्रतिशत 2 ग्राम प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें। जैविक उपाय के लिए ट्राइकोडर्मा विरिडी या नीम तेल का छिड़काव करें। पत्तियों पर पानी का जमाव न होने दें।"
        ),
        tags: ["ICAR अनुमोदित", "कवकनाशी", "जैविक उपचार"],
        actionLink: { text: "AI रोग पहचान (Scan Leaf)", url: "/app/disease-detection" },
        category: "disease",
      };
    } else {
      const text = `🔍 **Diagnosis: Likely Tomato Early Blight (*Alternaria solani*)**

**Key Recommended Steps (ICAR Guidelines):**
1. **Immediate Chemical Spray:** Apply **Mancozeb 75% WP** @ 2g/litre of water OR **Azoxystrobin 23% SC** @ 1ml/litre.
2. **Organic/Biological Treatment:** Spray *Trichoderma harzianum* @ 5g/litre or cold-pressed Neem Oil (10,000 ppm) @ 3ml/litre in cool morning hours.
3. **Farm Hygiene:** Remove and safely destroy infected lower foliage to curtail spore propagation.
4. **Irrigation:** Cease overhead sprinkler irrigation; switch to drip irrigation to keep leaf surfaces dry.

💡 *Tip: You can verify with our visual **AI Disease Detection** module by taking a photo of the affected leaf.*`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "Your tomato crop shows symptoms of early blight. Spray Mancozeb at 2 grams per litre or Azoxystrobin at 1 ml per litre. For organic treatment, use neem oil spray. Avoid overhead watering to keep foliage dry."
        ),
        tags: ["ICAR Protocol", "Fungicide Spray", "Foliar Care"],
        actionLink: { text: "Scan Leaf in AI Disease Detection", url: "/app/disease-detection" },
        category: "disease",
      };
    }
  }

  // 2. Mandi / Price / Cold Storage / Selling decision
  if (
    q.includes("mandi") ||
    q.includes("price") ||
    q.includes("rate") ||
    q.includes("cold storage") ||
    q.includes("storage") ||
    q.includes("sell") ||
    q.includes("potato") ||
    q.includes("wheat") ||
    q.includes("bhav") ||
    q.includes("भाव") ||
    q.includes("मंडी") ||
    q.includes("आलू") ||
    q.includes("गेहूं") ||
    q.includes("धान") ||
    q.includes("बेचें") ||
    q.includes("स्टोरेज") ||
    q.includes("कीमत")
  ) {
    if (isHindiMode) {
      const text = `📊 **मंडी भाव एवं भंडारण निर्णय विश्लेषण:**

- **आलू (Potato):** वर्तमान स्थानीय मंडी भाव ₹1,450 / क्विंटल। कोल्ड स्टोरेज किराया ₹110 / क्विंटल / माह है। 40 दिन बाद संभावित भाव ₹1,950 से ₹2,100 / क्विंटल है।
- **गेहूं (Wheat शरबती/HD-3086):** ₹2,450 - ₹2,580 / क्विंटल (स्थिर मांग)।
- **धान (Paddy बासमती 1121):** ₹3,850 - ₹4,120 / क्विंटल (निर्यात मांग मजबूत)।

**सस्यम AI परामर्श:**
✅ **70% आलू कोल्ड स्टोरेज में रखें** और 30% तुरंत मंडी में बेचें ताकि खेत की लागत और नकद पूंजी बनी रहे।`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "आलू का वर्तमान मंडी भाव 1450 रुपये प्रति क्विंटल है। 40 दिनों बाद इसके 2000 रुपये तक पहुंचने का अनुमान है। हमारी सलाह है कि 70 प्रतिशत आलू कोल्ड स्टोरेज में रखें और 30 प्रतिशत तुरंत बेचें। गेहूं का भाव 2500 रुपये और बासमती धान 4000 रुपये प्रति क्विंटल चल रहा है।"
        ),
        tags: ["e-NAM लाइव", "कोल्ड स्टोरेज मॉडल", "मंडी पूर्वानुमान"],
        actionLink: { text: "मल्टी-चैनल निर्णय इंजन चलाएं", url: "/app/decision-engine" },
        category: "market",
      };
    } else {
      const text = `📊 **Market Intelligence & Storage Advisory:**

- **Potato Current Mandi Price:** ₹1,450 / quintal.
- **Estimated Price in 30-45 Days:** ₹1,950 - ₹2,100 / quintal.
- **Cold Storage Cost:** Approx ₹110 / quintal / month.
- **Projected Net Gain:** **+₹390 / quintal** after storage & transit deductions.
- **Wheat (HD-3086):** ₹2,480 - ₹2,550 / qtl in Azadpur & Khanna mandis.
- **Basmati Paddy (1121):** ₹3,850 - ₹4,120 / qtl with robust export demand.

**AI Recommendation:**
✅ **Store 70% of produce** in certified cold storage and sell 30% immediately to maintain working liquidity.`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "Current potato price is 1450 rupees per quintal. Prices are forecasted to rise to 2050 rupees in 40 days. We recommend keeping 70 percent stock in cold storage and liquidating 30 percent now for operational cashflow."
        ),
        tags: ["e-NAM Mandi Sync", "Cold Storage Model", "Profit Maximizer"],
        actionLink: { text: "Run Multi-Channel Decision Engine", url: "/app/decision-engine" },
        category: "market",
      };
    }
  }

  // 3. Fertilizer / NPK / Urea / Zinc / Soil
  if (
    q.includes("fertilizer") ||
    q.includes("npk") ||
    q.includes("urea") ||
    q.includes("zinc") ||
    q.includes("dap") ||
    q.includes("rice") ||
    q.includes("tillering") ||
    q.includes("खाद") ||
    q.includes("यूरिया") ||
    q.includes("जिंक") ||
    q.includes("डीएपी") ||
    q.includes("उर्वरक") ||
    q.includes("पोषण") ||
    q.includes("मिट्टी")
  ) {
    if (isHindiMode) {
      const text = `🌾 **धान एवं गेहूं पोषक तत्व प्रबंधन (प्रति एकड़ सिफारिश):**

1. **यूरिया (नाइट्रोजन):** 30 किग्रा प्रति एकड़ टिलरिंग अवस्था (रोपाई के 20-25 दिन बाद) टॉप ड्रेसिंग के रूप में डालें।
2. **जिंक सल्फेट (21%):** 10 किग्रा प्रति एकड़ (खैरा रोग से बचाव के लिए, यूरिया के साथ मिलाकर दे सकते हैं)।
3. **नैनो यूरिया:** 4 मिली प्रति लीटर पानी की दर से पत्तियों पर छिड़काव करें जिससे नाइट्रोजन की 80% अवशोषण क्षमता मिले।
4. **जल स्तर:** टिलरिंग के समय खेत में 2-3 सेमी पानी रखें, अत्यधिक गहरा पानी न भरें।`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "धान की टिलरिंग अवस्था में प्रति एकड़ 30 किलो यूरिया और 10 किलो जिंक सल्फेट डालें। इससे खैरा रोग नहीं लगेगा। आप 4 मिली प्रति लीटर नैनो यूरिया का पर्णीय छिड़काव भी कर सकते हैं। खेत में 2 से 3 सेंटीमीटर पानी बनाए रखें।"
        ),
        tags: ["ICAR पोषक चार्ट", "नैनो यूरिया", "खैरा रोग रोकथाम"],
        actionLink: { text: "फसल निगरानी देखें (My Crops)", url: "/app/crops" },
        category: "fertilizer",
      };
    } else {
      const text = `🌾 **Basmati Paddy / Wheat Tillering Nutrient Matrix (Per Acre):**

1. **Urea (Nitrogen):** 30 kg / acre applied as top dressing at tillering (21-25 days after transplanting).
2. **Zinc Sulphate (21%):** 10 kg / acre to avert Khaira zinc deficiency chlorosis.
3. **IFFCO Nano Urea:** Foliar spray @ 4ml / litre water for 80%+ nitrogen uptake efficiency.
4. **Water Level:** Maintain 2-3 cm shallow standing water during tillering; avoid prolonged deep flooding.`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "For rice tillering, apply 30 kg urea and 10 kg zinc sulphate per acre. This prevents Khaira disease and promotes productive tillers. Nano urea foliar spray at 4 ml per litre provides high nitrogen efficiency."
        ),
        tags: ["ICAR Agronomy", "Nano Urea Protocol", "Zinc Defense"],
        actionLink: { text: "Inspect Crop Status", url: "/app/crops" },
        category: "fertilizer",
      };
    }
  }

  // 4. Weather / Rain / Spraying timing
  if (
    q.includes("weather") ||
    q.includes("rain") ||
    q.includes("spray") ||
    q.includes("wind") ||
    q.includes("मौसम") ||
    q.includes("बारिश") ||
    q.includes("बरसात") ||
    q.includes("छिड़काव") ||
    q.includes("तापमान") ||
    q.includes("हवा")
  ) {
    if (isHindiMode) {
      const text = `🌦️ **मौसम एवं कृषि छिड़काव परामर्श (स्थानीय 72 घंटे पूर्वानुमान):**

- **अगले 48 घंटे:** आसमान मुख्यतः साफ, धूप खिली रहेगी। अधिकतम तापमान 31°C, न्यूनतम 21°C।
- **हवा की गति:** 8 से 12 किमी/घंटा (छिड़काव के लिए बहुत अनुकूल)।
- **छिड़काव विंडो:** आज सुबह 7:00 से 10:30 बजे और शाम 4:30 से 6:30 बजे तक कवकनाशी या कीटनाशक छिड़काव के लिए सबसे उत्तम समय है।
- **चेतावनी:** 72 घंटे बाद हल्की वर्षा की 35% संभावना है, इसलिए मुख्य छिड़काव आज ही पूरा कर लें।`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "अगले 48 घंटे मौसम साफ रहेगा। तापमान 31 डिग्री और हवा की गति 10 किमी प्रति घंटा रहेगी। आज सुबह और शाम का समय कीटनाशक छिड़काव के लिए सबसे उत्तम है। तीन दिन बाद हल्की बारिश हो सकती है।"
        ),
        tags: ["Open-Meteo सिंक", "छिड़काव अनुकूल", "मौसम चेतावनी"],
        actionLink: { text: "7-दिवसीय मौसम रडार देखें", url: "/app/weather" },
        category: "weather",
      };
    } else {
      const text = `🌦️ **Micro-Climate Telemetry & Spray Window (Next 72 Hours):**

- **Forecast:** Clear to partly cloudy skies. Max Temp 31°C, Min Temp 21°C. Relative Humidity: 58%.
- **Wind Speed:** 8-11 km/h (Safe for spray drift prevention).
- **Optimal Spray Window:** Today between 07:00 AM - 10:30 AM or 04:30 PM - 06:30 PM.
- **Advisory:** Light showers expected in 72 hours (35% probability). Conclude foliar chemical applications beforehand.`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "Weather will remain dry for the next 48 hours with mild winds under 11 km per hour. Today morning and late afternoon are optimal windows for foliar spray. Conclude sprays before rain showers arrive in three days."
        ),
        tags: ["7-Day Forecast", "Foliar Spray Window", "Wind Telemetry"],
        actionLink: { text: "View 7-Day Weather Forecast", url: "/app/weather" },
        category: "weather",
      };
    }
  }

  // 5. PM-Kisan / KCC / Schemes / Subsidy
  if (
    q.includes("scheme") ||
    q.includes("subsidy") ||
    q.includes("kisan") ||
    q.includes("pm-kisan") ||
    q.includes("kcc") ||
    q.includes("loan") ||
    q.includes("योजना") ||
    q.includes("पीएम किसान") ||
    q.includes("किस्त") ||
    q.includes("केसीसी") ||
    q.includes("कर्ज") ||
    q.includes("लोन") ||
    q.includes("सब्सिडी")
  ) {
    if (isHindiMode) {
      const text = `🏛️ **सरकारी कृषि योजनाएं एवं वित्तीय सहायता:**

1. **PM-KISAN 17वीं किस्त:** केंद्र सरकार द्वारा पात्र किसानों के बैंक खातों में ₹2,000 की किस्त DBT से भेजी गई है। अपनी e-KYC और आधार सीडिंग pmkisan.gov.in पर सत्यापित करें।
2. **Kisan Credit Card (KCC):** समय पर भुगतान पर 4% की रियायती ब्याज दर पर ₹3 लाख तक का कृषि ऋण उपलब्ध है।
3. **PM-KUSUM सोलर पंप योजना:** खेत में सोलर सिंचाई पंप लगाने के लिए 60% तक सरकारी अनुदान (सब्सिडी) दी जा रही है।
4. **PM फसल बीमा योजना (PMFBY):** रबी फसलों पर केवल 1.5% और खरीफ पर 2% प्रीमियम देकर संपूर्ण फसल सुरक्षा प्राप्त करें।`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "पीएम किसान की 17वीं किस्त जारी हो चुकी है। अपनी ई-केवाईसी पीएम किसान पोर्टल पर चेक करें। किसान क्रेडिट कार्ड से 4 प्रतिशत ब्याज पर 3 लाख तक ऋण मिलता है। सोलर पंप पर 60 प्रतिशत तक सरकारी अनुदान उपलब्ध है।"
        ),
        tags: ["PM-KISAN DBT", "KCC 4% ऋण", "PMFBY फसल सुरक्षा"],
        actionLink: { text: "मंडी एवं योजना विवरण", url: "/app/market" },
        category: "scheme",
      };
    } else {
      const text = `🏛️ **Government Agri Schemes & Subsidies (Direct Benefit):**

1. **PM-KISAN 17th Installment:** ₹2,000 installment disbursed via Aadhaar DBT. Verify e-KYC status at pmkisan.gov.in.
2. **Kisan Credit Card (KCC):** Collateral-free crop loans up to ₹3 Lakh at an effective 4% subsidized interest rate with prompt repayment.
3. **PM-KUSUM Solar Pump Scheme:** Up to 60% capital subsidy on standalone solar agriculture irrigation pumps.
4. **PM Fasal Bima Yojana (PMFBY):** Comprehensive yield loss protection at nominal 1.5% premium for Rabi and 2.0% for Kharif crops.`;

      return {
        text,
        voiceText: cleanTextForSpeech(
          "PM Kisan 17th installment is disbursed via direct benefit transfer. Kisan Credit Card offers credit up to 3 lakh rupees at 4 percent interest. Solar irrigation pumps carry up to 60 percent government subsidy under PM Kusum scheme."
        ),
        tags: ["PM-KISAN DBT", "KCC 4% Scheme", "Solar Subsidy"],
        actionLink: { text: "Open Mandi & Schemes", url: "/app/market" },
        category: "scheme",
      };
    }
  }

  // 6. Default Fallback
  if (isHindiMode) {
    const text = `🌱 **सस्यम AI किसान सलाहकार विश्लेषण:**

आपके प्रश्न *"**${query}**"* के संबंध में:
- **कृषि संस्तुति:** संतुलित उर्वरक प्रबंधन अपनाएं, खेत में समय पर कीट निगरानी करें और ड्रिप सिंचाई से पानी की 40% बचत करें।
- **मंडी एवं मौसम:** इस सप्ताह मंडियों में जिंसों की मांग स्थिर है और मौसम कृषि कार्यों के लिए उपयुक्त है।
- **अगला कदम:** अधिक विस्तृत रोग विश्लेषण के लिए **AI Disease Detection** या कोल्ड स्टोरेज लाभ के लिए **Decision Engine** देखें।`;

    return {
      text,
      voiceText: cleanTextForSpeech(
        "सस्यम किसान सहायक आपके प्रश्न का विश्लेषण कर चुका है। संतुलित उर्वरक का प्रयोग करें और कीट निगरानी रखें। आप रोग पहचान और मंडी भाव के लिए हमारे संबंधित विकल्पों का उपयोग कर सकते हैं।"
      ),
      tags: ["ICAR कृषि सलाह", "सस्यम एआई", "24/7 किसान हेल्प"],
      actionLink: { text: "निर्णय इंजन देखें", url: "/app/decision-engine" },
      category: "general",
    };
  } else {
    const text = `🌱 **Sasyam AI Agronomy Advisory:**

Regarding your query *"**${query}**"*:
- **Agronomic Best Practice:** Maintain balanced soil micronutrients, periodic integrated pest scouting, and moisture calibration.
- **Market & Climate:** Regional APMC prices remain stable this week, and micro-climate parameters support field operations.
- **Recommended Action:** For visual pest/leaf check, run **AI Disease Detection** or compute storage trade-offs in **Decision Engine**.`;

    return {
      text,
      voiceText: cleanTextForSpeech(
        "Sasyam AI has analyzed your inquiry. Maintain balanced micronutrients and monitor field moisture. You can use our Disease Detection module to scan leaves or check market intelligence for live APMC rates."
      ),
      tags: ["ICAR Agronomy", "Sasyam Intelligence", "Farmer Support"],
      actionLink: { text: "Run Decision Engine", url: "/app/decision-engine" },
      category: "general",
    };
  }
}
