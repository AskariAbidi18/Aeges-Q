export type Provenance = 'historical' | 'demo' | 'simulated' | 'implemented' | 'experimental' | 'planned' | 'pending';
export const provenanceText: Record<Provenance, string> = {
  historical: 'HISTORICAL RESULT', demo: 'DEMO DATA', simulated: 'SIMULATED INTERACTION',
  implemented: 'IMPLEMENTED', experimental: 'EXPERIMENTAL', planned: 'PLANNED', pending: 'PENDING',
};
