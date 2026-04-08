import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataBlock, PolicyRule, TrustHistoryPoint, DepartmentRanking } from '@/lib/types';
import { generateMockData, generateTrustHistory, generateDepartmentRankings, defaultPolicies } from '@/lib/mock-data';

interface AppState {
  blocks: DataBlock[];
  trustHistory: TrustHistoryPoint[];
  rankings: DepartmentRanking[];
  policies: PolicyRule[];
  blockchainMode: boolean;
  setBlockchainMode: (v: boolean) => void;
  setPolicies: (p: PolicyRule[]) => void;
  addBlock: (block: DataBlock) => void;
  alerts: string[];
  dismissAlert: (i: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<DataBlock[]>([]);
  const [trustHistory] = useState<TrustHistoryPoint[]>(generateTrustHistory());
  const [rankings, setRankings] = useState<DepartmentRanking[]>([]);
  const [policies, setPolicies] = useState<PolicyRule[]>(defaultPolicies);
  const [blockchainMode, setBlockchainMode] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const data = generateMockData();
    setBlocks(data);
    setRankings(generateDepartmentRankings(data));
    
    const anomalies = data.filter(b => b.anomalyDetected);
    const newAlerts = anomalies.map(b => `⚠️ Anomaly detected in "${b.name}" (${b.department}) — Trust Score: ${b.trustScore}`);
    const policyAlerts = data.filter(b => b.trustScore < 30).map(b => `🚫 Policy violation: "${b.name}" rejected (score: ${b.trustScore})`);
    setAlerts([...newAlerts, ...policyAlerts]);
  }, []);

  const addBlock = (block: DataBlock) => {
    setBlocks(prev => [...prev, block]);
    setRankings(generateDepartmentRankings([...blocks, block]));
  };

  const dismissAlert = (i: number) => setAlerts(prev => prev.filter((_, idx) => idx !== i));

  return (
    <AppContext.Provider value={{ blocks, trustHistory, rankings, policies, blockchainMode, setBlockchainMode, setPolicies, addBlock, alerts, dismissAlert }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
