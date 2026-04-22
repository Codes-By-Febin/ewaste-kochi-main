// Trust Signal Optimizer - Add local trust signals and certifications to titles/meta
class TrustSignalOptimizer {
  constructor() {
    this.trustSignals = {
      certifications: [
        'KSPCB Authorized',
        'KSPCB Certified',
        'Certified Data Destruction',
        'NIST 800-88 Compliant',
        'ISO 9001 Certified',
        'ISO 27001 Certified',
        'ISO 14001 Certified',
        'CPCB Authorized',
        'Government Approved',
        'Licensed Recycler'
      ],
      
      trustBadges: [
        'Trusted by 500+ Businesses',
        'Serving 10,000+ Customers',
        '5+ Years Experience',
        '24/7 Emergency Service',
        'Same Day Pickup',
        'Free Data Destruction',
        '100% Data Security',
        'Zero Landfill Policy',
        'Environmental Award Winner',
        'Best Service Award 2025'
      ],
      
      localSignals: [
        'Kochi Based Company',
        'Local Kerala Business',
        'Serving All Kerala',
        'Infopark Certified Partner',
        'Kakkanad Headquarters',
        'Ernakulam Service Center',
        'Local Expert Team',
        'Kerala Owned & Operated',
        'Supporting Local Economy',
        'Community Trusted'
      ],
      
      guarantees: [
        'Best Price Guarantee',
        '100% Satisfaction',
        'Instant Payment',
        'Free Pickup Guarantee',
        'Data Security Guarantee',
        'Environmental Compliance',
        'Certified Documentation',
        'Professional Service',
        'On-Time Service',
        'Quality Assurance'
      ]
    };

    this.contentTypeMapping = {
      service: {
        priority: ['certifications', 'guarantees', 'localSignals', 'trustBadges'],
        maxSignals: 3
      },
      blog: {
        priority: ['certifications', 'trustBadges', 'localSignals', 'guarantees'],
        maxSignals: 2
      },
      location: {
        priority: ['localSignals', 'certifications', 'trustBadges', 'guarantees'],
        maxSignals: 3
      }
    };
  }

  // Optimize title with trust signals
  optimizeTitle(title, contentType, location = 'Kochi') {
    const signals = this.contentTypeMapping[contentType];
    let optimizedTitle = title;
    let addedSignals = [];

    // Add location if not present
    if (!title.includes(location) && !title.includes('Kochi') && !title.includes('Kerala')) {
      optimizedTitle += ` ${location}`;
    }

    // Add trust signals based on content type and priority
    signals.priority.forEach(signalType => {
      if (addedSignals.length >= signals.maxSignals) return;
      
      const signal = this.getBestSignal(signalType, title, contentType);
      if (signal && !this.hasSignal(optimizedTitle, signal)) {
        optimizedTitle += ` | ${signal}`;
        addedSignals.push(signal);
      }
    });

    return optimizedTitle;
  }

  // Optimize meta description with trust signals
  optimizeMetaDescription(description, contentType, location = 'Kochi') {
    let optimizedDescription = description;
    const signals = this.contentTypeMapping[contentType];
    let addedSignals = [];

    // Add location if not present
    if (!description.includes(location) && !description.includes('Kochi') && !description.includes('Kerala')) {
      optimizedDescription = `${location}'s leading ${optimizedDescription}`;
    }

    // Add trust signals without making description too long
    const maxDescriptionLength = 160;
    signals.priority.forEach(signalType => {
      if (addedSignals.length >= 2) return;
      if (optimizedDescription.length > maxDescriptionLength - 20) return;
      
      const signal = this.getBestSignal(signalType, description, contentType);
      if (signal && !this.hasSignal(optimizedDescription, signal)) {
        optimizedDescription += `. ${signal}`;
        addedSignals.push(signal);
      }
    });

    return optimizedDescription.substring(0, maxDescriptionLength);
  }

