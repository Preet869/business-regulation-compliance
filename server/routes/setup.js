const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const setupDatabase = require('../database/setup');

// Database setup endpoint - call this once to initialize your database
router.post('/init', async (req, res) => {
  try {
    console.log('🚀 Initializing database...');
    
    // Run the setup script
    await setupDatabase();
    
    console.log('✅ Database setup completed successfully!');
    res.json({ 
      success: true, 
      message: 'Database initialized successfully',
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

module.exports = router;
