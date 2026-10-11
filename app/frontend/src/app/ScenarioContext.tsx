import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { deriveState, type Level } from '../mocks/operationsScenario';
interface Ctx { level: Level; setLevel: (l: Level) => void; state: ReturnType<typeof deriveState> }
const C = createContext<Ctx | null>(null);
export const ScenarioProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<Level>('normal');
  const v = useMemo(() => ({ level, setLevel, state: deriveState(level) }), [level]);
  return <C.Provider value={v}>{children}</C.Provider>;
};
export const useScenario = () => { const c = useContext(C); if (!c) throw new Error('ScenarioProvider missing'); return c; };
