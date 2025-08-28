#!/bin/bash

# Business Regulation Compliance Setup Script
# This script will help you set up the complete system

set -e

echo "🚀 Business Regulation Compliance Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "   Visit: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL detected"

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis 6+ first."
    echo "   Visit: https://redis.io/download"
    exit 1
fi

echo "✅ Redis detected"

echo ""
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client && npm install && cd ..

echo ""
echo "🔧 Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
    echo "   Database: business_regulations"
    echo "   User: postgres"
    echo "   Password: your_password_here"
    echo ""
    read -p "Press Enter after editing .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🗄️  Setting up database..."

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw business_regulations; then
    echo "Database 'business_regulations' already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        dropdb business_regulations
        echo "Creating new database..."
        createdb business_regulations
    fi
else
    echo "Creating database 'business_regulations'..."
    createdb business_regulations
fi

echo ""
echo "🏗️  Setting up database schema..."

# Run database setup
npm run db:setup

echo ""
echo "🌱 Seeding database with sample data..."

# Seed database
npm run db:seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start checking business compliance!"
echo ""
echo "🔧 Available commands:"
echo "  npm run dev          - Start both backend and frontend"
echo "  npm run server:dev   - Start backend only"
echo "  npm run client:dev   - Start frontend only"
echo "  npm run db:setup     - Re-run database setup"
echo "  npm run db:seed      - Re-seed database"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy compliance checking! 🚀"
