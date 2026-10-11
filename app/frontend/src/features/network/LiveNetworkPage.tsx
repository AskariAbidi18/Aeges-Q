import { lazy, Suspense, useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ScenarioSwitch, SectionCard, StatusBadge } from '../../components/ui/ui';
import { useScenario } from '../../app/ScenarioContext';
import { Link } from 'react-router-dom';
import { eventsFor, fmtT, hostFlows, hostStatus, hosts, levelInfo, type HostStatus } from '../../mocks/operationsScenario';
import { hasWebGL, SceneBoundary, statusColor } from '../../components/visualization/sceneUtils';
const NetworkScene = lazy(() => import('../../components/visualization/NetworkScene'));
const label: Record<HostStatus, string> = { normal: 'Normal', suspicious: 'Suspicious', high: 'High severity' };
const filters: ('all' | HostStatus)[] = ['all', 'normal', 'suspicious', 'high'];
export function LiveNetworkPage() {
  const { level } = useScenario();
  const [sel, setSel] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | HostStatus>('all');
  const [reduced, setReduced] = useState(false);
  const [gl] = useState(hasWebGL);
  const [resetSignal, setReset] = useState(0);
  useEffect(() => { const m = window.matchMedia('(prefers-reduced-motion: reduce)'); setReduced(m.matches); const f = () => setReduced(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const host = hosts.find(h => h.id === sel);
  const related = host ? eventsFor(level).filter(e => e.src === host.id || e.dst === host.id) : [];
  const peers = [...new Set(related.map(e => (e.src === host?.id ? e.dst : e.src)))];
  const total = hosts.reduce((n, h) => n + hostFlows(level, h), 0);
  const visible = hosts.filter(h => filter === 'all' || hostStatus(level, h.id) === filter);
  const fb = <EmptyState>3D view unavailable (WebGL could not start). Use the endpoint list below; all information is still available.</EmptyState>;
  return (
    <>
      <PageHeader title="Live network">An art-directed view of a synthetic topology. Colours follow the selected demo scenario.</PageHeader>
      <div className="banner" role="note"><StatusBadge kind="simulated" text="SIMULATED TOPOLOGY — NOT LIVE CAPTURE" /><span>No network discovery, geolocation or real hosts.</span></div>
      <ScenarioSwitch />
      <div className="actions" style={{ margin: '12px 0 0' }}><button className="btn sec" onClick={() => setReset(n => n + 1)}>Reset view</button><span className="mu" style={{ fontSize: 12, alignSelf: 'center' }}>Drag to rotate, scroll to zoom. {reduced ? 'Auto-rotation is off (reduced motion).' : 'Rotation pauses while a node is selected.'}</span></div>
      <div className="netgrid" style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: 'min(460px,60vh)', position: 'relative' }} role="img" aria-label="Simulated network topology, 3D view. Use the endpoint list below for keyboard access.">
          {gl ? <SceneBoundary fallback={fb}><Suspense fallback={<EmptyState>Loading 3D scene…</EmptyState>}><NetworkScene level={level} selected={sel} filter={filter} reduced={reduced} onSelect={setSel} related={related} resetSignal={resetSignal} /></Suspense></SceneBoundary> : fb}
        </div>
        <SectionCard title="Endpoint detail" label={<StatusBadge kind="simulated" />}>
          {host ? <><div className="row"><span>Host ID</span><b className="mono">{host.id}</b></div><div className="row"><span>Address (synthetic)</span><span className="mono">{host.ip}</span></div>
            <div className="row"><span>Role</span><span>{host.role}</span></div><div className="row"><span>Simulated flows</span><b className="mono">{hostFlows(level, host)}</b></div>
            <div className="row"><span>Demo threat state</span><b style={{ color: statusColor[hostStatus(level, host.id)] }}>{label[hostStatus(level, host.id)]}</b></div>
            <div className="row"><span>Share of simulated flows</span><span className="mono">{((hostFlows(level, host) / total) * 100).toFixed(1)}%</span></div>
            <div className="row" style={{ alignItems: 'flex-start' }}><span>Connected hosts</span><span className="mono">{peers.length ? peers.join(', ') : 'None in scenario'}</span></div>
            <h3 style={{ margin: '10px 0 4px' }}>Related simulated events</h3>
            {related.length ? related.map(e => <div key={e.id} className="mono"><Link to={`/investigation?event=${e.id}`}>{e.id}</Link> {e.type} · {fmtT(e.t)}</div>) : <span className="mu">None in this scenario.</span>}
            <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>Scenario: {levelInfo[level].label}. Simulated data, not an IDS result.</p>
            <div className="actions"><button className="btn sec" onClick={() => setSel(null)}>Clear selection</button></div></> : <EmptyState>Select a node, or an endpoint in the list below. Connected hosts are highlighted.</EmptyState>}
        </SectionCard>
      </div>
      <div style={{ marginTop: 16 }}><SectionCard title="Endpoints" label={<StatusBadge kind="simulated" />}>
        <div className="steps" style={{ marginTop: 0, marginBottom: 10 }} role="group" aria-label="Filter endpoints">{filters.map(f => <button key={f} className="step" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : label[f]}</button>)}</div>
        <div className="row" style={{ justifyContent: 'flex-start', gap: 16, flexWrap: 'wrap', border: 0 }} aria-label="Legend">{(Object.keys(label) as HostStatus[]).map(s => <span key={s}><b style={{ color: statusColor[s] }}>●</b> {label[s]}</span>)}<span><b style={{ color: '#7cc8e0' }}>◆</b> Gateway / collector</span></div>
        {visible.length === 0 ? <EmptyState>No endpoints match this filter in the current scenario.</EmptyState> : <div className="tw"><table><thead><tr><th>Host</th><th>Role</th><th>State</th><th>Flows</th></tr></thead><tbody>
          {visible.map(h => <tr key={h.id}><td><button className="step" aria-pressed={sel === h.id} onClick={() => setSel(h.id)}>{h.id}</button></td><td>{h.role}</td>
            <td style={{ color: statusColor[hostStatus(level, h.id)] }}>{label[hostStatus(level, h.id)]}</td><td className="mono">{hostFlows(level, h)}</td></tr>)}
        </tbody></table></div>}
      </SectionCard></div>
    </>
  );
}
