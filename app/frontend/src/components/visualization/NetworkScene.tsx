import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { statusColor } from './sceneUtils';
import { hosts, hostStatus, levelInfo, type HostStatus, type Level, type SimEvent } from '../../mocks/operationsScenario';
interface P { level: Level; selected: string | null; filter: 'all' | HostStatus; reduced: boolean; related: SimEvent[]; resetSignal: number; onSelect: (id: string) => void }
function Edge({ a, b, color, opacity }: { a: THREE.Vector3; b: THREE.Vector3; color: string; opacity: number }) {
  const obj = useMemo(() => new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color, transparent: true, opacity })), [a, b, color, opacity]);
  useEffect(() => () => { obj.geometry.dispose(); (obj.material as THREE.Material).dispose(); }, [obj]);
  return <primitive object={obj} />;
}
const Orbit = ({ r, y }: { r: number; y: number }) => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}><ringGeometry args={[r - 0.01, r + 0.01, 96]} /><meshBasicMaterial color="#2a3640" transparent opacity={0.5} side={THREE.DoubleSide} /></mesh>;
function Graph({ level, selected, filter, reduced, related, onSelect }: Omit<P, 'resetSignal'>) {
  const g = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);
  useFrame((_, d) => { if (!reduced && !selected && !hover && g.current) g.current.rotation.y += d * 0.05; });
  const pos = useMemo(() => hosts.map((_, i) => { const ring = i % 2, a = (i / hosts.length) * Math.PI * 2, r = 3 + ring * 1.4;
    return new THREE.Vector3(Math.cos(a) * r, (ring ? 0.9 : -0.7) + Math.sin(i * 1.7) * 0.3, Math.sin(a) * r); }), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  const idx = (id: string) => hosts.findIndex(h => h.id === id);
  const peers = new Set(related.flatMap(e => [e.src, e.dst]));
  return (
    <group ref={g}>
      <Orbit r={3} y={-0.7} /><Orbit r={4.4} y={0.9} />
      <mesh><octahedronGeometry args={[0.55]} /><meshStandardMaterial color="#7cc8e0" emissive="#2b6a80" emissiveIntensity={0.6} wireframe /></mesh>
      <mesh><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial color="#9fdcf0" emissive="#3a8aa5" emissiveIntensity={0.8} /></mesh>
      {hosts.map((h, i) => { const st = hostStatus(level, h.id), col = statusColor[st];
        const dim = (filter !== 'all' && st !== filter) || (!!selected && selected !== h.id && !peers.has(h.id));
        const sel = selected === h.id, hov = hover === h.id;
        return (
          <group key={h.id}>
            <Edge a={origin} b={pos[i]} color={col} opacity={sel ? 0.95 : dim ? 0.07 : 0.35} />
            <mesh position={pos[i]} scale={sel ? 1.5 : hov ? 1.25 : peers.has(h.id) && selected ? 1.15 : 1} onClick={e => { e.stopPropagation(); onSelect(h.id); }}
              onPointerOver={e => { e.stopPropagation(); setHover(h.id); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHover(null); document.body.style.cursor = ''; }}>
              <sphereGeometry args={[0.26, 20, 20]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={sel ? 1 : 0.35} transparent opacity={dim ? 0.2 : 1} />
            </mesh>
            {sel && <mesh position={pos[i]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.02, 8, 48]} /><meshBasicMaterial color="#e7ebef" /></mesh>}
            {(sel || hov) && <Html position={[pos[i].x, pos[i].y + 0.7, pos[i].z]} center zIndexRange={[5, 0]}><div className="node-label">{h.id} · {hostStatus(level, h.id)}</div></Html>}
          </group>);
      })}
      {selected && related.map(e => { const a = idx(e.src), b = idx(e.dst); return a < 0 || b < 0 ? null : <Edge key={e.id} a={pos[a]} b={pos[b]} color={levelInfo[e.severity].color} opacity={0.9} />; })}
    </group>
  );
}
function Controls({ reset }: { reset: number }) {
  const c = useRef<OrbitControlsImpl>(null);
  useEffect(() => { c.current?.reset(); }, [reset]);
  return <OrbitControls ref={c} enablePan={false} enableDamping dampingFactor={0.08} rotateSpeed={0.6} zoomSpeed={0.6} minDistance={6} maxDistance={14} minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.6} />;
}
export default function NetworkScene({ resetSignal, ...p }: P) {
  return (
    <Canvas camera={{ position: [0, 4.5, 9.5], fov: 45 }} frameloop={p.reduced ? 'demand' : 'always'} dpr={[1, 1.5]}>
      <color attach="background" args={['#0b0e11']} /><fog attach="fog" args={['#0b0e11', 9, 19]} />
      <ambientLight intensity={0.55} /><pointLight position={[0, 4, 0]} intensity={30} color="#7cc8e0" />
      <gridHelper args={[16, 16, '#1f2830', '#161c22']} position={[0, -1.8, 0]} />
      <Graph {...p} /><Controls reset={resetSignal} />
    </Canvas>
  );
}
