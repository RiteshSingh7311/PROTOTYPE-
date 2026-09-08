import React, { useState } from 'react';

export const SihLogo: React.FC<{ className?: string }> = ({ className = "h-9" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official SIH Logo Image */}
      <div className="relative flex items-center justify-center shrink-0">
        {!imageError ? (
          <img
            src="/sih-logo.png"
            alt="Smart India Hackathon Logo"
            onError={() => setImageError(true)}
            className="w-9 h-9 object-contain rounded-md drop-shadow-xs bg-white p-0.5 border border-slate-200"
          />
        ) : (
          <img
            src="https://yt3.googleusercontent.com/ytc/AIdro_mvuV7A2Kr37-KaT0OYa1kcvCNE4Jj8ML4cW8O5Dbc-bg=s900-c-k-c0x00ffffff-no-rj"
            alt="Smart India Hackathon Logo"
            className="w-9 h-9 object-contain rounded-md drop-shadow-xs bg-white p-0.5 border border-slate-200"
          />
        )}
      </div>

      {/* SIH Title Badge */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-black tracking-wider text-slate-900 uppercase font-display">
            SIH 2026
          </span>
          <span className="text-[9px] font-bold bg-orange-600 text-white px-1 py-0.2 rounded">
            OFFICIAL
          </span>
        </div>
        <span className="text-[9px] font-medium text-slate-500">
          Govt. of India Initiative
        </span>
      </div>
    </div>
  );
};
