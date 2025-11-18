'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { AdminDashboard } from '@/components/admin-dashboard'
import { StoreKeeperDashboard } from '@/components/store-keeper-dashboard'
import { InventoryManagement } from '@/components/inventory-management'
import { TransactionLog } from '@/components/transaction-log'
import { LoginPage } from '@/components/login-page'

export interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  quantity: number
  minStock: number
  unit: string
  lastRestocked: string
}

export interface Transaction {
  id: number
  date: string
  item: string
  type: 'in' | 'out'
  quantity: number
  performedBy: string
  notes: string
  verifiedBy?: string
  verificationDate?: string
}

export default function Page() {
  const [currentUser, setCurrentUser] = useState<'admin' | 'storekeeper' | null>(null)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'inventory' | 'transactions'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Gear Pusher T-200', sku: 'GP-T200', category: 'Gears', quantity: 145, minStock: 50, unit: 'pcs', lastRestocked: '2025-01-15' },
    { id: 2, name: 'Bearing A12', sku: 'BA-A12', category: 'Bearings', quantity: 89, minStock: 30, unit: 'pcs', lastRestocked: '2025-01-10' },
    { id: 3, name: 'Micro Bearing B5', sku: 'MB-B5', category: 'Bearings', quantity: 3, minStock: 10, unit: 'pcs', lastRestocked: '2024-12-28' },
    { id: 4, name: 'Shaft Assembly', sku: 'SA-001', category: 'Shafts', quantity: 67, minStock: 25, unit: 'pcs', lastRestocked: '2025-01-12' },
    { id: 5, name: 'Aluminum Shaft', sku: 'ASH-AL', category: 'Shafts', quantity: 7, minStock: 20, unit: 'pcs', lastRestocked: '2024-12-22' },
    { id: 6, name: 'Premium Gear P-X', sku: 'PG-PX', category: 'Gears', quantity: 5, minStock: 15, unit: 'pcs', lastRestocked: '2024-12-15' },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 1, 
      date: '2025-01-20', 
      item: 'Gear Pusher T-200', 
      type: 'in', 
      quantity: 50, 
      performedBy: 'Ahmed',
      notes: 'Delivery from supplier XYZ',
      verifiedBy: 'Admin User',
      verificationDate: '2025-01-20'
    },
    { 
      id: 2, 
      date: '2025-01-20', 
      item: 'Bearing A12', 
      type: 'out', 
      quantity: 15, 
      performedBy: 'Khalid',
      notes: 'Sold to customer ABC',
      verifiedBy: 'Admin User',
      verificationDate: '2025-01-20'
    },
    { 
      id: 3, 
      date: '2025-01-19', 
      item: 'Shaft Assembly', 
      type: 'in', 
      quantity: 30, 
      performedBy: 'Ahmed',
      notes: 'Restocking from warehouse',
      verifiedBy: 'Admin User',
      verificationDate: '2025-01-19'
    },
  ])

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => {
          setCurrentPage(page)
          setSidebarOpen(false)
        }}
        userRole={currentUser}
        onLogout={() => setCurrentUser(null)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Navbar 
          userRole={currentUser}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && (
            currentUser === 'admin' ? (
              <AdminDashboard inventory={inventory} transactions={transactions} />
            ) : (
              <StoreKeeperDashboard inventory={inventory} transactions={transactions} />
            )
          )}
          {currentPage === 'inventory' && (
            <InventoryManagement 
              userRole={currentUser} 
              inventory={inventory}
              setInventory={setInventory}
            />
          )}
          {currentPage === 'transactions' && (
            <TransactionLog 
              userRole={currentUser} 
              transactions={transactions}
              setTransactions={setTransactions}
              inventory={inventory}
              setInventory={setInventory}
            />
          )}
        </main>
      </div>
    </div>
  )
}
