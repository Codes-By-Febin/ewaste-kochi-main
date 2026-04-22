// Blog Content Generator - Programmatic Generation System for 10,000+ Posts
// Scalable template-based content generation with SEO optimization

export class BlogContentGenerator {
  constructor() {
    this.contentTemplates = {
      // Guide Templates
      'comprehensive-guide': {
        structure: {
          title: "{{topic}} Complete Guide {{year}} - Kochi",
          description: "Comprehensive guide to {{topic}} in Kochi. Everything you need to know about {{topic_lower}} including {{key_benefits}}.",
          content: `
# {{topic}} Complete Guide {{year}} - Kochi

## What is {{topic}}?

{{topic_definition}}

## Why {{topic}} Matters in Kochi

{{local_relevance}}

## {{topic}} Process in Kochi

{{process_steps}}

## Benefits of {{topic}}

{{benefits_list}}

## {{topic}} Costs in Kochi

{{pricing_info}}

## How to Get Started with {{topic}}

{{call_to_action}}

## Frequently Asked Questions

{{faqs}}

## Conclusion

{{summary}}
          `,
          wordCount: 2000,
          sections: ['introduction', 'process', 'benefits', 'costs', 'faq', 'conclusion']
        }
      },

      // Comparison Templates
      'comparison': {
        structure: {
          title: "{{option1}} vs {{option2}} - Kochi {{year}} Comparison",
          description: "Detailed comparison between {{option1}} and {{option2}} in Kochi. Which option is better for your needs?",
          content: `
# {{option1}} vs {{option2}} - Complete Comparison Guide

## Quick Overview

{{option1_overview}}
{{option2_overview}}

## Key Differences

{{differences_table}}

## Cost Comparison

{{cost_comparison}}

## Which Option Should You Choose?

{{decision_factors}}

## {{option1}} Pros and Cons

{{option1_pros}}
{{option1_cons}}

## {{option2}} Pros and Cons

{{option2_pros}}
{{option2_cons}}

## Making the Right Choice

{{recommendation}}

## Get Started

{{cta}}
          `,
          wordCount: 1500,
          sections: ['overview', 'differences', 'costs', 'pros-cons', 'recommendation']
        }
      },

      // Pricing Templates
      'pricing-guide': {
        structure: {
          title: "{{item}} Price Guide {{year}} - Kochi Market Rates",
          description: "Current market prices for {{item}} in Kochi. Brand-wise pricing, condition factors, and where to get best rates.",
          content: `
# {{item}} Price Guide {{year}} - Kochi Market Rates

## Current Market Overview

{{market_overview}}

## Brand-wise {{item}} Prices

{{brand_pricing}}

## Factors Affecting {{item}} Prices

{{pricing_factors}}

## {{item}} Price by Condition

{{condition_pricing}}

## Where to Sell {{item}} in Kochi

{{selling_options}}

## Price Negotiation Tips

{{negotiation_tips}}

## {{item}} Price Trends

{{price_trends}}

## Get Best Price for Your {{item}}

{{cta}}
          `,
          wordCount: 1800,
          sections: ['overview', 'brand-pricing', 'factors', 'selling-options', 'trends']
        }
      },

      // Location-specific Templates
      'location-guide': {
        structure: {
          title: "{{service}} in {{location}} - Complete {{year}} Guide",
          description: "{{service}} services available in {{location}}. Coverage areas, pricing, and how to book service.",
          content: `
# {{service}} in {{location}} - Complete Guide

## {{service}} Coverage in {{location}}

{{coverage_info}}

## Service Areas in {{location}}

{{areas_covered}}

## {{service}} Process in {{location}}

{{local_process}}

## {{service}} Pricing in {{location}}

{{local_pricing}}

## Why Choose {{service}} in {{location}}

{{local_advantages}}

## How to Book {{service}} in {{location}}

{{booking_process}}

## {{location}} {{service}} FAQ

{{local_faqs}}

## Get {{service}} in {{location}}

{{cta}}
          `,
          wordCount: 1200,
          sections: ['coverage', 'areas', 'process', 'pricing', 'booking']
        }
      },

      // FAQ Templates
      'faq-post': {
        structure: {
          title: "{{topic}} FAQ - Top 20 Questions Answered {{year}}",
          description: "Most frequently asked questions about {{topic}} in Kochi. Expert answers to help you make informed decisions.",
          content: `
# {{topic}} FAQ - Complete Answer Guide

## General {{topic}} Questions

{{general_faqs}}

## {{topic}} Process Questions

{{process_faqs}}

## {{topic}} Cost Questions

{{cost_faqs}}

## {{topic}} Legal Questions

{{legal_faqs}}

## {{topic}} Safety Questions

{{safety_faqs}}

## {{topic}} Service Questions

{{service_faqs}}

## Still Have Questions?

{{final_cta}}
          `,
          wordCount: 1500,
          sections: ['general', 'process', 'cost', 'legal', 'safety', 'service']
        }
      }
    };

    this.contentVariables = {
      // Topics
      'topics': [
        'e-waste recycling', 'data destruction', 'laptop buyback', 
        'electronic disposal', 'IT asset management', 'computer recycling'
      ],

      // Locations
      'locations': [
        'Kochi', 'Kakkanad', 'Edappally', 'Aluva', 'Vyttila', 
        'Infopark', 'Ernakulam', 'Fort Kochi', 'Marine Drive'
      ],

      // Brands
      'brands': [
        'Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'OnePlus',
        'ASUS', 'Acer', 'MSI', 'Xiaomi', 'Realme', 'Oppo'
      ],

      // Device Types
      'devices': [
        'laptop', 'desktop', 'smartphone', 'tablet', 'printer',
        'monitor', 'server', 'hard drive', 'UPS', 'router'
      ],

      // Years
      'years': ['2024', '2025', '2026'],

      // Services
      'services': [
        'free e-waste pickup', 'data destruction', 'laptop recycling',
        'corporate disposal', 'bulk buyback', 'ITAD services'
      ]
    };

    this.contentDatabase = {
      // E-waste related content
      'e-waste': {
        definitions: [
          "E-waste refers to electronic waste - discarded electronic devices that are no longer wanted or working.",
          "Electronic waste includes computers, phones, printers, and other devices that have reached end-of-life.",
          "E-waste is any electronic equipment that has been discarded, recycled, or is destined for disposal."
        ],
        benefits: [
          "environmental protection", "data security", "resource recovery", 
          "legal compliance", "cost savings", "corporate responsibility"
        ],
        processes: [
          "collection", "sorting", "data destruction", "material recovery", 
          "recycling", "documentation"
        ],
        costs: [
          "free pickup", "paid collection", "bulk discounts", 
          "corporate rates", "residential pricing"
        ]
      },

      // Data destruction related content
      'data-destruction': {
        methods: [
          "physical shredding", "degaussing", "software wiping", 
          "cryptographic erasure", "microwave destruction"
        ],
        standards: [
          "NIST 800-88", "DoD 5220.22-M", "ISO 27001", 
          "GDPR compliance", "DPDP Act 2023"
        ],
        benefits: [
          "data security", "legal compliance", "brand protection", 
          "customer trust", "audit readiness"
        ],
        costs: [
          "per device pricing", "bulk rates", "on-site services", 
          "certification fees", "emergency destruction"
        ]
      },

      // Buyback related content
      'buyback': {
        factors: [
          "brand", "model", "age", "condition", "specifications", 
          "market demand", "accessories included"
        ],
        benefits: [
          "instant cash", "convenient pickup", "data security", 
          "environmental responsibility", "fair pricing"
        ],
        processes: [
          "online quote", "device inspection", "data wiping", 
          "payment", "recycling documentation"
        ],
        pricing: [
          "market rates", "brand premiums", "condition adjustments", 
          "bulk bonuses", "seasonal variations"
        ]
      }
    };
  }

