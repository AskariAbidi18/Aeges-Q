// Single deterministic source for ALL simulated operational data. Nothing here is live, captured or predicted by a model.
export type Level = 'normal' | 'elevated' | 'high' | 'critical';
export type HostStatus = 'normal' | 'suspicious' | 'high';
export const LEVELS: Level[] = ['normal', 'elevated', 'high', 'critical'];
export const rank = (l: Level) => LEVELS.indexOf(l);
export const SCENARIO_NAME = 'DEMO-SCENARIO-A';

export const levelInfo: Record<Level, { label: string; color: string; explain: string; response: string }> = {
  normal: { label: 'Normal', color: '#6fae85', explain: 'Traffic matches the demo baseline.', response: 'Keep baseline protection and continue monitoring.' },
  elevated: { label: 'Elevated', color: '#7cc8e0', explain: 'A few hosts deviate from the demo baseline.', response: 'Increase monitoring and shorten session lifetimes.' },
  high: { label: 'High', color: '#e0a83a', explain: 'Multiple hosts show attack-like patterns in the scenario.', response: 'Restrict affected hosts and rekey their sessions.' },
  critical: { label: 'Critical', color: '#e5594f', explain: 'Widespread attack-like patterns in the scenario.', response: 'Isolate affected segments and require the strongest available profile.' },
};

export const policies: Record<Level, { name: string; profile: string; reason: string }> = {
  normal: { name: 'Baseline protection', profile: 'X25519 + HKDF-SHA256 → AES-256-GCM', reason: 'No elevated risk, so the standard profile is sufficient.' },
  elevated: { name: 'Heightened monitoring', profile: 'X25519 + HKDF-SHA256 → AES-256-GCM, shorter rekey interval', reason: 'Raised risk justifies more frequent key refresh.' },
  high: { name: 'Restrict and rekey', profile: 'X25519 + HKDF-SHA256 → AES-256-GCM, rekey affected sessions', reason: 'Attack-like hosts warrant forced rekeying and restricted access.' },
  critical: { name: 'Isolate and strengthen', profile: 'Strongest available profile; ML-KEM-768 hybrid would apply once implemented (pending)', reason: 'Severe risk calls for isolation; the post-quantum option is not available yet.' },
};

export interface Host { id: string; ip: string; role: string; baseFlows: number }
export const hosts: Host[] = [
  { id: 'HOST-01', ip: '10.20.0.11', role: 'Workstation', baseFlows: 120 }, { id: 'HOST-02', ip: '10.20.0.12', role: 'Workstation', baseFlows: 96 },
  { id: 'HOST-03', ip: '10.20.0.21', role: 'App server', baseFlows: 310 }, { id: 'HOST-04', ip: '10.20.0.22', role: 'Database', baseFlows: 180 },
  { id: 'HOST-05', ip: '10.20.0.31', role: 'File server', baseFlows: 140 }, { id: 'HOST-06', ip: '10.20.0.41', role: 'Workstation', baseFlows: 88 },
  { id: 'HOST-07', ip: '192.0.2.15', role: 'Guest segment', baseFlows: 64 }, { id: 'HOST-08', ip: '192.0.2.16', role: 'Guest segment', baseFlows: 52 },
  { id: 'HOST-09', ip: '10.20.0.51', role: 'IoT sensor', baseFlows: 40 }, { id: 'HOST-10', ip: '10.20.0.52', role: 'IoT sensor', baseFlows: 36 },
];
const statusByLevel: Record<Level, Record<string, HostStatus>> = {
  normal: {},
  elevated: { 'HOST-07': 'suspicious', 'HOST-09': 'suspicious' },
  high: { 'HOST-07': 'suspicious', 'HOST-09': 'suspicious', 'HOST-03': 'suspicious', 'HOST-08': 'high' },
  critical: { 'HOST-07': 'high', 'HOST-08': 'high', 'HOST-09': 'suspicious', 'HOST-03': 'high', 'HOST-10': 'suspicious', 'HOST-05': 'high' },
};
const flowMult: Record<Level, number> = { normal: 1, elevated: 1.2, high: 1.6, critical: 2.4 };
export const hostStatus = (l: Level, id: string): HostStatus => statusByLevel[l][id] ?? 'normal';
export const hostFlows = (l: Level, h: Host) => Math.round(h.baseFlows * (hostStatus(l, h.id) === 'normal' ? 1 : flowMult[l]));

