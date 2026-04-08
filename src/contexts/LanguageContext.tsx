import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'ar';

export const i18n = {
  en: {
    appName: "Watermark Off",
    appSub: "For Teachers",
    tagline: "Remove Gemini watermarks. Privately. Instantly.",
    uploadTitle: "Drop your Gemini image here",
    uploadSub: "JPEG, PNG, WEBP, BMP — never leaves your device",
    browseFiles: "browse files",
    removeBtn: "Remove Watermark",
    downloadPng: "Download PNG",
    downloadJpg: "Download JPEG",
    resetBtn: "Remove Another Image",
    processing: "Removing Gemini watermark...",
    processingNote: "Running locally on your device",
    successToast: "✓ Gemini watermark removed — processed entirely on your device",
    privacyBadge: "100% Local",
    privacyNote: "Your image never leaves your device",
    beforeLabel: "Original",
    afterLabel: "Cleaned",
    loadingNote: "Processing...",
    viewOriginal: "View Original",
    viewResult: "View Result",
    howItWorks: "How does this work?",
    howItWorksP1: "Google Gemini adds a fixed 4-pointed sparkle star (✦) in the bottom-right corner of every AI-generated image — always at the same position and size.",
    howItWorksP2: "WaterOff uses Reverse Alpha Blending to mathematically reconstruct the original pixels:",
    howItWorksFormula: "original = (composite − α × 255) / (1 − α)",
    howItWorksP3: "This is a mathematically precise reconstruction — not an approximation — because the watermark position and blending parameters are predictable and fixed.",
    howItWorksPrivacy: "Your privacy is guaranteed: No images, pixels, or metadata ever leave your device. Everything runs in your browser's memory.",
    largeImage: "Large image — processing on your device, please wait",
    downloadSuccess: "Image downloaded",
    autoDetecting: "Analyzing image...",
    watermarkInfo: "Gemini watermark detected (bottom-right corner)",
    detectionMode: "Detection Mode",
    manualMask: "Manual Mask",
    autoDetect: "Auto Detect",
    maskingTools: "Masking Tools",
    brushTool: "Brush",
    rectTool: "Rect",
    wandTool: "Wand",
    eraserTool: "Eraser",
    brushSize: "Brush Size",
    tolerance: "Tolerance",
    autoDetectNote: "Automatically detect and highlight the Gemini watermark region.",
    detectBtn: "Detect Watermark",
    algoLabel: "Inpaint Algorithm",
    telea: "Fast marching based (recommended)",
    ns: "Navier-Stokes based (smoother)",
    radiusLabel: "Inpaint Radius",
    clearMask: "Clear Mask",
  },
  ar: {
    appName: "Watermark Off",
    appSub: "للمعلمين",
    tagline: "أزل علامة Gemini المائية. بخصوصية. فوراً.",
    uploadTitle: "اسحب صورة Gemini هنا",
    uploadSub: "JPEG و PNG و WEBP و BMP — لا تُرفع لأي سيرفر",
    browseFiles: "استعرض الملفات",
    removeBtn: "إزالة العلامة المائية",
    downloadPng: "تحميل PNG",
    downloadJpg: "تحميل JPEG",
    resetBtn: "إزالة علامة أخرى",
    processing: "جارٍ إزالة علامة Gemini...",
    processingNote: "التشغيل محلياً على جهازك",
    successToast: "✓ تمت إزالة علامة Gemini — تمت المعالجة على جهازك",
    privacyBadge: "محلي 100%",
    privacyNote: "صورتك لا تغادر جهازك",
    beforeLabel: "الأصلية",
    afterLabel: "بعد الإزالة",
    loadingNote: "جارٍ المعالجة...",
    viewOriginal: "عرض الأصلي",
    viewResult: "عرض النتيجة",
    howItWorks: "كيف يعمل هذا؟",
    howItWorksP1: "Google Gemini تضيف نجمة رباعية الأطراف (✦) في الركن السفلي الأيمن من كل صورة مولّدة بالذكاء الاصطناعي — دائماً في نفس الموضع والحجم.",
    howItWorksP2: "يستخدم Watermark Off معادلة الدمج العكسي (Reverse Alpha Blending) لإعادة بناء البكسلات الأصلية رياضياً:",
    howItWorksFormula: "الأصل = (المركّب − α × 255) / (1 − α)",
    howItWorksP3: "هذه إعادة بناء رياضية دقيقة — وليست تقريباً — لأن موضع العلامة ومعاملات الدمج ثابتة ومعروفة مسبقاً.",
    howItWorksPrivacy: "خصوصيتك مضمونة: لا تغادر أي صور أو بكسلات أو بيانات وصفية جهازك. كل شيء يعمل في ذاكرة متصفحك.",
    largeImage: "صورة كبيرة — المعالجة على جهازك، يرجى الانتظار",
    downloadSuccess: "تم تنزيل الصورة",
    autoDetecting: "جارٍ تحليل الصورة...",
    watermarkInfo: "تم اكتشاف علامة Gemini (الركن السفلي الأيمن)",
    detectionMode: "وضع الكشف",
    manualMask: "قناع يدوي",
    autoDetect: "كشف تلقائي",
    maskingTools: "أدوات التقنيع",
    brushTool: "فرشاة",
    rectTool: "مستطيل",
    wandTool: "عصا",
    eraserTool: "ممحاة",
    brushSize: "حجم الفرشاة",
    tolerance: "التسامح",
    autoDetectNote: "كشف تلقائي وتحديد منطقة علامة Gemini المائية.",
    detectBtn: "كشف العلامة المائية",
    algoLabel: "خوارزمية الترميم",
    telea: "مبني على المسار السريع (موصى به)",
    ns: "مبني على نافييه-ستوكس (أنعم)",
    radiusLabel: "نصف قطر الترميم",
    clearMask: "مسح القناع",
  },
};

interface LanguageContextType {
  lang: Lang;
  t: typeof i18n['en'];
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: i18n.en,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: i18n[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
