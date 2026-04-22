// People Also Ask Engine - Voice Search & Featured Snippets Optimization
// Generates contextual "People Also Ask" questions based on content and cluster

export class PeopleAlsoAskEngine {
  constructor() {
    this.paaDatabase = {
      // E-waste basics questions
      'e-waste-basics': [
        {
          question: "What is considered e-waste?",
          answer: "E-waste includes any electronic device that's no longer wanted or working - computers, laptops, phones, printers, batteries, and other electronic equipment.",
          featured: true
        },
        {
          question: "Why is e-waste recycling important?",
          answer: "E-waste recycling prevents toxic materials from contaminating soil and water, recovers valuable resources, and ensures data security.",
          featured: true
        },
        {
          question: "How do I prepare e-waste for recycling?",
          answer: "Remove personal data, separate batteries, and gather items together. We provide free pickup and handle all preparation requirements.",
          featured: false
        },
        {
          question: "What happens to recycled e-waste?",
          answer: "E-waste is sorted, data is destroyed, valuable materials are recovered, and remaining components are responsibly recycled or disposed of.",
          featured: true
        },
        {
          question: "Is e-waste recycling mandatory in Kerala?",
          answer: "Yes, Kerala law requires e-waste to be disposed of through KSPCB authorized recyclers. Non-compliance can result in fines.",
          featured: true
        }
      ],

      // Data security questions
      'data-security': [
        {
          question: "How do you destroy data permanently?",
          answer: "We use NIST 800-88 compliant methods including physical shredding, degaussing, and multi-pass software wiping for complete data destruction.",
          featured: true
        },
        {
          question: "Can data be recovered after shredding?",
          answer: "No, physical shredding destroys storage media at the molecular level, making data recovery impossible.",
          featured: true
        },
        {
          question: "What is the difference between wiping and shredding?",
          answer: "Wiping uses software to overwrite data, while shredding physically destroys the storage device. Shredding is more secure for sensitive data.",
          featured: true
        },
        {
          question: "Do I need data destruction certificate?",
          answer: "Yes, for business compliance and legal protection. We provide detailed certificates for all data destruction services.",
          featured: true
        },
        {
          question: "How long does data destruction take?",
          answer: "On-site destruction takes 30-60 minutes per device. Off-site processing typically completes within 24-48 hours.",
          featured: false
        }
      ],

      // Buyback and pricing questions
      'buyback-pricing': [
        {
          question: "How much can I sell my old laptop for?",
          answer: "Laptop prices range from Rs 5,000-75,000 depending on brand, model, age, condition, and specifications. Dell and HP laptops typically fetch good prices.",
          featured: true
        },
        {
          question: "Do you buy broken laptops?",
          answer: "Yes, we buy both working and non-working laptops. Prices vary based on condition, but we ensure responsible recycling even for damaged devices.",
          featured: true
        },
        {
          question: "How do you determine laptop prices?",
          answer: "We evaluate based on brand, model, age, condition, specifications, and current market demand. Our pricing is transparent and competitive.",
          featured: true
        },
        {
          question: "Can I sell my phone without original box?",
          answer: "Yes, we buy phones with or without original packaging. The device condition and functionality are more important than the box.",
          featured: false
        },
        {
          question: "Do you provide instant payment?",
          answer: "Yes, we offer instant cash payment upon pickup and verification. You can choose between cash, bank transfer, or UPI.",
          featured: true
        }
      ],

      // Location-specific questions
      'location-specific': [
        {
          question: "Do you provide e-waste pickup in Kochi?",
          answer: "Yes, we offer free e-waste pickup across all areas of Kochi including Kakkanad, Edappally, Aluva, and surrounding areas.",
          featured: true
        },
        {
          question: "How quickly can you pick up e-waste in Kochi?",
          answer: "We provide same-day pickup service across Kochi. Schedule your pickup and we'll collect within 4 hours.",
          featured: true
        },
        {
          question: "What areas in Kochi do you cover?",
          answer: "We cover all major areas: Kakkanad, Edappally, Aluva, Vyttila, Infopark, Ernakulam, Fort Kochi, and surrounding suburbs.",
          featured: true
        },
        {
          question: "Is e-waste pickup free in Kochi?",
          answer: "Yes, we offer free pickup for qualifying items (5+ for residential, 10+ for businesses). Single items may have a small collection fee.",
          featured: true
        },
        {
          question: "Do you have a physical store in Kochi?",
          answer: "We operate as a pickup service for convenience. You can schedule collection at your location or visit our processing center by appointment.",
          featured: false
        }
      ],

      // Compliance and legal questions
      'compliance-legal': [
        {
          question: "What are the e-waste laws in Kerala?",
          answer: "Kerala follows E-Waste Management Rules 2016 with KSPCB enforcement. Businesses must use authorized recyclers and maintain disposal records.",
          featured: true
        },
        {
          question: "What is the penalty for improper e-waste disposal?",
          answer: "Fines range from Rs 5,000 for individuals to Rs 5,00,000 for corporations, plus potential legal action for environmental damage.",
          featured: true
        },
        {
          question: "Do I need e-waste disposal certificate?",
          answer: "Yes, businesses need certificates for compliance audits. We provide detailed documentation for all disposal services.",
          featured: true
        },
        {
          question: "What is DPDP Act compliance for e-waste?",
          answer: "The DPDP Act 2023 requires secure data destruction before disposal. Our NIST 800-88 compliant methods ensure full compliance.",
          featured: true
        },
        {
          question: "How to audit e-waste disposal?",
          answer: "Maintain disposal records, certificates of recycling, data destruction proofs, and vendor compliance documentation. We provide all necessary paperwork.",
          featured: true
        }
      ]
    };

    this.voiceSearchOptimizations = {
      // Natural language patterns for voice search
      questionStarters: [
        "What is", "How do", "Why is", "When should", "Where can", 
        "Can I", "Do you", "How much", "What happens", "Is it"
      ],
      
      // Local intent patterns
      localPatterns: [
        "in Kochi", "near me", "in my area", "local", "nearby"
      ],
      
      // Action patterns
      actionPatterns: [
        "sell my", "dispose of", "recycle my", "get rid of", 
        "pickup", "collect", "buy", "price for"
      ]
    };
  }

