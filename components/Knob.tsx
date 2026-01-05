
import React, { useState, useEffect, useRef } from 'react';

interface KnobProps {
  value: number;
  onChange: (val: number) => void;
  label: string;
  subLabel: string;
  steps?: number; // Optional: if provided, the knob snaps to discrete steps
}

const Knob: React.FC<KnobProps> = ({ value, onChange, label, subLabel, steps }) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  // Constants for calculation
  const MIN_ANGLE = -135;
  const MAX_ANGLE = 135;

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle > 180) angle -= 360;

      // Constrain angle
      const clampedAngle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle));
      const range = MAX_ANGLE - MIN_ANGLE;
      const normalized01 = (clampedAngle - MIN_ANGLE) / range;
      
      let newValue = normalized01 * 100;

      if (steps && steps > 1) {
        const stepSize = 100 / (steps - 1);
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      
      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange, steps]);

  const rotation = (value / 100) * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;

  // Dots logic - we use 25 dots for the visual scale
  const dotCount = 25;
  const dots = Array.from({ length: dotCount });

  return (
    <div className="flex flex-col items-center">
      {/* Reduced size from w-56 to w-44 */}
      <div className="relative flex items-center justify-center w-44 h-44">
        {/* Scale Dots */}
        {dots.map((_, i) => {
          const dotAngle = (i / (dotCount - 1)) * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
          const isActive = rotation >= dotAngle - 1; // Small buffer for snapping
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full transition-colors duration-200 ${isActive ? 'bg-black opacity-80' : 'bg-black opacity-10'}`}
              style={{
                // Reduced radius from 100px to 80px
                transform: `rotate(${dotAngle}deg) translateY(-80px)`
              }}
            />
          );
        })}

        {/* Knob Body - Reduced size from w-40 to w-32 */}
        <div 
          ref={knobRef}
          onMouseDown={handleMouseDown}
          className="relative w-32 h-32 rounded-full bg-[#d9d9d9] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff,inset_0_0_12px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer select-none group"
        >
          {/* Inner Surface */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#e6e6e6] to-[#cccccc] shadow-inner flex items-center justify-center overflow-hidden">
            {/* Indicator */}
            <div 
              className="absolute w-full h-full pointer-events-none transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Reduced height from top-4 to top-3 and size */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-black rounded-full opacity-80" />
            </div>

             {/* Texture/Grip lines (radial) */}
             <div className="absolute inset-0 opacity-5 pointer-events-none rounded-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">{label}</span>
        <span className="block text-[9px] text-black/30 font-medium">{subLabel}</span>
      </div>
    </div>
  );
};

export default Knob;
