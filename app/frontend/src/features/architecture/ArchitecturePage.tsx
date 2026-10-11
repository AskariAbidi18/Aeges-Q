import { PageHeader } from '../../components/layout/PageHeader';
import { SectionCard, StatusBadge } from '../../components/ui/ui';
import { ArchitectureDiagram, archNodes } from '../../components/architecture/ArchitectureDiagram';
export function ArchitecturePage() {
  return (
    <>
      <PageHeader title="System architecture">How components relate. The diagram is rendered from data in the frontend, not an image. The QML branch is experimental and does not drive the operational IDS path.</PageHeader>
      <div className="grid">
        <SectionCard title="Component diagram" label={<StatusBadge kind="demo">DEMO DATA</StatusBadge>}>
          <ArchitectureDiagram />
          <div className="row" style={{ justifyContent: 'flex-start', gap: 18, flexWrap: 'wrap' }} aria-label="Legend">
            <span><b style={{ color: '#6fae85' }}>━</b> Implemented</span><span><b style={{ color: '#7cc8e0' }}>━</b> Experimental / researched</span>
            <span><b style={{ color: '#8e99a6' }}>╌</b> Planned or not connected (dashed)</span>
          </div>
        </SectionCard>
        <SectionCard title="Text summary">
          <ol style={{ margin: 0, paddingLeft: 18 }}>{archNodes.map(n => <li key={n.id}><b>{n.label}</b> <span className="mu">: {n.sub} ({n.state})</span></li>)}</ol>
          <p className="mu" style={{ marginTop: 10 }}>Features flow through Variant E preprocessing into the Random Forest IDS and, separately, the QML research branch. The assessment is intended to inform a planned adaptive policy engine, which would select key establishment (X25519 + HKDF-SHA256 today, ML-KEM-768 planned) before AES-256-GCM protects payloads.</p>
        </SectionCard>
      </div>
    </>
  );
}
