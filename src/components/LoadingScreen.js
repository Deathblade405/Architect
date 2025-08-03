import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Rotate animation for spinner rings
const rotate = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

// Pulsing glow animation for the glowing ring
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.6); }
  50% { box-shadow: 0 0 25px rgba(212, 175, 55, 1), 0 0 50px rgba(212, 175, 55, 0.8); }
`;

// Fade-in-out animation for the loading text dots
const dotsFade = keyframes`
  0%, 20% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const LoaderWrapper = styled(motion.div)`
  height: 100vh;
  background-color: #fff; /* White background */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none;
`;

const Spinner = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
`;

// Outer rotating ring
const OuterRing = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 110px; height: 110px;
  border: 6px solid rgba(212, 175, 55, 0.15);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: ${rotate} 2.2s linear infinite;
`;

// Middle rotating ring, opposite direction, slower
const MiddleRing = styled.div`
  position: absolute;
  top: 14px; left: 14px;
  width: 82px; height: 82px;
  border: 5px solid rgba(212, 175, 55, 0.1);
  border-left-color: #d4af37;
  border-radius: 50%;
  animation: ${rotate} 3.2s linear reverse infinite;
`;

// Inner glowing ring with pulsing effect
const InnerGlowRing = styled.div`
  position: absolute;
  top: 30px; left: 30px;
  width: 50px; height: 50px;
  border: 7px solid #d4af37;
  border-radius: 50%;
  animation: ${pulseGlow} 2.8s ease-in-out infinite;
  box-shadow: 0 0 20px #d4af37aa, inset 0 0 15px #f7e162bb;
`;

// Center dot in the middle
const CenterDot = styled.div`
  position: absolute;
  top: 48px; left: 48px;
  width: 14px; height: 14px;
  background-color: #d4af37;
  border-radius: 50%;
  box-shadow: 0 0 6px #d4af37cc;
`;

// Styled loading text with animated dots
const LoadingText = styled.div`
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.accent};
  letter-spacing: 0.25em;
  margin-top: 30px;
  display: flex;
  align-items: center;
  user-select: none;
`;

// Individual dots next to LOADING text for a fancy animation
const Dot = styled.span`
  font-size: 2rem;
  margin-left: 4px;
  animation-name: ${dotsFade};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  opacity: 0.2;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

export default function LoadingScreen() {
  return (
    <LoaderWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      aria-label="Loading screen"
      role="alert"
      aria-live="assertive"
    >
      <Spinner role="img" aria-label="Loading animation">
        <OuterRing />
        <MiddleRing />
        <InnerGlowRing />
        <CenterDot />
      </Spinner>
      <LoadingText>
        LOADING
        <Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </LoadingText>
    </LoaderWrapper>
  );
}
