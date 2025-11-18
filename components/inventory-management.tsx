'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { InventoryItem } from '@/app/page'

interface InventoryManagementProps {
  userRole: 'admin' | 'storekeeper'
  inventory: InventoryItem[]
  setInventory: (items: InventoryItem[]) => void
}

export function InventoryManagement({ userRole, inventory, setInventory }: InventoryManagementProps) {
  const [search, setSearch] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})

  const filtered = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddItem = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'Gears',
      quantity: 0,
      minStock: 10,
      unit: 'pcs',
      lastRestocked: new Date().toISOString().split('T')[0],
    })
    setIsAddingItem(true)
    setEditingId(null)
  }

  const handleEditItem = (item: InventoryItem) => {
    setFormData(item)
    setEditingId(item.id)
    setIsAddingItem(false)
  }

  const handleSaveItem = () => {
    if (editingId !== null) {
      setInventory(inventory.map(item =>
        item.id === editingId ? { ...item, ...formData } as InventoryItem : item
      ))
    } else {
      const newItem: InventoryItem = {
        id: Math.max(...inventory.map(i => i.id), 0) + 1,
        name: formData.name || '',
        sku: formData.sku || '',
        category: formData.category || 'Gears',
        quantity: formData.quantity || 0,
        minStock: formData.minStock || 10,
        unit: formData.unit || 'pcs',
        lastRestocked: formData.lastRestocked || new Date().toISOString().split('T')[0],
      }
      setInventory([...inventory, newItem])
    }
    setIsAddingItem(false)
    setEditingId(null)
    setFormData({})
  }

  const handleDeleteItem = (id: number) => {
    if (confirm('Delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id))
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Inventory Management</h2>
        {userRole === 'admin' && (
          <Button 
            onClick={handleAddItem}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
          >
            + Add New Item
          </Button>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-border text-foreground text-sm md:text-base"
        />
        <svg className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isAddingItem || editingId !== null ? (
        <Card className="bg-card border-border border-2">
          <CardContent className="p-4 md:p-6 space-y-4">
            <h3 className="text-base md:text-lg font-bold text-foreground">
              {editingId !== null ? 'Edit Item' : 'Add New Item'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Item Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                  placeholder="e.g., Gear Pusher"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">SKU</label>
                <Input
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                  placeholder="e.g., GP-T200"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Category</label>
                <select
                  value={formData.category || 'Gears'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded border border-border bg-input text-foreground text-sm"
                >
                  <option>Gears</option>
                  <option>Bearings</option>
                  <option>Shafts</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Min Stock</label>
                <Input
                  type="number"
                  value={formData.minStock || 10}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground">Unit</label>
                <Input
                  value={formData.unit || 'pcs'}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="mt-1 bg-input text-foreground border-border text-sm"
                  placeholder="pcs"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveItem}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingItem(false)
                  setEditingId(null)
                  setFormData({})
                }}
                variant="outline"
                className="border-border text-foreground hover:bg-muted text-sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {filtered.map((item) => (
          <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-3 md:p-4">
              <div className="space-y-3 md:space-y-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
                  <div>
                    <p className="font-bold text-sm md:text-base text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium w-fit">
                    {item.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Stock</p>
                    <p className={`font-bold ${item.quantity < item.minStock ? 'text-destructive' : 'text-accent'}`}>
                      {item.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Min</p>
                    <p className="font-bold text-foreground">{item.minStock}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Status</p>
                    <p className={`font-bold text-xs ${
                      item.quantity < item.minStock 
                        ? 'text-destructive' 
                        : item.quantity < item.minStock * 1.5 
                        ? 'text-yellow-500'
                        : 'text-green-600'
                    }`}>
                      {item.quantity < item.minStock ? '🔴' : item.quantity < item.minStock * 1.5 ? '🟡' : '🟢'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Restocked</p>
                    <p className="font-bold text-xs text-foreground">{new Date(item.lastRestocked).toLocaleDateString()}</p>
                  </div>
                </div>

                {userRole === 'admin' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditItem(item)}
                      className="border-border text-foreground hover:bg-muted text-xs flex-1 md:flex-none"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteItem(item.id)}
                      className="border-destructive text-destructive hover:bg-destructive/10 text-xs flex-1 md:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
