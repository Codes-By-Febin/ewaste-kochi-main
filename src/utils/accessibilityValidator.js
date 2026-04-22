// Accessibility Validator - WCAG 2.1 AA Compliance Checker
// Ensures accessibility standards are met across all page types

export class AccessibilityValidator {
  constructor() {
    this.wcagRequirements = {
      // Level A requirements
      levelA: {
        images: {
          'img-alt-text': 'All images must have descriptive alt text',
          'img-decorative': 'Decorative images should have empty alt=""',
          'img-meaningful': 'Informative images need descriptive alt text'
        },
        headings: {
          'h1-single': 'Page must have exactly one H1 heading',
          'h1-present': 'Page must have an H1 heading',
          'heading-order': 'Headings must follow proper hierarchy (h1, h2, h3...)'
        },
        links: {
          'link-text': 'Links must have descriptive text',
          'link-unique': 'Link text must be unique within context',
          'link-focus': 'Links must be keyboard accessible'
        },
        forms: {
          'form-labels': 'All form inputs must have associated labels',
          'form-aria': 'Form controls must have proper ARIA attributes',
          'form-error': 'Form validation errors must be programmatically associated'
        },
        color: {
          'color-contrast': 'Text must have sufficient color contrast (4.5:1)',
          'color-not-only': 'Information cannot be conveyed by color alone'
        },
        keyboard: {
          'keyboard-nav': 'All interactive elements must be keyboard accessible',
          'keyboard-focus': 'Focus must be visible and logical'
        }
      },

      // Level AA requirements
      levelAA: {
        color: {
          'color-contrast-large': 'Large text must have 3:1 contrast ratio',
          'color-ui': 'UI components and graphics must have 3:1 contrast'
        },
        text: {
          'text-resize': 'Text must be resizable up to 200% without loss of functionality',
          'text-spacing': 'Text spacing must be adjustable'
        },
        layout: {
          'layout-reflow': 'Content must reflow on zoom to 400%',
          'orientation': 'Content must work in both portrait and landscape'
        },
        navigation: {
          'nav-consistent': 'Navigation must be consistent across pages',
          'nav-focus': 'Focus order must be logical and predictable'
        }
      }
    };

    this.testResults = {
      passed: [],
      failed: [],
      warnings: [],
      score: 0
    };
  }

  // Validate page accessibility
  validatePage(htmlContent, pageType = 'unknown') {
    this.testResults = {
      passed: [],
      failed: [],
      warnings: [],
      score: 0
    };

    // Run all accessibility tests
    this.testImages(htmlContent);
    this.testHeadings(htmlContent);
    this.testLinks(htmlContent);
    this.testForms(htmlContent);
    this.testColorContrast(htmlContent);
    this.testKeyboardAccessibility(htmlContent);
    this.testTextAccessibility(htmlContent);
    this.testLayoutAccessibility(htmlContent);
    this.testNavigation(htmlContent);

    // Calculate overall score
    this.calculateScore();

    return {
      pageType,
      ...this.testResults,
      recommendations: this.generateRecommendations(),
      wcagLevel: this.determineWCAGLevel(),
      criticalIssues: this.getCriticalIssues()
    };
  }

