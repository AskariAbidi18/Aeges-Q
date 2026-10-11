import { Component, type ReactNode } from 'react';
import type { HostStatus } from '../../mocks/operationsScenario';
export const statusColor: Record<HostStatus, string> = { normal: '#5fa7bd', suspicious: '#e0a83a', high: '#e5594f' };
export const hasWebGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } };
export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}
