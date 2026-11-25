import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const language = z.enum(['en', 'es']);
const optionalUrl = z.url().optional();
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const seo = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image: z.string().optional(),
  })
  .optional();

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        slug,
        translationId: z.string().min(1),
        seo,
        description: z.string().min(1),
        category: z.string().min(1),
        projectType: z.enum(['personal', 'professional']),
        status: z.enum(['active', 'completed-contribution', 'unknown']).default('unknown'),
        experienceId: z.string().optional(),
        technologies: z.array(z.string().min(1)),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        gallery: z
          .array(
            z.object({
              image: image(),
              label: z.string().min(1),
              alt: z.string().min(1),
              url: z.url(),
            }),
          )
          .optional(),
        company: z.string().optional(),
        role: z.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        featured: z.boolean().default(false),
        order: z.number().int().nonnegative().default(0),
        presentation: z.enum(['feature', 'editorial', 'text']).default('text'),
        repositoryUrl: optionalUrl,
        demoUrl: optionalUrl,
        links: z.array(z.object({ label: z.string().min(1), url: z.url() })).optional(),
        language,
        draft: z.boolean().default(true),
      })
      .superRefine((data, ctx) => {
        if (data.coverImage && !data.coverAlt)
          ctx.addIssue({
            code: 'custom',
            path: ['coverAlt'],
            message: 'A cover image needs descriptive alternative text.',
          });
        if ('startDate' in data && data.startDate && data.endDate && data.endDate < data.startDate)
          ctx.addIssue({
            code: 'custom',
            path: ['endDate'],
            message: 'End date must follow start date.',
          });
      }),
});

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        slug,
        translationId: z.string().min(1),
        seo,
        description: z.string().min(1),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        tags: z.array(z.string().min(1)).default([]),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        language,
        draft: z.boolean().default(true),
      })
      .superRefine((data, ctx) => {
        if (data.coverImage && !data.coverAlt)
          ctx.addIssue({
            code: 'custom',
            path: ['coverAlt'],
            message: 'A cover image needs descriptive alternative text.',
          });
        if ('publishedAt' in data && data.updatedAt && data.updatedAt < data.publishedAt)
          ctx.addIssue({
            code: 'custom',
            path: ['updatedAt'],
            message: 'Updated date must follow publication date.',
          });
      }),
});

export const collections = { projects, blog };
