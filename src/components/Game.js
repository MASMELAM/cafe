import React, { useState, useEffect, useRef } from 'react';
import useMousePosition from '../hooks/useMousePosition';
import background from '../assets/backgroundimage.png';

const PAN_SPEED = 2;
const EDGE_THRESHOLD = 50;

export default function Game() {
  const mouse = useMousePosition();
  const containerRef = useRef(null);
  const [offsetX, setOffsetX] = useState(0);

  // horizontal panning limits
  const WORLD_WIDTH = 6 * window.innerWidth; // 6 sections
  const MIN_X = -(WORLD_WIDTH - window.innerWidth); // max left
  const MAX_X = 0; // max right

  const lerp = (start, end, amt) => start + (end - start) * amt;

  useEffect(() => {
    let targetX = offsetX;

    // pan left or right based on mouse position
    if (mouse.x < EDGE_THRESHOLD) targetX += PAN_SPEED;
    if (mouse.x > window.innerWidth - EDGE_THRESHOLD) targetX -= PAN_SPEED;

    // clamp to world bounds
    targetX = Math.max(MIN_X, Math.min(MAX_X, targetX));

    // smooth movement
    setOffsetX(lerp(offsetX, targetX, 0.1));
  }, [mouse, offsetX]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '600vw', // 6 sections, each 100vw
        height: '100vh',
        display: 'flex',
        transform: `translateX(${offsetX}px)`,
        transition: 'transform 0.05s linear',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '100vw',
            height: '100vh',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '3rem',
            color: 'white',
            textShadow: '2px 2px 4px black',
            borderRight: i < 5 ? '1px solid rgba(0,0,0,0.1)' : 'none',
          }}
        >
          Section {i + 1}
        </div>
      ))}
    </div>
  );
}