import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Search, FileUp, Settings, Menu, X, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/explorer', label: 'Explorer', icon: Search },
  { path: '/upload', label: 'Upload', icon: FileUp },
  { path: '/admin', label: 'Admin', icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { blockchainMode, setBlockchainMode } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg gradient-text">TrustChain</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary">
                <span className={active ? 'text-primary' : 'text-muted-foreground'}>{item.label}</span>
                {active && (
                  <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">⛓ Blockchain</span>
          <Switch checked={blockchainMode} onCheckedChange={setBlockchainMode} />
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden glass-card border-t border-border/50 p-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-primary">
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-xs text-muted-foreground font-mono">⛓ Blockchain</span>
            <Switch checked={blockchainMode} onCheckedChange={setBlockchainMode} />
          </div>
        </motion.div>
      )}
    </nav>
  );
}
