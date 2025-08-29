const { query } = require('./connection');

async function forceReseed() {
  try {
    console.log('🧹 Clearing existing regulation data...');
    
    // Clear all related data first (in correct order due to foreign keys)
    await query('DELETE FROM regulation_applicability');
    await query('DELETE FROM regulation_exemptions');
    await query('DELETE FROM requirements');
    await query('DELETE FROM penalties');
    await query('DELETE FROM business_regulations');
    await query('DELETE FROM compliance_results');
    await query('DELETE FROM regulations');
    await query('DELETE FROM businesses');
    
    console.log('✅ All existing data cleared');
    
    // Reset sequences
    await query('ALTER SEQUENCE regulations_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE businesses_id_seq RESTART WITH 1');
    
    console.log('✅ Sequences reset');
    
    // Now run the seeders
    console.log('🌱 Running regulation seeders...');
    
    // Run first batch
    console.log('📦 Seeding first batch of regulations...');
    const { seedRegulations } = require('./regulations-seeder');
    await seedRegulations();
    
    // Run second batch
    console.log('📦 Seeding second batch of regulations...');
    const { seedRegulationsBatch2 } = require('./regulations-seeder-batch2');
    await seedRegulationsBatch2();
    
    console.log('🎉 Force reseed completed successfully!');
    
  } catch (error) {
    console.error('❌ Force reseed failed:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  forceReseed()
    .then(() => {
      console.log('🎉 Force reseed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Force reseed failed:', error);
      process.exit(1);
    });
}

module.exports = { forceReseed };
