import React from 'react';
import { TrendingUp, ArrowUpRight, Clock, ChevronRight } from 'lucide-react';
import LayeredGraph from './LayeredGraph';
import ForceGraph from './ForceGraph';
import SankeyGraph from './SankeyGraph';

const StockHeader = () => (
  <div className="bg-white border-b border-slate-200 px-8 py-6">
    <div className="flex items-start justify-between max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tesla, Inc.</h1>
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 font-mono text-xs px-1.5 py-0.5 rounded">TSLA</span>
              <span className="text-slate-400 text-sm">NASDAQ</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center justify-end gap-3">
            <span className="text-3xl font-bold text-slate-900">$173.80</span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-sm font-bold">
                <ArrowUpRight size={16} />
                +3.24%
            </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">Market Open • Real-time Data</p>
      </div>
    </div>

    {/* Simple Sparkline Visualization */}
    <div className="max-w-7xl mx-auto mt-6 h-16 overflow-hidden relative">
        <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0,50 C100,40 200,60 300,30 C400,45 500,20 600,25 C700,40 800,10 900,15 L900,64 L0,64 Z" fill="url(#gradient)" />
            <path d="M0,50 C100,40 200,60 300,30 C400,45 500,20 600,25 C700,40 800,10 900,15" fill="none" stroke="#4f46e5" strokeWidth="2" />
        </svg>
    </div>
  </div>
);

const NewsCard = ({ 
    category, 
    date, 
    title, 
    summary, 
    children,
    colorClass = "bg-indigo-50 text-indigo-700"
}: { 
    category: string; 
    date: string; 
    title: string; 
    summary: string; 
    children: React.ReactNode;
    colorClass?: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-[420px]">
    <div className="p-5 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${colorClass}`}>
          {category}
        </span>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={12} />
            {date}
        </div>
      </div>
      <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{summary}</p>
    </div>
    
    {/* Visualization Container */}
    <div className="flex-1 bg-slate-50 border-t border-slate-100 relative">
        <div className="absolute inset-0">
            {children}
        </div>
        {/* Overlay to indicate interactivity */}
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-100 shadow-sm pointer-events-none">
            Interactive Plot
        </div>
    </div>

    <div className="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
         <span className="text-xs text-slate-400 font-medium">AI-Generated Insight</span>
         <button className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
            Read Full Report <ChevronRight size={12} />
         </button>
    </div>
  </div>
);

const StockDashboard: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto pb-12">
      <StockHeader />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Strategic Intelligence Feed</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Supply Chain */}
            <NewsCard 
                category="Supply Chain"
                date="2 hrs ago"
                title="Battery Material Sourcing Risks"
                summary="Analysis of upstream dependencies on CATL reveals potential bottlenecks in the Asian market. Diversification strategies suggested."
                colorClass="bg-orange-50 text-orange-700"
            >
                <LayeredGraph isWidget />
            </NewsCard>

            {/* Card 2: Governance */}
            <NewsCard 
                category="Governance"
                date="1 day ago"
                title="Board Interlock Analysis"
                summary="New board appointments strengthen ties with SpaceX, raising questions about executive bandwidth and oversight overlap."
                colorClass="bg-blue-50 text-blue-700"
            >
                <ForceGraph isWidget />
            </NewsCard>

            {/* Card 3: Investment */}
            <NewsCard 
                category="Capital Flow"
                date="3 days ago"
                title="Institutional Inflows Surge"
                summary="Softbank Vision Fund and major ETF providers have increased positions significantly in Q3, signaling long-term confidence."
                colorClass="bg-emerald-50 text-emerald-700"
            >
                <SankeyGraph isWidget />
            </NewsCard>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;