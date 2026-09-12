#!/bin/bash
set -e

echo "🚀 Launching ADAPT-X — Multi-Surface Adaptive Ad Layout Engine Suite..."

# Function to cleanup background processes on exit
cleanup() {
  echo "Stopping ADAPT-X services..."
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

# Install Frontend Dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd frontend && npm install)
fi

# Install Backend Dependencies if needed
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  (cd backend && npm install)
fi

# Start Backend Server on Port 8000
echo "Starting ADAPT-X Backend Server on http://localhost:8000..."
(cd backend && npm run dev) &

# Start Frontend Vite Dev Server on Port 3000
echo "Starting ADAPT-X R&D Suite Frontend on http://localhost:3000..."
(cd frontend && npm run dev)
