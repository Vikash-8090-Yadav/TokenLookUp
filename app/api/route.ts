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
    const etherscanUrl = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${contractAddress}&apikey=YourApiKeyToken`

    console.log("[v0] Fetching token data from:", etherscanUrl)

    const response = await fetch(etherscanUrl)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Etherscan response:", data)

    // Check if the API returned an error
    if (data.status !== "1") {
      return NextResponse.json(
        { error: data.message || "Token not found or invalid contract address" },
        { status: 404 },
      )
    }

    // Extract token information from Etherscan response
    const tokenInfo = data.result[0]

    if (!tokenInfo) {
      return NextResponse.json({ error: "Token information not available" }, { status: 404 })
    }

    // Format the response to match our expected structure
    const formattedTokenData = {
      name: tokenInfo.tokenName || "Unknown Token",
      symbol: tokenInfo.symbol || "UNKNOWN",
      totalSupply: tokenInfo.totalSupply || "0",
      decimals: tokenInfo.divisor || "18",
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
