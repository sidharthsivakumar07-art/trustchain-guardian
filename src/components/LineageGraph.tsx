import { DataBlock } from '@/lib/types';
import { motion } from 'framer-motion';

interface LineageGraphProps {
  block: DataBlock;
}

export default function LineageGraph({ block }: LineageGraphProps) {
  const nodeRadius = 20;
  const width = 600;
  const height = 300;

  const nodes = [
    { id: 'source', label: block.source, type: 'source' as const, x: 60, y: 150 },
    ...block.transformations.map((t, i) => ({
      id: `t-${i}`, label: t.type, type: 'transform' as const,
      x: 60 + (i + 1) * ((width - 120) / (block.transformations.length + 2)),
      y: 150 + (i % 2 === 0 ? -30 : 30),
    })),
    { id: 'dataset', label: block.name.substring(0, 15), type: 'dataset' as const, x: width - 60, y: 150 },
  ];

  const edges = nodes.slice(0, -1).map((n, i) => ({ from: n, to: nodes[i + 1] }));

  const typeColors = { source: 'hsl(187, 80%, 48%)', transform: 'hsl(38, 92%, 50%)', dataset: 'hsl(160, 70%, 45%)', usage: 'hsl(215, 15%, 55%)' };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" style={{ maxHeight: 300 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(187, 80%, 48%)" opacity="0.5" />
          </marker>
        </defs>
        {edges.map((e, i) => (
          <motion.line
            key={i}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
            stroke="hsl(187, 80%, 48%)" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arrow)"
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={n.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}>
            <circle cx={n.x} cy={n.y} r={nodeRadius} fill={typeColors[n.type]} opacity="0.15" stroke={typeColors[n.type]} strokeWidth="2" />
            <circle cx={n.x} cy={n.y} r={4} fill={typeColors[n.type]} />
            <text x={n.x} y={n.y + nodeRadius + 16} textAnchor="middle" className="text-xs fill-muted-foreground" style={{ fontSize: 10 }}>
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
