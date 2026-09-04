/**
 * migrate-projects.ts
 *
 * One-shot migration script that reads the existing local project data and
 * produces Sanity Mutation payloads that can be POSTed to
 * https://<projectId>.api.sanity.io/v<apiVersion>/data/import/<dataset>.
 *
 * Usage:
 *   npx tsx scripts/migrate-projects.ts > sanity-mutations.ndjson
 *   curl -X POST \
 *     -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN" \
 *     -H "Content-Type: application/x-ndjson" \
 *     --data-binary @sanity-mutations.ndjson \
 *     "https://$SANITY_PROJECT_ID.api.sanity.io/v2024-01-01/data/import/$SANITY_DATASET?visibility=sync"
 */

import { projects } from '../data';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const writeToken = process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';

if (!writeToken || !projectId) {
  console.error('Missing required env vars: SANITY_API_WRITE_TOKEN, SANITY_PROJECT_ID.');
  console.error('See .env.example for details.');
  process.exit(1);
}

const mutations = projects.map((project, idx) => ({
  createOrReplace: {
    _id: `imported-project-${idx}`,
    _type: 'project',
    title: project.title,
    slug: { _type: 'slug', current: slugify(project.title) },
    summary: project.description,
    category: project.category,
    tags: project.tags,
    link: project.link,
    featured: idx < 4,
    body: [
      {
        _type: 'block',
        _key: 'b1',
        children: [{ _type: 'span', _key: 's1', text: project.description }],
        markDefs: [],
      },
    ],
  },
}));

process.stdout.write(mutations.map((m) => JSON.stringify(m)).join('\n'));
process.stderr.write(`\n\nWrote ${mutations.length} project mutations to stdout. Pipe to a file or directly POST to Sanity.\n`);
