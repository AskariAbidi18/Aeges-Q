import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ScenarioSwitch, SectionCard, SeverityBadge, SimBanner, StatusBadge } from '../../components/ui/ui';
import { useScenario } from '../../app/ScenarioContext';
import { fmtT, LEVELS, levelInfo, rank, type Level } from '../../mocks/operationsScenario';
export function ThreatInvestigationPage() {
  const { state } = useScenario();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [sev, setSev] = useState<'all' | Level>('all');
  const [typeSel, setType] = useState('all');
  const [sort, setSort] = useState<'sev' | 'time'>('time');
  const types = [...new Set(state.events.map(e => e.type))];
  const type = types.includes(typeSel) ? typeSel : 'all';
  const rows = useMemo(() => state.events
    .filter(e => (sev === 'all' || e.severity === sev) && (type === 'all' || e.type === type) && `${e.id} ${e.src} ${e.dst}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'sev' ? rank(b.severity) - rank(a.severity) || b.t - a.t : b.t - a.t), [state.events, q, sev, type, sort]);
  const wanted = params.get('event');
  const sel = state.events.find(e => e.id === wanted);
  return (
    <>
      <PageHeader title="Threat investigation">Browse simulated events and review the scenario rule behind each assessment.</PageHeader>
      <div className="banner" role="note"><SimBanner text="SIMULATED EVENTS" /><span>Scenario: {levelInfo[state.level].label}. Not real incidents.</span>
        <Link to="/prediction-sandbox" className="btn sec" style={{ marginLeft: 'auto', textDecoration: 'none' }}>Open Prediction Sandbox</Link></div>
      <ScenarioSwitch />
      {wanted && !sel && <p className="warn" role="status">{wanted} is not part of the {levelInfo[state.level].label} scenario. Switch scenario or <button className="step" onClick={() => setParams({})}>clear</button>.</p>}
      <div className={`split ${sel ? 'detail' : ''}`} style={{ marginTop: 16 }}>
        <SectionCard title="Events" label={<StatusBadge kind="simulated" />}>
          <div className="fg" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
            <div className="field"><label htmlFor="q">Search event or host ID</label><input id="q" value={q} onChange={e => setQ(e.target.value)} placeholder="EVT-1002 or HOST-07" /></div>
            <div className="field"><label htmlFor="sv">Severity</label><select id="sv" value={sev} onChange={e => setSev(e.target.value as 'all' | Level)}><option value="all">All</option>{LEVELS.map(l => <option key={l} value={l}>{levelInfo[l].label}</option>)}</select></div>
            <div className="field"><label htmlFor="ty">Event type</label><select id="ty" value={type} onChange={e => setType(e.target.value)}><option value="all">All</option>{types.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="field"><label htmlFor="so">Sort by</label><select id="so" value={sort} onChange={e => setSort(e.target.value as 'sev' | 'time')}><option value="time">Time (latest first)</option><option value="sev">Severity</option></select></div>
          </div>
          {rows.length === 0 ? <EmptyState>No events match. Clear a filter or switch scenario.</EmptyState> : <div className="tw"><table><thead><tr><th>Event</th><th>Severity</th><th>Assessment</th><th>Source</th><th>Destination</th><th>Time</th></tr></thead><tbody>
            {rows.map(e => <tr key={e.id} style={e.id === sel?.id ? { background: 'var(--s2)' } : undefined}>
              <td><button className="step" aria-pressed={e.id === sel?.id} onClick={() => setParams({ event: e.id })}>{e.id}</button></td>
              <td><SeverityBadge level={e.severity} /></td><td>{e.type}</td><td className="mono">{e.src}</td><td className="mono">{e.dst}</td><td className="mono">{fmtT(e.t)}</td></tr>)}
          </tbody></table></div>}
        </SectionCard>
        {sel && <SectionCard title={`${sel.id} detail`} label={<StatusBadge kind="simulated" />}>
          <div className="row"><span>Severity</span><SeverityBadge level={sel.severity} /></div>
          <div className="row"><span>Flow</span><span className="mono">{sel.src} → {sel.dst} · {fmtT(sel.t)}</span></div>
          <p style={{ marginTop: 10 }}><b>Simulated flow summary.</b> {sel.flowSummary}</p>
          <p style={{ marginTop: 8 }}><b>Model status.</b> Not called in this frontend prototype.</p>
          <p style={{ marginTop: 8 }}><b>Assessment rationale.</b> {sel.rule} <span className="mu">(A demo rule, not a model explanation.)</span></p>
          <p style={{ marginTop: 8 }}><b>Recommended action.</b> {sel.action} <span className="mu">Simulation only.</span></p>
          <div className="actions"><button className="btn sec" onClick={() => setParams({})}>Close detail</button></div>
        </SectionCard>}
      </div>
    </>
  );
}
