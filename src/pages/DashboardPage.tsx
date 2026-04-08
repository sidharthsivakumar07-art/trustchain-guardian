import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import AlertsPanel from '@/components/AlertsPanel';
import DataBlockCard from '@/components/DataBlockCard';
import BlockDetailPanel from '@/components/BlockDetailPanel';
import LineageGraph from '@/components/LineageGraph';
import { DataBlock, Department } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Trophy, Shield, AlertTriangle, Database } from 'lucide-react';

export default function DashboardPage() {
  const { blocks, trustHistory, rankings, alerts } = useApp();
  const [selectedBlock, setSelectedBlock] = useState<DataBlock | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');

  const stats = useMemo(() => {
    const avg = blocks.length ? Math.round(blocks.reduce((s, b) => s + b.trustScore, 0) / blocks.length) : 0;
    const high = blocks.filter(b => b.riskLevel === 'High').length;
    const verified = blocks.filter(b => b.sourceVerified).length;
    const anomalies = blocks.filter(b => b.anomalyDetected).length;
    return { avg, high, verified, anomalies, total: blocks.length };
  }, [blocks]);

  const chartData = useMemo(() => {
    const dates = [...new Set(trustHistory.map(p => p.date))];
    return dates.map(d => {
      const obj: Record<string, string | number> = { date: d.substring(5) };
      const depts: Department[] = ['Healthcare', 'Traffic', 'Agriculture', 'Education', 'Finance'];
      depts.forEach(dept => {
        const point = trustHistory.find(p => p.date === d && p.department === dept);
        obj[dept] = point?.score || 0;
      });
      return obj;
    });
  }, [trustHistory]);

  const recentBlocks = useMemo(() => {
    let filtered = selectedDept === 'All' ? blocks : blocks.filter(b => b.department === selectedDept);
    return filtered.slice(0, 8);
  }, [blocks, selectedDept]);

  const topBlock = blocks.reduce((a, b) => a.trustScore > b.trustScore ? a : b, blocks[0]);

  const trendIcon = (t: string) => t === 'up' ? <TrendingUp className="w-3 h-3 text-success" /> : t === 'down' ? <TrendingDown className="w-3 h-3 text-destructive" /> : <Minus className="w-3 h-3 text-muted-foreground" />;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Real-time trust monitoring across all departments</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Avg Trust', value: stats.avg, icon: Shield, color: 'text-primary' },
          { label: 'Total Datasets', value: stats.total, icon: Database, color: 'text-foreground' },
          { label: 'Verified', value: stats.verified, icon: Shield, color: 'text-success' },
          { label: 'High Risk', value: stats.high, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Anomalies', value: stats.anomalies, icon: AlertTriangle, color: 'text-warning' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 text-center">
            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-warning" /> Active Alerts</h2>
          <AlertsPanel />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Trust Trends Chart */}
        <div className="lg:col-span-2 glass-card p-4">
          <h3 className="font-semibold text-sm mb-4">Trust Score Trends (30 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(220, 25%, 12%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="Healthcare" stroke="hsl(187, 80%, 48%)" fill="hsl(187, 80%, 48%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="Traffic" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="Agriculture" stroke="hsl(160, 70%, 45%)" fill="hsl(160, 70%, 45%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rankings */}
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-1"><Trophy className="w-4 h-4 text-warning" /> Department Rankings</h3>
          <div className="space-y-3">
            {rankings.map((r, i) => (
              <div key={r.department} className="flex items-center gap-3">
                <span className={`text-lg font-bold font-mono ${i === 0 ? 'text-warning' : i === 1 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>#{r.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate">{r.department}</span>
                    {trendIcon(r.trend)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${r.avgTrustScore}%` }} transition={{ delay: i * 0.1 }} className="h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-xs font-mono text-primary">{r.avgTrustScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lineage of top block */}
      {topBlock && (
        <div className="glass-card p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3">Data Lineage — {topBlock.name}</h3>
          <LineageGraph block={topBlock} />
        </div>
      )}

      {/* Recent Blocks */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent Datasets</h2>
        <div className="flex gap-1">
          {(['All', ...['Healthcare', 'Traffic', 'Agriculture', 'Education', 'Finance']] as const).map(d => (
            <button key={d} onClick={() => setSelectedDept(d)} className={`px-2 py-1 rounded text-xs transition-colors ${selectedDept === d ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="data-grid">
        {recentBlocks.map((block, i) => (
          <DataBlockCard key={block.id} block={block} index={i} onClick={() => setSelectedBlock(block)} />
        ))}
      </div>

      <BlockDetailPanel block={selectedBlock} onClose={() => setSelectedBlock(null)} />
    </div>
  );
}
