#!/bin/sh
set -e

# Function to calculate package.json hash
calculate_hash() {
  md5sum package.json | awk '{ print $1 }'
}

# Initial hash when container starts
if [ ! -f node_modules/.package-hash ]; then
  # First run or node_modules doesn't exist yet
  echo "Initial npm install..."
  npm install
  mkdir -p node_modules
  calculate_hash > node_modules/.package-hash
else
  # Check if package.json has changed
  CURRENT_HASH=$(calculate_hash)
  STORED_HASH=$(cat node_modules/.package-hash)
  
  if [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
    echo "Package.json changed. Updating dependencies..."
    npm install
    calculate_hash > node_modules/.package-hash
  else
    echo "No changes in package.json, using cached node_modules."
  fi
fi

# Execute the main command
exec "$@"