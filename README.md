# 🌍 AI-Powered Emissions Insights Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js)

**A modern, interactive web application for visualizing greenhouse gas emissions with an integrated AI chat assistant**

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack)

</div>

---

## 📸 Preview

<div align="center">
  <img src="./screenshots/dashboard.png" alt="Dashboard Preview" width="100%">
</div>

---

## ✨ Features

### 📊 Interactive Data Visualization
- **Bar Chart** - Emissions by sector with color-coded datasets
- **Line Chart** - Emissions trends over time with gradient fills
- **Stats Cards** - Dynamic KPIs that update based on filter selection

### 🔍 Smart Filtering
- Filter by sector: All, Energy, Industry, Transport, Agriculture, Buildings
- Quick action buttons for common views
- Real-time chart updates with smooth animations

### 🤖 AI Chat Assistant
- **Dataset Analysis** - Ask questions about emissions data
  - *"Which sector has the highest emissions?"*
  - *"Show me the trend over time"*
  - *"Compare 2010 vs 2023 emissions"*
- **Wikipedia Integration** - Get external knowledge
  - *"What is carbon dioxide?"*
  - *"What causes greenhouse gas emissions?"*
- **Hybrid Reasoning** - Combines local data with web knowledge

### 🎨 Premium Dark Theme UI
- GitHub-inspired color palette
- Glassmorphism cards with backdrop blur
- Smooth fade-in and slide animations
- Fully responsive design

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Deepanshu0985/Emission_web.git

# Navigate to project directory
cd Emission_web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS 4 |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons** | Lucide React |
| **AI/Web** | Wikipedia REST API |

---

## 📁 Project Structure

```
emissions-dashboard/
├── src/
│   ├── app/
│   │   ├── api/chat/        # AI Chat API endpoint
│   │   ├── globals.css      # Global styles & animations
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main dashboard page
│   ├── components/
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── SectorFilter.tsx # Filter buttons
│   │   ├── BarChart.tsx     # Emissions bar chart
│   │   ├── LineChart.tsx    # Trend line chart
│   │   ├── StatsCards.tsx   # KPI cards
│   │   └── ChatPanel.tsx    # AI chat sidebar
│   └── data/
│       └── emissions-data.ts # Dataset & helpers
├── public/
├── package.json
└── README.md
```

---

## 🎯 Key Features Deep Dive

### AI Chat Logic

The chat assistant uses a smart query classification system:

1. **Data Queries** → Analyzes local emissions dataset
2. **Web Queries** → Fetches from Wikipedia API
3. **Hybrid Queries** → Combines both sources

```typescript
// Query classification example
function classifyQuery(query: string): 'data' | 'web' | 'hybrid' {
  // Checks for data keywords (emissions, sector, year, etc.)
  // Checks for web keywords (what is, why, explain, etc.)
  // Returns appropriate classification
}
```

### Chart Responsiveness

Charts use a client-side rendering pattern to avoid Next.js hydration issues:

```typescript
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);

if (!isClient) return <Loading />;
return <Chart data={data} options={options} />;
```

---

## 🌈 Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark | `#0D1117` |
| Panel | Charcoal | `#161B22` |
| Border | Gray | `#30363D` |
| Accent | Blue | `#58A6FF` |
| Text | Light | `#C9D1D9` |

---

## 📊 Sample Data

The dashboard includes sample emissions data for demonstration:

- **Sectors**: Energy, Industry, Transport, Agriculture, Buildings
- **Years**: 2010-2023
- **Metrics**: Million Metric Tons CO₂ equivalent

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning or building upon.

---

## 👨‍💻 Author

**Deepanshu Yadav**  

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

</div>