  // Get best trust signal for content type
  getBestSignal(signalType, content, contentType) {
    const signals = this.trustSignals[signalType];
    
    // Content-based signal selection
    if (signalType === 'certifications') {
      if (content.toLowerCase().includes('data') || content.toLowerCase().includes('security')) {
        return 'NIST 800-88 Compliant';
      }
      if (content.toLowerCase().includes('environment') || content.toLowerCase().includes('green')) {
        return 'ISO 14001 Certified';
      }
      if (content.toLowerCase().includes('quality') || content.toLowerCase().includes('professional')) {
        return 'ISO 9001 Certified';
      }
      return 'KSPCB Authorized';
    }
    
    if (signalType === 'trustBadges') {
      if (contentType === 'service') {
        return 'Trusted by 500+ Businesses';
      }
      if (content.toLowerCase().includes('price') || content.toLowerCase().includes('cost')) {
        return 'Best Price Guarantee';
      }
      return '5+ Years Experience';
    }
    
    if (signalType === 'localSignals') {
      if (content.toLowerCase().includes('infopark') || content.toLowerCase().includes('it')) {
        return 'Infopark Certified Partner';
      }
      return 'Kochi Based Company';
    }
    
    if (signalType === 'guarantees') {
      if (content.toLowerCase().includes('pickup') || content.toLowerCase().includes('collection')) {
        return 'Free Pickup Guarantee';
      }
      if (content.toLowerCase().includes('data') || content.toLowerCase().includes('security')) {
        return '100% Data Security';
      }
      return 'Best Price Guarantee';
    }
    
    return signals[0]; // Default to first signal
  }

  // Check if content already has signal
  hasSignal(content, signal) {
    return content.toLowerCase().includes(signal.toLowerCase());
  }

  // Generate structured schema with trust signals
  generateTrustSchema(contentType, data) {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": this.getSchemaType(contentType),
      "name": data.title,
      "description": data.description,
      "url": `https://ewastekochi.com${data.url}`
    };

    // Add trust signals based on content type
    if (contentType === 'service') {
      baseSchema.provider = {
        "@type": "Organization",
        "name": "EWaste Kochi",
        "description": "KSPCB Authorized E-Waste Recycling Services in Kerala",
        "url": "https://ewastekochi.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kochi",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        "certification": [
          {
            "@type": "Certification",
            "name": "KSPCB Authorization",
            "description": "Kerala State Pollution Control Board Authorized E-Waste Recycler"
          },
          {
            "@type": "Certification", 
            "name": "ISO 9001",
            "description": "Quality Management System Certification"
          },
          {
            "@type": "Certification",
            "name": "ISO 27001", 
            "description": "Information Security Management System Certification"
          }
        ],
        "award": [
          {
            "@type": "Award",
            "name": "Best E-Waste Service 2025",
            "description": "Awarded for excellence in e-waste recycling services"
          }
        ]
      };
    }

