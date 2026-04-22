// Internal Linking Engine - Smart content cross-referencing for SEO
class InternalLinkingEngine {
  constructor() {
    this.linkingRules = {
      // Service to Blog linking
      services: {
        'sell-old-laptop-kochi': [
          'sell-vs-recycle-laptop-kochi',
          'laptop-scrap-price-kochi-2026',
          'data-destruction-methods-compared-kochi'
        ],
        'corporate-e-waste-pickup-kochi': [
          'itad-explained-businesses-kochi',
          'bulk-it-asset-disposal-kochi',
          'complete-guide-e-waste-recycling-kerala'
        ],
        'bulk-it-asset-disposal-kochi': [
          'itad-explained-businesses-kochi',
          'corporate-e-waste-pickup-kochi',
          'data-destruction-methods-compared-kochi'
        ]
      },
      // Blog to Service linking
      blog: {
        'sell-vs-recycle-laptop-kochi': [
          'sell-old-laptop-kochi',
          'laptop-recycling'
        ],
        'laptop-scrap-price-kochi-2026': [
          'sell-old-laptop-kochi',
          'laptop-recycling'
        ],
        'data-destruction-methods-compared-kochi': [
          'data-destruction',
          'corporate-e-waste-pickup-kochi'
        ]
      },
      // Blog to Blog linking
      blogCrossLinks: {
        'sell-vs-recycle-laptop-kochi': [
          'local-scrap-dealer-vs-authorized-recycler-kochi',
          'delete-vs-destroy-hard-drive-kochi',
          'laptop-scrap-price-kochi-2026'
        ],
        'complete-guide-e-waste-recycling-kerala': [
          'itad-explained-businesses-kochi',
          'data-destruction-methods-compared-kochi',
          'local-scrap-dealer-vs-authorized-recycler-kochi'
        ]
      }
    };

    this.keywordMappings = {
      // Service keywords
      'sell laptop': 'sell-old-laptop-kochi',
      'sell old laptop': 'sell-old-laptop-kochi',
      'corporate pickup': 'corporate-e-waste-pickup-kochi',
      'bulk disposal': 'bulk-it-asset-disposal-kochi',
      'data destruction': 'data-destruction',
      'laptop recycling': 'laptop-recycling',
      'itad': 'itad-services',
      
      // Blog keywords
      'sell vs recycle': 'sell-vs-recycle-laptop-kochi',
      'scrap dealer': 'local-scrap-dealer-vs-authorized-recycler-kochi',
      'delete vs destroy': 'delete-vs-destroy-hard-drive-kochi',
      'laptop prices': 'laptop-scrap-price-kochi-2026',
      'pickup cost': 'e-waste-pickup-cost-kochi-2026',
      'e-waste kerala': 'complete-guide-e-waste-recycling-kerala',
      'it asset disposition': 'itad-explained-businesses-kochi',
      'nist 800-88': 'data-destruction-methods-compared-kochi'
    };

    this.locationKeywords = {
      'kochi': 'kochi',
      'ernakulam': 'ernakulam',
      'kakkanad': 'kakkanad',
      'infopark': 'infopark',
      'vytilla': 'vytilla',
      'palarivattom': 'palarivattom',
      'angamaly': 'angamaly',
      'aluva': 'aluva',
      'thrikkakara': 'thrikkakara',
      'edappally': 'edappally'
    };
  }

  // Generate internal links for content
  generateInternalLinks(content, currentSlug, contentType) {
    let linkedContent = content;
    const linkedKeywords = new Set();
    const linkCount = { service: 0, blog: 0, location: 0 };

    // Link to services
    linkedContent = this.linkToServices(linkedContent, currentSlug, linkedKeywords, linkCount);
    
    // Link to blog posts
    linkedContent = this.linkToBlogPosts(linkedContent, currentSlug, linkedKeywords, linkCount);
    
    // Link to locations
    linkedContent = this.linkToLocations(linkedContent, currentSlug, linkedKeywords, linkCount);

    return {
      content: linkedContent,
      linkCount: Object.values(linkCount).reduce((a, b) => a + b, 0),
      linkedKeywords: Array.from(linkedKeywords)
    };
  }

