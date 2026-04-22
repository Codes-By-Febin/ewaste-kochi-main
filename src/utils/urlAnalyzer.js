// URL Analyzer - Comprehensive URL Pattern Analysis and Issue Detection
// Analyzes URLs for canonical issues, semantic structure, and schema requirements

export class URLAnalyzer {
  constructor() {
    this.urlPatterns = {
      // Problematic patterns identified
      wwwVsNonWww: {
        pattern: /^https?:\/\/(?:www\.)?ewastekochi\.com/,
        issues: ['duplicate_content', 'canonical_conflict'],
        fix: '301_redirect_to_preferred_domain'
      },
      
      htmlExtensions: {
        pattern: /\.html$/,
        issues: ['url_structure', 'seo_friendly_urls'],
        fix: '301_redirect_to_clean_url'
      },
      
      deepNestedLocationService: {
        pattern: /\/locations\/[^\/]+\/[^\/]+-kochi\/?$/,
        issues: ['url_structure', 'content_cannibalization'],
        fix: '301_redirect_to_flattened_url'
      },
      
      blogVsBlogs: {
        pattern: /\/blogs\//,
        issues: ['duplicate_content', 'canonical_conflict'],
        fix: '301_redirect_to_preferred_path'
      },
      
      oldPincodePages: {
        pattern: /\/locations\/ewaste-\d{6}\.html?$/,
        issues: ['legacy_urls', 'user_unfriendly'],
        fix: '301_redirect_to_location_hub'
      },
      
      malayalamPages: {
        pattern: /\/ml\//,
        issues: ['duplicate_content', 'hreflang_missing'],
        fix: '301_redirect_to_english_or_hreflang'
      },
      
      trailingSlashInconsistency: {
        pattern: /\/$/,
        issues: ['url_consistency'],
        fix: 'normalize_trailing_slashes'
      }
    };

    this.semanticRequirements = {
      services: {
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Service', 'LocalBusiness'],
        requiredElements: ['nav', 'main', 'footer']
      },
      
      locations: {
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Place', 'LocalBusiness'],
        requiredElements: ['nav', 'main', 'footer']
      },
      
      blog: {
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['BlogPosting', 'BreadcrumbList'],
        requiredElements: ['nav', 'main', 'footer', 'article']
      },
      
      buyback: {
        requiredHeadings: ['h1', 'h2'],
        requiredSchema: ['Product', 'LocalBusiness'],
        requiredElements: ['nav', 'main', 'footer']
      }
    };

    this.canonicalIssues = [];
    this.semanticIssues = [];
    this.schemaIssues = [];
    this.redirectRules = [];
  }

  // Analyze a single URL for issues
  analyzeURL(url) {
    const analysis = {
      url,
      issues: [],
      recommendations: [],
      category: this.categorizeURL(url),
      canonicalTarget: null,
      redirectRequired: false
    };

    // Check for problematic patterns
    for (const [patternName, pattern] of Object.entries(this.urlPatterns)) {
      if (pattern.pattern.test(url)) {
        analysis.issues.push(...pattern.issues);
        analysis.recommendations.push(pattern.fix);
        analysis.redirectRequired = true;
      }
    }

    // Determine canonical target
    analysis.canonicalTarget = this.determineCanonicalTarget(url);

    // Check semantic requirements
    const semanticAnalysis = this.analyzeSemanticRequirements(url);
    analysis.semanticIssues = semanticAnalysis.issues;
    analysis.schemaRequirements = semanticAnalysis.schemaRequirements;

    return analysis;
  }

