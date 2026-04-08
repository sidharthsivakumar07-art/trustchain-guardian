export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Department = 'Healthcare' | 'Traffic' | 'Agriculture' | 'Education' | 'Finance';
export type DataSource = 'Government API' | 'IoT Sensor' | 'Manual Upload' | 'Third-Party API' | 'Satellite Feed';
export type TransformationType = 'Cleaned' | 'Aggregated' | 'Filtered' | 'Normalized' | 'Enriched' | 'Anonymized' | 'Merged';

export interface Transformation {
  type: TransformationType;
  timestamp: string;
  actor: string;
  description: string;
}

export interface AccessLog {
  userId: string;
  userName: string;
  role: string;
  timestamp: string;
  action: 'view' | 'download' | 'modify' | 'share';
}

export interface TrustBreakdown {
  sourceReliability: number;
  dataFreshness: number;
  transformationPenalty: number;
  accessFrequency: number;
  anomalyScore: number;
  explanation: string[];
}

export interface DataBlock {
  id: string;
  dataId: string;
  name: string;
  department: Department;
  source: DataSource;
  sourceVerified: boolean;
  timestamp: string;
  createdAt: string;
  description: string;
  recordCount: number;
  transformations: Transformation[];
  accessLog: AccessLog[];
  previousHash: string;
  hash: string;
  trustScore: number;
  riskLevel: RiskLevel;
  trustBreakdown: TrustBreakdown;
  digitalSignature: {
    signed: boolean;
    signedBy?: string;
    publicKey?: string;
  };
  tags: string[];
  anomalyDetected: boolean;
  predictedReliabilityDays?: number;
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  action: 'flag' | 'reject' | 'alert';
  active: boolean;
}

export interface DepartmentRanking {
  department: Department;
  avgTrustScore: number;
  totalDatasets: number;
  verifiedPercentage: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TrustHistoryPoint {
  date: string;
  score: number;
  department: Department;
}

export interface LineageNode {
  id: string;
  label: string;
  type: 'source' | 'transform' | 'dataset' | 'usage';
  x: number;
  y: number;
}

export interface LineageEdge {
  from: string;
  to: string;
}
