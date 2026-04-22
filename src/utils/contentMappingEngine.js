// Content Mapping Engine - Map all generated content to Astro content collections structure
class ContentMappingEngine {
  constructor() {
    this.contentStructure = {
      services: {
        path: 'src/content/services',
        files: [
          'sell-old-laptop-kochi.md',
          'corporate-e-waste-pickup-kochi.md', 
          'bulk-it-asset-disposal-kochi.md',
          'laptop-recycling.md',
          'data-destruction.md',
          'itad-services.md'
        ]
      },
      blog: {
        path: 'src/content/blog',
        files: [
          'sell-vs-recycle-laptop-kochi.md',
          'local-scrap-dealer-vs-authorized-recycler-kochi.md',
          'delete-vs-destroy-hard-drive-kochi.md',
          'laptop-scrap-price-kochi-2026.md',
          'e-waste-pickup-cost-kochi-2026.md',
          'complete-guide-e-waste-recycling-kerala.md',
          'itad-explained-businesses-kochi.md',
          'data-destruction-methods-compared-kochi.md'
        ]
      },
      locations: {
        path: 'src/content/locations',
        files: [
          'kakkanad.md',
          'ernakulam.md',
          'infopark.md',
          'vytilla.md',
          'palarivattom.md',
          'angamaly.md',
          'aluva.md',
          'thrikkakara.md',
          'edappally.md'
        ]
      },
      faq: {
        path: 'src/content/faq',
        files: [
          'general.md',
          'pricing.md',
          'data-security.md',
          'environmental.md',
          'corporate.md',
          'residential.md'
        ]
      },
      testimonials: {
        path: 'src/content/testimonials',
        files: [
          'rajesh-kumar.md',
          'anjali-nair.md',
          'michael-thomas.md',
          'business-clients.md',
          'individual-customers.md',
          'corporate-clients.md'
        ]
      },
      caseStudies: {
        path: 'src/content/caseStudies',
        files: [
          'server-decommissioning-tech-solutions.md',
          'banking-data-center-upgrade.md',
          'university-lab-upgrade.md',
          'hospital-it-disposal.md',
          'manufacturing-plant-upgrade.md',
          'government-office-upgrade.md'
        ]
      }
    };

    this.urlMappings = {
      services: {
        'sell-old-laptop-kochi': '/services/sell-old-laptop-kochi/',
        'corporate-e-waste-pickup-kochi': '/services/corporate-e-waste-pickup-kochi/',
        'bulk-it-asset-disposal-kochi': '/services/bulk-it-asset-disposal-kochi/',
        'laptop-recycling': '/services/laptop-recycling/',
        'data-destruction': '/services/data-destruction/',
        'itad-services': '/services/itad-services/'
      },
      blog: {
        'sell-vs-recycle-laptop-kochi': '/blog/sell-vs-recycle-laptop-kochi/',
        'local-scrap-dealer-vs-authorized-recycler-kochi': '/blog/local-scrap-dealer-vs-authorized-recycler-kochi/',
        'delete-vs-destroy-hard-drive-kochi': '/blog/delete-vs-destroy-hard-drive-kochi/',
        'laptop-scrap-price-kochi-2026': '/blog/laptop-scrap-price-kochi-2026/',
        'e-waste-pickup-cost-kochi-2026': '/blog/e-waste-pickup-cost-kochi-2026/',
        'complete-guide-e-waste-recycling-kerala': '/blog/complete-guide-e-waste-recycling-kerala/',
        'itad-explained-businesses-kochi': '/blog/itad-explained-businesses-kochi/',
        'data-destruction-methods-compared-kochi': '/blog/data-destruction-methods-compared-kochi/'
      },
      locations: {
        'kakkanad': '/locations/kakkanad/',
        'ernakulam': '/locations/ernakulam/',
        'infopark': '/locations/infopark/',
        'vytilla': '/locations/vyttila/',
        'palarivattom': '/locations/palarivattom/',
        'angamaly': '/locations/angamaly/',
        'aluva': '/locations/aluva/',
        'thrikkakara': '/locations/thrikkakara/',
        'edappally': '/locations/edappally/'
      },
      faq: {
        'general': '/faq/general/',
        'pricing': '/faq/pricing/',
        'data-security': '/faq/data-security/',
        'environmental': '/faq/environmental/',
        'corporate': '/faq/corporate/',
        'residential': '/faq/residential/'
      },
      testimonials: {
        'rajesh-kumar': '/testimonials/rajesh-kumar/',
        'anjali-nair': '/testimonials/anjali-nair/',
        'michael-thomas': '/testimonials/michael-thomas/',
        'business-clients': '/testimonials/business-clients/',
        'individual-customers': '/testimonials/individual-customers/',
        'corporate-clients': '/testimonials/corporate-clients/'
      },
      caseStudies: {
        'server-decommissioning-tech-solutions': '/case-studies/server-decommissioning-tech-solutions/',
        'banking-data-center-upgrade': '/case-studies/banking-data-center-upgrade/',
        'university-lab-upgrade': '/case-studies/university-lab-upgrade/',
        'hospital-it-disposal': '/case-studies/hospital-it-disposal/',
        'manufacturing-plant-upgrade': '/case-studies/manufacturing-plant-upgrade/',
        'government-office-upgrade': '/case-studies/government-office-upgrade/'
      }
    };

    this.dynamicRoutes = {
      services: '/src/pages/services/[slug].astro',
      blog: '/src/pages/blog/[slug].astro', 
      locations: '/src/pages/locations/[slug].astro',
      faq: '/src/pages/faq/[slug].astro',
      testimonials: '/src/pages/testimonials/[slug].astro',
      caseStudies: '/src/pages/case-studies/[slug].astro'
    };
  }

