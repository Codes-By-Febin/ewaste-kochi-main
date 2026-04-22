import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    priority: z.number().min(0).max(1).default(0.7),
    canonical: z.string().url().optional(),
    published: z.date(),
  }),
});

const buyback = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    brand: z.enum(['dell','hp','lenovo','apple','samsung','oneplus']),
    priority: z.number().default(0.6),
    canonical: z.string().url().optional(),
    published: z.date(),
  }),
});

const locations = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    area: z.string(),
    pincode: z.string().optional(),
    priority: z.number().default(0.7),
    canonical: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('EWaste Kochi Team'),
    published: z.date(),
    canonical: z.string().url().optional().or(z.literal('')),
    priority: z.number().default(0.6),
  }),
});

export const collections = { services, buyback, locations, blog };
