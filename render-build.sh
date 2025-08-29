#!/bin/bash

echo "🚀 Starting Render build process..."

# Navigate to project root
cd /opt/render/project/src

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Navigate to client directory and install dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Build the client
echo "🔨 Building client..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Client build completed successfully!"
    ls -la build/
else
    echo "❌ Client build failed!"
    exit 1
fi

# Go back to root and setup database
echo "🗄️ Setting up database..."
cd ..
npm run db:setup

echo "🎉 Render build process completed!"
