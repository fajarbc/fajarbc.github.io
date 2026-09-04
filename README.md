# Fajar Budi Cahyanto - Portfolio

Personal portfolio website showcasing AI infrastructure architecture expertise and projects.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 6** - Build tool
- **Tailwind CSS 4** - Styling
- **Wouter** - Lightweight client-side routing (~1.5kB)
- **@portabletext/react** - Rich text rendering
- **Zod** - Runtime schema validation
- **Lucide React** - Icons
- **Matter.js** - Physics animations

## Routes

| Path | Page | Description |
| --- | --- | --- |
| `/` | Home | Single-page scroll portfolio |
| `/work` | Projects Archive | Filterable project list |
| `/work/:slug` | Project Detail | Portable Text case study |
| `/writing` | Writing Archive | Technical articles |
| `/writing/:slug` | Article Detail | Portable Text article reader |

## Sanity CMS Setup

The portfolio reads projects and articles from Sanity via a lightweight client
in `src/lib/sanity/client.ts`. Without env configuration it falls back to local
`data.ts` seed content, so the site builds cleanly offline.

### 1. Create a Sanity project

- Sign up at https://www.sanity.io/manage and create a new project (Free tier OK).
- Note the **Project ID** from the dashboard.
- Create a dataset (default name `production`, public visibility).

### 2. Define schemas in Sanity Studio

The expected schemas are documented as Zod validators in `src/sanity/schemas/`:

- `project` (`author.ts`, `project.ts`, `post.ts`) — title, slug, summary, role,
  dates, category, tags, link, featured, cover image, body (Portable Text).
- `post` — title, slug, excerpt, publishedAt, updatedAt, tags, cover image,
  related projects, body.
- `author` — name, role, avatar.

If you mount a Sanity Studio in a separate folder, mirror these field names.

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```bash
SANITY_PROJECT_ID=xxxxxxxxxxxx
SANITY_DATASET=production
SANITY_API_VERSION=v2024-01-01
# Optional: SANITY_API_READ_TOKEN (only for private datasets; NEVER expose in client)
```

### 4. Migrate existing projects

```bash
SANITY_API_WRITE_TOKEN=xxxxx SANITY_PROJECT_ID=xxxxx \
  npx tsx scripts/migrate-projects.ts > mutations.ndjson

curl -X POST \
  -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN" \
  -H "Content-Type: application/x-ndjson" \
  --data-binary @mutations.ndjson \
  "https://$SANITY_PROJECT_ID.api.sanity.io/v2024-01-01/data/import/$SANITY_DATASET?visibility=sync"
```

### 5. GitHub Pages SPA Routing

`public/404.html` is committed so deep links (e.g. `/work/nielai-infrastructure`)
redirect through GitHub Pages' 404 into the SPA's router. Do not delete it.

### 6. CORS / Project Configuration

- Sanity CDN (`*.apicdn.sanity.io`) is CORS-open, so no whitelist is required
  for client-side reads.
- For private datasets, configure a CORS origin in Sanity Manage → API → CORS
  to include your production domain (e.g. `https://fajarbc.com`).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Deploy to GitHub Pages
npm run deploy
```

## Environment Variables

Create `.env.local` file in the root directory (see `.env.example` for template):

```bash
# Availability Status
IS_AVAILABLE_FOR_HIRE=false

# Personal Information
FULL_NAME=Your Full Name
JOB_TITLE=Your Job Title

# Contact Information
CONTACT_EMAIL=your.email@example.com

# Social Media Links
URL_GITHUB=https://github.com/yourusername
LINKEDIN_URL=https://linkedin.com/in/yourusername

# Sanity CMS
SANITY_PROJECT_ID=
SANITY_DATASET=production
```

### GitHub Actions Secrets

For deployment, add these secrets to your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `IS_AVAILABLE_FOR_HIRE`
   - `CONTACT_EMAIL`
   - `URL_GITHUB`
   - `LINKEDIN_URL`
   - `FULL_NAME`
   - `JOB_TITLE`
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET`

## Deployment

Automatically deploys to GitHub Pages on push to main branch via GitHub Actions.

Live site: https://fajarbc.com/