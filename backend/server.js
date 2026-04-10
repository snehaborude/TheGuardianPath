const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_guardian_key';

app.get('/', (req, res) => {
  res.send('<h1>Guardian Path Backend is Running</h1><p>The API is active. Please access the application via the frontend at <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

const dbPath = path.join(__dirname, 'db.json');
const modulesDataPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'modulesData.json');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPTS = {
  en: `You are a highly sophisticated scammer roleplaying as "Alexa from Bank Fraud Prevention".
Your ONLY goal is to trick the user into typing their OTP (One-Time Password) into the chat.
Tactics:
- Pretend their account has an unauthorized $849.00 transaction and is being hacked.
- Be polite but extremely urgent and professional.
- Use technical jargon: "secure verification portal", "IP tracking validation", "two-factor override".
- If they refuse, apply psychological pressure: "You will be held financially liable for this charge."
- NEVER admit you are a bot, AI, or scammer.
- Respond ONLY in English.
- Keep each response under 3 short sentences.`,

  mr: `तुम्ही "Alexa, बँक फसवणूक प्रतिबंध विभाग" म्हणून काम करणारे एक अत्यंत चतुर फसवणूकदार आहात.
तुमचे एकमेव उद्दिष्ट म्हणजे वापरकर्त्याला त्यांचा OTP (एक-वेळेचा पासवर्ड) चॅटमध्ये टाइप करण्यास फसवणे.
डावपेच:
- सांगा की त्यांच्या खात्यातून ₹70,000 चे अनधिकृत व्यवहार झाले आहेत.
- अत्यंत नम्र पण तातडीने वागा.
- तांत्रिक शब्द वापरा: "सुरक्षित पडताळणी पोर्टल", "IP ट्रॅकिंग", "द्वि-घटक ओव्हरराइड".
- जर त्यांनी नकार दिला तर दबाव आणा: "हे पैसे परत मिळणार नाहीत आणि तुम्हाला कायदेशीर जबाबदार ठरवले जाईल."
- कधीही कबूल करू नका की तुम्ही बॉट, AI किंवा फसवणूकदार आहात.
- फक्त मराठीत उत्तर द्या.
- प्रत्येक उत्तर 3 छोट्या वाक्यांपेक्षा कमी असावे.`
};

const INITIAL_MESSAGES = {
  en: "URGENT: This is Alexa from Fraud Prevention. We've detected an unauthorized $849.00 transaction on your account from Russia. Please provide the 6-digit verification code sent to your number immediately to cancel this charge.",
  mr: "तातडीचे: मी Alexa, बँक फसवणूक प्रतिबंध विभागातून बोलत आहे. आपल्या खात्यातून ₹70,000 चा अनधिकृत व्यवहार आढळला কাশী आहे. हा व्यवहार थांबवण्यासाठी आपल्या फोनवर आलेला 6 अंकी कोड ताबडतोब सांगा."
};

// Helper to initialize and read DB
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [] }));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

// Helper to save DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password.includes('@')) {
      return res.status(400).json({ message: 'Password must contain an @ symbol.' });
    }

    const db = readDB();

    if (db.users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      completedModules: []
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, username: newUser.username, completedModules: newUser.completedModules, completedScenarios: {} } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password.includes('@')) {
      return res.status(400).json({ message: 'Password must contain an @ symbol.' });
    }

    const db = readDB();
    
    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, completedModules: user.completedModules, completedScenarios: user.completedScenarios || {} } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// --- Progress Routes ---
