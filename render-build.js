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
      execSync('node server/database/regulations-seeder.js', { stdio: 'inherit' });
      console.log('✅ Regulations data seeded successfully');
    } catch (error) {
      console.log('⚠️ Regulation seeding failed (may already exist):', error.message);
    }
    
    console.log('🎉 Render build process completed successfully!');
    
  } catch (error) {
    console.error('❌ Render build failed:', error.message);
    process.exit(1);
  }
}

buildForRender();
