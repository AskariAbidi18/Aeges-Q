import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { KpiCard, ScenarioSwitch, SectionCard, SeverityBadge, SimBanner, StatusBadge } from '../../components/ui/ui';
import { useScenario } from '../../app/ScenarioContext';
import { fmtT, SCENARIO_NAME } from '../../mocks/operationsScenario';
import type { Provenance } from '../../types/provenance';
const workflow: [string, Provenance, string][] = [
  ['Traffic source', 'planned', 'Live capture not connected'], ['Flow extraction', 'planned', 'Not connected'], ['IDS inference', 'experimental', 'Model not called from this UI'],
  ['Threat assessment', 'demo', 'UI prototype (scenario rules)'], ['Policy recommendation', 'demo', 'Recommended in demo only'], ['Cryptographic protection', 'implemented', 'Backend mechanisms; not run here'],
];
export function SecurityOperationsPage() {
  const { state } = useScenario();
  const { info, policy } = state;
  return (
    <>
      <PageHeader title="Security Operations">Observe traffic, investigate threats, assess the level, recommend a policy and protect sessions. Everything below is simulated until real capture and inference are integrated.</PageHeader>
      <div className="banner" role="note"><SimBanner /><span>All values come from <b className="mono">{SCENARIO_NAME}</b>. No traffic is captured and no model is called.</span><StatusBadge kind="simulated" text="SIMULATED DATA" /></div>
      <div className="grid g4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))' }}>
        <KpiCard label="Capture source" value="Simulation" note="Replay not started" />
        <KpiCard label="Flows observed" value={state.flows.toLocaleString()} note="Simulated total" />
        <KpiCard label="Threats detected" value={String(state.threats)} note="Simulated events" />
        <KpiCard label="Threat level" value={info.label} note="Scenario-derived" color={info.color} />
        <KpiCard label="Recommended policy" value={policy.name} note="Recommended in demo" />
      </div>
      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="grid" style={{ alignContent: 'start' }}>
          <ScenarioSwitch />
          <SectionCard title="Threat level" label={<SeverityBadge level={state.level} />}>
            <p>{info.explain}</p><p className="mu" style={{ marginTop: 6 }}>Recommended response: {info.response}</p>
          </SectionCard>
        </div>
        <SectionCard title="Recent events" label={<StatusBadge kind="simulated" />}>
          {state.events.slice().reverse().slice(0, 5).map(e => (
            <div className="row" key={e.id} style={{ alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}><Link to={`/investigation?event=${e.id}`}><b>{e.type}</b></Link> <SeverityBadge level={e.severity} />
                <div className="mu" style={{ fontSize: 12 }}>{e.desc}</div><div className="mono mu">{fmtT(e.t)} · {e.src} → {e.dst}</div></div>
              <StatusBadge kind="simulated" /></div>))}
        </SectionCard>
      </div>
      <div style={{ marginTop: 16 }}><SectionCard title="Operational workflow" label={<StatusBadge kind="demo" text="PROTOTYPE STATUS" />}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>{workflow.map(([n, k, s], i) => (
          <div key={n} className={k === 'planned' ? 'dim' : ''} style={{ border: `1px ${k === 'planned' ? 'dashed' : 'solid'} var(--bd)`, borderRadius: 4, padding: 10 }}>
            <div className="mono mu">{i + 1}</div><b>{n}</b><div style={{ marginTop: 6 }}><StatusBadge kind={k} text={s} /></div></div>))}</div>
      </SectionCard></div>
    </>
  );
}
