import { ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ScenarioSwitch, SectionCard, SeverityBadge, SimBanner, StatusBadge } from '../../components/ui/ui';
import { useScenario } from '../../app/ScenarioContext';
import { fmtT, levelInfo, timeline } from '../../mocks/operationsScenario';
export function AdaptiveDefensePage() {
  const { state, level } = useScenario();
  return (
    <>
      <PageHeader title="Adaptive defense">How a threat level could map to a security policy and cryptographic profile. This is a concept demonstration.</PageHeader>
      <div className="banner" role="note"><ShieldAlert size={16} /><SimBanner text="SIMULATED POLICY" /><span>Policy transitions shown here are illustrative; no live sessions are changed.</span></div>
      <ScenarioSwitch />
      <div className="grid g2" style={{ marginTop: 16 }}>
        <SectionCard title="Current recommendation" label={<SeverityBadge level={level} />}>
          <div className="row"><span>Policy</span><b>{state.policy.name}</b></div>
          <div className="row" style={{ alignItems: 'flex-start' }}><span>Cryptographic profile</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{state.policy.profile}</span></div>
          <p className="mu" style={{ marginTop: 10 }}>Why: {state.policy.reason}</p>
        </SectionCard>
        <SectionCard title="Status of this policy" label={<StatusBadge kind="demo" />}>
          <div className="row"><span>Recommended in demo</span><StatusBadge kind="simulated" text="YES" /></div>
          <div className="row"><span>Implemented in backend</span><StatusBadge kind="planned" text="NOT VERIFIED / PLANNED" /></div>
          <div className="row"><span>Enforced on a real session</span><StatusBadge kind="pending" text="NO" /></div>
          <div className="row"><span>ML-KEM-768 / PQC</span><StatusBadge kind="pending" /></div>
        </SectionCard>
      </div>
      <div style={{ marginTop: 16 }}><SectionCard title="Policy transition timeline" label={<StatusBadge kind="simulated" text="ILLUSTRATIVE PROGRESSION" />}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>{timeline.map(s => (
          <li key={s.level} className="row" aria-current={s.level === level ? 'step' : undefined} style={s.level === level ? { background: 'var(--s2)', paddingInline: 8 } : undefined}>
            <span className="mono mu">{fmtT(s.t)}</span><span style={{ flex: 1, marginLeft: 12 }}>{levelInfo[s.level].label}: {s.policy}</span><StatusBadge kind="simulated" /></li>))}</ol>
      </SectionCard></div>
      <div style={{ marginTop: 16 }}><SectionCard title="Controls" label={<StatusBadge kind="planned" />}>
        <div className="actions"><button className="btn sec" disabled>Apply policy to sessions</button><button className="btn sec" disabled>Enable ML-KEM-768 hybrid</button></div>
        <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>Disabled: enforcement and PQC are not implemented in this frontend.</p>
      </SectionCard></div>
    </>
  );
}
