# TokenLookUp 🔍

A comprehensive multi-chain token explorer that provides real-time data, analytics, and insights for tokens across multiple blockchains. Built with Next.js 14, TypeScript, and Tailwind CSS.

![TokenLookUp Preview](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-38B2AC)

## ✨ Features

- **🔗 Multi-Chain Support**: Ethereum, Base, Polygon, Arbitrum, Optimism, and BNB Smart Chain
- **⚡ Real-time Data**: Instant token information lookup with live blockchain data
- **📊 Comprehensive Analytics**: Token supply, decimals, metadata, and more
- **🎨 Modern UI**: Beautiful, responsive design with dark/light theme support
- **🔍 Advanced Search**: Search by contract address with validation
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Fast Performance**: Built with Next.js 14 and optimized for speed
- **🔒 Secure**: Input validation and error handling

## 🚀 Supported Blockchains

| Chain | Symbol | Status | Explorer |
|-------|--------|--------|----------|
| Ethereum | ETH | ✅ | [Etherscan](https://eth.blockscout.com) |
| Base | ETH | ✅ | [BaseScan](https://base.blockscout.com) |
| Polygon | MATIC | ✅ | [PolygonScan](https://polygon.blockscout.com) |
| Arbitrum | ETH | ✅ | [Arbiscan](https://arbitrum.blockscout.com) |
| Optimism | ETH | ✅ | [Optimistic Etherscan](https://optimism.blockscout.com) |
| BNB Smart Chain | BNB | ✅ | [BSCScan](https://bsc.blockscout.com) |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **API**: Blockscout API integration
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikash-8090-Yadav/TokenLookUp
   cd TokenLookUp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/TokenLookUp)

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📖 Usage

### Basic Token Lookup

1. Select a blockchain from the dropdown
2. Enter a token contract address
3. Click "Lookup" to fetch token information

### Supported Address Formats

- Ethereum addresses: `0x1234...5678`
- All addresses must be 42 characters long (including 0x prefix)
- Addresses are validated before API calls

### Example Contract Addresses

- **USDC (Ethereum)**: `0xA0b86a33E6441b8c4C8C0C4C8C0C4C8C0C4C8C0C4`
- **USDC (Base)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **USDC (Polygon)**: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`

## 🔧 API Reference

### Token Lookup Endpoint

```http
GET /api?module=token&action=getToken&contractaddress={address}&chain={chainId}
```

**Parameters:**
- `module`: Must be "token"
- `action`: Must be "getToken"
- `contractaddress`: Token contract address (required)
- `chain`: Chain ID (optional, defaults to "ethereum")

**Response:**
```json
{
  "name": "Token Name",
  "symbol": "SYMBOL",
  "totalSupply": "1000000000000000000000000",
  "decimals": "18",
  "chain": {
    "id": "ethereum",
    "name": "Ethereum",
    "shortName": "ETH",
    "icon": "🔷",
    "color": "#627EEA",
    "blockExplorer": "https://eth.blockscout.com"
  }
}
```

## 🏗️ Project Structure

```
TokenLookUp/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for token lookup
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # Reusable UI components
│   └── chain-selector.tsx    # Blockchain selector component
├── lib/
│   ├── chains.ts             # Blockchain configurations
│   └── utils.ts              # Utility functions
├── hooks/                    # Custom React hooks
└── public/                   # Static assets
```

## 🎨 Customization

### Adding New Blockchains

1. Edit `lib/chains.ts`
2. Add your chain configuration:

```typescript
{
  id: 'your-chain',
  name: 'Your Chain',
  shortName: 'YOUR',
  rpcUrl: 'https://your-chain.blockscout.com',
  blockExplorer: 'https://your-chain.blockscout.com',
  apiUrl: 'https://your-chain.blockscout.com/api/v2',
  nativeCurrency: {
    name: 'Your Token',
    symbol: 'YOUR',
    decimals: 18
  },
  color: '#YOUR_COLOR',
  icon: '🔷'
}
```
