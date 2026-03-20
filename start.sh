#!/bin/bash

# --- Professional Startup Script for AI Resume Builder ---
# Decoupled End-to-End Orchestrator

# Configuration
FRONTEND_PORT=3000
BACKEND_PORT=4000

# Colors for professional output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=========================================================="
echo "         AI RESUME BUILDER - PRODUCT SUITE              "
echo "=========================================================="
echo -e "${NC}"

# Function to kill process on a port
kill_port() {
    local port=$1
    local pids=$(lsof -t -i:$port)
    if [ -n "$pids" ]; then
        echo -e "${BLUE}[System] Cleaning up port $port...${NC}"
        echo "$pids" | xargs kill -9
    fi
}

cleanup() {
    echo -e "\n${RED}Stopping services...${NC}"
    # 1. Kill the child background job explicitly
    if [ -n "$BACKEND_PID" ]; then
        kill -9 $BACKEND_PID 2>/dev/null || true
    fi
    
    # 2. Aggressively kill the ts-node-dev supervisor that watches the backend
    pkill -f ts-node-dev 2>/dev/null || true
    
    # 3. Double check ports
    kill_port $FRONTEND_PORT >/dev/null 2>&1
    kill_port $BACKEND_PORT >/dev/null 2>&1
    
    echo -e "${GREEN}✓ System exited gracefully.${NC}"
    exit 0
}

# Trap terminal exits (Ctrl+C) to run cleanup
trap cleanup INT TERM EXIT

# --- 1. Cleanup Phase ---
echo -e "${BOLD}Phase 1: Environment Cleanup${NC}"
# Prevent immediate zombie reboots before we kill the ports
pkill -f ts-node-dev 2>/dev/null || true
kill_port $FRONTEND_PORT
kill_port $BACKEND_PORT
echo -e "${GREEN}✓ Ports cleared.${NC}\n"

# --- 2. Backend Startup ---
echo -e "${BOLD}Phase 2: Launching Backend Engine (Port $BACKEND_PORT)${NC}"
cd server
npm run dev > ../server.log 2>&1 &
BACKEND_PID=$!
echo -e "${BLUE}ℹ Backend running in background (PID: $BACKEND_PID)${NC}"
cd ..

# Wait for backend to be ready (simple check)
sleep 2

# --- 3. Frontend Startup ---
echo -e "${BOLD}Phase 3: Launching Frontend Suite (Port $FRONTEND_PORT)${NC}"
echo -e "${BLUE}ℹ Starting Next.js Dev Server...${NC}"
cd client
npm run dev
