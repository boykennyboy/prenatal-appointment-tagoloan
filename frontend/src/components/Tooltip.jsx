import { useState, useRef } from 'react';
import cn from '../utils/cn';

const Tooltip = ({
  title,
  toggle = false,
  hasColor = false,
  className,
  secondClassName,
  minusRight = 16,
  children,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (!toggle) return;

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: rect.right - minusRight, // Default 16px to the right of the element
        y: rect.top + rect.height / 2, // Vertically centered
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  if (!toggle) {
    return children;
  }

  return (
    <>
      <div
        className='relative w-full h-full'
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className='fixed z-[9999] pointer-events-none transition-opacity duration-200 -translate-y-1/2'
          style={{ left: position.x, top: position.y }}
        >
          <div
            className={cn(
              `text-white text-sm px-3 py-2 rounded-md whitespace-nowrap shadow-lg bg-purple-500 ${className}`
            )}
          >
            {title}
            <div
              className={cn(
                `absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-purple-500 ${secondClassName}`
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
