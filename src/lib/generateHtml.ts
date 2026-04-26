import { LandingPageData } from "@/components/landing-page/Renderer";

const ICON_SVG: Record<string, string> = {
  Zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  Shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  Globe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  Rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  Star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  CheckCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  TrendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  Users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

function escHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateHtml(data: LandingPageData | string, title = "Landing Page"): string {
  if (typeof data === "string") {
    return data;
  }

  const { hero, features, testimonials, pricing, cta } = data;

  /* ── Hero ──────────────────────────────────────────── */
  const heroHtml = `
<section class="hero">
  <div class="hero-glow hero-glow-top"></div>
  <div class="hero-glow hero-glow-bottom"></div>
  <div class="container hero-inner">
    <h1>${escHtml(hero.headline)}</h1>
    <p>${escHtml(hero.subheadline)}</p>
    <div class="hero-buttons">
      <a href="#" class="btn btn-primary">${escHtml(hero.ctaText)}</a>
      <a href="#" class="btn btn-ghost">Learn more</a>
    </div>
  </div>
</section>`;

  /* ── Features ─────────────────────────────────────── */
  const featureCards = features.map((f) => {
    const svg = ICON_SVG[f.iconName] ?? ICON_SVG.CheckCircle;
    return `
    <div class="feature-card">
      <div class="feature-icon">${svg}</div>
      <h3>${escHtml(f.title)}</h3>
      <p>${escHtml(f.description)}</p>
    </div>`;
  }).join("\n");

  const featuresHtml = `
<section class="features">
  <div class="container">
    <div class="section-header">
      <h2>Everything you need</h2>
      <p>Powerful features designed to help you succeed.</p>
    </div>
    <div class="features-grid">
${featureCards}
    </div>
  </div>
</section>`;

  /* ── Testimonials ─────────────────────────────────── */
  let testimonialsHtml = "";
  if (testimonials && testimonials.length > 0) {
    const cards = testimonials.map((t) => `
    <div class="testimonial-card">
      <blockquote>"${escHtml(t.content)}"</blockquote>
      <figcaption>
        <div class="avatar">${escHtml(t.name.charAt(0))}</div>
        <div>
          <div class="author-name">${escHtml(t.name)}</div>
          <div class="author-role">${escHtml(t.role)}</div>
        </div>
      </figcaption>
    </div>`).join("\n");

    testimonialsHtml = `
<section class="testimonials">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Testimonials</span>
      <h2>Loved by builders worldwide</h2>
    </div>
    <div class="testimonials-grid">
${cards}
    </div>
  </div>
</section>`;
  }

  /* ── Pricing ──────────────────────────────────────── */
  let pricingHtml = "";
  if (pricing && pricing.length > 0) {
    const tiers = pricing.map((tier) => {
      const featureItems = tier.features.map((f) => `
        <li>${ICON_SVG.CheckCircle}<span>${escHtml(f)}</span></li>`).join("\n");
      return `
    <div class="pricing-card${tier.isPopular ? " popular" : ""}">
      ${tier.isPopular ? `<span class="popular-badge">Most popular</span>` : ""}
      <h3>${escHtml(tier.plan)}</h3>
      <p class="price">${escHtml(tier.price)}</p>
      <a href="#" class="btn ${tier.isPopular ? "btn-primary" : "btn-ghost-dark"}">Get started</a>
      <ul class="pricing-features">
${featureItems}
      </ul>
    </div>`;
    }).join("\n");

    pricingHtml = `
<section class="pricing">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Pricing</span>
      <h2>Plans for teams of all sizes</h2>
      <p>Choose an affordable plan that's packed with the best features.</p>
    </div>
    <div class="pricing-grid">
${tiers}
    </div>
  </div>
</section>`;
  }

  /* ── CTA ──────────────────────────────────────────── */
  const ctaHtml = `
<section class="cta">
  <div class="container cta-inner">
    <h2>${escHtml(cta.headline)}</h2>
    <p>${escHtml(cta.subheadline)}</p>
    <a href="#" class="btn btn-primary">${escHtml(cta.buttonText)}</a>
  </div>
</section>`;

  /* ── CSS ──────────────────────────────────────────── */
  const css = `
/* ── Reset & Base ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; background: #fff; line-height: 1.6; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; }

/* ── Utilities ────────────────────────────────────────── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-header h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin-bottom: .75rem; }
.section-header p { font-size: 1.125rem; color: #64748b; max-width: 600px; margin: 0 auto; }
.section-label { display: inline-block; font-size: .875rem; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: .1em; margin-bottom: .75rem; }

/* ── Buttons ──────────────────────────────────────────── */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: .75rem 2rem; border-radius: 9999px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all .2s ease; border: none; }
.btn-primary { background: #6366f1; color: #fff; box-shadow: 0 4px 24px rgba(99,102,241,.35); }
.btn-primary:hover { background: #818cf8; box-shadow: 0 6px 32px rgba(99,102,241,.5); transform: translateY(-1px); }
.btn-ghost { background: rgba(255,255,255,.12); color: #fff; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.2); }
.btn-ghost:hover { background: rgba(255,255,255,.2); }
.btn-ghost-dark { background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.15); border-radius: 8px; border-radius: .5rem; padding: .6rem 1.5rem; font-size: .9375rem; }
.btn-ghost-dark:hover { background: rgba(255,255,255,.15); }

/* ── Hero ─────────────────────────────────────────────── */
.hero { position: relative; background: #0f172a; padding: 7rem 1.5rem 9rem; text-align: center; overflow: hidden; }
.hero-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(100px); pointer-events: none; }
.hero-glow-top { top: -10rem; right: -10rem; background: rgba(99,102,241,.3); }
.hero-glow-bottom { bottom: -10rem; left: -10rem; background: rgba(59,130,246,.3); }
.hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
.hero h1 { font-size: clamp(2.25rem, 6vw, 4rem); font-weight: 900; letter-spacing: -0.03em; color: #fff; line-height: 1.1; margin-bottom: 1.5rem; }
.hero p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
.hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* ── Features ─────────────────────────────────────────── */
.features { background: #f8fafc; padding: 6rem 1.5rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.feature-card { background: #fff; border-radius: 1.25rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; transition: all .2s ease; }
.feature-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,.1); transform: translateY(-4px); }
.feature-icon { width: 2.5rem; height: 2.5rem; color: #6366f1; margin-bottom: 1rem; }
.feature-icon svg { width: 100%; height: 100%; }
.feature-card h3 { font-size: 1.0625rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
.feature-card p { font-size: .9375rem; color: #64748b; line-height: 1.7; }

/* ── Testimonials ─────────────────────────────────────── */
.testimonials { background: #fff; padding: 6rem 1.5rem; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.testimonial-card { background: #f8fafc; border-radius: 1.25rem; padding: 2rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; }
.testimonial-card blockquote { font-size: .9375rem; color: #1e293b; line-height: 1.75; margin-bottom: 1.5rem; font-style: italic; }
.testimonial-card figcaption { display: flex; align-items: center; gap: .75rem; }
.avatar { width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #e0e7ff; color: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
.author-name { font-weight: 600; font-size: .9375rem; color: #0f172a; }
.author-role { font-size: .875rem; color: #64748b; }

/* ── Pricing ──────────────────────────────────────────── */
.pricing { background: #0f172a; padding: 6rem 1.5rem; }
.pricing .section-header h2 { color: #fff; }
.pricing .section-header p { color: #94a3b8; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
.pricing-card { position: relative; border-radius: 1.5rem; padding: 2.5rem; border: 1px solid rgba(255,255,255,.1); transition: all .2s ease; }
.pricing-card:hover { background: rgba(255,255,255,.06); }
.pricing-card.popular { border: 2px solid #6366f1; background: rgba(255,255,255,.05); }
.popular-badge { position: absolute; top: -1rem; right: 1.5rem; background: #6366f1; color: #fff; font-size: .8125rem; font-weight: 600; padding: .3rem .9rem; border-radius: 9999px; }
.pricing-card h3 { font-size: 1.125rem; font-weight: 700; color: #fff; margin-bottom: .5rem; }
.pricing-card .price { font-size: 2.5rem; font-weight: 900; color: #fff; margin: 1rem 0 1.5rem; letter-spacing: -0.03em; }
.pricing-features { list-style: none; margin-top: 2rem; display: flex; flex-direction: column; gap: .75rem; }
.pricing-features li { display: flex; align-items: center; gap: .625rem; font-size: .9375rem; color: #94a3b8; }
.pricing-features li svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; color: #818cf8; }

/* ── CTA ──────────────────────────────────────────────── */
.cta { background: #eef2ff; padding: 6rem 1.5rem; text-align: center; }
.cta-inner { max-width: 640px; margin: 0 auto; }
.cta h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: #0f172a; margin-bottom: 1rem; letter-spacing: -0.02em; }
.cta p { font-size: 1.125rem; color: #475569; margin-bottom: 2.5rem; }

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 5rem 1rem 6rem; }
  .features, .testimonials, .pricing, .cta { padding: 4rem 1rem; }
}
`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(hero.subheadline)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
${heroHtml}
${featuresHtml}
${testimonialsHtml}
${pricingHtml}
${ctaHtml}
</body>
</html>`;
}
