import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Globe, Save, Eye, EyeOff } from 'lucide-react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

function Settings() {
  const { apiKey, setApiKey } = useStore()
  const [key, setKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [backendUrl, setBackendUrl] = useState('https://aiagentautobg.onrender.com')

  const saveSettings = () => {
    setApiKey(key)
    toast.success('Settings saved!')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your API keys and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* API Key */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 
                              flex items-center justify-center">
                <Key className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">API Key</h3>
                <p className="text-sm text-gray-400">Your AI agent authentication key</p>
              </div>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your API key (ABSK...)"
                className="input-field pr-12 code-font"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 
                           text-gray-500 hover:text-neon-blue transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supports ABSK, sk-ant, and other key formats
            </p>
          </motion.div>

          {/* Backend URL */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 
                              flex items-center justify-center">
                <Globe className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Backend URL</h3>
                <p className="text-sm text-gray-400">Your deployed backend endpoint</p>
              </div>
            </div>

            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="input-field code-font"
            />
            <p className="text-xs text-gray-500 mt-2">
              Current: {backendUrl}
            </p>
          </motion.div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveSettings}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Settings