import type { ReactNode } from 'react';
export const PageHeader = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: 20 }}><h1>{title}</h1><p className="mu" style={{ maxWidth: 680, marginTop: 6 }}>{children}</p></div>);
