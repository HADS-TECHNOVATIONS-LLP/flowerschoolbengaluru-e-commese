import { useEffect, useState } from 'react';

// Creative floating elements component
export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-lg animate-bounce delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-pink-300/20 rounded-full blur-lg animate-bounce delay-700"></div>
    </div>
  );
}

// Creative scroll indicators
export function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
}

// Creative section dividers
export function SectionDivider({ variant = 'wave' }: { variant?: 'wave' | 'zigzag' | 'curve' }) {
  const waves = {
    wave: "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
    zigzag: "M0,0L60,21.3C120,43,240,85,360,85.3C480,85,600,43,720,32C840,21,960,43,1080,48C1200,53,1320,43,1380,37.3L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z",
    curve: "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
  };

  return (
    <div className="relative w-full h-16 overflow-hidden">
      <svg 
        className="absolute bottom-0 w-full h-full" 
        viewBox="0 0 1440 64" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill="currentColor" 
          fillOpacity="0.1"
          d={waves[variant]}
        ></path>
      </svg>
    </div>
  );
}

// Creative hover cards
export function CreativeCard({ 
  children, 
  className = '', 
  glowColor = 'pink' 
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: 'pink' | 'purple' | 'blue';
}) {
  const glowClasses = {
    pink: 'hover:shadow-pink-500/25',
    purple: 'hover:shadow-purple-500/25', 
    blue: 'hover:shadow-blue-500/25'
  };

  return (
    <div className={`
      group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm 
      border border-gray-200/50 transition-all duration-500 hover:scale-105 
      hover:shadow-2xl ${glowClasses[glowColor]} hover:-translate-y-2 ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Creative button with enhanced animations
export function CreativeButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl',
    accent: 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
  };

  return (
    <button 
      onClick={onClick}
      className={`
        relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 
        transform hover:scale-105 hover:shadow-lg hover:-translate-y-1
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}