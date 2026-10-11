import { useState } from 'react';
import { handshakeSteps } from '../../mocks/fixtures';
const nodes = [{ x: 60, y: 60, t: 'Client' }, { x: 560, y: 60, t: 'Server' }];
export function HandshakeFlow({ active: ext, onChange }: { active?: number; onChange?: (i: number) => void }) {
  const [own, setOwn] = useState(0);
  const active = ext ?? own;
  const pick = (i: number) => { setOwn(i); onChange?.(i); };
  const on = (i: number) => active === i;
  const s = handshakeSteps[active];
  return (
    <div>
      <svg viewBox="0 0 620 190" role="img" aria-label="Handshake flow: public keys are exchanged, shared secret derived on both sides, HKDF produces a session key used for AES-256-GCM" style={{ width: '100%' }}>
        {nodes.map(n => <g key={n.t}><rect x={n.x - 50} y={n.y - 30} width="100" height="60" rx="4" fill="#1a1f25" stroke="#272e36" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e7ebef" fontSize="13">{n.t}</text></g>)}
        <g className={on(0) ? '' : 'dim'}><line x1="115" y1="50" x2="505" y2="50" stroke="#7cc8e0" className={on(0) ? 'flowline' : ''} /><text x="310" y="42" textAnchor="middle" fill="#7cc8e0" fontSize="11">1 · client public key →</text></g>
        <g className={on(1) ? '' : 'dim'}><line x1="505" y1="72" x2="115" y2="72" stroke="#7cc8e0" className={on(1) ? 'flowline' : ''} /><text x="310" y="90" textAnchor="middle" fill="#7cc8e0" fontSize="11">← 2 · server public key</text></g>
        <g className={on(2) ? '' : 'dim'}><text x="60" y="118" textAnchor="middle" fill="#e0a83a" fontSize="11">3 · derive secret</text><text x="560" y="118" textAnchor="middle" fill="#e0a83a" fontSize="11">3 · derive secret</text></g>
        <g className={on(3) ? '' : 'dim'}><text x="60" y="140" textAnchor="middle" fill="#6fae85" fontSize="11">4 · HKDF key</text><text x="560" y="140" textAnchor="middle" fill="#6fae85" fontSize="11">4 · HKDF key</text></g>
        <g className={on(4) ? '' : 'dim'}><line x1="115" y1="165" x2="505" y2="165" stroke="#6fae85" className={on(4) ? 'flowline' : ''} /><text x="310" y="158" textAnchor="middle" fill="#6fae85" fontSize="11">5 · AES-256-GCM payload</text></g>
      </svg>
      <div className="steps" role="group" aria-label="Handshake steps">{handshakeSteps.map((h, i) => (
        <button key={h.id} className="step" aria-pressed={on(i)} onClick={() => pick(i)}>{i + 1}. {h.title}</button>))}</div>
      <div className="code" style={{ marginTop: 12 }} aria-live="polite"><b>{s.title}.</b> {s.body}</div>
      <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>Protocol explanation only. No private keys or secret values are rendered; this is not live network telemetry.</p>
    </div>
  );
}
