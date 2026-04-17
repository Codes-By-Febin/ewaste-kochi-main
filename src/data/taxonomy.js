// src/data/taxonomy.js

export const pillars = [
  {
    id: 'ewaste',
    name: 'E-Waste Recycling',
    url: '/ewaste/',
    description: "Kerala's most trusted certified e-waste recycler.",
    keywords: ['recycling', 'disposal', 'ewaste', 'waste', 'collection'],
  },
  {
    id: 'itad',
    name: 'IT Asset Disposition (ITAD)',
    url: '/itad/',
    description: 'NIST 800-88 certified data destruction & corporate IT retirement.',
    keywords: ['ITAD', 'data destruction', 'NIST', 'compliance', 'hard drive shredding'],
  },
  {
    id: 'sell',
    name: 'Sell Electronics',
    url: '/sell-electronics-kochi/',
    description: 'Get the best buyback value for your used laptops, phones, and servers.',
    keywords: ['buyback', 'sell', 'cash', 'laptop', 'iPhone', 'MacBook'],
  },
];

export const serviceMappings = {
  'battery-recycling': { pillar: 'ewaste', name: 'Battery Recycling', url: '/services/battery-recycling-kochi/' },
  'free-pickup': { pillar: 'ewaste', name: 'Free E-Waste Pickup', url: '/services/free-ewaste-pickup-kochi/' },
  'computer-recycling': { pillar: 'ewaste', name: 'Computer Recycling', url: '/services/computer-recycling/' },
  'hard-drive-shredding': { pillar: 'itad', name: 'Hard Drive Shredding', url: '/services/hard-drive-shredding-kochi/' },
  'data-destruction': { pillar: 'itad', name: 'Data Destruction', url: '/services/data-destruction-kochi/' },
  'chain-of-custody': { pillar: 'itad', name: 'Chain of Custody', url: '/itad/chain-of-custody-documentation/' },
  'macbook-buyback': { pillar: 'sell', name: 'MacBook Buyback', url: '/sell-electronics-kochi/macbook-buyback-price-calculator/' },
  'cisco-buyers': { pillar: 'sell', name: 'Cisco Switch Buyers', url: '/sell-electronics-kochi/old-cisco-switch-buyers-kochi/' },
};

export const blogTagMappings = {
  'data-destruction': ['hard-drive-shredding', 'data-destruction'],
  'compliance': ['dpdp-act', 'chain-of-custody'],
  'recycling': ['battery-recycling', 'computer-recycling'],
  'buyback': ['macbook-buyback', 'cisco-buyers'],
};
