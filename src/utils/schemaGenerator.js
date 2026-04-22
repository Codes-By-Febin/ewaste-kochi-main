// Schema Generator - Dynamic structured data injection for SEO

class SchemaGenerator {
  constructor() {
    this.organizationData = {
      name: "EWaste Kochi",
      description: "Kerala's #1 Certified E-Waste Recycling & ITAD Services",
      url: "https://ewastekochi.com",
      logo: "https://ewastekochi.com/brand/ewastekochi-logo.svg",
      phone: "+919876543210",
      email: "info@ewastekochi.com",
      address: {
        streetAddress: "Infopark, Kakkanad",
        addressLocality: "Kochi",
        addressRegion: "Kerala",
        postalCode: "682042",
        addressCountry: "IN"
      },
      geo: {
        latitude: 10.0220,
        longitude: 76.3420
      },
      openingHours: "Mo-Fr 09:00-18:00",
      priceRange: "$$"
    };
  }

  // LocalBusiness schema
  generateLocalBusinessSchema(locationData = null) {
    const baseData = locationData || this.organizationData;
    
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": baseData.name,
      "description": baseData.description,
      "url": baseData.url,
      "telephone": baseData.phone,
      "email": baseData.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": baseData.address.streetAddress,
        "addressLocality": baseData.address.addressLocality,
        "addressRegion": baseData.address.addressRegion,
        "postalCode": baseData.address.postalCode,
        "addressCountry": baseData.address.addressCountry
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": baseData.geo.latitude,
        "longitude": baseData.geo.longitude
      },
      "openingHours": baseData.openingHours,
      "priceRange": baseData.priceRange,
      "image": baseData.logo,
      "logo": baseData.logo,
      "sameAs": [
        "https://www.facebook.com/ewastekochi",
        "https://www.linkedin.com/company/ewastekochi",
        "https://twitter.com/ewastekochi"
      ],
      "areaServed": [
        {
          "@type": "Place",
          "name": "Kochi"
        },
        {
          "@type": "Place", 
          "name": "Ernakulam"
        },
        {
          "@type": "Place",
          "name": "Kakkanad"
        },
        {
          "@type": "Place",
          "name": "Thrissur"
        },
        {
          "@type": "Place",
          "name": "Kozhikode"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "E-Waste Recycling Services",
        "numberOfItems": 20
      }
    };
  }

  // Service schema
  generateServiceSchema(serviceData) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceData.title,
      "description": serviceData.description,
      "provider": {
        "@type": "Organization",
        "name": this.organizationData.name,
        "url": this.organizationData.url
      },
      "areaServed": {
        "@type": "Place",
        "name": "Kochi, Kerala"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "E-Waste Recycling Services",
        "itemListElement": serviceData.features?.map((feature, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": feature,
            "provider": {
              "@type": "Organization",
              "name": this.organizationData.name
            }
          },
          "availability": "https://schema.org/InStock"
        }))
      },
      "serviceType": "E-Waste Recycling",
      "category": serviceData.category,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": this.organizationData.name
        }
      }
    };
  }

  // FAQ schema
  generateFAQSchema(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // BlogPosting schema
  generateBlogPostSchema(postData) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": postData.title,
      "description": postData.description,
      "image": postData.featured_image,
      "author": {
        "@type": "Person",
        "name": postData.author
      },
      "publisher": {
        "@type": "Organization",
        "name": this.organizationData.name,
        "logo": {
          "@type": "ImageObject",
          "url": this.organizationData.logo
        }
      },
      "datePublished": postData.publishDate.toISOString(),
      "dateModified": (postData.updateDate || postData.publishDate).toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://ewastekochi.com/blog/${postData.slug}/`
      },
      "wordCount": postData.word_count || 1000,
      "keywords": postData.tags?.join(", "),
      "articleSection": postData.category
    };
  }

  // CollectionPage schema
  generateCollectionPageSchema(pageData, items, itemType) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageData.title,
      "description": pageData.description,
      "url": `https://ewastekochi.com${pageData.path}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": items.length,
        "itemListElement": items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": itemType,
            "name": item.data.title,
            "description": item.data.description,
            "url": `https://ewastekochi.com/${itemType.toLowerCase()}s/${item.slug}/`
          }
        }))
      }
    };
  }

  // BreadcrumbList schema
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

  // WebSite schema
  generateWebSiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": this.organizationData.name,
      "description": this.organizationData.description,
      "url": this.organizationData.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ewastekochi.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": this.organizationData.name,
        "url": this.organizationData.url
      }
    };
  }

  // Review schema
  generateReviewSchema(reviewData) {
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": this.organizationData.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": reviewData.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": reviewData.author
      },
      "reviewBody": reviewData.content,
      "datePublished": reviewData.date,
      "publisher": {
        "@type": "Organization",
        "name": this.organizationData.name
      }
    };
  }

  // AggregateRating schema
  generateAggregateRatingSchema(reviews) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": this.organizationData.name
      },
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // HowTo schema for process steps
  generateHowToSchema(steps) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Recycle E-Waste with EWaste Kochi",
      "description": "Step-by-step guide to e-waste recycling process",
      "totalTime": "P1D", // 1 day typical process
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": "0"
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Electronic devices"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Phone for scheduling pickup"
        }
      ],
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.description,
        "image": step.image
      }))
    };
  }

  // VideoObject schema for video content
  generateVideoSchema(videoData) {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": videoData.title,
      "description": videoData.description,
      "thumbnailUrl": videoData.thumbnail,
      "uploadDate": videoData.uploadDate,
      "duration": videoData.duration,
      "contentUrl": videoData.url,
      "embedUrl": videoData.embedUrl,
      "publisher": {
        "@type": "Organization",
        "name": this.organizationData.name,
        "logo": {
          "@type": "ImageObject",
          "url": this.organizationData.logo
        }
      }
    };
  }

  // Combine multiple schemas
  combineSchemas(schemas) {
    return schemas.filter(schema => schema !== null);
  }

  // Generate JSON-LD script tag
  generateScriptTag(schemas) {
    const validSchemas = this.combineSchemas(schemas);
    if (validSchemas.length === 0) return '';

    const scriptContent = validSchemas.length === 1 
      ? JSON.stringify(validSchemas[0], null, 2)
      : JSON.stringify(validSchemas, null, 2);

    return `<script type="application/ld+json">${scriptContent}</script>`;
  }
}

export { SchemaGenerator };
