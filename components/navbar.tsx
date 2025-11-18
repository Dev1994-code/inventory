'use client'

interface NavbarProps {
  userRole: 'admin' | 'storekeeper'
  onMenuClick?: () => void
}

export function Navbar({ userRole, onMenuClick }: NavbarProps) {
  return (
    <nav className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-lg"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-lg md:text-xl font-bold text-foreground hidden sm:block">InventoryPro</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
          {userRole === 'admin' ? '👤 Admin' : '📦 SK'}
        </div>
      </div>
    </nav>
  )
}
