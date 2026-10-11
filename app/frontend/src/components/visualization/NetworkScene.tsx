import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { statusColor } from './sceneUtils';
import { hosts, hostStatus, type HostStatus, type Level } from '../../mocks/operationsScenario';
interface P { level: Level; selected: string | null; filter: 'all' | HostStatus; reduced: boolean; onSelect: (id: string) => void }
function Graph({ level, selected, filter, reduced, onSelect }: P) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (!reduced && g.current) g.current.rotation.y += d * 0.06; });
  const pos = useMemo(() => hosts.map((_, i) => { const ring = i % 2, a = (i / hosts.length) * Math.PI * 2; const r = 3 + ring * 1.4;
    return new THREE.Vector3(Math.cos(a) * r, (ring ? 0.9 : -0.7) + Math.sin(i * 1.7) * 0.3, Math.sin(a) * r); }), []);
  return (
    <group ref={g}>
      <mesh><octahedronGeometry args={[0.55]} /><meshStandardMaterial color="#7cc8e0" emissive="#2b6a80" emissiveIntensity={0.6} wireframe /></mesh>
      <mesh><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial color="#9fdcf0" emissive="#3a8aa5" emissiveIntensity={0.8} /></mesh>
      {hosts.map((h, i) => { const st = hostStatus(level, h.id); const dim = filter !== 'all' && st !== filter; const sel = selected === h.id;
        const col = statusColor[st];
        return (
          <group key={h.id}>
            <line><bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos[i]])} /><lineBasicMaterial color={col} transparent opacity={dim ? 0.08 : 0.4} /></line>
            <mesh position={pos[i]} scale={sel ? 1.5 : 1} onClick={e => { e.stopPropagation(); onSelect(h.id); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
              <sphereGeometry args={[0.26, 20, 20]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={sel ? 0.9 : 0.35} transparent opacity={dim ? 0.2 : 1} />
            </mesh>
            {sel && <mesh position={pos[i]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.5, 0.015, 8, 40]} /><meshBasicMaterial color="#e7ebef" /></mesh>}
          </group>);
      })}
    </group>
  );
}
export default function NetworkScene(p: P) {
  return (
    <Canvas camera={{ position: [0, 4.5, 9.5], fov: 45 }} frameloop={p.reduced ? 'demand' : 'always'} dpr={[1, 1.5]} aria-label="Simulated network topology, 3D view. Use the endpoint list for keyboard access.">
      <color attach="background" args={['#0b0e11']} /><fog attach="fog" args={['#0b0e11', 10, 20]} />
      <ambientLight intensity={0.6} /><pointLight position={[0, 4, 0]} intensity={30} color="#7cc8e0" />
      <gridHelper args={[16, 16, '#1f2830', '#161c22']} position={[0, -1.8, 0]} />
      <Graph {...p} />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={14} maxPolarAngle={Math.PI * 0.6} autoRotate={false} />
    </Canvas>
  );
}
