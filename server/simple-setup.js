const { Pool } = require('pg');

// Create a direct connection to your database
const pool = new Pool({
  connectionString: 'postgresql://business_user:v78CNF12SzRjTceBk8hnRJe53j8H05q8@dpg-d2ogn5ogjchc73eo76fg-a.oregon-postgres.render.com/business_regulation_0je8',
  ssl: { rejectUnauthorized: false }
});

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Create businesses table
    console.log('📋 Creating businesses table...');
    await client.query(`
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
    
    // Create regulations table
    console.log('📋 Creating regulations table...');
    await client.query(`
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
    
    // Create other tables...
    console.log('📋 Creating other tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS penalties (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2),
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
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
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_results (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        compliance_score DECIMAL(5,2) NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
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
    
    // Add some sample regulations
    console.log('🌱 Adding sample regulations...');
    await client.query(`
      INSERT INTO regulations (title, description, category, jurisdiction, authority, effective_date) VALUES
      ('OSHA Workplace Safety Standards', 'Federal workplace safety regulations for all businesses with employees', 'Safety', 'Federal', 'OSHA', '2020-01-01'),
      ('ADA Compliance Requirements', 'Americans with Disabilities Act compliance for public accommodations', 'Accessibility', 'Federal', 'DOJ', '2020-01-01'),
      ('Tax Filing Requirements', 'Annual tax filing requirements for businesses', 'Taxation', 'Federal', 'IRS', '2020-01-01')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Database setup completed successfully!');
    
    // Check what we created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const regulationsResult = await client.query('SELECT COUNT(*) as count FROM regulations');
    
    console.log('📊 Tables created:', tablesResult.rows.map(r => r.table_name));
    console.log('📊 Regulations count:', regulationsResult.rows[0].count);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run the setup
setupDatabase();