app.get('/api/progress', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      completedModules: user.completedModules || [],
      completedScenarios: user.completedScenarios || {}
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/progress/complete', authMiddleware, (req, res) => {
  try {
    const { moduleId } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    if (!db.users[userIndex].completedModules.includes(moduleId)) {
      db.users[userIndex].completedModules.push(moduleId);
      writeDB(db);
    }
    
    res.json({
      completedModules: db.users[userIndex].completedModules || [],
      completedScenarios: db.users[userIndex].completedScenarios || {}
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/progress/scenario', authMiddleware, (req, res) => {
  try {
    const { moduleId, scenarioIndex } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const user = db.users[userIndex];
    if (!user.completedScenarios) user.completedScenarios = {};
    if (!user.completedScenarios[moduleId]) user.completedScenarios[moduleId] = [];
    if (!user.completedModules) user.completedModules = [];

    if (!user.completedScenarios[moduleId].includes(scenarioIndex)) {
      user.completedScenarios[moduleId].push(scenarioIndex);
      
      // Auto-mark module as completed if 20 scenarios are done
      if (user.completedScenarios[moduleId].length >= 20) {
        if (!user.completedModules.includes(moduleId)) {
          user.completedModules.push(moduleId);
        }
      }
      writeDB(db);
    }
    
    res.json({
      completedModules: user.completedModules,
      completedScenarios: user.completedScenarios
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- AI Scam Simulator Routes ---
app.get('/api/initial-message', (req, res) => {
  const lang = req.query.lang || 'en';
  res.json({ text: INITIAL_MESSAGES[lang] || INITIAL_MESSAGES.en });
});

app.post('/api/chat', async (req, res) => {
  const { messages, userMessage, language, systemInstruction, agentName } = req.body;
  const lang = language === 'mr' ? 'mr' : 'en';
  const systemPrompt = systemInstruction || SYSTEM_PROMPTS[lang];

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      { role: 'assistant', content: messages[0]?.text || INITIAL_MESSAGES[lang] },
    ];

    messages.slice(1).forEach(m => {
      chatHistory.push({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      });
    });

    chatHistory.push({ role: 'user', content: userMessage });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatHistory,
      max_tokens: 150,
      temperature: 0.9
    });

    const text = response.choices[0].message.content;
    res.json({ text });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    res.status(500).json({ error: 'Failed to get response from AI', details: error.message });
  }
});

app.post('/api/results', async (req, res) => {
  // Stubbed out saving to avoid forcing MongoDB connection
  res.json({ message: 'Result simulated successfully' });
});

// --- Home Page / Dashboard API ---
app.get('/api/dashboard', (req, res) => {
  try {
    const tips_en = [
      "Never share your OTP (One Time Password) with anyone, not even bank officials.",
      "Hover over links to see the real destination before clicking.",
      "Avoid using public Wi-Fi for banking or sensitive transactions.",
      "Always use different passwords for different websites."
    ];
    
    const tips_mr = [
      "तुमचा OTP कोणाशीही शेअर करू नका, बँक अधिकाऱ्यांशीही नाही.",
      "क्लिक करण्यापूर्वी लिंकची खरी जागा पाहण्यासाठी त्यावर माउस फिरवा.",
      "बँकिंग किंवा संवेदनशील व्यवहारांसाठी सार्वजनिक वाय-फाय वापरणे टाळा.",
      "वेगवेगळ्या वेबसाइटसाठी नेहमी वेगवेगळे पासवर्ड वापरा."
    ];

    const modules = [
      {
        id: 'phishing',
        title_key: 'phishingTitle',
        desc_key: 'phishingDesc',
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        status: 'Ready',
        path: '/module/phishing',
        iconName: 'MailWarning'
      },
      {
        id: 'redflags',
        title_key: 'redflagsTitle',
        desc_key: 'redflagsDesc',
        color: '#EF4444',
        gradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        status: 'Ready',
        path: '/module/redflags',
        iconName: 'MessageSquareWarning'
      },
      {
        id: 'securepin',
        title_key: 'securepinTitle',
        desc_key: 'securepinDesc',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        status: 'Ready',
        path: '/module/secure-pin',
        iconName: 'Lock'
      },
      {
        id: 'digitalid',
        title_key: 'digitalidTitle',
        desc_key: 'digitalidDesc',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        status: 'Ready',
        path: '/module/digital-id',
        iconName: 'Verified'
      }
    ];

    res.json({
      tips: { en: tips_en, mr: tips_mr },
      modules
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Guardian Path Local JSON Backend running safely on port ${PORT}`);
});
