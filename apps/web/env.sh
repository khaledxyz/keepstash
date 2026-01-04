#!/bin/sh
# Generate runtime environment config
set -e

OUTPUT_FILE="./dist/env-config.js"

echo "Generating runtime configuration..."
echo "window._env_ = {" > "$OUTPUT_FILE"

# Read all VITE_ prefixed environment variables
env | grep '^VITE_' | while IFS='=' read -r key value; do
  escaped_value=$(echo "$value" | sed 's/"/\\"/g')
  echo "  \"$key\": \"$escaped_value\"," >> "$OUTPUT_FILE"
done

echo "};" >> "$OUTPUT_FILE"

echo "Configuration generated successfully"
cat "$OUTPUT_FILE"
