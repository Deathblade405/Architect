import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.15); /* translucent white */
  backdrop-filter: blur(14px); /* strong frosted effect */
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  color: #d4af37; /* fallback gold light color */
  font-family: Arial, sans-serif; /* Changed to Arial */
  display: flex;
  flex-direction: column;
  padding: 4vw 5vw;
  overflow-y: auto;
  z-index: 60;
`;

const CloseButton = styled(motion.button)`
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  font-size: 2.4rem;
  font-weight: 900;
  color: #d4af37; /* fallback gold color */
  cursor: pointer;
  margin-bottom: 1rem;
  width: 3.8rem;
  height: 3.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    color: #f7e162; /* lighter gold */
    box-shadow: 0 0 12px 3px rgba(255, 255, 255, 0.75);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 16px 4px #f7e162;
  }
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-size: 1.3rem;
  line-height: 1.7;
  font-family: Arial, sans-serif; /* Changed to Arial */
  letter-spacing: 0.04em;
  color: #d4af37; /* fallback gold light */
  user-select: text;
`;

const Title = styled.h1`
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 0.8em;
  font-family: Arial, sans-serif; /* Changed to Arial */
`;

const Text = styled.p`
  margin-bottom: 1.8em;
  font-weight: 400;
  font-family: Arial, sans-serif; /* Changed to Arial */
`;

const contentByBuilding = {
  about: {
    title: 'About Us',
    text: `Welcome to Black & Gold Architecture, where brilliance meets innovation. We specialize in crafting architectural masterpieces 
           that stand the test of time, combining elegance and sustainability. Our team brings years of experience and passion 
           for transformative designs and construction mastery.`,
  },
  services: {
    title: 'Our Services',
    text: `From conceptual architectural design to full-scale construction management, we offer end-to-end services tailored 
           to your needs. Our specialties include eco-friendly building, renovations, urban planning, and innovative project consulting.`,
  },
  projects: {
    title: 'Projects Portfolio',
    text: `Explore a curated portfolio of landmark projects showcasing our diverse expertise: modern residential homes, urban 
           commercial complexes, sustainable community centers, and heritage restorations that blend history with modern technology.`,
  },
  architects: {
    title: 'Meet the Architects',
    text: `Our visionary architects combine artistry with precision engineering. Led by Alex Carter, AIA, our team champions 
           sustainable design principles while pushing creative boundaries.`,
  },
  contact: {
    title: 'Contact Us',
    text: `We’re excited to bring your vision to life. Reach out for consultations, inquiries, and collaborations. Our dedicated 
           team is here to assist with any questions and provide tailored solutions.`,
  },
};

export default function ZoomedBuildingContent({ name, onBack }) {
  const data = contentByBuilding[name];

  return (
    <Overlay
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoomed-section-title"
    >
      <CloseButton 
        onClick={onBack} 
        aria-label="Close content and return to buildings"
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        &times;
      </CloseButton>
      <ContentContainer>
        <Title id="zoomed-section-title">{data.title}</Title>
        <Text>{data.text}</Text>
      </ContentContainer>
    </Overlay>
  );
}
