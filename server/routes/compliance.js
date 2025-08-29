const express = require('express');
const Joi = require('joi');
const { query } = require('../database/connection');
const { getCache, setCache } = require('../database/redis');

const router = express.Router();

// Validation schema for business data
const businessValidationSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  industry: Joi.string().required().min(1).max(100),
  state: Joi.string().required().length(2),
  county: Joi.string().required().min(1).max(100),
  city: Joi.string().required().min(1).max(100),
  zipCode: Joi.string().required().min(5).max(10),
  size: Joi.string().required().valid('Small', 'Medium', 'Large'),
  employeeCount: Joi.number().integer().min(1).max(10000).required(),
  annualRevenue: Joi.number().positive().max(1000000000).required(),
  businessType: Joi.string().required().min(1).max(100)
});

// Main compliance check endpoint
router.post('/check', async (req, res) => {
  try {
    // Validate input
    const { error, value } = businessValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const businessData = value;
    
    // Check cache first
    const cacheKey = `compliance:${JSON.stringify(businessData)}`;
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Determine applicable regulations
    const applicableRegulations = await determineApplicableRegulations(businessData);
    console.log('Found applicable regulations:', applicableRegulations.length);
    console.log('Regulation categories:', applicableRegulations.map(r => r.category));
    
    // Calculate compliance score
    const complianceScore = calculateComplianceScore(applicableRegulations, businessData);
    console.log('Calculated compliance score:', complianceScore);
    
    // Determine risk level
    const riskLevel = determineRiskLevel(complianceScore, applicableRegulations);
    console.log('Determined risk level:', riskLevel);
    
    // Get next deadlines
    const nextDeadlines = getNextDeadlines(applicableRegulations);
    console.log('Generated next deadlines:', nextDeadlines);
    
    // Generate recommendations
    const recommendations = generateRecommendations(applicableRegulations, businessData);
    console.log('Generated recommendations:', recommendations);

    // Create compliance result
    const complianceResult = {
      business: {
        id: null, // Will be assigned if saved
        name: businessData.name,
        industry: businessData.industry,
        location: {
          state: businessData.state,
          county: businessData.county,
          city: businessData.city,
          zipCode: businessData.zipCode
        },
        size: businessData.size,
        employeeCount: businessData.employeeCount,
        annualRevenue: businessData.annualRevenue,
        businessType: businessData.businessType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      applicableRegulations,
      complianceScore,
      nextDeadlines,
      riskLevel,
      recommendations
    };

    // Cache the result for 1 hour
    await setCache(cacheKey, complianceResult, 3600);

    res.json(complianceResult);

  } catch (error) {
    console.error('Error checking compliance:', error);
    res.status(500).json({ error: 'Failed to check compliance' });
  }
});

// Get compliance history for a business
router.get('/history/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Get basic compliance results
    const complianceResult = await query(`
      SELECT cr.*, b.name as business_name
      FROM compliance_results cr
      JOIN businesses b ON cr.business_id = b.id
      WHERE cr.business_id = $1 
      ORDER BY cr.created_at DESC
      LIMIT 1
    `, [businessId]);
    
    if (complianceResult.rows.length === 0) {
      return res.json([]);
    }
    
    // Get detailed regulation information for the most recent compliance check
    const regulationDetails = await query(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.category,
        r.jurisdiction,
        r.authority,
        r.effective_date,
        r.compliance_deadline,
        br.compliance_status,
        br.created_at as applied_date,
        array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
        array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
        array_agg(DISTINCT e.exemption_text) as exemptions,
        array_agg(DISTINCT a.applies_to) as applies_to
      FROM business_regulations br
      JOIN regulations r ON br.regulation_id = r.id
      LEFT JOIN penalties p ON r.id = p.regulation_id
      LEFT JOIN requirements req ON r.id = req.regulation_id
      LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
      LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
      WHERE br.business_id = $1 AND br.is_applicable = true
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline, br.compliance_status, br.created_at
      ORDER BY r.category, r.title
    `, [businessId]);
    
    // Combine compliance result with regulation details
    const detailedHistory = {
      compliance: complianceResult.rows[0],
      regulations: regulationDetails.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        jurisdiction: row.jurisdiction,
        authority: row.authority,
        effectiveDate: row.effective_date,
        complianceDeadline: row.compliance_deadline,
        complianceStatus: row.compliance_status,
        appliedDate: row.applied_date,
        penalties: row.penalties.filter(p => p !== null).map(p => {
          const [type, rest] = p.split(':');
          const [amount, description] = rest.split(' - ');
          return {
            type: type.trim(),
            amount: parseFloat(amount.replace('$', '')),
            description: description.trim()
          };
        }),
        requirements: row.requirements.filter(r => r !== null).map(r => {
          const [description, frequency] = r.split(' (');
          return {
            description: description.trim(),
            frequency: frequency ? frequency.replace(')', '') : 'As needed',
            documentation: 'Required documentation varies by regulation',
            deadline: 'Varies by requirement'
          };
        }),
        exemptions: row.exemptions.filter(e => e !== null),
        appliesTo: row.applies_to.filter(a => a !== null)
      }))
    };
    
    res.json(detailedHistory);
  } catch (error) {
    console.error('Error fetching compliance history:', error);
    res.status(500).json({ error: 'Failed to fetch compliance history' });
  }
});

// Save compliance result
router.post('/save', async (req, res) => {
  try {
    const { 
      businessId, 
      complianceScore, 
      riskLevel, 
      applicableRegulations, 
      nextDeadlines, 
      recommendations, 
      timestamp 
    } = req.body;

    console.log('Saving compliance result:', {
      businessId,
      complianceScore,
      riskLevel,
      applicableRegulationsCount: applicableRegulations?.length || 0,
      timestamp
    });

    // Validate required fields
    if (!businessId || complianceScore === undefined || !riskLevel) {
      console.log('Missing required fields:', { businessId, complianceScore, riskLevel });
      return res.status(400).json({ error: 'Missing required fields: businessId, complianceScore, riskLevel' });
    }

    // Verify business exists
    const businessCheck = await query('SELECT id FROM businesses WHERE id = $1', [businessId]);
    if (businessCheck.rows.length === 0) {
      console.log('Business not found:', businessId);
      return res.status(404).json({ error: 'Business not found' });
    }

    // Insert compliance result
    const result = await query(`
      INSERT INTO compliance_results (business_id, compliance_score, risk_level, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [businessId, complianceScore, riskLevel, timestamp || new Date().toISOString()]);

    console.log('Compliance result saved:', result.rows[0]);

    // Save detailed regulation information to business_regulations table
    if (applicableRegulations && applicableRegulations.length > 0) {
      console.log('Saving', applicableRegulations.length, 'regulations to business_regulations');
      
      for (const regulation of applicableRegulations) {
        try {
          await query(`
            INSERT INTO business_regulations (business_id, regulation_id, is_applicable, compliance_status, created_at)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (business_id, regulation_id) 
            DO UPDATE SET 
              is_applicable = EXCLUDED.is_applicable,
              compliance_status = EXCLUDED.compliance_status,
              updated_at = CURRENT_TIMESTAMP
          `, [
            businessId, 
            regulation.id, 
            true, 
            'pending', 
            timestamp || new Date().toISOString()
          ]);
          console.log('Saved regulation:', regulation.id, regulation.title);
        } catch (regError) {
          console.error('Error saving regulation:', regulation.id, regError.message);
        }
      }
    }

    // Log the saved compliance result
    console.log('Saved compliance result:', result.rows[0]);

    res.status(201).json({
      message: 'Compliance result saved successfully',
      complianceResult: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving compliance result:', error);
    res.status(500).json({ error: 'Failed to save compliance result' });
  }
});

// Helper function to determine applicable regulations
async function determineApplicableRegulations(businessData) {
  try {
    // Base query for regulations
    let queryText = `
      SELECT DISTINCT r.*, 
             array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
             array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
             array_agg(DISTINCT e.exemption_text) as exemptions,
             array_agg(DISTINCT a.applies_to) as applies_to
      FROM regulations r
      LEFT JOIN penalties p ON r.id = p.regulation_id
      LEFT JOIN requirements req ON r.id = req.regulation_id
      LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
      LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 0;

    // Add jurisdiction filters
    queryParams.push(businessData.state);
    queryText += ` AND (r.jurisdiction = $${++paramCount} OR r.jurisdiction = 'Federal')`;
    
    // Add county-specific regulations
    queryParams.push(businessData.county);
    queryText += ` AND (r.jurisdiction = $${++paramCount} OR r.jurisdiction = 'California' OR r.jurisdiction = 'Federal')`;
    
    // Add city-specific regulations
    queryParams.push(businessData.city);
    queryText += ` AND (r.jurisdiction = $${++paramCount} OR r.jurisdiction = 'Kern County' OR r.jurisdiction = 'California' OR r.jurisdiction = 'Federal')`;

    // Add industry-specific regulations
    if (businessData.industry) {
      // Map industry to actual database categories that exist
      const industryCategoryMap = {
        'Agriculture': ['Environmental', 'Workplace Safety', 'Business Licensing'],
        'Automotive': ['Transportation', 'Environmental', 'Workplace Safety'],
        'Construction': ['Workplace Safety', 'Environmental', 'Business Licensing', 'Land Use'],
        'Food Service': ['Health & Safety', 'Business Licensing', 'Local Ordinances'],
        'Healthcare': ['Health & Safety', 'Privacy & Security', 'Professional Licensing', 'Workplace Safety', 'Labor & Employment', 'Civil Rights'],
        'Manufacturing': ['Workplace Safety', 'Environmental', 'Business Licensing'],
        'Retail': ['Business Licensing', 'Local Ordinances', 'Taxation'],
        'Technology': ['Business Licensing', 'Privacy & Security', 'Labor & Employment', 'Workplace Safety'],
        'Transportation': ['Transportation', 'Environmental', 'Workplace Safety'],
        'Other': ['Business Licensing', 'Local Ordinances']
      };
      
      const relevantCategories = industryCategoryMap[businessData.industry] || ['Business Licensing'];
      console.log('Industry:', businessData.industry, 'Maps to categories:', relevantCategories);
      
      // Add each relevant category as a separate parameter
      relevantCategories.forEach(category => {
        queryParams.push(category);
        paramCount++;
      });
      
      // Build the category filter with proper parameter placeholders
      const categoryPlaceholders = relevantCategories.map((_, index) => `$${paramCount - relevantCategories.length + index + 1}`).join(', ');
      queryText += ` AND (r.category IN (${categoryPlaceholders}) OR r.category = 'Business Licensing')`;
      
      // For healthcare, include all relevant regulations without restrictions
      if (businessData.industry === 'Healthcare') {
        // Don't filter out any healthcare-specific regulations
        console.log('Healthcare business - including all relevant regulations');
      } else {
        // Filter out healthcare-specific regulations for non-healthcare industries
        queryText += ` AND (r.title NOT LIKE '%HIPAA%' AND r.title NOT LIKE '%Healthcare%' AND r.title NOT LIKE '%Medical%')`;
      }
    }
    
    // Add business size filters - but be less restrictive
    if (businessData.size === 'Small') {
      // Small businesses still get most regulations, just fewer penalties
      console.log('Small business - including most regulations');
    } else if (businessData.size === 'Large') {
      // Large businesses get all regulations
      console.log('Large business - including all regulations');
    }
    
    // Add employee count considerations
    if (businessData.employeeCount >= 50) {
      // FMLA applies to businesses with 50+ employees
      console.log('50+ employees - FMLA regulations apply');
    }
    
    if (businessData.employeeCount >= 5) {
      // Sexual harassment training applies to businesses with 5+ employees
      console.log('5+ employees - Sexual harassment training applies');
    }

    queryText += `
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline
      ORDER BY r.category, r.title
    `;

    console.log('Final SQL Query:', queryText);
    console.log('Query Parameters:', queryParams);

    const result = await query(queryText, queryParams);
    
    console.log('Database result rows:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Sample regulation:', result.rows[0]);
    }
    
    // Post-process to include additional regulations based on business characteristics
    let finalRegulations = [...result.rows];
    
    // Add regulations based on employee count
    if (businessData.employeeCount >= 50) {
      // FMLA applies to businesses with 50+ employees
      const fmlaRegulation = await query(`
        SELECT DISTINCT r.*, 
               array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
               array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
               array_agg(DISTINCT e.exemption_text) as exemptions,
               array_agg(DISTINCT a.applies_to) as applies_to
        FROM regulations r
        LEFT JOIN penalties p ON r.id = p.regulation_id
        LEFT JOIN requirements req ON r.id = req.regulation_id
        LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
        LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
        WHERE r.title LIKE '%FMLA%' OR r.title LIKE '%Family and Medical Leave%'
        GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline
      `);
      
      if (fmlaRegulation.rows.length > 0 && !finalRegulations.find(r => r.id === fmlaRegulation.rows[0].id)) {
        finalRegulations.push(fmlaRegulation.rows[0]);
        console.log('Added FMLA regulation for 50+ employees');
      }
    }
    
    // Add regulations based on business size and industry
    if (businessData.size === 'Medium' || businessData.size === 'Large') {
      // Medium/Large businesses get more comprehensive regulations
      const additionalRegulations = await query(`
        SELECT DISTINCT r.*, 
               array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
               array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
               array_agg(DISTINCT e.exemption_text) as exemptions,
               array_agg(DISTINCT a.applies_to) as applies_to
        FROM regulations r
        LEFT JOIN penalties p ON r.id = p.regulation_id
        LEFT JOIN requirements req ON r.id = req.regulation_id
        LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
        LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
        WHERE (r.category IN ('Labor & Employment', 'Workplace Safety', 'Civil Rights'))
        AND r.jurisdiction IN ('Federal', 'California')
        GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline
      `);
      
      additionalRegulations.rows.forEach(reg => {
        if (!finalRegulations.find(r => r.id === reg.id)) {
          finalRegulations.push(reg);
          console.log('Added additional regulation:', reg.title);
        }
      });
    }
    
    console.log('Final regulations count after post-processing:', finalRegulations.length);
    
    // Process and format the results
    return finalRegulations.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      jurisdiction: row.jurisdiction,
      authority: row.authority,
      effectiveDate: row.effective_date,
      complianceDeadline: row.compliance_deadline,
      penalties: row.penalties.filter(p => p !== null).map(p => {
        const [type, rest] = p.split(':');
        const [amount, description] = rest.split(' - ');
        return {
          type: type.trim(),
          amount: parseFloat(amount.replace('$', '')),
          description: description.trim()
        };
      }),
      requirements: row.requirements.filter(r => r !== null).map(r => {
        const [description, frequency] = r.split(' (');
        return {
          description: description.trim(),
          frequency: frequency ? frequency.replace(')', '') : 'As needed',
          documentation: 'Required documentation varies by regulation',
          deadline: 'Varies by requirement'
        };
      }),
      exemptions: row.exemptions.filter(e => e !== null),
      appliesTo: row.applies_to.filter(a => a !== null)
    }));

  } catch (error) {
    console.error('Error determining applicable regulations:', error);
    throw error;
  }
}

// Helper function to calculate compliance score
function calculateComplianceScore(regulations, businessData) {
  if (regulations.length === 0) return 100;
  
  // Base score starts at 100
  let score = 100;
  
  // Deduct points for each regulation category (more realistic penalties)
  const categoryPenalties = {
    'Labor & Employment': 8,
    'Workplace Safety': 10,
    'Environmental': 7,
    'Health & Safety': 9,
    'Privacy & Security': 6,
    'Business Licensing': 4,
    'Local Ordinances': 3,
    'Land Use': 5,
    'Transportation': 4,
    'Taxation': 6,
    'Professional Licensing': 5,
    'Civil Rights': 7,
    'Financial Services': 6
  };
  
  // Calculate total penalty based on unique categories (IMPROVED)
  const uniqueCategories = [...new Set(regulations.map(r => r.category))];
  let totalPenalty = 0;
  
  uniqueCategories.forEach(category => {
    const penalty = categoryPenalties[category] || 5;
    totalPenalty += penalty;
  });
  
  // Apply business size multiplier (MAJOR FIX)
  let sizeMultiplier = 1.0;
  if (businessData.size === 'Small') {
    sizeMultiplier = 0.2; // Small businesses get 80% penalty reduction
  } else if (businessData.size === 'Medium') {
    sizeMultiplier = 0.5; // Medium businesses get 50% penalty reduction
  }
  // Large businesses get full penalty (1.0 multiplier)
  
  // Apply employee count adjustment (ENHANCED)
  let employeeMultiplier = 1.0;
  if (businessData.employeeCount <= 5) {
    employeeMultiplier = 0.2; // Very small businesses get 80% penalty reduction
  } else if (businessData.employeeCount <= 10) {
    employeeMultiplier = 0.3; // Small businesses get 30% penalty reduction
  } else if (businessData.employeeCount <= 25) {
    employeeMultiplier = 0.5; // Small businesses get 50% penalty reduction
  } else if (businessData.employeeCount <= 50) {
    employeeMultiplier = 0.7; // Medium businesses get 30% penalty reduction
  } else if (businessData.employeeCount <= 200) {
    employeeMultiplier = 0.85; // Medium businesses get 15% penalty reduction
  } else if (businessData.employeeCount <= 1000) {
    employeeMultiplier = 1.5; // Large businesses get 50% penalty increase
  } else if (businessData.employeeCount > 1000) {
    employeeMultiplier = 2.0; // Very large businesses get 100% penalty increase
  } else if (businessData.employeeCount > 5000) {
    employeeMultiplier = 2.5; // Enterprise businesses get 150% penalty increase
  }
  // Default: Large businesses get full penalty (1.0 multiplier)
  
  // Calculate final penalty
  const finalPenalty = totalPenalty * sizeMultiplier * employeeMultiplier;
  
  // Deduct penalty from base score
  score = Math.max(0, score - finalPenalty);
  

  
  // Revenue-based penalties (ENHANCED for large businesses)
  if (businessData.annualRevenue > 1000000 && businessData.size !== 'Small') { // $1M+
    score = Math.max(0, score - 5);
  }
  if (businessData.annualRevenue > 10000000 && businessData.size !== 'Small') { // $10M+
    score = Math.max(0, score - 8);
  }
  if (businessData.annualRevenue > 50000000 && businessData.size === 'Large') { // $50M+
    score = Math.max(0, score - 12); // Additional penalty for very large revenue
  }
  
  // Enterprise-level complexity penalties
  if (businessData.employeeCount > 5000) {
    score = Math.max(0, score - 15); // Enterprise businesses have complex compliance needs
  }
  if (businessData.employeeCount > 10000) {
    score = Math.max(0, score - 20); // Mega-enterprises have extensive compliance requirements
  }
  
  // Industry-specific penalties (REDUCED for small businesses)
  if (businessData.industry === 'Healthcare') {
    const healthcarePenalty = businessData.size === 'Small' ? 8 : 15;
    score = Math.max(0, score - healthcarePenalty);
  }
  if (businessData.industry === 'Technology') {
    const techPenalty = businessData.size === 'Small' ? 5 : 10;
    score = Math.max(0, score - techPenalty);
  }
  if (businessData.industry === 'Construction') {
    const constructionPenalty = businessData.size === 'Small' ? 6 : 12;
    score = Math.max(0, score - constructionPenalty);
  }
  
  // Ensure minimum score for very small businesses (ENHANCED)
  if (businessData.size === 'Small' && businessData.employeeCount <= 10) {
    score = Math.max(score, 75); // Minimum 75% for very small businesses
  } else if (businessData.size === 'Small') {
    score = Math.max(score, 65); // Minimum 65% for small businesses
  } else if (businessData.size === 'Medium' && businessData.employeeCount <= 50) {
    score = Math.max(score, 50); // Minimum 50% for medium businesses
  }
  
  return Math.max(0, Math.round(score));
}

// Helper function to determine risk level
function determineRiskLevel(complianceScore, regulations) {
  // More realistic risk thresholds
  if (complianceScore >= 85) return 'Low';
  if (complianceScore >= 65) return 'Medium';
  if (complianceScore >= 45) return 'High';
  return 'Critical';
}

// Helper function to get next deadlines
function getNextDeadlines(regulations) {
  const deadlines = [];
  const now = new Date();
  
  regulations.forEach(regulation => {
    if (regulation.complianceDeadline) {
      const deadline = new Date(regulation.complianceDeadline);
      if (deadline > now) {
        deadlines.push(regulation.complianceDeadline);
      }
    }
  });
  
  // Sort by date and return top 5
  return deadlines
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(0, 5);
}

// Helper function to generate recommendations
function generateRecommendations(regulations, businessData) {
  const recommendations = [];
  
  // General recommendations based on business type
  if (businessData.employeeCount > 50) {
    recommendations.push('Consider hiring a compliance officer or consultant');
  }
  
  // Regulation-specific recommendations
  const criticalCategories = ['Health & Safety', 'Environmental', 'Workplace Safety'];
  const hasCriticalRegulations = regulations.some(r => criticalCategories.includes(r.category));
  
  if (hasCriticalRegulations) {
    recommendations.push('Prioritize compliance with health, safety, and environmental regulations');
  }
  
  // Location-specific recommendations
  if (businessData.county === 'Kern') {
    recommendations.push('Ensure compliance with Kern County specific regulations');
  }
  
  if (businessData.city === 'Bakersfield') {
    recommendations.push('Check Bakersfield municipal code requirements');
  }
  

  
  // Add general compliance advice
  recommendations.push('Maintain detailed records of all compliance activities');
  recommendations.push('Schedule regular compliance reviews and updates');
  
  return recommendations;
}

module.exports = router;
