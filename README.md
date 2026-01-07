# Hodlr - Personal Investment Portfolio Management

Hodlr is a **Progressive Web App (PWA)** designed to manage personal investment portfolios (Crypto, Stocks, etc.) with a focus on privacy and offline capability. It runs entirely in the browser using **IndexedDB** for local data storage and utilizes **Next.js 15** for a modern, performant foundation.

## Features

- **Portfolio Tracking:** Monitor assets across different categories (Crypto, Stocks).
- **Local-First:** All data is stored locally on your device using IndexedDB (via Dexie.js). No external servers required for data storage.
- **PWA:** Installable as a native-like application on desktop and mobile. Works offline.
- **Strategies:** Define and track investment strategies (DCA, Swing, etc.).
- **Journaling:** Keep a trading/investment journal.
- **Analytics:** Visualize performance and asset allocation.

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

- [Requirements](docs/1-requirements.md)
- [Technical Specification](docs/2-technical_specification.md)
- [User Flow](docs/3-user_flow.md)
- [Project Roadmap](docs/4-project_roadmap.md)

## License

[MIT](LICENSE)
