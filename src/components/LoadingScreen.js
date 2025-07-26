import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spinner = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const LoaderWrapper = styled(motion.div)`
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Spinner = styled.div`
  border: 6px solid ${({ theme }) => theme.colors.goldLight}40;
  border-top: 6px solid ${({ theme }) => theme.colors.gold};
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: ${spinner} 1.5s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 1.3rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.accent};
  letter-spacing: 0.15em;
`;

export default function LoadingScreen() {
  return (
    <LoaderWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <Spinner />
      <LoadingText>LOADING</LoadingText>
    </LoaderWrapper>
  );
}
