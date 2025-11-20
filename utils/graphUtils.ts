import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';
import { CompanyData, DisplayMode, NodeStyle, SectorBubbleData, TreeMapItem, SectorStat } from '../types';

const nodeWidth = 220;
const nodeHeight = 100;

// --- Financial Data Generator ---
const generateFinancials = () => {
  const price = (Math.random() * 200 + 50).toFixed(2);
  const changeVal = (Math.random() * 10 - 5);
  const change = (changeVal > 0 ? '+' : '') + changeVal.toFixed(2) + '%';
  
  // Market Cap between 1B and 3000B
  const marketCapVal = Math.random() * 2000 + 10; 
  const marketCap = marketCapVal > 1000 
    ? (marketCapVal / 1000).toFixed(2) + 'T' 
    : marketCapVal.toFixed(1) + 'B';

  // Revenue between 0.1B and 500B
  const revenueVal = Math.random() * 400 + 5;
  const revenue = revenueVal.toFixed(1) + 'B';

  // Generate 15 points for sparkline
  const history = Array.from({ length: 20 }, () => Math.random() * 100 + (Math.random() * 20));

  return { price, change, changeVal, marketCap, marketCapVal, revenue, revenueVal, history };
};

const mergeFinancials = (data: any) => ({ ...data, ...generateFinancials() });


// --- Auto Layout for DAG and Trees ---
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB'
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Slight randomization to avoid perfect stiffness if desired, but keeping strict for now
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // Shift position so the center is correct
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

// --- Mock Data Generators ---

export const getSectorBubbleData = (): SectorBubbleData[] => [
  { id: 'semi', label: 'Semiconductors', marketCap: 10.5, returnRate: 18, volume: 100 },
  { id: 'fin', label: 'Finance', marketCap: 5.2, returnRate: -2, volume: 60 },
  { id: 'ev', label: 'EV & Auto', marketCap: 4.8, returnRate: 15, volume: 55 },
  { id: 'pcb', label: 'PCB Components', marketCap: 5.5, returnRate: 32, volume: 40 },
  { id: 'network', label: 'Networking', marketCap: 5.1, returnRate: 8, volume: 45 },
  { id: 'passive', label: 'Passive Comp.', marketCap: 0.8, returnRate: 12, volume: 30 },
  { id: 'space', label: 'Aerospace', marketCap: 1.2, returnRate: 26, volume: 25 },
  { id: 'plastic', label: 'Petrochemical', marketCap: 0.6, returnRate: 5, volume: 20 },
  { id: 'textile', label: 'Textile', marketCap: 0.4, returnRate: 2, volume: 15 },
  { id: 'paper', label: 'Paper', marketCap: 0.3, returnRate: -1, volume: 10 },
  { id: 'shipping', label: 'Shipping', marketCap: 2.1, returnRate: -4, volume: 35 },
  { id: 'steel', label: 'Steel', marketCap: 1.5, returnRate: 1, volume: 28 },
  { id: 'bio', label: 'Biotech', marketCap: 1.8, returnRate: -8, volume: 22 },
  { id: 'retail', label: 'Retail', marketCap: 2.5, returnRate: 6, volume: 32 },
];

export const getSectorPerformanceStats = (): { day: SectorStat[], week: SectorStat[] } => {
  return {
    day: [
      { label: 'Energy', value: 0.58 },
      { label: 'Real Estate', value: 0.39 },
      { label: 'Healthcare', value: 0.28 },
      { label: 'Basic Materials', value: 0.08 },
      { label: 'Communication Services', value: 0.02 },
      { label: 'Consumer Defensive', value: -0.02 },
      { label: 'Financial', value: -0.2 },
      { label: 'Industrials', value: -0.35 },
      { label: 'Utilities', value: -0.36 },
      { label: 'Technology', value: -1.5 },
      { label: 'Consumer Cyclical', value: -1.89 },
    ],
    week: [
      { label: 'Healthcare', value: 0.59 },
      { label: 'Energy', value: -0.71 },
      { label: 'Utilities', value: -0.84 },
      { label: 'Consumer Defensive', value: -1.18 },
      { label: 'Real Estate', value: -2.23 },
      { label: 'Basic Materials', value: -2.48 },
      { label: 'Communication Services', value: -2.78 },
      { label: 'Financial', value: -3.34 },
      { label: 'Industrials', value: -3.55 },
      { label: 'Technology', value: -4.81 },
      { label: 'Consumer Cyclical', value: -6.59 },
    ]
  };
}

