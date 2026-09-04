import { ProjectSchema, type Project } from '@/src/sanity/schemas/project';
import { PostSchema, type Post } from '@/src/sanity/schemas/post';
import { projects as fallbackProjects } from '@/data';
import { z } from 'zod';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'dummy';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.SANITY_API_VERSION || 'v2024-01-01';

const CDN_BASE = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Map existing local data.ts projects into the standard Sanity Project schema
function mapLocalProjects(): Project[] {
  return fallbackProjects.map((p, idx) => ({
    _id: `local-${idx}`,
    title: p.title,
    slug: slugify(p.title),
    summary: p.description,
    category: p.category,
    tags: p.tags,
    link: p.link,
    featured: idx < 4,
    body: [
      {
        _type: 'block',
        _key: 'b1',
        children: [{ _type: 'span', _key: 's1', text: p.description }],
      },
    ],
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  if (!process.env.SANITY_PROJECT_ID) {
    return mapLocalProjects();
  }

  const query = encodeURIComponent(`*[_type == "project"] | order(featured desc, _createdAt desc)`);
  try {
    const res = await fetch(`${CDN_BASE}?query=${query}`);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.statusText}`);
    const json = await res.json();
    return z.array(ProjectSchema).parse(json.result);
  } catch (err) {
    console.warn('Falling back to local projects data:', err);
    return mapLocalProjects();
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!process.env.SANITY_PROJECT_ID) {
    const local = mapLocalProjects();
    return local.find((p) => p.slug === slug) || null;
  }

  const query = encodeURIComponent(`*[_type == "project" && slug.current == "${slug}"][0]`);
  try {
    const res = await fetch(`${CDN_BASE}?query=${query}`);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.statusText}`);
    const json = await res.json();
    if (!json.result) return null;
    return ProjectSchema.parse(json.result);
  } catch (err) {
    console.warn(`Falling back to local project for slug ${slug}:`, err);
    const local = mapLocalProjects();
    return local.find((p) => p.slug === slug) || null;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  if (!process.env.SANITY_PROJECT_ID) {
    return [];
  }

  const query = encodeURIComponent(`*[_type == "post"] | order(publishedAt desc)`);
  try {
    const res = await fetch(`${CDN_BASE}?query=${query}`);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.statusText}`);
    const json = await res.json();
    return z.array(PostSchema).parse(json.result);
  } catch (err) {
    console.warn('Falling back to empty posts array:', err);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.SANITY_PROJECT_ID) {
    return null;
  }

  const query = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]`);
  try {
    const res = await fetch(`${CDN_BASE}?query=${query}`);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.statusText}`);
    const json = await res.json();
    if (!json.result) return null;
    return PostSchema.parse(json.result);
  } catch (err) {
    console.warn(`Error fetching post for slug ${slug}:`, err);
    return null;
  }
}
