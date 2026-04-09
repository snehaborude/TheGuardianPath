import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const risks = [
  {
    id: 'sender',
    text: 'security@chase-bank-alert.com',
    explanation: 'Fake Email Address: Banks use short, official addresses (like @chase.com). This long, complicated address is a fake.',
    found: false
  },
  {
    id: 'urgency',
    text: 'URGENT: Your Account Will Be Closed Today',
    explanation: 'Fake Panic: Scammers try to scare you into acting quickly without thinking. Real banks will not threaten you like this.',
    found: false
  },
  {
    id: 'link',
    text: 'Click Here to Verify Your Identity',
    explanation: 'Dangerous Button: This button will take you to a fake website to steal your password. Never click buttons in unexpected emails.',
    found: false
  },
  {
    id: 'greeting',
    text: 'Dear Valued Customer,',
    explanation: 'Impersonal Greeting: Your real bank knows your name. Scammers use words like "Customer" because they don\'t actually know who you are.',
    found: false
  }
];

export default function PhishingModule() {
  const navigate = useNavigate();
  const [foundStatus, setFoundStatus] = useState(
    risks.reduce((acc, risk) => ({ ...acc, [risk.id]: false }), {})
  );
  const [activeInfo, setActiveInfo] = useState(null);

  const handleRiskClick = (id) => {
    setFoundStatus(prev => ({ ...prev, [id]: true }));
    const risk = risks.find(r => r.id === id);
    setActiveInfo(risk);
    
    // Automatically scroll to the explanation message for clarity
    setTimeout(() => {
      document.getElementById('learning-insights').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const foundCount = Object.values(foundStatus).filter(Boolean).length;
  const isComplete = foundCount === risks.length;

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={24} /> Go Back Home
      </button>

      <div className="glass-panel" style={{ marginBottom: '3rem', border: '4px solid var(--accent-warning)', background: '#FEF3C7' }}>
        <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#B45309' }}>
          <AlertTriangle size={40} /> Instructions: Find the Tricks
        </h2>
        <p style={{ fontSize: '1.5rem', color: '#000', fontWeight: '500' }}>
          Below is a fake email. It is trying to trick you. 
          There are <strong>{risks.length} mistakes</strong> that show it is fake.
          Please <strong>click or tap on the mistakes</strong> when you find them.
        </p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(foundCount / risks.length) * 100}%` }}></div>
        </div>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
          You have found: {foundCount} out of {risks.length} mistakes
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Email Simulator */}
        <div className="sandbox-environment">
          <div className="sandbox-header">
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Your Email Inbox</span>
          </div>
          
          <div className="sandbox-content">
            <div className="mock-email">
              <div className="mock-email-header">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Subject: <span 
                    className={`clickable-risk ${foundStatus.urgency ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('urgency')}
                  >
                    {risks.find(r => r.id === 'urgency').text}
                  </span>
                </div>
                <div style={{ fontSize: '1.4rem', color: '#000', marginBottom: '1rem' }}>
                  <strong>From: </strong> Chase Bank Support &lt;
                  <span 
                    className={`clickable-risk ${foundStatus.sender ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('sender')}
                  >
                    {risks.find(r => r.id === 'sender').text}
                  </span>&gt;
                </div>
                <div style={{ fontSize: '1.2rem', color: '#555' }}>Sent Today at 10:23 AM</div>
              </div>

              <div style={{ lineHeight: '1.8' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  <span 
                    className={`clickable-risk ${foundStatus.greeting ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('greeting')}
                  >
                    {risks.find(r => r.id === 'greeting').text}
                  </span>
                </p>
                
                <p style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  Your bank account has been locked due to suspicious activity. We need you to verify your identity right now.
                </p>

                <p style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
                  If you do not verify your identity, your money will be frozen forever.
                </p>

                <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem' }}>
                  <span 
                    className={`clickable-risk ${foundStatus.link ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('link')}
                    style={{ 
                      display: 'inline-block', 
                      background: '#1D4ED8', 
                      color: 'white', 
                      padding: '1.5rem 3rem', 
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                      border: '4px dashed white',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {risks.find(r => r.id === 'link').text}
                  </span>
                </div>

                <p style={{ color: '#555', fontSize: '1.2rem' }}>
                  Thank you,<br/>
                  The Security Department
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div id="learning-insights" className="glass-panel" style={{ background: '#F8FAFC' }}>
          {isComplete ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <CheckCircle size={80} className="text-success" style={{ margin: '0 auto 1.5rem auto' }} />
              <h3 style={{ fontSize: '3rem', color: 'var(--accent-success)', marginBottom: '1rem' }}>Great Job!</h3>
              <p style={{ fontSize: '1.6rem', fontWeight: '500', marginBottom: '2rem' }}>
                You successfully found every single trick in this fake email. You are safer now.
              </p>
              <button className="btn-success" style={{ width: '100%', maxWidth: '400px' }} onClick={() => navigate('/')}>
                Go Back Home
              </button>
            </motion.div>
          ) : (
            <div>
              <h3 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #CBD5E1', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <Info size={36} className="text-primary" /> What Did You Find?
              </h3>
              
              {activeInfo ? (
                <motion.div key={activeInfo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#D1FAE5', padding: '1.5rem', borderRadius: '12px', border: '4px solid var(--accent-success)' }}>
                  <h4 style={{ color: 'var(--accent-success-hover)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Correct!</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#000', margin: 0 }}>
                    {activeInfo.explanation}
                  </p>
                </motion.div>
              ) : (
                <p style={{ fontSize: '1.5rem', color: '#555', fontWeight: '500' }}>
                  Click on the mistakes in the email above to read about why they are dangerous.
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
