# AEGES-Q Frontend (UI-only prototype)

React + TypeScript + Vite console for AEGES-Q (Adaptive Network Security Research).

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build | preview | lint | typecheck
```

- UI-only: no API client, no backend files touched. The backend is **not connected**; integration is left to the project owner.
- Every interaction (demo prediction, handshake, encryption) is local and simulated. No cryptography is implemented in the browser.
- Historical metrics are offline research results, kept in `src/mocks/fixtures.ts`.
- Planned capabilities (adaptive policy, ML-KEM-768) are shown disabled.

## Redesign: simulated operations console

Default route is **Security Operations**; new pages: Live Network (React Three Fiber, lazy-loaded, WebGL fallback + endpoint list), Threat Investigation, Adaptive Defense. The former Threat Detection page is now **Prediction Sandbox** (`/prediction-sandbox`); Overview is `/research-overview`.
All operational data is simulated and derived from one source: `src/mocks/operationsScenario.ts`. Nothing is captured, predicted or enforced. Added dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
