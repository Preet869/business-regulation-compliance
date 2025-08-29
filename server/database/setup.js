const { query } = require('./connection');

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database tables...');

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

    // Create penalties table
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

    // Create requirements table
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

    // Create regulation_exemptions table
    await query(`
      CREATE TABLE IF NOT EXISTS regulation_exemptions (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        exemption_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create regulation_applicability table
    await query(`
      CREATE TABLE IF NOT EXISTS regulation_applicability (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER REFERENCES regulations(id) ON DELETE CASCADE,
        applies_to VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create compliance_results table
    await query(`
      CREATE TABLE IF NOT EXISTS compliance_results (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        compliance_score DECIMAL(5,2) NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create business_regulations table (many-to-many relationship)
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

    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    
    await query('CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(state, county, city)');
    await query('CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry)');
    await query('CREATE INDEX IF NOT EXISTS idx_businesses_size ON businesses(size)');
    await query('CREATE INDEX IF NOT EXISTS idx_regulations_category ON regulations(category)');
    await query('CREATE INDEX IF NOT EXISTS idx_regulations_jurisdiction ON regulations(jurisdiction)');
    await query('CREATE INDEX IF NOT EXISTS idx_regulations_effective_date ON regulations(effective_date)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_regulations_business ON business_regulations(business_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_regulations_regulation ON business_regulations(regulation_id)');

    // Create full-text search index for regulations
    await query(`
      CREATE INDEX IF NOT EXISTS idx_regulations_search 
      ON regulations USING gin(to_tsvector('english', title || ' ' || description))
    `);

    console.log('✅ Database setup completed successfully!');
    
    // Create updated_at trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at
    try {
      await query(`
        DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
        CREATE TRIGGER update_businesses_updated_at 
        BEFORE UPDATE ON businesses 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    } catch (error) {
      console.log('⚠️ Businesses trigger creation skipped (may already exist)');
    }

    try {
      await query(`
        DROP TRIGGER IF EXISTS update_regulations_updated_at ON regulations;
        CREATE TRIGGER update_regulations_updated_at 
        BEFORE UPDATE ON regulations 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    } catch (error) {
      console.log('⚠️ Regulations trigger creation skipped (may already exist)');
    }

    try {
      await query(`
        DROP TRIGGER IF EXISTS update_business_regulations_updated_at ON business_regulations;
        CREATE TRIGGER update_business_regulations_updated_at 
        BEFORE UPDATE ON business_regulations 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    } catch (error) {
      console.log('⚠️ Business regulations trigger creation skipped (may already exist)');
    }

    console.log('✅ Triggers and functions created successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
