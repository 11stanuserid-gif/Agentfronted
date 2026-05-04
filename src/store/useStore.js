import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Auth
  apiKey: localStorage.getItem('api_key') || '',
  setApiKey: (key) => {
    localStorage.setItem('api_key', key)
    set({ apiKey: key })
  },

  // Generation
  currentJob: null,
  generationStatus: 'idle', // idle, generating, completed, failed
  progress: 0,
  logs: [],

  setCurrentJob: (job) => set({ currentJob: job }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setProgress: (progress) => set({ progress }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),

  // Projects
  projects: [],
  setProjects: (projects) => set({ projects }),

  // Generated files
  generatedFiles: null,
  setGeneratedFiles: (files) => set({ generatedFiles: files }),

  // Reset
  resetGeneration: () => set({
    currentJob: null,
    generationStatus: 'idle',
    progress: 0,
    logs: [],
    generatedFiles: null,
  })
}))