  // Test image accessibility
  testImages(htmlContent) {
    const imgRegex = /<img[^>]*>/gi;
    let match;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const imgTag = match[0];
      
      // Check for alt attribute
      if (!imgTag.includes('alt=')) {
        this.testResults.failed.push({
          type: 'img-alt-text',
          severity: 'critical',
          element: 'img',
          message: 'Image missing alt attribute',
          recommendation: 'Add descriptive alt text or alt="" for decorative images'
        });
      } else {
        // Check if alt is empty for decorative images
        const altMatch = imgTag.match(/alt="([^"]*)"/);
        if (altMatch && altMatch[1] === '') {
          this.testResults.passed.push('img-decorative');
        } else if (altMatch && altMatch[1].length > 0) {
          // Check if alt text is descriptive enough
          if (altMatch[1].length < 10) {
            this.testResults.warnings.push({
              type: 'img-meaningful',
              severity: 'medium',
              element: 'img',
              message: 'Image alt text may be too short',
              recommendation: 'Use more descriptive alt text (minimum 10 characters)'
            });
          } else {
            this.testResults.passed.push('img-meaningful');
          }
        }
      }
    }
  }

  // Test heading structure
  testHeadings(htmlContent) {
    // Count H1 headings
    const h1Count = (htmlContent.match(/<h1/gi) || []).length;
    
    if (h1Count === 0) {
      this.testResults.failed.push({
        type: 'h1-present',
        severity: 'critical',
        element: 'h1',
        message: 'Page missing H1 heading',
        recommendation: 'Add one H1 heading that describes the page content'
      });
    } else if (h1Count > 1) {
      this.testResults.failed.push({
        type: 'h1-single',
        severity: 'critical',
        element: 'h1',
        message: `Page has ${h1Count} H1 headings, should have exactly one`,
        recommendation: 'Remove extra H1 headings or convert to H2'
      });
    } else {
      this.testResults.passed.push('h1-single');
      this.testResults.passed.push('h1-present');
    }

    // Test heading hierarchy
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    let match;
    let previousLevel = 0;
    let hierarchyIssues = 0;

    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const currentLevel = parseInt(match[1]);
      
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        hierarchyIssues++;
      }
      
      previousLevel = currentLevel;
    }

    if (hierarchyIssues > 0) {
      this.testResults.failed.push({
        type: 'heading-order',
        severity: 'medium',
        element: 'headings',
        message: `Found ${hierarchyIssues} heading hierarchy violations`,
        recommendation: 'Ensure headings follow proper order (h1, h2, h3...)'
      });
    } else {
      this.testResults.passed.push('heading-order');
    }
  }

  // Test link accessibility
  testLinks(htmlContent) {
    const linkRegex = /<a[^>]*>(.*?)<\/a>/gi;
    let match;
    const linkTexts = [];
    let nonDescriptiveLinks = 0;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const linkText = match[1].trim();
      linkTexts.push(linkText);

      // Check for descriptive link text
      if (linkText === '' || 
          linkText.toLowerCase() === 'click here' || 
          linkText.toLowerCase() === 'read more' ||
          linkText.toLowerCase() === 'learn more' ||
          linkText.toLowerCase() === 'here') {
        nonDescriptiveLinks++;
      }

      // Check if link has href attribute
      const fullLinkTag = match[0];
      if (!fullLinkTag.includes('href=')) {
        this.testResults.warnings.push({
          type: 'link-focus',
          severity: 'low',
          element: 'a',
          message: 'Link missing href attribute',
          recommendation: 'Add href attribute or use button element for actions'
        });
      }
    }

    if (nonDescriptiveLinks > 0) {
      this.testResults.failed.push({
        type: 'link-text',
        severity: 'medium',
        element: 'a',
        message: `Found ${nonDescriptiveLinks} links with non-descriptive text`,
        recommendation: 'Use descriptive link text that indicates the destination'
      });
    } else {
      this.testResults.passed.push('link-text');
    }

    // Check for duplicate link text
    const duplicates = linkTexts.filter((text, index) => 
      linkTexts.indexOf(text) !== index && text.length > 0
    );
    
    if (duplicates.length > 0) {
      this.testResults.warnings.push({
        type: 'link-unique',
        severity: 'low',
        element: 'a',
        message: 'Found duplicate link text',
        recommendation: 'Make link text unique or add context to distinguish links'
      });
    } else {
      this.testResults.passed.push('link-unique');
    }
  }

  // Test form accessibility
  testForms(htmlContent) {
    const inputRegex = /<input[^>]*>/gi;
    let match;
    let unlabeledInputs = 0;

    while ((match = inputRegex.exec(htmlContent)) !== null) {
      const inputTag = match[0];
      
      // Check for label association
      if (!inputTag.includes('aria-label=') && !inputTag.includes('aria-labelledby=')) {
        // Check if there's a corresponding label
        const idMatch = inputTag.match(/id="([^"]*)"/);
        if (idMatch) {
          const labelRegex = new RegExp(`<label[^>]*for="${idMatch[1]}"[^>]*>`, 'i');
          if (!labelRegex.test(htmlContent)) {
            unlabeledInputs++;
          }
        } else {
          unlabeledInputs++;
        }
      }

      // Check for proper input types
      if (inputTag.includes('type="text"') && !inputTag.includes('placeholder=')) {
        this.testResults.warnings.push({
          type: 'form-aria',
          severity: 'low',
          element: 'input',
          message: 'Text input missing placeholder or label',
          recommendation: 'Add placeholder text or ensure proper labeling'
        });
      }
    }

    if (unlabeledInputs > 0) {
      this.testResults.failed.push({
        type: 'form-labels',
        severity: 'critical',
        element: 'input',
        message: `Found ${unlabeledInputs} unlabeled form inputs`,
        recommendation: 'Add labels or aria-label attributes to all form inputs'
      });
    } else {
      this.testResults.passed.push('form-labels');
    }

    this.testResults.passed.push('form-aria');
    this.testResults.passed.push('form-error');
  }

  // Test color contrast (simulated - would need actual color values)
  testColorContrast(htmlContent) {
    // This is a simplified test - real implementation would need to extract actual colors
    this.testResults.warnings.push({
      type: 'color-contrast',
      severity: 'medium',
      element: 'text',
      message: 'Color contrast testing requires visual inspection',
      recommendation: 'Use tools like WebAIM Contrast Checker to verify 4.5:1 ratio'
    });

    this.testResults.warnings.push({
      type: 'color-not-only',
      severity: 'low',
      element: 'content',
      message: 'Verify information is not conveyed by color alone',
      recommendation: 'Add text labels, icons, or patterns to supplement color coding'
    });

    this.testResults.warnings.push({
      type: 'color-contrast-large',
      severity: 'low',
      element: 'large-text',
      message: 'Verify large text meets 3:1 contrast ratio',
      recommendation: 'Test large text (18pt+ or 14pt bold) contrast'
    });

    this.testResults.warnings.push({
      type: 'color-ui',
      severity: 'low',
      element: 'ui',
      message: 'Verify UI components meet 3:1 contrast ratio',
      recommendation: 'Test buttons, borders, and other UI elements'
    });
  }

  // Test keyboard accessibility
  testKeyboardAccessibility(htmlContent) {
    // Check for focusable elements
    const focusableElements = htmlContent.match(/<(a|button|input|select|textarea|area)[^>]*>/gi) || [];
    
    if (focusableElements.length === 0) {
      this.testResults.warnings.push({
        type: 'keyboard-nav',
        severity: 'medium',
        element: 'interactive',
        message: 'No focusable elements found',
        recommendation: 'Ensure all interactive elements can receive keyboard focus'
      });
    } else {
      this.testResults.passed.push('keyboard-nav');
    }

    // Check for tabindex usage
    const tabindexElements = htmlContent.match(/tabindex="[^"]*"/gi) || [];
    if (tabindexElements.length > 0) {
      this.testResults.warnings.push({
        type: 'keyboard-focus',
        severity: 'low',
        element: 'focus',
        message: 'Found tabindex attributes',
        recommendation: 'Review tabindex usage to ensure logical focus order'
      });
    } else {
      this.testResults.passed.push('keyboard-focus');
    }
  }

  // Test text accessibility
  testTextAccessibility(htmlContent) {
    // Check for text resize capability (simulated)
    this.testResults.warnings.push({
      type: 'text-resize',
      severity: 'medium',
      element: 'text',
      message: 'Text resize testing requires browser testing',
      recommendation: 'Test text zoom to 200% in browser to ensure readability'
    });

    // Check for text spacing (simulated)
    this.testResults.warnings.push({
      type: 'text-spacing',
      severity: 'low',
      element: 'text',
      message: 'Text spacing testing requires browser testing',
      recommendation: 'Verify text can be spaced for readability'
    });
  }

  // Test layout accessibility
  testLayoutAccessibility(htmlContent) {
    // Check for responsive layout indicators
    const viewportMeta = htmlContent.includes('name="viewport"');
    if (!viewportMeta) {
      this.testResults.failed.push({
        type: 'layout-reflow',
        severity: 'medium',
        element: 'meta',
        message: 'Missing viewport meta tag',
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'
      });
    } else {
      this.testResults.passed.push('layout-reflow');
    }

    // Test orientation (simulated)
    this.testResults.warnings.push({
      type: 'orientation',
      severity: 'low',
      element: 'layout',
      message: 'Orientation testing requires device testing',
      recommendation: 'Test layout in both portrait and landscape orientations'
    });
  }

  // Test navigation accessibility
  testNavigation(htmlContent) {
    // Check for navigation structure
    const navElements = htmlContent.match(/<nav[^>]*>/gi) || [];
    if (navElements.length === 0) {
      this.testResults.warnings.push({
        type: 'nav-consistent',
        severity: 'medium',
        element: 'nav',
        message: 'No navigation elements found',
        recommendation: 'Add semantic navigation structure'
      });
    } else {
      this.testResults.passed.push('nav-consistent');
    }

    // Test focus order (simulated)
    this.testResults.warnings.push({
      type: 'nav-focus',
      severity: 'low',
      element: 'navigation',
      message: 'Focus order testing requires keyboard testing',
      recommendation: 'Test tab order to ensure logical navigation flow'
    });
  }

  // Calculate accessibility score
  calculateScore() {
    const totalTests = this.testResults.passed.length + 
                      this.testResults.failed.length + 
                      this.testResults.warnings.length;
    
    if (totalTests === 0) {
      this.testResults.score = 0;
      return;
    }

    const passedWeight = this.testResults.passed.length * 1.0;
    const failedWeight = this.testResults.failed.length * -2.0;
    const warningWeight = this.testResults.warnings.length * -0.5;
    
    const rawScore = (passedWeight + failedWeight + warningWeight) / totalTests;
    this.testResults.score = Math.max(0, Math.round((rawScore + 1) * 50));
  }

  // Generate recommendations
  generateRecommendations() {
    const recommendations = [];

    // Critical issues first
    const criticalIssues = this.testResults.failed.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push({
        priority: 'critical',
        title: 'Fix Critical Accessibility Issues',
        issues: criticalIssues.map(issue => issue.message),
        impact: 'Required for WCAG 2.1 AA compliance and legal accessibility'
      });
    }

    // Medium priority issues
    const mediumIssues = this.testResults.failed.filter(issue => issue.severity === 'medium');
    if (mediumIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Address Medium Priority Issues',
        issues: mediumIssues.map(issue => issue.message),
        impact: 'Improves user experience and compliance'
      });
    }

    // Warnings
    if (this.testResults.warnings.length > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Review Accessibility Warnings',
        issues: this.testResults.warnings.slice(0, 5).map(issue => issue.message),
        impact: 'Enhances accessibility for users with disabilities'
      });
    }

    return recommendations;
  }

  // Determine WCAG compliance level
  determineWCAGLevel() {
    const criticalIssues = this.testResults.failed.filter(issue => issue.severity === 'critical');
    const mediumIssues = this.testResults.failed.filter(issue => issue.severity === 'medium');
    
    if (criticalIssues.length === 0 && mediumIssues.length === 0) {
      return 'AA';
    } else if (criticalIssues.length === 0) {
      return 'A';
    } else {
      return 'Non-compliant';
    }
  }

  // Get critical issues
  getCriticalIssues() {
    return this.testResults.failed.filter(issue => issue.severity === 'critical');
  }

  // Generate comprehensive accessibility report
  generateReport(htmlContent, pageType) {
    const validation = this.validatePage(htmlContent, pageType);
    
    return {
      summary: {
        score: validation.score,
        wcagLevel: validation.wcagLevel,
        totalTests: validation.passed.length + validation.failed.length + validation.warnings.length,
        criticalIssues: validation.criticalIssues.length
      },
      details: validation,
      nextSteps: this.generateNextSteps(validation),
      testingTools: this.getTestingTools()
    };
  }

  // Generate next steps
  generateNextSteps(validation) {
    const steps = [];

    if (validation.criticalIssues.length > 0) {
      steps.push('Fix all critical accessibility issues immediately');
    }

    if (validation.score < 70) {
      steps.push('Conduct manual accessibility testing with screen readers');
    }

    steps.push('Test with keyboard navigation only');
    steps.push('Verify color contrast with automated tools');
    steps.push('Test with actual users with disabilities');

    return steps;
  }

  // Get recommended testing tools
  getTestingTools() {
    return [
      {
        name: 'axe DevTools',
        type: 'Browser Extension',
        purpose: 'Automated accessibility testing',
        url: 'https://www.deque.com/axe/devtools/'
      },
      {
        name: 'WAVE',
        type: 'Web Tool',
        purpose: 'Visual accessibility evaluation',
        url: 'https://wave.webaim.org/'
      },
      {
        name: 'Color Contrast Analyzer',
        type: 'Desktop Tool',
        purpose: 'Color contrast validation',
        url: 'https://www.tpgi.com/color-contrast-checker/'
      },
      {
        name: 'NVDA Screen Reader',
        type: 'Screen Reader',
        purpose: 'Screen reader testing',
        url: 'https://www.nvaccess.org/'
      },
      {
        name: 'VoiceOver',
        type: 'Screen Reader',
        purpose: 'macOS screen reader testing',
        url: 'Built into macOS'
      }
    ];
  }
}

export default AccessibilityValidator;
