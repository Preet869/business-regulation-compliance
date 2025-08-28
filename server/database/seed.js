const { query } = require('./connection');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Clear existing data
    await query('TRUNCATE TABLE business_regulations, compliance_results, penalties, requirements, regulation_exemptions, regulation_applicability, regulations, businesses RESTART IDENTITY CASCADE');

    // Insert sample businesses
    console.log('🏢 Inserting sample businesses...');
    const businessResult = await query(`
      INSERT INTO businesses (name, industry, state, county, city, zip_code, size, employee_count, annual_revenue, business_type) VALUES
      ('Kern County Farm Supply', 'Agriculture', 'CA', 'Kern', 'Bakersfield', '93301', 'Medium', 25, 2500000.00, 'Corporation'),
      ('Bakersfield Auto Repair', 'Automotive', 'CA', 'Kern', 'Bakersfield', '93304', 'Small', 8, 450000.00, 'LLC'),
      ('Taft Restaurant Group', 'Food Service', 'CA', 'Kern', 'Taft', '93268', 'Small', 15, 800000.00, 'Corporation'),
      ('Kern Manufacturing Co', 'Manufacturing', 'CA', 'Kern', 'Bakersfield', '93308', 'Large', 150, 15000000.00, 'Corporation'),
      ('Delano Retail Store', 'Retail', 'CA', 'Kern', 'Delano', '93215', 'Small', 12, 600000.00, 'Sole Proprietorship')
      RETURNING id
    `);

    // Insert sample regulations
    console.log('📋 Inserting sample regulations...');
    const regulationResult = await query(`
      INSERT INTO regulations (title, description, category, jurisdiction, authority, effective_date, compliance_deadline) VALUES
      ('California Labor Code Section 226', 'Requires employers to provide itemized wage statements showing hours worked, rates, and deductions', 'Labor & Employment', 'California', 'California Labor Commissioner', '2023-01-01', '2024-01-01'),
      ('Kern County Business License Ordinance', 'All businesses operating in Kern County must obtain a business license', 'Business Licensing', 'Kern County', 'Kern County Treasurer-Tax Collector', '2023-01-01', '2024-01-01'),
      ('California Health and Safety Code Section 113700', 'Food facility sanitation requirements including handwashing, food storage, and pest control', 'Health & Safety', 'California', 'California Department of Public Health', '2023-01-01', '2024-01-01'),
      ('Bakersfield Municipal Code Chapter 5.04', 'Local business regulations for Bakersfield including signage and operating hours', 'Local Ordinances', 'Bakersfield', 'City of Bakersfield', '2023-01-01', '2024-01-01'),
      ('California Vehicle Code Section 4000', 'Vehicle registration and insurance requirements for business vehicles', 'Transportation', 'California', 'California DMV', '2023-01-01', '2024-01-01'),
      ('Kern County Zoning Ordinance', 'Land use and zoning regulations for business locations in Kern County', 'Land Use', 'Kern County', 'Kern County Planning Department', '2023-01-01', '2024-01-01'),
      ('California Environmental Quality Act', 'Environmental impact assessment requirements for certain business activities', 'Environmental', 'California', 'California Natural Resources Agency', '2023-01-01', '2024-01-01'),
      ('OSHA Workplace Safety Standards', 'Federal workplace safety requirements including hazard communication and personal protective equipment', 'Workplace Safety', 'Federal', 'Occupational Safety and Health Administration', '2023-01-01', '2024-01-01'),
      ('California Sales Tax Regulations', 'Sales tax collection and remittance requirements for retail businesses', 'Taxation', 'California', 'California Department of Tax and Fee Administration', '2023-01-01', '2024-01-01'),
      ('Kern County Air Pollution Control', 'Air quality regulations for businesses that may emit pollutants', 'Environmental', 'Kern County', 'Kern County Air Pollution Control District', '2023-01-01', '2024-01-01')
      RETURNING id
    `);

    // Insert penalties
    console.log('💰 Inserting penalties...');
    await query(`
      INSERT INTO penalties (regulation_id, type, amount, description) VALUES
      (1, 'Fine', 100.00, 'Per violation for missing wage statement information'),
      (1, 'Penalty', 50.00, 'Per day for late wage statement delivery'),
      (2, 'Fine', 500.00, 'For operating without a business license'),
      (3, 'Fine', 1000.00, 'For critical food safety violations'),
      (3, 'Suspension', 0.00, 'Temporary suspension of food facility permit'),
      (5, 'Fine', 250.00, 'For unregistered business vehicles'),
      (7, 'Fine', 5000.00, 'For failure to conduct environmental assessment'),
      (8, 'Fine', 10000.00, 'For serious workplace safety violations'),
      (9, 'Penalty', 100.00, 'For late sales tax payment'),
      (10, 'Fine', 2000.00, 'For air quality violations')
    `);

    // Insert requirements
    console.log('📝 Inserting requirements...');
    await query(`
      INSERT INTO requirements (regulation_id, description, frequency, documentation, deadline) VALUES
      (1, 'Provide itemized wage statements', 'Every pay period', 'Wage statements with required information', 'Each payday'),
      (2, 'Obtain business license', 'Annually', 'Business license certificate', 'January 1st'),
      (3, 'Maintain food facility cleanliness', 'Daily', 'Cleaning logs and inspection reports', 'Ongoing'),
      (4, 'Comply with local business hours', 'Daily', 'Operating schedule documentation', 'Ongoing'),
      (5, 'Register business vehicles', 'Annually', 'Vehicle registration certificates', 'Vehicle registration renewal'),
      (6, 'Comply with zoning requirements', 'Before operation', 'Zoning compliance certificate', 'Before business opens'),
      (7, 'Conduct environmental assessment', 'Before project start', 'Environmental impact report', 'Before project begins'),
      (8, 'Maintain workplace safety', 'Ongoing', 'Safety training records and inspection reports', 'Ongoing'),
      (9, 'Collect and remit sales tax', 'Monthly/Quarterly', 'Sales tax returns and payment records', 'Monthly or quarterly'),
      (10, 'Monitor air emissions', 'Monthly', 'Emission monitoring reports', 'Monthly')
    `);

    // Insert exemptions
    console.log('🚫 Inserting exemptions...');
    await query(`
      INSERT INTO regulation_exemptions (regulation_id, exemption_text) VALUES
      (1, 'Agricultural workers paid by piece rate'),
      (2, 'Home-based businesses with no employees'),
      (3, 'Temporary food facilities operating less than 3 days'),
      (5, 'Vehicles used exclusively on private property'),
      (6, 'Home-based businesses in residential zones'),
      (7, 'Minor alterations to existing facilities'),
      (8, 'Self-employed individuals with no employees'),
      (9, 'Non-profit organizations'),
      (10, 'Businesses with no air emissions')
    `);

    // Insert applicability
    console.log('🎯 Inserting applicability rules...');
    await query(`
      INSERT INTO regulation_applicability (regulation_id, applies_to) VALUES
      (1, 'All employers with employees'),
      (2, 'All businesses operating in Kern County'),
      (3, 'Food service businesses'),
      (4, 'Businesses in Bakersfield city limits'),
      (5, 'Businesses with company vehicles'),
      (6, 'All businesses in Kern County'),
      (7, 'Businesses with construction or development projects'),
      (8, 'All employers with employees'),
      (9, 'Retail and service businesses'),
      (10, 'Manufacturing and industrial businesses')
    `);

    // Create business-regulation relationships
    console.log('🔗 Creating business-regulation relationships...');
    for (const business of businessResult.rows) {
      // Each business gets different regulations based on their profile
      if (business.id === 1) { // Farm Supply
        await query(`
          INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status) VALUES
          (${business.id}, 1, true, 'pending'),
          (${business.id}, 2, true, 'pending'),
          (${business.id}, 5, true, 'pending'),
          (${business.id}, 6, true, 'pending'),
          (${business.id}, 9, true, 'pending')
        `);
      } else if (business.id === 2) { // Auto Repair
        await query(`
          INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status) VALUES
          (${business.id}, 1, true, 'pending'),
          (${business.id}, 2, true, 'pending'),
          (${business.id}, 4, true, 'pending'),
          (${business.id}, 5, true, 'pending'),
          (${business.id}, 6, true, 'pending'),
          (${business.id}, 8, true, 'pending'),
          (${business.id}, 9, true, 'pending')
        `);
      } else if (business.id === 3) { // Restaurant
        await query(`
          INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status) VALUES
          (${business.id}, 1, true, 'pending'),
          (${business.id}, 2, true, 'pending'),
          (${business.id}, 3, true, 'pending'),
          (${business.id}, 4, true, 'pending'),
          (${business.id}, 6, true, 'pending'),
          (${business.id}, 9, true, 'pending')
        `);
      } else if (business.id === 4) { // Manufacturing
        await query(`
          INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status) VALUES
          (${business.id}, 1, true, 'pending'),
          (${business.id}, 2, true, 'pending'),
          (${business.id}, 5, true, 'pending'),
          (${business.id}, 6, true, 'pending'),
          (${business.id}, 7, true, 'pending'),
          (${business.id}, 8, true, 'pending'),
          (${business.id}, 9, true, 'pending'),
          (${business.id}, 10, true, 'pending')
        `);
      } else if (business.id === 5) { // Retail
        await query(`
          INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status) VALUES
          (${business.id}, 1, true, 'pending'),
          (${business.id}, 2, true, 'pending'),
          (${business.id}, 4, true, 'pending'),
          (${business.id}, 6, true, 'pending'),
          (${business.id}, 9, true, 'pending')
        `);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${businessResult.rows.length} businesses and ${regulationResult.rows.length} regulations`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
