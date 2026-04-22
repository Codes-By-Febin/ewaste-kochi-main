// Blog Post Generation Script - Generate 10,000+ Optimized Blog Posts
// Usage: node src/scripts/generateBlogPosts.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BlogContentGenerator from '../utils/blogContentGenerator.js';
import BlogInternalLinkingEngine from '../utils/blogInternalLinkingEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlogPostGenerator {
  constructor() {
    this.contentGenerator = new BlogContentGenerator();
    this.linkingEngine = new BlogInternalLinkingEngine();
    this.contentDir = path.join(__dirname, '../content/blog');
    this.postsGenerated = 0;
    this.errors = [];
  }

  // Generate all blog posts
  async generateAllPosts(totalPosts = 10000) {
    console.log(`Starting generation of ${totalPosts} blog posts...`);
    
    // Ensure content directory exists
    if (!fs.existsSync(this.contentDir)) {
      fs.mkdirSync(this.contentDir, { recursive: true });
    }

    // Generate posts by clusters for better topical authority
    const clusters = [
      { name: 'e-waste-basics', count: 3000 },
      { name: 'data-security', count: 2500 },
      { name: 'buyback-pricing', count: 2000 },
      { name: 'location-specific', count: 1500 },
      { name: 'compliance-legal', count: 1000 }
    ];

    for (const cluster of clusters) {
      console.log(`Generating ${cluster.count} posts for cluster: ${cluster.name}`);
      await this.generateClusterPosts(cluster.name, cluster.count);
    }

    // Generate summary report
    this.generateReport();
    
    console.log(`\nGeneration complete! Total posts: ${this.postsGenerated}`);
    console.log(`Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\nErrors encountered:');
      this.errors.forEach(error => console.log(`- ${error}`));
    }
  }

  // Generate posts for a specific cluster
  async generateClusterPosts(clusterName, count) {
    const posts = this.contentGenerator.generateClusterPosts(clusterName, count);
    
    for (const post of posts) {
      try {
        await this.saveBlogPost(post);
        this.postsGenerated++;
        
        // Progress indicator
        if (this.postsGenerated % 100 === 0) {
          console.log(`Generated ${this.postsGenerated} posts...`);
        }
      } catch (error) {
        this.errors.push(`Failed to save post "${post.title}": ${error.message}`);
      }
    }
  }

  // Save blog post to file
  async saveBlogPost(post) {
    const filePath = path.join(this.contentDir, `${post.slug}.md`);
    
    // Validate content before saving
    const validation = this.contentGenerator.validateGeneratedContent(post);
    if (!validation.valid) {
      console.warn(`Validation warnings for "${post.title}":`, validation.issues);
    }

    // Process with internal linking engine
    const processedPost = this.linkingEngine.processBlogPost(post);

    // Generate frontmatter
    const frontmatter = this.generateFrontmatter(processedPost);
    
    // Combine frontmatter and content
    const fullContent = `---\n${frontmatter}\n---\n\n${processedPost.data.content}`;
    
    // Write to file
    fs.writeFileSync(filePath, fullContent, 'utf8');
  }

  // Generate frontmatter for blog post
  generateFrontmatter(post) {
    const frontmatter = {
      title: post.title,
      description: post.description,
      author: post.author || 'EWaste Kochi Team',
      published: post.published.toISOString().split('T')[0],
      priority: 0.8,
      cluster: post.cluster || 'general',
      tags: post.tags ? post.tags.join(', ') : '',
      wordCount: post.wordCount,
      templateType: post.templateType,
      sections: post.sections ? post.sections.join(', ') : '',
      internalLinks: post.data.internalLinks ? post.data.internalLinks.length : 0,
      relatedPosts: post.data.relatedPosts ? post.data.relatedPosts.map(p => p.slug).join(', ') : '',
      tableOfContents: post.data.tableOfContents ? post.data.tableOfContents.length : 0,
      faqs: post.data.faqs ? post.data.faqs.length : 0,
      ctas: post.data.ctas ? post.data.ctas.length : 0
    };

    // Convert to YAML format
    return Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');
  }

  // Generate summary report
  generateReport() {
    const report = {
      totalPosts: this.postsGenerated,
      errors: this.errors.length,
      generatedAt: new Date().toISOString(),
      clusters: {},
      templateTypes: {},
      wordCountStats: {
        min: Infinity,
        max: 0,
        avg: 0
      }
    };

    // Analyze generated posts
    const files = fs.readdirSync(this.contentDir).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(this.contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        
        // Extract cluster
        const clusterMatch = frontmatter.match(/cluster: "(.*?)"/);
        if (clusterMatch) {
          const cluster = clusterMatch[1];
          report.clusters[cluster] = (report.clusters[cluster] || 0) + 1;
        }
        
        // Extract template type
        const templateMatch = frontmatter.match(/templateType: "(.*?)"/);
        if (templateMatch) {
          const template = templateMatch[1];
          report.templateTypes[template] = (report.templateTypes[template] || 0) + 1;
        }
        
        // Extract word count
        const wordCountMatch = frontmatter.match(/wordCount: (\d+)/);
        if (wordCountMatch) {
          const wordCount = parseInt(wordCountMatch[1]);
          report.wordCountStats.min = Math.min(report.wordCountStats.min, wordCount);
          report.wordCountStats.max = Math.max(report.wordCountStats.max, wordCount);
          report.wordCountStats.avg += wordCount;
        }
      }
    });

    // Calculate average word count
    if (files.length > 0) {
      report.wordCountStats.avg = Math.round(report.wordCountStats.avg / files.length);
    }

    // Save report
    const reportPath = path.join(__dirname, '../blog-generation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`\nGeneration report saved to: ${reportPath}`);
  }

  // Generate specific number of posts for testing
  async generateTestPosts(count = 10) {
    console.log(`Generating ${count} test posts...`);
    
    const posts = this.contentGenerator.generateBlogPosts(count);
    
    for (const post of posts) {
      try {
        await this.saveBlogPost(post);
        this.postsGenerated++;
        console.log(`Generated: ${post.title}`);
      } catch (error) {
        this.errors.push(`Failed to save post "${post.title}": ${error.message}`);
        console.error(`Error: ${error.message}`);
      }
    }
    
    console.log(`Test generation complete! Generated ${this.postsGenerated} posts.`);
  }

  // Clean up generated posts
  cleanupPosts() {
    const files = fs.readdirSync(this.contentDir).filter(file => file.endsWith('.md'));
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(this.contentDir, file);
      fs.unlinkSync(filePath);
      deletedCount++;
    });
    
    console.log(`Cleaned up ${deletedCount} blog posts.`);
  }
}

// CLI interface
async function main() {
  const generator = new BlogPostGenerator();
  const args = process.argv.slice(2);
  
  const command = args[0];
  const count = parseInt(args[1]) || 10000;
  
  switch (command) {
    case 'generate':
      await generator.generateAllPosts(count);
      break;
      
    case 'test':
      await generator.generateTestPosts(Math.min(count, 50));
      break;
      
    case 'cleanup':
      generator.cleanupPosts();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node generateBlogPosts.js generate [count]  - Generate blog posts');
      console.log('  node generateBlogPosts.js test [count]     - Generate test posts');
      console.log('  node generateBlogPosts.js cleanup        - Clean up generated posts');
      console.log('');
      console.log('Examples:');
      console.log('  node generateBlogPosts.js test 10          - Generate 10 test posts');
      console.log('  node generateBlogPosts.js generate 1000   - Generate 1000 posts');
      process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default BlogPostGenerator;
