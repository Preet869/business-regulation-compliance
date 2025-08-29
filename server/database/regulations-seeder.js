const { query } = require('./connection');

// Comprehensive regulation data
const regulations = [
  // FEDERAL REGULATIONS
  {
    title: "OSHA Workplace Safety Standards",
    description: "Federal workplace safety regulations covering hazard communication, personal protective equipment, and workplace conditions.",
    category: "Workplace Safety",
    jurisdiction: "Federal",
    authority: "Occupational Safety and Health Administration (OSHA)",
    effectiveDate: "1970-12-29",
    complianceDeadline: null,
    penalties: [
      { type: "Serious Violation", amount: 15000, description: "Up to $15,000 per violation" },
      { type: "Willful Violation", amount: 150000, description: "Up to $150,000 per violation" },
      { type: "Repeat Violation", amount: 150000, description: "Up to $150,000 per violation" }
    ],
    requirements: [
      { description: "Maintain safety data sheets for hazardous chemicals", frequency: "Ongoing", documentation: "Safety data sheets", deadline: "Immediate upon chemical use" },
      { description: "Provide personal protective equipment", frequency: "As needed", documentation: "PPE training records", deadline: "Before hazardous work begins" },
      { description: "Conduct workplace hazard assessments", frequency: "Annually", documentation: "Assessment reports", deadline: "Yearly review" }
    ],
    exemptions: ["Businesses with 10 or fewer employees in low-hazard industries"],
    appliesTo: ["Manufacturing", "Construction", "Healthcare", "General Business"]
  },
  {
    title: "EPA Environmental Protection Standards",
    description: "Federal environmental regulations covering air quality, water pollution, and hazardous waste management.",
    category: "Environmental",
    jurisdiction: "Federal",
    authority: "Environmental Protection Agency (EPA)",
    effectiveDate: "1970-12-02",
    complianceDeadline: null,
    penalties: [
      { type: "Civil Penalty", amount: 50000, description: "Up to $50,000 per day per violation" },
      { type: "Criminal Penalty", amount: 50000, description: "Up to $50,000 fine and 2 years imprisonment" }
    ],
    requirements: [
      { description: "Obtain air quality permits for emissions", frequency: "Before operation", documentation: "Permit applications", deadline: "Before facility operation" },
      { description: "Monitor wastewater discharges", frequency: "Monthly", documentation: "Monitoring reports", deadline: "Monthly reporting" },
      { description: "Proper hazardous waste disposal", frequency: "Ongoing", documentation: "Waste manifests", deadline: "Immediate upon waste generation" }
    ],
    exemptions: ["Small businesses with minimal environmental impact"],
    appliesTo: ["Manufacturing", "Chemical Processing", "Waste Management", "Energy Production"]
  },
  {
    title: "Fair Labor Standards Act (FLSA)",
    description: "Federal labor law establishing minimum wage, overtime pay, and child labor standards.",
    category: "Labor & Employment",
    jurisdiction: "Federal",
    authority: "Department of Labor (DOL)",
    effectiveDate: "1938-10-24",
    complianceDeadline: null,
    penalties: [
      { type: "Minimum Wage Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Overtime Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Child Labor Violation", amount: 15000, description: "Up to $15,000 per violation" }
    ],
    requirements: [
      { description: "Pay federal minimum wage ($7.25/hour)", frequency: "Every pay period", documentation: "Payroll records", deadline: "Each pay period" },
      { description: "Pay overtime for hours over 40/week", frequency: "Weekly", documentation: "Time records", deadline: "Weekly pay period" },
      { description: "Maintain employment records", frequency: "Ongoing", documentation: "Employee files", deadline: "3 years retention" }
    ],
    exemptions: ["Executive, administrative, and professional employees"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "Americans with Disabilities Act (ADA)",
    description: "Federal civil rights law prohibiting discrimination against individuals with disabilities.",
    category: "Civil Rights",
    jurisdiction: "Federal",
    authority: "Department of Justice (DOJ)",
    effectiveDate: "1990-07-26",
    complianceDeadline: null,
    penalties: [
      { type: "First Violation", amount: 75000, description: "Up to $75,000 for first violation" },
      { type: "Subsequent Violation", amount: 150000, description: "Up to $150,000 for subsequent violations" }
    ],
    requirements: [
      { description: "Provide reasonable accommodations", frequency: "As requested", documentation: "Accommodation requests", deadline: "Prompt response required" },
      { description: "Ensure accessibility of facilities", frequency: "Ongoing", documentation: "Accessibility surveys", deadline: "Before opening to public" },
      { description: "Train staff on ADA requirements", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Religious organizations, private clubs"],
    appliesTo: ["All Industries", "General Business", "Retail", "Healthcare"]
  },

  // CALIFORNIA STATE REGULATIONS
  {
    title: "California Minimum Wage Law",
    description: "State minimum wage requirements higher than federal standards, with annual increases.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2016-01-01",
    complianceDeadline: "2024-01-01",
    penalties: [
      { type: "Minimum Wage Violation", amount: 100, description: "$100 per employee per pay period" },
      { type: "Liquidated Damages", amount: 100, description: "Additional $100 per employee per pay period" }
    ],
    requirements: [
      { description: "Pay California minimum wage ($16.00/hour)", frequency: "Every pay period", documentation: "Payroll records", deadline: "Each pay period" },
      { description: "Display minimum wage poster", frequency: "Ongoing", documentation: "Poster display", deadline: "Immediate upon posting" },
      { description: "Update payroll systems annually", frequency: "Annually", documentation: "System updates", deadline: "January 1st each year" }
    ],
    exemptions: ["Small businesses with 25 or fewer employees (until 2025)"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "California Paid Sick Leave Law",
    description: "State law requiring employers to provide paid sick leave to employees.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Labor Commissioner",
    effectiveDate: "2015-07-01",
    complianceDeadline: null,
    penalties: [
      { type: "Violation", amount: 100, description: "Up to $100 per employee per day" },
      { type: "Liquidated Damages", amount: 100, description: "Additional $100 per employee per day" }
    ],
    requirements: [
      { description: "Provide 3 days of paid sick leave", frequency: "Annually", documentation: "Leave records", deadline: "After 30 days of employment" },
      { description: "Display sick leave poster", frequency: "Ongoing", documentation: "Poster display", deadline: "Immediate upon posting" },
      { description: "Track sick leave accrual", frequency: "Ongoing", documentation: "Accrual records", deadline: "Each pay period" }
    ],
    exemptions: ["Employees covered by collective bargaining agreements"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "California Meal and Rest Break Requirements",
    description: "State law requiring meal and rest breaks for non-exempt employees.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Labor Commissioner",
    effectiveDate: "2000-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Meal Break Violation", amount: 100, description: "One hour of pay for missed meal break" },
      { type: "Rest Break Violation", amount: 100, description: "One hour of pay for missed rest break" }
    ],
    requirements: [
      { description: "Provide 30-minute meal break after 5 hours", frequency: "Daily", documentation: "Time records", deadline: "Within 5 hours of work" },
      { description: "Provide 10-minute rest break every 4 hours", frequency: "Daily", documentation: "Time records", deadline: "Every 4 hours worked" },
      { description: "Maintain accurate time records", frequency: "Ongoing", documentation: "Time cards", deadline: "Each work day" }
    ],
    exemptions: ["Exempt employees, certain emergency workers"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },

  // KERN COUNTY REGULATIONS
  {
    title: "Kern County Business License Requirements",
    description: "County requirements for business licensing and operation permits.",
    category: "Business Licensing",
    jurisdiction: "Kern County",
    authority: "Kern County Planning and Natural Resources",
    effectiveDate: "2020-01-01",
    complianceDeadline: "2024-12-31",
    penalties: [
      { type: "Operating Without License", amount: 500, description: "Up to $500 per day" },
      { type: "Late Renewal", amount: 100, description: "Additional $100 late fee" }
    ],
    requirements: [
      { description: "Obtain business license before operation", frequency: "Before opening", documentation: "License application", deadline: "Before business operation" },
      { description: "Renew business license annually", frequency: "Annually", documentation: "Renewal application", deadline: "December 31st each year" },
      { description: "Display license prominently", frequency: "Ongoing", documentation: "License display", deadline: "Immediate upon receipt" }
    ],
    exemptions: ["Home-based businesses with minimal customer contact"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "Kern County Zoning and Land Use",
    description: "County zoning regulations for business location and property use.",
    category: "Land Use",
    jurisdiction: "Kern County",
    authority: "Kern County Planning and Natural Resources",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Zoning Violation", amount: 1000, description: "Up to $1,000 per day" },
      { type: "Cease and Desist", amount: 0, description: "Business operation suspension" }
    ],
    requirements: [
      { description: "Verify zoning compliance for business type", frequency: "Before opening", documentation: "Zoning verification", deadline: "Before business operation" },
      { description: "Obtain conditional use permits if needed", frequency: "As required", documentation: "Permit applications", deadline: "Before business operation" },
      { description: "Maintain property in compliance", frequency: "Ongoing", documentation: "Property inspections", deadline: "Ongoing compliance" }
    ],
    exemptions: ["Agricultural operations, existing non-conforming uses"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },

  // BAKERSFIELD CITY REGULATIONS
  {
    title: "Bakersfield Municipal Business Tax",
    description: "City business tax requirements for businesses operating within city limits.",
    category: "Taxation",
    jurisdiction: "Bakersfield",
    authority: "Bakersfield Finance Department",
    effectiveDate: "2020-01-01",
    complianceDeadline: "2024-04-15",
    penalties: [
      { type: "Late Filing", amount: 100, description: "Additional $100 late fee" },
      { type: "Underpayment", amount: 50, description: "Additional $50 penalty" }
    ],
    requirements: [
      { description: "File business tax return annually", frequency: "Annually", documentation: "Tax returns", deadline: "April 15th each year" },
      { description: "Pay business tax based on gross receipts", frequency: "Annually", documentation: "Tax payments", deadline: "April 15th each year" },
      { description: "Maintain business records", frequency: "Ongoing", documentation: "Financial records", deadline: "4 years retention" }
    ],
    exemptions: ["Businesses with gross receipts under $50,000"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },

  // INDUSTRY-SPECIFIC REGULATIONS
  {
    title: "Food Service Safety Standards",
    description: "Health and safety regulations specific to food service businesses.",
    category: "Health & Safety",
    jurisdiction: "California",
    authority: "California Department of Public Health",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Critical Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Non-Critical Violation", amount: 500, description: "Up to $500 per violation" }
    ],
    requirements: [
      { description: "Obtain food handler permits for employees", frequency: "Before employment", documentation: "Permit records", deadline: "Before food handling" },
      { description: "Conduct food safety training", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Maintain food temperature logs", frequency: "Daily", documentation: "Temperature logs", deadline: "Each service day" }
    ],
    exemptions: ["Home-based food businesses under certain conditions"],
    appliesTo: ["Food Service", "Restaurants", "Catering", "Food Trucks"]
  },
  {
    title: "Construction Safety Standards",
    description: "Safety regulations specific to construction and building trades.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Serious Violation", amount: 25000, description: "Up to $25,000 per violation" },
      { type: "Willful Violation", amount: 150000, description: "Up to $150,000 per violation" }
    ],
    requirements: [
      { description: "Provide fall protection equipment", frequency: "Before work begins", documentation: "Equipment records", deadline: "Before elevated work" },
      { description: "Conduct safety meetings", frequency: "Weekly", documentation: "Meeting minutes", deadline: "Weekly meetings" },
      { description: "Maintain safety equipment", frequency: "Monthly", documentation: "Inspection records", deadline: "Monthly inspections" }
    ],
    exemptions: ["Homeowners doing their own work"],
    appliesTo: ["Construction", "Building Trades", "Contracting", "Renovation"]
  },
  {
    title: "Healthcare Privacy Standards (HIPAA)",
    description: "Federal privacy regulations for healthcare businesses and providers.",
    category: "Privacy & Security",
    jurisdiction: "Federal",
    authority: "Department of Health and Human Services",
    effectiveDate: "1996-08-21",
    complianceDeadline: null,
    penalties: [
      { type: "Unintentional Violation", amount: 50000, description: "Up to $50,000 per violation" },
      { type: "Willful Neglect", amount: 50000, description: "Up to $50,000 per violation" }
    ],
    requirements: [
      { description: "Implement privacy policies", frequency: "Ongoing", documentation: "Privacy policies", deadline: "Before patient contact" },
      { description: "Train staff on privacy requirements", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Maintain patient privacy", frequency: "Ongoing", documentation: "Access logs", deadline: "Ongoing compliance" }
    ],
    exemptions: ["Non-healthcare businesses"],
    appliesTo: ["Healthcare", "Medical Practices", "Dental Offices", "Mental Health"]
  }
];

// Function to seed regulations
async function seedRegulations() {
  try {
    console.log('🌱 Starting comprehensive regulation seeding...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < regulations.length; i++) {
      const regulation = regulations[i];
      
      try {
        // Check if regulation already exists
        const existingResult = await query(`
          SELECT id FROM regulations WHERE title = $1 AND jurisdiction = $2
        `, [regulation.title, regulation.jurisdiction]);
        
        if (existingResult.rows.length > 0) {
          console.log(`⏭️ Regulation already exists: ${regulation.title}`);
          successCount++;
          continue;
        }
        
        // Insert regulation
        const regulationResult = await query(`
          INSERT INTO regulations (title, description, category, jurisdiction, authority, effective_date, compliance_deadline)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `, [
          regulation.title,
          regulation.description,
          regulation.category,
          regulation.jurisdiction,
          regulation.authority,
          regulation.effectiveDate,
          regulation.complianceDeadline
        ]);
        
        const regulationId = regulationResult.rows[0].id;
        
        // Insert penalties
        for (const penalty of regulation.penalties) {
          await query(`
            INSERT INTO penalties (regulation_id, type, amount, description)
            VALUES ($1, $2, $3, $4)
          `, [regulationId, penalty.type, penalty.amount, penalty.description]);
        }
        
        // Insert requirements
        for (const requirement of regulation.requirements) {
          await query(`
            INSERT INTO requirements (regulation_id, description, frequency, documentation, deadline)
            VALUES ($1, $2, $3, $4, $5)
          `, [regulationId, requirement.description, requirement.frequency, requirement.documentation, requirement.deadline]);
        }
        
        // Insert exemptions
        for (const exemption of regulation.exemptions) {
          await query(`
            INSERT INTO regulation_exemptions (regulation_id, exemption_text)
            VALUES ($1, $2)
          `, [regulationId, exemption]);
        }
        
        // Insert applicability
        for (const appliesTo of regulation.appliesTo) {
          await query(`
            INSERT INTO regulation_applicability (regulation_id, applies_to)
            VALUES ($1, $2)
          `, [regulationId, appliesTo]);
        }
        
        console.log(`✅ Added regulation ${i + 1}/${regulations.length}: ${regulation.title}`);
        successCount++;
        
      } catch (regulationError) {
        console.error(`❌ Error adding regulation "${regulation.title}":`, regulationError.message);
        errorCount++;
        // Continue with next regulation instead of stopping
      }
    }
    
    console.log(`🎉 Seeding completed! Success: ${successCount}, Errors: ${errorCount}, Total: ${regulations.length}`);
    
    if (errorCount > 0) {
      console.log('⚠️ Some regulations failed to insert. Check the logs above for details.');
    }
    
  } catch (error) {
    console.error('❌ Critical error during seeding:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedRegulations()
    .then(() => {
      console.log('🎉 Regulation seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Regulation seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRegulations };
