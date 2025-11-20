import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, Panel, useNodesState, useEdgesState } from 'reactflow';
import CompanyNode from '../components/CompanyNode';
import GroupNode from '../components/GroupNode';
import { getSupplyChainData } from '../utils/graphUtils';
import { DisplayMode, NodeStyle } from '../types';
import { BarChart2, DollarSign, PieChart, Circle, CircleDashed } from 'lucide-react';

const nodeTypes = { 
  company: CompanyNode,
  group: GroupNode
};

interface LayeredGraphProps {
  isWidget?: boolean;
}

const LayeredGraph: React.FC<LayeredGraphProps> = ({ isWidget = false }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => getSupplyChainData(), []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Control State
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.PRICE);
  const [nodeStyle, setNodeStyle] = useState<NodeStyle>(NodeStyle.SOLID);

  // Propagate state to nodes
  useEffect(() => {
    setNodes((nds) => nds.map(node => ({
        ...node,
        data: { ...node.data, displayMode, nodeStyle }
    })));
  }, [displayMode, nodeStyle, setNodes]);

  return (
    <div className="w-full h-full bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="bg-slate-50"
        minZoom={isWidget ? 0.1 : 0.2}
      >
        <Background color="#e2e8f0" gap={16} />
        {!isWidget && <Controls className="bg-white shadow-lg border border-slate-100" />}
        
        {!isWidget && (
          <Panel position="top-left" className="flex flex-col gap-3">
            {/* Info Panel */}
            <div className="bg-white/90 p-4 rounded-xl shadow-sm border border-slate-100 backdrop-blur-sm max-w-md">
                <h2 className="text-lg font-bold text-slate-800 mb-1">B1. Battery Supply Chain</h2>
                <p className="text-xs text-slate-500">
                  Layered view showing supplier dependencies.
                </p>
            </div>

            {/* Controls Panel */}
            <div className="bg-white/90 p-3 rounded-xl shadow-sm border border-slate-100 backdrop-blur-sm w-48">
                
                <div className="mb-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display Mode</h3>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => setDisplayMode(DisplayMode.PRICE)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${displayMode === DisplayMode.PRICE ? 'bg-orange-400 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <BarChart2 size={14} /> Price Chart
                        </button>
                        <button 
                            onClick={() => setDisplayMode(DisplayMode.MARKET_CAP)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${displayMode === DisplayMode.MARKET_CAP ? 'bg-white text-slate-800 border-2 border-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <DollarSign size={14} /> Market Cap
                        </button>
                        <button 
                            onClick={() => setDisplayMode(DisplayMode.REVENUE)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${displayMode === DisplayMode.REVENUE ? 'bg-white text-slate-800 border-2 border-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <PieChart size={14} /> Revenue
                        </button>
                    </div>
                </div>

                {(displayMode !== DisplayMode.PRICE) && (
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Node Style</h3>
                        <div className="flex flex-col gap-1">
                             <button 
                                onClick={() => setNodeStyle(NodeStyle.GHOST)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${nodeStyle === NodeStyle.GHOST ? 'bg-orange-400 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                             >
                                <CircleDashed size={14} /> Ghost
                             </button>
                             <button 
                                onClick={() => setNodeStyle(NodeStyle.SOLID)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${nodeStyle === NodeStyle.SOLID ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                             >
                                <Circle size={14} /> Solid
                             </button>
                        </div>
                    </div>
                )}

            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default LayeredGraph;