  // Generate complete content mapping
  generateContentMapping() {
    const mapping = {
      totalFiles: 0,
      collections: {},
      urlStructure: {},
      dynamicRoutes: {},
      sitemapEntries: []
    };

    // Process each collection
    Object.entries(this.contentStructure).forEach(([collectionName, collection]) => {
      mapping.collections[collectionName] = {
        path: collection.path,
        files: collection.files,
        count: collection.files.length,
        urls: []
      };

      mapping.totalFiles += collection.files.length;

      // Generate URLs for this collection
      collection.files.forEach(file => {
        const slug = file.replace('.md', '');
        const url = this.urlMappings[collectionName]?.[slug] || `/${collectionName}/${slug}/`;
        
        mapping.collections[collectionName].urls.push({
          file: file,
          slug: slug,
          url: url
        });

        // Add to sitemap entries
        mapping.sitemapEntries.push({
          url: url,
          lastmod: new Date().toISOString(),
          changefreq: this.getChangeFreq(collectionName),
          priority: this.getPriority(collectionName)
        });
      });
    });

    // Generate dynamic routes mapping
    mapping.dynamicRoutes = this.dynamicRoutes;

    // Generate URL structure
    mapping.urlStructure = this.urlMappings;

    return mapping;
  }

  // Get change frequency for sitemap
  getChangeFreq(collectionName) {
    const frequencies = {
      services: 'monthly',
      blog: 'weekly',
      locations: 'monthly',
      faq: 'monthly',
      testimonials: 'monthly',
      caseStudies: 'monthly'
    };
    
    return frequencies[collectionName] || 'monthly';
  }

  // Get priority for sitemap
  getPriority(collectionName) {
    const priorities = {
      services: 0.8,
      blog: 0.7,
      locations: 0.8,
      faq: 0.6,
      testimonials: 0.5,
      caseStudies: 0.6
    };
    
    return priorities[collectionName] || 0.5;
  }

  // Generate file creation commands
  generateFileCommands() {
    const commands = [];

    Object.entries(this.contentStructure).forEach(([collectionName, collection]) => {
      collection.files.forEach(file => {
        commands.push({
          type: 'create',
          path: `${collection.path}/${file}`,
          collection: collectionName,
          slug: file.replace('.md', ''),
          url: this.urlMappings[collectionName]?.[file.replace('.md', '')]
        });
      });
    });

    return commands;
  }

