#!/bin/bash

# Script to check for duplicate export declarations across the codebase
# Usage: ./scripts/check-duplicates.sh

echo "🔍 Checking for duplicate export declarations..."

# Check for duplicate 'export const dynamic' declarations
echo ""
echo "=== Checking for duplicate 'export const dynamic' ==="
find app -name "*.tsx" -exec bash -c '
  exports=$(grep -c "^export const dynamic" "$1")
  if [ $exports -gt 1 ]; then
    echo "❌ $1: $exports duplicates found"
    grep -n "^export const dynamic" "$1"
    exit_code=1
  elif [ $exports -eq 1 ]; then
    echo "✅ $1: Single declaration (OK)"
  fi
' _ {} \;

# Check for any other duplicate export const patterns
echo ""
echo "=== Checking for other duplicate export const patterns ==="
find app -name "*.tsx" -exec bash -c '
  file="$1"
  # Get all export const declarations
  export_consts=$(grep "^export const " "$file" | cut -d" " -f3 | cut -d"=" -f1)
  
  if [ ! -z "$export_consts" ]; then
    # Check for duplicates
    duplicates=$(echo "$export_consts" | sort | uniq -d)
    if [ ! -z "$duplicates" ]; then
      echo "❌ $file: Duplicate export const found:"
      echo "$duplicates" | while read dup; do
        echo "  - $dup"
        grep -n "^export const $dup" "$file"
      done
    fi
  fi
' _ {} \;

echo ""
echo "🎯 Duplicate check complete!"