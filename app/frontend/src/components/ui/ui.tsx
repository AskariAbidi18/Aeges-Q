import { useState, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { provenanceText, type Provenance } from '../../types/provenance';
export const StatusBadge = ({ kind, children, text }: { kind: Provenance; children?: ReactNode; text?: string }) => <span className={`badge b-${kind}`}>{children ?? text ?? provenanceText[kind]}</span>;
export const DataSourceLabel = ({ kind, text }: { kind: Provenance; text?: string }) => <StatusBadge kind={kind}>{text}</StatusBadge>;
export const SectionCard = ({ title, label, children }: { title: string; label?: ReactNode; children: ReactNode }) => (
  <section className="card"><div className="card-h"><h2>{title}</h2>{label}</div>{children}</section>);
export const MetricCard = ({ label, value, note, kind }: { label: string; value: string; note: string; kind: Provenance }) => (
  <div className="card metric"><StatusBadge kind={kind} /><div className="v">{value}</div><div>{label}</div><div className="l">{note}</div></div>);
export const EmptyState = ({ children }: { children: ReactNode }) => <div className="empty">{children}</div>;
export const Term = ({ t, tip }: { t: string; tip: string }) => <abbr title={tip} style={{ textDecorationStyle: 'dotted' }}>{t}</abbr>;
export function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const go = async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); } catch { setOk(false); } };
  return <button className="btn sec" onClick={go} aria-label="Copy example text">{ok ? <Check size={14} /> : <Copy size={14} />}{ok ? 'Copied' : 'Copy'}</button>;
}
import { levelInfo, LEVELS, type Level } from '../../mocks/operationsScenario';
import { useScenario } from '../../app/ScenarioContext';
export const SeverityBadge = ({ level }: { level: Level }) => <span className="badge" style={{ color: levelInfo[level].color, borderColor: levelInfo[level].color }}>{levelInfo[level].label}</span>;
export const KpiCard = ({ label, value, note, color }: { label: string; value: string; note: string; color?: string }) => (
  <div className="card metric"><div className="l">{label}</div><div className="v" style={{ fontSize: 22, color }}>{value}</div><div className="l">{note}</div></div>);
export function ScenarioSwitch() {
  const { level, setLevel } = useScenario();
  return (
    <fieldset className="card" style={{ margin: 0 }}><legend className="mu" style={{ fontSize: 12, padding: '0 6px' }}>Simulate scenario</legend>
      <div className="steps" style={{ marginTop: 0 }} role="group" aria-label="Simulate scenario">{LEVELS.map(l => (
        <button key={l} className="step" aria-pressed={level === l} onClick={() => setLevel(l)}>{levelInfo[l].label}</button>))}</div>
      <p className="mu" style={{ fontSize: 12, marginTop: 8 }}>Switching changes simulated data only. It is not an IDS result and enforces no policy.</p></fieldset>);
}
export const SimBanner = ({ text = 'SIMULATED ENVIRONMENT' }: { text?: string }) => <StatusBadge kind="simulated" text={text} />;
