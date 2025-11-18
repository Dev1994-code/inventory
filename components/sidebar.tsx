'use client'

import { Button } from '@/components/ui/button'

interface SidebarProps {
  currentPage: 'dashboard' | 'inventory' | 'transactions'
  onPageChange: (page: 'dashboard' | 'inventory' | 'transactions') => void
  userRole: 'admin' | 'storekeeper'
  onLogout: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ currentPage, onPageChange, userRole, onLogout, isOpen = false, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', available: true },
    { id: 'inventory', label: 'Inventory', icon: '📦', available: true },
    { id: 'transactions', label: 'Transactions', icon: '📝', available: true },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`
        fixed md:static
        w-64 h-screen
        bg-card border-r border-border flex flex-col
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border">
          <p className="text-xs text-muted-foreground">MAIN MENU</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as 'dashboard' | 'inventory' | 'transactions')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentPage === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            onClick={onLogout}
            variant="outline" 
            className="w-full border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
