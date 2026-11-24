import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const language = z.enum(['en', 'es']);
const optionalUrl = z.url().optional();

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string().min(1),
      technologies: z.array(z.string().min(1)),
      coverImage: image().optional(),
      company: z.string().optional(),
      role: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().nonnegative().default(0),
      repositoryUrl: optionalUrl,
      demoUrl: optionalUrl,
      language,
      draft: z.boolean().default(true),
    }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string().min(1)).default([]),
      coverImage: image().optional(),
      language,
      draft: z.boolean().default(true),
    }),
});

export const collections = { projects, blog };
