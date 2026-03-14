"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, History } from "lucide-react"

export default function WalletPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your educational finances and transactions
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold text-foreground">$2,450.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <ArrowDownLeft className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-foreground">$3,200.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <ArrowUpRight className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-foreground">$750.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions & Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="border-border bg-card/50 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Funds
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-border hover:bg-secondary">
              <ArrowUpRight className="h-4 w-4" />
              Pay Course Fee
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-border hover:bg-secondary">
              <History className="h-4 w-4" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-border bg-card/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <History className="h-5 w-5 text-accent" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TransactionItem
                title="Web Development 101"
                description="Course fee payment"
                amount="-$299.00"
                date="Mar 10, 2026"
                type="expense"
              />
              <TransactionItem
                title="Scholarship Credit"
                description="Academic excellence award"
                amount="+$500.00"
                date="Mar 8, 2026"
                type="income"
              />
              <TransactionItem
                title="Data Science Fundamentals"
                description="Course fee payment"
                amount="-$349.00"
                date="Mar 5, 2026"
                type="expense"
              />
              <TransactionItem
                title="Wallet Top-up"
                description="Added funds via card"
                amount="+$1,000.00"
                date="Mar 1, 2026"
                type="income"
              />
              <TransactionItem
                title="Study Materials"
                description="E-books and resources"
                amount="-$45.00"
                date="Feb 28, 2026"
                type="expense"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Methods
          </CardTitle>
          <CardDescription>Your saved payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/27</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Default
              </span>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Mastercard ending in 8888</p>
                <p className="text-sm text-muted-foreground">Expires 08/25</p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Plus className="h-5 w-5" />
              <span>Add Payment Method</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TransactionItem({
  title,
  description,
  amount,
  date,
  type,
}: {
  title: string
  description: string
  amount: string
  date: string
  type: "income" | "expense"
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          type === "income" ? "bg-green-500/10" : "bg-destructive/10"
        }`}
      >
        {type === "income" ? (
          <ArrowDownLeft className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-destructive" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-right">
        <p
          className={`font-medium ${
            type === "income" ? "text-green-500" : "text-foreground"
          }`}
        >
          {amount}
        </p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}
