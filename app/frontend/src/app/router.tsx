import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SecurityOperationsPage } from '../features/operations/SecurityOperationsPage';
import { LiveNetworkPage } from '../features/network/LiveNetworkPage';
import { ThreatInvestigationPage } from '../features/investigation/ThreatInvestigationPage';
import { AdaptiveDefensePage } from '../features/adaptive/AdaptiveDefensePage';
import { OverviewPage } from '../features/overview/OverviewPage';
import { ThreatDetectionPage } from '../features/threat-detection/ThreatDetectionPage';
import { CryptoSessionsPage } from '../features/crypto-sessions/CryptoSessionsPage';
import { BenchmarksPage } from '../features/benchmarks/BenchmarksPage';
import { ArchitecturePage } from '../features/architecture/ArchitecturePage';
export const router = createBrowserRouter([{ path: '/', element: <AppShell />, children: [
  { index: true, element: <SecurityOperationsPage /> },
  { path: 'live-network', element: <LiveNetworkPage /> },
  { path: 'investigation', element: <ThreatInvestigationPage /> },
  { path: 'adaptive-defense', element: <AdaptiveDefensePage /> },
  { path: 'research-overview', element: <OverviewPage /> },
  { path: 'prediction-sandbox', element: <ThreatDetectionPage /> },
  { path: 'crypto-sessions', element: <CryptoSessionsPage /> },
  { path: 'benchmarks', element: <BenchmarksPage /> },
  { path: 'architecture', element: <ArchitecturePage /> },
] }]);
