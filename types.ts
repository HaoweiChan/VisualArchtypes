import { Node, Edge } from 'reactflow';

export enum GraphType {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  DAG = 'DAG',
  TREE = 'TREE',
  CLUSTER = 'CLUSTER',
  SANKEY = 'SANKEY',
  SECTOR_BUBBLE = 'SECTOR_BUBBLE',
  TREEMAP = 'TREEMAP',
  PERFORMANCE_BARS = 'PERFORMANCE_BARS',
  NEWS = 'NEWS'
}

export enum DisplayMode {
  PRICE = 'PRICE',
  MARKET_CAP = 'MARKET_CAP',
  REVENUE = 'REVENUE'
}

export enum NodeStyle {
  GHOST = 'GHOST',
  SOLID = 'SOLID'
}

export interface CompanyData {
  label: string;
  ticker?: string;
  status: 'Active' | 'Pending' | 'Risk' | 'Stable';
  type?: 'Supplier' | 'Manufacturer' | 'Distributor' | 'Holding' | 'Subsidiary' | 'Investor' | 'Board';
  
  // Financial Data
  price?: string;
  change?: string;
  changeVal?: number; // Numeric for coloring
  marketCap?: string;
  marketCapVal?: number; // For scaling
  revenue?: string;
  revenueVal?: number; // For scaling
  history?: number[]; // Sparkline data points (0-1 normalized or raw)

  // UI State (passed from parent)
  displayMode?: DisplayMode;
  nodeStyle?: NodeStyle;
  value?: string; // Legacy
}

export type CustomNode = Node<CompanyData>;

export interface SankeyDataNode {
  id: string;
  nodeColor?: string;
}

export interface SankeyDataLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyDataNode[];
  links: SankeyDataLink[];
}

export interface SectorBubbleData {
  id: string;
  label: string;
  marketCap: number; // In Trillions for the demo scale
  returnRate: number; // Percentage
  volume: number; // Determining bubble size
}

// --- Tree Map Interfaces ---

export interface TreeMapItem {
  id: string;
  name: string;
  value: number; // Market Cap for sizing
  change: number; // Performance % for color
  ticker?: string;
  price?: string;
  history?: number[]; // Sparkline
  children?: TreeMapItem[]; // For recursive structure (Sector -> Industry -> Stock)
}

export interface SectorStat {
  label: string;
  value: number; // Percentage change
}