const { query } = require('./connection');

const migrateBusinessFactors = async () => {
  try {
    console.log('🔧 Adding new business factor columns...');
    
    // Add new columns to businesses table
    await query(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS has_employees BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS serves_food BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS handles_customer_data BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS uses_hazardous_materials BOOLEAN DEFAULT false
    `);
    
    console.log('✅ New business factor columns added successfully!');
    
    // Update existing businesses with default values
    await query(`
      UPDATE businesses 
      SET 
        has_employees = COALESCE(has_employees, true),
        serves_food = COALESCE(serves_food, false),
        handles_customer_data = COALESCE(handles_customer_data, false),
        uses_hazardous_materials = COALESCE(uses_hazardous_materials, false)
      WHERE has_employees IS NULL 
         OR serves_food IS NULL 
         OR handles_customer_data IS NULL 
         OR uses_hazardous_materials IS NULL
    `);
    
    console.log('✅ Existing businesses updated with default values!');
    
    // Create index for better performance on new columns
    await query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_factors 
      ON businesses(has_employees, serves_food, handles_customer_data, uses_hazardous_materials)
    `);
    
    console.log('✅ Index created for business factors!');
    
  } catch (error) {
    console.error('❌ Error migrating business factors:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateBusinessFactors()
    .then(() => {
      console.log('🎉 Business factors migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Business factors migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateBusinessFactors };
