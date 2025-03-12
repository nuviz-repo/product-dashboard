import { useEffect, useRef } from 'react';

export function useAlignedTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    // Calculate and apply precise alignment if needed
    const alignTitles = () => {
      // This runs once after mount and can be expanded to handle 
      // communication between components if needed
      document.dispatchEvent(new CustomEvent('title-aligned'));
    };
    
    alignTitles();
    window.addEventListener('resize', alignTitles);
    
    return () => {
      window.removeEventListener('resize', alignTitles);
    };
  }, []);
  
  return titleRef;
} 