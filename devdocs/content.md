# Content Structure

## Directory Layout

```
content/
├── en/                         # English (default locale)
│   ├── index.md                # /en landing page
│   ├── aboutme.md              # /en/aboutme
│   ├── 1.getting-started/      # Numbered prefix = nav order
│   │   ├── 2.introduction.md
│   │   └── 3.markdown.md
│   ├── 2.gpl/                  # General Programming Languages
│   │   ├── 301.python.md
│   │   └── 302.java.md
│   ├── 3.dev/                  # DevOps / Infrastructure
│   │   ├── 201.git.md
│   │   ├── 202.linux.md
│   │   ├── 203.docker.md
│   │   ├── 204.kubernetes.md
│   │   ├── 205.ide.md
│   │   ├── 206.sql.md
│   │   ├── 207.system-design.md
│   │   ├── 209.dns.md
│   │   ├── 210.devops.md
│   │   ├── 211.dotnet.md
│   │   └── 212.aws.md
│   ├── 4.web/                  # Web Development
│   │   ├── 103.web-structure.md
│   │   ├── 104.responsive-web-design.md
│   │   ├── 105.three-js.md
│   │   ├── 106.php.md
│   │   ├── 107.vue.md
│   │   ├── 108.javascript.md
│   │   ├── 109.api.md
│   │   ├── 110.express.md
│   │   ├── 111.production.md
│   │   ├── 112.react.md
│   │   ├── 113.tailwind-css.md
│   │   ├── 114.seo.md
│   │   ├── 115.browser.md
│   │   └── 116.web3.md
│   ├── 5.cs/                   # Computer Science
│   └── 6.miscellaneous/
└── fr/                         # French (partial translation)
    ├── index.md
    ├── 1.getting-started/
    └── 2.essentials/
```

## Naming Convention

- Directories and files are **prefixed with numbers** to control nav sort order
- The number prefix is stripped from displayed titles and URLs
- Example: `3.dev/202.linux.md` → URL `/en/dev/linux`

## Frontmatter

Standard Docus frontmatter:
```yaml
---
title: Page Title
description: Short description for meta/SEO
---
```

## MDC Components Available

| Component | Usage | Notes |
|-----------|-------|-------|
| `::mermaid` | `::mermaid{name="x"}` | Pre-generated SVG; see `devdocs/mermaid.md` |
| `<BrowserFrame>` | Wraps content in a browser chrome UI | |
| `<Three>` / `<ThreeDemo>` | Three.js 3D scene embeds | |
| `<MorphingGradient>` | Animated gradient background | |
| `<AboutMeSection>` | About-me component | Used on `aboutme.md` |

## Math

KaTeX is enabled. Use standard LaTeX syntax:
- Inline: `$E = mc^2$`
- Block: `$$\sum_{i=0}^n i$$`

Plugins: `remark-math` (parse) + `rehype-katex` (render).

## i18n

- Default locale: `en`
- Second locale: `fr` (partial content)
- `@nuxtjs/i18n` handles routing (`/en/...`, `/fr/...`)
- Route `/` redirects to `/en`

## Blog

`content/blog/` — separate blog section (currently has `1.ese.md`). Not in the main nav structure.
