import React, { useState } from 'react';
import { Layout, Network, GitFork, DollarSign, Layers, BarChart3, Home, ScatterChart, Grid, BarChartHorizontal, Sun, Moon } from 'lucide-react';
import LayeredGraph from './views/LayeredGraph';
import TreeGraph from './views/TreeGraph';
import ForceGraph from './views/ForceGraph';
import SankeyGraph from './views/SankeyGraph';
import StockDashboard from './views/StockDashboard';
import SearchPage from './views/SearchPage';
import SectorPerformance from './views/SectorPerformance';
import TreeMap from './views/TreeMap';
import PerformanceBarChart from './views/PerformanceBarChart';
import NewsPage from './views/NewsPage';
import { GraphType } from './types';

// Export Context for child components
export const ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {}
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GraphType>(GraphType.HOME);
  const [isDark, setIsDark] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleOpenNews = (id: string) => {
    setSelectedNewsId(id);
    setCurrentView(GraphType.NEWS);
  };

  const renderView = () => {
    switch (currentView) {
      case GraphType.HOME:
        return <SearchPage onOpenNews={handleOpenNews} />;
      case GraphType.DASHBOARD:
        return <StockDashboard onOpenNews={handleOpenNews} />;
      case GraphType.NEWS:
        return <NewsPage newsId={selectedNewsId || 'supply-chain'} onBack={() => setCurrentView(GraphType.HOME)} />;
      case GraphType.DAG:
        return <LayeredGraph />;
      case GraphType.TREE:
        return <TreeGraph />;
      case GraphType.CLUSTER:
        return <ForceGraph />;
      case GraphType.SANKEY:
        return <SankeyGraph />;
      case GraphType.SECTOR_BUBBLE:
        return <SectorPerformance />;
      case GraphType.TREEMAP:
        return <TreeMap />;
      case GraphType.PERFORMANCE_BARS:
        return <PerformanceBarChart />;
      default:
        return <SearchPage onOpenNews={handleOpenNews} />;
    }
  };

  const NavButton = ({ type, icon: Icon, label }: { type: GraphType; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(type)}
      className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
        currentView === type
          ? 'bg-indigo-600 text-white shadow-md'
          : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`flex w-full h-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {/* Sidebar */}
        <aside className={`w-64 border-r flex flex-col shadow-sm z-10 flex-shrink-0 transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 text-indigo-500">
              <Layout size={28} />
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Visual<span className="text-indigo-600">Archetypes</span></h1>
            </div>
            <p className="text-xs text-slate-500 mt-2">MECE Visualization Framework</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavButton type={GraphType.HOME} icon={Home} label="Home / Search" />
            <NavButton type={GraphType.DASHBOARD} icon={BarChart3} label="Stock Dashboard" />
            
            <div className="px-4 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Tools</div>
            <NavButton type={GraphType.TREEMAP} icon={Grid} label="Market Map" />
            <NavButton type={GraphType.SECTOR_BUBBLE} icon={ScatterChart} label="Sector Bubbles" />
            <NavButton type={GraphType.PERFORMANCE_BARS} icon={BarChartHorizontal} label="Sector Rotation" />

            <div className="px-4 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Structure</div>
            <NavButton type={GraphType.DAG} icon={Layers} label="Layered Chain" />
            <NavButton type={GraphType.TREE} icon={GitFork} label="Ownership Tree" />
            
            <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Network</div>
            <NavButton type={GraphType.CLUSTER} icon={Network} label="Cluster Ecosystem" />
            
            <div className="px-4 py-2 mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantitative</div>
            <NavButton type={GraphType.SANKEY} icon={DollarSign} label="Investment Flow" />
          </nav>

          <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg mb-4 text-sm font-medium transition-colors ${
                isDark 
                ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              <p className="text-xs leading-relaxed">
                <strong>Analysis:</strong> These 5 archetypes cover 100% of the use cases defined in your graph_observation docs.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full relative w-full overflow-hidden">
          {renderView()}
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;