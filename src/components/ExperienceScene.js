import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  FaLinkedin,
  FaInstagram,
  FaHome,
  FaInfoCircle,
  FaBriefcase,
  FaProjectDiagram,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import towerGLTF from "./scene.gltf"; // Import your GLTF model here

export default function ExperienceScene({ onBuildingClick, onGoHome }) {
  const vantaRef = useRef(null);
  const vantaEffect = React.useRef(null);
  const threeSceneRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!vantaEffect.current && window.VANTA && window.THREE) {
      vantaEffect.current = window.VANTA.CLOUDS({
        el: vantaRef.current,
      });
    }

    if (!threeSceneRef.current && vantaRef.current) {
      initSkyscraperModel();
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
      if (threeSceneRef.current) {
        const { scene, renderer, animationId } = threeSceneRef.current;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
        threeSceneRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initSkyscraperModel = () => {
    // Create Three.js scene
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 150);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add renderer canvas to DOM inside vantaRef container
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "10";
    canvas.style.pointerEvents = "none";
    vantaRef.current.appendChild(canvas);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 200);
    pointLight.position.set(0, 100, 50);
    scene.add(pointLight);

    // Load the GLTF tower model
    const loader = new GLTFLoader();
    let towerModel;

    loader.load(
      towerGLTF,
      (gltf) => {
        towerModel = gltf.scene;

        // Position and scale the model similarly to your old skyscraper group
        towerModel.position.set(0, -20, 0);
        towerModel.scale.set(1.5, 1.5, 1.5);

        // Enable shadows on all meshes
        towerModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(towerModel);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );

    // Store refs for cleanup and animation
    threeSceneRef.current = {
      scene,
      camera,
      renderer,
      canvas,
      towerModel,
      animationId: null,
    };

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      threeSceneRef.current.animationId = animationId;

      const time = Date.now() * 0.0003;

      // Rotate camera around tower
      camera.position.x = Math.cos(time) * 200;
      camera.position.z = Math.sin(time) * 200;
      camera.position.y = 80 + Math.sin(time * 0.5) * 30;
      camera.lookAt(0, 50, 0);

      // Rotate tower slowly if loaded
      if (threeSceneRef.current.towerModel) {
        threeSceneRef.current.towerModel.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
  };

  // Navigation handlers
  const handleButtonClick = (id) => {
    setIsMenuOpen(false);

    if (id === "home") {
      if (typeof onGoHome === "function") onGoHome();
    } else if (
      ["about", "services", "projects", "contact"].includes(id) &&
      typeof onBuildingClick === "function"
    ) {
      onBuildingClick(id);
    }
  };

  const handleSocialClick = (url) => {
    setIsMenuOpen(false);
    window.open(url, "_blank", "noopener noreferrer");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const contentButtons = [
    { id: "about", label: "About", icon: <FaInfoCircle aria-hidden="true" /> },
    { id: "services", label: "Services", icon: <FaBriefcase aria-hidden="true" /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram aria-hidden="true" /> },
    { id: "contact", label: "Contact", icon: <FaEnvelope aria-hidden="true" /> },
  ];

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

  return (
    <div
      ref={vantaRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background: "#87ceeb",
        color: "#d4af37",
        fontFamily: "Arial, sans-serif", // Global font for container
      }}
      aria-label="Experience Scene with Vanta Clouds"
    >
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 25,
          background: "rgba(255, 255, 255, 0.25)",
          border: "1.5px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "12px",
          padding: "12px",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          fontFamily: "Arial, sans-serif",
          color: "#000",
        }}
        className="hamburger-btn"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <FaTimes style={{ fontSize: "1.5rem", color: "#000" }} />
        ) : (
          <FaBars style={{ fontSize: "1.5rem", color: "#000" }} />
        )}
      </button>

      {/* Sidebar Dock */}
      <nav
        style={{
          position: "fixed",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 20,
          userSelect: "none",
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "16px",
          padding: "16px 12px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "all 0.3s ease",
          fontFamily: "Arial, sans-serif",
          color: "#000",
        }}
        className={`sidebar-dock ${isMenuOpen ? "mobile-open" : ""}`}
        role="navigation"
        aria-label="Sidebar dock navigation"
      >
        <button
          onClick={() => handleButtonClick("home")}
          style={{
            position: "relative",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "12px",
            border: "1.5px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "160px",
            transition: "all 0.3s ease",
            fontFamily: "Arial, sans-serif",
          }}
          className="dock-button"
          aria-label="Go to Home screen"
          tabIndex={0}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.4)";
            e.target.style.boxShadow = "0 8px 40px rgba(0, 0, 0, 0.15)";
            e.target.style.transform = "scale(1.07)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.25)";
            e.target.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
            e.target.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1.07)";
          }}
        >
          <FaHome
            style={{
              color: "#1e90ff",
              filter: "drop-shadow(0 0 3px rgba(30, 144, 255, 0.6))",
              fontSize: "1.6rem",
              fontFamily: "Arial, sans-serif",
            }}
          />
          Home
        </button>

        {contentButtons.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleButtonClick(id)}
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.25)",
              borderRadius: "12px",
              border: "1.5px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#000",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "160px",
              transition: "all 0.3s ease",
              fontFamily: "Arial, sans-serif",
            }}
            className="dock-button"
            aria-label={`Go to ${label} section`}
            tabIndex={0}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.4)";
              e.target.style.boxShadow = "0 8px 40px rgba(0, 0, 0, 0.15)";
              e.target.style.transform = "scale(1.07)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.25)";
              e.target.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1.07)";
            }}
          >
            <span
              style={{
                color: "#1e90ff",
                filter: "drop-shadow(0 0 3px rgba(30, 144, 255, 0.6))",
                fontSize: "1.6rem",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {icon}
            </span>
            {label}
          </button>
        ))}

        {socialButtons.map(({ id, label, icon, url }) => (
          <button
            key={id}
            onClick={() => handleSocialClick(url)}
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.25)",
              borderRadius: "12px",
              border: "1.5px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#000",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "160px",
              transition: "all 0.3s ease",
              fontFamily: "Arial, sans-serif",
            }}
            className="dock-button"
            aria-label={`Open ${label} in new tab`}
            tabIndex={0}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.4)";
              e.target.style.boxShadow = "0 8px 40px rgba(0, 0, 0, 0.15)";
              e.target.style.transform = "scale(1.07)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.25)";
              e.target.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
              e.target.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1.07)";
            }}
          >
            <span
              style={{
                color: "#1e90ff",
                filter: "drop-shadow(0 0 3px rgba(30, 144, 255, 0.6))",
                fontSize: "1.6rem",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {icon}
            </span>
            {label}
          </button>
        ))}
      </nav>

      <style jsx>{`
        @media (max-width: 600px) {
          .hamburger-btn {
            display: flex !important;
          }

          .sidebar-dock {
            transform: translateX(-100%) translateY(-50%) !important;
            left: 20px !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          .sidebar-dock.mobile-open {
            transform: translateX(0) translateY(-50%) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          }

          .dock-button {
            width: 130px !important;
            padding: 10px 14px !important;
            gap: 8px !important;
            font-size: 0.9rem !important;
            font-family: Arial, sans-serif !important;
          }

          .dock-button span,
          .dock-button svg {
            font-size: 1.3rem !important;
            font-family: Arial, sans-serif !important;
          }
        }
      `}</style>
    </div>
  );
}
