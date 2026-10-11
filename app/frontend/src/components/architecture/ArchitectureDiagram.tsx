import type { Provenance } from '../../types/provenance';
export type ArchNode = { id: string; label: string; sub: string; x: number; y: number; state: Provenance };
export const archNodes: ArchNode[] = [
  { id: 'in', label: 'Traffic features', sub: 'UNSW-NB15 input', x: 20, y: 20, state: 'implemented' },
  { id: 'pre', label: 'Variant E preprocessing', sub: 'implemented', x: 250, y: 20, state: 'implemented' },
  { id: 'rf', label: 'Random Forest IDS', sub: 'classical, implemented', x: 480, y: 20, state: 'implemented' },
  { id: 'qml', label: 'QML research branch', sub: 'PCA → 4-qubit circuit, simulator baseline', x: 480, y: 130, state: 'experimental' },
  { id: 'thr', label: 'Threat assessment', sub: 'IDS output', x: 710, y: 20, state: 'implemented' },
  { id: 'pol', label: 'Adaptive policy engine', sub: 'planned', x: 710, y: 130, state: 'planned' },
  { id: 'x25', label: 'X25519 + HKDF-SHA256', sub: 'key establishment, implemented', x: 250, y: 240, state: 'implemented' },
  { id: 'pqc', label: 'ML-KEM-768 / PQC', sub: 'planned', x: 480, y: 240, state: 'planned' },
  { id: 'aes', label: 'AES-256-GCM', sub: 'authenticated encryption, implemented', x: 710, y: 240, state: 'implemented' },
  { id: 'ui', label: 'Frontend UI', sub: 'demo only, backend not connected', x: 20, y: 130, state: 'demo' },
];
export const archEdges: [string, string, boolean][] = [['in', 'pre', false], ['pre', 'rf', false], ['pre', 'qml', false], ['rf', 'thr', false], ['qml', 'thr', true], ['thr', 'pol', true], ['pol', 'pqc', true], ['pol', 'x25', true], ['x25', 'aes', false], ['pqc', 'aes', true]];
const W = 190, H = 64;
const stroke = (s: Provenance) => (s === 'implemented' ? '#6fae85' : s === 'experimental' ? '#7cc8e0' : '#5b6672');
export function ArchitectureDiagram() {
  const c = (id: string) => { const n = archNodes.find(a => a.id === id)!; return [n.x + W / 2, n.y + H / 2]; };
  return (
    <div className="tw"><svg viewBox="0 0 920 330" style={{ minWidth: 760, width: '100%' }} role="img" aria-label="AEGES-Q architecture diagram. A textual summary follows below.">
      {archEdges.map(([a, b, planned], i) => { const [x1, y1] = c(a), [x2, y2] = c(b);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={planned ? '#5b6672' : '#8e99a6'} strokeWidth="1.5" strokeDasharray={planned ? '6 5' : undefined} />; })}
      {archNodes.map(n => (
        <g key={n.id} opacity={n.state === 'planned' ? 0.75 : 1}>
          <rect x={n.x} y={n.y} width={W} height={H} rx="4" fill="#14181d" stroke={stroke(n.state)} strokeWidth="1.5" strokeDasharray={n.state === 'planned' || n.state === 'demo' ? '5 4' : undefined} />
          <text x={n.x + 10} y={n.y + 26} fill="#e7ebef" fontSize="12.5" fontWeight="600">{n.label}</text>
          <text x={n.x + 10} y={n.y + 46} fill="#8e99a6" fontSize="10.5">{n.sub.length > 34 ? n.sub.slice(0, 33) + '…' : n.sub}</text>
        </g>))}
    </svg></div>
  );
}
