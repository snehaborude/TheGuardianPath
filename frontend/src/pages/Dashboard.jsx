import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailWarning, Lock, Play, Star, BookOpen, MessageSquareWarning, Verified, Award, Bot, Megaphone, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import VoiceButton from '../components/VoiceButton';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { completedModules, completedScenarios, isComplete } = useProgress();

  const totalModules = 4;

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
        <h1 style={{ fontSize: '3rem', display: 'flex', alignItems: 'center' }}>
          {t('welcome')}
          <VoiceButton text={t('welcome') + ". " + t('safeSpace')} />
        </h1>
        <p style={{ fontSize: '1.4rem', maxWidth: '900px', fontWeight: '500' }}>
          {t('safeSpace')}
        </p>
      </div>

      <motion.div 
        className="progress-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '50%', border: '4px solid #000', position: 'relative' }}>
          <Star size={48} color="var(--accent-primary)" />
          {completedModules.length === totalModules && (
            <div style={{ position: 'absolute', top: -10, right: -10, background: 'gold', borderRadius: '50%', padding: '0.2rem', border: '2px solid black' }}>
              <Award size={24} color="#000" />
            </div>
          )}
        </div>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center' }}>
            {t('score')}: {completedModules.length} / {totalModules} {completedModules.length === totalModules ? "🏆" : ""}
            <VoiceButton text={`${t('score')} is ${completedModules.length} out of ${totalModules}.`} />
          </h2>
          <p style={{ fontSize: '1.2rem' }}>
            {completedModules.length === totalModules ? "You have mastered all safety skills!" : t('startHere')}
          </p>
        </div>
      </motion.div>

      {/* New Upcoming Labs Section */}
      <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #E2E8F0', paddingBottom: '1rem' }}>
          <Star className="text-warning" size={32} /> Innovation Labs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', padding: '2.5rem', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} whileHover={{ scale: 1.02 }} onClick={() => navigate('/module/ai-scam-simulator')}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', width: 'fit-content', marginBottom: '1.5rem' }}>
                <Bot size={40} color="#818CF8" />
             </div>
             <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>AI Scam Simulator</h3>
             <p style={{ fontSize: '1.4rem', color: '#C7D2FE', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>Chat with an AI chatbot designed to mimic modern phone scammers. Learn to identify their psychological tricks.</p>
             <button style={{ background: '#4F46E5', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={(e) => { e.stopPropagation(); navigate('/module/ai-scam-simulator'); }}><Play size={18} /> Launch Simulator</button>
             <div style={{ position: 'absolute', top: '-5px', right: '-5px', opacity: 0.1, zIndex: 0 }}><Bot size={180} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)', padding: '2.5rem', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', width: 'fit-content', marginBottom: '1.5rem' }}>
                <Megaphone size={40} color="#FCA5A5" />
             </div>
             <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Community Siren</h3>
             <p style={{ fontSize: '1.4rem', color: '#FECACA', lineHeight: '1.6', marginBottom: '0', flex: 1 }}>Report local scams happening in your area to alert your neighbors and stay informed.</p>
             <div style={{ position: 'absolute', top: '-5px', right: '-5px', opacity: 0.1 }}><Megaphone size={180} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)', padding: '2.5rem', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', width: 'fit-content', marginBottom: '1.5rem' }}>
                <Video size={40} color="#6EE7B7" />
             </div>
             <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Deepfake Lab</h3>
             <p style={{ fontSize: '1.4rem', color: '#A7F3D0', lineHeight: '1.6', marginBottom: '0', flex: 1 }}>Train your eyes to spot AI-generated videos and voices trying to impersonate family members.</p>
             <div style={{ position: 'absolute', top: '-5px', right: '-5px', opacity: 0.1 }}><Video size={180} /></div>
          </motion.div>

        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #E2E8F0', paddingBottom: '1rem' }}>
          <BookOpen className="text-secondary" size={32} /> {t('courses')}
        </h2>
        
        <div className="module-grid">
          {modules.map((mod, index) => {
            const completed = isComplete(mod.id);
            return (
              <motion.div 
                key={mod.id} 
                className="module-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ border: completed ? '3px solid var(--accent-success)' : '3px solid #CBD5E1' }}
              >
                {completed && (
                  <span className="badge" style={{ background: 'var(--accent-success)', color: 'white', border: 'none' }}>
                    <Verified size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    Mastered
                  </span>
                )}
                <div className="module-icon-wrap" style={{ 
                  background: completed ? '#D1FAE5' : `${mod.color}15`, 
                  color: completed ? 'var(--accent-success)' : mod.color, 
                  border: `3px solid ${completed ? 'var(--accent-success)' : mod.color}` 
                }}>
                  {mod.icon}
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {mod.title}
                  <VoiceButton text={mod.title + ". " + mod.description} />
                </h3>
                <p style={{ flex: 1, fontSize: '1.3rem', color: '#475569', marginBottom: '1rem' }}>{mod.description}</p>
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#334155', fontSize: '1.2rem', fontWeight: '700', border: '1px solid #E2E8F0' }}>
                  <span style={{ background: '#2563EB', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '6px', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                    {completedScenarios[mod.id]?.length || 0} / 20
                  </span> Interactive Practice Scenarios
                </div>

                <button 
                  className={completed ? 'btn-success' : (mod.status === 'Ready' ? 'btn-primary' : 'btn-secondary')}
                  style={{ width: '100%', marginTop: '2rem' }}
                  onClick={() => mod.status === 'Ready' && navigate(mod.path)}
                  disabled={mod.status !== 'Ready'}
                >
                  {mod.status === 'Ready' ? (
                    <>
                      <Play size={24} /> {completed ? "Review Module" : t('begin')}
                    </>
                  ) : (
                    t('comingSoon')
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
