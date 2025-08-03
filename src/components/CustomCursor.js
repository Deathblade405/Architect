import React, { useEffect, useState, useRef } from 'react';

// Convert rgb string like "rgb(255, 255, 255)" or "rgba(255, 255, 255, 0.5)" to hex #rrggbb
function rgbToHex(rgbstr) {
  const match = rgbstr.match(/\d+/g);
  if (!match) return "#808080"; // fallback neutral gray
  const r = parseInt(match[0]).toString(16).padStart(2, "0");
  const g = parseInt(match[1]).toString(16).padStart(2, "0");
  const b = parseInt(match[2]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

// Calculate relative luminance to determine lightness of a color (#rrggbb)
function luminance(hex) {
  const r = parseInt(hex.substr(1,2),16)/255;
  const g = parseInt(hex.substr(3,2),16)/255;
  const b = parseInt(hex.substr(5,2),16)/255;
  const a = [r,g,b].map(c => {
    return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  });
  return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
}

// Adjust color brightness by factor (-1 to 1), negative darkens, positive lightens (subtle)
function adjustColor(hex, factor) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const newR = Math.min(255, Math.max(0, Math.round(r + 255 * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g + 255 * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b + 255 * factor)));
  return `#${newR.toString(16).padStart(2,'0')}${newG.toString(16).padStart(2,'0')}${newB.toString(16).padStart(2,'0')}`;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorColors, setCursorColors] = useState({
    center: '#808080', // neutral gray initially, no fixed forced color
    ringLight: 'rgba(128, 128, 128, 0.3)',
    ringDark: 'rgba(128, 128, 128, 0.7)',
  });
  const lastHovered = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const onMouseOver = (e) => {
      try {
        const el = e.target;
        if (!el || el === lastHovered.current) return;
        lastHovered.current = el;

        const style = getComputedStyle(el);
        let bgColor = style.backgroundColor;
        let textColor = style.color;

        const isTransparent = (c) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)';

        let baseColorHex = "#808080"; // neutral grey fallback

        if (!isTransparent(bgColor) && bgColor.startsWith('rgb')) {
          baseColorHex = rgbToHex(bgColor);
        } else if (!isTransparent(textColor) && textColor.startsWith('rgb')) {
          baseColorHex = rgbToHex(textColor);
        }

        // Calculate luminance to decide adjustment
        const lum = luminance(baseColorHex);

        // Strategy:
        // If luminance is >0.7 (very light), darken slightly to stand out
        // If luminance is <0.3 (very dark), lighten slightly to stand out
        // Else no big adjustment, slight darkening for subtle contrast

        let centerColor, ringLight, ringDark;
        if (lum > 0.7) {
          centerColor = adjustColor(baseColorHex, -0.25); // Darker center dot
          ringLight = adjustColor(baseColorHex, -0.15) + "66"; // semi-transparent darker
          ringDark = adjustColor(baseColorHex, -0.35) + "cc"; // more transparent dark
        } else if (lum < 0.3) {
          centerColor = adjustColor(baseColorHex, 0.2);   // Lighter center dot
          ringLight = adjustColor(baseColorHex, 0.1) + "66"; 
          ringDark = adjustColor(baseColorHex, 0.3) + "cc";
        } else {
          centerColor = adjustColor(baseColorHex, -0.1);   // Slightly darker center dot
          ringLight = adjustColor(baseColorHex, -0.05) + "66";
          ringDark = adjustColor(baseColorHex, -0.2) + "cc";
        }

        setCursorColors({
          center: centerColor,
          ringLight,
          ringDark,
        });
      } catch {
        // ignore errors and keep previous colors
      }
    };

    // Reset cursor colors to neutral grey on mouse out
    const onMouseOut = () => {
      lastHovered.current = null;
      setCursorColors({
        center: '#808080',
        ringLight: 'rgba(128, 128, 128, 0.3)',
        ringDark: 'rgba(128, 128, 128, 0.7)',
      });
    };

    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Center Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: cursorColors.center,
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          userSelect: 'none',
          left: position.x,
          top: position.y,
          boxShadow: 'none', // no neon glow
          transition: 'background-color 0.4s ease',
        }}
      />
      {/* Outer Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          border: `3.5px solid ${cursorColors.ringDark}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          userSelect: 'none',
          background: 'transparent',
          left: position.x,
          top: position.y,
          boxShadow: `0 0 6px ${cursorColors.ringLight}`,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          animation: 'ringPulse 4s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes ringPulse {
          0%, 100% {
            box-shadow: 0 0 4px var(--ringLight), 0 0 8px 1.5px var(--ringLight);
          }
          50% {
            box-shadow: 0 0 8px var(--ringLight), 0 0 16px 3px var(--ringLight);
          }
        }
      `}</style>
    </>
  );
}
