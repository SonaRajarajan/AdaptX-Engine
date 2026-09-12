import React from 'react';

export const OrganicBlobBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Organic Blob 1: Soft Lilac Top-Right */}
        <path
          d="M1000 0C1150 80 1300 50 1440 120V0H1000Z"
          fill="#B5A8F7"
          stroke="#000000"
          strokeWidth="3"
        />
        <path
          d="M850 -50C1050 100 1250 180 1440 280V400C1300 320 1100 380 950 250C820 130 700 -20 850 -50Z"
          fill="#C8BDFF"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Organic Blob 2: Warm Gold Center-Left */}
        <path
          d="M-50 150C180 120 350 280 280 500C220 680 -50 720 -100 500V150Z"
          fill="#FFC72C"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Organic Blob 3: Coral Pink Center Right */}
        <path
          d="M1100 450C1300 420 1480 600 1440 800C1380 920 1150 880 1050 720C960 580 980 470 1100 450Z"
          fill="#FF8A8A"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Organic Blob 4: Soft Mint/Teal Bottom Left */}
        <path
          d="M-80 600C120 580 240 750 180 920H-80V600Z"
          fill="#5CE1E6"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Organic Blob 5: Sage Green Bottom Center */}
        <path
          d="M400 920C450 780 650 720 800 820C920 900 850 950 750 950H400V920Z"
          fill="#48BB78"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Organic Blob 6: Soft Lavender Mid-Left */}
        <path
          d="M250 100C400 40 550 180 480 320C420 440 280 380 220 280C170 200 180 140 250 100Z"
          fill="#A594F9"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Background Grid Dots Overlay */}
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#000000" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
    </div>
  );
};
