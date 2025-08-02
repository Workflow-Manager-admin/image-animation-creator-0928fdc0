import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './design-system.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      <div style={{
        width: '100vw',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: 'var(--color-252020)',
        paddingBottom: 8,
      }}>
        {/* Cover / Hero */}
        <div style={{
          margin: '26px auto 22px auto',
          position: 'relative',
          width: 342, maxWidth: '96vw',
          minHeight: 156,
          background: 'var(--color-252020)',
          borderRadius: 'var(--radius-9)',
          overflow: 'hidden',
        }}>
          {/* Ellipse */}
          <div style={{
            position: 'absolute', left: 19, top: 60,
            width: 246, height: 49,
            background: 'var(--color-f26a1b)',
            borderRadius: '50%',
            opacity: 0.95, zIndex: 0,
          }} />
          {/* Group/Decor */}
          <div style={{
            position: 'absolute', left: 167, top: -18,
            width: 104, height: 120, opacity: 0.8,
            zIndex: 1,
          }}>
            <div style={{
              position: 'absolute', left: 43, top: 0,
              width: 61, height: 120,
              background: 'var(--color-f26a1b)',
              borderRadius: '0 0 31px 31px / 0 0 59px 59px',
              opacity: 1,
            }} />
            <div style={{
              position: 'absolute', left: 0, top: 71,
              width: 33, height: 26,
              background: 'var(--color-f26a1b)',
              borderRadius: 9,
              opacity: 1,
            }} />
            <div style={{
              position: 'absolute', left: 0, top: 27,
              width: 33, height: 25,
              background: 'var(--color-f26a1b)',
              borderRadius: 9,
              opacity: 1,
            }} />
          </div>
          {/* Title */}
          <div style={{
            position: 'absolute',
            left: 10, top: 14, width: 230, minHeight: 40, lineHeight: 1.07,
            color: 'var(--color-ffffff)', fontWeight: 700,
            fontSize: 28, fontFamily: 'var(--font-inter)',
            zIndex: 5,
          }}>
            KAVIA AI<br />Website UI/UX
          </div>
          {/* Last updated */}
          <div style={{
            position: 'absolute', left: 10, bottom: 6,
            color: 'var(--color-dedcdd)', fontSize: 11, fontWeight: 500, letterSpacing: 0.14,
            fontFamily: 'var(--font-inter)',
            opacity: 0.84
          }}>
            Last Updated on July 2025
          </div>
        </div>
      </div>
      {/* Main application */}
      <App />
    </>
  </React.StrictMode>
);
