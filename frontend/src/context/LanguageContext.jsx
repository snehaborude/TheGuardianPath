import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    dashboard: "Return to Dashboard",
    welcome: "Welcome Back!",
    safeSpace: "This is your safe space to practice internet safety. There are absolutely no real risks here. Take your time and learn at your own pace.",
    score: "Your Safety Score",
    courses: "Available Training Courses",
    startHere: "Start Here!",
    begin: "Begin Practice",
    comingSoon: "Coming Soon",
    phishingTitle: "Spot the Fake Email",
    phishingDesc: "Practice spotting fake emails pretending to be from your bank or family.",
    redflagsTitle: "The \"Red Flag\" Detector",
    redflagsDesc: "A quiz showing real world text messages and emails. Can you spot the danger?",
    securepinTitle: "Bank PIN Sandbox",
    securepinDesc: "Simulate setting up a secure PIN on a banking app. Learn why \"123456\" is dangerous.",
    digitalidTitle: "Renew a Digital ID",
    digitalidDesc: "Practice securely uploading photos and navigating an official Government portal."
  },
  mr: { // Marathi
    dashboard: "डॅशबोर्डवर परत जा",
    welcome: "तुमचे पुन्हा स्वागत आहे!",
    safeSpace: "इंटरनेट सुरक्षेचा सराव करण्यासाठी ही तुमची सुरक्षित जागा आहे. येथे कोणतेही धोके नाहीत. तुमचा वेळ घ्या आणि स्वतःच्या गतीने शिका.",
    score: "तुमचा सुरक्षा स्कोअर",
    courses: "उपलब्ध प्रशिक्षण अभ्यासक्रम",
    startHere: "येथून सुरू करा!",
    begin: "सराव सुरू करा",
    comingSoon: "लवकरच येत आहे",
    phishingTitle: "बनावट ईमेल ओळखा",
    phishingDesc: "तुमच्या बँक किंवा कुटुंबाकडून असल्याचा दावा करणारे बनावट ईमेल ओळखण्याचा सराव करा.",
    redflagsTitle: "\"रेड फ्लॅग\" शोधक",
    redflagsDesc: "खरे खुरे मेसेज आणि ईमेल दाखवणारी प्रश्नमंजुषा. तुम्ही धोका ओळखू शकता का?",
    securepinTitle: "बँक पिन सँडबॉक्स",
    securepinDesc: "बँकिंग ॲपवर सुरक्षित पिन सेट करण्याचे सिम्युलेशन. \"123456\" धोकादायक का आहे ते शिका.",
    digitalidTitle: "डिजिटल ओळखपत्र नूतनीकरण",
    digitalidDesc: "सुरक्षितपणे फोटो अपलोड करण्याचा आणि सरकारी पोर्टल वापरण्याचा सराव करा."
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'mr' : 'en');
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
