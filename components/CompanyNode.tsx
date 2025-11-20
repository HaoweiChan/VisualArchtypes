import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Building2, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CompanyData, DisplayMode, NodeStyle } from '../types';

// --- Helper: Sparkline Component ---
const Sparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  if (!data || data.length === 0) return null;
  
  const width = 50; // Slightly smaller to fit
  const height = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CompanyNode = ({ data, isConnectable }: NodeProps<CompanyData>) => {
  const mode = data.displayMode || DisplayMode.PRICE;
  const style = data.nodeStyle || NodeStyle.SOLID;
  
  const isRisk = data.status === 'Risk';
  const isPositive = (data.changeVal || 0) >= 0;

  // --- RENDER: PRICE CHART MODE (Rectangular Card) ---
  if (mode === DisplayMode.PRICE) {
    const borderColor = isRisk ? 'border-red-400' : 'border-slate-300';
    const bgColor = isRisk ? 'bg-red-50' : 'bg-white';
    const shadow = 'shadow-sm hover:shadow-md';

    return (
      <div className={`relative group min-w-[220px] rounded-lg border-2 ${borderColor} ${bgColor} ${shadow} p-3 transition-all duration-200`}>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!w-2 !h-2 !bg-slate-400" />
        
        {/* Header: Label & Ticker */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isRisk ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {isRisk ? <AlertTriangle size={16} /> : <Building2 size={16} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight">{data.label}</h3>
              {data.ticker && (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                  {data.ticker}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Mini-Chart (Left), Price (Middle-Left), Role (Right) */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-100/50">
          
          {/* Left Group: Chart & Price */}
          <div className="flex items-center gap-3">
            <div className="pb-0.5">
               <Sparkline data={data.history || []} isPositive={isPositive} />
            </div>
            
            <div>
               <div className="text-xs font-bold text-slate-900 leading-none mb-1">${data.price || '0.00'}</div>
               <div className={`text-[9px] font-bold flex items-center gap-0.5 leading-none ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {data.change || '0%'}
               </div>
            </div>
          </div>

          {/* Right: Role */}
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
             {data.type || 'ENTITY'}
          </div>

        </div>
        
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!w-2 !h-2 !bg-slate-400" />
      </div>
    );
  }

  // --- RENDER: MARKET CAP / REVENUE MODE (Circular Bubble) ---
  // Scaling Logic
  let scaleValue = 1;
  let valueText = '';
  let labelText = mode === DisplayMode.MARKET_CAP ? 'Market Cap' : 'Revenue';

  if (mode === DisplayMode.MARKET_CAP) {
     const val = data.marketCapVal || 100;
     // Map 1B - 3000B to scale 0.8 - 1.8 roughly
     scaleValue = 0.8 + Math.log10(val) * 0.25; 
     valueText = `$${data.marketCap}`;
  } else {
     const val = data.revenueVal || 10;
     scaleValue = 0.8 + Math.log10(val) * 0.25;
     valueText = `$${data.revenue}`;
  }
  
  // Clamp scale to reasonable limits
  scaleValue = Math.min(Math.max(scaleValue, 0.7), 2.2);

  const baseSize = 130; // Base pixel size
  const size = baseSize * scaleValue;

  // Styles
  const isGhost = style === NodeStyle.GHOST;
  const bubbleClass = isGhost 
      ? 'bg-white/90 border-4 border-slate-500/50 text-slate-700'
      : 'bg-slate-700 text-white border-4 border-slate-600';

  return (
    <div 
      className={`relative rounded-full flex flex-col items-center justify-center transition-all duration-500 ${bubbleClass} shadow-lg`}
      style={{ width: size, height: size }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!opacity-0" />
      
      <div className="text-center px-2 overflow-hidden">
          <div className={`font-black leading-none mb-1 ${isGhost ? 'text-slate-800' : 'text-white'}`} style={{ fontSize: 14 * scaleValue }}>
             {data.ticker || data.label.substring(0,4).toUpperCase()}
          </div>
          <div className={`text-[10px] leading-tight mb-1 opacity-80 font-medium ${isGhost ? 'text-slate-500' : 'text-slate-300'}`} style={{ fontSize: 10 * scaleValue }}>
             {data.label}
          </div>
          <div className={`font-bold ${isGhost ? 'text-slate-900' : 'text-emerald-300'}`} style={{ fontSize: 16 * scaleValue }}>
             {valueText}
          </div>
      </div>
      
      {/* Tag for mode (optional) */}
      {scaleValue > 1.2 && (
          <div className="absolute bottom-4 text-[8px] uppercase tracking-widest opacity-50">
              {labelText}
          </div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!opacity-0" />
    </div>
  );
};

export default memo(CompanyNode);