// --- TreeMap Data Generator ---
export const getTreeMapData = (): TreeMapItem[] => {
  
  const createStock = (ticker: string, name: string, baseSize: number) => {
     const fins = generateFinancials();
     return {
       id: ticker,
       name: name,
       ticker: ticker,
       value: baseSize + Math.random() * (baseSize * 0.5), // Variation in size
       change: fins.changeVal,
       price: fins.price,
       history: fins.history
     };
  };

  // 1. Technology
  const softwareInfra = {
    id: 'soft-infra', name: 'Software - Infrastructure', value: 0, change: -2.5,
    children: [
       createStock('MSFT', 'Microsoft Corp', 2800),
       createStock('ORCL', 'Oracle Corp', 400),
       createStock('ADBE', 'Adobe Inc', 250),
       createStock('PANW', 'Palo Alto', 100),
    ]
  };
  const semis = {
    id: 'semis', name: 'Semiconductors', value: 0, change: -2.8,
    children: [
      createStock('NVDA', 'NVIDIA Corp', 2900),
      createStock('AVGO', 'Broadcom', 800),
      createStock('AMD', 'Advanced Micro Devices', 300),
      createStock('MU', 'Micron', 150),
      createStock('INTC', 'Intel', 100),
      createStock('QCOM', 'Qualcomm', 200),
      createStock('TXN', 'Texas Instruments', 180),
    ]
  };
  const consumerElec = {
    id: 'cons-elec', name: 'Consumer Electronics', value: 0, change: 0.01,
    children: [
      createStock('AAPL', 'Apple Inc', 3000),
    ]
  };
  const softwareApp = {
    id: 'soft-app', name: 'Software - Application', value: 0, change: -1.4,
    children: [
      createStock('CRM', 'Salesforce', 250),
      createStock('INTU', 'Intuit', 180),
      createStock('NOW', 'ServiceNow', 160),
      createStock('UBER', 'Uber Tech', 140),
      createStock('SAP', 'SAP SE', 150),
    ]
  };

  // 2. Financial
  const banks = {
    id: 'banks', name: 'Banks - Diversified', value: 0, change: -0.3,
    children: [
      createStock('JPM', 'JPMorgan Chase', 500),
      createStock('BAC', 'Bank of America', 280),
      createStock('WFC', 'Wells Fargo', 200),
    ]
  };
  const credit = {
     id: 'credit', name: 'Credit Services', value: 0, change: 0.2,
     children: [
       createStock('V', 'Visa Inc', 450),
       createStock('MA', 'Mastercard', 400),
     ]
  };

  // 3. Consumer Cyclical
  const internetRetail = {
    id: 'internet-retail', name: 'Internet Retail', value: 0, change: -1.5,
    children: [
      createStock('AMZN', 'Amazon.com', 1800),
      createStock('BABA', 'Alibaba', 200),
      createStock('PDD', 'PDD Holdings', 150),
    ]
  };
  const auto = {
    id: 'auto', name: 'Auto Manufacturers', value: 0, change: -3.0,
    children: [
      createStock('TSLA', 'Tesla Inc', 700),
      createStock('TM', 'Toyota', 250),
    ]
  };

  // Sum up values for parents
  const sumChildren = (item: any) => {
      const total = item.children.reduce((acc: number, c: any) => acc + c.value, 0);
      item.value = total;
      return item;
  };

  return [
    {
      id: 'tech', name: 'Technology', value: 0, change: -1.5,
      children: [sumChildren(softwareInfra), sumChildren(semis), sumChildren(consumerElec), sumChildren(softwareApp)]
    },
    {
      id: 'finance', name: 'Financial', value: 0, change: -0.2,
      children: [sumChildren(banks), sumChildren(credit)]
    },
    {
      id: 'cyclical', name: 'Consumer Cyclical', value: 0, change: -1.8,
      children: [sumChildren(internetRetail), sumChildren(auto)]
    }
  ].map(sumChildren);
};


