#!/bin/bash

echo "========================================"
echo "Vision RAG - Quick Setup (Mac/Linux)"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download from: https://nodejs.org"
    exit 1
fi

echo "Node.js version:"
node --version
echo ""

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Installation failed!"
    echo "Try running: npm cache clean --force"
    exit 1
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "   npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo "========================================"
