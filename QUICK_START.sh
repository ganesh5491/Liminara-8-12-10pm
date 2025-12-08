#!/bin/bash

# Admin & Delivery System - Quick Start Guide

echo "================================================"
echo "  Admin & Delivery System - Setup & Testing"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}1. Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}2. Starting services...${NC}"
echo "   Backend API: http://localhost:5001/api"
echo "   Frontend: http://localhost:5173"
echo ""

echo -e "${BLUE}3. Opening in background...${NC}"
npm run dev &

echo ""
echo -e "${BLUE}4. Waiting for services to start...${NC}"
sleep 5

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""
echo -e "${YELLOW}Admin Panel:${NC}"
echo "   URL: http://localhost:5173/admin/login"
echo "   Email: admin@liminara.com"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}Delivery Dashboard:${NC}"
echo "   URL: http://localhost:5173/delivery/login"
echo "   Email: agent1@liminara.com"
echo "   Password: agent123"
echo ""
echo -e "${YELLOW}Test Suite:${NC}"
echo "   Run: node tests/admin-delivery-tests.js"
echo ""
