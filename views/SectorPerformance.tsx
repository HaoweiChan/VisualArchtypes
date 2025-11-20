import React, { useMemo, useState, useContext } from 'react';
import { Play, Pause, Info } from 'lucide-react';
import { getSectorBubbleData } from '../utils/graphUtils';
import { SectorBubbleData } from '../types';
import { ThemeContext } from '../App';

// Helper to map percentage return to color (Green positive, Red negative)
const getColor = (returnRate: number) => {
  if (returnRate >= 3) return '#10b981';
  if (returnRate > 0) return '#86efac';
  if (returnRate === 0) return '#94a3b8';
  if (returnRate > -3) return '#fca5a5';
  return '#ef4444';
};

const SectorPerformance: React.FC = () => {
  const rawData = useMemo(() => getSectorBubbleData(), []);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState(100); 
  const { isDark } = useContext(ThemeContext);

  // Chart Dimensions
  const width = 1000;
  const height = 500;
  const padding = { top: 40, right: 60, bottom: 60, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scales
  const xMax = 14; // 14 Trillion
  const yMax = 45; // 45%
  const yMin = -5; // -5%

  const xScale = (val: number) => (val / xMax) * graphWidth;
  const yScale = (val: number) => graphHeight - ((val - yMin) / (yMax - yMin)) * graphHeight;
  const rScale = (vol: number) => Math.sqrt(vol) * 5; // Size of bubble

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <div className={`px-8 py-6 flex justify-between items-end border-b transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sector Performance</h1>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="text-indigo-500 hover:underline cursor-pointer">Home</span> 
            <span>/</span>
            <span>Industry Analysis</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex justify-between w-48 text-[10px] text-slate-500 uppercase tracking-wider">
             <span>Return %</span>
             <span>Market Cap</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Color Bar */}
            <div className="w-32 h-2 rounded-full bg-gradient-to-r from-red-400 via-slate-300 to-green-400" />
            {/* Size Circles */}
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 rounded-full border border-slate-400" />
               <div className="w-3 h-3 rounded-full border border-slate-400" />
               <div className="w-4 h-4 rounded-full border border-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Chart Area */}
        <div className="flex-1 relative p-4">
           <div className={`w-full h-full relative border rounded-lg overflow-hidden shadow-sm transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              
              {/* SVG Container */}
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                 <g transform={`translate(${padding.left}, ${padding.top})`}>
                    
                    {/* Grid Lines Y */}
                    {[0, 10, 20, 30, 40].map(tick => {
                        const y = yScale(tick);
                        return (
                          <g key={tick}>
                            <line x1={0} y1={y} x2={graphWidth} y2={y} stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="4 4" />
                            <text x={-10} y={y} dy={4} textAnchor="end" fill="#94a3b8" fontSize="10">{tick}%</text>
                          </g>
                        );
                    })}
                    {/* Zero Line */}
                    <line x1={0} y1={yScale(0)} x2={graphWidth} y2={yScale(0)} stroke="#94a3b8" strokeWidth="1" />

                    {/* Grid Lines X */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(tick => {
                        const x = xScale(tick);
                        return (
                          <g key={tick}>
                            <line x1={x} y1={0} x2={x} y2={graphHeight} stroke={isDark ? '#334155' : '#e2e8f0'} strokeDasharray="4 4" />
                            <text x={x} y={graphHeight + 20} textAnchor="middle" fill="#94a3b8" fontSize="10">{tick}T</text>
                          </g>
                        );
                    })}

                    {/* Axis Labels */}
                    <text x={-40} y={graphHeight/2} transform={`rotate(-90, -40, ${graphHeight/2})`} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
                        Recent 60-Day Return
                    </text>
                    <text x={graphWidth - 20} y={graphHeight + 40} textAnchor="end" fill="#64748b" fontSize="12" fontWeight="bold">
                        X-Axis: Market Cap (Trillion)
                    </text>


                    {/* Bubbles */}
                    {rawData.map((item) => {
                       const x = xScale(item.marketCap);
                       const y = yScale(item.returnRate);
                       const r = rScale(item.volume);
                       const color = getColor(item.returnRate);
                       const isSelected = selectedSectorId === item.id;
                       
                       // Determine text color based on bubble size/theme if inside bubble, or use contrast
                       // For simplicity, we use dark text for bright bubbles or fallback
                       
                       return (
                         <g 
                            key={item.id} 
                            transform={`translate(${x}, ${y})`}
                            className="transition-all duration-500 cursor-pointer group"
                            onClick={() => setSelectedSectorId(item.id)}
                            style={{ opacity: selectedSectorId && !isSelected ? 0.3 : 1 }}
                         >
                            <circle 
                              r={r} 
                              fill={color} 
                              fillOpacity={isDark ? 0.7 : 0.8} 
                              stroke={isSelected ? (isDark ? '#fff' : '#0f172a') : color} 
                              strokeWidth={isSelected ? 2 : 1}
                            />
                            {/* Label */}
                            {(r > 20 || isSelected) && (
                                <text 
                                  textAnchor="middle" 
                                  dy={-r - 5} 
                                  fill={isDark ? '#e2e8f0' : '#334155'} 
                                  fontSize="12" 
                                  fontWeight="bold"
                                  className="pointer-events-none"
                                >
                                    {item.label}
                                </text>
                            )}
                         </g>
                       );
                    })}

                 </g>
              </svg>

              {/* Tooltip / Info Overlay */}
              <div className="absolute top-4 left-4">
                  {selectedSectorId && (() => {
                      const s = rawData.find(i => i.id === selectedSectorId);
                      if (!s) return null;
                      return (
                        <div className={`backdrop-blur border p-4 rounded-lg shadow-xl ${isDark ? 'bg-slate-800/90 border-slate-600' : 'bg-white/90 border-slate-200'}`}>
                           <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.label}</h3>
                           <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <span className="text-slate-500">Market Cap</span>
                              <span className={`text-right font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.marketCap}T</span>
                              
                              <span className="text-slate-500">Return (60d)</span>
                              <span className={`text-right font-mono font-bold ${s.returnRate > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {s.returnRate > 0 ? '+' : ''}{s.returnRate}%
                              </span>
                              
                              <span className="text-slate-500">Volume</span>
                              <span className={`text-right font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.volume}M</span>
                           </div>
                        </div>
                      )
                  })()}
              </div>

           </div>
        </div>

        {/* Right Sidebar: Selection List */}
        <div className={`w-64 border-l flex flex-col transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By 60D Return</span>
               <Info size={14} className="text-slate-400" />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
               {[...rawData].sort((a,b) => b.returnRate - a.returnRate).map(item => (
                 <div 
                    key={item.id}
                    onClick={() => setSelectedSectorId(item.id === selectedSectorId ? null : item.id)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        selectedSectorId === item.id 
                            ? (isDark ? 'bg-indigo-900/30 border border-indigo-800' : 'bg-indigo-50 border border-indigo-100')
                            : (isDark ? 'hover:bg-slate-800 border border-transparent' : 'hover:bg-white border border-transparent')
                    }`}
                 >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(item.returnRate) }} />
                    <span className={`text-sm truncate flex-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                    <span className={`text-xs font-mono ${item.returnRate > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.returnRate}%
                    </span>
                 </div>
               ))}
            </div>
        </div>
      </div>

      {/* Bottom Controls (Slider) */}
      <div className={`h-16 border-t px-8 flex items-center gap-6 transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
            {timeValue < 100 ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
         </button>
         
         <div className="flex-1 relative">
            <div className={`h-1 rounded-full w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
               <div className="h-full bg-indigo-500 rounded-full relative" style={{ width: `${timeValue}%` }}>
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-lg transform scale-125 cursor-grab border-2 ${isDark ? 'border-slate-900' : 'border-white'}`} />
                  <div className="absolute right-0 -top-8 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transform -translate-x-1/2">
                     2025-09-24
                  </div>
               </div>
            </div>
         </div>
         
         <div className="text-xs font-mono text-slate-400 w-24 text-right">
            LIVE DATA
         </div>
      </div>

    </div>
  );
};

export default SectorPerformance;