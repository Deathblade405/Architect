import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CursorRing = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 48px;             /* Customize ring size */
  height: 48px;
  border: 3.5px solid #7991b7ff;  /* Light blue ring color */
  border-radius: 50%;
  pointer-events: none;    /* Allow mouse events to pass through */
  transform: translate(-50%, -50%);
  z-index: 9999;
  user-select: none;
  background: transparent; /* No fill */
`;

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return <CursorRing style={{ left: position.x, top: position.y }} />;
}
