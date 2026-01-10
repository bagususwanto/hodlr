# Hodlr - Personal Investment Portfolio Management

Hodlr is a **Progressive Web App (PWA)** designed to manage personal investment portfolios (Crypto, Stocks, etc.) with a focus on privacy, ownership, and offline capability. It runs entirely in the browser using **IndexedDB** for local data storage and utilizes **Next.js 15** for a modern, performant foundation.

**Your Data, Your Device.** Hodlr does not track you, and your financial data never leaves your browser.

## Features

### 🛡️ Local-First & Private

- **Zero Server Data:** All data is stored locally on your device using IndexedDB (via Dexie.js).
- **Offline Capable:** Works fully offline.
- **Data Ownership:** Full Export/Import capabilities (JSON) for backup and migration.

### 📈 Portfolio Tracking

- **Asset Management:** Track Crypto, Stocks, and other assets.
- **P&L Analysis:** Real-time calculation of Realized P&L, Average Buy Price, and Holdings.
- **Dashboard:** High-level overview of portfolio value, allocation, and performance.

### 🧠 Smart Strategies

- **Strategy Types:** Built-in support for DCA (Dollar Cost Averaging), Swing Trading, Lump Sum, HODL, and Value Averaging.
- **Performance Tracking:** Track ROI and success rates per specific strategy, not just per asset.
- **Link Transactions:** Associate buy/sell orders with specific strategies.

### 📝 Trading Journal

- **Rich Text Entry:** Markdown support for detailed trade analysis.
- **Timeline View:** Visualize your thoughts alongside your trade history.
- **Tagging:** Organize entries and transactions with custom tags.
- **Attachments:** Store charts and screenshots directly in your journal (local storage).

### 📊 Analytics & Reporting

- **User Metrics:** Win Rate, Profit Factor, Average Win/Loss.
- **Visualizations:** Portfolio allocation charts and performance graphs.
- **Reports:** Generate Month-End or Year-End reports in PDF or Excel format.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **PWA:** [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bagususwanto/hodlr.git
    cd hodlr
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

- [User Guide](docs/5-user_guide.md) - **Start Here!**
- [Project Roadmap](docs/4-project_roadmap.md)
- [Requirements](docs/1-requirements.md)
- [Technical Specification](docs/2-technical_specification.md)
- [User Flow](docs/3-user_flow.md)

## License

[MIT](LICENSE)
