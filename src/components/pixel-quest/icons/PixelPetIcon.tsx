import type { SVGProps } from 'react';

interface PixelPetIconProps extends SVGProps<SVGSVGElement> {
  petColorClass?: string;
}

export function PixelPetIcon({ petColorClass = 'fill-primary', ...props }: PixelPetIconProps) {
  // This SVG is a simple placeholder. A real pixel pet would be more complex.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={petColorClass}
      width="3em"
      height="3em"
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      {/* Simple 4x4 body */}
      <rect x="6" y="6" width="4" height="4" />
      {/* Ears */}
      <rect x="6" y="5" width="1" height="1" />
      <rect x="9" y="5" width="1" height="1" />
      {/* Eyes (using background color for cut-out effect if petColorClass is a fill) */}
      <rect x="7" y="7" width="1" height="1" className="fill-background" />
      <rect x="8" y="7" width="1" height="1" className="fill-background" />
    </svg>
  );
}
