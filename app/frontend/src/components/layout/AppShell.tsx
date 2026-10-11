import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanSearch, KeyRound, FlaskConical, Network, PanelLeft, Menu, ShieldHalf } from 'lucide-react';
import { StatusBadge } from '../ui/ui';
const routes = [
  { to: '/', title: 'Overview', icon: LayoutDashboard }, { to: '/threat-detection', title: 'Threat Detection', icon: ScanSearch },
  { to: '/crypto-sessions', title: 'Cryptographic Sessions', icon: KeyRound }, { to: '/benchmarks', title: 'Research Benchmarks', icon: FlaskConical },
  { to: '/architecture', title: 'System Architecture', icon: Network },
];
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = routes.find(r => r.to === pathname)?.title ?? 'Overview';
  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      <aside className={`side ${open ? 'open' : ''}`} aria-label="Primary">
        <div className="brand"><ShieldHalf color="#7cc8e0" size={26} /><div className="lbl"><b>AEGES-Q</b><span>Adaptive Network Security Research</span></div></div>
        <nav className="nav">{routes.map(r => (
          <NavLink key={r.to} to={r.to} end onClick={() => setOpen(false)} title={r.title}><r.icon size={17} /><span className="lbl">{r.title}</span></NavLink>))}</nav>
        <div className="side-foot lbl"><b className="mono">FRONTEND PROTOTYPE</b><span className="mono">DEMO MODE</span><span>Backend: Not connected</span></div>
      </aside>
      <div className="main">
        <header className="top">
          <button className="icon-btn menu-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle navigation"><Menu size={18} /></button>
          <button className="icon-btn desk-only" onClick={() => setCollapsed(c => !c)} aria-label="Collapse sidebar"><PanelLeft size={18} /></button>
          <div><div className="mu" style={{ fontSize: 12 }}>AEGES-Q / {current}</div><h2>{current}</h2></div>
          <span className="sp" /><span className="desk-only"><StatusBadge kind="demo">DEMO MODE</StatusBadge></span>
          <span className="badge" title="No API calls are made by this prototype">Backend: Not connected</span>
        </header>
        <main className="page"><Outlet /></main>
      </div>
    </div>
  );
}
