// Content Engine - Programmatic page generation and internal linking system

class ContentEngine {
  constructor(content) {
    this.content = content;
  }

  // Generate category pages for services
  generateServiceCategories() {
    const categories = [...new Set(this.content.services.map(s => s.data.category))];
    
    return categories.map(category => {
      const categoryServices = this.content.services.filter(s => s.data.category === category);
      
      return {
        path: `/services/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${category} Services - Certified E-Waste Recycling Kochi`,
        description: `Professional ${category.toLowerCase()} e-waste recycling services in Kochi. KSPCB certified, data destruction, and free pickup.`,
        content: this.generateCategoryPageContent(category, categoryServices, 'services'),
        schema: this.generateCategorySchema(category, categoryServices, 'Service'),
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services/' },
          { name: category, url: `/services/category/${category.toLowerCase().replace(/\s+/g, '-')}/` }
        ]
      };
    });
  }

  // Generate location hub pages
  generateLocationHubs() {
    const districts = [...new Set(this.content.locations.map(l => l.data.district))];
    
    return districts.map(district => {
      const districtLocations = this.content.locations.filter(l => l.data.district === district);
      const districtServices = this.content.services.filter(service => 
        !service.data.locations || 
        service.data.locations.some(loc => districtLocations.some(l => l.slug === loc))
      );
      
      return {
        path: `/locations/${district.toLowerCase().replace(/\s+/g, '-')}`,
        title: `E-Waste Recycling ${district} - Free Pickup Services`,
        description: `Certified e-waste recycling services across ${district}. Free pickup, data destruction, and KSPCB certified disposal.`,
        content: this.generateLocationHubContent(district, districtLocations, districtServices),
        schema: this.generateLocationHubSchema(district, districtLocations),
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations/' },
          { name: district, url: `/locations/${district.toLowerCase().replace(/\s+/g, '-')}/` }
        ]
      };
    });
  }

  // Generate tag pages for blog
  generateBlogTagPages() {
    const allTags = this.content.blog.flatMap(post => post.data.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    return uniqueTags.map(tag => {
      const tagPosts = this.content.blog.filter(post => post.data.tags?.includes(tag));
      
      return {
        path: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${tag} - E-Waste Recycling Blog | EWaste Kochi`,
        description: `Articles about ${tag.toLowerCase()} in e-waste recycling, ITAD, and environmental compliance.`,
        content: this.generateTagPageContent(tag, tagPosts),
        schema: this.generateBlogSchema(tagPosts),
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog/' },
          { name: tag, url: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/` }
        ]
      };
    });
  }

  // Generate internal links for content
  generateInternalLinks(content, currentSlug, contentType) {
    const keywords = this.extractKeywords(content);
    let linkedContent = content;

    // Link to services
    this.content.services.forEach(service => {
      if (service.slug !== currentSlug && keywords.some(keyword => 
        this.isKeywordMatch(keyword, service.data.title) || 
        this.isKeywordMatch(keyword, service.data.description)
      )) {
        const regex = new RegExp(`\\b${this.escapeRegExp(service.data.title)}\\b`, 'gi');
        linkedContent = linkedContent.replace(regex, `[${service.data.title}](/services/${service.slug})`);
      }
    });

    // Link to locations
    if (contentType !== 'location') {
      this.content.locations.forEach(location => {
        if (keywords.some(keyword => 
          this.isKeywordMatch(keyword, location.data.name) || 
          this.isKeywordMatch(keyword, location.data.city)
        )) {
          const regex = new RegExp(`\\b${location.data.name}\\b`, 'gi');
          linkedContent = linkedContent.replace(regex, `[${location.data.name}](/locations/${location.slug})`);
        }
      });
    }

    // Link to blog posts
    if (contentType !== 'blog') {
      this.content.blog.forEach(post => {
        if (post.slug !== currentSlug && keywords.some(keyword => 
          this.isKeywordMatch(keyword, post.data.title) || 
          this.isKeywordMatch(keyword, post.data.description)
        )) {
          const regex = new RegExp(`\\b${post.data.title}\\b`, 'gi');
          linkedContent = linkedContent.replace(regex, `[${post.data.title}](/blog/post/${post.slug})`);
        }
      });
    }

    return linkedContent;
  }

  // Generate related content suggestions
  generateRelatedContent(currentItem, contentType, limit = 3) {
    const related = [];

    // Score based on category, tags, and locations
    this.content.services.forEach(service => {
      if (service.slug !== currentItem.slug) {
        let score = 0;
        
        if (service.data.category === currentItem.category) score += 3;
        if (service.data.tags?.some(tag => currentItem.tags?.includes(tag))) score += 2;
        if (service.data.locations?.some(loc => currentItem.locations?.includes(loc))) score += 2;
        
        if (score > 0) {
          related.push({ type: 'service', item: service, score });
        }
      }
    });

    this.content.blog.forEach(post => {
      if (post.slug !== currentItem.slug) {
        let score = 0;
        
        if (post.data.category === currentItem.category) score += 2;
        if (post.data.tags?.some(tag => currentItem.tags?.includes(tag))) score += 2;
        
        if (score > 0) {
          related.push({ type: 'blog', item: post, score });
        }
      }
    });

    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.item);
  }

  // Generate sitemap entries
  generateSitemapEntries() {
    const entries = [
      { url: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
      { url: '/services/', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
      { url: '/locations/', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
      { url: '/blog/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 }
    ];

    // Add service pages
    this.content.services.forEach(service => {
      entries.push({
        url: `/services/${service.slug}/`,
        lastmod: service.data.updateDate?.toISOString() || service.data.publishDate.toISOString(),
        changefreq: 'monthly',
        priority: service.data.featured ? 0.8 : 0.7
      });
    });

    // Add location pages
    this.content.locations.forEach(location => {
      entries.push({
        url: `/locations/${location.slug}/`,
        lastmod: location.data.updateDate?.toISOString() || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      });
    });

    // Add blog posts
    this.content.blog.forEach(post => {
      entries.push({
        url: `/blog/post/${post.slug}/`,
        lastmod: post.data.updateDate?.toISOString() || post.data.publishDate.toISOString(),
        changefreq: 'weekly',
        priority: post.data.featured ? 0.7 : 0.6
      });
    });

    return entries;
  }

  // Private helper methods
  extractKeywords(content) {
    // Extract important keywords from content
    const words = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const commonWords = new Set(['the', 'and', 'for', 'are', 'with', 'not', 'you', 'all', 'can', 'has', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'use', 'man', 'new', 'now', 'old', 'see', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'him']);
    
    return [...new Set(words.filter(word => !commonWords.has(word)))];
  }

  isKeywordMatch(keyword, text) {
    return text.toLowerCase().includes(keyword.toLowerCase()) || 
           keyword.toLowerCase().includes(text.toLowerCase());
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  generateCategoryPageContent(category, items, type) {
    const itemList = items.map(item => 
      `### [${item.data.title}](/${type}/${item.slug}/)\n\n${item.data.description}\n\n`
    ).join('');

    return `# ${category} ${type === 'services' ? 'Services' : 'Content'}\n\n${itemList}`;
  }

  generateLocationHubContent(district, locations, services) {
    const locationList = locations.map(loc => 
      `### [${loc.data.name}](/locations/${loc.slug}/)\n\n${loc.data.description}\n\n`
    ).join('');

    const serviceList = services.map(service => 
      `### [${service.data.title}](/services/${service.slug}/)\n\n${service.data.description}\n\n`
    ).join('');

    return `# E-Waste Recycling in ${district}\n\n## Service Centers\n\n${locationList}\n\n## Available Services\n\n${serviceList}`;
  }

  generateTagPageContent(tag, posts) {
    const postList = posts.map(post => 
      `### [${post.data.title}](/blog/post/${post.slug}/)\n\n${post.data.excerpt || post.data.description}\n\n*Published: ${post.data.publishDate.toLocaleDateString()}*\n\n`
    ).join('');

    return `# ${tag} Articles\n\n${postList}`;
  }

  generateCategorySchema(category, items, type) {
    return {
      "@type": "CollectionPage",
      "name": `${category} ${type}s`,
      "description": `Browse our ${category.toLowerCase()} ${type.toLowerCase()}s`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": type,
            "name": item.data.title,
            "description": item.data.description,
            "url": `https://ewastekochi.com/${type}/${item.slug}/`
          }
        }))
      }
    };
  }

  generateLocationHubSchema(district, locations) {
    return {
      "@type": "CollectionPage",
      "name": `E-Waste Recycling ${district}`,
      "description": `E-waste recycling services and centers in ${district}`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": locations.map((location, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": location.data.name,
            "description": location.data.description,
            "address": location.data.address,
            "url": `https://ewastekochi.com/locations/${location.slug}/`
          }
        }))
      }
    };
  }

  generateBlogSchema(posts) {
    return {
      "@type": "CollectionPage",
      "name": "E-Waste Recycling Blog",
      "description": "Expert insights on e-waste recycling and ITAD",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": posts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "BlogPosting",
            "name": post.data.title,
            "description": post.data.description,
            "datePublished": post.data.publishDate.toISOString(),
            "url": `https://ewastekochi.com/blog/post/${post.slug}/`
          }
        }))
      }
    };
  }
}

export { ContentEngine };