  // Generate content collection schema updates
  generateSchemaUpdates() {
    return {
      services: {
        requiredFields: ['title', 'description', 'slug', 'category', 'features'],
        optionalFields: ['icon', 'price_range', 'certification_required', 'data_destruction', 'pickup_available', 'locations', 'seo_title', 'seo_description', 'faqs', 'related_services', 'cta_text', 'cta_url', 'featured', 'order']
      },
      blog: {
        requiredFields: ['title', 'description', 'author', 'publishDate', 'category'],
        optionalFields: ['updateDate', 'tags', 'featured_image', 'read_time', 'excerpt', 'seo_title', 'seo_description', 'related_posts', 'featured', 'draft', 'order']
      },
      locations: {
        requiredFields: ['name', 'slug', 'description', 'address', 'city', 'district', 'pincode'],
        optionalFields: ['state', 'phone', 'email', 'coordinates', 'service_areas', 'pickup_available', 'operating_hours', 'special_notes', 'seo_title', 'seo_description', 'featured', 'order']
      },
      faq: {
        requiredFields: ['question', 'answer'],
        optionalFields: ['category', 'service', 'location', 'priority', 'featured', 'order']
      },
      testimonials: {
        requiredFields: ['name', 'content', 'rating'],
        optionalFields: ['company', 'position', 'avatar', 'location', 'service_type', 'verified', 'featured', 'date', 'order']
      },
      caseStudies: {
        requiredFields: ['title', 'client', 'industry', 'challenge', 'solution', 'results', 'services_used'],
        optionalFields: ['testimonial', 'featured_image', 'gallery', 'date', 'category', 'tags', 'duration', 'team_size', 'technologies']
      }
    };
  }

  // Generate dynamic route templates
  generateRouteTemplates() {
    return {
      services: `
---
import { getCollection } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ServicePage from '../../components/ServicePage.astro';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

interface Props {
  service: CollectionEntry<'services'>;
}

const { service } = Astro.props;

const { Content } = await service.render();

<BaseLayout 
  title={service.data.title}
  description={service.data.description}
>
  <ServicePage service={service} />
</BaseLayout>
      `,
      
      blog: `
---
import { getCollection } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogPost from '../../components/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;

const { Content } = await post.render();

<BaseLayout 
  title={post.data.title}
  description={post.data.description}
>
  <BlogPost post={post} />
</BaseLayout>
      `,
      
      locations: `
---
import { getCollection } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LocationPage from '../../components/LocationPage.astro';

export async function getStaticPaths() {
  const locations = await getCollection('locations');
  return locations.map((location) => ({
    params: { slug: location.slug },
    props: { location },
  }));
}

interface Props {
  location: CollectionEntry<'locations'>;
}

const { location } = Astro.props;

const { Content } = await location.render();

<BaseLayout 
  title={location.data.title}
  description={location.data.description}
>
  <LocationPage location={location} />
</BaseLayout>
      `
    };
  }

  // Generate collection index pages
  generateIndexPages() {
    return {
      services: `
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ServiceGrid from '../../components/ServiceGrid.astro';
import HeroGlass from '../../components/blocks/HeroGlass.astro';

const services = await getCollection('services');
const featuredServices = services.filter(service => service.data.featured);

<BaseLayout title="Services - EWaste Kochi" description="Professional e-waste recycling services in Kochi">
  <HeroGlass 
    title="Professional E-Waste Services"
    subtitle="KSPCB Certified & Environmentally Responsible"
    description="Complete range of e-waste recycling services with data security and environmental compliance."
    primaryCTA={{ text: "View All Services", url: "#services" }}
    secondaryCTA={{ text: "Get Quote", url: "/contact" }}
  />
  
  <ServiceGrid services={featuredServices} />
</BaseLayout>
      `,
      
      blog: `
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogGrid from '../../components/BlogGrid.astro';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const featuredPosts = posts.filter(post => post.data.featured).slice(0, 6);

<BaseLayout title="Blog - EWaste Kochi" description="Expert insights on e-waste recycling, ITAD, and data security">
  <section class="blog-header">
    <div class="wrap">
      <h1>E-Waste Recycling Blog</h1>
      <p>Expert insights, guides, and best practices for responsible e-waste management in Kerala</p>
    </div>
  </section>
  
  <BlogGrid posts={featuredPosts} />
</BaseLayout>
      `,
      
      locations: `
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LocationGrid from '../../components/LocationGrid.astro';

const locations = await getCollection('locations');
const featuredLocations = locations.filter(location => location.data.featured);

<BaseLayout title="Locations - EWaste Kochi" description="E-waste recycling service centers across Kerala">
  <section class="locations-header">
    <div class="wrap">
      <h1>Service Locations</h1>
      <p>KSPCB authorized e-waste recycling centers across Kerala with free pickup service</p>
    </div>
  </section>
  
  <LocationGrid locations={featuredLocations} />
</BaseLayout>
      `
    };
  }

