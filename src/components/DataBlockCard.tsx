import { motion } from 'framer-motion';
import { DataBlock } from '@/lib/types';
import TrustScoreBadge from './TrustScoreBadge';
import { useApp } from '@/context/AppContext';
import { Shield, ShieldCheck, Clock, Database, Hash } from 'lucide-react';

interface DataBlockCardProps {
  block: DataBlock;
  onClick?: () => void;
  index?: number;
}

export default function DataBlockCard({ block, onClick, index = 0 }: DataBlockCardProps) {
  const { blockchainMode } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`glass-card p-4 cursor-pointer hover:border-primary/40 transition-all group ${block.anomalyDetected ? 'border-destructive/40 animate-pulse-glow' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{block.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{block.department} • {block.source}</p>
        </div>
        <TrustScoreBadge score={block.trustScore} riskLevel={block.riskLevel} size="sm" showLabel={false} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(block.timestamp).toLocaleDateString()}</span>
        <span className="flex items-center gap-1"><Database className="w-3 h-3" />{block.recordCount.toLocaleString()}</span>
        {block.digitalSignature.signed ? (
          <span className="flex items-center gap-1 text-success"><ShieldCheck className="w-3 h-3" />Verified</span>
        ) : (
          <span className="flex items-center gap-1 text-warning"><Shield className="w-3 h-3" />Unverified</span>
        )}
      </div>

      {block.transformations.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {block.transformations.slice(0, 3).map((t, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">{t.type}</span>
          ))}
          {block.transformations.length > 3 && <span className="text-xs text-muted-foreground">+{block.transformations.length - 3}</span>}
        </div>
      )}

      {blockchainMode && (
        <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-primary" />
            <span className="hash-text">{block.hash}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground/50">prev:</span>
            <span className="hash-text">{block.previousHash}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