  // Generate content based on template and variables
  generateContent(templateType, variables = {}) {
    const template = this.contentTemplates[templateType];
    if (!template) {
      throw new Error(`Template type '${templateType}' not found`);
    }

    let content = template.structure.content;
    
    // Replace variables in content
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    }

    // Generate dynamic content sections
    content = this.generateDynamicSections(content, variables);

    // Generate automatic image alt text
    const imageAltText = this.generateImageAltText(variables);
    const imageUrl = this.generateImageUrl(variables);

    // Generate frontmatter for blog post
    const frontmatter = this.generateFrontmatter({
      title: this.replaceVariables(template.structure.title, variables),
      description: this.replaceVariables(template.structure.description, variables),
      author: 'EWaste Kochi Team',
      published: new Date(),
      canonical: variables.canonical || '',
      wordCount: template.structure.wordCount,
      sections: template.structure.sections,
      templateType,
      image: {
        url: imageUrl,
        alt: imageAltText
      }
    });

    return {
      frontmatter,
      content,
      wordCount: template.structure.wordCount,
      sections: template.structure.sections,
      templateType,
      image: {
        url: imageUrl,
        alt: imageAltText
      }
    };
  }

  // Replace variables in text
  replaceVariables(text, variables) {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
  }

  // Generate dynamic content sections
  generateDynamicSections(content, variables) {
    // Generate topic-specific content
    content = this.generateTopicContent(content, variables);
    
    // Generate location-specific content
    content = this.generateLocationContent(content, variables);
    
    // Generate pricing content
    content = this.generatePricingContent(content, variables);
    
    // Generate FAQ content
    content = this.generateFAQContent(content, variables);
    
    // Generate CTA content
    content = this.generateCTAContent(content, variables);

    return content;
  }

  // Generate topic-specific content
  generateTopicContent(content, variables) {
    const topic = variables.topic || variables.topic_lower;
    if (!topic) return content;

    const topicData = this.contentDatabase['e-waste'];
    if (!topicData) return content;

    // Replace topic definitions
    if (content.includes('{{topic_definition}}')) {
      const definitions = topicData.definitions;
      const definition = definitions[Math.floor(Math.random() * definitions.length)];
      content = content.replace('{{topic_definition}}', definition);
    }

    // Replace benefits
    if (content.includes('{{benefits_list}}')) {
      const benefits = topicData.benefits;
      const benefitsList = benefits.map(benefit => `- **${benefit}**: ${this.generateBenefitDescription(benefit)}`).join('\n');
      content = content.replace('{{benefits_list}}', benefitsList);
    }

    // Replace process steps
    if (content.includes('{{process_steps}}')) {
      const processes = topicData.processes;
      const processSteps = processes.map((process, index) => 
        `${index + 1}. **${process}**: ${this.generateProcessDescription(process)}`
      ).join('\n');
      content = content.replace('{{process_steps}}', processSteps);
    }

    return content;
  }

  // Generate location-specific content
  generateLocationContent(content, variables) {
    const location = variables.location;
    if (!location) return content;

    // Generate local relevance
    if (content.includes('{{local_relevance}}')) {
      const relevance = this.generateLocalRelevance(location, variables.topic || 'e-waste');
      content = content.replace('{{local_relevance}}', relevance);
    }

    // Generate coverage info
    if (content.includes('{{coverage_info}}')) {
      const coverage = this.generateCoverageInfo(location, variables.service || 'e-waste pickup');
      content = content.replace('{{coverage_info}}', coverage);
    }

    // Generate areas covered
    if (content.includes('{{areas_covered}}')) {
      const areas = this.generateAreasCovered(location);
      content = content.replace('{{areas_covered}}', areas);
    }

    return content;
  }

  // Generate pricing content
  generatePricingContent(content, variables) {
    const item = variables.item || variables.topic;
    if (!item) return content;

    // Generate pricing info
    if (content.includes('{{pricing_info}}')) {
      const pricing = this.generatePricingInfo(item, variables.location || 'Kochi');
      content = content.replace('{{pricing_info}}', pricing);
    }

    // Generate brand pricing
    if (content.includes('{{brand_pricing}}')) {
      const brandPricing = this.generateBrandPricing(item);
      content = content.replace('{{brand_pricing}}', brandPricing);
    }

    return content;
  }

  // Generate FAQ content
  generateFAQContent(content, variables) {
    if (content.includes('{{faqs}}')) {
      const faqs = this.generateFAQList(variables.topic || 'e-waste', variables.location || 'Kochi');
      content = content.replace('{{faqs}}', faqs);
    }

    return content;
  }

  // Generate CTA content
  generateCTAContent(content, variables) {
    if (content.includes('{{call_to_action}}')) {
      const cta = this.generateCTA(variables.topic || 'e-waste');
      content = content.replace('{{call_to_action}}', cta);
    }

    return content;
  }

  // Helper methods for content generation
  generateBenefitDescription(benefit) {
    const descriptions = {
      'environmental protection': 'Prevents toxic materials from contaminating soil and water',
      'data security': 'Ensures sensitive information cannot be recovered',
      'resource recovery': 'Recovers valuable materials for reuse',
      'legal compliance': 'Meets all regulatory requirements',
      'cost savings': 'Reduces disposal costs and potential fines',
      'corporate responsibility': 'Demonstrates environmental stewardship'
    };
    return descriptions[benefit] || 'Important benefit for sustainable practices';
  }

  generateProcessDescription(process) {
    const descriptions = {
      'collection': 'We collect your e-waste from your location',
      'sorting': 'Items are sorted by type and condition',
      'data destruction': 'All data is securely destroyed',
      'material recovery': 'Valuable materials are extracted',
      'recycling': 'Materials are processed for reuse',
      'documentation': 'You receive certificates for compliance'
    };
    return descriptions[process] || 'Essential step in the process';
  }

  generateLocalRelevance(location, topic) {
    return `In ${location}, ${topic} is particularly important due to the high concentration of IT companies, educational institutions, and residential areas. Proper ${topic} helps maintain the city's environmental standards and supports digital transformation initiatives.`;
  }

  generateCoverageInfo(location, service) {
    return `Our ${service} covers all major areas in ${location} including central business district, residential colonies, IT parks, and industrial areas. We provide same-day service for most locations.`;
  }

  generateAreasCovered(location) {
    const areas = {
      'Kochi': ['Fort Kochi', 'Marine Drive', 'MG Road', 'Banerjee Road'],
      'Kakkanad': ['Infopark', 'KSEZ', 'Civil Lane', 'Seaport-Airport Road'],
      'Edappally': ['Lulu Mall area', 'Metro Station', 'NH Bypass'],
      'Aluva': ['Airport Road', 'Industrial Estate', 'Railway Station']
    };
    
    const locationAreas = areas[location] || ['Central area', 'Main road', 'Residential colony'];
    return locationAreas.map(area => `- **${area}**: Complete coverage with same-day pickup`).join('\n');
  }

  generatePricingInfo(item, location) {
    return `The cost of ${item} in ${location} varies based on quantity, condition, and service type. Basic pickup starts from free for qualifying items, while specialized services range from Rs 500-5000 depending on requirements.`;
  }

  generateBrandPricing(item) {
    const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung'];
    return brands.map(brand => {
      const priceRange = this.generatePriceRange(brand);
      return `**${brand} ${item}**: Rs ${priceRange}`;
    }).join('\n');
  }

  generatePriceRange(brand) {
    const ranges = {
      'Dell': '8,000 - 45,000',
      'HP': '6,000 - 35,000',
      'Lenovo': '7,000 - 40,000',
      'Apple': '15,000 - 80,000',
      'Samsung': '5,000 - 25,000'
    };
    return ranges[brand] || '5,000 - 30,000';
  }

  generateFAQList(topic, location) {
    const faqs = [
      {
        question: `How quickly can you pick up ${topic} in ${location}?`,
        answer: `We offer same-day pickup service across ${location}. Schedule your pickup and we'll collect within 4 hours.`
      },
      {
        question: `Is ${topic} recycling certified?`,
        answer: `Yes, we are KSPCB authorized and follow international standards for environmental compliance.`
      },
      {
        question: `Do you provide data destruction certificates?`,
        answer: `Absolutely! We provide detailed certificates of data destruction and recycling for your records.`
      }
    ];

    return faqs.map(faq => `
**Q: ${faq.question}**

A: ${faq.answer}
`).join('\n');
  }

  generateCTA(topic) {
    return `Ready to start with ${topic}? Contact us today for free pickup and certified disposal. Call +91-XXXX-XXXXXX or fill out our quick contact form.`;
  }

  // Generate multiple blog posts programmatically
  generateBlogPosts(count = 100) {
    const posts = [];
    const templateTypes = Object.keys(this.contentTemplates);
    
    for (let i = 0; i < count; i++) {
      const templateType = templateTypes[Math.floor(Math.random() * templateTypes.length)];
      const variables = this.generateRandomVariables(templateType);
      
      try {
        const post = this.generateContent(templateType, variables);
        posts.push({
          ...post,
          slug: this.generateSlug(post.title),
          published: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          author: 'EWaste Kochi Team',
          tags: this.generateTags(variables),
          canonical: variables.canonical || '',
          lastmod: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error generating post ${i}:`, error.message);
      }
    }

    return posts;
  }

  // Generate random variables for content generation
  generateRandomVariables(templateType) {
    const variables = {
      year: '2026',
      topic_lower: 'e-waste recycling',
      key_benefits: 'environmental protection and data security'
    };

    // Add template-specific variables
    switch (templateType) {
      case 'comprehensive-guide':
        variables.topic = this.contentVariables.topics[Math.floor(Math.random() * this.contentVariables.topics.length)];
        variables.topic_lower = variables.topic.toLowerCase();
        break;
        
      case 'comparison':
        variables.option1 = 'Local Scrap Dealer';
        variables.option2 = 'Authorized Recycler';
        break;
        
      case 'pricing-guide':
        variables.item = this.contentVariables.devices[Math.floor(Math.random() * this.contentVariables.devices.length)];
        break;
        
      case 'location-guide':
        variables.location = this.contentVariables.locations[Math.floor(Math.random() * this.contentVariables.locations.length)];
        variables.service = this.contentVariables.services[Math.floor(Math.random() * this.contentVariables.services.length)];
        break;
        
      case 'faq-post':
        variables.topic = this.contentVariables.topics[Math.floor(Math.random() * this.contentVariables.topics.length)];
        break;
    }

    return variables;
  }

  // Generate URL-friendly slug
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Generate tags for blog post
  generateTags(variables) {
    const tags = ['e-waste', 'kochi', 'recycling'];
    
    if (variables.topic) {
      tags.push(variables.topic.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (variables.location) {
      tags.push(variables.location.toLowerCase());
    }
    
    if (variables.item) {
      tags.push(variables.item.toLowerCase());
    }
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  // Generate blog posts for specific cluster
  generateClusterPosts(clusterName, count = 20) {
    const clusterTemplates = {
      'e-waste-basics': ['comprehensive-guide', 'location-guide', 'faq-post'],
      'data-security': ['comprehensive-guide', 'comparison', 'faq-post'],
      'buyback-pricing': ['pricing-guide', 'comparison', 'comprehensive-guide'],
      'location-specific': ['location-guide', 'comprehensive-guide']
    };

    const templates = clusterTemplates[clusterName] || ['comprehensive-guide'];
    const posts = [];

    for (let i = 0; i < count; i++) {
      const templateType = templates[Math.floor(Math.random() * templates.length)];
      const variables = this.generateClusterVariables(clusterName, templateType);
      
      try {
        const post = this.generateContent(templateType, variables);
        posts.push({
          ...post,
          slug: this.generateSlug(post.title),
          published: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          author: 'EWaste Kochi Team',
          tags: [...this.generateTags(variables), clusterName],
          cluster: clusterName,
          canonical: variables.canonical || '',
          lastmod: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error generating cluster post ${i}:`, error.message);
      }
    }

    return posts;
  }

  // Generate variables for specific cluster
  generateClusterVariables(clusterName, templateType) {
    const variables = this.generateRandomVariables(templateType);
    
    // Add cluster-specific variables
    switch (clusterName) {
      case 'e-waste-basics':
        variables.topic = 'e-waste recycling';
        variables.topic_lower = 'e-waste recycling';
        break;
        
      case 'data-security':
        variables.topic = 'data destruction';
        variables.topic_lower = 'data destruction';
        break;
        
      case 'buyback-pricing':
        variables.item = this.contentVariables.devices[Math.floor(Math.random() * this.contentVariables.devices.length)];
        break;
        
      case 'location-specific':
        variables.location = this.contentVariables.locations[Math.floor(Math.random() * this.contentVariables.locations.length)];
        break;
    }

    return variables;
  }

  // Generate automatic image alt text from title
  generateImageAltText(variables) {
    const title = variables.title || variables.topic || 'E-Waste Service';
    const location = variables.location || 'Kochi';
    
    // Clean and format title for alt text
    const cleanTitle = title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return `${cleanTitle} - EWaste Kochi`;
  }

  // Generate image URL based on content
  generateImageUrl(variables) {
    const slug = this.generateSlug(variables.title || variables.topic || 'e-waste-service');
    return `/images/blog/${slug}.webp`;
  }

  // Add automatic image markdown to content
  addImageToContent(content, variables) {
    const { url, alt } = this.generateImageAttributes(variables);
    const imageMarkdown = `![${alt}](${url})`;
    
    // Insert image after first paragraph or heading
    const firstParagraph = content.match(/\n\n(.+?)\n\n/);
    if (firstParagraph) {
      return content.replace(firstParagraph[0], `\n\n${firstParagraph[1]}\n\n${imageMarkdown}\n\n`);
    }
    
    // Fallback: add after first heading
    const firstHeading = content.match(/^#\s+.+$/m);
    if (firstHeading) {
      return content.replace(firstHeading[0], `${firstHeading[0]}\n\n${imageMarkdown}`);
    }
    
    // Last resort: add at beginning
    return `${imageMarkdown}\n\n${content}`;
  }

  // Generate complete image attributes
  generateImageAttributes(variables) {
    const altText = this.generateImageAltText(variables);
    const imageUrl = this.generateImageUrl(variables);
    
    return {
      url: imageUrl,
      alt: altText,
      title: altText,
      width: 1200,
      height: 630,
      loading: 'lazy',
      decoding: 'async'
    };
  }

  // Validate generated content
  validateGeneratedContent(post) {
    const issues = [];
    const score = 100;

    // Check word count
    if (post.wordCount < 1000) {
      issues.push('Content too short - should be at least 1000 words');
    }

    // Check title length
    if (post.title.length < 30 || post.title.length > 60) {
      issues.push('Title length should be between 30-60 characters');
    }

    // Check description length
    if (post.description.length < 120 || post.description.length > 160) {
      issues.push('Meta description should be between 120-160 characters');
    }

    // Check for headings
    const h1Count = (post.content.match(/^# /gm) || []).length;
    if (h1Count !== 1) {
      issues.push('Content should have exactly 1 H1 heading');
    }

    // Check for internal links
    if (!post.content.includes('[') || !post.content.includes('](')) {
      issues.push('Content should include internal links');
    }

    // Check for image alt text
    if (post.image && (!post.image.alt || post.image.alt.length < 10)) {
      issues.push('Image alt text should be descriptive and at least 10 characters');
    }

    return {
      score: Math.max(0, score - issues.length * 10),
      issues,
      valid: issues.length === 0
    };
  }
}

export default BlogContentGenerator;