  // Generate People Also Ask questions based on content and cluster
  generatePeopleAlsoAsk(content, clusterName, postTitle, count = 5) {
    const clusterQuestions = this.paaDatabase[clusterName] || [];
    const allQuestions = [...clusterQuestions];

    // Add context-specific questions based on content analysis
    const contextualQuestions = this.generateContextualQuestions(content, postTitle);
    allQuestions.push(...contextualQuestions);

    // Prioritize featured questions
    const featuredQuestions = allQuestions.filter(q => q.featured);
    const regularQuestions = allQuestions.filter(q => !q.featured);

    // Select best questions
    let selectedQuestions = [];
    
    // Always include featured questions first
    selectedQuestions.push(...featuredQuestions.slice(0, Math.min(3, count)));
    
    // Fill remaining slots with regular questions
    if (selectedQuestions.length < count) {
      const remaining = count - selectedQuestions.length;
      selectedQuestions.push(...regularQuestions.slice(0, remaining));
    }

    // Optimize for voice search
    return selectedQuestions.map(q => this.optimizeForVoiceSearch(q)).slice(0, count);
  }

  // Generate contextual questions based on content analysis
  generateContextualQuestions(content, title) {
    const contextualQuestions = [];
    const contentLower = content.toLowerCase();
    const titleLower = title.toLowerCase();

    // Analyze content for question opportunities
    if (contentLower.includes('laptop') || titleLower.includes('laptop')) {
      contextualQuestions.push({
        question: "How much is my old laptop worth in Kochi?",
        answer: "Your laptop's value depends on brand, model, age, and condition. We provide instant quotes and free pickup across Kochi.",
        featured: false
      });
    }

    if (contentLower.includes('data') || titleLower.includes('data')) {
      contextualQuestions.push({
        question: "How to protect data when recycling electronics?",
        answer: "Always use certified data destruction services. We provide NIST 800-88 compliant data wiping and physical destruction with certificates.",
        featured: false
      });
    }

    if (contentLower.includes('free') || titleLower.includes('free')) {
      contextualQuestions.push({
        question: "Is e-waste pickup really free in Kochi?",
        answer: "Yes, we offer free pickup for qualifying quantities. Residential customers need 5+ items, businesses need 10+ items for free collection.",
        featured: false
      });
    }

    return contextualQuestions;
  }

  // Optimize questions for voice search
  optimizeForVoiceSearch(questionObj) {
    let question = questionObj.question;
    let answer = questionObj.answer;

    // Ensure questions start with voice-friendly patterns
    const hasGoodStart = this.voiceSearchOptimizations.questionStarters.some(start => 
      question.toLowerCase().startsWith(start.toLowerCase())
    );

    if (!hasGoodStart) {
      // Add natural language starter
      question = `What is ${question.toLowerCase()}`;
    }

    // Keep answers conversational and concise
    if (answer.length > 150) {
      // Truncate long answers for voice search
      const sentences = answer.split('. ');
      answer = sentences.slice(0, 2).join('. ') + '.';
    }

    return {
      ...questionObj,
      question,
      answer,
      voiceOptimized: true
    };
  }

