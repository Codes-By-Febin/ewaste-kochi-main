export interface Metadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  schema?: object | object[];
  faqs?: Array<{ q: string; a: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  noIndex?: boolean;
  dateModified?: string;
  pageType?: 'website' | 'article';
  publishedTime?: string;
  keywords?: string[] | string;
  chatbotContext?: string;
}