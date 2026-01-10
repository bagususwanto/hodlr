# Postingan untuk Sosmed & Komunitas - Hodlr

Template postingan buat share project **Hodlr** ke berbagai komunitas.

## 1. Buat Komunitas Coding (Dev/Tech)

**Target:** Grup Facebook Programming, Twitter/X Tech, LinkedIn, Discord Developer
**Fokus:** Tech stack-nya modern (Next.js 15), arsitektur Local-First, PWA

---

**Judul/Hook:**
Nyoba bikin Local-First PWA pakai Next.js 15 + IndexedDB (tanpa database server!) 🚀

**Konten:**
Halo teman-teman dev! 👋

Baru aja selesain side project namanya **Hodlr** – aplikasi buat manage portofolio investasi yang fokus ke privasi dan ownership data.

Yang seru dari sisi teknisnya, ini app **100% client-side** & **local-first**:
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind + shadcn/ui
**Database:** Gak pake database server (Postgres/MySQL). Semua data nyimpen di browser user pake **IndexedDB** (lewat Dexie.js)
**State:** Zustand buat state management yang ringan
**PWA:** Bisa di-install di HP kayak app native

Challenge paling seru adalah gimana bikin arsitektur app yang berasa kayak web app biasa, tapi data-nya tetep persist di device masing-masing user. Gak ada tracking, gak ada data yang keluar dari browser.

Penasaran sama kodenya atau mau coba arsitekturnya?
🔗 Repo: https://github.com/bagususwanto/hodlr
🔗 Coba langsung di browser: https://hodlr-eight.vercel.app

(Star & feedback-nya sangat dihargai! ⭐)

#NextJS #TypeScript #OpenSource #LocalFirst #WebDev

---

## 2. Buat Komunitas Investasi (Crypto/Saham)

**Target:** Grup Telegram Crypto, Subreddit Investasi, Komunitas Saham
**Fokus:** Sharing pengalaman pribadi, relatable struggle

---

**Judul/Hook:**
Dari tracking portfolio pake Excel sampe akhirnya bikin app sendiri. Ternyata ini yang gua butuhin.

**Konten:**
Halo teman-teman!

Ada yang masih pake spreadsheet buat track portfolio kah? Gua dulu gitu. Awalnya simple, tapi lama-lama ribet sendiri, harus manual update harga, susah liat performance per strategy (DCA vs swing), dan paling annoying: gua suka lupa kenapa dulu beli/jual suatu coin.

Terus coba beberapa app tracker, tapi rasanya gak pas. Ada yang terlalu simple (cuma list aset), ada yang terlalu ribet (banyak fitur yang gak gua pake). Yang paling gua pengen sih ada **journaling** – biar bisa catat reasoning sebelum execute. Soalnya sering banget kan kita FOMO atau panic sell, terus ngeliat catatan lama jadi reminder "oh iya dulu gua plan-nya gini toh" 😂

Akhirnya iseng coding sendiri. Namanya **Hodlr**, konsepnya local-first (semua data di browser, pake IndexedDB), ada journaling buat catat analisa, dan bisa track strategy-specific performance.

Masih WIP sih, tapi udah gua pake sehari-hari. Kalau ada yang penasaran atau mau coba:
🔗 Repo: https://github.com/bagususwanto/hodlr
🔗 Coba langsung di browser: https://hodlr-eight.vercel.app

Open source juga, jadi silakan fork/customize sesuai needs masing-masing!

---

## 3. Umum / Singkat (Twitter/X)

**Target:** Followers umum, personal branding
**Fokus:** Casual update, ngobrol santai

---

Bikin portfolio tracker yang data-nya gak keluar dari browser sama sekali. Semua local storage pake IndexedDB.

Gak kepikiran bakal pake Next.js buat app yang full local-first, tapi ternyata bisa 🤯

Masih polish fitur journaling-nya, but it works!

🔗 Repo: https://github.com/bagususwanto/hodlr
🔗 Coba langsung di browser: https://hodlr-eight.vercel.app

#buildinpublic

---

## Tambahannya:

- **Screenshot:** 3-4 screenshot tampilan terbaik (dashboard, halaman aset, dark mode)
