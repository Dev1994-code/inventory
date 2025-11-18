'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LoginPageProps {
  onLogin: (role: 'admin' | 'storekeeper') => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">InventoryPro</h1>
          <p className="text-muted-foreground">Spare Parts Management System</p>
        </div>

        <div className="grid gap-3">
          <Button
            onClick={() => onLogin('admin')}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Admin Dashboard
            </span>
          </Button>
          <Button
            onClick={() => onLogin('storekeeper')}
            variant="outline"
            size="lg"
            className="w-full border-border text-foreground hover:bg-muted"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
              </svg>
              Store Keeper
            </span>
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2 text-muted-foreground">
            <p>• Admin: Full control, create/edit/delete items, verify transactions</p>
            <p>• Store Keeper: Log transactions, view inventory (limited access)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