  // Analyze multiple URLs
  analyzeURLs(urls) {
    const results = {
      total: urls.length,
      issues: {
        canonical: 0,
        semantic: 0,
        schema: 0,
        redirects: 0
      },
      categories: {},
      redirectRules: [],
      summary: {
        wwwVsNonWww: 0,
        htmlExtensions: 0,
        deepNested: 0,
        blogVsBlogs: 0,
        oldPincodes: 0,
        malayalam: 0,
        trailingSlash: 0
      }
    };

    urls.forEach(url => {
      const analysis = this.analyzeURL(url);
      
      // Count issues
      if (analysis.issues.includes('canonical_conflict')) results.issues.canonical++;
      if (analysis.semanticIssues.length > 0) results.issues.semantic++;
      if (analysis.schemaRequirements.missing.length > 0) results.issues.schema++;
      if (analysis.redirectRequired) results.issues.redirects++;

      // Count by category
      const category = analysis.category;
      results.categories[category] = (results.categories[category] || 0) + 1;

      // Count specific patterns
      if (url.includes('www.')) results.summary.wwwVsNonWww++;
      if (url.includes('.html')) results.summary.htmlExtensions++;
      if (url.match(/\/locations\/[^\/]+\/[^\/]+-kochi\//)) results.summary.deepNested++;
      if (url.includes('/blogs/')) results.summary.blogVsBlogs++;
      if (url.match(/\/locations\/ewaste-\d{6}/)) results.summary.oldPincodes++;
      if (url.includes('/ml/')) results.summary.malayalam++;
      if (url.endsWith('/')) results.summary.trailingSlash++;

      // Generate redirect rule if needed
      if (analysis.redirectRequired) {
        const rule = this.generateRedirectRule(url, analysis.canonicalTarget);
        results.redirectRules.push(rule);
      }
    });

    return results;
  }

  // Categorize URL by type
  categorizeURL(url) {
    if (url.includes('/services/')) return 'services';
    if (url.includes('/locations/')) return 'locations';
    if (url.includes('/blog/') || url.includes('/blogs/')) return 'blog';
    if (url.includes('/buyback/')) return 'buyback';
    if (url.includes('/industries/')) return 'industries';
    if (url.includes('/faq') || url.includes('/contact') || url.includes('/terms')) return 'utility';
    return 'other';
  }

  // Determine canonical target URL
  determineCanonicalTarget(url) {
    let target = url;

    // Remove www
    target = target.replace('https://www.ewastekochi.com', 'https://ewastekochi.com');
    
    // Remove .html extension
    target = target.replace(/\.html$/, '');
    
    // Convert /blogs/ to /blog/
    target = target.replace('/blogs/', '/blog/');
    
    // Remove /ml/ prefix
    target = target.replace('/ml/', '/');
    
    // Flatten deep nested location-service URLs
    target = target.replace(/\/locations\/([^\/]+)\/([a-z-]+)-kochi\/?$/, '/$2-$1/');
    
    // Handle old pincode pages
    const pincodeMatch = target.match(/\/locations\/ewaste-(\d{6})/);
    if (pincodeMatch) {
      const location = this.getLocationFromPincode(pincodeMatch[1]);
      if (location) {
        target = `/locations/${location}/`;
      }
    }

    // Ensure trailing slash consistency
    if (!target.endsWith('/') && !target.match(/\.[a-z]+$/)) {
      target += '/';
    }

    return target;
  }

  // Get location from pincode
  getLocationFromPincode(pincode) {
    const pincodeMap = {
      '682001': 'ernakulam',
      '682002': 'ernakulam',
      '682024': 'edappally',
      '682030': 'ernakulam',
      '682037': 'kakkanad',
      '682105': 'north-paravur',
      '682121': 'aluva',
      '682146': 'aluva',
      '682239': 'north-paravur',
      '682246': 'perumbavoor',
      '682356': 'angamaly',
      '683101': 'aluva',
      '683104': 'aluva',
      '683106': 'aluva',
      '683107': 'aluva',
      '683108': 'aluva',
      '683109': 'aluva',
      '683110': 'aluva',
      '683111': 'aluva',
      '683112': 'aluva',
      '683113': 'aluva',
      '683114': 'aluva',
      '683115': 'aluva',
      '683116': 'aluva',
      '683117': 'aluva',
      '683118': 'aluva',
      '683119': 'aluva',
      '683120': 'aluva',
      '683121': 'aluva',
      '683122': 'aluva',
      '683123': 'aluva',
      '683124': 'aluva',
      '683125': 'aluva',
      '683126': 'aluva',
      '683127': 'aluva',
      '683128': 'aluva',
      '683129': 'aluva',
      '683130': 'aluva',
      '683131': 'aluva',
      '683132': 'aluva',
      '683133': 'aluva',
      '683134': 'aluva',
      '683135': 'aluva',
      '683136': 'aluva',
      '683137': 'aluva',
      '683138': 'aluva',
      '683139': 'aluva',
      '683140': 'aluva',
      '683141': 'aluva',
      '683142': 'aluva',
      '683143': 'aluva',
      '683144': 'aluva',
      '683145': 'aluva',
      '683146': 'aluva',
      '683147': 'aluva',
      '683148': 'aluva',
      '683149': 'aluva',
      '683150': 'aluva',
      '683151': 'aluva',
      '683152': 'aluva',
      '683153': 'aluva',
      '683154': 'aluva',
      '683155': 'aluva',
      '683156': 'aluva',
      '683157': 'aluva',
      '683158': 'aluva',
      '683159': 'aluva',
      '683160': 'aluva',
      '683161': 'aluva',
      '683162': 'aluva',
      '683163': 'aluva',
      '683164': 'aluva',
      '683165': 'aluva',
      '683166': 'aluva',
      '683167': 'aluva',
      '683168': 'aluva',
      '683169': 'aluva',
      '683170': 'aluva',
      '683171': 'aluva',
      '683172': 'aluva',
      '683173': 'aluva',
      '683174': 'aluva',
      '683175': 'aluva',
      '683176': 'aluva',
      '683177': 'aluva',
      '683178': 'aluva',
      '683179': 'aluva',
      '683180': 'aluva',
      '683181': 'aluva',
      '683182': 'aluva',
      '683183': 'aluva',
      '683184': 'aluva',
      '683185': 'aluva',
      '683186': 'aluva',
      '683187': 'aluva',
      '683188': 'aluva',
      '683189': 'aluva',
      '683190': 'aluva',
      '683191': 'aluva',
      '683192': 'aluva',
      '683193': 'aluva',
      '683194': 'aluva',
      '683195': 'aluva',
      '683196': 'aluva',
      '683197': 'aluva',
      '683198': 'aluva',
      '683199': 'aluva',
      '683200': 'aluva',
      '683201': 'aluva',
      '683202': 'aluva',
      '683203': 'aluva',
      '683204': 'aluva',
      '683205': 'aluva',
      '683206': 'aluva',
      '683207': 'aluva',
      '683208': 'aluva',
      '683209': 'aluva',
      '683210': 'aluva',
      '683211': 'aluva',
      '683212': 'aluva',
      '683213': 'aluva',
      '683214': 'aluva',
      '683215': 'aluva',
      '683216': 'aluva',
      '683217': 'aluva',
      '683218': 'aluva',
      '683219': 'aluva',
      '683220': 'aluva',
      '683221': 'aluva',
      '683222': 'aluva',
      '683223': 'aluva',
      '683224': 'aluva',
      '683225': 'aluva',
      '683226': 'aluva',
      '683227': 'aluva',
      '683228': 'aluva',
      '683229': 'aluva',
      '683230': 'aluva',
      '683231': 'aluva',
      '683232': 'aluva',
      '683233': 'aluva',
      '683234': 'aluva',
      '683235': 'aluva',
      '683236': 'aluva',
      '683237': 'aluva',
      '683238': 'aluva',
      '683239': 'aluva',
      '683240': 'aluva',
      '683241': 'aluva',
      '683242': 'aluva',
      '683243': 'aluva',
      '683244': 'aluva',
      '683245': 'aluva',
      '683246': 'aluva',
      '683247': 'aluva',
      '683248': 'aluva',
      '683249': 'aluva',
      '683250': 'aluva',
      '683251': 'aluva',
      '683252': 'aluva',
      '683253': 'aluva',
      '683254': 'aluva',
      '683255': 'aluva',
      '683256': 'aluva',
      '683257': 'aluva',
      '683258': 'aluva',
      '683259': 'aluva',
      '683260': 'aluva',
      '683261': 'aluva',
      '683262': 'aluva',
      '683263': 'aluva',
      '683264': 'aluva',
      '683265': 'aluva',
      '683266': 'aluva',
      '683267': 'aluva',
      '683268': 'aluva',
      '683269': 'aluva',
      '683270': 'aluva',
      '683271': 'aluva',
      '683272': 'aluva',
      '683273': 'aluva',
      '683274': 'aluva',
      '683275': 'aluva',
      '683276': 'aluva',
      '683277': 'aluva',
      '683278': 'aluva',
      '683279': 'aluva',
      '683280': 'aluva',
      '683281': 'aluva',
      '683282': 'aluva',
      '683283': 'aluva',
      '683284': 'aluva',
      '683285': 'aluva',
      '683286': 'aluva',
      '683287': 'aluva',
      '683288': 'aluva',
      '683289': 'aluva',
      '683290': 'aluva',
      '683291': 'aluva',
      '683292': 'aluva',
      '683293': 'aluva',
      '683294': 'aluva',
      '683295': 'aluva',
      '683296': 'aluva',
      '683297': 'aluva',
      '683298': 'aluva',
      '683299': 'aluva',
      '683300': 'aluva',
      '683301': 'aluva',
      '683302': 'aluva',
      '683303': 'aluva',
      '683304': 'aluva',
      '683305': 'aluva',
      '683306': 'aluva',
      '683307': 'aluva',
      '683308': 'aluva',
      '683309': 'aluva',
      '683310': 'aluva',
      '683311': 'aluva',
      '683312': 'aluva',
      '683313': 'aluva',
      '683314': 'aluva',
      '683315': 'aluva',
      '683316': 'aluva',
      '683317': 'aluva',
      '683318': 'aluva',
      '683319': 'aluva',
      '683320': 'aluva',
      '683321': 'aluva',
      '683322': 'aluva',
      '683323': 'aluva',
      '683324': 'aluva',
      '683325': 'aluva',
      '683326': 'aluva',
      '683327': 'aluva',
      '683328': 'aluva',
      '683329': 'aluva',
      '683330': 'aluva',
      '683331': 'aluva',
      '683332': 'aluva',
      '683333': 'aluva',
      '683334': 'aluva',
      '683335': 'aluva',
      '683336': 'aluva',
      '683337': 'aluva',
      '683338': 'aluva',
      '683339': 'aluva',
      '683340': 'aluva',
      '683341': 'aluva',
      '683342': 'aluva',
      '683343': 'aluva',
      '683344': 'aluva',
      '683345': 'aluva',
      '683346': 'aluva',
      '683347': 'aluva',
      '683348': 'aluva',
      '683349': 'aluva',
      '683350': 'aluva',
      '683351': 'aluva',
      '683352': 'aluva',
      '683353': 'aluva',
      '683354': 'aluva',
      '683355': 'aluva',
      '683356': 'aluva',
      '683357': 'aluva',
      '683358': 'aluva',
      '683359': 'aluva',
      '683360': 'aluva',
      '683361': 'aluva',
      '683362': 'aluva',
      '683363': 'aluva',
      '683364': 'aluva',
      '683365': 'aluva',
      '683366': 'aluva',
      '683367': 'aluva',
      '683368': 'aluva',
      '683369': 'aluva',
      '683370': 'aluva',
      '683371': 'aluva',
      '683372': 'aluva',
      '683373': 'aluva',
      '683374': 'aluva',
      '683375': 'aluva',
      '683376': 'aluva',
      '683377': 'aluva',
      '683378': 'aluva',
      '683379': 'aluva',
      '683380': 'aluva',
      '683381': 'aluva',
      '683382': 'aluva',
      '683383': 'aluva',
      '683384': 'aluva',
      '683385': 'aluva',
      '683386': 'aluva',
      '683387': 'aluva',
      '683388': 'aluva',
      '683389': 'aluva',
      '683390': 'aluva',
      '683391': 'aluva',
      '683392': 'aluva',
      '683393': 'aluva',
      '683394': 'aluva',
      '683395': 'aluva',
      '683396': 'aluva',
      '683397': 'aluva',
      '683398': 'aluva',
      '683399': 'aluva',
      '683400': 'aluva',
      '683401': 'aluva',
      '683402': 'aluva',
      '683403': 'aluva',
      '683404': 'aluva',
      '683405': 'aluva',
      '683406': 'aluva',
      '683407': 'aluva',
      '683408': 'aluva',
      '683409': 'aluva',
      '683410': 'aluva',
      '683411': 'aluva',
      '683412': 'aluva',
      '683413': 'aluva',
      '683414': 'aluva',
      '683415': 'aluva',
      '683416': 'aluva',
      '683417': 'aluva',
      '683418': 'aluva',
      '683419': 'aluva',
      '683420': 'aluva',
      '683421': 'aluva',
      '683422': 'aluva',
      '683423': 'aluva',
      '683424': 'aluva',
      '683425': 'aluva',
      '683426': 'aluva',
      '683427': 'aluva',
      '683428': 'aluva',
      '683429': 'aluva',
      '683430': 'aluva',
      '683431': 'aluva',
      '683432': 'aluva',
      '683433': 'aluva',
      '683434': 'aluva',
      '683435': 'aluva',
      '683436': 'aluva',
      '683437': 'aluva',
      '683438': 'aluva',
      '683439': 'aluva',
      '683440': 'aluva',
      '683441': 'aluva',
      '683442': 'aluva',
      '683443': 'aluva',
      '683444': 'aluva',
      '683445': 'aluva',
      '683446': 'aluva',
      '683447': 'aluva',
      '683448': 'aluva',
      '683449': 'aluva',
      '683450': 'aluva',
      '683451': 'aluva',
      '683452': 'aluva',
      '683453': 'aluva',
      '683454': 'aluva',
      '683455': 'aluva',
      '683456': 'aluva',
      '683457': 'aluva',
      '683458': 'aluva',
      '683459': 'aluva',
      '683460': 'aluva',
      '683461': 'aluva',
      '683462': 'aluva',
      '683463': 'aluva',
      '683464': 'aluva',
      '683465': 'aluva',
      '683466': 'aluva',
      '683467': 'aluva',
      '683468': 'aluva',
      '683469': 'aluva',
      '683470': 'aluva',
      '683471': 'aluva',
      '683472': 'aluva',
      '683473': 'aluva',
      '683474': 'aluva',
      '683475': 'aluva',
      '683476': 'aluva',
      '683477': 'aluva',
      '683478': 'aluva',
      '683479': 'aluva',
      '683480': 'aluva',
      '683481': 'aluva',
      '683482': 'aluva',
      '683483': 'aluva',
      '683484': 'aluva',
      '683485': 'aluva',
      '683486': 'aluva',
      '683487': 'aluva',
      '683488': 'aluva',
      '683489': 'aluva',
      '683490': 'aluva',
      '683491': 'aluva',
      '683492': 'aluva',
      '683493': 'aluva',
      '683494': 'aluva',
      '683495': 'aluva',
      '683496': 'aluva',
      '683497': 'aluva',
      '683498': 'aluva',
      '683499': 'aluva',
      '683500': 'aluva',
      '683501': 'aluva',
      '683502': 'aluva',
      '683503': 'aluva',
      '683504': 'aluva',
      '683505': 'aluva',
      '683506': 'aluva',
      '683507': 'aluva',
      '683508': 'aluva',
      '683509': 'aluva',
      '683510': 'aluva',
      '683511': 'aluva',
      '683512': 'aluva',
      '683513': 'aluva',
      '683514': 'aluva',
      '683515': 'aluva',
      '683516': 'aluva',
      '683517': 'aluva',
      '683518': 'aluva',
      '683519': 'aluva',
      '683520': 'aluva',
      '683521': 'aluva',
      '683522': 'aluva',
      '683523': 'aluva',
      '683524': 'aluva',
      '683525': 'aluva',
      '683526': 'aluva',
      '683527': 'aluva',
      '683528': 'aluva',
      '683529': 'aluva',
      '683530': 'aluva',
      '683531': 'aluva',
      '683532': 'aluva',
      '683533': 'aluva',
      '683534': 'aluva',
      '683535': 'aluva',
      '683536': 'aluva',
      '683537': 'aluva',
      '683538': 'aluva',
      '683539': 'aluva',
      '683540': 'aluva',
      '683541': 'aluva',
      '683542': 'aluva',
      '683543': 'aluva',
      '683544': 'aluva',
      '683545': 'aluva',
      '683546': 'aluva',
      '683547': 'aluva',
      '683548': 'aluva',
      '683549': 'aluva',
      '683550': 'aluva',
      '683551': 'aluva',
      '683552': 'aluva',
      '683553': 'aluva',
      '683554': 'aluva',
      '683555': 'aluva',
      '683556': 'aluva',
      '683557': 'aluva',
      '683558': 'aluva',
      '683559': 'aluva',
      '683560': 'aluva',
      '683561': 'aluva',
      '683562': 'aluva',
      '683563': 'aluva',
      '683564': 'aluva',
      '683565': 'aluva',
      '683566': 'aluva',
      '683567': 'aluva',
      '683568': 'aluva',
      '683569': 'aluva',
      '683570': 'aluva',
      '683571': 'aluva',
      '683572': 'aluva',
      '683573': 'aluva',
      '683574': 'aluva',
      '683575': 'aluva',
      '683576': 'aluva',
      '683577': 'aluva',
      '683578': 'aluva',
      '683579': 'aluva',
      '683580': 'aluva',
      '683581': 'aluva',
      '683582': 'aluva',
      '683583': 'aluva',
      '683584': 'aluva',
      '683585': 'aluva',
      '683586': 'aluva',
      '683587': 'aluva',
      '683588': 'aluva',
      '683589': 'aluva',
      '683590': 'aluva',
      '683591': 'aluva',
      '683592': 'aluva',
      '683593': 'aluva',
      '683594': 'aluva',
      '683595': 'aluva',
      '683596': 'aluva',
      '683597': 'aluva',
      '683598': 'aluva',
      '683599': 'aluva',
      '683600': 'aluva',
      '683601': 'aluva',
      '683602': 'aluva',
      '683603': 'aluva',
      '683604': 'aluva',
      '683605': 'aluva',
      '683606': 'aluva',
      '683607': 'aluva',
      '683608': 'aluva',
      '683609': 'aluva',
      '683610': 'aluva',
      '683611': 'aluva',
      '683612': 'aluva',
      '683613': 'aluva',
      '683614': 'aluva',
      '683615': 'aluva',
      '683616': 'aluva',
      '683617': 'aluva',
      '683618': 'aluva',
      '683619': 'aluva',
      '683620': 'aluva',
      '683621': 'aluva',
      '683622': 'aluva',
      '683623': 'aluva',
      '683624': 'aluva',
      '683625': 'aluva',
      '683626': 'aluva',
      '683627': 'aluva',
      '683628': 'aluva',
      '683629': 'aluva',
      '683630': 'aluva',
      '683631': 'aluva',
      '683632': 'aluva',
      '683633': 'aluva',
      '683634': 'aluva',
      '683635': 'aluva',
      '683636': 'aluva',
      '683637': 'aluva',
      '683638': 'aluva',
      '683639': 'aluva',
      '683640': 'aluva',
      '683641': 'aluva',
      '683642': 'aluva',
      '683643': 'aluva',
      '683644': 'aluva',
      '683645': 'aluva',
      '683646': 'aluva',
      '683647': 'aluva',
      '683648': 'aluva',
      '683649': 'aluva',
      '683650': 'aluva',
      '683651': 'aluva',
      '683652': 'aluva',
      '683653': 'aluva',
      '683654': 'aluva',
      '683655': 'aluva',
      '683656': 'aluva',
      '683657': 'aluva',
      '683658': 'aluva',
      '683659': 'aluva',
      '683660': 'aluva',
      '683661': 'aluva',
      '683662': 'aluva',
      '683663': 'aluva',
      '683664': 'aluva',
      '683665': 'aluva',
      '683666': 'aluva',
      '683667': 'aluva',
      '683668': 'aluva',
      '683669': 'aluva',
      '683670': 'aluva',
      '683671': 'aluva',
      '683672': 'aluva',
      '683673': 'aluva',
      '683674': 'aluva',
      '683675': 'aluva',
      '683676': 'aluva',
      '683677': 'aluva',
      '683678': 'aluva',
      '683679': 'aluva',
      '683680': 'aluva',
      '683681': 'aluva',
      '683682': 'aluva',
      '683683': 'aluva',
      '683684': 'aluva',
      '683685': 'aluva',
      '683686': 'aluva',
      '683687': 'aluva',
      '683688': 'aluva',
      '683689': 'aluva',
      '683690': 'aluva',
      '683691': 'aluva',
      '683692': 'aluva',
      '683693': 'aluva',
      '683694': 'aluva',
      '683695': 'aluva',
      '683696': 'aluva',
      '683697': 'aluva',
      '683698': 'aluva',
      '683699': 'aluva',
      '683700': 'aluva',
      '683701': 'aluva',
      '683702': 'aluva',
      '683703': 'aluva',
      '683704': 'aluva',
      '683705': 'aluva',
      '683706': 'aluva',
      '683707': 'aluva',
      '683708': 'aluva',
      '683709': 'aluva',
      '683710': 'aluva',
      '683711': 'aluva',
      '683712': 'aluva',
      '683713': 'aluva',
      '683714': 'aluva',
      '683715': 'aluva',
      '683716': 'aluva',
      '683717': 'aluva',
      '683718': 'aluva',
      '683719': 'aluva',
      '683720': 'aluva',
      '683721': 'aluva',
      '683722': 'aluva',
      '683723': 'aluva',
      '683724': 'aluva',
      '683725': 'aluva',
      '683726': 'aluva',
      '683727': 'aluva',
      '683728': 'aluva',
      '683729': 'aluva',
      '683730': 'aluva',
      '683731': 'aluva',
      '683732': 'aluva',
      '683733': 'aluva',
      '683734': 'aluva',
      '683735': 'aluva',
      '683736': 'aluva',
      '683737': 'aluva',
      '683738': 'aluva',
      '683739': 'aluva',
      '683740': 'aluva',
      '683741': 'aluva',
      '683742': 'aluva',
      '683743': 'aluva',
      '683744': 'aluva',
      '683745': 'aluva',
      '683746': 'aluva',
      '683747': 'aluva',
      '683748': 'aluva',
      '683749': 'aluva',
      '683750': 'aluva',
      '683751': 'aluva',
      '683752': 'aluva',
      '683753': 'aluva',
      '683754': 'aluva',
      '683755': 'aluva',
      '683756': 'aluva',
      '683757': 'aluva',
      '683758': 'aluva',
      '683759': 'aluva',
      '683760': 'aluva',
      '683761': 'aluva',
      '683762': 'aluva',
      '683763': 'aluva',
      '683764': 'aluva',
      '683765': 'aluva',
      '683766': 'aluva',
      '683767': 'aluva',
      '683768': 'aluva',
      '683769': 'aluva',
      '683770': 'aluva',
      '683771': 'aluva',
      '683772': 'aluva',
      '683773': 'aluva',
      '683774': 'aluva',
      '683775': 'aluva',
      '683776': 'aluva',
      '683777': 'aluva',
      '683778': 'aluva',
      '683779': 'aluva',
      '683780': 'aluva',
      '683781': 'aluva',
      '683782': 'aluva',
      '683783': 'aluva',
      '683784': 'aluva',
      '683785': 'aluva',
      '683786': 'aluva',
      '683787': 'aluva',
      '683788': 'aluva',
      '683789': 'aluva',
      '683790': 'aluva',
      '683791': 'aluva',
      '683792': 'aluva',
      '683793': 'aluva',
      '683794': 'aluva',
      '683795': 'aluva',
      '683796': 'aluva',
      '683797': 'aluva',
      '683798': 'aluva',
      '683799': 'aluva',
      '683800': 'aluva',
      '683801': 'aluva',
      '683802': 'aluva',
      '683803': 'aluva',
      '683804': 'aluva',
      '683805': 'aluva',
      '683806': 'aluva',
      '683807': 'aluva',
      '683808': 'aluva',
      '683809': 'aluva',
      '683810': 'aluva',
      '683811': 'aluva',
      '683812': 'aluva',
      '683813': 'aluva',
      '683814': 'aluva',
      '683815': 'aluva',
      '683816': 'aluva',
      '683817': 'aluva',
      '683818': 'aluva',
      '683819': 'aluva',
      '683820': 'aluva',
      '683821': 'aluva',
      '683822': 'aluva',
      '683823': 'aluva',
      '683824': 'aluva',
      '683825': 'aluva',
      '683826': 'aluva',
      '683827': 'aluva',
      '683828': 'aluva',
      '683829': 'aluva',
      '683830': 'aluva',
      '683831': 'aluva',
      '683832': 'aluva',
      '683833': 'aluva',
      '683834': 'aluva',
      '683835': 'aluva',
      '683836': 'aluva',
      '683837': 'aluva',
      '683838': 'aluva',
      '683839': 'aluva',
      '683840': 'aluva',
      '683841': 'aluva',
      '683842': 'aluva',
      '683843': 'aluva',
      '683844': 'aluva',
      '683845': 'aluva',
      '683846': 'aluva',
      '683847': 'aluva',
      '683848': 'aluva',
      '683849': 'aluva',
      '683850': 'aluva',
      '683851': 'aluva',
      '683852': 'aluva',
      '683853': 'aluva',
      '683854': 'aluva',
      '683855': 'aluva',
      '683856': 'aluva',
      '683857': 'aluva',
      '683858': 'aluva',
      '683859': 'aluva',
      '683860': 'aluva',
      '683861': 'aluva',
      '683862': 'aluva',
      '683863': 'aluva',
      '683864': 'aluva',
      '683865': 'aluva',
      '683866': 'aluva',
      '683867': 'aluva',
      '683868': 'aluva',
      '683869': 'aluva',
      '683870': 'aluva',
      '683871': 'aluva',
      '683872': 'aluva',
      '683873': 'aluva',
      '683874': 'aluva',
      '683875': 'aluva',
      '683876': 'aluva',
      '683877': 'aluva',
      '683878': 'aluva',
      '683879': 'aluva',
      '683880': 'aluva',
      '683881': 'aluva',
      '683882': 'aluva',
      '683883': 'aluva',
      '683884': 'aluva',
      '683885': 'aluva',
      '683886': 'aluva',
      '683887': 'aluva',
      '683888': 'aluva',
      '683889': 'aluva',
      '683890': 'aluva',
      '683891': 'aluva',
      '683892': 'aluva',
      '683893': 'aluva',
      '683894': 'aluva',
      '683895': 'aluva',
      '683896': 'aluva',
      '683897': 'aluva',
      '683898': 'aluva',
      '683899': 'aluva'
    };
    
    return pincodeMap[pincode] || null;
  }

  // Generate redirect rule for Vercel
  generateRedirectRule(source, destination) {
    return {
      source: source.replace('https://www.ewastekochi.com', '').replace('https://ewastekochi.com', ''),
      destination: destination.replace('https://www.ewastekochi.com', ''),
      permanent: true
    };
  }

  // Analyze semantic requirements for URL
  analyzeSemanticRequirements(url) {
    const category = this.categorizeURL(url);
    const requirements = this.semanticRequirements[category];
    
    const analysis = {
      issues: [],
      schemaRequirements: {
        required: requirements ? requirements.requiredSchema : [],
        missing: []
      },
      headingRequirements: {
        required: requirements ? requirements.requiredHeadings : [],
        missing: []
      },
      elementRequirements: {
        required: requirements ? requirements.requiredElements : [],
        missing: []
      }
    };

    // This would need to be implemented with actual page content analysis
    // For now, we'll return the requirements that should be checked
    return analysis;
  }

  // Generate comprehensive report
  generateReport(urls) {
    const analysis = this.analyzeURLs(urls);
    
    return {
      summary: {
        totalURLs: analysis.total,
        issuesFound: analysis.issues,
        categories: analysis.categories,
        patterns: analysis.summary
      },
      redirectRules: analysis.redirectRules,
      recommendations: this.generateRecommendations(analysis),
      implementationPlan: this.generateImplementationPlan(analysis)
    };
  }

  // Generate recommendations based on analysis
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.summary.wwwVsNonWww > 0) {
      recommendations.push({
        priority: 'high',
        type: 'canonical',
        issue: 'WWW vs non-WWW duplicate content',
        solution: 'Implement 301 redirects to preferred domain (www.ewastekochi.com)',
        impact: 'Eliminates duplicate content, consolidates link equity'
      });
    }

    if (analysis.summary.htmlExtensions > 0) {
      recommendations.push({
        priority: 'high',
        type: 'url_structure',
        issue: 'HTML extensions in URLs',
        solution: '301 redirect all .html pages to clean URLs',
        impact: 'Improves URL structure and user experience'
      });
    }

    if (analysis.summary.deepNested > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'url_structure',
        issue: 'Deep nested location-service URLs',
        solution: 'Flatten to service-location pattern (e.g., /data-destruction-kakkanad/)',
        impact: 'Reduces URL complexity, improves SEO'
      });
    }

    if (analysis.summary.blogVsBlogs > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'canonical',
        issue: 'Blog vs blogs path inconsistency',
        solution: '301 redirect /blogs/ to /blog/ or vice versa',
        impact: 'Consolidates blog content, eliminates duplicate content'
      });
    }

    if (analysis.summary.oldPincodes > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'user_experience',
        issue: 'Old pincode-based URLs',
        solution: '301 redirect to location hub pages',
        impact: 'Improves user experience and URL readability'
      });
    }

    if (analysis.summary.malayalam > 0) {
      recommendations.push({
        priority: 'low',
        type: 'internationalization',
        issue: 'Malayalam pages without hreflang',
        solution: 'Implement hreflang tags or redirect to English',
        impact: 'Proper international SEO implementation'
      });
    }

    return recommendations;
  }

  // Generate implementation plan
  generateImplementationPlan(analysis) {
    return {
      phase1: {
        title: 'Critical Fixes (Week 1)',
        tasks: [
          'Update vercel.json with all redirect rules',
          'Test redirects for critical pages',
          'Update sitemap to remove redirected URLs',
          'Submit new sitemap to Google Search Console'
        ]
      },
      phase2: {
        title: 'Schema & Semantic Updates (Week 2)',
        tasks: [
          'Update BaseLayout.astro with dynamic schema generation',
          'Implement proper heading structure',
          'Add missing semantic elements',
          'Validate schema markup with Google Rich Results Test'
        ]
      },
      phase3: {
        title: 'Monitoring & Refinement (Week 3-4)',
        tasks: [
          'Monitor 404 errors and redirect performance',
          'Track indexing status in Google Search Console',
          'Analyze organic traffic changes',
          'Refine any remaining issues'
        ]
      }
    };
  }
}

export default URLAnalyzer;
