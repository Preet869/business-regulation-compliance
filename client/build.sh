#!/bin/bash

# Ensure we're in the client directory
cd /opt/render/project/src/client

# Install dependencies
npm install

# Create symbolic link to ensure public folder is accessible
if [ ! -L "src/public" ]; then
    ln -sf ../public src/public
fi

# Build the project
npm run build

echo "Build completed successfully!"
