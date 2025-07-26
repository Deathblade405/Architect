import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';


const Container = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 0 20px;
`;


const Title = styled(motion.h1)`
  font-family: ${({theme}) => theme.fonts.accent};
  font-weight: 900;
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: 0.5em;
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.gold};
`;


const SubTitle = styled(motion.h2)`
  font-family: ${({theme}) => theme.fonts.main};
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.8rem);
  color: ${({ theme }) => theme.colors.goldLight};
  margin-bottom: 3em;
  letter-spacing: 0.05em;
`;


const EnterButton = styled(motion.button)`
  background: linear-gradient(135deg, #d4af37 0%, #f7e162 100%);
  padding: 1em 3em;
  border-radius: 30px;
  border: none;
  color: ${({ theme }) => theme.colors.black};
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 0 15px #d4af37cc;
  transition: box-shadow 0.3s ease;
  user-select: none;

  &:hover {
    box-shadow: 0 0 30px #fabf50dd;
  }
  &:active {
    scale: 0.95;
  }
`;


export default function LandingPage({ onEnter }) {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Destroy any previous instance for hot reloading
    if (vantaEffect.current) {
      vantaEffect.current.destroy();
      vantaEffect.current = null;
    }
    if (window.VANTA && window.THREE) {
      vantaEffect.current = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,

        highlightColor: 0xffffff,    // Soft white fog highlight
        midtoneColor: 0xd4af37,      // Touch of gold in midtones
        lowlightColor: 0x222222,     // Soft gray/dark in lowlights
        baseColor: 0x0a0a0a,         // Black BG
        blurFactor: 0.30,            // Lower for softer look
        speed: 0.8,                  // Subtle movement
        zoom: 0.9,                   // Little less zoom, gentler
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  // On button click: trigger text zoom animation, then call onEnter after delay
  const handleEnterClick = () => {
    if (isAnimating) return; // prevent double click
    setIsAnimating(true);
    setTimeout(() => {
      onEnter && onEnter();

    }, 700);
  };

  return (
    <Container
      ref={vantaRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      aria-label="Landing Page with Vanta Gold & White Fog"
    >
      <Title
        animate={isAnimating ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeIn" }}
        aria-hidden="true"
      >
        Black & Gold Architecture
      </Title>

      <SubTitle
        animate={isAnimating ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeIn", delay: 0.05 }}
        aria-hidden="true"
      >
        Immerse in Elegance & Innovation
      </SubTitle>

      <EnterButton 
        onClick={handleEnterClick} 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.95 }}
        aria-label="Enter Experience"
        disabled={isAnimating}
      >
        Enter Experience
      </EnterButton>
    </Container>
  );
}
