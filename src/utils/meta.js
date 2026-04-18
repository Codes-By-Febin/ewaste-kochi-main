/**
 * src/utils/meta.js
 * ─────────────────────────────────────────────────────────────────
 * Centralized metadata engine for EWaste Kochi.
 *
 * Why this exists:
 *   Each page previously constructed its own title/description/schema
 *   independently, making it impossible to enforce site-wide rules
 *   (e.g. max title length, canonical slash normalization, OG defaults).
 *   This module is the single source of truth for all metadata shapes.
 *
 * Usage:
 *   import { buildMetadata, buildCanonical } from '../utils/meta.js';
 *   const meta = buildMetadata({ title: 'Page Title', description: '...' });
 * ─────────────────────────────────────────────────────────────────
 */

const SITE_ORIGIN = 'https://ewastekochi.com';
const SITE_NAME = 'EWaste Kochi';
const DEFAULT_OG_IMAGE = '/img/ewaste-guide-hero.webp';
const DEFAULT_LOCALE = 'en_IN';

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;

/**
 * Normalize a URL path to always have a trailing slash
 * and ensure it is lowercase.
 * @param {string} path - Relative or absolute URL path
 * @returns {string} Normalized absolute URL
 */
export function buildCanonical(path) {
  // If already absolute, normalize it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const url = new URL(path);
    url.pathname = normalizePath(url.pathname);
    return url.toString();
  }

  // Relative path — prefix site origin
  const normalized = normalizePath(path);
  return `${SITE_ORIGIN}${normalized}`;
}

/**
 * Normalize a path: lowercase, trailing slash, no double slashes.
 * @param {string} path
 * @returns {string}
 */
function normalizePath(path) {
  let normalized = path.toLowerCase();
  // Remove duplicate slashes
  normalized = normalized.replace(/\/+/g, '/');
  // Add trailing slash if missing (unless it's a file extension)
  if (!normalized.endsWith('/') && !normalized.includes('.')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

/**
 * Build an absolute OG image URL. Accepts a relative path or
 * returns the site default.
 * @param {string} [image]
 * @returns {string}
 */
export function buildOGImage(image) {
  if (!image) return `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`;
  if (image.startsWith('http')) return image;
  return `${SITE_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`;
}

/**
 * Truncate a string to a max length with ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max - 3).trim()}...` : str;
}

/**
 * Build a BreadcrumbList array with normalized canonical URLs.
 * @param {Array<{name: string, url: string}>} crumbs
 * @returns {Array<{name: string, url: string}>}
 */
export function buildBreadcrumbs(crumbs) {
  return crumbs.map(crumb => ({
    name: crumb.name,
    url: buildCanonical(crumb.url),
  }));
}

/**
 * Core metadata builder. Accepts page-level overrides and
 * returns a complete, validated metadata object safe to pass
 * to BaseLayout.
 *
 * @param {object} opts
 * @param {string} opts.title          - Page title (will have site name appended)
 * @param {string} opts.description    - Meta description
 * @param {string} [opts.canonical]    - Explicit canonical URL (default: normalized current path)
 * @param {string} [opts.ogImage]      - OG image path
 * @param {string} [opts.ogImageAlt]   - OG image alt text
 * @param {boolean} [opts.noIndex]     - Set true for noindex pages
 * @param {'website'|'article'|'product'} [opts.pageType]
 * @param {string} [opts.publishedTime] - ISO date for articles
 * @param {string} [opts.dateModified]  - ISO date
 * @param {string[]} [opts.keywords]    - Additional keywords
 * @param {string} [opts.locale]        - og:locale override
 * @param {string} [opts.chatbotContext] - Chatbot page context
 * @returns {object} Complete metadata object for BaseLayout
 */
export function buildMetadata({
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  noIndex = false,
  pageType = 'website',
  publishedTime,
  dateModified,
  keywords,
  locale = DEFAULT_LOCALE,
  chatbotContext = 'service',
} = {}) {
  if (!title) throw new Error('[meta.js] buildMetadata: title is required');
  if (!description) throw new Error('[meta.js] buildMetadata: description is required');

  // Enforce max lengths
  const safeTitle = truncate(title, MAX_TITLE_LENGTH);
  const safeDescription = truncate(description, MAX_DESCRIPTION_LENGTH);

  // Warn in dev if title was truncated
  if (title.length > MAX_TITLE_LENGTH) {
    console.warn(`[meta.js] Title truncated (${title.length} chars): "${title}"`);
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    console.warn(`[meta.js] Description truncated (${description.length} chars)`);
  }

  return {
    title: safeTitle,
    description: safeDescription,
    canonical: canonical ? buildCanonical(canonical) : undefined, // undefined = BaseLayout auto-derives from current URL
    ogImage: buildOGImage(ogImage),
    ogImageAlt: ogImageAlt || `${SITE_NAME} - ${safeTitle}`,
    noIndex,
    pageType,
    publishedTime,
    dateModified: dateModified || new Date().toISOString().split('T')[0],
    keywords: Array.isArray(keywords) ? keywords : [],
    locale,
    chatbotContext,
  };
}

/**
 * Build a service page metadata object with sensible defaults
 * sourced from the services.js data entry.
 * @param {object} service - Full service object from services.js
 * @returns {object}
 */
export function buildServiceMetadata(service) {
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    canonical: `/services/${service.slug}/`,
    keywords: service.keywords,
    chatbotContext: 'service',
  });
}

/**
 * Build a blog post metadata object from a blog data entry.
 * @param {object} blog - Blog object from blogs.js or programmaticBlogEngine
 * @returns {object}
 */
export function buildBlogMetadata(blog) {
  return buildMetadata({
    title: blog.metaTitle || `${blog.title} | ${SITE_NAME}`,
    description: blog.metaDescription || blog.excerpt?.slice(0, 155) || blog.summary?.slice(0, 155),
    canonical: blog.canonical || `/blog/${blog.slug}/`,
    keywords: blog.keywords || [],
    pageType: 'article',
    publishedTime: blog.date,
    chatbotContext: 'blog',
  });
}

/**
 * Build a location page metadata object.
 * @param {object} location - Location object from locations.js
 * @returns {object}
 */
export function buildLocationMetadata(location) {
  return buildMetadata({
    title: `${location.heroHeadline} | ${SITE_NAME}`,
    description: `${location.heroSubline} ${location.description}`.slice(0, 155),
    canonical: `/locations/${location.slug}/`,
    chatbotContext: 'location',
  });
}
