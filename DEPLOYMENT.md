# 🚀 Unbeatable ERP — Production Deployment Guide

এই গাইডে **Unbeatable ERP** সিস্টেমটি Docker ও Docker Compose ব্যবহার করে লোকাল সার্ভার, অন-প্রিমিসিস শপ কম্পিউটার অথবা ক্লাউড VPS (DigitalOcean, AWS, Linode, Hetzner)-এ ডেপ্লয় করার পূর্ণাঙ্গ ধাপসমূহ তুলে ধরা হলো।

---

## 📋 প্রাক-প্রয়োজনীয়তা (Prerequisites)

- **Docker** (v24.0 বা তদূর্ধ্ব)
- **Docker Compose** (v2.20 বা তদূর্ধ্ব)
- ন্যূনতম সিস্টেম রিকোয়ারমেন্ট:
  - **RAM**: 2 GB (রেকমেন্ডেড 4 GB)
  - **CPU**: 2 Cores
  - **Disk Space**: 10 GB SSD

---

## ⚡ এক কমান্ডে ডেপ্লয়মেন্ট (Quick Start with 1 Command)

### ধাপ ১: প্রোজেক্ট ডিরেক্টরিতে যান
```bash
cd unbeatable-erp
```

### ধাপ ২: ডকার কনটেইনারগুলো চালু করুন
```bash
docker compose up -d --build
```

এই কমান্ডটি স্বয়ংক্রিয়ভাবে নিচের ৪টি সার্ভিস চালু করবে:
1. **`db`** — MySQL 8.0 Database Server (Port 3306, `utf8mb4_unicode_ci`)
2. **`app`** — Next.js 15 Standalone Production Server (Port 3000)
3. **`nginx`** — Nginx Reverse Proxy with Gzip & Security Headers (Port 80)
4. **`phpmyadmin`** — Visual Database Management UI (Port 8080)

---

## 🗄️ ধাপ ৩: ডেটাবেজ স্কিমা ও সিডিং (Database Setup)

কনটেইনার চালু হওয়ার পর প্রথমবার ডেটাবেজ টেবিল তৈরি ও ডেমো ডেটা সিড করার জন্য রান করুন:

```bash
# ১. ডেটাবেজ টেবিল তৈরি (Prisma DB Push)
docker compose exec app npx prisma db push

# ২. প্রারম্ভিক ক্যাটাগরি, ব্রাঞ্চ ও ইউজার সিডিং (Seed Initial Data)
docker compose exec app npm run db:seed
```

---

## 🌐 অ্যাক্সেস ইউআরএল (Application Access URLs)

| সার্ভিস | ইউআরএল | লগইন / ক্রেডেনশিয়াল |
| :--- | :--- | :--- |
| **মূল ERP অ্যাপ্লিকেশন** | `http://localhost` বা `http://YOUR_SERVER_IP` | ওনার / অ্যাডমিন অ্যাকাউন্ট |
| **ডাইরেক্ট অ্যাপ পোর্ট** | `http://localhost:3000` | ব্যাকএন্ড নোড পোর্ট |
| **phpMyAdmin GUI** | `http://localhost:8080` | ইউজার: `root` <br> পাসওয়ার্ড: `rootpassword123` |
| **MySQL Database Port** | `localhost:3306` | ডাটাবেজ: `unbeatable_erp` |

---

## 🔒 ক্লাউড ভিপিএস ও SSL / HTTPS সেটআপ (Let's Encrypt)

প্রোডাকশন ডোমেইনে (যেমন: `erp.yourdomain.com`) ফ্রি SSL সক্রিয় করতে Certbot ব্যবহার করতে পারেন:

```bash
# ১. Certbot ইনস্টল করুন
sudo apt update && sudo apt install certbot -y

# ২. স্ট্যান্ডঅ্যালোন সার্টিফিকেট জেনারেট করুন
sudo certbot certonly --standalone -d erp.yourdomain.com
```

সার্টিফিকেট ফাইলগুলো `/etc/letsencrypt/live/erp.yourdomain.com/` এ তৈরি হলে `nginx/default.conf`-এ 443 পোর্ট এনাবল করুন।

---

## 💾 ডেটাবেজ ব্যাকআপ ও রিস্টোর (Backup & Recovery)

### স্বয়ংক্রিয় ব্যাকআপ নেওয়া (Manual SQL Dump):
```bash
docker compose exec db mysqldump -u root -prootpassword123 unbeatable_erp > backup_$(date +%Y%m%d).sql
```

### ব্যাকআপ রিস্টোর করা (Restore from SQL Dump):
```bash
docker compose exec -T db mysql -u root -prootpassword123 unbeatable_erp < backup_20260925.sql
```

---

## 🛠️ দরকারি ডকার কমান্ডসমূহ

- **সকল সার্ভিস স্ট্যাটাস চেক**:
  ```bash
  docker compose ps
  ```
- **লাইভ লগ দেখা (Logs)**:
  ```bash
  docker compose logs -f app
  ```
- **সার্ভিস বন্ধ করা**:
  ```bash
  docker compose down
  ```
- **ভলিউম সহ রিসেট করা (সতর্কতা: ডেটা ডিলিট হবে)**:
  ```bash
  docker compose down -v
  ```
