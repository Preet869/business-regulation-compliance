const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./database/connection');
const { connectRedis } = require('./database/redis');
const businessRoutes = require('./routes/business');
const complianceRoutes = require('./routes/compliance');
const regulationRoutes = require('./routes/regulations');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Performance middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// GraphQL Schema
const typeDefs = `
  type Business {
    id: ID!
    name: String!
    industry: String!
    location: Location!
    size: String!
    employeeCount: Int!
    annualRevenue: Float!
    businessType: String!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    state: String!
    county: String!
    city: String!
    zipCode: String!
  }

  type Regulation {
    id: ID!
    title: String!
    description: String!
    category: String!
    jurisdiction: String!
    authority: String!
    effectiveDate: String!
    complianceDeadline: String
    penalties: [Penalty!]!
    requirements: [Requirement!]!
    exemptions: [String!]!
    appliesTo: [String!]!
  }

  type Penalty {
    type: String!
    amount: Float!
    description: String!
  }

  type Requirement {
    description: String!
    frequency: String!
    documentation: String!
    deadline: String
  }

  type ComplianceResult {
    business: Business!
    applicableRegulations: [Regulation!]!
    complianceScore: Float!
    nextDeadlines: [String!]!
    riskLevel: String!
    recommendations: [String!]!
  }

  type Query {
    getBusiness(id: ID!): Business
    getRegulations(filters: RegulationFilters): [Regulation!]!
    checkCompliance(businessData: BusinessInput!): ComplianceResult!
    searchRegulations(query: String!): [Regulation!]!
  }

  input BusinessInput {
    name: String!
    industry: String!
    state: String!
    county: String!
    city: String!
    zipCode: String!
    size: String!
    employeeCount: Int!
    annualRevenue: Float!
    businessType: String!
  }

  input RegulationFilters {
    category: String
    jurisdiction: String
    industry: String
    businessSize: String
  }
`;

const resolvers = {
  Query: {
    getBusiness: async (_, { id }) => {
      // Implementation will be added
      return null;
    },
    getRegulations: async (_, { filters }) => {
      // Implementation will be added
      return [];
    },
    checkCompliance: async (_, { businessData }) => {
      // Implementation will be added
      return null;
    },
    searchRegulations: async (_, { query }) => {
      // Implementation will be added
      return [];
    }
  }
};

// GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    // Add database connections here
  }),
});

// API Routes
app.use('/api/business', businessRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/regulations', regulationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();
    
    // Start GraphQL server
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`🌐 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
