import { motion, AnimatePresence } from 'framer-motion';
import { DataBlock } from '@/lib/types';
import TrustScoreBadge from './TrustScoreBadge';
import { useApp } from '@/context/AppContext';
import { X, ShieldCheck, Shield, AlertTriangle, TrendingDown, Clock, ArrowRight, Hash } from 'lucide-react';

interface BlockDetailPanelProps {
  block: DataBlock | null;
  onClose: () => void;
}

export default function BlockDetailPanel({ block, onClose }: BlockDetailPanelProps) {
  const { blockchainMode } = useApp();
  if (!block) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="w-full max-w-lg bg-card border-l border-border overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{block.name}</h2>
                <p className="text-sm text-muted-foreground">{block.department} • {block.dataId}</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5" /></button>
            </div>

            {/* Trust Score */}
            <div className="glass-card p-4 flex items-center gap-4">
              <TrustScoreBadge score={block.trustScore} riskLevel={block.riskLevel} size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-2">Trust Breakdown (XAI)</h3>
                {block.trustBreakdown.explanation.map((e, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-warning" />
                    {e}
                  </p>
                ))}
              </div>
            </div>

            {/* Scores breakdown */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Source', value: block.trustBreakdown.sourceReliability, max: 30 },
                { label: 'Fresh', value: block.trustBreakdown.dataFreshness, max: 25 },
                { label: 'Transform', value: block.trustBreakdown.transformationPenalty, max: 20 },
                { label: 'Access', value: block.trustBreakdown.accessFrequency, max: 15 },
                { label: 'Anomaly', value: block.trustBreakdown.anomalyScore, max: 10 },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-mono font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground">/{s.max}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Prediction */}
            <div className="glass-card p-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <span className="text-sm">Predicted reliability: <strong className="text-primary">{block.predictedReliabilityDays} days</strong></span>
            </div>

            {/* Digital Signature */}
            <div className="glass-card p-3">
              {block.digitalSignature.signed ? (
                <div className="flex items-center gap-2 text-success">
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Verified Data ✅</p>
                    <p className="text-xs text-muted-foreground">Signed by {block.digitalSignature.signedBy}</p>
                    <p className="hash-text mt-1">Key: {block.digitalSignature.publicKey}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-warning">
                  <Shield className="w-5 h-5" />
                  <p className="text-sm font-medium">Unverified Source</p>
                </div>
              )}
            </div>

            {/* Provenance Chain */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Provenance Chain</h3>
              <div className="space-y-0">
                <div className="flex items-center gap-3 pb-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="text-xs">
                    <span className="font-medium text-foreground">Source: {block.source}</span>
                    <span className="text-muted-foreground ml-2">{new Date(block.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {block.transformations.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 ml-[3px] chain-line pl-5">
                    <div>
                      <div className="flex items-center gap-1 text-xs">
                        <ArrowRight className="w-3 h-3 text-primary" />
                        <span className="font-medium">{t.type}</span>
                        <span className="text-muted-foreground">by {t.actor}</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-4">{t.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-medium text-accent">Current State</span>
                </div>
              </div>
            </div>

            {/* Access Log */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Access Log ({block.accessLog.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {block.accessLog.map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-secondary/50 px-3 py-2 rounded">
                    <div>
                      <span className="font-medium">{log.userName}</span>
                      <span className="text-muted-foreground ml-1">({log.role})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">{log.action}</span>
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Info */}
            {blockchainMode && (
              <div className="glass-card p-4 space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-1"><Hash className="w-4 h-4 text-primary" />Block Info</h3>
                <div className="space-y-1">
                  <p className="text-xs"><span className="text-muted-foreground">Block Hash:</span> <span className="font-mono text-primary">{block.hash}</span></p>
                  <p className="text-xs"><span className="text-muted-foreground">Previous Hash:</span> <span className="font-mono">{block.previousHash}</span></p>
                  <p className="text-xs"><span className="text-muted-foreground">Block ID:</span> <span className="font-mono">{block.id}</span></p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
