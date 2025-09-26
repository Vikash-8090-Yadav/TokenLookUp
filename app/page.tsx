"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, AlertCircle } from "lucide-react"

interface TokenData {
  name: string
  symbol: string
  totalSupply: string
}

export default function TokenLookup() {
  const [address, setAddress] = useState("")
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLookup = async () => {
    if (!address.trim()) {
      setError("Please enter a contract address")
      return
    }

    setLoading(true)
    setError("")
    setTokenData(null)

    try {
      const response = await fetch(`/api?module=token&action=getToken&contractaddress=${address.trim()}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch token data")
      }

      if (!data || !data.name) {
        throw new Error("Invalid token address or no data found")
      }

      setTokenData({
        name: data.name,
        symbol: data.symbol,
        totalSupply: data.totalSupply,
      })
    } catch (err) {
      console.log("[v0] Token lookup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching token data")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLookup()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Token Lookup</h1>
          <p className="text-muted-foreground">Enter a token contract address to fetch token details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Contract Address
            </CardTitle>
            <CardDescription>Enter the token contract address you want to look up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleLookup} disabled={loading || !address.trim()} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  "Lookup Token"
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {tokenData && (
          <Card>
            <CardHeader>
              <CardTitle>Token Details</CardTitle>
              <CardDescription>Information for contract address: {address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Token Name</h3>
                  <p className="text-lg font-semibold text-foreground">{tokenData.name}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Symbol</h3>
                  <p className="text-lg font-semibold text-foreground">{tokenData.symbol}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
                  <p className="text-lg font-semibold text-foreground">
                    {tokenData.totalSupply ? Number(tokenData.totalSupply).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
