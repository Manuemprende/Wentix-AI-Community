import React from 'react';

interface WentixLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom_hero';
}

export const WentixLogo: React.FC<WentixLogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  return (
    <div className={`flex items-center gap-3 select-none group ${className}`} id="wentix-logo-component">
      {/* SVG Icon: Wentix Orbital Intelligence logo */}
      <div 
        className={`relative shrink-0 transition-transform duration-500 group-hover:scale-105 ${
          size === 'sm' ? 'w-8 h-8' : 
          size === 'md' ? 'w-11 h-11' : 
          size === 'lg' ? 'w-24 h-24' : 
          size === 'xl' ? 'w-44 h-44' : 
          size === 'custom_hero' ? 'w-28 h-28 md:w-36 md:h-36' : 'w-11 h-11'
        }`}
      >
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="orbit-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
              <stop offset="50%" stopColor="#3b82f6" /> {/* blue-500 */}
              <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
            </linearGradient>
            <linearGradient id="vertical-orbit-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Glowing Core */}
          <circle cx="100" cy="100" r="45" fill="url(#core-glow)" />
          
          {/* Core Planet (Center Eye/Orbit Dot) */}
          <circle cx="100" cy="100" r="16" fill="#050508" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="7" fill="#8b5cf6" />
          <circle cx="100" cy="100" r="23" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

          {/* Main Horizontal Orbit tilted */}
          <g transform="rotate(-7 100 100)">
            {/* Outer Orbit Line */}
            <ellipse cx="100" cy="100" rx="88" ry="30" stroke="url(#orbit-grad-primary)" strokeWidth="2.5" />
            
            {/* Dashed outer accent orbit */}
            <ellipse cx="100" cy="100" rx="96" ry="36" stroke="url(#orbit-grad-primary)" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.4" />

            {/* Orbit Dots (Celestial Nodes) */}
            <circle cx="12" cy="100" r="5" fill="#22d3ee" />
            <circle cx="12" cy="100" r="9" stroke="#22d3ee" strokeWidth="1.2" opacity="0.3" className="animate-ping" style={{ transformOrigin: '12px 100px' }} />
            <circle cx="188" cy="100" r="4" fill="#22d3ee" />
          </g>

          {/* Vertical Orbit Path (Slightly tilted cross-orbit) */}
          <g transform="rotate(15 100 100)">
            {/* Dashed vertical curved orbital tracker */}
            <path d="M 68,100 A 32,85 0 0,1 100,15" stroke="url(#vertical-orbit-grad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 100,15 A 32,85 0 0,1 132,100" stroke="url(#vertical-orbit-grad)" strokeWidth="1.5" opacity="0.9" />
            <path d="M 132,100 A 32,85 0 0,1 100,185" stroke="url(#vertical-orbit-grad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 100,185 A 32,85 0 0,1 68,100" stroke="url(#vertical-orbit-grad)" strokeWidth="1.5" opacity="0.3" />
            
            {/* Glowing White Node at top of vertical orbit */}
            <circle cx="100" cy="15" r="4.5" fill="#ffffff" />
            <circle cx="100" cy="15" r="9.5" stroke="#ffffff" strokeWidth="1" opacity="0.4" className="animate-pulse" style={{ transformOrigin: '100px 15px' }} />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span 
              className="text-white font-display font-extrabold tracking-wide uppercase" 
              style={{ 
                fontSize: 
                  size === 'sm' ? '13px' : 
                  size === 'md' ? '18px' : 
                  size === 'lg' ? '32px' : 
                  size === 'xl' ? '54px' : 
                  size === 'custom_hero' ? '30px md:text-46px' : '18px',
                lineHeight: '1'
              }}
            >
              WENTIX
            </span>
            <span 
              className="ml-1 font-display font-extrabold uppercase bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent" 
              style={{ 
                fontSize: 
                  size === 'sm' ? '13px' : 
                  size === 'md' ? '18px' : 
                  size === 'lg' ? '32px' : 
                  size === 'xl' ? '54px' : 
                  size === 'custom_hero' ? '30px md:text-46px' : '18px',
                lineHeight: '1'
              }}
            >
              AI
            </span>
          </div>
          
          {/* Horizontal Gradient thin line separator */}
          <div className="w-full h-[1px] bg-gradient-to-r from-cyan-500/20 via-purple-500/60 to-cyan-500/20 my-1 md:my-1.5" />
          
          <span 
            className="text-cyan-400 font-mono tracking-[0.25em] uppercase text-center block" 
            style={{ 
              fontSize: 
                size === 'sm' ? '5px' : 
                size === 'md' ? '6.5px' : 
                size === 'lg' ? '10px' : 
                size === 'xl' ? '16px' : 
                size === 'custom_hero' ? '9px md:text-11px' : '6.5px',
              letterSpacing: 
                size === 'sm' ? '0.2em' : 
                size === 'xl' ? '0.3em' : 
                size === 'custom_hero' ? '0.28em' : '0.25em'
            }}
          >
            ORBITAL INTELLIGENCE
          </span>
        </div>
      )}
    </div>
  );
};
