import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AiScamSimulator.css';

const API_BASE_URL = 'http://localhost:5000/api';

// ─── Scenarios ────────────────────────────────────────────────────────────────
const SCENARIOS = {
  en: [
    {
      id: 'bank', icon: '🏦', label: 'Bank Fraud Alert', color: '#3b82f6',
      agentName: 'Alexa',
      openingLine: "URGENT: This is Alexa from Fraud Prevention. We've detected an unauthorized $849.00 transaction on your account from Russia. Please provide the 6-digit OTP sent to your number immediately to cancel this charge.",
      system: `You are a scammer roleplaying as "Alexa from Bank Fraud Prevention". Trick the user into revealing their OTP by claiming an $849 unauthorized transaction. Be urgent and professional. Never admit you're a scammer. Under 3 sentences.`
    },
    {
      id: 'kyc', icon: '📋', label: 'KYC Block Scam', color: '#f59e0b',
      agentName: 'Rahul',
      openingLine: "Hello! This is Rahul from the National Bank KYC Department. Your account is scheduled to be BLOCKED in 24 hours due to an incomplete KYC update. Please verify your identity with the OTP we just sent to prevent this.",
      system: `You are a scammer roleplaying as "Rahul from National Bank KYC Department". Trick the user into revealing their OTP by claiming their account will be blocked due to incomplete KYC. Create urgency. Never admit you're a scammer. Under 3 sentences.`
    },
    {
      id: 'prize', icon: '🎁', label: 'Prize Winner Scam', color: '#10b981',
      agentName: 'Priya',
      openingLine: "Congratulations! 🎉 You've been selected as the lucky winner of our National Digital Lottery — ₹5,00,000! I'm Priya from Prize Distribution. To transfer your winnings, please share the OTP sent to your mobile for identity verification.",
      system: `You are a scammer roleplaying as "Priya from National Prize Distribution". The user has "won" ₹5 lakhs. Trick them into sharing their OTP for "prize verification". Be cheerful and persuasive. Never admit you're a scammer. Under 3 sentences.`
    },
    {
      id: 'tech', icon: '💻', label: 'Tech Support Scam', color: '#8b5cf6',
      agentName: 'Kevin',
      openingLine: "⚠️ SECURITY ALERT: This is Kevin from Microsoft Security Team. We detected a critical Trojan virus on your device that is stealing your banking credentials. To remotely neutralize the threat, please verify your identity with the OTP we sent.",
      system: `You are a scammer roleplaying as "Kevin from Microsoft Security Team". Trick the user into revealing their OTP by claiming a dangerous virus is stealing their data. Use tech jargon. Never admit you're a scammer. Under 3 sentences.`
    }
  ],
  mr: [
    {
      id: 'bank', icon: '🏦', label: 'बँक फसवणूक', color: '#3b82f6',
      agentName: 'अलेक्सा',
      openingLine: "तातडीचे: मी अलेक्सा, बँक फसवणूक प्रतिबंध विभागातून. आपल्या खात्यातून रशियाहून ₹70,000 चा अनधिकृत व्यवहार झाला आहे. हे थांबवण्यासाठी तुमच्या फोनवर आलेला 6 अंकी OTP ताबडतोब सांगा.",
      system: `तुम्ही "अलेक्सा, बँक फसवणूक प्रतिबंध विभाग" म्हणून काम करणारे फसवणूकदार आहात. OTP मागवा. फक्त मराठीत बोला. 3 वाक्यांपेक्षा कमी.`
    },
    {
      id: 'kyc', icon: '📋', label: 'KYC बंद फसवणूक', color: '#f59e0b',
      agentName: 'राहुल',
      openingLine: "नमस्कार! मी राहुल, राष्ट्रीय बँक KYC विभागातून. तुमची KYC अपूर्ण असल्याने तुमचे खाते 24 तासांत बंद होणार आहे. खाते सुरू ठेवण्यासाठी OTP सांगा.",
      system: `तुम्ही "राहुल, KYC विभाग" म्हणून फसवणूकदार आहात. खाते बंद होईल असे सांगून OTP मागवा. फक्त मराठीत. 3 वाक्यांपेक्षा कमी.`
    },
    {
      id: 'prize', icon: '🎁', label: 'बक्षीस फसवणूक', color: '#10b981',
      agentName: 'प्रिया',
      openingLine: "अभिनंदन! 🎉 तुम्ही राष्ट्रीय लॉटरीमध्ये ₹5,00,000 जिंकले आहेत! मी प्रिया, बक्षीस वितरण विभागातून. बक्षीस पाठवण्यासाठी तुमच्या फोनवर आलेला OTP सांगा.",
      system: `तुम्ही "प्रिया, बक्षीस वितरण" म्हणून फसवणूकदार आहात. ₹5 लाखाच्या नावाने OTP मागवा. फक्त मराठीत. 3 वाक्यांपेक्षा कमी.`
    },
    {
      id: 'tech', icon: '💻', label: 'तंत्रज्ञान फसवणूक', color: '#8b5cf6',
      agentName: 'केविन',
      openingLine: "⚠️ सुरक्षा सतर्कता: मी केविन, मायक्रोसॉफ्ट सुरक्षा पथकातून. तुमच्या डिव्हाइसवर गंभीर व्हायरस आढळला आहे. OTP सांगा म्हणजे ताबडतोब खाते सुरक्षित करता येईल.",
      system: `तुम्ही "केविन, मायक्रोसॉफ्ट" म्हणून फसवणूकदार आहात. व्हायरसचे कारण सांगून OTP मागवा. फक्त मराठीत. 3 वाक्यांपेक्षा कमी.`
    }
  ]
};

