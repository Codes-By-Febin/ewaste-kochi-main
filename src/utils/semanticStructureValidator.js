// Semantic Structure Validator - HTML5 Semantic Elements and Schema Validation
// Ensures proper semantic HTML structure and schema markup for all page types

export class SemanticStructureValidator {
  constructor() {
    this.semanticRequirements = {
      // Service pages requirements
      services: {
        requiredElements: ['header', 'nav', 'main', 'section', 'footer'],
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Service', 'LocalBusiness'],
        recommendedElements: ['article', 'aside', 'figure', 'time'],
        headingStructure: {
          h1: 1,
          h2: '2+',
          h3: 'optional'
        }
      },

      // Location pages requirements
      locations: {
        requiredElements: ['header', 'nav', 'main', 'section', 'footer'],
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Place', 'LocalBusiness'],
        recommendedElements: ['article', 'aside', 'figure', 'address'],
        headingStructure: {
          h1: 1,
          h2: '2+',
          h3: 'optional'
        }
      },

      // Blog pages requirements
      blog: {
        requiredElements: ['header', 'nav', 'main', 'article', 'footer'],
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['BlogPosting', 'BreadcrumbList'],
        recommendedElements: ['section', 'aside', 'figure', 'time', 'blockquote'],
        headingStructure: {
          h1: 1,
          h2: '2+',
          h3: '2+'
        }
      },

      // Buyback pages requirements
      buyback: {
        requiredElements: ['header', 'nav', 'main', 'section', 'footer'],
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Product', 'LocalBusiness'],
        recommendedElements: ['article', 'aside', 'figure', 'table'],
        headingStructure: {
          h1: 1,
          h2: '2+',
          h3: 'optional'
        }
      },

      // Homepage requirements
      homepage: {
        requiredElements: ['header', 'nav', 'main', 'section', 'footer'],
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['LocalBusiness', 'WebSite'],
        recommendedElements: ['article', 'aside', 'figure', 'section'],
        headingStructure: {
          h1: 1,
          h2: '3+',
          h3: 'optional'
        }
      }
    };

    this.schemaTemplates = {
      Service: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "",
        "description": "",
        "provider": {
          "@type": "LocalBusiness",
          "name": "EWaste Kochi",
          "url": "https://www.ewastekochi.com"
        },
        "areaServed": {
          "@type": "Place",
          "name": "Kochi"
        },
        "serviceType": "E-Waste Management"
      },

      Product: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "",
        "description": "",
        "brand": "",
        "offers": {
          "@type": "Offer",
          "price": "",
          "priceCurrency": "INR",
          "seller": {
            "@type": "LocalBusiness",
            "name": "EWaste Kochi"
          }
        }
      },

