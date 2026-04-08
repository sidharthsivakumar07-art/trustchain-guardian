import { DataBlock, RiskLevel, TrustBreakdown } from './types';

export function calculateTrustScore(block: Partial<DataBlock>): { score: number; riskLevel: RiskLevel; breakdown: TrustBreakdown } {
  const explanations: string[] = [];
  
  // Source reliability (0-30 points)
  let sourceReliability = block.sourceVerified ? 30 : 10;
  if (!block.sourceVerified) explanations.push('Unverified source (-20 points)');
  if (block.source === 'IoT Sensor') { sourceReliability -= 5; explanations.push('IoT sensor source (-5 points, higher error rate)'); }
  if (block.source === 'Government API') { sourceReliability = Math.min(sourceReliability + 5, 30); }

  // Data freshness (0-25 points)
  const hoursOld = (Date.now() - new Date(block.timestamp || Date.now()).getTime()) / (1000 * 60 * 60);
  let dataFreshness = 25;
  if (hoursOld > 720) { dataFreshness = 5; explanations.push('Data is over 30 days old (-20 points)'); }
  else if (hoursOld > 168) { dataFreshness = 12; explanations.push('Data is over 7 days old (-13 points)'); }
  else if (hoursOld > 24) { dataFreshness = 20; explanations.push('Data is over 24 hours old (-5 points)'); }

  // Transformation penalty (0-20 points, fewer = better)
  const transformCount = block.transformations?.length || 0;
  let transformationPenalty = Math.max(0, 20 - transformCount * 4);
  if (transformCount > 3) explanations.push(`${transformCount} transformations applied (-${transformCount * 4} points)`);

  // Access frequency bonus (0-15 points)
  const accessCount = block.accessLog?.length || 0;
  let accessFrequency = Math.min(15, accessCount * 2);
  if (accessCount < 3) explanations.push('Low access frequency (less trusted by analysts)');

  // Anomaly score (0-10 points)
  let anomalyScore = block.anomalyDetected ? 0 : 10;
  if (block.anomalyDetected) explanations.push('Anomaly detected in dataset (-10 points)');

  // Digital signature bonus
  if (block.digitalSignature?.signed) {
    sourceReliability = Math.min(30, sourceReliability + 5);
    if (explanations.length === 0) explanations.push('All checks passed — high trust dataset');
  }

  const score = Math.round(Math.min(100, Math.max(0, sourceReliability + dataFreshness + transformationPenalty + accessFrequency + anomalyScore)));
  
  const riskLevel: RiskLevel = score >= 70 ? 'Low' : score >= 40 ? 'Medium' : 'High';

  if (explanations.length === 0) explanations.push('Dataset meets all trust criteria');

  return {
    score,
    riskLevel,
    breakdown: {
      sourceReliability,
      dataFreshness,
      transformationPenalty,
      accessFrequency,
      anomalyScore,
      explanation: explanations,
    },
  };
}

export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${hex.split('').reverse().join('')}${hex.substring(0, 4)}`;
}

export function generateBlockHash(block: Partial<DataBlock>): string {
  const data = `${block.dataId}${block.source}${block.timestamp}${block.previousHash}${JSON.stringify(block.transformations)}`;
  return simpleHash(data);
}

export function predictReliability(block: DataBlock): number {
  const baseDecay = block.sourceVerified ? 0.5 : 1.5;
  const transformDecay = block.transformations.length * 0.3;
  const anomalyFactor = block.anomalyDetected ? 3 : 0;
  const daysUntilUnreliable = Math.max(1, Math.round(30 / (baseDecay + transformDecay + anomalyFactor)));
  return daysUntilUnreliable;
}

export function detectAnomaly(block: DataBlock, allBlocks: DataBlock[]): boolean {
  const deptBlocks = allBlocks.filter(b => b.department === block.department && b.id !== block.id);
  if (deptBlocks.length < 2) return false;
  const avgScore = deptBlocks.reduce((s, b) => s + b.trustScore, 0) / deptBlocks.length;
  return block.trustScore < avgScore - 25;
}
