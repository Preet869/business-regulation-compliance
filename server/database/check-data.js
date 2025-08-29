const { query } = require('./connection');

async function checkData() {
  try {
    console.log('🔍 Checking database data...');
    
    // Check regulations count
    const regResult = await query('SELECT COUNT(*) as count FROM regulations');
    const regCount = regResult.rows[0].count;
    console.log(`📊 Regulations: ${regCount}`);
    
    // Check businesses count
    const busResult = await query('SELECT COUNT(*) as count FROM businesses');
    const busCount = busResult.rows[0].count;
    console.log(`🏢 Businesses: ${busCount}`);
    
    if (regCount > 0) {
      console.log('✅ Database has data, no seeding needed');
      process.exit(0);
    } else {
      console.log('⚠️ Database is empty, seeding needed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    process.exit(1);
  }
}

checkData();
