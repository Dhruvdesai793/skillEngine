// lib/analysisStore.ts
type AnalysisState = {
    status: 'running' | 'done' | 'error';
    step: string;
    profile?: any;
    analysis: Record<string, any>;
};

export const analysisStore = new Map<string, AnalysisState>();
