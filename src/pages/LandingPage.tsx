import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, GitBranch, BarChart3, Search, Zap, Lock, ArrowRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Link2, title: 'Immutable Provenance', desc: 'Blockchain-like hash chaining ensures tamper-proof data lineage tracking.' },
  { icon: BarChart3, title: 'AI Trust Scoring', desc: 'Real-time trust scores powered by multi-factor weighted analysis.' },
  { icon: Shield, title: 'Anomaly Detection', desc: 'AI-powered detection of suspicious modifications and trust drops.' },
  { icon: Search, title: 'Data Explorer', desc: 'Search, filter, and explore datasets with full provenance trails.' },
  { icon: Zap, title: 'Smart Policy Engine', desc: 'Automated rules to reject, flag, or alert on risky datasets.' },
  { icon: Lock, title: 'Digital Signatures', desc: 'Public-key verification with authenticated data badges.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Blockchain-Inspired Data Provenance
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="gradient-text">TrustChain</span>
              <br />
              <span className="text-foreground/90">Data You Can Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Track every data point's lifecycle with immutable provenance, AI-powered trust scoring, 
              and real-time anomaly detection for public sector data lakes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 font-semibold">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/explorer">
                <Button size="lg" variant="outline" className="font-semibold">
                  Explore Data
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated chain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-2"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-10 h-10 rounded-lg border-2 border-primary/30 bg-primary/5 flex items-center justify-center font-mono text-xs text-primary/70 ${i === 3 ? 'glow-primary border-primary/60' : ''}`}>
                  B{i}
                </div>
                {i < 6 && <div className="w-6 h-0.5 bg-primary/20" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-center mb-12">
          Built for <span className="gradient-text">Government-Grade</span> Trust
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo flow */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold text-center mb-12">
          Demo Flow
        </motion.h2>
        <div className="space-y-4">
          {[
            '1. Upload dataset',
            '2. Provenance chain created with hash linking',
            '3. Trust score calculated using AI engine',
            '4. Anomaly detected → Alert triggered',
            '5. XAI explains why trust dropped',
            '6. Smart policy auto-blocks risky data',
          ].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono text-primary shrink-0">{i + 1}</div>
              <span className="text-sm">{step.substring(3)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>TrustChain — Blockchain-Inspired Data Provenance for Public Sector</p>
      </footer>
    </div>
  );
}
