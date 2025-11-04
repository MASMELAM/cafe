import React, { useState, useEffect, useRef } from 'react';
import useMousePosition from '../hooks/useMousePosition';
import background from '../assets/backgroundimage.png';

const PAN_SPEED = 1.5; // how fast the screen moves near the edges
const EDGE_THRESHOLD = 50; // how close the mouse needs to be before panning starts

export default function Game() {
  const mouse = useMousePosition(); // get current position of mouse
  const containerRef = useRef(null); // reference to container div
  const [offsetX, setOffsetX] = useState(0); // how far left/right the world has scrolled

  // horizontal panning limits
  const WORLD_WIDTH = 6 * window.innerWidth; // total width of the world (6 sections wide)
  const MIN_X = -(WORLD_WIDTH - window.innerWidth); // max left
  const MAX_X = 0; // max right

  // helper for smooth motion/panning
  const lerp = (start, end, amt) => start + (end - start) * amt;

  useEffect(() => {
    let targetX = offsetX; // store the next target scroll position
    // pan left or right based on mouse position
    if (mouse.x < EDGE_THRESHOLD) targetX += PAN_SPEED;
    if (mouse.x > window.innerWidth - EDGE_THRESHOLD) targetX -= PAN_SPEED;
    // clamp to world bounds
    targetX = Math.max(MIN_X, Math.min(MAX_X, targetX));
    // smooth movement
    setOffsetX(lerp(offsetX, targetX, 0.1));
  }, [mouse, offsetX, MIN_X, MAX_X]); // run whatever mouse moves or offset changes
  return (

    <div
      ref={containerRef}
      style={{
        width: '600vw', 
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