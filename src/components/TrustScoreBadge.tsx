import { motion } from 'framer-motion';
import { RiskLevel } from '@/lib/types';

interface TrustScoreBadgeProps {
  score: number;
  riskLevel: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TrustScoreBadge({ score, riskLevel, size = 'md', showLabel = true }: TrustScoreBadgeProps) {
  const sizes = { sm: 'w-10 h-10 text-xs', md: 'w-14 h-14 text-sm', lg: 'w-20 h-20 text-lg' };
  const colors = { Low: 'text-success border-success/40 shadow-success/20', Medium: 'text-warning border-warning/40 shadow-warning/20', High: 'text-destructive border-destructive/40 shadow-destructive/20' };
  const bgColors = { Low: 'bg-success/10', Medium: 'bg-warning/10', High: 'bg-destructive/10' };

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`${sizes[size]} ${colors[riskLevel]} ${bgColors[riskLevel]} rounded-full border-2 flex items-center justify-center font-bold font-mono shadow-lg`}
      >
        {score}
      </motion.div>
      {showLabel && (
        <span className={`text-xs font-medium ${riskLevel === 'Low' ? 'text-success' : riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'}`}>
          {riskLevel} Risk
        </span>
      )}
    </div>
  );
}
