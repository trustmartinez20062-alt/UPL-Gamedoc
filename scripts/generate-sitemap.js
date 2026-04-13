import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read .env or .env.local
function getEnvDomain() {
  const paths = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env')
  ];
  
  for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/VITE_SITE_URL=(.+)/);
      if (match && match[1]) return match[1].trim().replace(/['"]/g, '');
    }
  }
  return 'https://game-doctor.vercel.app'; // Fallback
}

const DOMAIN = getEnvDomain();
const TODAY = new Date().toISOString().split('T')[0];

const routes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/juegos-digitales', priority: '0.8', changefreq: 'weekly' },
  { url: '/game-pass', priority: '0.8', changefreq: 'weekly' },
  { url: '/consolas', priority: '0.8', changefreq: 'weekly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);
console.log(`✅ Sitemap generado en ${sitemapPath} con dominio ${DOMAIN}`);

// Sync robots.txt
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsPath)) {
  let robots = fs.readFileSync(robotsPath, 'utf8');
  robots = robots.replace(/Sitemap: .+/g, `Sitemap: ${DOMAIN}/sitemap.xml`);
  fs.writeFileSync(robotsPath, robots);
  console.log(`✅ robots.txt actualizado con el nuevo Sitemap`);
}
