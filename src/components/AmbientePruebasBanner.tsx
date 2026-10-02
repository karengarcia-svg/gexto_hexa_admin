import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const AmbientePruebasBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#fef9c3] border-b border-[#fde047] py-1.5 px-4 text-center select-none relative overflow-hidden">
      {/* Subtle diagonal stripes pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #ca8a04 0, #ca8a04 10px, transparent 0, transparent 20px)'
        }}
      />
      <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-semibold text-[#854d0e] tracking-wide">
        <span className="w-2 h-2 rounded-full bg-[#eab308] inline-block animate-pulse"></span>
        <AlertTriangle className="w-3.5 h-3.5 text-[#ca8a04]" />
        <span>AMBIENTE PRUEBAS — https://gextotest.hexalabs.com.co</span>
      </div>
    </div>
  );
};
