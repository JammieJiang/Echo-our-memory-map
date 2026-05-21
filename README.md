# Echo-our-memory-map

Built with love, fueled by friendship. May this little space keep us closer, no matter where we wander.

用代码包裹爱意，送给最珍贵的我们。愿这个小小的世界，能让我们在各奔东西的日子里，依然能紧紧抱在一起。

## Echo Map

A macaron-style memory map for three friends — record Echo footprints on a 3D globe, share whispers in **小世界**, and messages on **BB机**.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Login password: `0721`.

## 三人云存储（Supabase）

配置后，**照片、截图、头像**会存到 Supabase Storage，**Echo / 小世界 / BB机** 文字数据存数据库，三人任意手机电脑打开同一链接都能看到相同内容。

### 1. 创建 Supabase 项目

1. 打开 [https://supabase.com](https://supabase.com) 注册并新建项目  
2. **Project Settings → API** 复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key（保密）→ `SUPABASE_SERVICE_ROLE_KEY`
3. 在项目根目录创建 `.env.local`，填入上述两项（参考 `.env.example`）

### 2. 建表

在 Supabase **SQL Editor** 中执行仓库里的 [`supabase/schema.sql`](supabase/schema.sql)。

### 3. 创建图片存储桶

1. **Storage → New bucket**  
2. 名称：`echo-media`  
3. 勾选 **Public bucket**（公开读，便于三人看图）

### 4. 部署到 Vercel

在 Vercel 项目 **Environment Variables** 里添加与 `.env.local` 相同的两项变量，重新 Deploy。

未配置 Supabase 时，应用仍会退回浏览器 `localStorage`（仅本机有效）。

## Deploy

Deploy on [Vercel](https://vercel.com) by importing [this repository](https://github.com/JammieJiang/Echo-our-memory-map). Build: `npm run build`.
