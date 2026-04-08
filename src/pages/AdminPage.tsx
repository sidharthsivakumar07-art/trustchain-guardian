import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Shield, Zap, Users, Settings } from 'lucide-react';

export default function AdminPage() {
  const { policies, setPolicies, blocks } = useApp();
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const updateThreshold = (id: string, val: number) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, threshold: val } : p));
  };

  const riskDistribution = {
    low: blocks.filter(b => b.riskLevel === 'Low').length,
    medium: blocks.filter(b => b.riskLevel === 'Medium').length,
    high: blocks.filter(b => b.riskLevel === 'High').length,
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage policies, users, and system settings</p>
      </motion.div>

      {/* Risk overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-success">{riskDistribution.low}</div>
          <div className="text-xs text-muted-foreground">Low Risk</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-warning">{riskDistribution.medium}</div>
          <div className="text-xs text-muted-foreground">Medium Risk</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold font-mono text-destructive">{riskDistribution.high}</div>
          <div className="text-xs text-muted-foreground">High Risk</div>
        </div>
      </div>

      {/* Smart Policy Engine */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Zap className="w-4 h-4 text-primary" /> Smart Policy Engine</h2>
        <div className="space-y-4">
          {policies.map(p => (
            <motion.div key={p.id} layout className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.active ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${p.action === 'reject' ? 'bg-destructive/10 text-destructive' : p.action === 'alert' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                    {p.action}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{p.condition}</p>
              </div>
              <div className="flex items-center gap-3">
                {p.threshold > 0 && (
                  <Input
                    type="number"
                    value={p.threshold}
                    onChange={e => updateThreshold(p.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-xs bg-background border-border text-center"
                    min={0}
                    max={100}
                  />
                )}
                <Switch checked={p.active} onCheckedChange={() => togglePolicy(p.id)} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulated RBAC */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-primary" /> Role-Based Access Control</h2>
        <div className="space-y-3">
          {[
            { name: 'Maria Garcia', role: 'Admin', access: 'Full access to all datasets, policies, and users', status: 'Active' },
            { name: 'Dr. Sarah Chen', role: 'Analyst', access: 'View + analyze all datasets', status: 'Active' },
            { name: 'Raj Patel', role: 'Data Provider', access: 'Upload and manage own datasets', status: 'Active' },
            { name: 'James Wilson', role: 'Analyst', access: 'View + analyze all datasets', status: 'Inactive' },
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{user.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.access}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{user.role}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-success' : 'bg-muted-foreground/30'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="glass-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Settings className="w-4 h-4 text-primary" /> System Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Total Blocks:</span> <span className="font-mono">{blocks.length}</span></div>
          <div><span className="text-muted-foreground">Chain Integrity:</span> <span className="font-mono text-success">Valid ✓</span></div>
          <div><span className="text-muted-foreground">Active Policies:</span> <span className="font-mono">{policies.filter(p => p.active).length}/{policies.length}</span></div>
          <div><span className="text-muted-foreground">Last Updated:</span> <span className="font-mono">{new Date().toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
