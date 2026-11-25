// Static site generator for SublimeHR. Run: node build.mjs  → outputs ./dist
import { mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, modules, faqs, plans, industries } from "./src/data.mjs";
import * as P from "./src/pages.mjs";
import { home2 } from "./src/home2.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "static"), out, { recursive: true });

const routes = [
  ["/", P.home(), 1.0],
  ["/features/", P.features(), 0.9],
  ...modules.map((m) => [`/software/${m.slug}/`, P.moduleDetail(m), 0.8]),
  ["/industries/", P.industriesPage(), 0.8],
  ["/pricing/", P.pricing(), 0.9],
  ["/integrations/", P.integrationsPage(), 0.7],
  ["/custom-development/", P.customDev(), 0.7],
  ["/about/", P.about(), 0.6],
  ["/faq/", P.faqPage(), 0.7],
  ["/contact/", P.contact(), 0.8],
  ["/book-demo/", P.bookDemo(), 0.9],
  ["/get-pricing/", P.getPricing(), 0.8],
  ["/privacy/", P.privacy(), 0.2],
  ["/terms/", P.terms(), 0.2]
];

for (const [path, html] of routes) {
  const file = join(out, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(out, "404.html"), P.notFound());
// Design option B for the home page (not in sitemap, noindex)
mkdirSync(join(out, "home-v2"), { recursive: true });
writeFileSync(join(out, "home-v2", "index.html"), home2());

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([p, , pr]) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod><priority>${pr.toFixed(1)}</priority></url>`).join("\n")}
</urlset>
`
);

writeFileSync(
  join(out, "robots.txt"),
  `User-agent: *
Allow: /

# AI / answer-engine crawlers are welcome
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${site.url}/sitemap.xml
`
);

// llms.txt — concise, factual summary for AI answer engines (AEO/GEO)
writeFileSync(
  join(out, "llms.txt"),
  `# SublimeHR

> ${site.description}

SublimeHR is a multi-tenant, cloud-based HRMS with separate Admin/HR and Employee Self-Service panels, a native mobile app, role-based permissions, and English & Arabic (RTL) support. Website: ${site.url}. Phone/WhatsApp: ${site.phone}.

## Modules
${modules.map((m) => `- [${m.name}](${site.url}/software/${m.slug}/): ${m.summary}`).join("\n")}

## Pricing
${plans.map((p) => `- ${p.name}: ${p.price} ${p.unit} — ${p.desc}`).join("\n")}

## Industries
${industries.map((i) => `- ${i.name}: ${i.blurb}`).join("\n")}

## Key pages
- [Features](${site.url}/features/)
- [Pricing](${site.url}/pricing/)
- [Integrations](${site.url}/integrations/)
- [Custom Development](${site.url}/custom-development/)
- [FAQ](${site.url}/faq/)
- [Book a demo](${site.url}/book-demo/)
- [Get pricing](${site.url}/get-pricing/)
- [Contact](${site.url}/contact/)

## FAQ
${faqs.flatMap((g) => g.items).map(([q, a]) => `- **${q}** ${a}`).join("\n")}
`
);

writeFileSync(
  join(out, "site.webmanifest"),
  JSON.stringify(
    {
      name: "SublimeHR",
      short_name: "SublimeHR",
      start_url: "/",
      display: "standalone",
      background_color: "#FFFFFF",
      theme_color: "#2F72B8",
      icons: [{ src: "/assets/img/sublimehr-logo.png", sizes: "717x639", type: "image/png" }]
    },
    null,
    2
  )
);

console.log(`Built ${routes.length + 1} pages → dist/`);
