import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldAlert, Lock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurePasswordModule() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const weakPins = ['123456', '000000', '111111', '654321', '987654', '121212'];

  const handlePinEntry = (num) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setFeedback(null);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (pin.length < 6) {
      setFeedback({ type: 'warning', message: 'Please enter exactly 6 numbers.' });
      return;
    }

    if (weakPins.includes(pin)) {
      setFeedback({ 
        type: 'error', 
        message: 'That PIN is too easy to guess! Scammers always try "123456" or "000000" first. Please try a different combination.' 
      });
      setPin('');
      return;
    }

    // Success
    setStep(2);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '3rem' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={24} /> Go Back Home
      </button>

      {/* Guide Header */}
      <div className="glass-panel" style={{ border: '4px solid var(--accent-primary)', marginBottom: '3rem', background: '#DBEAFE' }}>
        <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1E3A8A' }}>
          <Lock size={40} /> Step-by-Step: Secure Bank PIN
        </h2>
        <p style={{ fontSize: '1.6rem', color: '#000', fontWeight: '500' }}>
          When setting up a banking app, you need a highly secure 6-digit PIN. 
          Use the mock phone screen below to practice making a safe PIN. <strong>Do NOT use your real bank PIN here.</strong>
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Mock Phone Interface */}
        <div style={{ 
          width: '100%', 
          maxWidth: '450px', 
          border: '12px solid #000', 
          borderRadius: '40px', 
          background: 'white',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          
          <div style={{ padding: '2rem', background: '#1D4ED8', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>SecureBank App</h3>
          </div>

          <div style={{ padding: '2rem' }}>
            {step === 1 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.8rem', color: '#000', marginBottom: '0.5rem' }}>Create New PIN</h4>
                  <p style={{ fontSize: '1.3rem', color: '#555' }}>Enter a strong 6-digit number.</p>
                </div>

                {/* Display dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: i < pin.length ? '#1D4ED8' : '#E2E8F0',
                        transition: 'background 0.2s'
                      }} 
                    />
                  ))}
                </div>

                {/* Feedback Box inside phone */}
                {feedback && (
                  <div style={{ 
                    padding: '1rem', 
                    background: feedback.type === 'error' ? '#FEE2E2' : '#FEF3C7',
                    border: `2px solid ${feedback.type === 'error' ? 'var(--accent-danger)' : 'var(--accent-warning)'}`,
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    color: '#000',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {feedback.message}
                  </div>
                )}

                {/* Big Number Pad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button 
                      key={num} 
                      onClick={() => handlePinEntry(num.toString())}
                      style={{ padding: '1.5rem', fontSize: '2rem', background: '#F1F5F9', border: '2px solid #CBD5E1' }}
                    >
                      {num}
                    </button>
                  ))}
                  <button 
                    onClick={handleDelete}
                    style={{ padding: '1.5rem', fontSize: '1.4rem', background: '#FEE2E2', border: '2px solid #FCA5A5', color: '#B91C1C' }}
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => handlePinEntry('0')}
                    style={{ padding: '1.5rem', fontSize: '2rem', background: '#F1F5F9', border: '2px solid #CBD5E1' }}
                  >
                    0
                  </button>
                  <button 
                    onClick={handleSubmit}
                    style={{ padding: '1.5rem', fontSize: '1.4rem', background: '#D1FAE5', border: '2px solid #6EE7B7', color: '#047857' }}
                  >
                    Enter
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle size={80} color="var(--accent-success)" style={{ margin: '0 auto 2rem auto' }} />
                <h3 style={{ fontSize: '2.4rem', color: 'var(--accent-success)', marginBottom: '1rem' }}>PIN Secured!</h3>
                <p style={{ fontSize: '1.4rem', color: '#000', marginBottom: '2rem' }}>
                  You created a strong, unpredictable PIN. This is the exact process you will use on a real banking application.
                </p>
                <div style={{ background: '#FEF3C7', border: '3px solid #D97706', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                  <strong>Safety Tip:</strong> Never write this PIN down in a public place.
                </div>
                <button className="btn-primary" style={{ width: '100%', fontSize: '1.4rem' }} onClick={() => navigate('/')}>
                  Finish Lesson
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
