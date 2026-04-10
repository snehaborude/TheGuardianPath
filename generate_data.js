const fs = require('fs');

const generatePhishing = () => {
  const result = [];
  const templates = [
    { s: "security@chasey.com", b: "Your account has been locked due to suspicious activity. Please verify your identity immediately.", r: "Suspicious sender domain vs official chase.com." },
    { s: "admin@paypal-update-info.com", b: "Your recent payment of $499.99 was successful. If you did not make this, click the link to cancel.", r: "Fake paypal domain designed to induce panic." },
    { s: "delivery@usps-track-package.net", b: "We tried to deliver your package but nobody was home. Please pay the $1.99 redelivery fee.", r: "USPS will not email asking for a redelivery fee via untrusted links." },
    { s: "irs.gov.alert@gmail.com", b: "Your tax return is ready. Claim your refund by clicking the button below.", r: "The IRS does not use @gmail.com for official communication." },
    { s: "netflix-billing@notflix.com", b: "Your subscription has expired. Update your billing details now to avoid losing access.", r: "Subtle spelling error ('notflix') in the sender domain." },
    { s: "support@amazon-security-team.com", b: "An unauthorized purchase of an iPhone 14 was denied. Please confirm your identity.", r: "Panic-inducing logic; unofficial Amazon domain." },
    { s: "hr@company-internal.com", b: "Mandatory updated employee handbook. Please log in using your Microsoft credentials.", r: "Phishing for work credentials using false urgency." },
    { s: "system@microsoft-update-alert.org", b: "Your password expires in 24 hours. Keep same password here.", r: "Standard credential harvesting trick." },
    { s: "rewards@starbucks-promo.net", b: "Congratulations! You won a $100 gift card. Enter your credit card to pay shipping.", r: "Classic advance-fee fraud logic." },
    { s: "billing@apple-id-verify.com", b: "Your Apple ID was used to sign into a new device in Russia.", r: "Fear-based logic to bypass rational thinking." },
    { s: "ceo@company.com", b: "I am in a meeting. Need you to buy 5 Apple gift cards immediately for a client.", r: "Business Email Compromise (BEC) trap." },
    { s: "vaccine@health-dept.org", b: "Schedule your mandatory booster shot here or face fines.", r: "Authority-based threat logic." },
    { s: "booking@airbnb-support.net", b: "Your reservation in Paris is confirmed. Total: $5,400. Cancel if incorrect.", r: "Inducing panic over large sums of money." },
    { s: "support@coinbase-alert.com", b: "A withdrawal of 0.5 BTC was initiated. Click to halt transaction.", r: "Crypto-focused scam to steal wallet credentials." },
    { s: "shipping@fedex-express.com", b: "Customs duty of $3.50 required for releasing your package.", r: "Small fee logic to extract credit card details." },
    { s: "admin@facebook-security.com", b: "Your page has been reported for copyright and will be deleted in 12 hours.", r: "Time-pressure logic to steal page admin rights." },
    { s: "ticket@traffic-police.gov.in", b: "You have an unpaid speeding ticket. Pay online immediately.", r: "Fake government authority trap." },
    { s: "info@bankofamerica-help.com", b: "Your Zelle transfer of $1,000 to John Doe is processing.", r: "False transaction notification." },
    { s: "careers@google-recruit.com", b: "You have been selected for a remote job paying $150/hr. Send $50 for background check.", r: "Job scam relying on greed/desperation." },
    { s: "support@whatsapp-web.net", b: "Scan this QR code to verify your WhatsApp account.", r: "QR code phishing (Quishing) attempt." }
  ];

  for(let i = 0; i < 20; i++) {
    result.push({
      id: i + 1,
      sender: templates[i].s,
      subject: { en: "URGENT Notice", mr: "तातडीची सूचना" },
      greeting: { en: "Dear User,", mr: "प्रिय वापरकर्ता," },
      body: { en: templates[i].b, mr: templates[i].b },
      risks: [
        { id: 'sender', text: templates[i].s, explanation: { en: templates[i].r, mr: templates[i].r }, found: false },
        { id: 'greeting', text: { en: "Dear User", mr: "Dear User" }, explanation: { en: "Generic greetings are red flags.", mr: "Generic greetings are red flags." }, found: false },
        { id: 'link', text: { en: "Click Here", mr: "येथे क्लिक करा" }, explanation: { en: "Never click suspicious links.", mr: "Never click suspicious links." }, found: false }
      ]
    });
  }
  return result;
};

