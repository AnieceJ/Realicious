# Realicious

Realicious 是整合美食文章、餐券商城、即時聊天室與飲食記帳的餐飲生活平台。本 repository 為履歷展示用前端版本，已移除個人資料與正式服務憑證，並串接獨立部署的展示後端與資料庫。

## Online Demo

- Website: [https://realicious.vercel.app](https://realicious.vercel.app)
- Demo account: `demo@example.com`
- Demo password: `qwe123`

> 展示環境不啟用 Google OAuth、電子郵件寄送與第三方金流；請使用上方示範帳號體驗會員功能。

## Features

- 美食文章瀏覽、收藏與會員文章管理
- 餐券商城、購物車、結帳與訂單管理
- Socket.IO 即時聊天室
- 飲食與消費記帳
- 會員註冊、登入及個人資料管理

## Tech Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS / Bootstrap
- Socket.IO Client
- Vercel
- Backend: Express / Socket.IO / Prisma / MySQL on Railway

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

預設開啟 [http://localhost:3000](http://localhost:3000)。本機後端預設位於 `http://localhost:3001`，也可以在 `.env.local` 設定：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

正式環境的 API 網址由 Vercel environment variable 管理，不會提交到 Git。

## Project Background

本 repository 是由[原始團隊專案](https://github.com/wei-c-c/Realicious)整理出的履歷展示版本。履歷或面試說明時，請依實際參與內容標示個人負責範圍。
