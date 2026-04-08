import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { X, AlertTriangle, Ban } from 'lucide-react';

export default function AlertsPanel() {
  const { alerts, dismissAlert } = useApp();
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.slice(0, 5).map((alert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass-card p-3 flex items-center justify-between text-sm ${alert.includes('🚫') ? 'border-destructive/30' : 'border-warning/30'}`}
        >
          <div className="flex items-center gap-2">
            {alert.includes('🚫') ? <Ban className="w-4 h-4 text-destructive shrink-0" /> : <AlertTriangle className="w-4 h-4 text-warning shrink-0" />}
            <span className="text-xs">{alert}</span>
          </div>
          <button onClick={() => dismissAlert(i)} className="p-1 hover:bg-secondary rounded shrink-0">
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
