import React, { useContext } from 'react';
import { Search, ArrowDownRight, ArrowUpRight, Globe, Clock, ChevronRight, BarChart2 } from 'lucide-react';
import LayeredGraph from './LayeredGraph';
import ForceGraph from './ForceGraph';
import SankeyGraph from './SankeyGraph';
import TreeGraph from './TreeGraph';
import { ThemeContext } from '../App';

// --- Components for the Market Section ---

const MarketTickerItem = ({ label, value, change, isPositive, isDark }: { label: string; value: string; change: string; isPositive: boolean, isDark: boolean }) => (
  <div className={`flex flex-col min-w-[140px] p-3 rounded-lg transition-colors cursor-pointer border ${isDark ? 'hover:bg-white/5 border-transparent hover:border-white/10' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-slate-400 text-xs font-bold">{label}</span>
      {/* Mini Sparkline simulation */}
      <svg width="40" height="16" viewBox="0 0 40 16" className="opacity-50">
        <path 
          d={`M0,${isPositive ? 16 : 0} L10,${isPositive ? 10 : 6} L20,${isPositive ? 14 : 2} L30,${isPositive ? 4 : 12} L40,${isPositive ? 0 : 16}`} 
          fill="none" 
          stroke={isPositive ? '#10b981' : '#ef4444'} 
          strokeWidth="1.5" 
        />
      </svg>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`font-mono text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
      <span className={`text-xs font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </span>
    </div>
  </div>
);

const MainChart = ({ isDark }: { isDark: boolean }) => (
  <div className={`relative h-[300px] w-full rounded-xl border p-6 overflow-hidden transition-colors ${isDark ? 'bg-black border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
    <div className="absolute top-6 left-6 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">S&P 500</div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>6,617.33</h2>
        <span className="text-red-500 font-mono text-lg flex items-center">
          <ArrowDownRight size={20} /> -0.83%
        </span>
      </div>
      <p className="text-slate-500 text-xs mt-1">INDEXCBOE: SPX • Market Closed</p>
    </div>

    {/* Simulated TradingView Chart SVG */}
    <div className="absolute inset-0 top-16 bottom-0 w-full h-full">
       <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
          <defs>
             <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
             </linearGradient>
          </defs>
          {/* A jagged line mimicking market volatility */}
          <path 
            d="M0,250 C50,240 100,280 150,220 C200,180 250,260 300,240 C350,210 400,100 450,120 C500,140 550,80 600,90 C650,110 700,60 750,80 C800,120 850,100 900,150 C950,180 1000,300" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
          <path 
            d="M0,250 C50,240 100,280 150,220 C200,180 250,260 300,240 C350,210 400,100 450,120 C500,140 550,80 600,90 C650,110 700,60 750,80 C800,120 850,100 900,150 C950,180 1000,300 V400 H0 Z" 
            fill="url(#chartGradient)" 
          />
       </svg>
       
       {/* Grid lines */}
       <div className="absolute inset-0 pointer-events-none">
          <div className={`border-b h-1/4 w-full ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
          <div className={`border-b h-1/4 w-full ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
          <div className={`border-b h-1/4 w-full ${isDark ? 'border-white/5' : 'border-slate-100'}`}></div>
       </div>
    </div>
  </div>
);

// --- News Feed Component ---

interface StoryCardProps {
    source: string;
    time: string;
    title: string;
    children: React.ReactNode;
    graphTypeLabel: string;
    isDark: boolean;
    onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ 
  source, 
  time, 
  title, 
  children, 
  graphTypeLabel,
  isDark,
  onClick
}) => (
  <div 
    onClick={onClick}
    className={`rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-[450px] flex flex-col cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
  >
    {/* Header */}
    <div className={`p-4 border-b z-10 relative ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'}`}>
            N
          </div>
          <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{source}</span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          {graphTypeLabel}
        </div>
      </div>
      <h3 className={`text-lg font-bold leading-tight group-hover:text-indigo-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        {title}
      </h3>
    </div>

    {/* Graph Area */}
    <div className={`flex-1 relative ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>

    {/* Footer */}
    <div className={`px-4 py-3 border-t flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-1 text-slate-500 text-xs">
        <Globe size={12} />
        <span>Global Impact Analysis</span>
      </div>
      <button className="text-xs font-semibold text-indigo-500 flex items-center gap-1 hover:gap-2 transition-all">
        Deep Dive <ChevronRight size={12} />
      </button>
    </div>
  </div>
);

interface SearchPageProps {
  onOpenNews: (id: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onOpenNews }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`w-full h-full overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      
      {/* 1. StatementDog-style Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] pb-24 pt-16 px-6">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center text-white border border-white/30 shadow-2xl">
                <BarChart2 size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Steady Returns, <br/> Smarter Decisions.
            </h1>
            <p className="text-sky-100 text-lg mb-10 font-light opacity-90">
              Visual intelligence for the modern investor.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Enter symbol (e.g. TSLA, 2330, AAPL)..." 
                className={`w-full py-4 pl-12 pr-4 rounded-full shadow-xl border-0 placeholder:text-slate-400 focus:ring-4 focus:ring-sky-300/50 outline-none text-lg transition-all ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
              />
              <button className="absolute right-2 top-2 bottom-2 bg-sky-600 hover:bg-sky-700 text-white px-6 rounded-full font-bold text-sm transition-colors">
                Search
              </button>
            </div>
            
            <div className="mt-6 flex justify-center gap-3">
              {['台積電 2330', '鴻海 2317', 'NVIDIA NVDA', 'Tesla TSLA'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/90 text-xs rounded-full cursor-pointer border border-white/10 backdrop-blur-sm transition-colors">
                  {tag}
                </span>
              ))}
            </div>
        </div>
      </div>

      {/* 2. TradingView-style Market Data Section */}
      <div className={`py-8 border-b -mt-1 transition-colors duration-300 ${isDark ? 'bg-black text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Chart (Takes up 2/3 on large screens) */}
            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-lg">Market Overview</h3>
                 <div className="flex gap-2">
                    {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'].map((p, i) => (
                        <button key={p} className={`text-[10px] font-bold px-2 py-1 rounded ${i === 0 ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-400'}`}>
                            {p}
                        </button>
                    ))}
                 </div>
               </div>
               <MainChart isDark={isDark} />
            </div>

            {/* Indices List (Takes up 1/3) */}
            <div className="lg:col-span-1 flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-4 px-2">Global Indices</h3>
                <div className="space-y-1">
                    <MarketTickerItem label="Nasdaq 100" value="20,394.21" change="-1.20%" isPositive={false} isDark={isDark} />
                    <MarketTickerItem label="Dow Jones" value="44,782.00" change="+0.32%" isPositive={true} isDark={isDark} />
                    <MarketTickerItem label="Japan 225" value="38,537.65" change="-0.34%" isPositive={false} isDark={isDark} />
                    <MarketTickerItem label="SSE Composite" value="3,946.74" change="+0.18%" isPositive={true} isDark={isDark} />
                    <MarketTickerItem label="Bitcoin USD" value="93,120.50" change="-2.45%" isPositive={false} isDark={isDark} />
                    <MarketTickerItem label="Gold Futures" value="2,650.10" change="+0.80%" isPositive={true} isDark={isDark} />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. News & Graph Feed */}
      <div className={`py-12 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Top Stories <ChevronRight className="text-slate-400" />
            </h2>
            <span className="text-sm text-slate-500">Real-time insights generated by Graph AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Story 1 */}
             <StoryCard 
               source="Bloomberg" 
               time="2 hours ago" 
               title="EV Supply Chain Shakeup: New Alliances Formed in Asia"
               graphTypeLabel="Supply Chain Graph"
               isDark={isDark}
               onClick={() => onOpenNews('supply-chain')}
             >
                {/* Only showing the graph, widgets hide the panels via isWidget prop */}
                <LayeredGraph isWidget />
             </StoryCard>

             {/* Story 2 */}
             <StoryCard 
               source="Reuters" 
               time="5 hours ago" 
               title="Tech Giants: Boardroom Interlocks Reveal Strategy Alignment"
               graphTypeLabel="Ecosystem Cluster"
               isDark={isDark}
               onClick={() => onOpenNews('governance')}
             >
                <ForceGraph isWidget />
             </StoryCard>

             {/* Story 3 */}
             <StoryCard 
               source="Financial Times" 
               time="12 hours ago" 
               title="Capital Flows: Where is the Smart Money Moving in Q4?"
               graphTypeLabel="Sankey Flow"
               isDark={isDark}
               onClick={() => onOpenNews('capital-flow')}
             >
                <SankeyGraph isWidget />
             </StoryCard>

             {/* Story 4 */}
             <StoryCard 
               source="Wall Street Journal" 
               time="1 day ago" 
               title="Corporate Structuring: Siemens Spin-off Analysis"
               graphTypeLabel="Ownership Tree"
               isDark={isDark}
               onClick={() => onOpenNews('structuring')}
             >
                <div className="w-full h-full relative">
                    <div className="absolute inset-0 transform scale-90 origin-center">
                        <TreeGraph />
                    </div>
                </div>
             </StoryCard>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t py-8 text-center transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <p className="text-slate-400 text-sm">© 2023 VisualArchetypes. Financial data provided for demonstration purposes.</p>
      </div>

    </div>
  );
};

export default SearchPage;