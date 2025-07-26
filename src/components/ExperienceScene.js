import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FaLinkedin,
  FaInstagram,
  FaHome,
  FaInfoCircle,
  FaBriefcase,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";

// Container for Vanta Clouds and sidebar dock
const SceneWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: #87ceeb; /* sky blue fallback */
  color: ${({ theme }) => theme.colors.gold};
`;

// Sidebar dock fixed on the left side vertically centered
const SidebarDock = styled.nav`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 20;
  user-select: none;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 16px 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  @media (max-width: 600px) {
    left: 10px;
    gap: 16px;
    padding: 10px 8px;
  }
`;

// Frosted glass button style, full width for easy touch targets
const DockButton = styled.button`
  position: relative;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 12px 20px;
  font-family: ${({ theme }) => theme.fonts.accent};
  font-weight: 700;
  font-size: 1rem;
  color: #000; /* black text */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 160px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease,
    color 0.3s ease, transform 0.15s ease;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
    outline: none;
    color: #000;
    transform: scale(1.07);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    color: #1e90ff; /* Dodger Blue */
    filter: drop-shadow(0 0 3px rgba(30, 144, 255, 0.6));
    font-size: 1.6rem;
  }

  @media (max-width: 600px) {
    width: 130px;
    padding: 10px 14px;
    gap: 8px;
    font-size: 0.9rem;

    svg {
      font-size: 1.3rem;
    }
  }
`;

// Buttons data for main content buttons
const contentButtons = [
  { id: "about", label: "About", icon: <FaInfoCircle aria-hidden="true" /> },
  { id: "services", label: "Services", icon: <FaBriefcase aria-hidden="true" /> },
  { id: "projects", label: "Projects", icon: <FaProjectDiagram aria-hidden="true" /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope aria-hidden="true" /> },
];

// Social media button definitions
const socialButtons = [
  {
    id: "instagram",
    label: "Instagram",
    icon: <FaInstagram aria-hidden="true" />,
    url: "https://instagram.com",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <FaLinkedin aria-hidden="true" />,
    url: "https://linkedin.com",
  },
];

export default function ExperienceScene({ onBuildingClick, onGoHome }) {
  const vantaRef = useRef(null);
  const vantaEffect = React.useRef(null);

  useEffect(() => {
    if (!vantaEffect.current && window.VANTA && window.THREE) {
      vantaEffect.current = window.VANTA.CLOUDS({
        el: vantaRef.current,
       
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  // Handle main nav button clicks
  const handleButtonClick = (id) => {
    if (id === "home") {
      if (typeof onGoHome === "function") onGoHome();
    } else if (
      ["about", "services", "projects", "contact"].includes(id) &&
      typeof onBuildingClick === "function"
    ) {
      onBuildingClick(id);
    }
  };

  // Social button external link opener
  const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <SceneWrapper ref={vantaRef} aria-label="Experience Scene with Vanta Clouds">
      <SidebarDock role="navigation" aria-label="Sidebar dock navigation">
        <DockButton
          onClick={() => handleButtonClick("home")}
          aria-label="Go to Home screen"
          tabIndex={0}
        >
          <FaHome />
          Home
        </DockButton>

        {contentButtons.map(({ id, label, icon }) => (
          <DockButton
            key={id}
            onClick={() => handleButtonClick(id)}
            aria-label={`Go to ${label} section`}
            tabIndex={0}
          >
            {icon}
            {label}
          </DockButton>
        ))}

        {socialButtons.map(({ id, label, icon, url }) => (
          <DockButton
            key={id}
            onClick={() => handleSocialClick(url)}
            aria-label={`Open ${label} in new tab`}
            tabIndex={0}
          >
            {icon}
            {label}
          </DockButton>
        ))}
      </SidebarDock>
    </SceneWrapper>
  );
}
