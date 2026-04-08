import { DataBlock, Department, DataSource, PolicyRule, TrustHistoryPoint, DepartmentRanking, TransformationType } from './types';
import { calculateTrustScore, generateBlockHash, predictReliability } from './trust-engine';

const departments: Department[] = ['Healthcare', 'Traffic', 'Agriculture', 'Education', 'Finance'];
const sources: DataSource[] = ['Government API', 'IoT Sensor', 'Manual Upload', 'Third-Party API', 'Satellite Feed'];
const transformTypes: TransformationType[] = ['Cleaned', 'Aggregated', 'Filtered', 'Normalized', 'Enriched', 'Anonymized', 'Merged'];

const datasetNames: Record<Department, string[]> = {
  Healthcare: ['Patient Admissions Q1', 'Vaccination Records 2025', 'Hospital Bed Occupancy', 'Disease Surveillance Feed', 'Prescription Analytics'],
  Traffic: ['Highway Sensor Data', 'Accident Reports 2025', 'Traffic Flow Analysis', 'Public Transit Usage', 'Speed Camera Logs'],
  Agriculture: ['Crop Yield Forecast', 'Soil Moisture Readings', 'Pesticide Usage Report', 'Livestock Census 2025', 'Weather Station Data'],
  Education: ['Student Enrollment Stats', 'Exam Results 2025', 'Teacher Allocation Data', 'Scholarship Distribution', 'Digital Literacy Survey'],
  Finance: ['Tax Revenue Summary', 'Budget Allocation 2025', 'Expenditure Audit Trail', 'Pension Fund Status', 'Grant Disbursement Log'],
};

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

function randomTransformations(): DataBlock['transformations'] {
  const count = Math.floor(Math.random() * 5);
  return Array.from({ length: count }, (_, i) => ({
    type: transformTypes[Math.floor(Math.random() * transformTypes.length)],
    timestamp: randomDate(Math.floor(Math.random() * 30)),
    actor: ['Data Engineer', 'ETL Pipeline', 'Quality Bot', 'Admin'][Math.floor(Math.random() * 4)],
    description: `Automated ${transformTypes[Math.floor(Math.random() * transformTypes.length)].toLowerCase()} operation`,
  }));
}

function randomAccessLog(): DataBlock['accessLog'] {
  const count = Math.floor(Math.random() * 8) + 1;
  const users = [
    { userId: 'u1', userName: 'Dr. Sarah Chen', role: 'Analyst' },
    { userId: 'u2', userName: 'Raj Patel', role: 'Data Provider' },
    { userId: 'u3', userName: 'Maria Garcia', role: 'Admin' },
    { userId: 'u4', userName: 'James Wilson', role: 'Analyst' },
    { userId: 'u5', userName: 'Aisha Khan', role: 'Data Provider' },
  ];
  const actions: DataBlock['accessLog'][0]['action'][] = ['view', 'download', 'modify', 'share'];
  return Array.from({ length: count }, () => {
    const user = users[Math.floor(Math.random() * users.length)];
    return { ...user, timestamp: randomDate(14), action: actions[Math.floor(Math.random() * actions.length)] };
  });
}

export function generateMockData(): DataBlock[] {
  const blocks: DataBlock[] = [];
  let prevHash = '0x0000000000000000000000';

  departments.forEach((dept) => {
    const names = datasetNames[dept];
    names.forEach((name, idx) => {
      const source = sources[Math.floor(Math.random() * sources.length)];
      const verified = Math.random() > 0.3;
      const timestamp = randomDate(60);
      const transformations = randomTransformations();
      const accessLog = randomAccessLog();
      const anomalyDetected = Math.random() > 0.85;

      const partial: Partial<DataBlock> = {
        dataId: `${dept.substring(0, 3).toUpperCase()}-${String(idx + 1).padStart(4, '0')}`,
        source,
        sourceVerified: verified,
        timestamp,
        transformations,
        accessLog,
        previousHash: prevHash,
        anomalyDetected,
        digitalSignature: { signed: verified && Math.random() > 0.4, signedBy: verified ? 'Gov Authority' : undefined, publicKey: verified ? `pk_${Math.random().toString(36).substring(7)}` : undefined },
      };

      const hash = generateBlockHash(partial);
      const { score, riskLevel, breakdown } = calculateTrustScore(partial);

      const block: DataBlock = {
        id: `block-${blocks.length}`,
        dataId: partial.dataId!,
        name,
        department: dept,
        source,
        sourceVerified: verified,
        timestamp,
        createdAt: randomDate(90),
        description: `${dept} dataset: ${name}. Contains ${Math.floor(Math.random() * 50000 + 1000)} records from ${source}.`,
        recordCount: Math.floor(Math.random() * 50000 + 1000),
        transformations,
        accessLog,
        previousHash: prevHash,
        hash,
        trustScore: score,
        riskLevel,
        trustBreakdown: breakdown,
        digitalSignature: partial.digitalSignature!,
        tags: [dept.toLowerCase(), source.toLowerCase().replace(/ /g, '-'), riskLevel.toLowerCase()],
        anomalyDetected,
        predictedReliabilityDays: 0,
      };

      block.predictedReliabilityDays = predictReliability(block);
      prevHash = hash;
      blocks.push(block);
    });
  });

  return blocks;
}

export function generateTrustHistory(): TrustHistoryPoint[] {
  const points: TrustHistoryPoint[] = [];
  departments.forEach((dept) => {
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      points.push({
        date: d.toISOString().split('T')[0],
        score: Math.round(50 + Math.random() * 40 + (dept === 'Healthcare' ? 10 : 0) - (dept === 'Traffic' ? 5 : 0)),
        department: dept,
      });
    }
  });
  return points;
}

export function generateDepartmentRankings(blocks: DataBlock[]): DepartmentRanking[] {
  return departments.map((dept, i) => {
    const deptBlocks = blocks.filter(b => b.department === dept);
    const avg = deptBlocks.reduce((s, b) => s + b.trustScore, 0) / deptBlocks.length;
    const verified = deptBlocks.filter(b => b.sourceVerified).length / deptBlocks.length * 100;
    return {
      department: dept,
      avgTrustScore: Math.round(avg),
      totalDatasets: deptBlocks.length,
      verifiedPercentage: Math.round(verified),
      rank: i + 1,
      trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
    };
  }).sort((a, b) => b.avgTrustScore - a.avgTrustScore).map((r, i) => ({ ...r, rank: i + 1 }));
}

export const defaultPolicies: PolicyRule[] = [
  { id: 'p1', name: 'Reject Low Trust', condition: 'trustScore < threshold', threshold: 30, action: 'reject', active: true },
  { id: 'p2', name: 'Flag Medium Risk', condition: 'trustScore < threshold', threshold: 50, action: 'flag', active: true },
  { id: 'p3', name: 'Alert on Anomaly', condition: 'anomalyDetected === true', threshold: 0, action: 'alert', active: true },
  { id: 'p4', name: 'Unverified Source Warning', condition: 'sourceVerified === false', threshold: 0, action: 'flag', active: false },
];
