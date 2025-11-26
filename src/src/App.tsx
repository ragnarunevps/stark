import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { Suspense } from 'react'
import OrbitalGlobe from './OrbitalGlobe.tsx'
import { ReconProvider, useReconStore } from './ReconProvider.tsx'

export default function App() {
  return (
    <ReconProvider>
      <Leva collapsed /> {/* Debug panel for forces/colors */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100, color: 'white' }}>
        <input
          type="text"
          placeholder="Target domain (e.g., tesla.com)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const target = (e.target as HTMLInputElement).value
              if (target) useReconStore.getState().fetchRecon(target)
            }
          }}
          style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid cyan', color: 'white' }}
        />
        <div style={{ marginTop: 10 }}>Nodes: {useReconStore((s) => s.nodes.length}</div>
      </div>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#000011']} />
          <OrbitalGlobe />
        </Suspense>
      </Canvas>
    </ReconProvider>
  )
}
