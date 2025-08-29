const express = require('express');
const Joi = require('joi');
const { query } = require('../database/connection');

const router = express.Router();

// Validation schema for business data
const businessSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  industry: Joi.string().required().min(1).max(100),
  state: Joi.string().required().length(2),
  county: Joi.string().required().min(1).max(100),
  city: Joi.string().required().min(5).max(100),
  zipCode: Joi.string().required().min(5).max(10),
  size: Joi.string().required().valid('Small', 'Medium', 'Large'),
  employeeCount: Joi.number().integer().min(1).max(10000).required(),
  annualRevenue: Joi.number().positive().max(1000000000).required(),
  businessType: Joi.string().required().min(1).max(100)
});

// Create a new business
router.post('/', async (req, res) => {
  try {
    const { error, value } = businessSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const businessData = value;
    
    const result = await query(`
      INSERT INTO businesses (name, industry, state, county, city, zip_code, size, employee_count, annual_revenue, business_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      businessData.name,
      businessData.industry,
      businessData.state,
      businessData.county,
      businessData.city,
      businessData.zipCode,
      businessData.size,
      businessData.employeeCount,
      businessData.annualRevenue,
      businessData.businessType
    ]);

    const business = result.rows[0];
    
    res.status(201).json({
      message: 'Business created successfully',
              business: {
          id: business.id,
          name: business.name,
          industry: business.industry,
          location: {
            state: business.state,
            county: business.county,
            city: business.city,
            zipCode: business.zip_code
          },
          size: business.size,
          employeeCount: business.employee_count,
          annualRevenue: business.annual_revenue,
          businessType: business.business_type,
          createdAt: business.created_at,
          updatedAt: business.updated_at
        }
    });

  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

// Get all businesses
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, size, county } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;
    
    if (industry) {
      queryParams.push(industry);
      whereClause += ` AND industry = $${++paramCount}`;
    }
    
    if (size) {
      queryParams.push(size);
      whereClause += ` AND size = $${++paramCount}`;
    }
    
    if (county) {
      queryParams.push(county);
      whereClause += ` AND county = $${++paramCount}`;
    }
    
    const result = await query(`
      SELECT * FROM businesses 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `, [...queryParams, limit, offset]);
    
    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) FROM businesses ${whereClause}
    `, queryParams);
    
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      businesses: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        industry: row.industry,
        location: {
          state: row.state,
          county: row.county,
          city: row.city,
          zipCode: row.zip_code
        },
        size: row.size,
        employeeCount: row.employee_count,
        annualRevenue: row.annual_revenue,
        businessType: row.business_type,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// Get a specific business by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get business details
    const businessResult = await query(`
      SELECT * FROM businesses WHERE id = $1
    `, [id]);
    
    if (businessResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    const business = businessResult.rows[0];
    
    // Get compliance history
    const complianceResult = await query(`
      SELECT cr.*, 
             array_agg(DISTINCT br.regulation_id) as regulation_ids,
             array_agg(DISTINCT br.compliance_status) as compliance_statuses
      FROM compliance_results cr
      LEFT JOIN business_regulations br ON cr.business_id = br.business_id
      WHERE cr.business_id = $1
      GROUP BY cr.id, cr.business_id, cr.compliance_score, cr.risk_level, cr.created_at
      ORDER BY cr.created_at DESC
    `, [id]);
    
    // Get detailed regulation information
    const regulationsResult = await query(`
      SELECT DISTINCT r.*, 
             array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
             array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
             array_agg(DISTINCT e.exemption_text) as exemptions,
             array_agg(DISTINCT a.applies_to) as applies_to,
             br.compliance_status,
             br.is_applicable
      FROM business_regulations br
      JOIN regulations r ON br.regulation_id = r.id
      LEFT JOIN penalties p ON r.id = p.regulation_id
      LEFT JOIN requirements req ON r.id = req.regulation_id
      LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
      LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
      WHERE br.business_id = $1
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline, br.compliance_status, br.is_applicable
      ORDER BY r.category, r.title
    `, [id]);
    
    // Format the response
    const businessData = {
      id: business.id,
      name: business.name,
      industry: business.industry,
      location: {
        state: business.state,
        county: business.county,
        city: business.city,
        zipCode: business.zip_code
      },
      size: business.size,
      employeeCount: business.employee_count,
      annualRevenue: business.annual_revenue,
      businessType: business.business_type,
      createdAt: business.created_at,
      updatedAt: business.updated_at,
      complianceHistory: complianceResult.rows.map(cr => ({
        id: cr.id,
        complianceScore: cr.compliance_score,
        riskLevel: cr.risk_level,
        createdAt: cr.created_at,
        regulationCount: cr.regulation_ids ? cr.regulation_ids.filter(id => id !== null).length : 0
      })),
      applicableRegulations: regulationsResult.rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        jurisdiction: r.jurisdiction,
        authority: r.authority,
        effectiveDate: r.effective_date,
        complianceDeadline: r.compliance_deadline,
        complianceStatus: r.compliance_status,
        isApplicable: r.is_applicable,
        penalties: r.penalties.filter(p => p !== null).map(p => {
          const [type, rest] = p.split(':');
          const [amount, description] = rest.split(' - ');
          return {
            type: type.trim(),
            amount: parseFloat(amount.replace('$', '')),
            description: description.trim()
          };
        }),
        requirements: r.requirements.filter(req => req !== null).map(req => {
          const [description, frequency] = req.split(' (');
          return {
            description: description.trim(),
            frequency: frequency ? frequency.replace(')', '') : 'As needed',
            documentation: 'Required documentation varies by regulation',
            deadline: 'Varies by requirement'
          };
        }),
        exemptions: r.exemptions.filter(e => e !== null),
        appliesTo: r.applies_to.filter(a => a !== null)
      }))
    };
    
    res.json(businessData);

  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

// Update a business
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = businessSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const businessData = value;
    
    const result = await query(`
      UPDATE businesses 
      SET name = $1, industry = $2, state = $3, county = $4, city = $5, 
          zip_code = $6, size = $7, employee_count = $8, annual_revenue = $9, business_type = $10
      WHERE id = $11
      RETURNING *
    `, [
      businessData.name,
      businessData.industry,
      businessData.state,
      businessData.county,
      businessData.city,
      businessData.zipCode,
      businessData.size,
      businessData.employeeCount,
      businessData.annualRevenue,
      businessData.businessType,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    const business = result.rows[0];
    
    res.json({
      message: 'Business updated successfully',
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
        location: {
          state: business.state,
          county: business.county,
          city: business.city,
          zipCode: business.zip_code
        },
        size: business.size,
        employeeCount: business.employee_count,
        annualRevenue: business.annual_revenue,
        businessType: business.business_type,
        createdAt: business.created_at,
        updatedAt: business.updated_at
      }
    });

  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business' });
  }
});

