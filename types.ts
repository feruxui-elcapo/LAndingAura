
export type UserRole = 'explorer' | 'professional' | 'corporate' | 'architect';
export type ViewState = 'landing' | 'airlock' | 'interface' | 'evaluation' | 'nexus' | 'pro_dash' | 'corp_dash';

export interface BiometricPoint {
    subject: string;
    A: number;
    fullMark: number;
    ideal?: number;
}

export interface PerformanceLog {
    timestamp: number;
    event: string;
    details?: any;
}

export interface TestDefinition {
    id: string;
    type: 'mfc' | 'stroop' | 'bart' | 'gonogo' | 'likert';

    title: string;
    description: string;
    config: any;
    color: string;
    // Map<CountryCode, Map<Category, {mean, std}>>
    norms?: Record<string, Record<string, { mean: number; stdDev: number }>>;
}


