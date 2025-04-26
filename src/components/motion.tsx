import React from 'react';

type MotionProps = {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

// This is a lightweight motion component that can be replaced with framer-motion
export const motion = {
  div: ({
    children,
    initial,
    animate,
    transition,
    whileHover,
    className = '',
    style = {},
    onMouseEnter,
    onMouseLeave,
  }: MotionProps) => {
    const [hovered, setHovered] = React.useState(false);
    
    // Apply simple animation using CSS transitions
    const baseTransition = transition 
      ? `all ${transition.duration || 0.3}s ${transition.ease || 'ease'}`
      : 'all 0.3s ease';
    
    // Combine initial and animate styles
    const computedStyle: React.CSSProperties = {
      ...style,
      transition: baseTransition,
      ...(initial && !animate ? initial : {}),
      ...(animate ? animate : {}),
      ...(hovered && whileHover ? whileHover : {}),
    };
    
    // Handle hover state for whileHover prop
    const handleMouseEnter = (e: React.MouseEvent) => {
      setHovered(true);
      onMouseEnter?.(e);
    };
    
    const handleMouseLeave = (e: React.MouseEvent) => {
      setHovered(false);
      onMouseLeave?.(e);
    };
    
    return (
      <div 
        className={className}
        style={computedStyle}
        onMouseEnter={whileHover ? handleMouseEnter : onMouseEnter}
        onMouseLeave={whileHover ? handleMouseLeave : onMouseLeave}
      >
        {children}
      </div>
    );
  }
};