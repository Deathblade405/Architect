import React, { useEffect, useRef, useState } from 'react';

export default function LandingPage({ onEnter }) {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;

    const initVanta = () => {
      attempts++;

      if (!vantaRef.current) {
        if (attempts < maxAttempts) {
          setTimeout(initVanta, 100);
        }
        return;
      }

      // Check if Vanta and THREE are available
      if (typeof window !== 'undefined' && window.VANTA && window.VANTA.CLOUDS && window.THREE) {
        try {
          // Destroy any existing effect
          if (vantaEffect.current) {
            vantaEffect.current.destroy();
          }

          // Initialize Vanta Clouds
          vantaEffect.current = window.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunlightColor: 0xff9933,
            speed: 1.2,
            zoom: 0.75,
          });

          console.log('Vanta effect initialized successfully');
          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing Vanta:', error);
          setIsLoading(false);
        }
      } else {
        console.log(`Attempt ${attempts}: Vanta dependencies not ready`);
        if (attempts < maxAttempts) {
          setTimeout(initVanta, 200);
        } else {
          console.error('Failed to initialize Vanta after maximum attempts');
          setIsLoading(false);
        }
      }
    };

    // Start initialization with a small delay
    const timeout = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timeout);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect.current) {
        vantaEffect.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEnterClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      onEnter && onEnter();
    }, 800);
  };

  return (
    <>
      {/* Vanta Background - Full Screen */}
      <div
        ref={vantaRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffffff',
            fontSize: '1.25rem',
            fontWeight: '500',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ animation: 'pulse 2s infinite' }}>Loading Experience...</div>
        </div>
      )}

      {/* Main Content - Perfectly Centered */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 1s ease-out',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: '0.5em',
            color: '#f9f9f9ff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
            transform: isAnimating ? 'scale(1.5)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
            transition: 'all 0.7s ease-in',
            animation: isAnimating ? 'none' : 'titleGlow 3s ease-in-out infinite alternate',
          }}
        >
          Black & Gold Architecture
        </h1>

        {/* Subtitle */}
        <h2
          style={{
            fontWeight: 400,
            fontSize: 'clamp(1rem, 2vw, 1.8rem)',
            color: '#ffffffff',
            marginBottom: '3em',
            letterSpacing: '0.05em',
            textAlign: 'center',
            transform: isAnimating ? 'scale(1.5)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
            transition: 'all 0.7s ease-in 0.05s',
          }}
        >
          Immerse in Elegance & Innovation
        </h2>

        {/* Enter Button */}
        <button
          onClick={handleEnterClick}
          disabled={isAnimating || isLoading}
          style={{
            backgroundColor: 'transparent',
            padding: '1em 3em',
            borderRadius: '30px',
            border: '2px solid #ffffffff',
            color: '#ffffff',
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'Arial, sans-serif',
            cursor: isAnimating || isLoading ? 'not-allowed' : 'pointer',

            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',

            userSelect: 'none',
            transform: isAnimating ? 'scale(1.5)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
            transitionDelay: '0.1s',
          }}
          onMouseEnter={(e) => {
            if (!isAnimating && !isLoading) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#555';
              e.target.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.7)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnimating) {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#ffffff';
              e.target.style.boxShadow = 'none';
            }
          }}
          onMouseDown={(e) => {
            if (!isAnimating && !isLoading) {
              e.target.style.transform = 'scale(0.95)';
              e.target.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.5)';
            }
          }}
          onMouseUp={(e) => {
            if (!isAnimating && !isLoading) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.7)';
            }
          }}
        >
          Enter Experience
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes titleGlow {
          from {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
          to {
            text-shadow: 0 0 30px rgba(255, 255, 255, 1),
              0 0 40px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: clamp(2rem, 8vw, 3.5rem) !important;
          }

          h2 {
            font-size: clamp(0.9rem, 4vw, 1.4rem) !important;
            margin-bottom: 2em !important;
          }

          button {
            font-size: 1.1rem !important;
            padding: 0.8em 2.5em !important;
          }
        }
      `}</style>
    </>
  );
}
