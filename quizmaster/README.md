# QuizMaster Pro — India & World GK

An AI-powered general knowledge quiz app for competitive quiz training.

**Topics covered:** India & World Current Affairs, Who's Who, World Leaders, Bollywood, Sports, Dates & Events, Records & Firsts, Indian History, Polity, Science, Geography, Economy, Awards.

---

## 🚀 Deploy to Vercel (Recommended — Easiest)

### Option A: One-click via GitHub
1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Vercel auto-detects Next.js — no config needed.
4. In **Environment Variables**, add:
   ```
   ANTHROPIC_API_KEY = sk-ant-...your key here...
   ```
5. Click **Deploy**. Done — you'll get a shareable `https://your-app.vercel.app` URL.

### Option B: Vercel CLI
```bash
npm install -g vercel
cd quizmaster
npm install
vercel
# Follow prompts, then add env var:
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

---

## 🌐 Deploy to Netlify

1. Push this folder to a GitHub repo.
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from GitHub.
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. In **Site settings → Environment variables**, add:
   ```
   ANTHROPIC_API_KEY = sk-ant-...your key here...
   ```
5. Click **Deploy site**.

---

## 💻 Run Locally

```bash
cd quizmaster
npm install

# Create your env file
cp .env.example .env.local
# Edit .env.local and paste your Anthropic API key

npm run dev
# Open http://localhost:3000
```

---

## 🔑 Getting an Anthropic API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)
4. Paste it as `ANTHROPIC_API_KEY` in your deployment environment

**Note:** The API key is stored securely on the server — users of the app never see it.

---

## 📁 Project Structure

```
quizmaster/
├── pages/
│   ├── index.js          # Main quiz UI (React)
│   └── api/
│       └── questions.js  # Secure API route → calls Anthropic
├── styles/
│   └── globals.css       # Global styles & animations
├── .env.example          # Environment variable template
├── .gitignore            # Keeps your key out of git
├── next.config.js
└── package.json
```

---

## ✨ Features

- 14 quiz topics selectable per session
- 3 difficulty levels (Easy / Mixed / Hard)
- 20-second countdown timer per question
- AI generates 10 fresh questions every session — unlimited practice
- Correct answer + educational explanation revealed after each question
- Running accuracy, streak, and best-streak tracker
- Fully responsive (mobile-friendly)

---

## 📝 Notes

- Each quiz session costs a small amount of Anthropic API credits (roughly $0.01–0.02 per 10-question session using Claude Sonnet).
- Questions are AI-generated; always verify critical facts independently.
