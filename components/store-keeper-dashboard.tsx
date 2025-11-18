'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InventoryItem, Transaction } from '@/app/page'

interface StoreKeeperDashboardProps {
  inventory: InventoryItem[]
  transactions: Transaction[]
}

export function StoreKeeperDashboard({ inventory, transactions }: StoreKeeperDashboardProps) {
  const stats = useMemo(() => {
    const todayTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date).toDateString()
      const today = new Date().toDateString()
      return txDate === today
    })

    const itemsHandledToday = todayTransactions.reduce((sum, tx) => sum + tx.quantity, 0)
    const pendingVerification = transactions.filter(tx => !tx.verifiedBy).length
    const itemsAddedThisWeek = transactions
      .filter(tx => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.quantity, 0)

    return {
      itemsHandledToday,
      pendingVerification,
      itemsAddedThisWeek,
      todayTransactions: todayTransactions.slice(0, 5)
    }
  }, [inventory, transactions])

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.quantity < item.minStock).slice(0, 3)
  }, [inventory])

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Stats Cards - responsive grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-3 md:p-6">
            <div className="text-lg md:text-2xl mb-1 md:mb-2">📦</div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Handled Today</div>
            <div className="text-xl md:text-3xl font-bold text-primary">{stats.itemsHandledToday}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 md:p-6">
            <div className="text-lg md:text-2xl mb-1 md:mb-2">⏳</div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Pending</div>
            <div className="text-xl md:text-3xl font-bold text-destructive">{stats.pendingVerification}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 md:p-6">
            <div className="text-lg md:text-2xl mb-1 md:mb-2">➕</div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Added Week</div>
            <div className="text-xl md:text-3xl font-bold text-accent">{stats.itemsAddedThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-lg text-foreground">Today's Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {stats.todayTransactions.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No transactions logged today
            </div>
          ) : (
            <div className="space-y-2">
              {stats.todayTransactions.map((tx) => (
                <div key={tx.id} className="p-2 md:p-3 bg-muted/10 rounded border border-border/50 flex justify-between items-center hover:border-primary/50 transition-colors text-sm">
                  <div>
                    <p className="font-medium text-xs md:text-sm text-foreground">{tx.item}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleTimeString()}</p>
                  </div>
                  <div className={`font-bold text-xs md:text-sm ${tx.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'in' ? '✓' : '✗'} {tx.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsibilities and Critical Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-sm md:text-base text-foreground">Your Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 text-xs md:text-sm text-muted-foreground space-y-2">
            <p>✓ Log all items immediately</p>
            <p>✓ Record accurate quantities</p>
            <p>✓ Keep storage organized</p>
            <p>✓ Report issues to Admin</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-sm md:text-base text-foreground">Critical Stock</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {lowStockItems.length === 0 ? (
              <p className="text-xs md:text-sm text-muted-foreground">All items in good stock</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-2 md:p-2 bg-destructive/10 rounded border border-destructive/30 text-sm">
                    <p className="font-medium text-xs md:text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Now: {item.quantity} (Min: {item.minStock})</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
