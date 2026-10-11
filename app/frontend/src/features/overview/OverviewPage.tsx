import { AlertTriangle, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { MetricCard, SectionCard, StatusBadge } from '../../components/ui/ui';
import { experiments, pipeline } from '../../mocks/fixtures';
export function OverviewPage() {
  const flow = ['Features', 'Variant E', 'Random Forest IDS', 'Threat assessment', 'Adaptive policy', 'Key establishment', 'AES-256-GCM'];
  const planned = new Set(['Adaptive policy']);
  return (
    <>
      <PageHeader title="AEGES-Q / Research Console">Research into ML-based threat assessment and adaptive cryptographic protection.</PageHeader>
      <div className="banner" role="note"><AlertTriangle size={16} /><b>RESEARCH PROTOTYPE</b><span>Frontend prototype; not production-ready. No live traffic or backend.</span><StatusBadge kind="demo" /></div>
      <div className="grid g4">
        <MetricCard label="Classical IDS F1" value="0.9335" note="Historical held-out benchmark" kind="historical" />
        <MetricCard label="Classical IDS ROC-AUC" value="0.9825" note="Historical held-out benchmark" kind="historical" />
        <MetricCard label="QML initial F1" value="0.7090" note="Constrained four-qubit local simulator experiment" kind="historical" />
        <MetricCard label="PQC benchmark" value="Pending" note="No results available yet" kind="pending" />
      </div>
      <div className="grid g2" style={{ marginTop: 16 }}>
        <SectionCard title="System status" label={<StatusBadge kind="demo" />}>
          {pipeline.map(p => <div className="row" key={p.name}><div>{p.name}<div className="mu" style={{ fontSize: 12 }}>{p.note}</div></div><StatusBadge kind={p.state} /></div>)}
        </SectionCard>
        <SectionCard title="Workflow" label={<StatusBadge kind="demo" text="CONCEPTUAL" />}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
            {flow.map((f, i) => <li key={f} className={planned.has(f) ? 'dim' : ''} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="mono mu" style={{ width: 18 }}>{i + 1}</span><span style={{ border: `1px ${planned.has(f) ? 'dashed' : 'solid'} var(--bd)`, padding: '3px 10px', borderRadius: 4, flex: 1 }}>{f}</span>{i < flow.length - 1 && <ArrowRight size={14} className="mu" />}</li>)}
          </ol>
          <p className="mu" style={{ fontSize: 12, marginTop: 10 }}>Dashed step is planned. The QML branch is experimental and not part of this path.</p>
        </SectionCard>
      </div>
      <div style={{ marginTop: 16 }}><SectionCard title="Recent experiments" label={<StatusBadge kind="demo" text="HISTORICAL / DEMO — NOT LIVE EVENTS" />}>
        <div className="tw"><table><thead><tr><th>ID</th><th>Experiment</th><th>Result</th><th>Status</th></tr></thead><tbody>
          {experiments.map(e => <tr key={e.id}><td className="mono">{e.id}</td><td>{e.what}</td><td className="mono">{e.result}</td><td><StatusBadge kind={e.state} /></td></tr>)}
        </tbody></table></div></SectionCard></div>
    </>
  );
}
