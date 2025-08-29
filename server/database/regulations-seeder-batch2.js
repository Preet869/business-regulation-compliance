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
      { description: "Pay overtime after 8 hours per day", frequency: "Daily", documentation: "Time records", deadline: "Each pay period" },
      { description: "Pay overtime after 40 hours per week", frequency: "Weekly", documentation: "Weekly time sheets", deadline: "Weekly pay period" },
      { description: "Pay double time after 12 hours per day", frequency: "Daily", documentation: "Extended time records", deadline: "Each pay period" }
    ],
    exemptions: ["Exempt employees, certain industries"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "California Sexual Harassment Training",
    description: "Mandatory sexual harassment prevention training for all employees.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Fair Employment and Housing",
    effectiveDate: "2019-01-01",
    complianceDeadline: "Every 2 years",
    penalties: [
      { type: "Training Violation", amount: 100, description: "$100 per employee per violation" },
      { type: "Repeat Violation", amount: 200, description: "$200 per employee per violation" }
    ],
    requirements: [
      { description: "Provide 2-hour training to supervisors", frequency: "Every 2 years", documentation: "Training certificates", deadline: "Biennial renewal" },
      { description: "Provide 1-hour training to employees", frequency: "Every 2 years", documentation: "Training records", deadline: "Biennial renewal" },
      { description: "Maintain training documentation", frequency: "Ongoing", documentation: "Training logs", deadline: "Immediate upon completion" }
    ],
    exemptions: ["Temporary employees under 6 months"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Consumer Privacy Act (CCPA)",
    description: "State law protecting consumer privacy rights and data protection.",
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
      { description: "Provide privacy notices", frequency: "At collection", documentation: "Privacy policies", deadline: "Before data collection" },
      { description: "Honor consumer rights requests", frequency: "As requested", documentation: "Request logs", deadline: "45 days response" },
      { description: "Implement data security measures", frequency: "Ongoing", documentation: "Security protocols", deadline: "Continuous compliance" }
    ],
    exemptions: ["Small businesses under $25M revenue"],
    appliesTo: ["Technology", "E-commerce", "Healthcare", "Financial Services"]
  },
  {
    title: "Retail Sales Tax Requirements",
    description: "State and local sales tax collection and remittance requirements.",
    category: "Tax & Finance",
    jurisdiction: "California",
    authority: "California Department of Tax and Fee Administration",
    effectiveDate: "1933-08-27",
    complianceDeadline: "Monthly/Quarterly",
    penalties: [
      { type: "Late Filing", amount: 100, description: "$100 or 10% of tax due" },
      { type: "Late Payment", amount: 50, description: "$50 plus 10% of tax due" }
    ],
    requirements: [
      { description: "Collect sales tax on taxable items", frequency: "Every sale", documentation: "Sales receipts", deadline: "At time of sale" },
      { description: "File sales tax returns", frequency: "Monthly/Quarterly", documentation: "Tax returns", deadline: "Due dates vary" },
      { description: "Remit collected taxes", frequency: "Monthly/Quarterly", documentation: "Payment records", deadline: "Due dates vary" }
    ],
    exemptions: ["Food, prescription drugs, certain services"],
    appliesTo: ["Retail", "E-commerce", "Food Service", "General Business"]
  },
  {
    title: "Manufacturing Safety Standards",
    description: "Comprehensive safety requirements for manufacturing operations.",
    category: "Workplace Safety",
    jurisdiction: "Federal",
    authority: "Occupational Safety and Health Administration (OSHA)",
    effectiveDate: "1970-12-29",
    complianceDeadline: null,
    penalties: [
      { type: "Serious Violation", amount: 15000, description: "Up to $15,000 per violation" },
      { type: "Willful Violation", amount: 150000, description: "Up to $150,000 per violation" }
    ],
    requirements: [
      { description: "Machine guarding on all equipment", frequency: "Ongoing", documentation: "Safety inspections", deadline: "Before operation" },
      { description: "Lockout/tagout procedures", frequency: "Before maintenance", documentation: "LOTO procedures", deadline: "Before service" },
      { description: "Personal protective equipment", frequency: "Daily", documentation: "PPE training", deadline: "Before work begins" }
    ],
    exemptions: ["Office-only operations"],
    appliesTo: ["Manufacturing", "Industrial", "Assembly", "Production"]
  },
  {
    title: "Transportation Safety Regulations",
    description: "Federal transportation safety standards for commercial vehicles.",
    category: "Transportation",
    jurisdiction: "Federal",
    authority: "Federal Motor Carrier Safety Administration",
    effectiveDate: "1986-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Safety Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Driver qualification standards", frequency: "Before hiring", documentation: "Driver files", deadline: "Before driving" },
      { description: "Vehicle maintenance records", frequency: "Ongoing", documentation: "Maintenance logs", deadline: "Continuous compliance" },
      { description: "Hours of service compliance", frequency: "Daily", documentation: "Driver logs", deadline: "Daily recording" }
    ],
    exemptions: ["Local delivery under 100 miles"],
    appliesTo: ["Transportation", "Logistics", "Delivery", "Trucking"]
  },
  {
    title: "Financial Services Compliance",
    description: "Federal financial services regulations and compliance requirements.",
    category: "Financial Services",
    jurisdiction: "Federal",
    authority: "Consumer Financial Protection Bureau",
    effectiveDate: "2011-07-21",
    complianceDeadline: null,
    penalties: [
      { type: "Violation", amount: 1000, description: "Up to $1,000 per day per violation" },
      { type: "Reckless Violation", amount: 5000, description: "Up to $5,000 per day per violation" }
    ],
    requirements: [
      { description: "Truth in Lending disclosures", frequency: "Every loan", documentation: "Loan documents", deadline: "Before loan closing" },
      { description: "Fair lending practices", frequency: "Ongoing", documentation: "Lending policies", deadline: "Continuous compliance" },
      { description: "Consumer complaint handling", frequency: "As received", documentation: "Complaint logs", deadline: "30-day response" }
    ],
    exemptions: ["Small lenders under certain thresholds"],
    appliesTo: ["Banking", "Lending", "Financial Services", "Credit Unions"]
  },
  {
    title: "Real Estate Licensing Requirements",
    description: "State real estate licensing and continuing education requirements.",
    category: "Professional Licensing",
    jurisdiction: "California",
    authority: "California Department of Real Estate",
    effectiveDate: "1917-01-01",
    complianceDeadline: "Every 4 years",
    penalties: [
      { type: "Unlicensed Activity", amount: 20000, description: "Up to $20,000 per violation" },
      { type: "License Violation", amount: 1000, description: "Up to $1,000 per violation" }
    ],
    requirements: [
      { description: "Obtain real estate license", frequency: "Before practice", documentation: "License certificate", deadline: "Before transactions" },
      { description: "Complete continuing education", frequency: "Every 4 years", documentation: "CE certificates", deadline: "License renewal" },
      { description: "Maintain trust accounts", frequency: "Ongoing", documentation: "Account records", deadline: "Continuous compliance" }
    ],
    exemptions: ["Property owners selling own property"],
    appliesTo: ["Real Estate", "Property Management", "Brokerage", "Development"]
  },
  {
    title: "Food Safety Modernization Act (FSMA)",
    description: "Federal food safety regulations for food production and handling.",
    category: "Food Safety",
    jurisdiction: "Federal",
    authority: "Food and Drug Administration (FDA)",
    effectiveDate: "2011-01-04",
    complianceDeadline: "Varies by business size",
    penalties: [
      { type: "Food Safety Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 10000, description: "Up to $10,000 per violation" }
    ],
    requirements: [
      { description: "Hazard analysis and controls", frequency: "Annually", documentation: "HACCP plans", deadline: "Yearly review" },
      { description: "Employee food safety training", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Sanitation procedures", frequency: "Daily", documentation: "Cleaning logs", deadline: "Daily compliance" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["Food Production", "Restaurants", "Grocery", "Food Service"]
  },
  {
    title: "California Energy Efficiency Standards",
    description: "State energy efficiency requirements for buildings and equipment.",
    category: "Environmental",
    jurisdiction: "California",
    authority: "California Energy Commission",
    effectiveDate: "1978-01-01",
    complianceDeadline: "Before construction/renovation",
    penalties: [
      { type: "Code Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Repeat Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Meet energy code standards", frequency: "Before occupancy", documentation: "Energy calculations", deadline: "Before final inspection" },
      { description: "Install energy-efficient equipment", frequency: "During construction", documentation: "Equipment specifications", deadline: "Before completion" },
      { description: "Energy performance testing", frequency: "Before occupancy", documentation: "Test reports", deadline: "Before final approval" }
    ],
    exemptions: ["Historical buildings, certain renovations"],
    appliesTo: ["Construction", "Real Estate", "Property Management", "Development"]
  },
  {
    title: "Workers' Compensation Requirements",
    description: "State workers' compensation insurance and reporting requirements.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Division of Workers' Compensation",
    effectiveDate: "1913-07-27",
    complianceDeadline: "Immediate upon hiring",
    penalties: [
      { type: "No Insurance", amount: 10000, description: "Up to $10,000 per employee" },
      { type: "Late Reporting", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Obtain workers' compensation insurance", frequency: "Before hiring", documentation: "Insurance certificate", deadline: "Before first employee" },
      { description: "Report workplace injuries", frequency: "Within 5 days", documentation: "Injury reports", deadline: "5 days after injury" },
      { description: "Post injury reporting procedures", frequency: "Ongoing", documentation: "Posting verification", deadline: "Visible to all employees" }
    ],
    exemptions: ["Sole proprietors, certain partnerships"],
    appliesTo: ["All Industries", "General Business", "Construction", "Manufacturing"]
  },
  {
    title: "California Paid Family Leave",
    description: "State paid family leave benefits for eligible employees.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Employment Development Department",
    effectiveDate: "2004-07-01",
    complianceDeadline: null,
    penalties: [
      { type: "Benefit Denial", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Retaliation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Inform employees of benefits", frequency: "Upon hiring", documentation: "Benefit notices", deadline: "First day of work" },
      { description: "Process leave requests", frequency: "As requested", documentation: "Request forms", deadline: "Within 5 business days" },
      { description: "Maintain job protection", frequency: "During leave", documentation: "Leave records", deadline: "Throughout leave period" }
    ],
    exemptions: ["Businesses with fewer than 20 employees"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Meal Break Violations",
    description: "State requirements for meal and rest breaks during work shifts.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2000-01-01",
    complianceDeadline: null,
    penalties: [
      { type: "Meal Break Violation", amount: 100, description: "One hour of pay per violation" },
      { type: "Rest Break Violation", amount: 100, description: "One hour of pay per violation" }
    ],
    requirements: [
      { description: "Provide 30-minute meal break after 5 hours", frequency: "Daily", documentation: "Time records", deadline: "Before 6th hour" },
      { description: "Provide 10-minute rest breaks every 4 hours", frequency: "Daily", documentation: "Break records", deadline: "Every 4 hours" },
      { description: "Maintain accurate time records", frequency: "Daily", documentation: "Time sheets", deadline: "Daily recording" }
    ],
    exemptions: ["Certain emergency services, healthcare"],
    appliesTo: ["All Industries", "General Business", "Retail", "Food Service"]
  },
  {
    title: "California Sick Leave Accrual",
    description: "State requirements for paid sick leave accrual and usage.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2015-07-01",
    complianceDeadline: null,
    penalties: [
      { type: "Sick Leave Violation", amount: 100, description: "Up to $100 per employee per violation" },
      { type: "Retaliation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Accrue 1 hour per 30 hours worked", frequency: "Ongoing", documentation: "Accrual records", deadline: "Continuous tracking" },
      { description: "Allow use after 90 days employment", frequency: "After 90 days", documentation: "Usage records", deadline: "Upon request" },
      { description: "Carry over unused time", frequency: "Yearly", documentation: "Carryover records", deadline: "End of year" }
    ],
    exemptions: ["Union employees with CBA provisions"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Wage Statement Requirements",
    description: "State requirements for detailed wage statements and pay records.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2012-01-01",
    complianceDeadline: "Every pay period",
    penalties: [
      { type: "Incomplete Statement", amount: 100, description: "Up to $100 per employee per violation" },
      { type: "Intentional Violation", amount: 200, description: "Up to $200 per employee per violation" }
    ],
    requirements: [
      { description: "Include all required information", frequency: "Every pay period", documentation: "Wage statements", deadline: "Each pay period" },
      { description: "Maintain pay records for 3 years", frequency: "Ongoing", documentation: "Payroll records", deadline: "3-year retention" },
      { description: "Provide itemized deductions", frequency: "Every pay period", documentation: "Deduction details", deadline: "Each pay period" }
    ],
    exemptions: ["Exempt employees under certain conditions"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Background Check Requirements",
    description: "State requirements for employee background checks and screening.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Fair Employment and Housing",
    effectiveDate: "2018-01-01",
    complianceDeadline: "Before hiring decision",
    penalties: [
      { type: "Background Check Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Discrimination", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Obtain written consent", frequency: "Before check", documentation: "Consent forms", deadline: "Before background check" },
      { description: "Provide copy of report", frequency: "Before adverse action", documentation: "Report copies", deadline: "Before decision" },
      { description: "Wait 5 days after adverse action", frequency: "Before final decision", documentation: "Timing records", deadline: "5-day waiting period" }
    ],
    exemptions: ["Certain government positions"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Independent Contractor Classification",
    description: "State requirements for proper classification of workers as employees vs. independent contractors.",
    category: "Labor & Employment",
    jurisdiction: "California",
    authority: "California Department of Industrial Relations",
    effectiveDate: "2020-01-01",
    complianceDeadline: "Before engagement",
    penalties: [
      { type: "Misclassification", amount: 5000, description: "Up to $5,000 per violation" },
      { type: "Pattern Violation", amount: 15000, description: "Up to $15,000 per violation" }
    ],
    requirements: [
      { description: "Apply ABC test for classification", frequency: "Before engagement", documentation: "Classification analysis", deadline: "Before work begins" },
      { description: "Maintain classification records", frequency: "Ongoing", documentation: "Classification files", deadline: "Continuous compliance" },
      { description: "Review classifications annually", frequency: "Annually", documentation: "Review records", deadline: "Yearly review" }
    ],
    exemptions: ["Certain professional services, direct sales"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Technology"]
  },
  {
    title: "California Heat Illness Prevention",
    description: "State requirements for preventing heat illness in outdoor workers.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "2006-05-01",
    complianceDeadline: "When temperature exceeds 80°F",
    penalties: [
      { type: "Heat Illness Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Provide shade when temperature exceeds 80°F", frequency: "When needed", documentation: "Shade provision", deadline: "Immediate when needed" },
      { description: "Provide cool drinking water", frequency: "Ongoing", documentation: "Water provision", deadline: "Continuous availability" },
      { description: "Train employees on heat illness", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Indoor workers, certain emergency services"],
    appliesTo: ["Agriculture", "Construction", "Landscaping", "Outdoor Services"]
  },
  {
    title: "California Ergonomics Standards",
    description: "State requirements for ergonomic workplace design and injury prevention.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1997-01-01",
    complianceDeadline: "When ergonomic hazards identified",
    penalties: [
      { type: "Ergonomic Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Identify ergonomic hazards", frequency: "Ongoing", documentation: "Hazard assessments", deadline: "When hazards identified" },
      { description: "Implement control measures", frequency: "As needed", documentation: "Control records", deadline: "Prompt implementation" },
      { description: "Train employees on ergonomics", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["Office Work", "Manufacturing", "Healthcare", "Technology"]
  },
  {
    title: "California Chemical Safety Standards",
    description: "State requirements for chemical safety and hazard communication.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1988-01-01",
    complianceDeadline: "Before chemical use",
    penalties: [
      { type: "Chemical Safety Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Maintain safety data sheets", frequency: "Ongoing", documentation: "SDS files", deadline: "Before chemical use" },
      { description: "Provide chemical training", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Label all chemical containers", frequency: "Ongoing", documentation: "Labeling verification", deadline: "Continuous compliance" }
    ],
    exemptions: ["Consumer products in normal use"],
    appliesTo: ["Manufacturing", "Laboratories", "Healthcare", "Chemical Processing"]
  },
  {
    title: "California Workplace Violence Prevention",
    description: "State requirements for preventing workplace violence and maintaining safe work environments.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "2017-01-01",
    complianceDeadline: "Immediate upon implementation",
    penalties: [
      { type: "Violence Prevention Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Develop violence prevention plan", frequency: "Once", documentation: "Prevention plan", deadline: "Before implementation" },
      { description: "Train employees on violence prevention", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Maintain incident reporting system", frequency: "Ongoing", documentation: "Incident reports", deadline: "Immediate reporting" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Retail"]
  },
  {
    title: "California Emergency Action Plans",
    description: "State requirements for emergency action plans and evacuation procedures.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before occupancy",
    penalties: [
      { type: "Emergency Plan Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Develop emergency action plan", frequency: "Once", documentation: "Emergency plan", deadline: "Before occupancy" },
      { description: "Train employees on emergency procedures", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Conduct emergency drills", frequency: "Annually", documentation: "Drill records", deadline: "Yearly drills" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Manufacturing"]
  },
  {
    title: "California First Aid Requirements",
    description: "State requirements for first aid supplies and trained personnel in workplaces.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Immediate upon implementation",
    penalties: [
      { type: "First Aid Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Provide first aid supplies", frequency: "Ongoing", documentation: "Supply inventory", deadline: "Continuous availability" },
      { description: "Train employees in first aid", frequency: "Every 2 years", documentation: "Training certificates", deadline: "Biennial renewal" },
      { description: "Maintain first aid kits", frequency: "Monthly", documentation: "Kit inspections", deadline: "Monthly checks" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["All Industries", "General Business", "Healthcare", "Manufacturing"]
  },
  {
    title: "California Personal Protective Equipment",
    description: "State requirements for providing and maintaining personal protective equipment.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before hazardous work",
    penalties: [
      { type: "PPE Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Assess workplace hazards", frequency: "Annually", documentation: "Hazard assessments", deadline: "Yearly review" },
      { description: "Provide appropriate PPE", frequency: "As needed", documentation: "PPE provision", deadline: "Before hazardous work" },
      { description: "Train employees on PPE use", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Office-only operations"],
    appliesTo: ["Manufacturing", "Construction", "Healthcare", "Laboratories"]
  },
  {
    title: "California Machine Guarding Standards",
    description: "State requirements for machine guarding and safety equipment.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before machine operation",
    penalties: [
      { type: "Machine Guarding Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Install appropriate guards", frequency: "Before operation", documentation: "Guard installation", deadline: "Before machine use" },
      { description: "Maintain guard integrity", frequency: "Daily", documentation: "Guard inspections", deadline: "Daily checks" },
      { description: "Train employees on guard safety", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Office equipment, certain hand tools"],
    appliesTo: ["Manufacturing", "Industrial", "Assembly", "Production"]
  },
  {
    title: "California Lockout/Tagout Procedures",
    description: "State requirements for energy isolation during machine maintenance.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before maintenance",
    penalties: [
      { type: "LOTO Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Develop LOTO procedures", frequency: "Once", documentation: "LOTO procedures", deadline: "Before maintenance" },
      { description: "Train employees on LOTO", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Use LOTO devices during maintenance", frequency: "Every maintenance", documentation: "LOTO usage", deadline: "Before service begins" }
    ],
    exemptions: ["Cord and plug equipment, certain minor servicing"],
    appliesTo: ["Manufacturing", "Industrial", "Maintenance", "Production"]
  },
  {
    title: "California Confined Space Entry",
    description: "State requirements for safe entry into confined spaces.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before confined space entry",
    penalties: [
      { type: "Confined Space Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Identify confined spaces", frequency: "Once", documentation: "Space inventory", deadline: "Before any entry" },
      { description: "Develop entry procedures", frequency: "Once", documentation: "Entry procedures", deadline: "Before entry" },
      { description: "Train employees on confined space entry", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" }
    ],
    exemptions: ["Very small businesses under certain criteria"],
    appliesTo: ["Manufacturing", "Industrial", "Maintenance", "Construction"]
  },
  {
    title: "California Fall Protection Standards",
    description: "State requirements for fall protection in construction and general industry.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before work at heights",
    penalties: [
      { type: "Fall Protection Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Provide fall protection equipment", frequency: "As needed", documentation: "Equipment provision", deadline: "Before work at heights" },
      { description: "Train employees on fall protection", frequency: "Annually", documentation: "Training records", deadline: "Yearly training" },
      { description: "Inspect fall protection equipment", frequency: "Before use", documentation: "Inspection records", deadline: "Before each use" }
    ],
    exemptions: ["Office work, certain low-risk activities"],
    appliesTo: ["Construction", "Maintenance", "Industrial", "Roofing"]
  },
  {
    title: "California Electrical Safety Standards",
    description: "State requirements for electrical safety in the workplace.",
    category: "Workplace Safety",
    jurisdiction: "California",
    authority: "California Division of Occupational Safety and Health",
    effectiveDate: "1980-01-01",
    complianceDeadline: "Before electrical work",
    penalties: [
      { type: "Electrical Safety Violation", amount: 1000, description: "Up to $1,000 per violation" },
      { type: "Serious Violation", amount: 5000, description: "Up to $5,000 per violation" }
    ],
    requirements: [
      { description: "Qualify electrical workers", frequency: "Before electrical work", documentation: "Qualification records", deadline: "Before work begins" },
      { description: "Use appropriate PPE for electrical work", frequency: "Every electrical task", documentation: "PPE usage", deadline: "Before electrical work" },
      { description: "Follow electrical safety procedures", frequency: "Every electrical task", documentation: "Safety procedures", deadline: "Before electrical work" }
    ],
    exemptions: ["Office equipment, certain low-voltage work"],
    appliesTo: ["Electrical", "Construction", "Industrial", "Maintenance"]
  }
];

// Function to seed regulations batch 2
async function seedRegulationsBatch2() {
  try {
    console.log('🌱 Starting second batch of regulation seeding...');
    
    for (const regulation of regulationsBatch2) {
      // Handle compliance deadline - convert text to date or null
      let complianceDeadline = null;
      if (regulation.complianceDeadline && !isNaN(Date.parse(regulation.complianceDeadline))) {
        complianceDeadline = regulation.complianceDeadline;
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
        complianceDeadline
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
