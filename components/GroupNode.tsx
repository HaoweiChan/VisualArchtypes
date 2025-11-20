import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

const GroupNode = ({ data }: NodeProps) => {
  return (
    <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/50 relative transition-all hover:border-slate-400">
      <div className="absolute -top-3 left-4 bg-slate-200 px-3 py-0.5 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider shadow-sm">
        {data.label}
      </div>
    </div>
  );
};

export default memo(GroupNode);