import React, { useContext } from 'react';
import { ArrowLeft, Clock, Share2, Bookmark, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { ThemeContext } from '../App';
import LayeredGraph from './LayeredGraph';
import ForceGraph from './ForceGraph';
import SankeyGraph from './SankeyGraph';
import TreeGraph from './TreeGraph';

// Mock Data for News Articles
const NEWS_DATA: Record<string, any> = {
  'supply-chain': {
    title: "EV Supply Chain Shakeup: New Alliances Formed in Asia",
    source: "Bloomberg",
    date: "September 24, 2025 • 2 hours ago",
    category: "Supply Chain",
    tickers: [
      { symbol: 'CATL', price: '185.20', change: '+1.2%', isPositive: true },
      { symbol: 'TSLA', price: '173.80', change: '-0.5%', isPositive: false },
      { symbol: 'BYD', price: '32.40', change: '+2.1%', isPositive: true },
    ],
    indices: [
      { symbol: 'Global Lithium Index', price: '452.10', change: '-1.2%', isPositive: false },
      { symbol: 'Hang Seng Tech', price: '3,890.00', change: '+0.8%', isPositive: true }
    ],
    GraphComponent: LayeredGraph,
    content: (
      <>
        <p className="mb-4 text-lg leading-relaxed">
          The electric vehicle (EV) battery market is undergoing a significant structural shift as major manufacturers seek to diversify their supply chains away from single-source dependencies. Recent regulatory changes in the EU and North America have accelerated this trend, pushing automotive giants to forge new upstream alliances.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>Key Developments:</strong> Our analysis of recent procurement contracts reveals a tightening web of dependencies surrounding CATL and BYD. While these entities remain dominant, legacy automakers like Volkswagen and Ford are aggressively financing new mining operations in Australia and South America to bypass traditional refining bottlenecks.
        </p>
        <h3 className="text-xl font-bold mt-8 mb-4">The Layered Risk Analysis</h3>
        <p className="mb-4 text-lg leading-relaxed">
          The visualization on the right highlights the critical path nodes in the current battery supply chain. Note the high "betweenness centrality" of mid-stream refiners, which serve as potential choke points. A disruption in these nodes, indicated by the red warning markers in our model, could cascade downstream to multiple OEMs simultaneously.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Investors should monitor the "Stability Score" of tier-2 suppliers, as indicated in the graph. Those with 'Stable' ratings are currently undervalued relative to their strategic importance in the revised 2025 ecosystem.
        </p>
      </>
    )
  },
  'governance': {
    title: "Tech Giants: Boardroom Interlocks Reveal Strategy Alignment",
    source: "Reuters",
    date: "September 23, 2025 • 5 hours ago",
    category: "Governance",
    tickers: [
      { symbol: 'TSLA', price: '173.80', change: '+3.2%', isPositive: true },
      { symbol: 'TWTR', price: '54.20', change: '0.0%', isPositive: true }, // Legacy/Private mock
    ],
    indices: [
      { symbol: 'Nasdaq 100', price: '20,394.21', change: '-1.2%', isPositive: false },
      { symbol: 'Corp Gov ETF', price: '88.45', change: '+0.4%', isPositive: true }
    ],
    GraphComponent: ForceGraph,
    content: (
      <>
        <p className="mb-4 text-lg leading-relaxed">
          A proprietary analysis of board composition across the technology sector reveals an increasing density of "interlocks"—directors sitting on the boards of multiple competing or adjacent firms. This phenomenon is particularly pronounced in the AI and Space-Tech sectors.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>The Musk Ecosystem:</strong> The graph illustrates the gravitational pull of key figures like Elon Musk and his circle of investors. The cluster visualization demonstrates how shared board members (Ghost nodes) act as conduits for information flow and strategic alignment between ostensibly separate entities like Tesla, SpaceX, and xAI.
        </p>
        <h3 className="text-xl font-bold mt-8 mb-4">Implications for Minority Shareholders</h3>
        <p className="mb-4 text-lg leading-relaxed">
          While such ecosystems can drive rapid innovation through shared resources, they pose governance risks regarding conflicts of interest. The "Cluster Ecosystem" model provided highlights the overlap in venture capital backing (e.g., Sequoia, Andreessen Horowitz) which further cements these ties.
        </p>
      </>
    )
  },
  'capital-flow': {
    title: "Capital Flows: Where is the Smart Money Moving in Q4?",
    source: "Financial Times",
    date: "September 23, 2025 • 12 hours ago",
    category: "Capital Flow",
    tickers: [
      { symbol: 'SFTBY', price: '28.50', change: '-1.5%', isPositive: false },
      { symbol: 'UBER', price: '76.40', change: '+1.2%', isPositive: true },
      { symbol: 'WE', price: '0.12', change: '-5.0%', isPositive: false },
    ],
    indices: [
      { symbol: 'Venture Index', price: '1,200.45', change: '+0.2%', isPositive: true },
      { symbol: 'Private Equity', price: '450.20', change: '-0.8%', isPositive: false }
    ],
    GraphComponent: SankeyGraph,
    content: (
      <>
        <p className="mb-4 text-lg leading-relaxed">
          Institutional capital allocation has shifted dramatically in the fourth quarter, with a marked rotation out of late-stage gig economy platforms and into hard-tech and defense manufacturing. The Sankey diagram illustrates the magnitude of these flows from major aggregation funds (e.g., Softbank Vision Fund) into specific equities.
        </p>
        <h3 className="text-xl font-bold mt-8 mb-4">The Exit Liquidity Crisis</h3>
        <p className="mb-4 text-lg leading-relaxed">
          As observed in the flow visualization, the width of the streams connecting funds to consumer-facing apps has narrowed by 40% year-over-year. Conversely, flows into real estate holding companies and AI infrastructure have widened.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          This visualization serves as a roadmap for retail investors to understand where institutional "whales" are positioning themselves for the coming fiscal year.
        </p>
      </>
    )
  },
  'structuring': {
    title: "Corporate Structuring: Siemens Spin-off Analysis",
    source: "Wall Street Journal",
    date: "September 22, 2025 • 1 day ago",
    category: "Structuring",
    tickers: [
      { symbol: 'SIEGY', price: '88.20', change: '+0.5%', isPositive: true },
      { symbol: 'ENR', price: '22.10', change: '+4.2%', isPositive: true },
    ],
    indices: [
      { symbol: 'DAX', price: '16,400.10', change: '+0.1%', isPositive: true },
    ],
    GraphComponent: TreeGraph,
    content: (
      <>
        <p className="mb-4 text-lg leading-relaxed">
          Conglomerates are back in the spotlight, but this time for breaking apart. The "Ownership Tree" visualization details the complex subsidiary structure of Siemens AG and its recent spin-offs. This hierarchical view allows investors to trace value creation (or destruction) down to the operating unit level.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Clicking through the nodes in the interactive tree reveals that while the parent company provides stability, the high-growth "energy" and "healthineers" units are where the alpha is currently being generated.
        </p>
      </>
    )
  }
};

const MiniChart = ({ isPositive, isDark }: { isPositive: boolean, isDark: boolean }) => (
    <svg className="w-16 h-8" viewBox="0 0 60 30">
        <path 
            d={`M0,${isPositive ? 30 : 0} Q15,${isPositive ? 25 : 5} 30,${isPositive ? 15 : 15} T60,${isPositive ? 0 : 30}`} 
            fill="none" 
            stroke={isPositive ? '#10b981' : '#ef4444'} 
            strokeWidth="2" 
        />
    </svg>
);

interface AssetRowProps {
    ticker: any;
    isDark: boolean;
}

const AssetRow: React.FC<AssetRowProps> = ({ ticker, isDark }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border mb-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div>
            <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{ticker.symbol}</div>
            <div className="text-xs text-slate-500">{ticker.price}</div>
        </div>
        <div className="flex items-center gap-3">
             <MiniChart isPositive={ticker.isPositive} isDark={isDark} />
             <div className={`text-xs font-bold ${ticker.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {ticker.change}
             </div>
        </div>
    </div>
);

interface NewsPageProps {
  newsId: string;
  onBack: () => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ newsId, onBack }) => {
  const { isDark } = useContext(ThemeContext);
  const article = NEWS_DATA[newsId];

  if (!article) {
    return <div className="p-10">Article not found.</div>;
  }

  const Graph = article.GraphComponent;

  return (
    <div className={`w-full h-full overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'}`}>
        
        {/* Navigation Header */}
        <div className={`sticky top-0 z-20 border-b px-6 py-3 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
            <button 
                onClick={onBack}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
            
            <div className="flex gap-2">
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                    <Bookmark size={18} className="text-slate-500" />
                </button>
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                    <Share2 size={18} className="text-slate-500" />
                </button>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Article Content (8 Cols) */}
                <div className="lg:col-span-8">
                    <div className="mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            {article.category}
                        </span>
                        <h1 className={`text-3xl md:text-4xl font-bold mt-4 mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="font-bold text-indigo-500">{article.source}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {article.date}</span>
                        </div>
                    </div>

                    {/* Main Article Image/Graph (Mobile/Inline view) - Optional, we stick to text here mostly */}
                    
                    <div className={`prose prose-lg max-w-none ${isDark ? 'prose-invert text-slate-300' : 'text-slate-700'}`}>
                        {article.content}
                    </div>
                </div>

                {/* Right Column: Sidebar Widgets (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Widget 1: The Main Visualization */}
                    <div className={`rounded-xl border overflow-hidden shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                         <div className={`px-4 py-3 border-b text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                            Interactive Model
                         </div>
                         <div className="h-[350px] relative bg-slate-50">
                             <Graph isWidget={true} />
                         </div>
                         <div className={`px-4 py-2 text-xs text-center italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                             Interact with the nodes to explore relationships
                         </div>
                    </div>

                    {/* Widget 2: Mentioned Assets */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Activity size={16} /> Related Assets
                        </h3>
                        {article.tickers.map((t: any) => (
                            <AssetRow key={t.symbol} ticker={t} isDark={isDark} />
                        ))}
                    </div>

                    {/* Widget 3: Macro Context */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <TrendingUp size={16} /> Macro Context
                        </h3>
                        {article.indices.map((t: any) => (
                            <AssetRow key={t.symbol} ticker={t} isDark={isDark} />
                        ))}
                    </div>

                </div>
            </div>
        </div>

    </div>
  );
};

export default NewsPage;