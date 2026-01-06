#!/bin/bash

# Build script for MultiSearch extension
# Creates a clean .zip file ready for Chrome Web Store submission

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔨 Building MultiSearch Extension${NC}"
echo "======================================"

# Get version from manifest.json
VERSION=$(jq -r '.version' manifest.json)
if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Failed to read version from manifest.json${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Version: ${VERSION}${NC}"

# Create build directory
BUILD_DIR="build"
ZIP_NAME="search-switcher-v${VERSION}.zip"

echo -e "${YELLOW}🗑️  Cleaning previous builds...${NC}"
rm -rf "$BUILD_DIR"
rm -f search-switcher-v*.zip

echo -e "${YELLOW}📁 Creating build directory...${NC}"
mkdir -p "$BUILD_DIR"

# Copy necessary files
echo -e "${YELLOW}📋 Copying files...${NC}"
FILES=(
    "manifest.json"
    "content.js"
    "LICENSE"
    "README.md"
    "icon48.png"
    "icon128.png"
    "icon.svg"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BUILD_DIR/"
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (missing)"
    fi
done

# Create zip file
echo -e "${YELLOW}🗜️  Creating zip archive...${NC}"
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" . > /dev/null
cd ..

# Verify zip
echo -e "${YELLOW}🔍 Verifying package...${NC}"
unzip -l "$ZIP_NAME" | grep -E '\.(json|js|png|svg|md)$'

# Get file size
SIZE=$(du -h "$ZIP_NAME" | cut -f1)

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo "======================================"
echo -e "Package: ${BLUE}$ZIP_NAME${NC}"
echo -e "Size: ${BLUE}$SIZE${NC}"
echo -e "Version: ${BLUE}$VERSION${NC}"
echo ""
echo -e "${YELLOW}📤 Next steps:${NC}"
echo "1. Test the extension locally first"
echo "2. Upload to Chrome Web Store Developer Dashboard"
echo "3. Or create a GitHub release with: git tag v$VERSION && git push --tags"
echo ""
