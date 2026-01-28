# Fajar Budi Cahyanto - Portfolio

Personal portfolio website showcasing AI infrastructure architecture expertise and projects.

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Matter.js** - Physics animations

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

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
PHONE_NUMBER=+1234567890

# Social Media Links
GITHUB_URL=https://github.com/yourusername
LINKEDIN_URL=https://linkedin.com/in/yourusername

```

### GitHub Actions Secrets

For deployment, add these secrets to your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `IS_AVAILABLE_FOR_HIRE`
   - `CONTACT_EMAIL`
   - `GITHUB_URL`
   - `LINKEDIN_URL`
   - `PHONE_NUMBER`
   - `FULL_NAME`
   - `JOB_TITLE`

## Deployment

Automatically deploys to GitHub Pages on push to main branch via GitHub Actions.

Live site: https://fajarbc.github.io/fajarbc.github.io/