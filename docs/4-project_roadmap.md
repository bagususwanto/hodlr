# Hodlr - Project Roadmap

## Overview

Roadmap pengembangan aplikasi Hodlr - PWA manajemen portfolio investasi dengan penyimpanan data lokal.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Project Setup

- [x] Initialize Next.js 15 project dengan TypeScript
- [x] Setup Tailwind CSS + shadcn/ui
- [x] Konfigurasi PWA (next-pwa)
- [x] Setup Dexie.js untuk IndexedDB
- [x] Definisi database schema (Assets, Transactions, Strategies, JournalEntries)
- [x] Setup Zustand store untuk state management

### 1.2 Core UI Components

- [x] Layout utama (sidebar, header)
- [x] Navigation bottom bar (mobile)
- [x] Basic shadcn/ui components (Button, Input, Card, Dialog, etc.)
- [x] Theme setup (dark/light mode)

### 1.3 Routing Structure

- [ ] `/` - Dashboard
- [ ] `/strategies` - Strategies List
- [ ] `/journal` - Journal List
- [ ] `/assets` - Asset Tracker
- [ ] `/analytics` - Analytics
- [ ] `/settings` - Settings

---

## Phase 2: Core Features (Week 3-5)

### 2.1 Asset Management

- [x] CRUD operasi untuk Asset
- [x] Form add/edit asset (symbol, name, category, exchange)
- [x] Asset list view dengan filtering
- [x] Asset detail page

### 2.2 Transaction System

- [x] CRUD operasi untuk Transaction
- [x] Form add transaction (type: BUY/SELL/SWAP)
- [x] Link transaction ke Asset
- [x] Link transaction ke Strategy (optional)
- [x] Tags support untuk transaction
- [x] Transaction history per asset

### 2.3 Holdings Calculation

- [x] Fungsi `calculateHoldings()` - hitung total kepemilikan
- [x] Fungsi `calculateAverageCost()` - hitung harga rata-rata beli
- [x] Fungsi `calculateRealizedPnL()` - hitung realized profit/loss
- [x] Auto-update saat transaction ditambah/edit/hapus

---

## Phase 3: Strategy Module (Week 6-7)

### 3.1 Strategy Management

- [x] CRUD operasi untuk Strategy
- [x] Form create strategy dengan type selection:
  - [x] DCA (Dollar Cost Averaging)
  - [x] Lump Sum
  - [x] Value Averaging
  - [x] Swing Trading
  - [x] HODL
  - [x] Rebalancing
  - [x] Custom

### 3.2 Strategy Configuration

- [x] DCA config: amount, frequency (daily/weekly/monthly)
- [x] Swing config: entry zone, take profit, stop loss
- [x] Strategy status (Active/Paused/Completed)
- [x] Link transactions ke strategy

### 3.3 Strategy Tracking

- [x] Progress tracking per strategy
- [x] Performance metrics per strategy
- [x] Strategy comparison view

---

## Phase 4: Journal Module (Week 8-9)

### 4.1 Journal Entry System

- [x] CRUD operasi untuk Journal Entry
- [x] Entry types: Pre-Trade, Post-Trade, Analysis, Note
- [x] Markdown editor untuk content
- [x] Link ke Transaction (optional)
- [x] Link ke Strategy (optional)

### 4.2 Journal Features

- [x] Tags support
- [x] Image attachments (base64 storage)
- [x] Filter dan search entries
- [x] Timeline view

---

## Phase 5: Dashboard & Analytics (Week 10-11)

### 5.1 Dashboard

- [x] Total Portfolio Value display
- [x] P&L overview (realized)
- [x] Portfolio allocation pie chart
- [x] Best/Worst performer cards
- [x] Recent transactions list
- [x] Quick action buttons

### 5.2 Analytics Module

- [x] Performance metrics:
  - [x] Total Return
  - [x] Win Rate
  - [x] Average Win vs Average Loss
- [ ] Visualizations:
  - [x] Portfolio value over time (line chart)
  - [x] Asset allocation (pie chart)
  - [ ] Return per asset (bar chart)
- [x] Period filter (7d, 30d, 90d, 1y, All time, Custom)

### 5.3 Reporting

- [x] Export ke PDF (jsPDF)
- [x] Export ke Excel (xlsx)
- [x] Monthly/Yearly report generator

---

## Documentation

- [x] README.md
- [x] User guide

---

## Future Enhancements (Post-Launch)

| Feature         | Priority | Description                             |
| --------------- | -------- | --------------------------------------- |
| Multi-currency  | High     | Support IDR, USD, dll dengan conversion |
| Watchlist       | Medium   | Track aset yang diminati tanpa holding  |
| Advanced Charts | Medium   | Candlestick, technical indicators       |
| Notifications   | Medium   | Reminder untuk DCA, price alerts        |
| Social Sharing  | Low      | Share portfolio performance             |
| Tax Report      | Low      | Helper untuk laporan pajak              |
| Cloud Sync      | Low      | Optional backup ke cloud storage        |

---

## Tech Stack Summary

| Component | Technology                 |
| --------- | -------------------------- |
| Framework | Next.js 15 (Static Export) |
| Language  | TypeScript                 |
| PWA       | next-pwa                   |
| State     | Zustand                    |
| Storage   | Dexie.js (IndexedDB)       |
| UI        | Tailwind CSS + shadcn/ui   |
| Charts    | Recharts                   |
| Forms     | React Hook Form + Zod      |
| Export    | jsPDF, xlsx                |

---

## Milestones

| Milestone              | Target  | Status         |
| ---------------------- | ------- | -------------- |
| Project Setup Complete | Week 2  | 🔄 In Progress |
| Core Features Ready    | Week 5  | ⏳ Pending     |
| All Modules Complete   | Week 11 | ⏳ Pending     |
| MVP Launch             | Week 14 | ⏳ Pending     |

---

_Dokumen ini akan diperbarui seiring perkembangan proyek._
