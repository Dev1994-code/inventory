'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Transaction, InventoryItem } from '@/app/page'

interface TransactionLogProps {
  userRole: 'admin' | 'storekeeper'
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  inventory: InventoryItem[]
  setInventory: (items: InventoryItem[]) => void
}

export function TransactionLog({ 
  userRole, 
  transactions, 
  setTransactions, 
  inventory,
  setInventory 
}: TransactionLogProps) {
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [formData, setFormData] = useState({
    item: '',
    type: 'out' as 'in' | 'out',
    quantity: 0,
    notes: '',
  })

  const filtered = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  )

  const handleVerify = (id: number) => {
    setTransactions(txs => txs.map(tx => 
      tx.id === id 
        ? { ...tx, verifiedBy: 'You (Admin)', verificationDate: new Date().toISOString().split('T')[0] }
        : tx
    ))
  }

  const handleAddTransaction = () => {
    if (!formData.item || formData.quantity <= 0) {
      alert('Please fill in all fields')
      return
    }

    const newTransaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      item: formData.item,
      type: formData.type,
      quantity: formData.quantity,
      performedBy: userRole === 'admin' ? 'Admin User' : 'Khalid',
      notes: formData.notes,
      verifiedBy: userRole === 'admin' ? 'Auto-verified' : undefined,
      verificationDate: userRole === 'admin' ? new Date().toISOString().split('T')[0] : undefined,
    }

    setTransactions([newTransaction, ...transactions])

    setInventory(inventory.map(item => {
      if (item.name === formData.item) {
        return {
          ...item,
          quantity: formData.type === 'in' 
            ? item.quantity + formData.quantity 
            : item.quantity - formData.quantity,
          lastRestocked: formData.type === 'in' ? new Date().toISOString().split('T')[0] : item.lastRestocked
        }
      }
      return item
    }))

    setFormData({ item: '', type: 'out', quantity: 0, notes: '' })
    setIsAddingTransaction(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Transaction Log</h2>
        {userRole === 'storekeeper' && (
          <Button 
            onClick={() => setIsAddingTransaction(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto"
          >
            + Log Transaction
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={`text-sm ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
        >
          All
        </Button>
        <Button
          variant={filter === 'in' ? 'default' : 'outline'}
          onClick={() => setFilter('in')}
          className={`text-sm ${filter === 'in' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-border text-foreground hover:bg-muted'}`}
        >
          ➕ In
        </Button>
        <Button
          variant={filter === 'out' ? 'default' : 'outline'}
          onClick={() => setFilter('out')}
          className={`text-sm ${filter === 'out' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-border text-foreground hover:bg-muted'}`}
        >
          ➖ Out
        </Button>
      </div>

      {isAddingTransaction && userRole === 'storekeeper' && (
        <Card className="bg-card border-border border-2">
          <CardContent className="p-4 md:p-6 space-y-4">
            <h3 className="text-base md:text-lg font-bold text-foreground">Log New Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Item</label>
                <select
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded border border-border bg-input text-foreground text-sm"
                >
                  <option value="">Select item...</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'in' | 'out' })}
                  className="mt-1 w-full px-3 py-2 rounded border border-border bg-input text-foreground text-sm"
                >
                  <option value="out">Out (Sale/Move)</option>
                  <option value="in">In (Restock)</option>
                </select>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                  min="1"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Notes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                  placeholder="e.g., Customer order"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddTransaction}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm flex-1 md:flex-none"
              >
                Log
              </Button>
              <Button
                onClick={() => {
                  setIsAddingTransaction(false)
                  setFormData({ item: '', type: 'out', quantity: 0, notes: '' })
                }}
                variant="outline"
                className="border-border text-foreground hover:bg-muted text-sm flex-1 md:flex-none"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-6 text-center text-sm">
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((tx) => (
            <Card key={tx.id} className={`bg-card border-border ${!tx.verifiedBy ? 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}>
              <CardContent className="p-3 md:p-4">
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${tx.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm md:text-base text-foreground truncate">{tx.item}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${
                          tx.type === 'in' 
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                        }`}>
                          {tx.type === 'in' ? 'INBOUND' : 'OUTBOUND'}
                        </span>
                      </div>
                      {!tx.verifiedBy && userRole === 'admin' && (
                        <span className="px-2 py-1 bg-yellow-600/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded flex-shrink-0">
                          PENDING
                        </span>
                      )}
                    </div>
                    {userRole === 'admin' && !tx.verifiedBy && (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(tx.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs w-full md:w-auto"
                      >
                        Verify
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 text-xs md:text-sm p-2 md:p-3 bg-muted/30 rounded">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Date</p>
                      <p className="font-bold text-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Qty</p>
                      <p className={`font-bold text-sm md:text-lg ${tx.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">By</p>
                      <p className="font-bold text-foreground truncate">{tx.performedBy}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Notes</p>
                      <p className="font-bold text-xs text-foreground truncate">{tx.notes || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Status</p>
                      <p className={`font-bold text-xs ${tx.verifiedBy ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {tx.verifiedBy ? '✓' : '⏳'}
                      </p>
                    </div>
                  </div>

                  {tx.verifiedBy && (
                    <div className="text-xs text-muted-foreground">
                      Verified by {tx.verifiedBy} on {tx.verificationDate}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
