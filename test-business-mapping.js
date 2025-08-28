const axios = require('axios');

// Test configuration
const API_BASE = 'http://localhost:5001/api';

// Test business profiles with expected outcomes
const testBusinesses = [
  // Small Technology Business
  {
    name: 'TechStart Inc',
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
    usesHazardousMaterials: false,
    expectedScore: 'high', // Should be high for small tech
    expectedRisk: 'low',
    expectedRegulations: ['Business Licensing', 'Privacy & Security'],
    description: 'Small Technology Business'
  },
  
  // Large Technology Business
  {
    name: 'MegaTech Corp',
    industry: 'Technology',
    businessType: 'Corporation',
    size: 'Large',
    employeeCount: 5000,
    annualRevenue: 10000000,
    state: 'CA',
    county: 'Kern',
    city: 'Bakersfield',
    zipCode: '93301',
    hasEmployees: true,
    servesFood: false,
    handlesCustomerData: true,
    usesHazardousMaterials: false,
    expectedScore: 'low', // Should be low for large tech
    expectedRisk: 'critical',
    expectedRegulations: ['Labor & Employment', 'Workplace Safety', 'Privacy & Security'],
    description: 'Large Technology Business'
  },
  
  // Medium Healthcare Business
  {
    name: 'HealthCare Plus',
    industry: 'Healthcare',
    businessType: 'Corporation',
    size: 'Medium',
    employeeCount: 100,
    annualRevenue: 250000,
    state: 'CA',
    county: 'Kern',
    city: 'Bakersfield',
    zipCode: '93301',
    hasEmployees: true,
    servesFood: false,
    handlesCustomerData: true,
    usesHazardousMaterials: false,
    expectedScore: 'medium', // Should be medium for healthcare
    expectedRisk: 'medium',
    expectedRegulations: ['Health & Safety', 'Privacy & Security', 'Professional Licensing'],
    description: 'Medium Healthcare Business'
  },
  
  // Small Food Service Business
  {
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
    usesHazardousMaterials: false,
    expectedScore: 'high', // Should be high for small food service
    expectedRisk: 'low',
    expectedRegulations: ['Health & Safety', 'Business Licensing'],
    description: 'Small Food Service Business'
  },
  
  // Large Manufacturing Business
  {
    name: 'Industrial Manufacturing',
    industry: 'Manufacturing',
    businessType: 'Corporation',
    size: 'Large',
    employeeCount: 2000,
    annualRevenue: 50000000,
    state: 'CA',
    county: 'Kern',
    city: 'Bakersfield',
    zipCode: '93301',
    hasEmployees: true,
    servesFood: false,
    handlesCustomerData: false,
    usesHazardousMaterials: true,
    expectedScore: 'low', // Should be low for large manufacturing
    expectedRisk: 'critical',
    expectedRegulations: ['Workplace Safety', 'Environmental', 'Business Licensing'],
    description: 'Large Manufacturing Business'
  }
];

// Test results storage
const testResults = [];

// Helper function to test compliance for a business
async function testBusinessCompliance(business, index) {
  console.log(`\n🧪 Testing ${business.description} (${index + 1}/${testBusinesses.length})`);
  console.log(`   Industry: ${business.industry}, Size: ${business.size}, Employees: ${business.employeeCount}`);
  
  try {
    // Extract only the business data fields (exclude test metadata)
    const businessData = {
      name: business.name,
      industry: business.industry,
      businessType: business.businessType,
      size: business.size,
      employeeCount: business.employeeCount,
      annualRevenue: business.annualRevenue,
      state: business.state,
      county: business.county,
      city: business.city,
      zipCode: business.zipCode,
      hasEmployees: business.hasEmployees,
      servesFood: business.servesFood,
      handlesCustomerData: business.handlesCustomerData,
      usesHazardousMaterials: business.usesHazardousMaterials
    };
    
    // Test compliance check first
    console.log(`   🔍 Testing compliance check...`);
    const complianceResponse = await axios.post(`${API_BASE}/compliance/check`, businessData);
    const complianceData = complianceResponse.data;
    
    console.log(`   ✅ Compliance check successful: ${complianceData.complianceScore}% score, ${complianceData.riskLevel} risk`);
    
    // Test business creation
    console.log(`   🏢 Creating business...`);
    const businessResponse = await axios.post(`${API_BASE}/business`, businessData);
    const createdBusiness = businessResponse.data;
    
    console.log(`   ✅ Business created with ID: ${createdBusiness.business.id}`);
    
    // Test compliance save
    console.log(`   💾 Saving compliance results...`);
    const saveResponse = await axios.post(`${API_BASE}/compliance/save`, {
      businessId: createdBusiness.business.id,
      complianceScore: complianceData.complianceScore,
      riskLevel: complianceData.riskLevel,
      applicableRegulations: complianceData.applicableRegulations,
      nextDeadlines: complianceData.nextDeadlines,
      recommendations: complianceData.recommendations,
      timestamp: new Date().toISOString()
    });
    
    console.log(`   ✅ Compliance results saved`);
    
    // Analyze results
    const result = {
      business: business.description,
      industry: business.industry,
      size: business.size,
      employeeCount: business.employeeCount,
      actualScore: complianceData.complianceScore,
      actualRisk: complianceData.riskLevel,
      actualRegulations: complianceData.applicableRegulations.length,
      actualCategories: [...new Set(complianceData.applicableRegulations.map(r => r.category))],
      expectedScore: business.expectedScore,
      expectedRisk: business.expectedRisk,
      expectedRegulations: business.expectedRegulations,
      scoreMatch: isScoreMatch(complianceData.complianceScore, business.expectedScore),
      riskMatch: isRiskMatch(complianceData.riskLevel, business.expectedRisk),
      regulationMatch: isRegulationMatch(complianceData.applicableRegulations, business.expectedRegulations),
      success: true
    };
    
    testResults.push(result);
    
    // Log results
    console.log(`   📊 Final Results:`);
    console.log(`      Score: ${complianceData.complianceScore}% (${result.scoreMatch ? '✅' : '❌'} Expected: ${business.expectedScore})`);
    console.log(`      Risk: ${complianceData.riskLevel} (${result.riskMatch ? '✅' : '❌'} Expected: ${business.expectedRisk})`);
    console.log(`      Regulations: ${complianceData.applicableRegulations.length} found`);
    console.log(`      Categories: ${result.actualCategories.join(', ')}`);
    
    // Test compliance history retrieval
    console.log(`   📚 Testing compliance history...`);
    const historyResponse = await axios.get(`${API_BASE}/compliance/history/${createdBusiness.business.id}`);
    console.log(`   ✅ Compliance History: ${historyResponse.data.compliance ? 'Retrieved' : 'None'}`);
    
  } catch (error) {
    console.error(`   ❌ Error testing ${business.description}:`);
    console.error(`      Status: ${error.response?.status}`);
    console.error(`      Message: ${error.response?.data?.error || error.message}`);
    if (error.response?.data) {
      console.error(`      Details:`, JSON.stringify(error.response.data, null, 2));
    }
    testResults.push({
      business: business.description,
      success: false,
      error: error.response?.data?.error || error.message
    });
  }
}

