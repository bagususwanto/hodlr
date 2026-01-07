# Hodlr - Requirements Document

## Deskripsi Aplikasi

Hodlr adalah aplikasi manajemen portfolio investasi yang membantu investor melacak, menganalisis, dan mengoptimalkan investasi mereka melalui berbagai strategi dan tools analisis.

---

## Fitur Utama

### 1. Dashboard Portfolio

Halaman utama yang menampilkan ringkasan keseluruhan portfolio.

**Fungsionalitas:**

- Melihat total nilai aset (Total Portfolio Value)
- Overview performa portfolio (P&L, ROI)
- Grafik pergerakan nilai portfolio (daily, weekly, monthly, yearly)
- Alokasi aset berdasarkan kategori/coin
- Quick stats: Best performer, Worst performer

---

### 2. Strategi Investasi

Modul untuk mengelola dan menjalankan berbagai strategi investasi.

**Jenis Strategi:**

| Strategi                        | Deskripsi                              |
| ------------------------------- | -------------------------------------- |
| **DCA (Dollar Cost Averaging)** | Investasi berkala dengan jumlah tetap  |
| **Lump Sum**                    | Investasi sekaligus dalam jumlah besar |
| **Value Averaging**             | Investasi berdasarkan target nilai     |
| **Swing Trading**               | Entry/exit dalam beberapa hari/minggu  |
| **HODL**                        | Beli dan hold jangka panjang           |
| **Rebalancing**                 | Sesuaikan alokasi portfolio berkala    |
| **Custom Strategy**             | Strategi kustom yang dibuat user       |

**Fungsionalitas:**

- Buat strategi baru dengan parameter yang dapat dikonfigurasi
- Jadwal otomatis (frequency: daily, weekly, monthly)
- Tracking progress setiap strategi
- Perbandingan performa antar strategi
- Notifikasi reminder untuk eksekusi strategi

---

### 3. Jurnal Trading

Modul pencatatan aktivitas trading dan analisis.

**Fungsionalitas:**

- Catat setiap transaksi (buy, sell, swap)
- Tambahkan notes dan analisis per transaksi
- Tag transaksi (strategy-based, impulse, news-driven, dll)
- Lampiran screenshot/gambar untuk dokumentasi
- Catatan pre-trade (alasan entry) dan post-trade (lessons learned)
- Filter dan pencarian transaksi

---

### 4. Tracker Aset

Modul monitoring holdings dan profit/loss berdasarkan data transaksi.

**Fungsionalitas:**

- Daftar semua holdings dengan detail:
  - Nama aset/coin
  - Jumlah kepemilikan (dihitung dari transaksi)
  - Harga rata-rata beli (Average Cost - dihitung dari transaksi)
  - Harga jual terakhir (dari transaksi sell terakhir)
  - Realized P&L (dari selisih buy/sell)
- Grouping berdasarkan kategori/exchange
- History perubahan holdings

> **Note:** Semua nilai dihitung otomatis dari data transaksi. Tidak ada input harga terpisah.

---

### 5. Analisis & Statistik

Modul analisis mendalam performa investasi.

**Fungsionalitas:**

- **Performance Metrics:**
  - Total Return (realized + unrealized)
  - Win Rate (persentase trade profit)
  - Average Win vs Average Loss
  - Sharpe Ratio
  - Maximum Drawdown
- **Visualisasi:**
  - Chart performa portfolio over time
  - Pie chart alokasi aset
  - Bar chart perbandingan return per aset
  - Heatmap aktivitas trading
- **Laporan:**
  - Monthly/Yearly report
  - Export ke PDF/Excel
  - Tax report helper

---

## Fitur Tambahan (Future Consideration)

- [ ] Multi-currency support (IDR, USD, dll)
- [ ] Import/Export data (JSON backup)
- [ ] Social sharing portfolio performance
- [ ] Watchlist untuk aset yang diminati

---

## Tech Stack

### Frontend Only (PWA)

- **Framework:** Next.js 15 (Static Export)
- **Language:** TypeScript
- **PWA:** next-pwa
- **State Management:** Zustand
- **Storage:**
  - Dexie.js (IndexedDB wrapper) untuk data persistence
- **UI Library:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod (validation)
- **Date:** date-fns
- **Utilities:** uuid, clsx
- **Toast:** Sonner
- **Export:** jsPDF (PDF), xlsx (Excel)

### PWA Features

- ✅ Installable (Add to Home Screen)
- ✅ Offline capable (cached assets & data)
- ✅ Responsive design (mobile-first)
- ✅ Local data storage (no backend required)
- ✅ Export/Import data sebagai JSON backup

### Data Storage Strategy

Semua data disimpan secara lokal di browser:

| Data               | Storage      |
| ------------------ | ------------ |
| Portfolio holdings | IndexedDB    |
| Transaksi/Journal  | IndexedDB    |
| Strategi investasi | IndexedDB    |
| User preferences   | LocalStorage |

---

_Dokumen ini akan terus diperbarui seiring perkembangan proyek._
