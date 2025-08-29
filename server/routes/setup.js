const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const setupDatabase = require('../database/setup');

// Import seeder functions
const seedDatabase = require('../database/seed');
const seedRegulations = require('../database/regulations-seeder');
const seedRegulationsBatch2 = require('../database/regulations-seeder-batch2');

// Database setup endpoint - call this once to initialize your database
router.post('/init', async (req, res) => {
  try {
    console.log('🚀 Initializing database...');
    
    // Step 1: Run the setup script (creates tables)
    console.log('📋 Creating database tables...');
    await setupDatabase();
    
    // Step 2: Seed the database with initial data
    console.log('🌱 Seeding database with initial data...');
    await seedDatabase();
    
    // Step 3: Seed regulations data
    console.log('📜 Seeding regulations data...');
    await seedRegulations();
    
    // Step 4: Seed additional regulations data
    console.log('📜 Seeding additional regulations data...');
    await seedRegulationsBatch2();
    
    console.log('✅ Database setup and seeding completed successfully!');
    res.json({ 
      success: true, 
      message: 'Database initialized and populated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Check database status
router.get('/status', async (req, res) => {
  try {
    // Check if tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    // Check if regulations table has data
    let regulationsCount = 0;
    if (tables.includes('regulations')) {
      const countResult = await query('SELECT COUNT(*) as count FROM regulations');
      regulationsCount = parseInt(countResult.rows[0].count);
    }
    
    res.json({
      success: true,
      tables: tables,
      regulationsCount: regulationsCount,
      databaseReady: tables.length > 0 && regulationsCount > 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint to test database connection
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const client = await query('SELECT 1 as test');
    console.log('✅ Basic query successful:', client.rows[0]);
    
    // Test if we can create a simple table
    console.log('🔍 Testing table creation...');
    await query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      )
    `);
    console.log('✅ Test table created successfully');
    
    // Check if test table exists
    const testTableResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'test_table'
    `);
    console.log('✅ Test table verification:', testTableResult.rows);
    
    // Clean up test table
    await query('DROP TABLE IF EXISTS test_table');
    console.log('✅ Test table cleaned up');
    
    res.json({
      success: true,
      message: 'Database connection and permissions test successful',
      testResults: {
        basicQuery: '✅ Passed',
        tableCreation: '✅ Passed',
        tableVerification: '✅ Passed',
        cleanup: '✅ Passed'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database debug test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