export interface SimEvent {
  id: string; t: number; minLevel: Level; type: string; severity: Level; src: string; dst: string; desc: string; rule: string; flowSummary: string; action: string;
}
export const events: SimEvent[] = [
  { id: 'EVT-1001', t: 12, minLevel: 'normal', type: 'Baseline check', severity: 'normal', src: 'HOST-01', dst: 'HOST-03', desc: 'Routine application traffic within baseline.', rule: 'Scenario rule: volume within baseline band.', flowSummary: '24 flows, mostly TCP, typical sizes.', action: 'No action.' },
  { id: 'EVT-1002', t: 47, minLevel: 'elevated', type: 'Port scan pattern', severity: 'elevated', src: 'HOST-07', dst: 'HOST-04', desc: 'Guest host contacts many ports on the database host.', rule: 'Scenario rule: many distinct destination ports in a short window.', flowSummary: '58 short flows, 40+ distinct ports, low byte counts.', action: 'Increase monitoring on HOST-07.' },
  { id: 'EVT-1003', t: 83, minLevel: 'elevated', type: 'Volume anomaly', severity: 'elevated', src: 'HOST-09', dst: 'HOST-05', desc: 'IoT sensor sends far more data than its baseline.', rule: 'Scenario rule: bytes sent above 3x baseline.', flowSummary: '31 flows, sustained high outbound volume.', action: 'Review sensor behaviour; shorten session lifetime.' },
  { id: 'EVT-1004', t: 130, minLevel: 'high', type: 'Brute-force pattern', severity: 'high', src: 'HOST-08', dst: 'HOST-03', desc: 'Repeated rapid connection attempts to the app server.', rule: 'Scenario rule: connection rate above threshold from one source.', flowSummary: '212 flows in 20 s, small payloads.', action: 'Restrict HOST-08 and rekey affected sessions.' },
  { id: 'EVT-1005', t: 168, minLevel: 'high', type: 'Lateral movement pattern', severity: 'high', src: 'HOST-03', dst: 'HOST-05', desc: 'App server contacts the file server in an unusual way.', rule: 'Scenario rule: new internal source-destination pair.', flowSummary: '19 flows, unusual protocol mix.', action: 'Rekey sessions between HOST-03 and HOST-05.' },
  { id: 'EVT-1006', t: 215, minLevel: 'critical', type: 'Flood pattern', severity: 'critical', src: 'HOST-07', dst: 'HOST-03', desc: 'Very high packet rate directed at the app server.', rule: 'Scenario rule: packet rate above critical threshold.', flowSummary: '640 flows, extreme packet rate.', action: 'Isolate the guest segment (simulated recommendation).' },
  { id: 'EVT-1007', t: 252, minLevel: 'critical', type: 'Exfiltration pattern', severity: 'critical', src: 'HOST-05', dst: 'HOST-10', desc: 'Large outbound transfer from the file server.', rule: 'Scenario rule: outbound bytes above critical threshold.', flowSummary: '9 long flows, very large transfers.', action: 'Isolate HOST-05 and require the strongest profile.' },
];
export const eventsFor = (l: Level) => events.filter(e => rank(e.minLevel) <= rank(l));
export const fmtT = (s: number) => `T+${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function deriveState(l: Level) {
  const evs = eventsFor(l);
  return {
    level: l, info: levelInfo[l], policy: policies[l], events: evs,
    flows: hosts.reduce((n, h) => n + hostFlows(l, h), 0),
    threats: evs.filter(e => e.severity !== 'normal').length,
  };
}
export const timeline = LEVELS.map((l, i) => ({ t: i * 90, level: l, policy: policies[l].name }));
