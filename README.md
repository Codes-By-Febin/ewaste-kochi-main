# ♻️ EWaste Kochi: Kerala's #1 Certified ITAD & E-Waste Authority Hub

[![Production Deploy](https://github.com/CodesbyFebin/ewaste-kochi-main/actions/workflows/deploy.yml/badge.svg)](https://github.com/CodesbyFebin/ewaste-kochi-main/actions/workflows/deploy.yml)
[![AI SEO Autopilot](https://github.com/CodesbyFebin/ewaste-kochi-main/actions/workflows/ai-seo.yml/badge.svg)](https://github.com/CodesbyFebin/ewaste-kochi-main/actions/workflows/ai-seo.yml)
[![Framework: Astro 5](https://img.shields.io/badge/Framework-Astro%205-FF5D01?style=flat-square&logo=astro)](https://astro.build)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

**EWaste Kochi** is a next-generation, high-performance programmatic SEO platform designed for the circular economy. Built with **Astro 5** and augmented by **AI-driven growth operations**, this platform dominates local search intent for IT Asset Disposition (ITAD) and electronics recycling across Kerala and South India.

---

## 🚀 Performance & SEO Architecture

This repository represents a "refactored-to-scale" architecture focused on three pillars: **Crawlability, Authority, and Conversion.**

### 1. Programmatic Multilingual Hubs
The platform leverages an i18n-aware template engine serving content in three primary languages:
- **English**: Corporate & Enterprise ITAD targeting.
- **Malayalam (`/ml/`)**: Hyper-local Kerala community engagement.
- **Hindi (`/hi/`)**: Multi-state corporate talent pools in Kochi's IT parks.

*Technical Detail: Uses dynamic `hreflang` alternates and `og:locale` mapping in `BaseLayout.astro` for perfect indexing signals.*

### 2. AI SEO Autopilot
A proprietary Python-based intelligence layer (`/automation/`) that:
- **Pulls Real-Time GSC Data**: Analyzes impressions, clicks, and CTR.
- **Detects "Striking Distance" Pages**: Identifies keywords in positions 4–12 for automated boost recommendations.
- **Auto-Fixes Low CTR**: Suggests title and meta rewrites based on real performance patterns.
- **Weekly Automated Audits**: Deploys Pull Requests with growth recommendations every Sunday.

### 3. Lead-Gen Conversion Layer
- **Instant Eligibility Calculator**: Real-time logic determining free pickup eligibility.
- **WhatsApp Qualification Bot**: Deep-linked CTA buttons with pre-filled, high-intent context.
- **Accessibility First**: Integrated `SpeechReader` engine for "Listen to Compliance" functionality on all money pages.

---

## 🛠️ Elite Tech Stack

- **Frontend**: [Astro 5](https://astro.build) (Island Architecture for Zero-JS baseline).
- **Styling**: Vanilla CSS with premium design tokens (Dark Mode optimized).
- **Infrastructure**: [Vercel](https://vercel.com) (Serverless edge functions & Image optimization).
- **Automation**: Python 3.10+, Google Search Console API, OpenAI/Gemini for metadata generation.
- **CI/CD**: GitHub Actions for one-command "Zero-Touch" production pushes.

---

## 📂 Project Structure

```bash
├── automation/          # AI SEO Autopilot & GSC Data connectors
├── scripts/             # Pro-Deploy & Programmatic generation utilities
├── src/
│   ├── components/      # Modular UI (HomeTemplate, ServicePageTemplate)
│   ├── data/            # Pillar Service & Location taxonomy
│   ├── i18n/            # Multilingual dictionary & UI keys
│   ├── layouts/         # Master SEO Layout (BaseLayout)
│   └── pages/           # Dynamic & Static routes
├── public/              # Optimized brand assets & PWA manifest
└── astro.config.mjs      # Advanced i18n & Sitemap configuration
```

---

## ⚙️ Setup & Deployment

### Local Development
```bash
npm install
npm run dev
```

### Pro Deployment
Execute the hardened deployment pipeline for a production push with safety backups:
```bash
npm run pro-deploy
```

### AI SEO Audit
Run the autopilot engine in dry-run mode to see growth opportunities:
```bash
npm run autopilot -- --dry-run
```

---

## 📬 Contact & Compliance

**EWaste Kochi** is KSPCB authorized and NIST 800-88 compliant.
- **Founder**: Febin Francis
- **Live Platform**: [ewastekochi.com](https://ewastekochi.com)
- **Market**: Kochi, Ernakulam, Kerala, India.

---

*“Turning electronic waste into a digital-first circular economy.”*
