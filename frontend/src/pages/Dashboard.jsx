import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailWarning, Lock, Play, Star, BookOpen, MessageSquareWarning, Verified } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const modules = [
    {
      id: 'phishing',
      title: t('phishingTitle'),
      description: t('phishingDesc'),
      icon: <MailWarning size={40} />,
      color: 'var(--accent-primary)',
      status: 'Ready',
      path: '/module/phishing'
    },
    {
      id: 'redflags',
      title: t('redflagsTitle'),
      description: t('redflagsDesc'),
      icon: <MessageSquareWarning size={40} />,
      color: 'var(--accent-danger)',
      status: 'Ready',
      path: '/module/redflags'
    },
    {
      id: 'securepin',
      title: t('securepinTitle'),
      description: t('securepinDesc'),
      icon: <Lock size={40} />,
      color: 'var(--accent-warning)',
      status: 'Ready',
      path: '/module/secure-pin'
    },
    {
      id: 'digitalid',
      title: t('digitalidTitle'),
      description: t('digitalidDesc'),
      icon: <Verified size={40} />,
      color: 'var(--accent-success)',
      status: 'Ready',
      path: '/module/digital-id'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>{t('welcome')}</h1>
        <p style={{ fontSize: '1.4rem', maxWidth: '900px', fontWeight: '500' }}>
          {t('safeSpace')}
        </p>
      </div>

      <motion.div 
        className="progress-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '50%', border: '4px solid #000' }}>
          <Star size={48} color="var(--accent-primary)" />
        </div>
        <div>
          <h2>{t('score')}: 0 / 4</h2>
          <p style={{ fontSize: '1.2rem' }}>
            {t('startHere')}
          </p>
        </div>
      </motion.div>

      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #E2E8F0', paddingBottom: '1rem' }}>
          <BookOpen className="text-secondary" size={32} /> {t('courses')}
        </h2>
        
        <div className="module-grid">
          {modules.map((mod, index) => (
            <motion.div 
              key={mod.id} 
              className="module-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="module-icon-wrap" style={{ background: `${mod.color}15`, color: mod.color, border: `3px solid ${mod.color}` }}>
                {mod.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{mod.title}</h3>
              <p style={{ flex: 1, fontSize: '1.2rem' }}>{mod.description}</p>
              
              <button 
                className={mod.status === 'Ready' ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', marginTop: '2rem' }}
                onClick={() => mod.status === 'Ready' && navigate(mod.path)}
                disabled={mod.status !== 'Ready'}
              >
                {mod.status === 'Ready' ? (
                  <>
                    <Play size={24} /> {t('begin')}
                  </>
                ) : (
                  t('comingSoon')
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