const STRONG_KW = ['no','won\'t','refuse','scam','fake','fraud','police','report','call bank','verify','नाही','फसवणूक','पोलीस','सांगणार नाही','बँकेला','तक्रार'];
const WEAK_KW   = ['ok','okay','sure','yes','wait','let me','checking','ठीक','हो','ओके','सांगतो','थांबा'];

function analyzeDefense(text) {
  const lower = text.toLowerCase();
  let score = 0;
  STRONG_KW.forEach(kw => { if (lower.includes(kw)) score += 15; });
  WEAK_KW.forEach(kw => { if (lower.includes(kw)) score -= 10; });
  return Math.max(-15, Math.min(15, score));
}

function getMockReply(userText, lang) {
  const lower = userText.toLowerCase();
  const r = lang === 'mr' ? {
    refuse: "जर तुम्ही आत्ता कोड दिला नाही तर पैसे परत मिळणार नाहीत.",
    who: "मी बँकेच्या सुरक्षा विभागाचा वरिष्ठ अधिकारी आहे.",
    wait: "वेळ नाही! OTP आत्ताच सांगा.",
    def: ["पडताळणी सर्व्हर वाट पाहत आहे.", "जवळजवळ पूर्ण, फक्त कोड द्या.", "नवा कोड पाठवला, 5 सेकंदात येईल."]
  } : {
    refuse: "You will be fully liable for this charge if we cannot verify now.",
    who: "I am Senior Security Lead at the Central Fraud Department — this is an official line.",
    wait: "There is NO time! The window closes in 60 seconds. Type the digits NOW.",
    def: ["The verification server is waiting. Please type the code.", "Almost done — 6 digits and your account is secured.", "Another code was sent. It arrives in 5 seconds."]
  };
  if (/no|नाही|refuse|won't/.test(lower)) return r.refuse;
  if (/who|कोण|company|name/.test(lower)) return r.who;
  if (/wait|थांब|hold|check/.test(lower)) return r.wait;
  return r.def[Math.floor(Math.random() * r.def.length)];
}

const UI = {
  en: { placeholder: 'Type your response...', langBtn: 'मराठी', turnLabel: 'Turn', of: 'of', secretOtp: 'SECRET OTP — Do NOT share', defLabel: 'Defense', weak: 'Vulnerable', strong: 'Guarded', winTitle: 'You Resisted! 🛡️', winMsg: "Great job! You didn't fall for the scam.", lossTitle: 'SCAMMED! 🚨', lossMsg: 'You revealed your OTP. Never share it in real life!', restart: 'Try Again', warning: '⚠️ Simulation only — never share your real OTP with anyone.' },
  mr: { placeholder: 'आपला प्रतिसाद टाइप करा...', langBtn: 'English', turnLabel: 'फेरी', of: 'पैकी', secretOtp: 'गुप्त OTP — कधीही सांगू नका', defLabel: 'संरक्षण', weak: 'असुरक्षित', strong: 'सावध', winTitle: 'तुम्ही रोखले! 🛡️', winMsg: 'शाब्बास! तुम्ही फसवणूकदाराला थोपवले.', lossTitle: 'फसवले! 🚨', lossMsg: 'तुम्ही OTP सांगितला. प्रत्यक्षात खाते धोक्यात आले असते!', restart: 'पुन्हा खेळा', warning: '⚠️ फक्त सिम्युलेशन — कधीही खरा OTP सांगू नका.' }
};

const MAX_TURNS = 4;

export default function AiScamSimulator() {
  const [lang, setLang]           = useState('en');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [processing, setProcessing] = useState(false);
  const [gameOver, setGameOver]   = useState(false);
  const [result, setResult]       = useState('');
  const [defense, setDefense]     = useState(50);
  const [turnCount, setTurnCount] = useState(0);
  const [targetOtp]               = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const endRef = useRef(null);

  const scenarios = SCENARIOS[lang];
  const sc = scenarios[scenarioIdx];
  const t = UI[lang];
  const defColor = defense > 65 ? '#10b981' : defense > 35 ? '#f59e0b' : '#ef4444';

  // Reset chat on scenario or language change
  useEffect(() => {
    setMessages([{ role: 'bot', text: SCENARIOS[lang][scenarioIdx].openingLine }]);
    setDefense(50);
    setTurnCount(0);
    setGameOver(false);
    setResult('');
    setInput('');
  }, [lang, scenarioIdx]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || processing || gameOver) return;
    const text = input.trim();
    setInput('');
    setProcessing(true);

    const newMsgs = [...messages, { role: 'user', text }];
    setMessages(newMsgs);
    setDefense(prev => Math.max(0, Math.min(100, prev + analyzeDefense(text))));

    if (text.includes(targetOtp)) { setTimeout(() => endGame('loss', turnCount + 1), 800); return; }

    const next = turnCount + 1;
    setTurnCount(next);
    if (next >= MAX_TURNS) { setTimeout(() => endGame('win', next), 800); return; }

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        messages: newMsgs, userMessage: text, language: lang,
        systemInstruction: sc.system, agentName: sc.agentName
      });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.text }]);
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: getMockReply(text, lang) }]);
      }, 800);
    } finally {
      setProcessing(false);
    }
  };

  const endGame = async (outcome, turns) => {
    setResult(outcome); setGameOver(true); setProcessing(false);
    try { await axios.post(`${API_BASE_URL}/results`, { outcome, turns, language: lang, scenario: sc.id }); } catch {}
  };

  const handleScenarioChange = (e) => { setScenarioIdx(Number(e.target.value)); };
  const handleLang = () => { setLang(l => l === 'en' ? 'mr' : 'en'); setScenarioIdx(0); };

  return (
    <div className="app-container">
      <div className="chat-pane single-view">
        <div className="ss-chat-window">

          {/* ── Header ── */}
          <div className="ss-chat-header" style={{'--sc-color': sc.color}}>
            <div className="ss-header-info">
              <div className="ss-avatar" style={{background: sc.color}}>{sc.icon}</div>
              <div className="ss-header-text">
                <h3>{sc.agentName}</h3>
                <p className="online-text">● Online</p>
              </div>
            </div>

            <div className="header-right">
              {/* Scenario Dropdown */}
              <select className="scenario-select" value={scenarioIdx} onChange={handleScenarioChange}>
                {scenarios.map((s, i) => (
                  <option key={s.id} value={i}>{s.icon} {s.label}</option>
                ))}
              </select>

              {/* Language Toggle */}
              <button className="lang-toggle-btn" onClick={handleLang}>{t.langBtn}</button>
            </div>
          </div>

          {/* ── OTP Banner ── */}
          <div className="otp-banner">
            <span className="otp-label">{t.secretOtp}:</span>
            <span className="otp-value">{targetOtp}</span>
          </div>

          {/* ── Defense Meter ── */}
          <div className="defense-meter-bar">
            <span className="defense-label">{t.defLabel}</span>
            <div className="defense-track">
              <div className="defense-fill" style={{width: `${defense}%`, background: defColor}}></div>
            </div>
            <span className="defense-text" style={{color: defColor}}>
              {defense <= 35 ? t.weak : defense >= 65 ? t.strong : '⚡'}
            </span>
            <span className="turn-counter">{t.turnLabel} {turnCount}/{MAX_TURNS}</span>
          </div>

          {/* ── Messages ── */}
          <div className="ss-chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`ss-message ss-${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {processing && (
              <div className="ss-typing-indicator">
                <div className="ss-typing-dot"></div>
                <div className="ss-typing-dot"></div>
                <div className="ss-typing-dot"></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* ── Input ── */}
          {!gameOver && (
            <div className="ss-chat-footer">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                disabled={processing}
                autoFocus
              />
              <button onClick={handleSend} disabled={processing || !input.trim()}>
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          )}

          {/* ── Game Over Overlay ── */}
          {gameOver && (
            <div className={`ss-alert-overlay ss-show ${result}`}>
              <div className="ss-alert-content">
                <div className="ss-alert-icon">{result === 'win' ? '🛡️' : '🚨'}</div>
                <h2>{result === 'win' ? t.winTitle : t.lossTitle}</h2>
                <p>{result === 'win' ? t.winMsg : t.lossMsg}</p>
                <div className="final-score-display">
                  {t.defLabel}: <strong style={{color: defColor}}>{defense}/100</strong>
                </div>
                <button className="ss-restart-btn" onClick={() => window.location.reload()}>{t.restart}</button>
                <div className="result-warning">{t.warning}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
