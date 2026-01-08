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

- [ ] CRUD operasi untuk Journal Entry
- [ ] Entry types: Pre-Trade, Post-Trade, Analysis, Note
- [ ] Markdown editor untuk content
- [ ] Link ke Transaction (optional)
- [ ] Link ke Strategy (optional)

### 4.2 Journal Features

- [ ] Tags support
- [ ] Image attachments (base64 storage)
- [ ] Filter dan search entries
- [ ] Timeline view

---

## Phase 5: Dashboard & Analytics (Week 10-11)

### 5.1 Dashboard

- [ ] Total Portfolio Value display
- [ ] P&L overview (realized)
- [ ] Portfolio allocation pie chart
- [ ] Best/Worst performer cards
- [ ] Recent transactions list
- [ ] Quick action buttons

### 5.2 Analytics Module

- [ ] Performance metrics:
  - [ ] Total Return
  - [ ] Win Rate
  - [ ] Average Win vs Average Loss
- [ ] Visualizations:
  - [ ] Portfolio value over time (line chart)
  - [ ] Asset allocation (pie chart)
  - [ ] Return per asset (bar chart)
- [ ] Period filter (7d, 30d, 90d, 1y, All time, Custom)

### 5.3 Reporting

- [ ] Export ke PDF (jsPDF)
- [ ] Export ke Excel (xlsx)
- [ ] Monthly/Yearly report generator

---

## Phase 6: Settings & Polish (Week 12-13)

### 6.1 Data Management

- [ ] Export all data ke JSON
- [ ] Import data dari JSON backup
- [ ] Clear all data dengan konfirmasi
- [ ] Storage usage display

### 6.2 User Preferences

- [ ] Dark/Light mode toggle
- [ ] Currency preference (IDR default)
- [ ] Date format preference
- [ ] Save preferences ke LocalStorage

### 6.3 PWA Optimization

- [ ] Service worker configuration
- [ ] Offline caching strategy
- [ ] App manifest
- [ ] Install prompt
- [ ] Splash screen

---

## Phase 7: Testing & Launch (Week 14)

### 7.1 Testing

- [ ] Manual testing semua fitur
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsive testing
- [ ] PWA installation testing
- [ ] Offline mode testing

### 7.2 Bug Fixes & Polish

- [ ] Fix bugs dari testing
- [ ] Performance optimization
- [ ] UX improvements

### 7.3 Documentation

- [ ] README.md
- [ ] User guide
- [ ] Deployment guide

### 7.4 Deployment

- [ ] Build production bundle
- [ ] Deploy ke hosting (Vercel/Netlify)
- [ ] Setup custom domain (optional)

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
