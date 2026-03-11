# 倉儲管理系統 (616 Storage System)

這是一個完整的倉儲與營運管理系統，包含後端 API (Node.js/TypeScript) 與前端介面 (Vue.js)。本系統主要用於管理門店、商品、庫存、訂單及菜單授權等功能。

## 項目結構

```text
616_storage_system/
├── api-v2/             # 後端 API 服務 (Node.js + TypeScript + TypeORM)
│   ├── src/            # 源代碼
│   │   ├── controllers/# 控制層 (處理請求邏輯)
│   │   ├── entity/     # 數據庫實體 (TypeORM Entities)
│   │   ├── middleware/ # 中間件 (Auth, Rate Limiter)
│   │   ├── models/     # 模型層 (數據操作邏輯)
│   │   ├── routes/     # 路由定義
│   │   └── utils/      # 工具類
│   └── sql/            # 數據庫初始化腳本
└── ui/                 # 前端介面 (Vue 3 + Element Plus)
    ├── src/
    │   ├── components/ # 通用組件
    │   ├── request/    # API 請求封裝 (Axios)
    │   ├── store/      # 狀態管理 (Vuex)
    │   ├── views/      # 頁面視圖
    │   └── utils/      # 前端工具類
```

## 技術棧

### 後端 (api-v2)
- **框架**: Express.js
- **語言**: TypeScript
- **ORM**: TypeORM
- **數據庫**: MySQL
- **安全性**: JWT (身份驗證), Helmet (安全標頭), Rate Limiter (限流)
- **日誌**: Winston

### 前端 (ui)
- **框架**: Vue 3
- **UI 庫**: Element Plus
- **狀態管理**: Vuex
- **路由**: Vue Router
- **數據可視化**: ECharts
- **文件處理**: XLSX (Excel 導出), JSZip, File-Saver

## 核心功能

- **成員管理**: 用戶註冊、登錄、權限控制。
- **門店管理**: 管理門店信息及其關聯產品。
- **產品與庫存管理**: 商品信息維護、庫存跟蹤、分區管理。
- **訂單管理**: 訂單創建、詳情查詢、狀態跟蹤。
- **菜單與授權**: 動態菜單配置、權限細粒度管理。
- **數據報表**: 使用 ECharts 進行數據分析與展示。
- **文件操作**: 支持 Excel 導出與文件上傳。

## 快速開始

### 後端啟動 (api-v2)

1. 進入目錄：`cd api-v2`
2. 安裝依賴：`npm install`
3. 配置環境變量：在 `api-v2` 目錄下創建 `.env` 文件並填寫數據庫配置：
   ```env
   HOST=localhost
   DATABASE_USER=your_user
   DATABASE_PASSWORD=your_password
   DATABASE=616_storage
   MY_SECRET=your_jwt_secret
   ```
4. 初始化數據庫：使用 `sql/initApi.sql` 導入系統配置。
5. 開發模式啟動：`npm run dev`

### 前端啟動 (ui)

1. 進入目錄：`cd ui`
2. 安裝依賴：`npm install`
3. 啟動開發服務器：`npm run dev`
4. 訪問地址：`http://localhost:8080` (默認)

## 部署

- **後端**: 使用 PM2 進行進程管理 (`npm run prod`)。
- **前端**: `npm run build` 生成靜態文件，部署至 Nginx 或 Node.js 服務。