  // Generate schema markup for People Also Ask
  generatePAASchema(questions) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  }

  // Generate HTML for People Also Ask section
  generatePAAHTML(questions, postId) {
    return `
      <section class="people-also-ask" id="people-also-ask">
        <h2>People Also Ask</h2>
        <div class="paa-container">
          ${questions.map((q, index) => `
            <div class="paa-item" data-paa-id="${postId}-${index}">
              <details class="paa-question" ${index === 0 ? 'open' : ''}>
                <summary class="paa-trigger">
                  <span class="paa-question-text">${q.question}</span>
                  <span class="paa-icon">+</span>
                </summary>
                <div class="paa-answer">
                  <p>${q.answer}</p>
                  <div class="paa-actions">
                    <a href="/contact/" class="paa-cta">Get Help</a>
                    <button class="paa-helpful" data-question="${q.question}">Helpful</button>
                  </div>
                </div>
              </details>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Generate CSS for People Also Ask section
  generatePAACSS() {
    return `
      .people-also-ask {
        margin: 3rem 0;
        padding: 2rem;
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-radius: 16px;
        border: 1px solid #cbd5e0;
      }

      .people-also-ask h2 {
        margin: 0 0 2rem 0;
        font-size: 1.8rem;
        color: #2d3748;
        text-align: center;
      }

      .paa-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .paa-item {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }

      .paa-item:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        transform: translateY(-2px);
      }

      .paa-question {
        border: none;
        padding: 0;
      }

      .paa-trigger {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        cursor: pointer;
        font-weight: 600;
        color: #2d3748;
        transition: background-color 0.3s ease;
      }

      .paa-trigger:hover {
        background-color: #f7fafc;
      }

      .paa-question-text {
        flex: 1;
        text-align: left;
        font-size: 1.1rem;
        line-height: 1.4;
      }

      .paa-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #3182ce;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        transition: transform 0.3s ease;
      }

      .paa-question[open] .paa-icon {
        transform: rotate(45deg);
        background: #e53e3e;
      }

      .paa-answer {
        padding: 0 1.5rem 1.5rem;
        border-top: 1px solid #e2e8f0;
      }

      .paa-answer p {
        margin: 0 0 1rem 0;
        color: #4a5568;
        line-height: 1.6;
      }

      .paa-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .paa-cta {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #3182ce;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        transition: background-color 0.3s ease;
      }

      .paa-cta:hover {
        background: #2c5282;
      }

      .paa-helpful {
        padding: 0.5rem 1rem;
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        color: #4a5568;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .paa-helpful:hover {
        background: #e2e8f0;
        border-color: #cbd5e0;
      }

      .paa-helpful.voted {
        background: #c6f6d5;
        border-color: #9ae6b4;
        color: #22543d;
      }

      @media (max-width: 768px) {
        .people-also-ask {
          margin: 2rem 0;
          padding: 1.5rem;
        }

        .paa-question-text {
          font-size: 1rem;
        }

        .paa-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .paa-cta,
        .paa-helpful {
          text-align: center;
        }
      }
    `;
  }

  // Track PAA interactions for analytics
  trackPAAInteraction(question, action, postId) {
    const interactionData = {
      postId,
      question,
      action, // 'expand', 'collapse', 'helpful', 'cta_click'
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    };

    // Store in localStorage for client-side tracking
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem('paa_interactions') || '[]');
      existing.push(interactionData);
      localStorage.setItem('paa_interactions', JSON.stringify(existing));
    }

    // Send to analytics (implementation depends on your analytics system)
    this.sendToAnalytics(interactionData);
  }

  // Send interaction data to analytics
  sendToAnalytics(data) {
    // Implementation depends on your analytics system
    // This could be Google Analytics, Mixpanel, custom endpoint, etc.
    console.log('PAA Analytics:', data);
  }

  // Get PAA performance metrics
  getPAAPerformance() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const interactions = JSON.parse(localStorage.getItem('paa_interactions') || '[]');
      
      const metrics = {
        totalInteractions: interactions.length,
        questionsExpanded: interactions.filter(i => i.action === 'expand').length,
        helpfulVotes: interactions.filter(i => i.action === 'helpful').length,
        ctaClicks: interactions.filter(i => i.action === 'cta_click').length,
        topQuestions: this.getTopQuestions(interactions)
      };

      return metrics;
    }
    
    return null;
  }

  // Get most popular questions
  getTopQuestions(interactions) {
    const questionCounts = {};
    
    interactions.forEach(interaction => {
      if (interaction.action === 'expand') {
        questionCounts[interaction.question] = (questionCounts[interaction.question] || 0) + 1;
      }
    });

    return Object.entries(questionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([question, count]) => ({ question, count }));
  }
}

export default PeopleAlsoAskEngine;
