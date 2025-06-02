import type { SVGProps } from 'react';

export function PixelCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="1em"
      height="1em"
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      <path d="M3 8L3 9L4 9L4 10L5 10L5 11L6 11L6 12L7 12L7 11L8 11L8 10L9 10L9 9L10 9L10 8L11 8L11 7L12 7L12 6L13 6L13 5L12 5L12 6L11 6L11 7L10 7L10 8L9 8L9 9L8 9L8 10L7 10L7 11L6 11L6 10L5 10L5 9L4 9L4 8L3 8Z" />
    </svg>
  );
}
