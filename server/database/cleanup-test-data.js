const { query } = require('./connection');

async function cleanupTestData() {
  try {
    console.log('🧹 Starting cleanup of test data...');
    
    // Step 1: Remove business_regulations (foreign key constraints)
    console.log('📋 Removing business_regulations...');
    const businessRegulationsResult = await query('DELETE FROM business_regulations');
    console.log(`✅ Removed ${businessRegulationsResult.rowCount} business_regulations records`);
    
    // Step 2: Remove compliance_results
    console.log('📊 Removing compliance_results...');
    const complianceResultsResult = await query('DELETE FROM compliance_results');
    console.log(`✅ Removed ${complianceResultsResult.rowCount} compliance_results records`);
    
    // Step 3: Remove all businesses
    console.log('🏢 Removing all test businesses...');
    const businessesResult = await query('DELETE FROM businesses');
    console.log(`✅ Removed ${businessesResult.rowCount} businesses`);
    
    // Step 4: Reset auto-increment counters
    console.log('🔄 Resetting auto-increment counters...');
    await query('ALTER SEQUENCE businesses_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE compliance_results_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE business_regulations_id_seq RESTART WITH 1');
    console.log('✅ Auto-increment counters reset');
    
    // Step 5: Verify regulations are still intact
    console.log('📚 Verifying regulations database...');
    const regulationsResult = await query('SELECT COUNT(*) as count FROM regulations');
    const regulationCount = regulationsResult.rows[0].count;
    console.log(`✅ Regulations database intact: ${regulationCount} regulations`);
    
    // Step 6: Show final status
    console.log('\n🎯 CLEANUP COMPLETE!');
    console.log('✅ All test businesses removed');
    console.log('✅ All compliance results removed');
    console.log('✅ All business_regulations removed');
    console.log('✅ Auto-increment counters reset');
    console.log(`✅ Regulations database: ${regulationCount} regulations preserved`);
    console.log('\n🚀 Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run cleanup
cleanupTestData();
