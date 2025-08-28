const { query } = require('./connection');

// Second batch of comprehensive regulation data
const regulationsBatch2 = [
  // ADDITIONAL FEDERAL REGULATIONS
  {
    title: "Family and Medical Leave Act (FMLA)",
    description: "Federal law providing eligible employees with unpaid, job-protected leave for family and medical reasons.",
    category: "Labor & Employment",
    jurisdiction: "Federal",
    authority: "Department of Labor (DOL)",
    effectiveDate: "1993-08-05",
    complianceDeadline: null,
    penalties: [
      { type: "Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Liquidated Damages", amount: 1000, description: "Additional $1,000 per violation" }
    ],
    requirements: [
      { description: "Provide up to 12 weeks unpaid leave", frequency: "As requested", documentation: "Leave requests", deadline: "Within 5 business days" },
      { description: "Maintain health benefits during leave", frequency: "During leave", documentation: "Benefit records", deadline: "Throughout leave period" },
      { description: "Restore employee to same position", frequency: "Upon return", documentation: "Return documentation", deadline: "Upon leave completion" }
    ],
    exemptions: ["Businesses with fewer than 50 employees"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Manufacturing"]
  },
  {
    title: "Equal Pay Act",
    description: "Federal law requiring equal pay for equal work regardless of gender.",
    category: "Labor & Employment",
    jurisdiction: "Federal",
    authority: "Equal Employment Opportunity Commission (EEOC)",
    effectiveDate: "1963-06-10",
    complianceDeadline: null,
    penalties: [
      { type: "Back Pay", amount: 0, description: "Unpaid wages plus interest" },
      { type: "Liquidated Damages", amount: 0, description: "Equal to back pay amount" }
    ],
    requirements: [
      { description: "Pay equal wages for equal work", frequency: "Ongoing", documentation: "Payroll records", deadline: "Each pay period" },
      { description: "Maintain job descriptions", frequency: "Ongoing", documentation: "Job descriptions", deadline: "When positions change" },
      { description: "Conduct pay equity audits", frequency: "Annually", documentation: "Audit reports", deadline: "Yearly review" }
    ],
    exemptions: ["Seniority, merit, or quantity/quality of production"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "Age Discrimination in Employment Act (ADEA)",
    description: "Federal law protecting workers 40 and older from age discrimination.",
    category: "Civil Rights",
    jurisdiction: "Federal",
    authority: "Equal Employment Opportunity Commission (EEOC)",
    effectiveDate: "1967-12-15",
    complianceDeadline: null,
    penalties: [
      { type: "Back Pay", amount: 0, description: "Unpaid wages plus interest" },
      { type: "Liquidated Damages", amount: 0, description: "Equal to back pay amount" }
    ],
    requirements: [
      { description: "Avoid age-based discrimination", frequency: "Ongoing", documentation: "Employment decisions", deadline: "All employment actions" },
      { description: "Train managers on age discrimination", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Maintain non-discriminatory policies", frequency: "Ongoing", documentation: "Policy documents", deadline: "When policies change" }
    ],
    exemptions: ["Bona fide occupational qualifications"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "Title VII of Civil Rights Act",
    description: "Federal law prohibiting employment discrimination based on race, color, religion, sex, or national origin.",
    category: "Civil Rights",
    jurisdiction: "Federal",
    authority: "Equal Employment Opportunity Commission (EEOC)",
    effectiveDate: "1964-07-02",
    complianceDeadline: null,
    penalties: [
      { type: "Back Pay", amount: 0, description: "Unpaid wages plus interest" },
      { type: "Compensatory Damages", amount: 300000, description: "Up to $300,000 for punitive damages" }
    ],
    requirements: [
      { description: "Maintain non-discriminatory policies", frequency: "Ongoing", documentation: "Policy documents", deadline: "When policies change" },
      { description: "Train employees on discrimination", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Investigate discrimination complaints", frequency: "As reported", documentation: "Investigation reports", deadline: "Prompt investigation" }
    ],
    exemptions: ["Bona fide occupational qualifications"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },

  // ADDITIONAL CALIFORNIA REGULATIONS
  {
    title: "California Overtime Laws",
    description: "State overtime requirements more generous than federal standards.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2000-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Overtime Violation", amount: 100, description: "One hour of pay for missed overtime" },
      { type: "Liquidated Damages", amount: 100, description: "Additional $100 per violation" }
    ],
    requirements: [
      { description: "Pay overtime after 8 hours daily", frequency: "Daily", documentation: "Time records", deadline: "Each pay period" },
      { description: "Pay overtime after 40 hours weekly", frequency: "Weekly", documentation: "Time records", deadline: "Each pay period" },
      { description: "Pay double time after 12 hours daily", frequency: "Daily", documentation: "Time records", deadline: "Each pay period" }
    ],
    exemptions: ["Exempt employees, certain agricultural workers"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "California Sexual Harassment Training",
    description: "State law requiring sexual harassment prevention training for employees.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Fair Employment and Housing",
    effectiveDate: "2019-01-01",
    complianceDeadline: "2024-12-31",
    penalties: [
      { type: "Violation", amount: 100, description: "Up to $100 per employee" },
      { type: "Cease and Desist", amount: 0, description: "Business operation suspension" }
    ],
    requirements: [
      { description: "Train supervisors every 2 years", frequency: "Every 2 years", documentation: "Training records", deadline: "Every 24 months" },
      { description: "Train non-supervisors every 2 years", frequency: "Every 2 years", documentation: "Training records", deadline: "Every 24 months" },
      { description: "Maintain training documentation", frequency: "Ongoing", documentation: "Training records", deadline: "3 years retention" }
    ],
    exemptions: ["Businesses with fewer than 5 employees"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Consumer Privacy Act (CCPA)",
    description: "State law protecting consumer privacy and data rights.",
    category: "Privacy & Security",
    jurisdiction: "California",
    authority: "California Attorney General",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Intentional Violation", amount: 7500, description: "Up to $7,500 per violation" },
      { type: "Unintentional Violation", amount: 2500, description: "Up to $2,500 per violation" }
    ],
    requirements: [
      { description: "Provide privacy notice to consumers", frequency: "Before data collection", documentation: "Privacy notices", deadline: "Before collecting data" },
      { description: "Honor consumer data requests", frequency: "As requested", documentation: "Request logs", deadline: "45 days from request" },
      { description: "Maintain data security measures", frequency: "Ongoing", documentation: "Security policies", deadline: "Ongoing compliance" }
    ],
    exemptions: ["Businesses with fewer than 100,000 consumers"],
    appliesTo: ["Technology", "E-commerce", "Online Services", "Data Processing"]
  },

  // ADDITIONAL INDUSTRY-SPECIFIC REGULATIONS
  {
    title: "Retail Sales Tax Requirements",
    description: "State and local sales tax collection and remittance requirements.",
    category: "Taxation",
    jurisdiction: "California",
    authority: "California Department of Tax and Fee Administration",
    effectiveDate: "2020-01-01",
    complianceDeadline: "2024-04-15",
    penalties: [
      { type: "Late Filing", amount: 100, description: "Additional $100 late fee" },
      { type: "Underpayment", amount: 50, description: "Additional $50 penalty" }
    ],
    requirements: [
      { description: "Collect sales tax on taxable items", frequency: "Every sale", documentation: "Sales records", deadline: "At time of sale" },
      { description: "File sales tax returns quarterly", frequency: "Quarterly", documentation: "Tax returns", deadline: "Monthly/quarterly filing" },
      { description: "Remit collected taxes timely", frequency: "Monthly/quarterly", documentation: "Payment records", deadline: "Filing deadlines" }
    ],
    exemptions: ["Food items, prescription drugs, certain services"],
    appliesTo: ["Retail", "E-commerce", "Food Service", "General Business"]
  },
  {
    title: "Manufacturing Safety Standards",
    description: "Industry-specific safety regulations for manufacturing operations.",
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
      { description: "Implement machine guarding", frequency: "Before operation", documentation: "Safety inspections", deadline: "Before machine use" },
      { description: "Provide hearing protection", frequency: "As needed", documentation: "Protection records", deadline: "When noise exceeds limits" },
      { description: "Conduct safety audits", frequency: "Monthly", documentation: "Audit reports", deadline: "Monthly inspections" }
    ],
    exemptions: ["Small workshops with minimal machinery"],
    appliesTo: ["Manufacturing", "Industrial", "Automotive", "Electronics"]
  },
  {
    title: "Transportation Safety Regulations",
    description: "Safety standards for businesses involved in transportation and logistics.",
    category: "Transportation",
    jurisdiction: "Federal",
    authority: "Department of Transportation (DOT)",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Safety Violation", amount: 10000, description: "Up to $10,000 per violation" },
      { type: "Out-of-Service Order", amount: 0, description: "Vehicle operation suspension" }
    ],
    requirements: [
      { description: "Maintain driver qualification files", frequency: "Ongoing", documentation: "Driver files", deadline: "Before employment" },
      { description: "Conduct vehicle inspections", frequency: "Daily", documentation: "Inspection reports", deadline: "Before each trip" },
      { description: "Maintain hours of service logs", frequency: "Daily", documentation: "Log books", deadline: "Each work day" }
    ],
    exemptions: ["Local delivery within 100 air miles"],
    appliesTo: ["Transportation", "Logistics", "Delivery", "Trucking"]
  },
  {
    title: "Financial Services Compliance",
    description: "Regulations for businesses providing financial services or handling money.",
    category: "Financial Services",
    jurisdiction: "Federal",
    authority: "Financial Crimes Enforcement Network (FinCEN)",
    effectiveDate: "2020-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Violation", amount: 250000, description: "Up to $250,000 per violation" },
      { type: "Criminal Penalty", amount: 500000, description: "Up to $500,000 fine and 10 years imprisonment" }
    ],
    requirements: [
      { description: "Implement anti-money laundering program", frequency: "Ongoing", documentation: "AML policies", deadline: "Before operation" },
      { description: "File suspicious activity reports", frequency: "As required", documentation: "SAR filings", deadline: "30 days from detection" },
      { description: "Maintain customer due diligence", frequency: "Ongoing", documentation: "Customer files", deadline: "Before account opening" }
    ],
    exemptions: ["Businesses not handling customer funds"],
    appliesTo: ["Financial Services", "Banking", "Investment", "Money Services"]
  },
  {
    title: "Real Estate Licensing Requirements",
    description: "State requirements for real estate professionals and businesses.",
    category: "Professional Licensing",
    jurisdiction: "California",
    authority: "California Department of Real Estate",
    effectiveDate: "2020-01-01",
    complianceDeadline: "2024-12-31",
    penalties: [
      { type: "Operating Without License", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "License Suspension", amount: 0, description: "License suspension or revocation" }
    ],
    requirements: [
      { description: "Obtain real estate license", frequency: "Before practice", documentation: "License certificate", deadline: "Before real estate activities" },
      { description: "Complete continuing education", frequency: "Every 4 years", documentation: "CE certificates", deadline: "Every 4 years" },
      { description: "Maintain trust account records", frequency: "Ongoing", documentation: "Trust account records", deadline: "3 years retention" }
    ],
    exemptions: ["Property owners selling their own property"],
    appliesTo: ["Real Estate", "Property Management", "Brokerage", "Development"]
  }
];

// Function to seed regulations batch 2
async function seedRegulationsBatch2() {
  try {
    console.log('🌱 Starting second batch of regulation seeding...');
    
    for (const regulation of regulationsBatch2) {
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
      
      console.log(`✅ Added regulation: ${regulation.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${regulationsBatch2.length} additional regulations!`);
    
  } catch (error) {
    console.error('❌ Error seeding regulations batch 2:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedRegulationsBatch2()
    .then(() => {
      console.log('🎉 Regulation batch 2 seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Regulation batch 2 seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRegulationsBatch2 };
