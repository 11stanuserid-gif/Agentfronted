import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Code2, 
  Database, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Code2,
      title: 'Frontend Auto-Gen',
      desc: 'React + Tailwind + Vite with responsive design',
      color: 'from-neon-blue to-blue-600'
    },
    {
      icon: Database,
      title: 'Backend Auto-Gen',
      desc: 'Node.js + Express + MongoDB with JWT auth',
      color: 'from-neon-green to-green-600'
    },
    {
      icon: Globe,
      title: 'One-Click Deploy',
      desc: 'Deploy to Render with automatic env setup',
      color: 'from-neon-purple to-purple-600'
    },
    {
      icon: Layers,
      title: 'Full Stack ZIP',
      desc: 'Download complete frontend & backend ZIPs',
      color: 'from-neon-pink to-pink-600'
    }
  ]

  const steps = [
    'Describe your app idea in natural language',
    'AI analyzes requirements & designs architecture',
    'Backend APIs & database schemas generated',
    'Frontend components with API integration built',
    'Download ZIPs or deploy directly to Render'
  ]

  return (
    <div className="min-h-screen p-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm mb-6">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Full Stack Generator</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Build Full Stack Apps
          <span className="block text-gradient">In Minutes, Not Days</span>
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Describe your idea, and our AI agent will generate a complete production-ready 
          full stack application with frontend, backend, database, and deployment.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/generate')}
          className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-3"
        >
          <Zap className="w-5 h-5" />
          Start Generating
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 hover:border-neon-blue/30 transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} 
                            flex items-center justify-center mb-4 shadow-lg`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto glass-panel p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-neon-blue/20 border border-neon-blue/30 
                              flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neon-blue text-sm font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-300">{step}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home