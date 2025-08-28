const express = require('express');
const { query } = require('../database/connection');
const { getCache, setCache } = require('../database/redis');

const router = express.Router();

// Get all regulations with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      jurisdiction, 
      industry, 
      businessSize,
      search,
      sortBy = 'title',
      sortOrder = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;
    
    if (category) {
      queryParams.push(category);
      whereClause += ` AND r.category = $${++paramCount}`;
    }
    
    if (jurisdiction) {
      queryParams.push(jurisdiction);
      whereClause += ` AND r.jurisdiction = $${++paramCount}`;
    }
    
    if (industry) {
      queryParams.push(industry);
      whereClause += ` AND EXISTS (
        SELECT 1 FROM regulation_applicability ra 
        WHERE ra.regulation_id = r.id 
        AND ra.applies_to ILIKE $${++paramCount}
      )`;
    }
    
    if (businessSize) {
      if (businessSize === 'Small') {
        whereClause += ` AND r.category != 'Large Business Only'`;
      } else if (businessSize === 'Large') {
        whereClause += ` AND r.category != 'Small Business Only'`;
      }
    }
    
    if (search) {
      queryParams.push(search);
      whereClause += ` AND (
        to_tsvector('english', r.title || ' ' || r.description) @@ plainto_tsquery('english', $${++paramCount})
        OR r.title ILIKE $${++paramCount}
        OR r.description ILIKE $${++paramCount}
      )`;
    }
    
    // Validate sort parameters
    const allowedSortFields = ['title', 'category', 'jurisdiction', 'effective_date', 'compliance_deadline'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'title';
    }
    
    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      sortOrder = 'ASC';
    }
    
    // Build ORDER BY clause
    let orderByClause = `ORDER BY r.${sortBy} ${sortOrder}`;
    if (sortBy === 'title') {
      orderByClause += ', r.category, r.jurisdiction';
    }
    
    const result = await query(`
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
      ${whereClause}
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline
      ${orderByClause}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `, [...queryParams, limit, offset]);
    
    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(DISTINCT r.id) FROM regulations r
      ${whereClause}
    `, queryParams);
    
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Process and format the results
    const regulations = result.rows.map(row => ({
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
    
    res.json({
      regulations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
});

// Get a specific regulation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    const cacheKey = `regulation:${id}`;
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }
    
    const result = await query(`
      SELECT r.*, 
             array_agg(DISTINCT p.type || ': $' || p.amount || ' - ' || p.description) as penalties,
             array_agg(DISTINCT req.description || ' (' || req.frequency || ')') as requirements,
             array_agg(DISTINCT e.exemption_text) as exemptions,
             array_agg(DISTINCT a.applies_to) as applies_to
      FROM regulations r
      LEFT JOIN penalties p ON r.id = p.regulation_id
      LEFT JOIN requirements req ON r.id = req.regulation_id
      LEFT JOIN regulation_exemptions e ON r.id = e.regulation_id
      LEFT JOIN regulation_applicability a ON r.id = a.regulation_id
      WHERE r.id = $1
      GROUP BY r.id, r.title, r.description, r.category, r.jurisdiction, r.authority, r.effective_date, r.compliance_deadline
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Regulation not found' });
    }
    
    const row = result.rows[0];
    const regulation = {
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
    };
    
    // Cache the result for 1 hour
    await setCache(cacheKey, regulation, 3600);
    
    res.json(regulation);

  } catch (error) {
    console.error('Error fetching regulation:', error);
    res.status(500).json({ error: 'Failed to fetch regulation' });
  }
});

// Search regulations with full-text search
router.get('/search/advanced', async (req, res) => {
  try {
    const { 
      query: searchQuery, 
      category, 
      jurisdiction, 
      effectiveDateFrom, 
      effectiveDateTo,
      page = 1,
      limit = 20
    } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const offset = (page - 1) * limit;
    const queryParams = [];
    let paramCount = 0;
    
    let whereClause = 'WHERE 1=1';
    
    // Add search query
    queryParams.push(searchQuery);
    whereClause += ` AND (
      to_tsvector('english', r.title || ' ' || r.description) @@ plainto_tsquery('english', $${++paramCount})
      OR r.title ILIKE $${++paramCount}
      OR r.description ILIKE $${++paramCount}
    )`;
    
    // Add filters
    if (category) {
      queryParams.push(category);
      whereClause += ` AND r.category = $${++paramCount}`;
    }
    
    if (jurisdiction) {
      queryParams.push(jurisdiction);
      whereClause += ` AND r.jurisdiction = $${++paramCount}`;
    }
    
    if (effectiveDateFrom) {
      queryParams.push(effectiveDateFrom);
      whereClause += ` AND r.effective_date >= $${++paramCount}`;
    }
    
    if (effectiveDateTo) {
      queryParams.push(effectiveDateTo);
      whereClause += ` AND r.effective_date <= $${++paramCount}`;
    }
    
    const result = await query(`
      SELECT DISTINCT r.*, 
             ts_rank(to_tsvector('english', r.title || ' ' || r.description), plainto_tsquery('english', $1)) as relevance_score
      FROM regulations r
      ${whereClause}
      ORDER BY relevance_score DESC, r.title
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `, [searchQuery, ...queryParams, limit, offset]);
    
    // Get total count
    const countResult = await query(`
      SELECT COUNT(DISTINCT r.id) FROM regulations r
      ${whereClause}
    `, [searchQuery, ...queryParams]);
    
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);
    
    const regulations = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      jurisdiction: row.jurisdiction,
      authority: row.authority,
      effectiveDate: row.effective_date,
      complianceDeadline: row.compliance_deadline,
      relevanceScore: row.relevance_score
    }));
    
    res.json({
      regulations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error searching regulations:', error);
    res.status(500).json({ error: 'Failed to search regulations' });
  }
});

// Get regulation categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM regulations
      GROUP BY category
      ORDER BY count DESC
    `);
    
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching regulation categories:', error);
    res.status(500).json({ error: 'Failed to fetch regulation categories' });
  }
});

// Get jurisdictions
router.get('/jurisdictions/list', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT jurisdiction, COUNT(*) as count
      FROM regulations
      GROUP BY jurisdiction
      ORDER BY count DESC
    `);
    
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching jurisdictions:', error);
    res.status(500).json({ error: 'Failed to fetch jurisdictions' });
  }
});

// Get regulation statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_regulations,
        COUNT(DISTINCT category) as total_categories,
        COUNT(DISTINCT jurisdiction) as total_jurisdictions,
        COUNT(DISTINCT authority) as total_authorities,
        COUNT(CASE WHEN compliance_deadline IS NOT NULL THEN 1 END) as regulations_with_deadlines,
        COUNT(CASE WHEN effective_date >= CURRENT_DATE - INTERVAL '1 year' THEN 1 END) as recent_regulations
      FROM regulations
    `);
    
    const categoryStats = await query(`
      SELECT category, COUNT(*) as count
      FROM regulations
      GROUP BY category
      ORDER BY count DESC
      LIMIT 10
    `);
    
    const jurisdictionStats = await query(`
      SELECT jurisdiction, COUNT(*) as count
      FROM regulations
      GROUP BY jurisdiction
      ORDER BY count DESC
    `);
    
    res.json({
      overview: stats.rows[0],
      topCategories: categoryStats.rows,
      jurisdictions: jurisdictionStats.rows
    });

  } catch (error) {
    console.error('Error fetching regulation statistics:', error);
    res.status(500).json({ error: 'Failed to fetch regulation statistics' });
  }
});

module.exports = router;