  // Link to service pages
  linkToServices(content, currentSlug, linkedKeywords, linkCount) {
    let linkedContent = content;

    Object.entries(this.keywordMappings).forEach(([keyword, serviceSlug]) => {
      // Skip if linking to current page
      if (serviceSlug === currentSlug) return;
      
      // Skip if already linked this keyword
      if (linkedKeywords.has(keyword)) return;

      // Check if keyword exists in content
      const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\b`, 'gi');
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        // Create link for first occurrence
        linkedContent = linkedContent.replace(regex, (match, offset) => {
          if (linkedKeywords.has(keyword)) return match; // Skip subsequent matches
          
          linkedKeywords.add(keyword);
          linkCount.service++;
          
          return `[${match}](${this.getServiceUrl(serviceSlug)})`;
        });
      }
    });

    return linkedContent;
  }

  // Link to blog posts
  linkToBlogPosts(content, currentSlug, linkedKeywords, linkCount) {
    let linkedContent = content;

    // Get related blog posts based on linking rules
    const relatedPosts = this.getRelatedBlogPosts(currentSlug);
    
    relatedPosts.forEach(postSlug => {
      if (postSlug === currentSlug) return;
      
      // Extract key phrases from post slug
      const keyPhrases = this.extractKeyPhrases(postSlug);
      
      keyPhrases.forEach(phrase => {
        if (linkedKeywords.has(phrase)) return;
        
        const regex = new RegExp(`\\b${this.escapeRegExp(phrase)}\\b`, 'gi');
        const matches = content.match(regex);
        
        if (matches && matches.length > 0) {
          linkedContent = linkedContent.replace(regex, (match) => {
            if (linkedKeywords.has(phrase)) return match;
            
            linkedKeywords.add(phrase);
            linkCount.blog++;
            
            return `[${match}](${this.getBlogUrl(postSlug)})`;
          });
        }
      });
    });

    return linkedContent;
  }

  // Link to location pages
  linkToLocations(content, currentSlug, linkedKeywords, linkCount) {
    let linkedContent = content;

    Object.entries(this.locationKeywords).forEach(([location, locationSlug]) => {
      if (linkedKeywords.has(location)) return;
      
      const regex = new RegExp(`\\b${this.escapeRegExp(location)}\\b`, 'gi');
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        linkedContent = linkedContent.replace(regex, (match) => {
          if (linkedKeywords.has(location)) return match;
          
          linkedKeywords.add(location);
          linkCount.location++;
          
          return `[${match}](${this.getLocationUrl(locationSlug)})`;
        });
      }
    });

    return linkedContent;
  }

  // Get related blog posts
  getRelatedBlogPosts(currentSlug) {
    const relatedPosts = new Set();
    
    // Add from blogCrossLinks
    if (this.linkingRules.blogCrossLinks[currentSlug]) {
      this.linkingRules.blogCrossLinks[currentSlug].forEach(post => {
        relatedPosts.add(post);
      });
    }
    
    // Add reverse links
    Object.entries(this.linkingRules.blogCrossLinks).forEach(([slug, links]) => {
      if (links.includes(currentSlug)) {
        relatedPosts.add(slug);
      }
    });
    
    return Array.from(relatedPosts);
  }

  // Extract key phrases from slug
  extractKeyPhrases(slug) {
    const phrases = [];
    
    // Convert slug to readable phrases
    const readable = slug.replace(/-/g, ' ').replace(/kochi-2026/g, 'kochi');
    
    // Extract multi-word phrases
    const multiWordPhrases = [
      'sell vs recycle',
      'scrap dealer',
      'delete vs destroy',
      'laptop scrap price',
      'e-waste pickup',
      'complete guide',
      'it asset disposition',
      'data destruction methods'
    ];
    
    multiWordPhrases.forEach(phrase => {
      if (readable.includes(phrase)) {
        phrases.push(phrase);
      }
    });
    
    // Extract single words
    const words = readable.split(' ').filter(word => word.length > 3);
    phrases.push(...words);
    
    return phrases;
  }

  // Get service URL
  getServiceUrl(slug) {
    return `/services/${slug}/`;
  }

  // Get blog URL
  getBlogUrl(slug) {
    return `/blog/${slug}/`;
  }

  // Get location URL
  getLocationUrl(slug) {
    return `/locations/${slug}/`;
  }

  // Escape regex special characters
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Generate related content suggestions
  generateRelatedContent(currentSlug, contentType, limit = 3) {
    const related = [];
    
    if (contentType === 'service') {
      // Get related blog posts
      const relatedBlogs = this.getRelatedBlogPosts(currentSlug);
      relatedBlogs.slice(0, limit).forEach(slug => {
        related.push({
          type: 'blog',
          slug: slug,
          title: this.formatTitle(slug),
          url: this.getBlogUrl(slug)
        });
      });
    } else if (contentType === 'blog') {
      // Get related services
      Object.entries(this.keywordMappings).forEach(([keyword, serviceSlug]) => {
        if (this.contentContainsKeyword(currentSlug, keyword)) {
          related.push({
            type: 'service',
            slug: serviceSlug,
            title: this.formatTitle(serviceSlug),
            url: this.getServiceUrl(serviceSlug)
          });
        }
      });
    }
    
    return related.slice(0, limit);
  }

  // Check if content contains keyword
  contentContainsKeyword(slug, keyword) {
    const slugContent = slug.replace(/-/g, ' ');
    return slugContent.includes(keyword.toLowerCase());
  }

  // Format title from slug
  formatTitle(slug) {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace('Kochi 2026', 'Kochi 2026')
      .replace('Itad', 'ITAD');
  }

  // Generate breadcrumb navigation
  generateBreadcrumbs(currentSlug, contentType) {
    const breadcrumbs = [
      { name: 'Home', url: '/' }
    ];

    if (contentType === 'service') {
      breadcrumbs.push({ name: 'Services', url: '/services/' });
      breadcrumbs.push({ 
        name: this.formatTitle(currentSlug), 
        url: this.getServiceUrl(currentSlug) 
      });
    } else if (contentType === 'blog') {
      breadcrumbs.push({ name: 'Blog', url: '/blog/' });
      breadcrumbs.push({ 
        name: this.formatTitle(currentSlug), 
        url: this.getBlogUrl(currentSlug) 
      });
    } else if (contentType === 'location') {
      breadcrumbs.push({ name: 'Locations', url: '/locations/' });
      breadcrumbs.push({ 
        name: this.formatTitle(currentSlug), 
        url: this.getLocationUrl(currentSlug) 
      });
    }

    return breadcrumbs;
  }

  // Generate internal linking report
  generateLinkingReport(contentItems) {
    const report = {
      totalContent: contentItems.length,
      totalLinks: 0,
      linkDistribution: {
        services: 0,
        blog: 0,
        locations: 0
      },
      topLinkedContent: [],
      unlinkedContent: []
    };

    contentItems.forEach(item => {
      const linkResult = this.generateInternalLinks(item.content, item.slug, item.type);
      
      report.totalLinks += linkResult.linkCount;
      report.linkDistribution.services += linkResult.linkCount.service || 0;
      report.linkDistribution.blog += linkResult.linkCount.blog || 0;
      report.linkDistribution.locations += linkResult.linkCount.location || 0;
      
      if (linkResult.linkCount > 0) {
        report.topLinkedContent.push({
          slug: item.slug,
          type: item.type,
          linkCount: linkResult.linkCount,
          linkedKeywords: linkResult.linkedKeywords
        });
      } else {
        report.unlinkedContent.push({
          slug: item.slug,
          type: item.type
        });
      }
    });

    // Sort by link count
    report.topLinkedContent.sort((a, b) => b.linkCount - a.linkCount);

    return report;
  }
}

export { InternalLinkingEngine };
