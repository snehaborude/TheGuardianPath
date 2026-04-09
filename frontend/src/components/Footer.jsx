import React from 'react';
import { ShieldAlert, Heart, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      background: '#0F172A', /* Deep Slate/Navy */
      color: '#F8FAFC',
      borderTop: '4px solid #3B82F6', /* Vibrant Blue Accent */
      padding: '2rem 1.5rem', /* Reduced padding */
      marginTop: 'auto',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.15)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
        
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>
            <ShieldAlert size={24} color="#60A5FA" /> The Guardian Path
          </h3>
          <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '400px', margin: 0 }}>
            A zero-risk sanctuary empowering everyone to learn digital safety with confidence and peace of mind.
          </p>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>Need Help Now?</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF' }}>
              <Phone size={18} color="#34D399" /> <strong>National Fraud Hotline:</strong> 1-800-123-4567
            </li>
            <li style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
              Don't panic. If you think you've been scammed, freeze your cards and call the number on the back of your bank card.
            </li>
          </ul>
        </div>
        
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', color: '#64748B' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
          Built with <Heart size={14} color="#EF4444" /> for our communities.
        </p>
      </div>
    </footer>
  );
}
