import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { Suspense } from 'react'
import OrbitalGlobe from './OrbitalGlobe'
import { useReconStore } from './ReconProvider'

export default function App() {
  const fetchRecon = useReconStore((s) => s.fetchRecon)
  const nodeCount = useReconStore((s) => s.nodes.length)

  return (
    <>
      <Leva collapsed />
      
      {/* Search Bar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 100,
        fontFamily: 'monospace',
        color: 'cyan'
      }}>
        <input
          type="text"
          placeholder="Target domain (e.g. tesla.com)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = (e.target as HTMLInputElement).value.trim()
              if (value) fetchRecon(value)
            }
          }}
          style={{
            padding: '12px 16px',
            width: '380px',
            background: 'rgba(0,10,30,0.9)',
            border: '2px solid cyan',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Nodes loaded: {nodeCount}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 120], fov: 60 }}>
        <color attach="background" args={['#000814']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[100, 100, 100]} intensity={1} />
        <Suspense fallback={null}>
          <OrbitalGlobe />
          </Suspense>
      </Canvas>
    </>
  )
}
