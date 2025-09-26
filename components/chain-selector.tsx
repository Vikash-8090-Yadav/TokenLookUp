"use client"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { chains, type Chain } from "@/lib/chains"

interface ChainSelectorProps {
  selectedChain: Chain
  onChainChange: (chain: Chain) => void
  disabled?: boolean
}

export function ChainSelector({ selectedChain, onChainChange, disabled }: ChainSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter chains based on search
  const filteredChains = chains.filter(chain =>
    chain.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    chain.shortName.toLowerCase().includes(searchValue.toLowerCase()) ||
    chain.id.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchValue("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChainSelect = (chain: Chain) => {
    onChainChange(chain)
    setOpen(false)
    setSearchValue("")
  }

  return (
    <div className="relative w-full" ref={dropdownRef} data-chain-selector>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-12"
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedChain.icon}</span>
          <span className="font-medium">{selectedChain.name}</span>
          <span className="text-sm text-muted-foreground">({selectedChain.shortName})</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-[99999] w-full mt-1 bg-card border border-border rounded-md shadow-2xl max-h-60 overflow-auto" style={{ zIndex: 99999 }}>
          <div className="p-2 sticky top-0 bg-card border-b border-border">
            <input
              type="text"
              placeholder="Search chains..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>
          <div className="py-1">
            {filteredChains.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">No chain found.</div>
            ) : (
              filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                    selectedChain.id === chain.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="text-lg">{chain.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{chain.name}</div>
                    <div className="text-xs text-muted-foreground">{chain.shortName}</div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedChain.id === chain.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