  // Generate sitemap.xml
  generateSitemap() {
    const mapping = this.generateContentMapping();
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add homepage
    sitemap += `
  <url>
    <loc>https://ewastekochi.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add all content pages
    mapping.sitemapEntries.forEach(entry => {
      sitemap += `
  <url>
    <loc>https://ewastekochi.com${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    });
    
    sitemap += '\n</urlset>';
    
    return sitemap;
  }

  // Generate robots.txt
  generateRobots() {
    return `User-agent: *
Allow: /
Allow: /services/
Allow: /blog/
Allow: /locations/
Allow: /faq/
Allow: /testimonials/
Allow: /case-studies/

Sitemap: https://ewastekochi.com/sitemap.xml

# Block crawlers from admin and system directories
Disallow: /admin/
Disallow: /_astro/
Disallow: /api/
Disallow: /.well-known/

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
  }

  // Validate content structure
  validateStructure() {
    const validation = {
      totalFiles: 0,
      validFiles: 0,
      issues: [],
      recommendations: []
    };

    Object.entries(this.contentStructure).forEach(([collectionName, collection]) => {
      collection.files.forEach(file => {
        validation.totalFiles++;
        
        // Check file naming convention
        if (!file.match(/^[a-z0-9-]+\.md$/)) {
          validation.issues.push({
            file: file,
            issue: 'Invalid file naming convention',
            collection: collectionName
          });
        } else {
          validation.validFiles++;
        }
        
        // Check URL mapping
        const slug = file.replace('.md', '');
        if (!this.urlMappings[collectionName]?.[slug]) {
          validation.issues.push({
            file: file,
            issue: 'Missing URL mapping',
            collection: collectionName
          });
        }
      });
    });

    // Generate recommendations
    if (validation.issues.length > 0) {
      validation.recommendations.push('Fix file naming conventions');
      validation.recommendations.push('Complete URL mappings');
    }

    if (validation.validFiles < validation.totalFiles) {
      validation.recommendations.push('Review and fix invalid files');
    }

    return validation;
  }

  // Generate deployment checklist
  generateDeploymentChecklist() {
    return {
      content: [
        'Create all content files in correct directories',
        'Validate frontmatter schema compliance',
        'Test dynamic route generation',
        'Verify URL structure',
        'Generate sitemap.xml',
        'Update robots.txt'
      ],
      technical: [
        'Update Astro content config.ts',
        'Create dynamic route templates',
        'Test build process',
        'Validate internal links',
        'Check responsive design',
        'Optimize images'
      ],
      seo: [
        'Verify meta tags and titles',
        'Test structured data',
        'Check page load speed',
        'Validate internal linking',
        'Test mobile usability',
        'Check Core Web Vitals'
      ],
      functionality: [
        'Test all form submissions',
        'Verify contact information',
        'Test navigation',
        'Check search functionality',
        'Validate data protection',
        'Test accessibility'
      ]
    };
  }

  // Export complete mapping report
  exportMappingReport() {
    const mapping = this.generateContentMapping();
    const validation = this.validateStructure();
    const checklist = this.generateDeploymentChecklist();
    
    return {
      summary: {
        totalFiles: mapping.totalFiles,
        validFiles: validation.validFiles,
        collections: Object.keys(mapping.collections).length,
        issues: validation.issues.length,
        readyToDeploy: validation.issues.length === 0
      },
      structure: mapping,
      validation: validation,
      checklist: checklist,
      sitemap: this.generateSitemap(),
      robots: this.generateRobots()
    };
  }
}

export { ContentMappingEngine };