    return baseSchema;
  }

  // Get schema type based on content type
  getSchemaType(contentType) {
    const schemaTypes = {
      service: 'Service',
      blog: 'BlogPosting',
      location: 'LocalBusiness'
    };
    
    return schemaTypes[contentType] || 'WebPage';
  }

  // Generate trust badges HTML
  generateTrustBadges(contentType, priority = 'high') {
    const badges = [];
    
    if (priority === 'high') {
      badges.push(
        this.createBadge('KSPCB Authorized', 'certification'),
        this.createBadge('Trusted by 500+ Businesses', 'trust'),
        this.createBadge('Best Price Guarantee', 'guarantee')
      );
    } else {
      badges.push(
        this.createBadge('5+ Years Experience', 'trust'),
        this.createBadge('Free Pickup', 'service')
      );
    }

    return badges.join('');
  }

  // Create individual badge HTML
  createBadge(text, type) {
    const badgeClasses = {
      certification: 'bg-green-100 text-green-800 border-green-200',
      trust: 'bg-blue-100 text-blue-800 border-blue-200',
      guarantee: 'bg-purple-100 text-purple-800 border-purple-200',
      service: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    return `
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badgeClasses[type]}">
        ${text}
      </span>
    `;
  }

  // Generate customer testimonials with trust signals
  generateTestimonials(count = 3) {
    const testimonials = [
      {
        name: "Rajesh Kumar",
        company: "Tech Solutions India",
        content: "Excellent KSPCB certified service. Professional data destruction and competitive prices.",
        rating: 5,
        trustSignals: ['KSPCB Authorized', 'Data Security Certified']
      },
      {
        name: "Anjali Nair", 
        company: "Infopark IT Services",
        content: "Trusted local provider with 5+ years experience. Same day pickup and best prices guaranteed.",
        rating: 5,
        trustSignals: ['Local Expert', 'Fast Service']
      },
      {
        name: "Michael Thomas",
        company: "Kochi Financial Services",
        content: "Professional team with ISO certifications. Environmental compliance and complete documentation.",
        rating: 5,
        trustSignals: ['ISO Certified', 'Compliance Guaranteed']
      }
    ];

    return testimonials.slice(0, count);
  }

  // Generate FAQ with trust signals
  generateFAQWithTrust(faqs) {
    return faqs.map(faq => ({
      ...faq,
      trustSignals: this.getFAQTrustSignals(faq.question)
    }));
  }

  // Get trust signals for FAQ
  getFAQTrustSignals(question) {
    const signals = [];
    
    if (question.toLowerCase().includes('certified') || question.toLowerCase().includes('authorized')) {
      signals.push('KSPCB Authorized');
    }
    if (question.toLowerCase().includes('data') || question.toLowerCase().includes('security')) {
      signals.push('100% Data Security');
    }
    if (question.toLowerCase().includes('price') || question.toLowerCase().includes('cost')) {
      signals.push('Best Price Guarantee');
    }
    
    return signals;
  }

  // Optimize content with trust signals
  optimizeContent(content, contentType) {
    let optimizedContent = content;
    
    // Add trust signal mentions naturally in content
    const trustMentions = {
      service: [
        'As a KSPCB authorized e-waste recycler',
        'Our ISO 9001 certified processes',
        'Trusted by over 500 businesses in Kerala',
        'We guarantee the best prices',
        'Our local Kochi team provides'
      ],
      blog: [
        'KSPCB certified recyclers in Kochi',
        'According to Kerala environmental regulations',
        'Local businesses trust our services',
        '5+ years of experience in Kerala'
      ]
    };

    if (trustMentions[contentType]) {
      trustMentions[contentType].forEach((mention, index) => {
        if (!optimizedContent.includes(mention)) {
          // Insert mention at appropriate position
          const sentences = optimizedContent.split('. ');
          if (sentences.length > index + 1) {
            sentences.splice(index + 1, 0, mention + '.');
            optimizedContent = sentences.join('. ');
          }
        }
      });
    }

    return optimizedContent;
  }

  // Generate complete trust optimization package
  generateTrustPackage(data, contentType) {
    return {
      optimizedTitle: this.optimizeTitle(data.title, contentType),
      optimizedDescription: this.optimizeMetaDescription(data.description, contentType),
      schema: this.generateTrustSchema(contentType, data),
      trustBadges: this.generateTrustBadges(contentType),
      testimonials: this.generateTestimonials(),
      optimizedContent: this.optimizeContent(data.content || '', contentType),
      breadcrumbs: this.generateTrustBreadcrumbs(data.url, contentType)
    };
  }

  // Generate breadcrumbs with trust signals
  generateTrustBreadcrumbs(url, contentType) {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'EWaste Kochi', url: '/' }
    ];

    if (contentType === 'service') {
      breadcrumbs.push({ name: 'KSPCB Certified Services', url: '/services/' });
    } else if (contentType === 'blog') {
      breadcrumbs.push({ name: 'Expert Blog', url: '/blog/' });
    } else if (contentType === 'location') {
      breadcrumbs.push({ name: 'Kerala Locations', url: '/locations/' });
    }

    return breadcrumbs;
  }

  // Validate trust signal optimization
  validateOptimization(originalData, optimizedData) {
    const validation = {
      titleImproved: false,
      descriptionImproved: false,
      trustSignalsAdded: 0,
      localSignalsAdded: 0,
      certificationsAdded: 0,
      score: 0
    };

    // Check title improvements
    if (optimizedData.title.length > originalData.title.length) {
      validation.titleImproved = true;
    }

    // Check description improvements
    if (optimizedData.description.length > originalData.description.length) {
      validation.descriptionImproved = true;
    }

    // Count trust signals
    const allTrustSignals = [
      ...this.trustSignals.certifications,
      ...this.trustSignals.trustBadges,
      ...this.trustSignals.localSignals,
      ...this.trustSignals.guarantees
    ];

    allTrustSignals.forEach(signal => {
      if (optimizedData.title.includes(signal) || optimizedData.description.includes(signal)) {
        validation.trustSignalsAdded++;
        
        if (this.trustSignals.certifications.includes(signal)) {
          validation.certificationsAdded++;
        }
        if (this.trustSignals.localSignals.includes(signal)) {
          validation.localSignalsAdded++;
        }
      }
    });

    // Calculate optimization score
    validation.score = Math.min(100, (
      (validation.titleImproved ? 20 : 0) +
      (validation.descriptionImproved ? 20 : 0) +
      (validation.certificationsAdded * 15) +
      (validation.localSignalsAdded * 10) +
      (validation.trustSignalsAdded * 5)
    ));

    return validation;
  }
}

export { TrustSignalOptimizer };
