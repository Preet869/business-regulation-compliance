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
    console.log('🚀 Starting database setup...');
    
    // Step 1: Create tables directly (we know this works from debug test)
    console.log('📋 Creating database tables...');
    
    // Create businesses table
    await query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        county VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        zip_code VARCHAR(10) NOT NULL,
        size VARCHAR(50) NOT NULL,
        employee_count INTEGER NOT NULL,
        annual_revenue DECIMAL(15,2) NOT NULL,
        business_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Businesses table created');
    
    // Create regulations table
    await query(`
      CREATE TABLE IF NOT EXISTS regulations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        jurisdiction VARCHAR(100) NOT NULL,
        authority VARCHAR(200) NOT NULL,
        effective_date DATE NOT NULL,
        compliance_deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Regulations table created');
    
    // Create other tables
    await query(`
      CREATE TABLE IF NOT EXISTS penalties (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2),
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Penalties table created');
    
    await query(`
      CREATE TABLE IF NOT EXISTS requirements (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        frequency VARCHAR(100),
        documentation TEXT,
        deadline VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Requirements table created');
    
    await query(`
      CREATE TABLE IF NOT EXISTS compliance_results (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        compliance_score DECIMAL(5,2) NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Compliance results table created');
    
    await query(`
      CREATE TABLE IF NOT EXISTS business_regulations (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        is_applicable BOOLEAN DEFAULT true,
        compliance_status VARCHAR(50) DEFAULT 'pending',
        next_deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(business_id, regulation_id)
      )
    `);
    console.log('✅ Business regulations table created');
    
    // Step 2: Add sample regulations
    console.log('🌱 Adding sample regulations...');
    await query(`
      INSERT INTO regulations (title, description, category, jurisdiction, authority, effective_date) VALUES
      ('OSHA Workplace Safety Standards', 'Federal workplace safety regulations for all businesses with employees', 'Safety', 'Federal', 'OSHA', '2020-01-01'),
      ('ADA Compliance Requirements', 'Americans with Disabilities Act compliance for public accommodations', 'Accessibility', 'Federal', 'DOJ', '2020-01-01'),
      ('Tax Filing Requirements', 'Annual tax filing requirements for businesses', 'Taxation', 'Federal', 'IRS', '2020-01-01'),
      ('Environmental Protection Standards', 'EPA regulations for business environmental compliance', 'Environmental', 'Federal', 'EPA', '2020-01-01'),
      ('Labor Law Compliance', 'Federal labor laws including minimum wage and overtime', 'Labor', 'Federal', 'DOL', '2020-01-01')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample regulations added');
    
    // Step 3: Verify setup
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const regulationsResult = await query('SELECT COUNT(*) as count FROM regulations');
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables created:', tablesResult.rows.map(r => r.table_name));
    console.log('📊 Regulations count:', regulationsResult.rows[0].count);
    
    res.json({ 
      success: true, 
      message: 'Database initialized and populated successfully',
      tables: tablesResult.rows.map(r => r.table_name),
      regulationsCount: parseInt(regulationsResult.rows[0].count),
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
