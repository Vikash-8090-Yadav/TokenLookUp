import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const module = searchParams.get("module")
  const action = searchParams.get("action")
  const contractAddress = searchParams.get("contractaddress")

  // Validate required parameters
  if (module !== "token" || action !== "getToken" || !contractAddress) {
    return NextResponse.json(
      { error: "Invalid parameters. Required: module=token, action=getToken, contractaddress=<address>" },
      { status: 400 },
    )
  }

  // Validate contract address format (basic Ethereum address validation)
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return NextResponse.json({ error: "Invalid contract address format" }, { status: 400 })
  }

  try {
    const blockscoutUrl = `https://eth.blockscout.com/api/v2/tokens/${contractAddress}`

    console.log("[v0] Fetching token data from:", blockscoutUrl)

    const response = await fetch(blockscoutUrl)

    if (!response.ok) {
      throw new Error(`Blockscout API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Blockscout response:", data)

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
    }

    return NextResponse.json(formattedTokenData)
  } catch (error) {
    console.error("[v0] Token lookup error:", error)
    return NextResponse.json(
      { error: "Failed to fetch token data. Please check the contract address and try again." },
      { status: 500 },
    )
  }
}