      Place: {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": "",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kochi",
          "addressRegion": "Kerala"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "",
          "longitude": ""
        }
      },

      LocalBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "EWaste Kochi",
        "url": "https://www.ewastekochi.com",
        "telephone": "+91-XXXX-XXXXXX",
        "email": "hello@ewastekochi.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kochi",
          "addressRegion": "Kerala",
          "postalCode": ""
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "9.9312",
          "longitude": "76.2673"
        },
        "openingHours": "Mo-Su 09:00-18:00",
        "sameAs": [
          "https://www.facebook.com/ewastekochi",
          "https://www.instagram.com/ewastekochi"
        ]
      },

      BlogPosting: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "",
        "description": "",
        "author": {
          "@type": "Organization",
          "name": "EWaste Kochi Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "EWaste Kochi"
        },
        "datePublished": "",
        "dateModified": "",
        "mainEntityOfPage": "",
        "image": "",
        "articleSection": "E-Waste Management"
      },

      BreadcrumbList: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
      },

      WebSite: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EWaste Kochi",
        "url": "https://www.ewastekochi.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.ewastekochi.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    };
  }

  // Validate semantic structure of a page
  validateSemanticStructure(htmlContent, pageType) {
    const requirements = this.semanticRequirements[pageType];
    if (!requirements) {
      return {
        valid: false,
        error: `Unknown page type: ${pageType}`,
        issues: []
      };
    }

    const validation = {
      valid: true,
      issues: [],
      missingElements: [],
      missingHeadings: [],
      missingSchema: [],
      headingIssues: [],
      accessibilityIssues: [],
      recommendations: []
    };

    // Check required semantic elements
    requirements.requiredElements.forEach(element => {
      if (!htmlContent.includes(`<${element}`)) {
        validation.missingElements.push(element);
        validation.issues.push(`Missing required semantic element: <${element}>`);
        validation.valid = false;
      }
    });

    // Check heading structure
    const headingCounts = this.countHeadings(htmlContent);
    Object.entries(requirements.headingStructure).forEach(([heading, expected]) => {
      const count = headingCounts[heading] || 0;
      
      if (typeof expected === 'number') {
        if (count !== expected) {
          validation.headingIssues.push(
            `Expected ${expected} <${heading}> tag(s), found ${count}`
          );
          if (expected > 0) validation.valid = false;
        }
      } else if (expected === '2+') {
        if (count < 2) {
          validation.headingIssues.push(
            `Expected at least 2 <${heading}> tags, found ${count}`
          );
          validation.valid = false;
        }
      }
    });

    // Check for proper heading hierarchy
    const hierarchyIssues = this.validateHeadingHierarchy(htmlContent);
    validation.headingIssues.push(...hierarchyIssues);
    if (hierarchyIssues.length > 0) validation.valid = false;

    // Check accessibility
    const accessibilityIssues = this.validateAccessibility(htmlContent);
    validation.accessibilityIssues.push(...accessibilityIssues);

    // Generate recommendations
    validation.recommendations = this.generateRecommendations(validation, pageType);

    return validation;
  }

  // Count heading elements in HTML
  countHeadings(htmlContent) {
    const headings = {};
    for (let i = 1; i <= 6; i++) {
      const regex = new RegExp(`<h${i}[^>]*>`, 'gi');
      const matches = htmlContent.match(regex);
      headings[`h${i}`] = matches ? matches.length : 0;
    }
    return headings;
  }

  // Validate heading hierarchy
  validateHeadingHierarchy(htmlContent) {
    const issues = [];
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    let match;
    let previousLevel = 0;

    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const currentLevel = parseInt(match[1]);
      
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push(
          `Heading hierarchy violation: <h${currentLevel}> cannot follow <h${previousLevel}> directly`
        );
      }
      
      previousLevel = currentLevel;
    }

    return issues;
  }

  // Validate accessibility
  validateAccessibility(htmlContent) {
    const issues = [];

    // Check for alt attributes on images
    const imgRegex = /<img[^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      if (!match[0].includes('alt=')) {
        issues.push('Image missing alt attribute for accessibility');
      }
    }

    // Check for proper form labels
    const inputRegex = /<input[^>]*>/gi;
    while ((match = inputRegex.exec(htmlContent)) !== null) {
      if (!match[0].includes('aria-label=') && !match[0].includes('id=')) {
        issues.push('Input element missing label or aria-label');
      }
    }

    // Check for proper link text
    const linkRegex = /<a[^>]*>(.*?)<\/a>/gi;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const linkText = match[1].trim();
      if (linkText === '' || linkText === 'click here' || linkText === 'read more') {
        issues.push('Link has non-descriptive text for accessibility');
      }
    }

    // Check for proper heading structure
    const h1Count = (htmlContent.match(/<h1/gi) || []).length;
    if (h1Count === 0) {
      issues.push('Page missing H1 heading for accessibility');
    } else if (h1Count > 1) {
      issues.push('Page has multiple H1 headings, should have exactly one');
    }

    return issues;
  }

  // Generate schema markup for page type
  generateSchemaMarkup(pageType, pageData = {}) {
    const schemas = [];
    const requirements = this.semanticRequirements[pageType];

    if (!requirements) {
      return { schemas: [], error: `Unknown page type: ${pageType}` };
    }

    // Generate required schemas
    requirements.requiredSchema.forEach(schemaType => {
      const template = this.schemaTemplates[schemaType];
      if (template) {
        const schema = this.populateSchemaTemplate(template, pageData, schemaType);
        schemas.push(schema);
      }
    });

    // Generate breadcrumb list for all pages except homepage
    if (pageType !== 'homepage') {
      const breadcrumbSchema = this.generateBreadcrumbSchema(pageData.breadcrumbs || []);
      schemas.push(breadcrumbSchema);
    }

    return { schemas, error: null };
  }

  // Populate schema template with page data
  populateSchemaTemplate(template, pageData, schemaType) {
    const schema = JSON.parse(JSON.stringify(template)); // Deep clone

    switch (schemaType) {
      case 'Service':
        schema.name = pageData.title || schema.name;
        schema.description = pageData.description || schema.description;
        schema.serviceType = pageData.serviceType || schema.serviceType;
        break;

      case 'Product':
        schema.name = pageData.title || schema.name;
        schema.description = pageData.description || schema.description;
        schema.brand = pageData.brand || schema.brand;
        if (pageData.price) {
          schema.offers.price = pageData.price;
        }
        break;

      case 'Place':
        schema.name = pageData.location || schema.name;
        if (pageData.address) {
          schema.address = { ...schema.address, ...pageData.address };
        }
        if (pageData.coordinates) {
          schema.geo = { ...schema.geo, ...pageData.coordinates };
        }
        break;

      case 'BlogPosting':
        schema.headline = pageData.title || schema.headline;
        schema.description = pageData.description || schema.description;
        schema.datePublished = pageData.publishedDate || schema.datePublished;
        schema.dateModified = pageData.lastModified || schema.dateModified;
        schema.mainEntityOfPage = pageData.url || schema.mainEntityOfPage;
        schema.image = pageData.image || schema.image;
        break;

      case 'LocalBusiness':
        if (pageData.businessName) {
          schema.name = pageData.businessName;
        }
        if (pageData.telephone) {
          schema.telephone = pageData.telephone;
        }
        if (pageData.email) {
          schema.email = pageData.email;
        }
        break;

      case 'WebSite':
        schema.name = pageData.siteName || schema.name;
        schema.url = pageData.siteUrl || schema.url;
        break;
    }

    return schema;
  }

  // Generate breadcrumb schema
  generateBreadcrumbSchema(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  // Generate recommendations based on validation
  generateRecommendations(validation, pageType) {
    const recommendations = [];

    if (validation.missingElements.length > 0) {
      recommendations.push({
        priority: 'high',
        type: 'semantic_structure',
        issue: 'Missing required semantic elements',
        solution: `Add missing elements: ${validation.missingElements.join(', ')}`,
        impact: 'Improves SEO and accessibility'
      });
    }

    if (validation.headingIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        type: 'heading_structure',
        issue: 'Heading structure problems',
        solution: 'Fix heading hierarchy and ensure proper H1 usage',
        impact: 'Critical for SEO and accessibility'
      });
    }

    if (validation.accessibilityIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'accessibility',
        issue: 'Accessibility problems detected',
        solution: 'Add alt attributes, form labels, and descriptive link text',
        impact: 'Improves user experience and SEO'
      });
    }

    // Add page-specific recommendations
    const requirements = this.semanticRequirements[pageType];
    if (requirements && requirements.recommendedElements) {
      recommendations.push({
        priority: 'low',
        type: 'enhancement',
        issue: 'Missing recommended semantic elements',
        solution: `Consider adding: ${requirements.recommendedElements.join(', ')}`,
        impact: 'Enhances semantic structure and SEO'
      });
    }

    return recommendations;
  }

  // Validate schema markup
  validateSchemaMarkup(schemaObject) {
    const validation = {
      valid: true,
      issues: [],
      warnings: [],
      recommendations: []
    };

    // Check for required fields based on schema type
    if (schemaObject['@type']) {
      const schemaType = schemaObject['@type'];
      const requiredFields = this.getRequiredSchemaFields(schemaType);
      
      requiredFields.forEach(field => {
        if (!schemaObject[field]) {
          validation.issues.push(`Missing required field: ${field} for ${schemaType} schema`);
          validation.valid = false;
        }
      });

      // Check for recommended fields
      const recommendedFields = this.getRecommendedSchemaFields(schemaType);
      recommendedFields.forEach(field => {
        if (!schemaObject[field]) {
          validation.warnings.push(`Missing recommended field: ${field} for ${schemaType} schema`);
        }
      });
    } else {
      validation.issues.push('Schema missing @type field');
      validation.valid = false;
    }

    return validation;
  }

  // Get required fields for schema type
  getRequiredSchemaFields(schemaType) {
    const requiredFields = {
      Service: ['name', 'description'],
      Product: ['name', 'description'],
      Place: ['name'],
      LocalBusiness: ['name'],
      BlogPosting: ['headline', 'description', 'datePublished'],
      BreadcrumbList: ['itemListElement'],
      WebSite: ['name', 'url']
    };

    return requiredFields[schemaType] || [];
  }

  // Get recommended fields for schema type
  getRecommendedSchemaFields(schemaType) {
    const recommendedFields = {
      Service: ['provider', 'areaServed'],
      Product: ['brand', 'offers'],
      Place: ['address', 'geo'],
      LocalBusiness: ['telephone', 'address'],
      BlogPosting: ['author', 'publisher', 'image'],
      WebSite: ['potentialAction']
    };

    return recommendedFields[schemaType] || [];
  }

  // Generate complete validation report
  generateValidationReport(htmlContent, pageType, pageData = {}) {
    const semanticValidation = this.validateSemanticStructure(htmlContent, pageType);
    const schemaGeneration = this.generateSchemaMarkup(pageType, pageData);
    
    const report = {
      pageType,
      valid: semanticValidation.valid,
      semanticValidation,
      schemaGeneration,
      overallScore: this.calculateOverallScore(semanticValidation, schemaGeneration),
      actionItems: this.generateActionItems(semanticValidation, schemaGeneration)
    };

    return report;
  }

  // Calculate overall validation score
  calculateOverallScore(semanticValidation, schemaGeneration) {
    let score = 100;

    // Deduct points for semantic issues
    score -= semanticValidation.missingElements.length * 15;
    score -= semanticValidation.headingIssues.length * 10;
    score -= semanticValidation.accessibilityIssues.length * 5;

    // Deduct points for schema issues
    if (schemaGeneration.error) {
      score -= 20;
    }

    return Math.max(0, score);
  }

  // Generate action items
  generateActionItems(semanticValidation, schemaGeneration) {
    const actionItems = [];

    // High priority items
    if (semanticValidation.missingElements.length > 0) {
      actionItems.push({
        priority: 'high',
        action: 'Add missing semantic elements',
        details: semanticValidation.missingElements.join(', ')
      });
    }

    if (semanticValidation.headingIssues.length > 0) {
      actionItems.push({
        priority: 'high',
        action: 'Fix heading structure',
        details: semanticValidation.headingIssues.join('; ')
      });
    }

    // Medium priority items
    if (semanticValidation.accessibilityIssues.length > 0) {
      actionItems.push({
        priority: 'medium',
        action: 'Improve accessibility',
        details: semanticValidation.accessibilityIssues.slice(0, 3).join('; ')
      });
    }

    // Low priority items
    if (semanticValidation.recommendations.length > 0) {
      actionItems.push({
        priority: 'low',
        action: 'Enhance semantic structure',
        details: semanticValidation.recommendations.slice(0, 2).join('; ')
      });
    }

    return actionItems;
  }
}

export default SemanticStructureValidator;
