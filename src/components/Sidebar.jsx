import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Zap, 
  FolderOpen, 
  Settings, 
  Sparkles,
  Github,
  Terminal
} from 'lucide-react'

function Sidebar() {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/generate', icon: Zap, label: 'Generate App' },
    { path: '/projects', icon: FolderOpen, label: 'My Projects' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-dark-800 border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple 
                          flex items-center justify-center shadow-lg shadow-neon-blue/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AutoStack</h1>
            <p className="text-xs text-gray-500">AI Full Stack Generator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-panel p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Terminal className="w-3 h-3" />
            <span>Backend: Connected</span>
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Github className="w-3 h-3" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar