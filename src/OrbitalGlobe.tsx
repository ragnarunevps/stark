import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls } from '@react-three/drei'
import { useReconStore } from './ReconProvider'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function OrbitalGlobe() {
  const { nodes, selected, selectNode } = useReconStore()
  const pointsRef = useRef<THREE.Points>(null!)

  useFrame((state, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.1 // Slow spin
  })

  const positions = new Float32Array(nodes.length * 3)
  const colors = new Float32Array(nodes.length * 3)
  nodes.forEach((node, i) => {
    const i3 = i * 3
    positions[i3] = node.position[0]
    positions[i3 + 1] = node.position[1]
    positions[i3 + 2] = node.position[2]
    const riskColor = node.risk > 7 ? [1, 0, 0] : node.risk > 4 ? [1, 1, 0] : [0, 1, 1] // Red/Yellow/Cyan
    colors[i3] = riskColor[0]
    colors[i3 + 1] = riskColor[1]
    colors[i3 + 2] = riskColor[2]
  })

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} />
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="white"
          size={0.5}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors
          onClick={(e) => {
            e.stopPropagation()
            const idx = (e.point as any).index // Hacky, but works for selection
            selectNode(nodes[idx]?.id)
            console.log('Selected:', nodes[idx]?.data) // Sidebar hook here
          }}
        />
      </Points>
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  )
}
