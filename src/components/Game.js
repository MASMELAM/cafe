import React, { useState, useEffect, useRef } from 'react';
import useMousePosition from '../hooks/useMousePosition';
import background from '../assets/backgroundimage.png';

// speed and sensitivity
const PAN_SPEED = 2;
const EDGE_THRESHOLD = 50;

export default function Game() {
  const mouse = useMousePosition(); // get current mouse position
  const containerRef = useRef(null); // reference to the world container div

  // current camera offsets
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  
  // each section's width and height
  const SECTION_WIDTH = window.innerWidth;
  const SECTION_HEIGHT = window.innerHeight;
  
  // grid layout
  const TOTAL_COLS = 3;
  const TOTAL_ROWS = 2;

  // total world dimensions
  const WORLD_WIDTH = TOTAL_COLS * SECTION_WIDTH;
  const WORLD_HEIGHT = TOTAL_ROWS * SECTION_HEIGHT;

  // camera movement limits
  const MIN_X = -(WORLD_WIDTH - SECTION_WIDTH);
  const MAX_X = 0;
  const MIN_Y = -(WORLD_HEIGHT - SECTION_HEIGHT);
  const MAX_Y = 0;

  // helper for smooth panning
  const lerp = (start, end, amt) => start + (end - start) * amt;

  // runs whenever mouse of offsets change
  useEffect(() => {
    // next horizonal and vertical position
    let targetX = offsetX;
    let targetY = offsetY;

    // horizontal pan
    if (mouse.x < EDGE_THRESHOLD) targetX += PAN_SPEED;
    if (mouse.x > window.innerWidth - EDGE_THRESHOLD) targetX -= PAN_SPEED;

    // vertical pan
    if (mouse.y < EDGE_THRESHOLD) targetY += PAN_SPEED;
    if (mouse.y > window.innerHeight - EDGE_THRESHOLD) targetY -= PAN_SPEED;

    // clamp target positions to world bounds
    targetX = Math.max(MIN_X, Math.min(MAX_X, targetX));
    targetY = Math.max(MIN_Y, Math.min(MAX_Y, targetY));

    // smooth motion
    setOffsetX(lerp(offsetX, targetX, 0.1));
    setOffsetY(lerp(offsetY, targetY, 0.1));
  }, [mouse, offsetX, offsetY, MIN_X, MAX_X, MIN_Y, MAX_Y]);

  return (
    // camera viewport: only shows one section at a time
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', 
        position: 'relative',
      }}
    >
      {/* WORLD CONTAINER */}
      <div
        ref={containerRef}
        style={{
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          backgroundImage: `url(${background})`, // one giant image
          backgroundSize: `${WORLD_WIDTH}px ${WORLD_HEIGHT}px`, // stretch image to fit world
          backgroundPosition: 'center',
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          transition: 'transform 0.05s linear',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Transparent section overlays just for labeling */}
        {[...Array(6)].map((_, i) => {
          const row = Math.floor(i / TOTAL_COLS);
          const col = i % TOTAL_COLS;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: row * SECTION_HEIGHT,
                left: col * SECTION_WIDTH,
                width: SECTION_WIDTH,
                height: SECTION_HEIGHT,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3rem',
                color: 'white',
                textShadow: '2px 2px 4px black',
              }}
            >
              Section {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
