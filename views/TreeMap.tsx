import React, { useMemo, useState, useRef } from 'react';
import { getTreeMapData } from '../utils/graphUtils';
import { TreeMapItem } from '../types';

// --- Helper: Color Logic (Finviz Style) ---
const getPerformanceColor = (change: number) => {
    // Finviz scale: Bright Green (+3%) to Bright Red (-3%)
    // We use a slightly softer palette for UI consistency
    if (change >= 3) return '#10b981'; // Bright Emerald
    if (change >= 1) return '#34d399'; // Soft Emerald
    if (change > 0) return '#6ee7b7'; // Light Emerald
    if (change === 0) return '#4b5563'; // Grey
    if (change <= -3) return '#ef4444'; // Bright Red
    if (change <= -1) return '#f87171'; // Soft Red
    return '#fca5a5'; // Light Red
};

// --- Component: Detailed Tooltip ---
const Tooltip = ({ item, position }: { item: TreeMapItem, position: { x: number, y: number } }) => {
    const isPositive = item.change >= 0;
    
    // Helper for sparkline in tooltip
    const Sparkline = ({ data }: { data: number[] }) => {
        if (!data || data.length === 0) return null;
        const width = 100;
        const height = 30;
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
                <polyline points={points} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    // Determine positioning (prevent going off screen)
    const style: React.CSSProperties = {
        top: position.y + 10,
        left: position.x + 10,
        zIndex: 100
    };

    // Adjust if close to right edge
    if (window.innerWidth - position.x < 250) {
        style.left = position.x - 260;
    }

    return (
        <div className="fixed bg-white shadow-2xl rounded-lg overflow-hidden w-64 border border-slate-200 pointer-events-none animate-in fade-in zoom-in-95 duration-150" style={style}>
            {/* Header */}
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                     {item.ticker ? 'Stock' : 'Sector'}
                 </div>
                 <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h3>
            </div>

            {/* Body */}
            <div className="p-4" style={{ backgroundColor: getPerformanceColor(item.change) }}>
                 <div className="flex items-center justify-between text-white mb-2">
                     <span className="text-2xl font-bold">{item.ticker || 'IDX'}</span>
                     <div className="text-right">
                         <div className="text-lg font-bold leading-none">{item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%</div>
                         <div className="text-xs opacity-80">{item.price ? `$${item.price}` : ''}</div>
                     </div>
                 </div>
                 
                 {item.history && (
                    <div className="mt-2 border-t border-white/30 pt-2">
                        <Sparkline data={item.history} />
                    </div>
                 )}
            </div>
            
            {/* Footer Stats */}
            <div className="bg-white p-2 flex justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>Mkt Cap: ${(item.value / 10).toFixed(1)}B</span>
                <span>Vol: 1.2M</span>
            </div>
        </div>
    );
};


// --- Component: Recursive Treemap Tile ---
const TreeMapTile = ({ 
    item, 
    depth = 0, 
    onHover, 
    onLeave 
}: { 
    item: TreeMapItem, 
    depth?: number, 
    onHover: (item: TreeMapItem, e: React.MouseEvent) => void,
    onLeave: () => void
}) => {
    // Layout Logic:
    // We simulate squarified tiling by using Flexbox.
    // Items are given flex-grow based on their value.
    // This isn't a perfect squarified algorithm, but it creates a very similar "packed" effect for web.
    
    const isLeaf = !item.children || item.children.length === 0;
    const color = getPerformanceColor(item.change);

    if (isLeaf) {
        return (
            <div 
                className="relative border border-slate-900/10 overflow-hidden group transition-all duration-200 hover:z-10 hover:shadow-[0_0_0_2px_white]"
                style={{ 
                    flexGrow: item.value,
                    flexBasis: 'auto', // Allow grow to dominate
                    backgroundColor: color,
                    minWidth: item.value > 1000 ? '120px' : '60px', // Prevent tiny boxes
                    minHeight: '40px'
                }}
                onMouseEnter={(e) => onHover(item, e)}
                onMouseMove={(e) => onHover(item, e)}
                onMouseLeave={onLeave}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-white font-bold text-sm drop-shadow-md leading-none truncate w-full">
                        {item.ticker}
                    </span>
                    {/* Only show percent if box is big enough */}
                    {item.value > 200 && (
                        <span className="text-white text-[10px] font-medium drop-shadow-md mt-0.5">
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Non-Leaf (Sector/Industry)
    return (
        <div 
            className="flex flex-col border border-slate-900/5 overflow-hidden relative bg-white"
            style={{ 
                flexGrow: item.value,
                flexBasis: '200px' // Minimum width for sectors
            }}
        >
            {/* Header for Sector/Industry */}
            <div className="bg-slate-50 border-b border-slate-200 px-2 py-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate block">
                    {item.name}
                </span>
            </div>
            
            {/* Container for children */}
            <div className="flex flex-wrap content-stretch h-full w-full">
                {item.children!.map((child) => (
                    <TreeMapTile 
                        key={child.id} 
                        item={child} 
                        depth={depth + 1} 
                        onHover={onHover}
                        onLeave={onLeave}
                    />
                ))}
            </div>
        </div>
    );
};

const TreeMap: React.FC = () => {
    const data = useMemo(() => getTreeMapData(), []);
    const [hoveredItem, setHoveredItem] = useState<TreeMapItem | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleHover = (item: TreeMapItem, e: React.MouseEvent) => {
        setHoveredItem(item);
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className="w-full h-full bg-slate-100 p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-800">S&P 500 Map</h1>
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#ef4444]"></div> -3%
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#4b5563]"></div> 0%
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#10b981]"></div> +3%
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-white border border-slate-300 shadow-sm flex flex-wrap content-stretch overflow-hidden">
                {/* We map the top level Sectors */}
                {data.map((sector) => (
                    <TreeMapTile 
                        key={sector.id} 
                        item={sector} 
                        onHover={handleHover} 
                        onLeave={handleLeave}
                    />
                ))}
            </div>

            {/* Tooltip Portal */}
            {hoveredItem && <Tooltip item={hoveredItem} position={mousePos} />}
        </div>
    );
};

export default TreeMap;