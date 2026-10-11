import { useState } from 'react';
import { ArrowRight, Lock, ShieldQuestion } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionCard, StatusBadge, CopyButton, Term } from '../../components/ui/ui';
import { HandshakeFlow } from '../../components/visualization/HandshakeFlow';
const meta = [['Client public key', 'example-client-pub (32 bytes)'], ['Server public key', 'example-server-pub (32 bytes)'], ['Shared secret derivation', 'performed locally on each side (value never shown)'], ['HKDF session key', 'example-session-key (32 bytes, not shown)']];
const layout = 'nonce: <12 bytes example>  |  ciphertext: <same length as plaintext, example>  |  tag: <16 bytes example>';
export function CryptoSessionsPage() {
  const [hs, setHs] = useState(false);
  const [step, setStep] = useState(0);
  const [plain, setPlain] = useState('Example telemetry message');
  const [enc, setEnc] = useState<string | null>(null);
  const [ver, setVer] = useState(false);
  return (
    <>
      <PageHeader title="Cryptographic sessions">Concepts behind the implemented session establishment and encryption. All output on this page is illustrative; no cryptography runs in the browser.</PageHeader>
      <div className="grid g2">
        <SectionCard title="A. Key establishment" label={<StatusBadge kind="simulated" />}>
          <p className="mu" style={{ marginBottom: 12 }}>Both sides exchange <Term t="X25519" tip="Elliptic-curve Diffie-Hellman key agreement" /> public keys. Private keys and the derived secret are never transmitted. <Term t="HKDF-SHA256" tip="HMAC-based key derivation function" /> converts the secret into a session key.</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 12.5, marginBottom: 12 }}>
            {['Client public key', 'Server public key', 'Shared secret derivation', 'HKDF session key'].map((s, i) => <span key={s} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span className={`badge ${hs ? 'b-implemented' : ''}`}>{s}</span>{i < 3 && <ArrowRight size={13} />}</span>)}</div>
          <button className="btn" onClick={() => setHs(true)}>Simulate handshake</button>{hs && <button className="btn sec" style={{ marginLeft: 8 }} onClick={() => setHs(false)}>Reset</button>}
          {hs ? <div style={{ marginTop: 12 }}>{meta.map(([k, v]) => <div className="row" key={k}><span>{k}</span><span className="mono mu">{v}</span></div>)}
            <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>SIMULATED INTERACTION with fixed example metadata. No real keys were generated.</p></div> : <p className="mu" style={{ marginTop: 12 }}>Idle. Run the simulation to see example metadata.</p>}
        </SectionCard>
        <SectionCard title="B. Authenticated encryption" label={<StatusBadge kind="simulated" />}>
          <div className="field"><label htmlFor="pt">Example plaintext</label><textarea id="pt" rows={3} value={plain} onChange={e => { setPlain(e.target.value); setEnc(null); setVer(false); }} /></div>
          <div className="actions"><button className="btn" disabled={!plain.trim()} onClick={() => { setEnc(`[placeholder] ${plain.length} characters → illustrative output, NOT real AES-GCM ciphertext`); setVer(false); }}><Lock size={15} />Simulate encryption</button>
            <button className="btn sec" disabled={!enc} onClick={() => setVer(true)}><ShieldQuestion size={15} />Verify/decrypt demo</button></div>
          {enc && <div className="code mono" style={{ marginTop: 12 }}>{enc}</div>}
          {ver && <p className="warn">Demo state only: no real cryptographic verification took place.</p>}
          <div style={{ marginTop: 14 }}><div className="row" style={{ border: 0 }}><b>Layout</b><StatusBadge kind="demo" text="ILLUSTRATIVE ONLY" /></div>
            <div className="code mono">{layout}</div><div style={{ marginTop: 8 }}><CopyButton text={layout} /></div></div>
        </SectionCard>
      </div>
      <div style={{ marginTop: 16 }}><SectionCard title="Handshake flow" label={<StatusBadge kind="demo" text="PROTOCOL EXPLAINER" />}><HandshakeFlow active={step} onChange={setStep} /></SectionCard></div>
      <div style={{ marginTop: 16 }}><SectionCard title="Future capabilities" label={<StatusBadge kind="planned" />}>
        <div className="row"><span>Adaptive cryptographic policy<div className="mu" style={{ fontSize: 12 }}>Planned</div></span><button className="btn sec" disabled aria-disabled>Unavailable</button></div>
        <div className="row"><span>ML-KEM-768 post-quantum key establishment<div className="mu" style={{ fontSize: 12 }}>Pending implementation and evaluation</div></span><button className="btn sec" disabled aria-disabled>Unavailable</button></div>
      </SectionCard></div>
    </>
  );
}
