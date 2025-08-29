# Render Deployment Guide

## Issues Fixed

### 1. Missing Database Tables
- **Problem**: Database tables (`businesses`, `regulations`) don't exist on Render
- **Solution**: Added automatic database setup during deployment

### 2. Missing Client Build Files
- **Problem**: Client build files are not generated during Render deployment
- **Solution**: Added build scripts and postinstall hooks

## Deployment Steps

### 1. Environment Variables
Set these in your Render dashboard:

```
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
PORT=10000
```

### 2. Build Command
Use this build command in Render:
```bash
./render-build.sh
```

### 3. Start Command
Use this start command in Render:
```bash
npm start
```

## What Happens During Deployment

1. **Build Phase** (`render-build.sh`):
   - Installs all dependencies
   - Builds the React client
   - Sets up database tables
   - Seeds initial data

2. **Runtime**:
   - Server starts on port 10000
   - Serves API endpoints
   - Serves static client files (if available)
   - Falls back to API-only mode if client build is missing

## Scripts Added

- `render-build.sh`: Main build script for Render
- `render-setup.js`: Node.js setup script
- `render:deploy`: NPM script for deployment setup

## Troubleshooting

### If client build fails:
- Check that all client dependencies are in `client/package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

### If database setup fails:
- Verify `DATABASE_URL` is correct
- Check database permissions
- Review database connection logs

### If server won't start:
- Check port configuration
- Verify all environment variables
- Review server startup logs

## File Structure After Deployment

```
/opt/render/project/src/
├── server/           # Backend code
├── client/           # Frontend source
│   └── build/        # Built frontend (created during build)
├── node_modules/     # Dependencies
└── package.json      # Project configuration
```

## Monitoring

- Check Render logs for build and runtime errors
- Monitor database connections
- Verify API endpoints are responding
- Test client functionality
