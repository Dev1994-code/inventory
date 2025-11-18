'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { InventoryItem, Transaction } from '@/app/page'

interface AdminDashboardProps {
  inventory: InventoryItem[]
  transactions: Transaction[]
}

export function AdminDashboard({ inventory, transactions }: AdminDashboardProps) {
  const metrics = useMemo(() => {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0)
    const lowStockCount = inventory.filter(item => item.quantity < item.minStock).length
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * 15), 0)
    const thisWeekTransactions = transactions.length

    return { totalItems, lowStockCount, totalValue, thisWeekTransactions }
  }, [inventory, transactions])

  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      in: Math.floor(Math.random() * 60) + 20,
      out: Math.floor(Math.random() * 50) + 15
    }))
  }, [])

  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {}
    inventory.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + item.quantity
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [inventory])

  const COLORS = ['#8366d9', '#4dd9ff', '#52d273', '#ffd700']

  const lowStockItems = inventory
    .filter(item => item.quantity < item.minStock)
    .slice(0, 3)

  const recentTransactions = transactions.slice(0, 4)

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Metric Cards - responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="text-xs md:text-sm text-muted-foreground mb-2">Total Items</div>
            <div className="text-2xl md:text-3xl font-bold text-primary">{metrics.totalItems.toLocaleString()}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+{inventory.length} items</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="text-xs md:text-sm text-muted-foreground mb-2">Low Stock</div>
            <div className="text-2xl md:text-3xl font-bold text-destructive">{metrics.lowStockCount}</div>
            <div className="text-xs text-destructive/70">Below minimum</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="text-xs md:text-sm text-muted-foreground mb-2">Total Value</div>
            <div className="text-2xl md:text-3xl font-bold text-secondary">${metrics.totalValue.toLocaleString()}</div>
            <div className="text-xs text-secondary/70">Estimated</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 md:p-6">
            <div className="text-xs md:text-sm text-muted-foreground mb-2">Transactions</div>
            <div className="text-2xl md:text-3xl font-bold text-accent">{metrics.thisWeekTransactions}</div>
            <div className="text-xs text-accent/70">All logged</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-4">
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="pb-3 px-4 md:px-6">
            <CardTitle className="text-base md:text-lg text-foreground">Weekly Movement</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)'
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Bar dataKey="in" fill="var(--color-chart-1)" name="In" />
                <Bar dataKey="out" fill="var(--color-destructive)" name="Out" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3 px-4 md:px-6">
            <CardTitle className="text-base md:text-lg text-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={70}
                  fill="var(--color-chart-1)"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Alerts - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-base md:text-lg text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-2 md:space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 md:p-3 bg-muted/10 rounded border border-border/50 text-sm">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className={`w-2 h-6 md:h-8 rounded flex-shrink-0 ${tx.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate text-foreground">{tx.item}</p>
                      <p className="text-xs text-muted-foreground truncate">{tx.performedBy}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-xs md:text-sm flex-shrink-0 ml-2 ${tx.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-base md:text-lg text-foreground">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-2 md:space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-2 md:p-3 bg-destructive/10 border border-destructive/30 rounded text-sm">
                  <p className="font-medium text-xs md:text-sm mb-1 text-foreground">{item.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Now: <span className="text-destructive font-bold">{item.quantity}</span></span>
                    <span className="text-muted-foreground">Min: <span className="font-bold">{item.minStock}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
