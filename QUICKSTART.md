# 🚀 QUICK START GUIDE

## Step-by-Step Setup on Your Local Laptop

### 1️⃣ Prerequisites
Make sure you have installed:
- **Node.js 18+** (Download from https://nodejs.org)
- **npm** (comes with Node.js)
- **OpenAI API Key** (Get from https://platform.openai.com/api-keys)

Check your versions:
```bash
node --version   # Should be 18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```

---

### 2️⃣ Installation Steps

**Open Terminal/Command Prompt and navigate to the project folder:**

```bash
cd vision-rag-nextjs
```

**Install all dependencies:**
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI SDK
- Lucide Icons
- And all other dependencies

**Wait for installation to complete** (may take 2-3 minutes)

---

### 3️⃣ Run Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000
- Ready in 2.1s
```

---

### 4️⃣ Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

---

### 5️⃣ Configure API Key

1. Click **"Configuration"** in the sidebar
2. Enter your OpenAI API key (starts with `sk-...`)
3. Click **"Save & Return"**

---

### 6️⃣ Upload PDF and Start Chatting

1. Click or drag a PDF file into the upload area
2. Wait for upload confirmation
3. Ask questions about your PDF!

**Try sample questions:**
- "What is the main topic of this document?"
- "Summarize the key findings from the tables"
- "What does the chart on page 3 show?"

---

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint code checker |

---

## 🐛 Troubleshooting

### Problem: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules if exists
rm -rf node_modules package-lock.json

# Install again
npm install
```

### Problem: Port 3000 already in use
**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```
Then visit http://localhost:3001

### Problem: TypeScript errors
**Solution:**
```bash
# Rebuild TypeScript
npm run build
```

### Problem: Tailwind styles not loading
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🎯 Expected Folder Structure After Installation

```
vision-rag-nextjs/
├── node_modules/          ← Created after npm install
├── .next/                 ← Created when you run dev server
├── app/
│   ├── api/chat/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── package-lock.json      ← Created after npm install
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

---

## 🔒 Security Notes

- Your OpenAI API key is stored **locally in browser state only**
- API key is **never saved to disk or database**
- API key is only sent to OpenAI's servers (via your backend API route)
- Close browser tab to clear the API key from memory

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Navigated to project folder
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` successfully
- [ ] Opened http://localhost:3000 in browser
- [ ] Entered OpenAI API key in settings
- [ ] Uploaded a test PDF
- [ ] Asked a question and got response

---

## 🎉 You're Ready!

If you see the gradient landing page with blue/purple colors and can upload PDFs, you're all set!

**Need help?** Check the full README.md file or create an issue.

---

**Enjoy your multimodal PDF analyzer! 🚀**
