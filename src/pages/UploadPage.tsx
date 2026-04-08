import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { DataBlock, Department, DataSource } from '@/lib/types';
import { calculateTrustScore, generateBlockHash, predictReliability } from '@/lib/trust-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import { Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const { blocks, addBlock } = useApp();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<{ score: number; riskLevel: DataBlock['riskLevel'] } | null>(null);

  const [form, setForm] = useState({
    name: '',
    department: 'Healthcare' as Department,
    source: 'Government API' as DataSource,
    sourceVerified: true,
    description: '',
    recordCount: 1000,
    signed: false,
  });

  const handlePreview = () => {
    const partial: Partial<DataBlock> = {
      source: form.source,
      sourceVerified: form.sourceVerified,
      timestamp: new Date().toISOString(),
      transformations: [],
      accessLog: [],
      anomalyDetected: false,
      digitalSignature: { signed: form.signed },
    };
    const { score, riskLevel } = calculateTrustScore(partial);
    setPreview({ score, riskLevel });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prevHash = blocks.length ? blocks[blocks.length - 1].hash : '0x0000000000000000000000';
    const partial: Partial<DataBlock> = {
      dataId: `${form.department.substring(0, 3).toUpperCase()}-${String(blocks.length + 1).padStart(4, '0')}`,
      source: form.source,
      sourceVerified: form.sourceVerified,
      timestamp: new Date().toISOString(),
      transformations: [],
      accessLog: [],
      previousHash: prevHash,
      anomalyDetected: false,
      digitalSignature: { signed: form.signed, signedBy: form.signed ? 'Gov Authority' : undefined },
    };
    const hash = generateBlockHash(partial);
    const { score, riskLevel, breakdown } = calculateTrustScore(partial);

    const block: DataBlock = {
      id: `block-${blocks.length}`,
      dataId: partial.dataId!,
      name: form.name,
      department: form.department,
      source: form.source,
      sourceVerified: form.sourceVerified,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      description: form.description,
      recordCount: form.recordCount,
      transformations: [],
      accessLog: [],
      previousHash: prevHash,
      hash,
      trustScore: score,
      riskLevel,
      trustBreakdown: breakdown,
      digitalSignature: partial.digitalSignature!,
      tags: [form.department.toLowerCase(), form.source.toLowerCase().replace(/ /g, '-')],
      anomalyDetected: false,
      predictedReliabilityDays: 0,
    };
    block.predictedReliabilityDays = predictReliability(block);

    if (score < 30) {
      toast({ title: '🚫 Policy Blocked', description: `Dataset rejected: Trust score ${score} below threshold (30)`, variant: 'destructive' });
      return;
    }

    addBlock(block);
    setSubmitted(true);
    toast({ title: '✅ Dataset Uploaded', description: `"${form.name}" added with Trust Score: ${score}` });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 max-w-2xl mx-auto flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Dataset Uploaded!</h2>
          <p className="text-muted-foreground mb-4">Your data has been added to the provenance chain.</p>
          <Button onClick={() => { setSubmitted(false); setPreview(null); setForm({ name: '', department: 'Healthcare', source: 'Government API', sourceVerified: true, description: '', recordCount: 1000, signed: false }); }}>Upload Another</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Upload Dataset</h1>
        <p className="text-sm text-muted-foreground mb-6">Add new data to the provenance chain</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Dataset Name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Hospital Bed Occupancy Q1" className="bg-secondary border-border" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Department</label>
            <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))} className="w-full bg-secondary text-foreground text-sm rounded-md px-3 py-2 border border-border">
              {['Healthcare', 'Traffic', 'Agriculture', 'Education', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Source</label>
            <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as DataSource }))} className="w-full bg-secondary text-foreground text-sm rounded-md px-3 py-2 border border-border">
              {['Government API', 'IoT Sensor', 'Manual Upload', 'Third-Party API', 'Satellite Feed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Record Count</label>
          <Input type="number" value={form.recordCount} onChange={e => setForm(f => ({ ...f, recordCount: parseInt(e.target.value) || 0 }))} min={1} className="bg-secondary border-border" />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the dataset..." className="bg-secondary border-border" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.sourceVerified} onChange={e => setForm(f => ({ ...f, sourceVerified: e.target.checked }))} className="rounded" />
            Source Verified
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.signed} onChange={e => setForm(f => ({ ...f, signed: e.target.checked }))} className="rounded" />
            Digital Signature
          </label>
        </div>

        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 flex items-center gap-4">
            <TrustScoreBadge score={preview.score} riskLevel={preview.riskLevel} size="md" />
            <div>
              <p className="text-sm font-medium">Predicted Trust Score</p>
              <p className="text-xs text-muted-foreground">{preview.score < 30 ? '⚠️ This dataset will be blocked by policy' : preview.score < 50 ? '⚠️ This dataset will be flagged' : '✅ Dataset meets trust criteria'}</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handlePreview}>Preview Score</Button>
          <Button type="submit" className="gap-2"><Upload className="w-4 h-4" /> Upload & Chain</Button>
        </div>
      </form>
    </div>
  );
}
