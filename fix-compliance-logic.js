const axios = require('axios');

// Test the current system and then propose fixes
const API_BASE = 'http://localhost:5001/api';

// Test cases that are currently failing
const failingTests = [
  {
    name: 'Small Tech Fix Test',
    business: {
      name: 'SmallTech Inc',
      industry: 'Technology',
      businessType: 'LLC',
      size: 'Small',
      employeeCount: 5,
      annualRevenue: 50000,
      state: 'CA',
      county: 'Kern',
      city: 'Bakersfield',
      zipCode: '93301',
      hasEmployees: true,
      servesFood: false,
      handlesCustomerData: true,
      usesHazardousMaterials: false
    },
    expectedScore: 'high', // Should be 70%+
    expectedRisk: 'low',   // Should be low
    description: 'Small Technology Business - Should have high score and low risk'
  },
  
  {
    name: 'Food Service Fix Test',
    business: {
      name: 'Tasty Bites',
      industry: 'Food Service',
      businessType: 'Sole Proprietorship',
      size: 'Small',
      employeeCount: 3,
      annualRevenue: 75000,
      state: 'CA',
      county: 'Kern',
      city: 'Bakersfield',
      zipCode: '93301',
      hasEmployees: true,
      servesFood: true,
      handlesCustomerData: false,
      usesHazardousMaterials: false
    },
    expectedScore: 'high', // Should be 70%+
    expectedRisk: 'low',   // Should be low
    description: 'Small Food Service Business - Should have food safety regulations'
  }
];

async function testFailingCases() {
  console.log('🔍 Testing Currently Failing Cases...\n');
  
  for (const test of failingTests) {
    console.log(`🧪 Testing: ${test.description}`);
    
    try {
      const response = await axios.post(`${API_BASE}/compliance/check`, test.business);
      const data = response.data;
      
      console.log(`   Current Score: ${data.complianceScore}% (Expected: ${test.expectedScore})`);
      console.log(`   Current Risk: ${data.riskLevel} (Expected: ${test.expectedRisk})`);
      console.log(`   Regulations Found: ${data.applicableRegulations.length}`);
      console.log(`   Categories: ${[...new Set(data.applicableRegulations.map(r => r.category))].join(', ')}`);
      
      // Check if this is still failing
      const scoreMatch = test.expectedScore === 'high' ? data.complianceScore >= 70 : data.complianceScore < 40;
      const riskMatch = test.expectedRisk === 'low' ? data.riskLevel === 'Low' : data.riskLevel !== 'Low';
      
      if (scoreMatch && riskMatch) {
        console.log(`   ✅ FIXED! Score and risk now match expectations`);
      } else {
        console.log(`   ❌ Still failing - needs manual fix`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

async function analyzeRegulationDatabase() {
  console.log('📊 Analyzing Regulation Database...\n');
  
  try {
    // Get all regulations
    const response = await axios.get(`${API_BASE}/regulations?page=1&limit=50`);
    const regulations = response.data.regulations;
    
    console.log(`Total Regulations: ${regulations.length}`);
    
    // Analyze by category
    const categories = {};
    regulations.forEach(reg => {
      if (!categories[reg.category]) {
        categories[reg.category] = [];
      }
      categories[reg.category].push(reg.title);
    });
    
    console.log('\nRegulations by Category:');
    Object.entries(categories).forEach(([category, titles]) => {
      console.log(`   ${category}: ${titles.length} regulations`);
      titles.forEach(title => console.log(`     - ${title}`));
    });
    
    // Check for missing categories
    const expectedCategories = [
      'Business Licensing',
      'Privacy & Security', 
      'Labor & Employment',
      'Workplace Safety',
      'Health & Safety',
      'Environmental',
      'Professional Licensing'
    ];
    
    console.log('\nMissing Categories:');
    expectedCategories.forEach(cat => {
      if (!categories[cat]) {
        console.log(`   ❌ ${cat}: No regulations found`);
      }
    });
    
  } catch (error) {
    console.error('Error analyzing database:', error.message);
  }
}

async function runAnalysis() {
  console.log('🚀 Compliance System Analysis & Fix Recommendations');
  console.log('=' .repeat(60));
  
  await testFailingCases();
  await analyzeRegulationDatabase();
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Small businesses need higher base scores (less regulation burden)');
  console.log('2. Industry-category mapping needs expansion');
  console.log('3. Missing regulations for Food Service, Retail, etc.');
  console.log('4. Scoring algorithm should consider business size more heavily');
}

// Run if executed directly
if (require.main === module) {
  runAnalysis().catch(console.error);
}

module.exports = { runAnalysis };
