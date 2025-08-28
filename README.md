# Business Regulation Compliance Website

A comprehensive web application that helps US business owners determine which regulations apply to their business and what they must do to comply. Built specifically for California and Kern County businesses.

## 🎯 Problem Statement

Small businesses are subject to multiple laws, rules and regulations. Complying with all these rules is confusing. Sometimes these rules are simply good practices, sometimes they are laws. Businesses who make a mistake can be fined, sued, or worse. This tool helps business owners understand what rules apply to them based on their location, industry, size, and other factors.

## ✨ Features

- **Comprehensive Compliance Checker**: Enter business details to get a complete compliance analysis
- **Regulation Database**: Browse thousands of regulations from federal, state, county, and local sources
- **Smart Filtering**: Find relevant regulations based on business profile
- **Risk Assessment**: Get compliance scores and risk level analysis
- **Actionable Recommendations**: Clear next steps and compliance advice
- **Business Management**: Track business profiles and compliance history
- **Multi-Jurisdiction Coverage**: Federal, California, Kern County, and local city regulations

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express.js - Server framework
- **PostgreSQL** - Primary database with advanced indexing
- **Redis** - Caching layer for performance
- **GraphQL** - Efficient data querying
- **Joi** - Input validation
- **Helmet** - Security middleware

### Frontend
- **React.js** - User interface framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Database Design
- **Normalized Schema**: Efficient data storage with proper relationships
- **Full-Text Search**: PostgreSQL text search capabilities
- **Indexing Strategy**: Optimized queries for large datasets
- **Caching Layer**: Redis for frequently accessed data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd business-regulation-compliance
npm install
cd client && npm install
cd ..
```

### 2. Environment Setup
```bash
cp env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb business_regulations

# Run database setup
npm run db:setup

# Seed with sample data
npm run db:seed
```

### 4. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or start separately:
npm run server:dev  # Backend on port 5000
npm run client:dev  # Frontend on port 3000
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- GraphQL: http://localhost:5000/graphql

## 📊 Database Schema

### Core Tables
- **businesses**: Business profiles and information
- **regulations**: Regulation details and metadata
- **penalties**: Fines and penalties for non-compliance
- **requirements**: Compliance requirements and deadlines
- **exemptions**: Situations where regulations don't apply
- **business_regulations**: Many-to-many relationship mapping

### Key Relationships
```
businesses ←→ business_regulations ←→ regulations
regulations ←→ penalties
regulations ←→ requirements
regulations ←→ exemptions
```

### Indexing Strategy
- Location-based queries (state, county, city)
- Industry and business size filters
- Full-text search on regulation content
- Compliance deadline tracking

## 🔍 API Endpoints

### Compliance
- `POST /api/compliance/check` - Check business compliance
- `GET /api/compliance/history/:id` - Get compliance history

### Businesses
- `GET /api/business` - List businesses with filtering
- `POST /api/business` - Create new business
- `GET /api/business/:id` - Get business details
- `PUT /api/business/:id` - Update business
- `DELETE /api/business/:id` - Delete business

### Regulations
- `GET /api/regulations` - List regulations with search/filtering
- `GET /api/regulations/:id` - Get regulation details
- `GET /api/regulations/search/advanced` - Advanced search
- `GET /api/regulations/categories/list` - Get categories
- `GET /api/regulations/jurisdictions/list` - Get jurisdictions

## 🎨 Frontend Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Application header
│   └── Sidebar.js      # Navigation sidebar
├── pages/              # Page components
│   ├── Dashboard.js    # Main landing page
│   ├── ComplianceChecker.js # Compliance form
│   ├── Regulations.js  # Regulation browser
│   ├── Businesses.js   # Business management
│   └── ...            # Other pages
└── index.js            # Application entry point
```

### State Management
- React hooks for local state
- Axios for API communication
- React Router for navigation
- Form validation with React Hook Form

## 🔒 Security Features

- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers and middleware
- **Rate Limiting**: API request throttling
- **Data Sanitization**: XSS protection

## 📈 Performance Optimizations

- **Database Indexing**: Optimized query performance
- **Redis Caching**: Frequently accessed data caching
- **Connection Pooling**: Database connection management
- **Compression**: Response compression middleware
- **Lazy Loading**: Component and route lazy loading

## 🧪 Testing

### Backend Testing
```bash
# Run database tests
npm run test:db

# Run API tests
npm run test:api
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client && npm run build

# Set environment variables
NODE_ENV=production

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📚 Data Sources

The system includes regulations from:
- **Federal**: OSHA, EPA, IRS, Department of Labor
- **California**: State laws, Cal/OSHA, CDTFA
- **Kern County**: Local ordinances and regulations
- **Cities**: Bakersfield, Taft, Delano, and other local municipalities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support or questions:
- Email: support@businesscompliance.com
- Phone: (661) 868-3000
- Documentation: [Link to docs]

## 🔮 Future Enhancements

- **AI-Powered Recommendations**: Machine learning for better compliance advice
- **Document Management**: Upload and track compliance documents
- **Notification System**: Deadline reminders and updates
- **Mobile App**: Native iOS and Android applications
- **Integration APIs**: Connect with accounting and HR systems
- **Compliance Dashboard**: Real-time compliance monitoring

---

**Built with ❤️ for the Kern County business community**
