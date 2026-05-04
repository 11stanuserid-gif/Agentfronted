import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Send, 
  Loader2, 
  Download, 
  Rocket, 
  FileCode, 
  Server,
  Layout,
  CheckCircle2,
  XCircle,
  Terminal,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { generateApp, getStatus, downloadProject, deployProject } from '../services/api'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function Generate() {
  const [idea, setIdea] = useState('')
  const [techStack, setTechStack] = useState({
    frontend: 'react',
    backend: 'nodejs',
    database: 'mongodb',
    auth: true,
    deploy: 'render'
  })
  const [expandedFile, setExpandedFile] = useState(null)
  const [previewContent, setPreviewContent] = useState('')
  const logsEndRef = useRef(null)

  const {
    apiKey,
    currentJob,
    generationStatus,
    progress,
    logs,
    generatedFiles,
    setCurrentJob,
    setGenerationStatus,
    setProgress,
    addLog,
    clearLogs,
    setGeneratedFiles,
    resetGeneration
  } = useStore()

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Poll status
  useEffect(() => {
    if (!currentJob || generationStatus === 'completed' || generationStatus === 'failed') return

    const interval = setInterval(async () => {
      try {
        const { data } = await getStatus(currentJob)
        setProgress(data.progress || 0)

        if (data.logs) {
          data.logs.forEach(log => {
            if (!logs.find(l => l.id === log.id)) {
              addLog(log)
            }
          })
        }

        if (data.status === 'completed') {
          setGenerationStatus('completed')
          setGeneratedFiles(data.files)
          toast.success('App generated successfully!')
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setGenerationStatus('failed')
          toast.error('Generation failed: ' + data.error)
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Status poll error:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [currentJob, generationStatus])

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast.error('Please enter your app idea')
      return
    }
    if (!apiKey) {
      toast.error('Please add your API key in Settings')
      return
    }

    resetGeneration()
    setGenerationStatus('generating')

    try {
      addLog({ id: Date.now(), message: 'Initializing generation...', type: 'info', timestamp: new Date().toISOString() })

      const { data } = await generateApp({
        idea,
        techStack,
        apiKey
      })

      setCurrentJob(data.jobId)
      addLog({ id: Date.now() + 1, message: `Job started: ${data.jobId}`, type: 'success', timestamp: new Date().toISOString() })
      toast.success('Generation started!')
    } catch (err) {
      setGenerationStatus('failed')
      toast.error(err.response?.data?.message || 'Failed to start generation')
      addLog({ id: Date.now(), message: `Error: ${err.message}`, type: 'error', timestamp: new Date().toISOString() })
    }
  }

  const handleDownload = async (type) => {
    if (!currentJob) return

    const toastId = toast.loading(`Downloading ${type}...`)

    try {
      // If backend provides ZIP directly
      const response = await downloadProject(currentJob, type)
      const blob = new Blob([response.data], { type: 'application/zip' })
      saveAs(blob, `${type}-app-${currentJob}.zip`)
      toast.success(`${type} downloaded!`, { id: toastId })
    } catch (err) {
      // Fallback: Generate ZIP from file data
      if (generatedFiles) {
        const zip = new JSZip()
        const files = type === 'frontend' ? generatedFiles.frontend : generatedFiles.backend

        Object.entries(files).forEach(([path, content]) => {
          zip.file(path, content)
        })

        const blob = await zip.generateAsync({ type: 'blob' })
        saveAs(blob, `${type}-app-${currentJob}.zip`)
        toast.success(`${type} downloaded!`, { id: toastId })
      } else {
        toast.error('No files available', { id: toastId })
      }
    }
  }

  const handleDeploy = async () => {
    if (!currentJob) return

    const toastId = toast.loading('Deploying to Render...')

    try {
      const { data } = await deployProject(currentJob, 'render')
      toast.success(`Deployed! URL: ${data.url}`, { id: toastId, duration: 5000 })
    } catch (err) {
      toast.error('Deploy failed', { id: toastId })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Generate Full Stack App</h1>
          <p className="text-gray-400">Describe your idea and let AI build everything</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Idea Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6"
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Describe Your App Idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: Mujhe eek e-commerce app chahiye jisme products, cart, checkout, aur admin dashboard ho. Dark theme ho, Stripe payment integration ho, aur MongoDB mein data store ho..."
                className="input-field h-40 resize-none code-font text-sm"
                disabled={generationStatus === 'generating'}
              />
              <div className="flex justify-between mt-3">
                <span className="text-xs text-gray-500">{idea.length} characters</span>
                <button
                  onClick={() => setIdea('')}
                  className="text-xs text-gray-500 hover:text-neon-blue transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>

            {/* Tech Stack Config */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6"
            >
              <h3 className="text-sm font-medium text-gray-300 mb-4">Tech Stack Configuration</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Frontend</label>
                  <select 
                    value={techStack.frontend}
                    onChange={(e) => setTechStack({...techStack, frontend: e.target.value})}
                    className="input-field text-sm py-2"
                  >
                    <option value="react">React + Vite</option>
                    <option value="nextjs">Next.js</option>
                    <option value="vue">Vue 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Backend</label>
                  <select 
                    value={techStack.backend}
                    onChange={(e) => setTechStack({...techStack, backend: e.target.value})}
                    className="input-field text-sm py-2"
                  >
                    <option value="nodejs">Node.js + Express</option>
                    <option value="fastapi">Python FastAPI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Database</label>
                  <select 
                    value={techStack.database}
                    onChange={(e) => setTechStack({...techStack, database: e.target.value})}
                    className="input-field text-sm py-2"
                  >
                    <option value="mongodb">MongoDB</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Deploy Target</label>
                  <select 
                    value={techStack.deploy}
                    onChange={(e) => setTechStack({...techStack, deploy: e.target.value})}
                    className="input-field text-sm py-2"
                  >
                    <option value="render">Render</option>
                    <option value="vercel">Vercel</option>
                    <option value="local">Local Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTechStack({...techStack, auth: !techStack.auth})}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                    techStack.auth ? 'bg-neon-blue' : 'bg-dark-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                    techStack.auth ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className="text-sm text-gray-300">Include Authentication (JWT)</span>
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={generationStatus === 'generating' || !idea.trim()}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-3
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generationStatus === 'generating' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate Full Stack App
                </>
              )}
            </motion.button>
          </div>

          {/* Right Panel - Progress & Output */}
          <div className="space-y-6">
            {/* Progress */}
            <AnimatePresence>
              {generationStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Generation Progress</h3>
                    <span className={`text-sm font-medium ${
                      generationStatus === 'completed' ? 'text-neon-green' :
                      generationStatus === 'failed' ? 'text-red-500' :
                      'text-neon-blue'
                    }`}>
                      {generationStatus === 'generating' && 'Generating...'}
                      {generationStatus === 'completed' && 'Completed!'}
                      {generationStatus === 'failed' && 'Failed'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mb-4">{progress}%</div>

                  {/* Logs */}
                  <div className="bg-dark-900 rounded-xl p-4 h-48 overflow-y-auto code-font text-xs">
                    {logs.map((log, index) => (
                      <div key={log.id || index} className="flex items-start gap-2 mb-1">
                        <span className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`
                          ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'success' ? 'text-neon-green' :
                            log.type === 'warning' ? 'text-yellow-400' :
                            'text-gray-400'}
                        `}>
                          {log.type === 'error' && '❌ '}
                          {log.type === 'success' && '✅ '}
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <AnimatePresence>
              {generationStatus === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Download & Deploy</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      onClick={() => handleDownload('frontend')}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Layout className="w-4 h-4" />
                      Frontend ZIP
                    </button>
                    <button
                      onClick={() => handleDownload('backend')}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Server className="w-4 h-4" />
                      Backend ZIP
                    </button>
                  </div>

                  <button
                    onClick={handleDeploy}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Deploy to Render
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Preview */}
            <AnimatePresence>
              {generatedFiles && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Generated Files</h3>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(generatedFiles).map(([type, files]) => (
                      <div key={type}>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          {type === 'frontend' ? <Layout className="w-4 h-4 text-neon-blue" /> :
                           type === 'backend' ? <Server className="w-4 h-4 text-neon-green" /> :
                           <FileCode className="w-4 h-4 text-neon-purple" />}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>

                        {Object.keys(files).map((path) => (
                          <div key={path} className="ml-6">
                            <button
                              onClick={() => {
                                setExpandedFile(expandedFile === path ? null : path)
                                setPreviewContent(files[path])
                              }}
                              className="flex items-center gap-2 text-xs text-gray-400 hover:text-neon-blue 
                                         transition-colors py-1"
                            >
                              {expandedFile === path ? 
                                <ChevronDown className="w-3 h-3" /> : 
                                <ChevronRight className="w-3 h-3" />
                              }
                              <FileCode className="w-3 h-3" />
                              {path}
                            </button>

                            <AnimatePresence>
                              {expandedFile === path && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 mb-3 bg-dark-900 rounded-lg p-3 relative group">
                                    <button
                                      onClick={() => copyToClipboard(previewContent)}
                                      className="absolute top-2 right-2 p-1 rounded bg-dark-700 
                                                 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Copy className="w-3 h-3 text-gray-400" />
                                    </button>
                                    <pre className="code-font text-xs text-gray-300 overflow-x-auto">
                                      <code>{previewContent.substring(0, 500)}
                                        {previewContent.length > 500 && '...'}
                                      </code>
                                    </pre>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Generate