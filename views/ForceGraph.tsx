import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel, 
  useNodesState, 
  useEdgesState,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import CompanyNode from '../components/CompanyNode';
import PersonNode from '../components/PersonNode';
import { getClusterData } from '../utils/graphUtils';
import { DisplayMode, NodeStyle } from '../types';
import { BarChart2, DollarSign, PieChart, Circle, CircleDashed } from 'lucide-react';

const nodeTypes = { 
  company: CompanyNode,
  person: PersonNode
};

interface ForceGraphProps {
  isWidget?: boolean;
}

const ForceGraphInner: React.FC<ForceGraphProps> = ({ isWidget = false }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => getClusterData(), []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Control State
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.PRICE);
  const [nodeStyle, setNodeStyle] = useState<NodeStyle>(NodeStyle.SOLID);

  const { fitView } = useReactFlow();
  const simulationRef = useRef<any>(null);

  // Update nodes when controls change
  useEffect(() => {
    setNodes((nds) => nds.map(node => {
        // Only update company nodes
        if (node.type === 'company') {
            return { ...node, data: { ...node.data, displayMode, nodeStyle } };
        }
        return node;
    }));
  }, [displayMode, nodeStyle, setNodes]);

  // D3 Force Simulation
  useEffect(() => {
    const simulationNodes = nodes.map((node) => ({ 
      ...node, 
      x: node.position.x || 0, 
      y: node.position.y || 0,
      // Increase radius in bubble mode to prevent overlap
      r: displayMode === DisplayMode.PRICE ? 100 : 140 
    }));

    const simulationEdges = edges.map((edge) => ({ 
      ...edge, 
      source: edge.source, 
      target: edge.target 
    }));

    try {
      const simulation = forceSimulation(simulationNodes as any)
        .force('link', forceLink(simulationEdges).id((d: any) => d.id).distance(displayMode === DisplayMode.PRICE ? 180 : 250))
        .force('charge', forceManyBody().strength(-800))
        .force('center', forceCenter(400, 300))
        .force('collide', forceCollide().radius((d: any) => d.r)); // Use dynamic radius

      simulationRef.current = simulation;

      simulation.on('tick', () => {
        setNodes((nds) =>
          nds.map((node) => {
            const simNode = simulationNodes.find((n) => n.id === node.id);
            if (simNode && typeof simNode.x === 'number' && typeof simNode.y === 'number') {
              return { ...node, position: { x: simNode.x, y: simNode.y } };
            }
            return node;
          })
        );
      });

      setTimeout(() => {
          if (simulationRef.current) {
            simulationRef.current.stop();
            fitView({ duration: 800, padding: 0.2 });
          }
      }, 1500);

    } catch (e) {
      console.error("Error initializing force simulation:", e);
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [displayMode]); // Re-run simulation if mode changes significantly (optional, but good for spacing)

  return (
    <div className="w-full h-full bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        className="bg-slate-50"
        nodesDraggable={!isWidget}
        nodesConnectable={!isWidget}
        elementsSelectable={!isWidget}
      >
        <Background color="#e2e8f0" gap={16} />
        {!isWidget && <Controls className="bg-white shadow-lg border border-slate-100" />}
        
        {!isWidget && (
           <Panel position="top-left" className="flex flex-col gap-3">
             {/* Description Panel */}
             <div className="bg-white/90 p-4 rounded-xl shadow-sm border border-slate-100 backdrop-blur-sm max-w-xs">
                <h2 className="text-lg font-bold text-slate-800 mb-1">C. Ecosystem Cluster</h2>
                <p className="text-xs text-slate-500">
                  Visualizing soft connections (Shared Board Members, Investors).
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

const ForceGraph: React.FC<ForceGraphProps> = (props) => (
  <ReactFlowProvider>
    <ForceGraphInner {...props} />
  </ReactFlowProvider>
);

export default ForceGraph;