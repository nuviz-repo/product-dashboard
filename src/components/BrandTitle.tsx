import React from 'react';

interface BrandTitleProps {
  size?: 'small' | 'large';
  collapsed?: boolean;
  className?: string;
}

const BrandTitle: React.FC<BrandTitleProps> = ({ 
  size = 'large', 
  collapsed = false,
  className = '' 
}) => {
  // Common styles for both sizes
  const commonStyles = {
    fontFamily: "'Pivot Grotesk Regular', sans-serif",
    lineHeight: 1,
    display: 'inline-block',
    position: 'relative' as const,
    // Adjust vertical position based on size
    top: size === 'large' ? '0' : '-3px' // Moved up slightly for better alignment
  };

  return (
    <h1 
      className={`brand-title ${
        size === 'large' 
          ? "text-[56px]" 
          : collapsed 
            ? "text-xl" 
            : "text-3xl"
      } ${className}`}
      style={{ 
        ...commonStyles,
        // Don't override color, let className handle it
        color: className.includes('text-white') ? undefined : '#343dea'
      }}
    >
      {collapsed && size === 'small' ? "nv" : "nuviz"}
    </h1>
  );
};

export default BrandTitle;