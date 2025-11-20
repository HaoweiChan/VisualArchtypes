import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel, 
  Node, 
  Edge, 
  useNodesState, 
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant
} from 'reactflow';
import CompanyNode from '../components/CompanyNode';
import { getOwnershipData } from '../utils/graphUtils';

const nodeTypes = { company: CompanyNode };

const TreeGraphContent: React.FC = () => {
  const layoutData = getOwnershipData();
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutData.edges);

  // Naive collapse implementation for demo
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Find children
    const childrenEdges = edges.filter(e => e.source === node.id);
    const childrenIds = childrenEdges.map(e => e.target);
    
    if (childrenIds.length === 0) return;

    setNodes((nds) => 
      nds.map((n) => {
        if (childrenIds.includes(n.id)) {
          return { ...n, hidden: !n.hidden };
        }
        return n;
      })
    );
    
    // Also hide edges connected to hidden nodes
    setEdges((eds) =>
      eds.map((e) => {
        if (childrenIds.includes(e.target)) {
          return { ...e, hidden: !e.hidden };
        }
        return e;
      })
    );
  }, [edges, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Background color="#e2e8f0" variant={BackgroundVariant.Dots} gap={20} />
        <Controls className="bg-white shadow-lg border border-slate-100" />
        <Panel position="top-left" className="bg-white/90 p-4 rounded-xl shadow-sm border border-slate-100 backdrop-blur-sm max-w-xs">
          <h2 className="text-lg font-bold text-slate-800 mb-1">B. Hierarchical Tree</h2>
          <p className="text-xs text-slate-500 mb-2">
            Strict ownership structures (Parent {"->"} Subsidiary). 
          </p>
          <div className="p-2 bg-blue-50 rounded border border-blue-100 text-blue-800 text-xs font-medium text-center">
            Click a parent node to toggle children visibility
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const TreeGraph = () => (
  <ReactFlowProvider>
    <TreeGraphContent />
  </ReactFlowProvider>
);

export default TreeGraph;