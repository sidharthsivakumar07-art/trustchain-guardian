import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import DataBlockCard from '@/components/DataBlockCard';
import BlockDetailPanel from '@/components/BlockDetailPanel';
import { DataBlock, Department, RiskLevel } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ExplorerPage() {
  const { blocks } = useApp();
  const [selectedBlock, setSelectedBlock] = useState<DataBlock | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<'trust' | 'date' | 'name'>('trust');

  const filtered = useMemo(() => {
    let result = blocks;
    if (search) result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.dataId.toLowerCase().includes(search.toLowerCase()) || b.department.toLowerCase().includes(search.toLowerCase()));
    if (deptFilter !== 'All') result = result.filter(b => b.department === deptFilter);
    if (riskFilter !== 'All') result = result.filter(b => b.riskLevel === riskFilter);
    if (sortBy === 'trust') result = [...result].sort((a, b) => b.trustScore - a.trustScore);
    else if (sortBy === 'date') result = [...result].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [blocks, search, deptFilter, riskFilter, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Data Explorer</h1>
        <p className="text-sm text-muted-foreground mb-6">Search and analyze datasets with full provenance trails</p>
      </motion.div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or department..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value as Department | 'All')} className="bg-secondary text-foreground text-xs rounded px-2 py-1.5 border border-border">
            <option value="All">All Departments</option>
            {['Healthcare', 'Traffic', 'Agriculture', 'Education', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as RiskLevel | 'All')} className="bg-secondary text-foreground text-xs rounded px-2 py-1.5 border border-border">
            <option value="All">All Risk Levels</option>
            {['Low', 'Medium', 'High'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'trust' | 'date' | 'name')} className="bg-secondary text-foreground text-xs rounded px-2 py-1.5 border border-border">
            <option value="trust">Sort: Trust Score</option>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} datasets found</p>

      <div className="data-grid">
        {filtered.map((block, i) => (
          <DataBlockCard key={block.id} block={block} index={i} onClick={() => setSelectedBlock(block)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No datasets match your filters</p>
        </div>
      )}

      <BlockDetailPanel block={selectedBlock} onClose={() => setSelectedBlock(null)} />
    </div>
  );
}
