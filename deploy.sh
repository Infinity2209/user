#!/bin/bash

# Deploy script for Netlify with JSON Server backend

echo "🚀 Starting deployment process..."

# Check if JSON server URL is provided
if [ -z "$JSON_SERVER_URL" ]; then
    echo "❌ Error: JSON_SERVER_URL environment variable is not set"
    echo "Please set your JSON server URL:"
    echo "export JSON_SERVER_URL=https://your-json-server.herokuapp.com"
    exit 1
fi

# Update netlify.toml with the actual JSON server URL
sed -i "s|https://your-json-server-endpoint.herokuapp.com|$JSON_SERVER_URL|g" netlify.toml

echo "✅ Updated netlify.toml with JSON server URL: $JSON_SERVER_URL"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Netlify (assuming netlify-cli is installed)
echo "🌐 Deploying to Netlify..."
npx netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your app should now work with the JSON server backend."
else
    echo "❌ Deployment failed!"
    exit 1
fi