// Delete a business
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      DELETE FROM businesses WHERE id = $1 RETURNING id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json({ message: 'Business deleted successfully' });

  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

// Get business statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_businesses,
        COUNT(DISTINCT industry) as total_industries,
        COUNT(DISTINCT county) as total_counties,
        COUNT(DISTINCT city) as total_cities,
        AVG(employee_count) as avg_employees,
        AVG(annual_revenue) as avg_revenue,
        COUNT(CASE WHEN size = 'Small' THEN 1 END) as small_businesses,
        COUNT(CASE WHEN size = 'Medium' THEN 1 END) as medium_businesses,
        COUNT(CASE WHEN size = 'Large' THEN 1 END) as large_businesses
      FROM businesses
    `);
    
    const industryStats = await query(`
      SELECT industry, COUNT(*) as count
      FROM businesses
      GROUP BY industry
      ORDER BY count DESC
      LIMIT 10
    `);
    
    const locationStats = await query(`
      SELECT county, city, COUNT(*) as count
      FROM businesses
      GROUP BY county, city
      ORDER BY count DESC
      LIMIT 10
    `);
    
    res.json({
      overview: stats.rows[0],
      topIndustries: industryStats.rows,
      topLocations: locationStats.rows
    });

  } catch (error) {
    console.error('Error fetching business statistics:', error);
    res.status(500).json({ error: 'Failed to fetch business statistics' });
  }
});

// Get compliance history for a business
router.get('/:id/compliance', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get compliance results
    const complianceResult = await query(`
      SELECT cr.*, 
             array_agg(DISTINCT br.regulation_id) as regulation_ids,
             array_agg(DISTINCT br.compliance_status) as compliance_statuses
      FROM compliance_results cr
      LEFT JOIN business_regulations br ON cr.business_id = br.business_id
      WHERE cr.business_id = $1
      GROUP BY cr.id, cr.business_id, cr.compliance_score, cr.risk_level, cr.created_at
      ORDER BY cr.created_at DESC
    `, [id]);
    
    // Get detailed regulation information
    const regulationsResult = await query(`
      SELECT DISTINCT r.*, 
             array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
             array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
             array_agg(DISTINCT e.exemption_text) as exemptions,
             array_agg(DISTINCT a.applies_to) as applies_to,
             br.compliance_status,
             br.is_applicable
      FROM business_regulations br
      JOIN regulations r ON br.regulation_id = r.id
      LEFT JOIN penalties p ON r.id = p.regulation_id
      LEFT JOIN requirements req ON r.id = req.regulation_id
      LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
      LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
      WHERE br.business_id = $1
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline, br.compliance_status, br.is_applicable
      ORDER BY r.category, r.title
    `, [id]);
    
    res.json({
      businessId: id,
      complianceHistory: complianceResult.rows.map(cr => ({
        id: cr.id,
        complianceScore: cr.compliance_score,
        riskLevel: cr.risk_level,
        createdAt: cr.created_at,
        regulationCount: cr.regulation_ids ? cr.regulation_ids.filter(id => id !== null).length : 0
      })),
      applicableRegulations: regulationsResult.rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        jurisdiction: r.jurisdiction,
        authority: r.authority,
        effectiveDate: r.effective_date,
        complianceDeadline: r.compliance_deadline,
        complianceStatus: r.compliance_status,
        isApplicable: r.is_applicable,
        penalties: r.penalties.filter(p => p !== null).map(p => {
          const [type, rest] = p.split(':');
          const [amount, description] = rest.split(' - ');
          return {
            type: type.trim(),
            amount: parseFloat(amount.replace('$', '')),
            description: description.trim()
          };
        }),
        requirements: r.requirements.filter(req => req !== null).map(req => {
          const [description, frequency] = req.split(' (');
          return {
            description: description.trim(),
            frequency: frequency ? frequency.replace(')', '') : 'As needed',
            documentation: 'Required documentation varies by regulation',
            deadline: 'Varies by requirement'
          };
        }),
        exemptions: r.exemptions.filter(e => e !== null),
        appliesTo: r.applies_to.filter(a => a !== null)
      }))
    });

  } catch (error) {
    console.error('Error fetching business compliance:', error);
    res.status(500).json({ error: 'Failed to fetch business compliance' });
  }
});

module.exports = router;
