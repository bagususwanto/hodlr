# Hodlr User Guide

Welcome to the **Hodlr** User Guide. This document provides detailed instructions on how to use the Hodlr application to manage your investment portfolio effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Asset Management](#asset-management)
4. [Transactions](#transactions)
5. [Strategies](#strategies)
6. [Journal](#journal)
7. [Analytics](#analytics)
8. [Settings & Data Management](#settings--data-management)

---

## Getting Started

### Installation

Hodlr is a Progressive Web App (PWA). This means you can install it on your device for an app-like experience.

- **Desktop (Chrome/Edge):** Click the install icon in the address bar (usually on the right side).
- **Mobile (iOS Safari):** Tap the "Share" button and select "Add to Home Screen".
- **Mobile (Android Chrome):** Tap the menu (three dots) and select "Install app".

### First Launch

Upon first launch, you will start with an empty portfolio. You can begin by adding your first asset or importing data if you have a backup.

---

## Dashboard

The Dashboard provides a high-level overview of your portfolio.

- **Total Portfolio Value:** Shows the current total value of all your holdings in your base currency.
- **P&L Overview:** Displays your Realized Profit & Loss.
- **Allocation:** A pie chart showing how your portfolio is distributed across different assets.
- **Best/Worst Performers:** Highlights the assets with the highest and lowest performance.
- **Recent Transactions:** A quick list of your latest activities.
- **Quick Actions:** Shortcuts to add transactions or assets.

---

## Asset Management

Manage the list of assets you are tracking or holding.

### Adding an Asset

1. Navigate to the **Assets** page.
2. Click the **"Add Asset"** button.
3. Fill in the details:
   - **Symbol:** (e.g., BTC, ETH, AAPL)
   - **Name:** (e.g., Bitcoin, Ethereum)
   - **Category:** (Crypto, Stock, etc.)
   - **Exchange/Wallet:** Where this asset is held.
4. Click **Save**.

### Viewing Asset Details

Click on any asset in the list to view its detailed page, including:

- Current holdings and average price.
- Performance metrics.
- Transaction history specific to that asset.

---

## Transactions

Record your trading activities to keep your portfolio up to date.

### Adding a Transaction

1. Click **"Add Transaction"** (from the Dashboard or Assets page).
2. Select the **Asset**.
3. Choose the **Type**:
   - **Buy:** Purchasing an asset.
   - **Sell:** Selling an asset.
   - **Swap:** Exchanging one asset for another directly (if supported).
4. Enter the **Date**, **Quantity**, and **Price**.
5. (Optional) Link to a **Strategy** or add **Tags**.
6. Click **Save**.

### Transaction History

View your complete history in the Transactions tab of an Asset or the main Transaction list. You can filter by date, type, or asset.

---

## Strategies

Hodlr allows you to group transactions into specific investment strategies to track their performance individually.

### Creating a Strategy

1. Navigate to the **Strategies** page.
2. Click **"New Strategy"**.
3. Select a **Type**:
   - **DCA (Dollar Cost Averaging):** Regular scheduled purchases.
   - **Lump Sum:** One-time large investment.
   - **Swing Trading:** Short to medium-term trades based on price swings.
   - **HODL:** Long-term holding.
   - **Custom:** Define your own strategy parameters.
4. Configure specific parameters (e.g., target amount, frequency for DCA; stop loss/take profit for Swing).
5. Set the status to **Active**.

### Linking Transactions

When adding a transaction, select the corresponding Strategy. This allows the app to calculate the performance (ROI, PnL) specifically for that strategy, separate from your overall portfolio.

---

## Journal

Keep a trading diary to improve your decision-making.

### Creating an Entry

1. Navigate to the **Journal** page.
2. Click **"New Entry"**.
3. Select an **Entry Type**:
   - **Pre-Trade:** Analysis before taking a position.
   - **Post-Trade:** Review after closing a position.
   - **Analysis:** General market thoughts.
   - **Note:** Miscellaneous notes.
4. Write your content using the **Markdown** editor. You can use bold, italics, lists, etc.
5. (Optional) Attach images or charts.
6. Link relevant **Transactions** or **Strategies** for context.
7. Save the entry.

### Timeline View

Switch to the Timeline view to see your journal entries chronologically alongside your trading activities.

---

## Analytics

Dive deeper into your portfolio's performance.

- **Performance Metrics:** View Total Return, Win Rate, and Avg Win/Loss ratios.
- **Charts:**
  - **Portfolio Value:** Line chart showing value over time.
  - **Asset Allocation:** Detailed breakdown of holdings.
- **Period Filter:** Adjust the time range (7d, 30d, 90d, 1y, All Time) to analyze specific periods.
- **Reports:** Generate and download PDF or Excel reports for your records.

---

## Settings & Data Management

Since Hodlr is a local-first app, your data lives on your device.

### Theme

Toggle between **Light** and **Dark** mode in the Settings or header menu.

### Data Backup & Restore

**Crucial:** Because there is no cloud server, **you are responsible for your data**.

- **Export Data:** Regularly export your data (JSON format) from the Settings page. Save this file safely.
- **Import Data:** Use the Import function to restore your data from a backup file (e.g., when switching devices or clearing browser cache).

### Reset

Proprietary "Danger Zone" to wipe all local data and start fresh. **This cannot be undone.**
