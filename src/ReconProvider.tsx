import { create } from 'zustand'
import * as d3 from 'd3-force-3d'
import axios from 'axios'

interface Node {
  id: string
  type: 'subdomain' | 'api' | 'bucket' // etc.
  risk: number // 0-10
  position: [number, number, number]
  data: any
}

interface ReconStore {
  nodes: Node[]
  simulation: any
  fetchRecon: (domain: string) => Promise<void>
  selectNode: (id: string) => void
  selected: string | null
}

export const useReconStore = create<ReconStore>((set, get) => ({
  nodes: [],
  simulation: null,
  selected: null,
  fetchRecon: async (domain: string) => {
    try {
      // Fetch subdomains from crt.sh (public API, no key)
      const { data } = await axios.get(`https://crt.sh/?q=%25.${domain}&output=json`)
      const rawSubs = data.slice(0, 500) // Limit for perf
      const subs = rawSubs.map((item: any, i: number) => ({
        id: item.name_value,
        type: 'subdomain' as const,
        risk: Math.random() * 10, // Placeholder; later: real takeover check
        position: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
        data: { subdomain: item.name_value, certId: item.id_value }
      }))

      set({ nodes: subs })

      // Fire up force sim
      const sim = d3.forceSimulation(subs)
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(0, 0, 0))
        .force('collide', d3.forceCollide().radius(1))
        .on('tick', () => {
          const updatedNodes = get().nodes.map(n => ({ ...n, position: [sim.nodes()[0].x || 0, sim.nodes()[0].y || 0, sim.nodes()[0].z || 0] })) // Simplified
          set({ nodes: updatedNodes })
        })
      set({ simulation: sim })
    } catch (err) {
      console.error('Recon fail:', err)
    }
  },
  selectNode: (id) => set({ selected: id })
}))
