import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, FileText, CheckCircle, Verified, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DigitalIdModule() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '3rem' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={24} /> Go Back Home
      </button>

      {/* Guide Header */}
      <div className="glass-panel" style={{ border: '4px solid var(--accent-primary)', marginBottom: '3rem', background: '#DBEAFE' }}>
        <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1E3A8A' }}>
          <Verified size={40} /> Step-by-Step: Renew Your Digital ID
        </h2>
        <p style={{ fontSize: '1.6rem', color: '#000', fontWeight: '500' }}>
          Governments now use websites for official ID renewals. This is a safe practice sandbox. 
          Follow the steps on the imaginary screen below to see how a real renewal process securely checks your identity.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Mock Computer Interface */}
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          border: '4px solid #CBD5E1', 
          borderRadius: '16px', 
          background: 'white',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          
          <div style={{ padding: '1.5rem 2rem', background: '#0F172A', color: 'white', borderBottom: '4px solid var(--accent-success)' }}>
            <h3 style={{ fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ShieldAlert size={24} /> Official Gov Portal - Secure Form
            </h3>
          </div>

          <div style={{ padding: '3rem' }}>
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h4 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#000' }}>Step 1: Verify Your Face</h4>
                <p style={{ fontSize: '1.5rem', color: '#555', marginBottom: '2rem' }}>
                  To ensure nobody else is using your identity, the system requires a live photograph. 
                </p>
                
                <div style={{ 
                  background: '#F1F5F9', border: '3px dashed #94A3B8', borderRadius: '12px', 
                  padding: '4rem', textAlign: 'center', marginBottom: '3rem'
                }}>
                  <Camera size={80} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
                  <p style={{ fontSize: '1.4rem', color: '#555', marginBottom: '2rem' }}>Camera access is required securely.</p>
                  <button className="btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.6rem' }} onClick={() => setStep(2)}>
                    Click to "Take Photo"
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h4 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#000' }}>Step 2: Consent & Confirmation</h4>
                <p style={{ fontSize: '1.5rem', color: '#555', marginBottom: '2rem' }}>
                  Always read what you are agreeing to before submitting personal records online.
                </p>
                
                <div style={{ 
                  background: '#F8FAFC', border: '2px solid #CBD5E1', borderRadius: '8px', 
                  padding: '2rem', marginBottom: '3rem', height: '200px', overflowY: 'auto'
                }}>
                  <FileText size={32} color="#000" style={{ marginBottom: '1rem' }} />
                  <h5 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#000' }}>Terms of Submission</h5>
                  <p style={{ fontSize: '1.4rem' }}>
                    By submitting this form, you attest that all information is truthful. The government will securely encrypt your photo and data. It will never be shared with advertisers or foreign entities. 
                  </p>
                  <p style={{ fontSize: '1.4rem' }}>
                    WARNING: It is a federal crime to submit falsified documents.
                  </p>
                </div>

                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer',
                  background: isChecked ? '#D1FAE5' : '#F1F5F9', border: `3px solid ${isChecked ? 'var(--accent-success)' : '#CBD5E1'}`, 
                  padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', transition: 'all 0.2s'
                }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '30px', height: '30px' }} 
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#000' }}>
                    I have read and agree to the terms above.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '2rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                  <button 
                    className={isChecked ? 'btn-success' : 'btn-secondary'} 
                    style={{ flex: 2, opacity: isChecked ? 1 : 0.5 }} 
                    disabled={!isChecked}
                    onClick={() => setStep(3)}
                  >
                    Submit Official Renewal
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                <CheckCircle size={100} className="text-success" style={{ margin: '0 auto 2rem auto' }} />
                <h3 style={{ fontSize: '3rem', color: 'var(--accent-success)', marginBottom: '1rem' }}>Success!</h3>
                <p style={{ fontSize: '1.8rem', color: '#000', marginBottom: '1rem' }}>
                  Your "mock" application was submitted perfectly. 
                </p>
                <div style={{ background: '#FEF3C7', border: '3px solid #D97706', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
                  <p style={{ fontSize: '1.5rem', color: '#000', fontWeight: 'bold', margin: 0 }}>
                    Crucial Safety Rule: Once a real government ID page shows success, close your browser window completely so nobody else using the computer can go back and steal your information.
                  </p>
                </div>
                <button className="btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.6rem' }} onClick={() => navigate('/')}>
                  Close Safari/Chrome & Return to Dashboard
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
