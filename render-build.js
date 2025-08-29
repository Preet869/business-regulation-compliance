#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Render build process...');

async function buildForRender() {
  try {
    console.log('📦 Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('📦 Installing client dependencies...');
    const clientPath = path.join(__dirname, 'client');
    
    if (fs.existsSync(clientPath)) {
      process.chdir(clientPath);
      execSync('npm install', { stdio: 'inherit' });
      
      console.log('🔨 Building client...');
      execSync('npm run build', { stdio: 'inherit' });
      
      // Check if build was successful
      if (fs.existsSync('build')) {
        console.log('✅ Client build completed successfully!');
        console.log('📁 Build contents:');
        execSync('ls -la build/', { stdio: 'inherit' });
      } else {
        throw new Error('Client build failed - build directory not found');
      }
      
      process.chdir(__dirname);
    } else {
      console.log('⚠️ Client directory not found, skipping build');
    }
    
    console.log('🗄️ Setting up database...');
    execSync('node server/database/setup.js', { stdio: 'inherit' });
    console.log('✅ Database setup completed');
    
    console.log('🌱 Seeding regulations data...');
    try {
      // Check if data already exists
      execSync('node server/database/check-data.js', { stdio: 'pipe' });
      console.log('✅ Database already has data, skipping seeding');
    } catch (error) {
      // Exit code 1 means no data, so seed
      console.log('📝 Database is empty, seeding regulations...');
      try {
        execSync('node server/database/regulations-seeder.js', { stdio: 'inherit' });
        console.log('✅ Regulations data seeded successfully');
      } catch (seedError) {
        console.log('⚠️ Regulation seeding failed:', seedError.message);
      }
    }
    
    // Force reseed to ensure we have all 48 regulations
    console.log('🔄 Force reseeding to ensure complete data...');
    try {
      execSync('npm run db:force-reseed', { stdio: 'inherit' });
      console.log('✅ Force reseed completed successfully');
    } catch (forceReseedError) {
      console.log('⚠️ Force reseed failed:', forceReseedError.message);
    }
    
    console.log('🎉 Render build process completed successfully!');
    
  } catch (error) {
    console.error('❌ Render build failed:', error.message);
    process.exit(1);
  }
}

buildForRender();
