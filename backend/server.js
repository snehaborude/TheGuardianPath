const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_guardian_key';

const dbPath = path.join(__dirname, 'db.json');
const modulesDataPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'modulesData.json');

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