const generateRedFlags = () => {
  const result = [];
  const texts = [
    "You won a gift card! Click here to claim.",
    "Your grandson is in jail and needs bail money via CashApp.",
    "Hey is this you in this video?? [link]",
    "Your bank asks you to reply with your PIN to verify.",
    "A charity asks for donations via Apple Gift Cards.",
    "We need to verify your account. Please tell me the OTP you just received.",
    "I am a Nigerian prince needing to transfer funds.",
    "Buy 1 get 10 free Ray-Bans sale! 90% off today only.",
    "You have a missed call. Download this APK to listen to voicemails.",
    "IRS: You owe taxes, police will arrive in 1 hour if unpaid.",
    "WhatsApp expiration: Pay $0.99 to keep your account.",
    "Earn $500 a day working from home by typing captchas. Register here.",
    "A friend on Facebook requests you send them money urgently.",
    "Invest $100 and get guaranteed $10,000 back in a week.",
    "You are the 1 millionth visitor! Claim your iPad.",
    "A dating profile immediately asks for travel money to visit you.",
    "Your antivirus has expired. 5 viruses found. Renew now.",
    "Confirm your delivery address for your free sample.",
    "Congratulations! You qualified for government grants.",
    "Your credit score dropped suddenly! Review report here."
  ];

  for (let i = 0; i < 20; i++) {
    result.push({
      id: i + 1,
      type: i % 2 === 0 ? 'sms' : 'email',
      scenario: { en: `Scenario ${i + 1}: Suspicious Message.`, mr: `परिदृश्य ${i + 1}: संशयास्पद संदेश.` },
      message: { en: texts[i], mr: texts[i] },
      question: { en: "What is the biggest red flag here?", mr: "येथील सर्वात मोठा धोक्याचा इशारा कोणता आहे?" },
      options: [
        { id: 'a', text: { en: "It creates false urgency or asks for money/info.", mr: "ती त्वरित पैसे/माहिती मागत आहे." }, isCorrect: true, explanation: { en: "Scammers manipulate your emotions (fear, greed) to act without thinking.", mr: "फसवणूक करणारे तुमच्या भावना घेतात." } },
        { id: 'b', text: { en: "It looks completely harmless.", mr: "ते पूर्णपणे सामान्य दिसते." }, isCorrect: false },
        { id: 'c', text: { en: "The grammar is perfectly fine.", mr: "व्याकरण ठीक आहे." }, isCorrect: false }
      ]
    });
  }
  return result;
};

const generateDigitalId = () => {
  const result = [];
  const scenarios = [
    { t: "Uploading your driver's license to a public Facebook group.", safe: false },
    { t: "Submitting your ID securely on an official .gov portal.", safe: true },
    { t: "Emailing a clear photo of your passport to an untrusted travel agent.", safe: false },
    { t: "Carrying your original SSN card in your wallet daily.", safe: false },
    { t: "Using a secure password manager to store digital copies of documents.", safe: true },
    { t: "Posting a picture of your new credit card online.", safe: false },
    { t: "Verifying your identity on a known banking app using biometric login.", safe: true },
    { t: "Reading your PIN out loud in a crowded coffee shop.", safe: false },
    { t: "Sharing your birth certificate over unencrypted public Wi-Fi.", safe: false },
    { t: "Providing your ID to law enforcement during a traffic stop.", safe: true },
    { t: "Texting pictures of your ID to a landlord you never met.", safe: false },
    { t: "Shredding physical bank statements before throwing them away.", safe: true },
    { t: "Connecting your digital health records to an unverified third-party app.", safe: false },
    { t: "Using Two-Factor Authentication for your email account.", safe: true },
    { t: "Saving your passwords in a plain text file on your desktop.", safe: false },
    { t: "Applying for a passport on the official state department website.", safe: true },
    { t: "Telling your 'banker' your OTP over a phone call they initiated.", safe: false },
    { t: "Setting up a PIN on your mobile device lock screen.", safe: true },
    { t: "Leaving your unlocked laptop unattended in a library.", safe: false },
    { t: "Checking your credit report annually from annualcreditreport.com.", safe: true }
  ];

  for (let i = 0; i < 20; i++) {
    result.push({
      id: i + 1,
      scenario: { en: scenarios[i].t, mr: scenarios[i].t },
      question: { en: "Is this action safe for your Digital Identity?", mr: "ही कृती तुमच्या डिजिटल ओळखीसाठी सुरक्षित आहे का?" },
      options: [
        { id: 'safe', text: { en: "Safe", mr: "सुरक्षित" }, isCorrect: scenarios[i].safe, explanation: { en: scenarios[i].safe ? "Correct! This follows best practices." : "Incorrect! This exposes your identity to thieves.", mr: scenarios[i].safe ? "Correct! This follows best practices." : "Incorrect! This exposes your identity to thieves." } },
        { id: 'unsafe', text: { en: "Unsafe", mr: "असुरक्षित" }, isCorrect: !scenarios[i].safe, explanation: { en: !scenarios[i].safe ? "Correct! It is a known risky behavior." : "Incorrect! This is actually a recommended secure practice.", mr: !scenarios[i].safe ? "Correct! It is a known risky behavior." : "Incorrect! This is actually a recommended secure practice." } }
      ]
    });
  }
  return result;
};

const db = {
  phishing: generatePhishing(),
  redflags: generateRedFlags(),
  securepin: [],
  digitalid: generateDigitalId()
};

fs.mkdirSync('./frontend/src/data', { recursive: true });
fs.writeFileSync('./frontend/src/data/modulesData.json', JSON.stringify(db, null, 2));
console.log("Successfully generated highly logical practice scenarios per module.");
