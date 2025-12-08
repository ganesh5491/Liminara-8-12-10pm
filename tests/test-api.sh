#!/bin/bash

# Admin & Delivery System - API Testing with cURL
# This script tests all API endpoints using cURL commands

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
API_URL="http://localhost:5001/api"
ADMIN_EMAIL="admin@liminara.com"
ADMIN_PASSWORD="admin123"
AGENT_EMAIL="agent1@liminara.com"
AGENT_PASSWORD="agent123"

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Admin & Delivery System - API Testing${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing:${NC} $description"
    echo -e "${YELLOW}Endpoint:${NC} $method $API_URL$endpoint"
    
    if [ -z "$data" ]; then
        # GET request
        curl -X "$method" \
            "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -c cookies.txt -b cookies.txt \
            2>/dev/null | jq . 2>/dev/null || echo "Response not JSON"
    else
        # POST/PUT request
        curl -X "$method" \
            "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -c cookies.txt -b cookies.txt \
            2>/dev/null | jq . 2>/dev/null || echo "Response not JSON"
    fi
    echo ""
}

# ====================
# ADMIN TESTS
# ====================
echo -e "${GREEN}▶ ADMIN AUTHENTICATION${NC}\n"

test_endpoint "POST" "/admin/auth/login" \
    "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    "Admin Login"

test_endpoint "GET" "/admin/auth/me" \
    "" \
    "Get Current Admin"

# ====================
# DASHBOARD TESTS
# ====================
echo -e "${GREEN}▶ ADMIN DASHBOARD${NC}\n"

test_endpoint "GET" "/admin/dashboard/stats" \
    "" \
    "Get Dashboard Statistics"

# ====================
# PRODUCT MANAGEMENT TESTS
# ====================
echo -e "${GREEN}▶ PRODUCT MANAGEMENT${NC}\n"

test_endpoint "GET" "/admin/products-management" \
    "" \
    "Get All Products"

test_endpoint "POST" "/admin/products-management" \
    "{\"name\":\"Test Product\",\"description\":\"Test\",\"price\":299.99,\"category\":\"skincare\",\"stock\":50,\"sku\":\"TEST-001\"}" \
    "Create Product"

# ====================
# ORDER MANAGEMENT TESTS
# ====================
echo -e "${GREEN}▶ ORDER MANAGEMENT${NC}\n"

test_endpoint "GET" "/admin/orders-management" \
    "" \
    "Get All Orders"

test_endpoint "GET" "/admin/orders-management/delivery-agents/list" \
    "" \
    "Get Delivery Agents"

# ====================
# CONTENT MANAGEMENT TESTS
# ====================
echo -e "${GREEN}▶ CONTENT MANAGEMENT${NC}\n"

test_endpoint "GET" "/admin/content-management/users" \
    "" \
    "Get All Users"

test_endpoint "GET" "/admin/content-management/reviews" \
    "" \
    "Get All Reviews"

test_endpoint "GET" "/admin/content-management/inquiries" \
    "" \
    "Get All Inquiries"

test_endpoint "GET" "/admin/content-management/questions" \
    "" \
    "Get All Questions"

# ====================
# DELIVERY AGENT TESTS
# ====================
echo -e "${GREEN}▶ DELIVERY AGENT TESTS${NC}\n"

test_endpoint "POST" "/delivery/auth/login" \
    "{\"email\":\"$AGENT_EMAIL\",\"password\":\"$AGENT_PASSWORD\"}" \
    "Delivery Agent Login"

test_endpoint "GET" "/delivery/auth/me" \
    "" \
    "Get Current Delivery Agent"

test_endpoint "GET" "/delivery/stats" \
    "" \
    "Get Delivery Statistics"

test_endpoint "GET" "/delivery/orders" \
    "" \
    "Get Assigned Orders"

# ====================
# ADMIN LOGOUT
# ====================
echo -e "${GREEN}▶ LOGOUT${NC}\n"

test_endpoint "POST" "/admin/auth/logout" \
    "" \
    "Admin Logout"

# Cleanup
rm -f cookies.txt

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ API Testing Complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"
