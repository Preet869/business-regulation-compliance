#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Render deployment setup...');

async function setupRender() {
  try {
    // Check if we're in production (Render)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
    
    if (isProduction) {
      console.log('📦 Production environment detected, setting up...');
      
      // 1. Build the client
      console.log('🔨 Building client...');
      const clientPath = path.join(__dirname, 'client');
      
      if (fs.existsSync(clientPath)) {
        process.chdir(clientPath);
        execSync('npm install', { stdio: 'inherit' });
        execSync('npm run build', { stdio: 'inherit' });
        process.chdir(__dirname);
        console.log('✅ Client built successfully');
      } else {
        console.log('⚠️ Client directory not found, skipping build');
      }
      
      // 2. Setup database
      console.log('🗄️ Setting up database...');
      execSync('node server/database/setup.js', { stdio: 'inherit' });
      console.log('✅ Database setup completed');
      
      // 3. Seed regulations if needed
      console.log('🌱 Seeding regulations...');
      try {
        execSync('node server/database/regulations-seeder.js', { stdio: 'inherit' });
        console.log('✅ Regulations seeded successfully');
      } catch (error) {
        console.log('⚠️ Regulation seeding failed (may already exist):', error.message);
      }
      
      console.log('🎉 Render setup completed successfully!');
    } else {
      console.log('🔄 Development environment, skipping Render setup');
    }
  } catch (error) {
    console.error('❌ Render setup failed:', error);
    process.exit(1);
  }
}

setupRender();
