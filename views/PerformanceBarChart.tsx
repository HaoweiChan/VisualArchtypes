import React, { useMemo, useContext } from 'react';
import { getSectorPerformanceStats } from '../utils/graphUtils';
import { SectorStat } from '../types';
import { ThemeContext } from '../App';

const BarGroup = ({ title, data, isDark }: { title: string, data: SectorStat[], isDark: boolean }) => {
    const maxVal = Math.max(...data.map(d => Math.abs(d.value)));
    
    return (
        <div className="flex flex-col h-full">
            <h3 className={`text-lg font-bold mb-4 uppercase tracking-wide border-b pb-2 ${isDark ? 'text-slate-200 border-slate-700' : 'text-slate-700 border-slate-300'}`}>
                {title}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-4">
                {data.map((item, idx) => {
                    const isPositive = item.value >= 0;
                    const width = (Math.abs(item.value) / maxVal) * 100;
                    
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between text-xs text-slate-400 mb-0.5">
                                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.label}</span>
                                <span className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
                                    {isPositive ? '+' : ''}{item.value.toFixed(2)}%
                                </span>
                            </div>
                            <div className={`w-full h-6 rounded-sm overflow-hidden relative ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                <div 
                                    className={`h-full transition-all duration-700 ease-out ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${width}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PerformanceBarChart: React.FC = () => {
    const stats = useMemo(() => getSectorPerformanceStats(), []);
    const { isDark } = useContext(ThemeContext);

    return (
        <div className={`w-full h-full p-8 overflow-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-slate-50 text-slate-900'}`}>
             <div className="mb-8">
                 <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sector Performance</h1>
                 <p className="text-slate-500 text-sm">Comparative analysis of sector rotation over time.</p>
             </div>
             
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden">
                 <BarGroup title="1 Day Performance" data={stats.day} isDark={isDark} />
                 <BarGroup title="1 Week Performance" data={stats.week} isDark={isDark} />
             </div>
        </div>
    );
};

export default PerformanceBarChart;