import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { OverviewPage } from '../features/overview/OverviewPage';
import { ThreatDetectionPage } from '../features/threat-detection/ThreatDetectionPage';
import { CryptoSessionsPage } from '../features/crypto-sessions/CryptoSessionsPage';
import { BenchmarksPage } from '../features/benchmarks/BenchmarksPage';
import { ArchitecturePage } from '../features/architecture/ArchitecturePage';
export const router = createBrowserRouter([{ path: '/', element: <AppShell />, children: [
  { index: true, element: <OverviewPage /> },
  { path: 'threat-detection', element: <ThreatDetectionPage /> },
  { path: 'crypto-sessions', element: <CryptoSessionsPage /> },
  { path: 'benchmarks', element: <BenchmarksPage /> },
  { path: 'architecture', element: <ArchitecturePage /> },
] }]);
