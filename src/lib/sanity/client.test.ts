import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProjects, fetchProjectBySlug, fetchPosts, fetchPostBySlug } from './client';

describe('Sanity Client Data Adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.SANITY_PROJECT_ID;
  });

  it('falls back cleanly to local data.ts projects when unconfigured', async () => {
    const projects = await fetchProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty('title');
    expect(projects[0]).toHaveProperty('slug');
    expect(projects[0]).toHaveProperty('summary');
    expect(projects[0]).toHaveProperty('body');
  });

  it('resolves project by slug from local fallback data', async () => {
    const project = await fetchProjectBySlug('nielai-infrastructure');
    expect(project).not.toBeNull();
    expect(project?.title).toBe('NielAI Infrastructure');
    expect(project?.category).toBe('Infrastructure');
  });

  it('returns null for an invalid project slug', async () => {
    const project = await fetchProjectBySlug('non-existent-project-slug');
    expect(project).toBeNull();
  });

  it('returns empty posts array when Sanity is unconfigured', async () => {
    const posts = await fetchPosts();
    expect(posts).toEqual([]);
  });

  it('returns null for post by slug when Sanity is unconfigured', async () => {
    const post = await fetchPostBySlug('any-post-slug');
    expect(post).toBeNull();
  });
});
