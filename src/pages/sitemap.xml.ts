import { site } from '@config/site';
import { publishedPosts, publishedProjects } from '@lib/content';
import type { APIRoute } from 'astro';
export const GET: APIRoute = async () => {
  const projects = await publishedProjects();
  const posts = await publishedPosts();
  const routes = [
    '/',
    '/projects/',
    '/experience/',
    '/certifications/',
    '/about/',
    '/contact/',
    ...projects.map((p) => `/projects/${p.data.slug}/`),
    ...(posts.length ? ['/blog/', ...posts.map((p) => `/blog/${p.data.slug}/`)] : []),
  ];
  const escapeXml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${escapeXml(new URL(path, site.url).href)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
