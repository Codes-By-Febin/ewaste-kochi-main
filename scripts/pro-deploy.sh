#!/bin/bash
set -e

SITE="https://ewaste-kochi-main.vercel.app"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP="backup-$DATE"

echo "🚀 Starting Pro Deploy..."

echo "📦 Build Test"
# Using --legacy-peer-deps to avoid issues with potential old node versions if run locally
npm install
npm run build

echo "🛟 Backup ZIP"
mkdir -p backups
zip -r backups/$BACKUP.zip . -x "node_modules/*" ".git/*" "backups/*" ".vercel/*"

echo "📝 Git Commit"
git add .
git commit -m "Deploy $DATE" || true
git push origin main

echo "☁️ Deploy to Vercel"
vercel --prod

echo "📡 Ping Sitemap"
curl "https://www.google.com/ping?sitemap=$SITE/sitemap-index.xml" || true

echo "🔎 Lighthouse"
if command -v lighthouse &> /dev/null
then
 lighthouse $SITE --quiet --chrome-flags="--headless" --output html --output-path ./lighthouse-$DATE.html
fi

echo "📲 WhatsApp Health Check"
curl -I $SITE | grep 200 || true

echo "✅ Deploy Complete"
echo "🌐 $SITE"
