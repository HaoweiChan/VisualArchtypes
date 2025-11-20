import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { SankeyData } from '../types';

const data: SankeyData = {
  nodes: [
    { id: 'Softbank Vision Fund', nodeColor: '#fbbf24' },
    { id: 'Uber', nodeColor: '#333' },
    { id: 'WeWork', nodeColor: '#ef4444' },
    { id: 'DoorDash', nodeColor: '#f87171' },
    { id: 'Grab', nodeColor: '#10b981' },
    { id: 'Coupang', nodeColor: '#60a5fa' },
    { id: 'Consumer A' },
    { id: 'Consumer B' },
    { id: 'Real Estate' }
  ],
  links: [
    { source: 'Softbank Vision Fund', target: 'Uber', value: 150 },
    { source: 'Softbank Vision Fund', target: 'WeWork', value: 80 },
    { source: 'Softbank Vision Fund', target: 'DoorDash', value: 40 },
    { source: 'Softbank Vision Fund', target: 'Grab', value: 60 },
    { source: 'Softbank Vision Fund', target: 'Coupang', value: 90 },
    { source: 'Uber', target: 'Consumer A', value: 100 },
    { source: 'Uber', target: 'Consumer B', value: 50 },
    { source: 'WeWork', target: 'Real Estate', value: 80 },
  ]
};

interface SankeyGraphProps {
  isWidget?: boolean;
}

const SankeyGraph: React.FC<SankeyGraphProps> = ({ isWidget = false }) => {
  const Container = isWidget ? React.Fragment : 'div';
  const containerProps = isWidget ? {} : { className: "w-full h-full bg-white p-8 flex flex-col" };

  return (
    <Container {...containerProps}>
      {!isWidget && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">D. Investment Portfolio (Sankey)</h2>
          <p className="text-slate-500 text-sm">
            Visualizing capital allocation magnitude. Line width equals investment size.
          </p>
        </div>
      )}
      
      <div className={`flex-1 ${isWidget ? 'h-full' : 'min-h-[500px] border border-slate-100 rounded-xl shadow-sm p-4'}`}>
        <ResponsiveSankey
          data={data}
          margin={{ top: 20, right: 100, bottom: 20, left: 20 }}
          align="justify"
          colors={(node: any) => node.nodeColor || '#cbd5e1'}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1]]
          }}
        />
      </div>
    </Container>
  );
};

export default SankeyGraph;