import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Calendar, Download, ExternalLink, Trash2 } from 'lucide-react'
import { getProjects } from '../services/api'
import toast from 'react-hot-toast'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data } = await getProjects()
      setProjects(data.projects || [])
    } catch (err) {
      // Demo data if API not ready
      setProjects([
        {
          id: 'demo-1',
          name: 'E-Commerce App',
          description: 'Full stack e-commerce with cart, checkout, admin',
          techStack: { frontend: 'React', backend: 'Node.js', database: 'MongoDB' },
          status: 'completed',
          createdAt: '2026-05-01T10:00:00Z',
          deployUrl: 'https://demo-ecommerce.onrender.com'
        },
        {
          id: 'demo-2',
          name: 'Blog Platform',
          description: 'Blog with categories, comments, markdown editor',
          techStack: { frontend: 'React', backend: 'Node.js', database: 'MongoDB' },
          status: 'completed',
          createdAt: '2026-05-02T14:30:00Z',
          deployUrl: null
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
    toast.success('Project removed')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-gray-400">All your generated full stack applications</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 hover:border-neon-blue/30 transition-all duration-300
                         hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 
                                flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-neon-blue" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' 
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(project.techStack).map(([key, value]) => (
                  <span key={key} className="px-2 py-1 bg-dark-700 rounded-lg text-xs text-gray-300">
                    {value}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                {project.deployUrl && (
                  <a 
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live
                  </a>
                )}
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 
                             text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects