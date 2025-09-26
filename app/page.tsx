"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Loader2, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ExternalLink, 
  Twitter, 
  MessageCircle, 
  Globe,
  Copy,
  Check,
  BarChart3,
  History,
  Star
} from "lucide-react"

interface TokenData {
  name: string
  symbol: string
  totalSupply: string
  decimals: string
  description?: string
  website?: string
  twitter?: string
  telegram?: string
  discord?: string
  logo?: string
  price?: {
    usd: number
    btc: number
    change24h: number
  }
  holders: number
  marketCap?: number
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  blockNumber: number
  method: string
}

interface Holder {
  address: string
  balance: string
  percentage: number
  isContract: boolean
}

export default function TokenLookup() {
  const [address, setAddress] = useState("")
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [holders, setHolders] = useState<Holder[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingHolders, setLoadingHolders] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const handleLookup = async () => {
    if (!address.trim()) {
      setError("Please enter a contract address")
      return
    }

    setLoading(true)
    setError("")
    setTokenData(null)
    setTransactions([])
    setHolders([])

    try {
      const response = await fetch(`/api?module=token&action=getToken&contractaddress=${address.trim()}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch token data")
      }

      if (!data || !data.name) {
        throw new Error("Invalid token address or no data found")
      }

      setTokenData(data)
      
      // Add to search history
      const trimmedAddress = address.trim()
      if (!searchHistory.includes(trimmedAddress)) {
        setSearchHistory(prev => [trimmedAddress, ...prev.slice(0, 9)]) // Keep last 10 searches
      }
    } catch (err) {
      console.log("[v0] Token lookup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching token data")
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    if (!address.trim()) return

    setLoadingTransactions(true)
    try {
      const response = await fetch(`/api/transactions?contractaddress=${address.trim()}&limit=10`)
      const data = await response.json()
      
      if (response.ok && data.transactions) {
        setTransactions(data.transactions)
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const fetchHolders = async () => {
    if (!address.trim()) return

    setLoadingHolders(true)
    try {
      const response = await fetch(`/api/holders?contractaddress=${address.trim()}&limit=10`)
      const data = await response.json()
      
      if (response.ok && data.holders) {
        setHolders(data.holders)
      }
    } catch (err) {
      console.error("Failed to fetch holders:", err)
    } finally {
      setLoadingHolders(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const toggleFavorite = (address: string) => {
    setFavorites(prev => 
      prev.includes(address) 
        ? prev.filter(addr => addr !== address)
        : [...prev, address]
    )
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatValue = (value: string, decimals: number) => {
    const num = parseFloat(value) / Math.pow(10, decimals)
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(8)}`
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`
    return `$${marketCap.toFixed(2)}`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLookup()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Token Lookup
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover comprehensive token information instantly. Get real-time data, analytics, and insights for any ERC-20 token on Ethereum.
              </p>
            </div>
            
            {/* Search Card */}
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Search className="h-6 w-6 text-primary" />
                  Search Token
                </CardTitle>
                <CardDescription className="text-center">
                  Enter any ERC-20 token contract address to get detailed information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="0x1234...5678"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="h-12 text-lg pr-12"
                    />
                    {address && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setAddress("")}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={handleLookup} 
                    disabled={loading || !address.trim()} 
                    className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Lookup
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Real-time Data</h3>
                <p className="text-sm text-muted-foreground">Get up-to-date token information from Blockscout</p>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Comprehensive</h3>
                <p className="text-sm text-muted-foreground">View supply, decimals, and token metadata</p>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Ethereum Native</h3>
                <p className="text-sm text-muted-foreground">Built for Ethereum mainnet token exploration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Results */}
      {tokenData && (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-in slide-in-from-bottom-4">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    {tokenData.logo && (
                      <img 
                        src={tokenData.logo} 
                        alt={tokenData.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    {tokenData.name}
                    <Badge variant="secondary" className="ml-2">
                      {tokenData.symbol}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Contract: <code className="bg-muted px-2 py-1 rounded text-xs">{address}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(address)}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(address)}
                  className="flex items-center gap-2"
                >
                  <Star className={`h-4 w-4 ${favorites.includes(address) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {favorites.includes(address) ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-min">
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Token Name
                  </h3>
                  <p className="text-xl font-bold text-foreground">{tokenData.name}</p>
                </div>
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Badge className="h-4 w-4" />
                    Symbol
                  </h3>
                  <p className="text-xl font-bold text-foreground">{tokenData.symbol}</p>
                </div>
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Supply
                  </h3>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-foreground token-supply" title={tokenData.totalSupply ? Number(tokenData.totalSupply).toLocaleString() : "N/A"}>
                      {tokenData.totalSupply ? Number(tokenData.totalSupply).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Decimals
                  </h3>
                  <p className="text-xl font-bold text-foreground">{tokenData.decimals || "18"}</p>
                </div>
              </div>

              {/* Additional Information */}
              {(tokenData.description || tokenData.website || tokenData.twitter) && (
                <div className="mt-8 space-y-4">
                  <Separator />
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {tokenData.description && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="text-sm text-foreground">{tokenData.description}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Links</h4>
                      <div className="flex gap-2">
                        {tokenData.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={tokenData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {tokenData.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={tokenData.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <Twitter className="h-4 w-4" />
                              Twitter
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
