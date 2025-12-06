"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Colors matching the reference wheel image
  const segments = [
    { label: 'MISS', color: '#1a5c52', textColor: '#D4AF37', fontSize: 18 }, // Dark Teal - smaller
    { label: '10x', color: '#8b2a2a', textColor: '#D4AF37', fontSize: 22 },  // Deep Red
    { label: '5x', color: '#1a5c52', textColor: '#D4AF37', fontSize: 22 },   // Dark Teal
    { label: '3x', color: '#c9941a', textColor: '#D4AF37', fontSize: 22 },   // Golden Orange - changed to gold
    { label: '0x', color: '#1e3a5f', textColor: '#D4AF37', fontSize: 22 },   // Navy Blue
    { label: 'SSY', color: '#8b2a2a', textColor: '#D4AF37', fontSize: 22 },  // Deep Red
    { label: '1x', color: '#1a5c52', textColor: '#D4AF37', fontSize: 22 },   // Dark Teal
    { label: '5x', color: '#5a2d5a', textColor: '#D4AF37', fontSize: 22 },   // Purple
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const spins = 5 + Math.random() * 3;
    const randomDegree = Math.random() * 360;
    const newRotation = rotation + spins * 360 + randomDegree;
    setRotation(newRotation);
    setTimeout(() => {
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="flex justify-center my-6">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-radial from-yellow-600/40 to-transparent rounded-full scale-110" />

        {/* Wheel container */}
        <div className="relative w-[500px] h-[500px]">
          {/* Top pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -translate-y-3">
            <div className="relative">
              {/* Outer shadow layer */}
              <div
                className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[35px]"
                style={{
                  borderTopColor: '#8b6914',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))',
                }}
              />
              {/* Middle layer */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[33px]"
                style={{ borderTopColor: '#c9941a' }}
              />
              {/* Inner bright layer */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[31px]"
                style={{
                  borderTopColor: '#d4af37',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                }}
              />
              {/* Center diamond detail */}
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#e8c15f] rounded-sm rotate-45"
                style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.5)' }}
              />
              <div
                className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8b6914] rounded-full"
              />
            </div>
          </div>

          {/* Spinning wheel */}
          <motion.div
            className="relative w-full h-full"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Outer gold rim with light from top-right */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 65% 35%, #f5d76e 0%, #e8c15f 15%, #d4af37 30%, #c9941a 50%, #8b6914 75%, #6a5010 100%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.7), inset 8px 8px 20px rgba(255,255,255,0.5), inset 0 0 40px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.9), 0 15px 30px rgba(0,0,0,0.7)',
              }}
            />

            {/* Middle metallic ring */}
            <div
              className="absolute inset-[8px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 65% 35%, #d4af37 0%, #c9941a 40%, #8b6914 70%, #6a5010 100%)',
                boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.7), inset 5px 5px 12px rgba(255,255,255,0.3)',
              }}
            />

            {/* Inner rim border */}
            <div
              className="absolute inset-[14px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 65% 35%, #8b6914 0%, #6a5010 50%, #4a3510 100%)',
                boxShadow: 'inset -3px -3px 10px rgba(0,0,0,0.8), inset 3px 3px 8px rgba(139,105,20,0.3)',
              }}
            />

            {/* Rivets on outer rim */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #f5d76e, #d4af37 40%, #8b6914)',
                  boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.6), inset 1px 1px 3px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateY(-240px) translateX(-50%)`,
                  transformOrigin: 'center',
                }}
              />
            ))}

            {/* Wheel segments */}
            <svg className="absolute inset-[20px] w-[calc(100%-40px)] h-[calc(100%-40px)]" viewBox="0 0 200 200">
              <defs>
                {/* Radial gradients for depth effect with top-right lighting */}
                <radialGradient id="redGrad" cx="60%" cy="40%" r="70%">
                  <stop offset="0%" style={{ stopColor: '#c94040', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#8b2a2a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#4a1010', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="tealGrad" cx="60%" cy="40%" r="70%">
                  <stop offset="0%" style={{ stopColor: '#3d8b7a', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#1a5c52', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0a2a25', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="navyGrad" cx="60%" cy="40%" r="70%">
                  <stop offset="0%" style={{ stopColor: '#3d5a85', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#1e3a5f', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0f1a30', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="goldGrad" cx="60%" cy="40%" r="70%">
                  <stop offset="0%" style={{ stopColor: '#e8c15f', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#c9941a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#6a5010', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="purpleGrad" cx="60%" cy="40%" r="70%">
                  <stop offset="0%" style={{ stopColor: '#8a4d8a', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#5a2d5a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#2a0a2a', stopOpacity: 1 }} />
                </radialGradient>
              </defs>

              {segments.map((segment, i) => {
                const angle = (360 / segments.length) * i - 90;
                const angleRad = (angle * Math.PI) / 180;
                const nextAngleRad = ((angle + 360 / segments.length) * Math.PI) / 180;
                const x1 = 100 + 90 * Math.cos(angleRad);
                const y1 = 100 + 90 * Math.sin(angleRad);
                const x2 = 100 + 90 * Math.cos(nextAngleRad);
                const y2 = 100 + 90 * Math.sin(nextAngleRad);

                // Map colors to gradients
                const gradientMap = {
                  '#8b2a2a': 'url(#redGrad)',
                  '#1a5c52': 'url(#tealGrad)',
                  '#1e3a5f': 'url(#navyGrad)',
                  '#c9941a': 'url(#goldGrad)',
                  '#5a2d5a': 'url(#purpleGrad)',
                };

                return (
                  <g key={i}>
                    {/* Main segment with gradient */}
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                      fill={gradientMap[segment.color] || segment.color}
                      stroke="#c9941a"
                      strokeWidth="2.5"
                      style={{
                        filter: 'drop-shadow(-2px -2px 4px rgba(0,0,0,0.5))',
                      }}
                    />
                    {/* Inner shadow for depth from bottom-left */}
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.4)"
                      strokeWidth="2"
                      style={{
                        transform: 'translate(-1px, -1px)',
                      }}
                    />
                    {/* Highlight edge from top-right */}
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                      fill="none"
                      stroke="rgba(255, 215, 110, 0.25)"
                      strokeWidth="1"
                      style={{
                        transform: 'translate(0.5px, 0.5px)',
                      }}
                    />
                  </g>
                );
              })}

              {/* Segment text - positioned outside segments like reference image */}
              {segments.map((segment, i) => {
                const angle = (360 / segments.length) * i;
                const textAngle = angle + 360 / segments.length / 2;
                const textAngleRad = ((textAngle - 90) * Math.PI) / 180;
                const textX = 100 + 65 * Math.cos(textAngleRad);
                const textY = 100 + 65 * Math.sin(textAngleRad);

                return (
                  <g key={i}>
                    {/* Text shadow from bottom-left (opposite of light) */}
                    <text
                      x={textX - 0.5}
                      y={textY + 1.5}
                      fill="rgba(0, 0, 0, 0.8)"
                      fontSize={segment.fontSize || 22}
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      style={{
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      {segment.label}
                    </text>
                    {/* Main text */}
                    <text
                      x={textX}
                      y={textY}
                      fill={segment.textColor}
                      fontSize={segment.fontSize || 22}
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      style={{
                        fontFamily: 'Georgia, serif',
                        filter: 'drop-shadow(-1px -1px 2px rgba(0,0,0,0.9))',
                      }}
                    >
                      {segment.label}
                    </text>
                    {/* Highlight from top-right */}
                    <text
                      x={textX + 0.5}
                      y={textY - 0.5}
                      fill="rgba(255, 255, 255, 0.2)"
                      fontSize={segment.fontSize || 22}
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      style={{
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center hub */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full"
              style={{
                background: 'radial-gradient(circle at 65% 35%, #f5d76e 0%, #e8c15f 10%, #d4af37 30%, #c9941a 60%, #8b6914 90%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.6), inset 8px 8px 20px rgba(255,255,255,0.5), 0 12px 35px rgba(0,0,0,0.8)',
              }}
            >
              {/* Outer gold ring */}
              <div
                className="absolute inset-[5px] rounded-full"
                style={{
                  background: 'radial-gradient(circle at 65% 35%, #d4af37 0%, #c9941a 50%, #8b6914 100%)',
                  boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.7), inset 4px 4px 10px rgba(255,215,110,0.3)',
                }}
              >
                {/* Inner gold ring */}
                <div
                  className="absolute inset-[4px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 65% 35%, #e8c15f 0%, #d4af37 40%, #c9941a 70%, #8b6914 100%)',
                    boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.5), inset 3px 3px 8px rgba(255,255,255,0.3)',
                  }}
                >
                  {/* Black center */}
                  <div
                    className="absolute inset-[3px] rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center"
                    style={{ boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.9), inset 2px 2px 8px rgba(0,0,0,0.7)' }}
                  >
                    <div className="text-[#D4AF37] text-4xl mb-1" style={{ filter: 'drop-shadow(-2px -2px 5px rgba(0,0,0,0.9)) drop-shadow(1px 1px 2px rgba(255,215,110,0.3))' }}>
                      ♠
                    </div>
                    <div className="text-[#D4AF37] text-base font-bold tracking-[0.15em]" style={{ fontFamily: 'Georgia, serif', textShadow: '-2px -2px 5px rgba(0,0,0,0.9), 1px 1px 3px rgba(255,215,110,0.3)' }}>
                      NASIIB
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" style={{ boxShadow: '0 0 6px rgba(212,175,55,0.6), inset -1px -1px 2px rgba(0,0,0,0.5)' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" style={{ boxShadow: '0 0 6px rgba(212,175,55,0.6), inset -1px -1px 2px rgba(0,0,0,0.5)' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" style={{ boxShadow: '0 0 6px rgba(212,175,55,0.6), inset -1px -1px 2px rgba(0,0,0,0.5)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
