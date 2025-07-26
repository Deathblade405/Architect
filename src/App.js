import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from './GlobalStyles';
import { theme } from './theme';

import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import ExperienceScene from './components/ExperienceScene';
import ZoomedBuildingContent from './components/ZoomedBuildingContent';
import CustomCursor from './components/CustomCursor';

export default function App() {
  // Manage the stages (loading, landing, experience, zoomed)
  const [stage, setStage] = useState('loading');
  const [zoomedBuilding, setZoomedBuilding] = useState(null);

  useEffect(() => {
    // Show landing after loading for 2.5s
    const timer = setTimeout(() => setStage('landing'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterExperience = () => setStage('experience');

  const handleBuildingClick = (name) => setZoomedBuilding(name);

  const handleBack = () => setZoomedBuilding(null);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CustomCursor />
      <AnimatePresence mode="wait">
        {stage === 'loading' && <LoadingScreen key="loading" />}
        {stage === 'landing' && <LandingPage key="landing" onEnter={handleEnterExperience} />}
        {stage === 'experience' && !zoomedBuilding && (
          <ExperienceScene key="experience" onBuildingClick={handleBuildingClick} />
        )}
        {zoomedBuilding && (
          <ZoomedBuildingContent key="zoomed" name={zoomedBuilding} onBack={handleBack} />
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