// Helper functions for validation
function isScoreMatch(actual, expected) {
  if (expected === 'high') return actual >= 70;
  if (expected === 'medium') return actual >= 40 && actual < 70;
  if (expected === 'low') return actual < 40;
  return false;
}

function isRiskMatch(actual, expected) {
  const riskLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  return riskLevels[actual.toLowerCase()] === riskLevels[expected.toLowerCase()];
}

function isRegulationMatch(actualRegulations, expectedCategories) {
  const actualCategories = [...new Set(actualRegulations.map(r => r.category))];
  return expectedCategories.every(cat => actualCategories.includes(cat));
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Business Mapping and Compliance Testing');
  console.log('=' .repeat(60));
  
  // Test each business
  for (let i = 0; i < testBusinesses.length; i++) {
    await testBusinessCompliance(testBusinesses[i], i);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate test summary
  generateTestSummary();
}

// Generate comprehensive test summary
function generateTestSummary() {
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const totalTests = testResults.length;
  const successfulTests = testResults.filter(r => r.success).length;
  const failedTests = totalTests - successfulTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Successful: ${successfulTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
  
  // Score validation results
  const scoreTests = testResults.filter(r => r.success && r.scoreMatch !== undefined);
  const scoreMatches = scoreTests.filter(r => r.scoreMatch).length;
  console.log(`\nScore Validation: ${scoreMatches}/${scoreTests.length} (${((scoreMatches / scoreTests.length) * 100).toFixed(1)}%)`);
  
  // Risk validation results
  const riskTests = testResults.filter(r => r.success && r.riskMatch !== undefined);
  const riskMatches = riskTests.filter(r => r.riskMatch).length;
  console.log(`Risk Validation: ${riskMatches}/${riskTests.length} (${((riskMatches / riskTests.length) * 100).toFixed(1)}%)`);
  
  // Regulation validation results
  const regulationTests = testResults.filter(r => r.success && r.regulationMatch !== undefined);
  const regulationMatches = regulationTests.filter(r => r.regulationMatch).length;
  console.log(`Regulation Validation: ${regulationMatches}/${regulationTests.length} (${((regulationMatches / regulationTests.length) * 100).toFixed(1)}%)`);
  
  // Detailed results for each test
  console.log('\n📋 DETAILED RESULTS:');
  testResults.forEach((result, index) => {
    if (result.success) {
      console.log(`\n${index + 1}. ${result.business}`);
      console.log(`   Industry: ${result.industry}, Size: ${result.size}, Employees: ${result.employeeCount}`);
      console.log(`   Score: ${result.actualScore}% (${result.scoreMatch ? '✅' : '❌'} Expected: ${result.expectedScore})`);
      console.log(`   Risk: ${result.actualRisk} (${result.riskMatch ? '✅' : '❌'} Expected: ${result.expectedRisk})`);
      console.log(`   Regulations: ${result.actualRegulations} (${result.regulationMatch ? '✅' : '❌'} Expected: ${result.expectedRegulations.join(', ')})`);
      console.log(`   Categories: ${result.actualCategories.join(', ')}`);
    } else {
      console.log(`\n${index + 1}. ${result.business} - ❌ FAILED: ${result.error}`);
    }
  });
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (failedTests > 0) {
    console.log('❌ Some tests failed. Check the error messages above.');
  }
  if (scoreMatches < scoreTests.length) {
    console.log('⚠️  Score validation needs improvement. Review scoring algorithm.');
  }
  if (riskMatches < riskTests.length) {
    console.log('⚠️  Risk validation needs improvement. Review risk assessment logic.');
  }
  if (regulationMatches < regulationTests.length) {
    console.log('⚠️  Regulation matching needs improvement. Review industry-category mapping.');
  }
  if (successfulTests === totalTests && scoreMatches === scoreTests.length && riskMatches === riskTests.length && regulationMatches === regulationTests.length) {
    console.log('🎉 All tests passed! The system is working perfectly.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testBusinesses };
