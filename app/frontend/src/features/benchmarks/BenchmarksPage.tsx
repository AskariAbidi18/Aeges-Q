import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionCard, StatusBadge, EmptyState } from '../../components/ui/ui';
import { idsMetrics, qmlMetrics, cryptoRef } from '../../mocks/fixtures';
import { f4, pct } from '../../lib/format';
const Bars = ({ rows }: { rows: [string, number][] }) => <div>{rows.map(([l, v]) => <div className="bar" key={l}><span>{l}</span><i><b style={{ width: `${v * 100}%` }} /></i><span className="mono">{f4(v)}</span></div>)}</div>;
const tabs = ['Classical IDS', 'QML', 'Classical Cryptography', 'PQC'];
export function BenchmarksPage() {
  const [tab, setTab] = useState(0);
  const m = idsMetrics, q = qmlMetrics;
  return (
    <>
      <PageHeader title="Research benchmarks">Existing offline results only. Nothing on this page is measured live.</PageHeader>
      <div className="tabs" role="tablist">{tabs.map((t, i) => <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{t}</button>)}</div>
      {tab === 0 && <SectionCard title="Classical IDS (Random Forest)" label={<StatusBadge kind="historical" />}>
        <Bars rows={[['Accuracy', m.accuracy], ['Precision', m.precision], ['Recall', m.recall], ['F1', m.f1], ['ROC-AUC', m.rocAuc]]} />
        <div className="row"><span>Normal-only false-positive rate</span><b className="mono">≈ {pct(m.normalFpr)}</b></div></SectionCard>}
      {tab === 1 && <SectionCard title="QML: constrained Circuit C baseline" label={<StatusBadge kind="historical" />}>
        <p className="mu" style={{ marginBottom: 10 }}>Initial constrained four-qubit local-simulator baseline. These numbers do not generalise to QML as a whole.</p>
        <Bars rows={[['Accuracy', q.accuracy], ['Precision', q.precision], ['Recall', q.recall], ['F1', q.f1], ['ROC-AUC', q.rocAuc]]} />
        <div className="row"><span>False-positive rate</span><b className="mono">{f4(q.fpr)}</b></div></SectionCard>}
      {tab === 2 && <SectionCard title="Classical cryptography reference" label={<StatusBadge kind="historical" />}>
        {cryptoRef.map(c => <div className="row" key={c.name}><span>{c.name}</span><b className="mono">{c.value}</b></div>)}
        <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>Local-machine-dependent measurements; they will differ on other hardware.</p></SectionCard>}
      {tab === 3 && <SectionCard title="Post-quantum cryptography (ML-KEM-768)" label={<StatusBadge kind="pending" />}><EmptyState>Benchmark pending — no results available yet.</EmptyState></SectionCard>}
      <div className="banner" style={{ marginTop: 16 }} role="note">Limitations: sample sizes, hardware, decision thresholds and experimental methods all affect these numbers. The Random Forest and the constrained QML baseline were not run as a controlled like-for-like comparison, so avoid ranking them from these figures.</div>
    </>
  );
}
