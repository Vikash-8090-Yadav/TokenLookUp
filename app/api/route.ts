import { type NextRequest, NextResponse } from "next/server"
import { chains, getChainById } from "@/lib/chains"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const module = searchParams.get("module")
  const action = searchParams.get("action")
  const contractAddress = searchParams.get("contractaddress")
  const chainId = searchParams.get("chain") || "ethereum"

  // Validate required parameters
  if (module !== "token" || action !== "getToken" || !contractAddress) {
    return NextResponse.json(
      { error: "Invalid parameters. Required: module=token, action=getToken, contractaddress=<address>, chain=<chainId>" },
      { status: 400 },
    )
  }

  // Validate contract address format (basic Ethereum address validation)
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return NextResponse.json({ error: "Invalid contract address format" }, { status: 400 })
  }

  // Get chain configuration
  const chain = getChainById(chainId)
  if (!chain) {
    return NextResponse.json(
      { error: `Unsupported chain: ${chainId}. Supported chains: ${chains.map(c => c.id).join(", ")}` },
      { status: 400 },
    )
  }

  try {
    const blockscoutUrl = `${chain.apiUrl}/tokens/${contractAddress}`

    console.log(`[${chain.name}] Fetching token data from:`, blockscoutUrl)

    const response = await fetch(blockscoutUrl)

    if (!response.ok) {
      throw new Error(`${chain.name} API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[${chain.name}] API response:`, data)

    // Check if the API returned an error
    if (data.error) {
      return NextResponse.json(
        { error: data.error || "Token not found or invalid contract address" },
        { status: 404 },
      )
    }

    // Extract token information from Blockscout response
    const tokenInfo = data

    if (!tokenInfo || !tokenInfo.name) {
      return NextResponse.json({ error: "Token information not available" }, { status: 404 })
    }

    // Format the response to match our expected structure
    const formattedTokenData = {
      name: tokenInfo.name || "Unknown Token",
      symbol: tokenInfo.symbol || "UNKNOWN",
      totalSupply: tokenInfo.total_supply || "0",
      decimals: tokenInfo.decimals || "18",
      chain: {
        id: chain.id,
        name: chain.name,
        shortName: chain.shortName,
        icon: chain.icon,
        color: chain.color,
        blockExplorer: chain.blockExplorer,
      },
    }

    return NextResponse.json(formattedTokenData)
  } catch (error) {
    console.error(`[${chain.name}] Token lookup error:`, error)
    return NextResponse.json(
      { error: `Failed to fetch token data from ${chain.name}. Please check the contract address and try again.` },
      { status: 500 },
    )
  }
}