export const getSupplyChainData = () => {
  // B1. Battery Supply Chain Graph Data with Groups (Subgraphs)
  
  const GROUP_PADDING = 20;
  const NODE_H = 120; // Height allocation per node
  const COLUMN_GAP = 400;

  // Define Groups
  const groupNodes: Node[] = [
    {
      id: 'group-suppliers',
      type: 'group',
      data: { label: 'Battery Suppliers' },
      position: { x: 0, y: 0 },
      style: { width: 300, height: 650 },
    },
    {
      id: 'group-manufacturers',
      type: 'group',
      data: { label: 'Automotive Manufacturers' },
      position: { x: COLUMN_GAP, y: 0 },
      style: { width: 300, height: 650 },
    },
  ];

  // Helper to create child nodes relative to parent
  const createNode = (id: string, label: string, ticker: string, status: any, type: any, group: string, index: number): Node => ({
    id,
    data: mergeFinancials({ label, ticker, status, type }),
    type: 'company',
    parentNode: group,
    extent: 'parent', // Constrain to parent
    position: { x: 40, y: 60 + (index * NODE_H) }, // Relative to parent
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  const companyNodes: Node[] = [
    // Suppliers in Group 1
    createNode('catl', 'CATL', '300750', 'Active', 'Supplier', 'group-suppliers', 0),
    createNode('byd', 'BYD Company', '1211', 'Active', 'Supplier', 'group-suppliers', 1),
    createNode('lg', 'LG Energy Solution', '373220', 'Active', 'Supplier', 'group-suppliers', 2),
    createNode('panasonic', 'Panasonic Energy', '6752', 'Stable', 'Supplier', 'group-suppliers', 3),
    createNode('sk', 'SK Innovation', '096770', 'Stable', 'Supplier', 'group-suppliers', 4),

    // Manufacturers in Group 2
    createNode('tesla', 'Tesla', 'TSLA', 'Active', 'Manufacturer', 'group-manufacturers', 0),
    createNode('vw', 'Volkswagen', 'VOW3', 'Stable', 'Manufacturer', 'group-manufacturers', 1),
    createNode('bmw', 'BMW', 'BMW', 'Stable', 'Manufacturer', 'group-manufacturers', 2),
    createNode('ford', 'Ford', 'F', 'Stable', 'Manufacturer', 'group-manufacturers', 3),
    createNode('gm', 'General Motors', 'GM', 'Stable', 'Manufacturer', 'group-manufacturers', 4),
  ];

  const edges: Edge[] = [
    // CATL Relationships
    { id: 'e-catl-tesla', source: 'catl', target: 'tesla', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
    { id: 'e-catl-vw', source: 'catl', target: 'vw', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e-catl-bmw', source: 'catl', target: 'bmw', animated: true, style: { stroke: '#ef4444' } },
    
    // BYD Relationships
    { id: 'e-byd-tesla', source: 'byd', target: 'tesla', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e-byd-ford', source: 'byd', target: 'ford', animated: true, style: { stroke: '#ef4444' } },
    
    // LG Relationships
    { id: 'e-lg-gm', source: 'lg', target: 'gm', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e-lg-vw', source: 'lg', target: 'vw', animated: true, style: { stroke: '#ef4444' } },
    
    // Panasonic Relationships
    { id: 'e-panasonic-tesla', source: 'panasonic', target: 'tesla', animated: true, style: { stroke: '#ef4444' } },
    
    // SK Relationships
    { id: 'e-sk-ford', source: 'sk', target: 'ford', animated: true, style: { stroke: '#ef4444' } },
  ];

  return { nodes: [...groupNodes, ...companyNodes], edges };
};

export const getOwnershipData = () => {
  const nodes: Node<CompanyData>[] = [
    { id: 'root', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Siemens AG', ticker: 'SIE', status: 'Active', type: 'Holding' }), type: 'company' },
    { id: 'sub1', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Siemens Energy', ticker: 'ENR', status: 'Stable', type: 'Subsidiary' }), type: 'company' },
    { id: 'sub2', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Siemens Healthineers', ticker: 'SHL', status: 'Active', type: 'Subsidiary' }), type: 'company' },
    { id: 'sub3', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Siemens Mobility', status: 'Stable', type: 'Subsidiary' }), type: 'company' },
    { id: 'child1', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Wind Power Co', status: 'Risk', type: 'Subsidiary' }), type: 'company' },
    { id: 'child2', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Gas Services', status: 'Stable', type: 'Subsidiary' }), type: 'company' },
    { id: 'child3', position: { x: 0, y: 0 }, data: mergeFinancials({ label: 'Varian', status: 'Active', type: 'Subsidiary' }), type: 'company' },
  ];

  const edges: Edge[] = [
    { id: 'e-root-1', source: 'root', target: 'sub1', type: 'smoothstep' },
    { id: 'e-root-2', source: 'root', target: 'sub2', type: 'smoothstep' },
    { id: 'e-root-3', source: 'root', target: 'sub3', type: 'smoothstep' },
    { id: 'e-1-c1', source: 'sub1', target: 'child1', type: 'smoothstep' },
    { id: 'e-1-c2', source: 'sub1', target: 'child2', type: 'smoothstep' },
    { id: 'e-2-c3', source: 'sub2', target: 'child3', type: 'smoothstep' },
  ];

  return getLayoutedElements(nodes, edges, 'TB');
};

export const getClusterData = () => {
  const randPos = () => Math.random() * 600;
  
  const nodes: Node[] = [
    // Companies
    { id: 'c1', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'Tesla', ticker: 'TSLA', status: 'Active' }), type: 'company' },
    { id: 'c2', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'SpaceX', ticker: 'PRIV', status: 'Active' }), type: 'company' },
    { id: 'c3', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'Twitter (X)', ticker: 'PRIV', status: 'Risk' }), type: 'company' },
    { id: 'c4', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'Neuralink', status: 'Stable' }), type: 'company' },
    
    { id: 'c5', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'BYD', ticker: '1211', status: 'Active' }), type: 'company' },
    { id: 'c6', position: { x: randPos(), y: randPos() }, data: mergeFinancials({ label: 'Toyota', ticker: 'TM', status: 'Stable' }), type: 'company' },
    
    // A2. Governance (Board Members)
    { id: 'p1', position: { x: randPos(), y: randPos() }, data: { label: 'Elon Musk', type: 'Board' }, type: 'person' },
    { id: 'p2', position: { x: randPos(), y: randPos() }, data: { label: 'Robyn Denholm', type: 'Board' }, type: 'person' },
    
    // D1. Influence (Investors)
    { id: 'i1', position: { x: randPos(), y: randPos() }, data: { label: 'BlackRock', type: 'Investor' }, type: 'person' },
    { id: 'i2', position: { x: randPos(), y: randPos() }, data: { label: 'Vanguard', type: 'Investor' }, type: 'person' },
  ];

  const edges: Edge[] = [
    // Governance Links (Person -> Company)
    { id: 'e-p1-c1', source: 'p1', target: 'c1', style: { stroke: '#6366f1', strokeWidth: 2 } }, // Elon -> Tesla
    { id: 'e-p1-c2', source: 'p1', target: 'c2', style: { stroke: '#6366f1', strokeWidth: 2 } }, // Elon -> SpaceX
    { id: 'e-p1-c3', source: 'p1', target: 'c3', style: { stroke: '#6366f1', strokeWidth: 2 } }, // Elon -> Twitter
    { id: 'e-p1-c4', source: 'p1', target: 'c4', style: { stroke: '#6366f1' } }, // Elon -> Neuralink
    { id: 'e-p2-c1', source: 'p2', target: 'c1', style: { stroke: '#6366f1' } }, // Robyn -> Tesla
    
    // Investment Links (Investor -> Company)
    { id: 'e-i1-c1', source: 'i1', target: 'c1', style: { stroke: '#d97706', strokeDasharray: '4' } }, // Blackrock -> Tesla
    { id: 'e-i1-c6', source: 'i1', target: 'c6', style: { stroke: '#d97706', strokeDasharray: '4' } }, // Blackrock -> Toyota
    { id: 'e-i2-c1', source: 'i2', target: 'c1', style: { stroke: '#d97706', strokeDasharray: '4' } }, // Vanguard -> Tesla

    // Market Competitors
    { id: 'e-c1-c5', source: 'c1', target: 'c5', label: 'Competitor', style: { stroke: '#ef4444', strokeDasharray: '5,5' } }, // Tesla vs BYD
    { id: 'e-c1-c6', source: 'c1', target: 'c6', label: 'Competitor', style: { stroke: '#ef4444', strokeDasharray: '5,5' } }, // Tesla vs Toyota
  ];

  return { nodes, edges };
};