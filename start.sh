#!/bin/bash
# MRK ZONE Startup Script

echo "=================================================="
echo " Starting MRK ZONE E-Commerce Marketplace Platform "
echo "=================================================="

# Set Java 21 Home if available
if [ -d "/opt/homebrew/opt/openjdk@21" ]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
    export PATH="$JAVA_HOME/bin:$PATH"
fi

# Run Backend Jar (Serves both REST APIs and bundled React SPA)
echo "Starting Spring Boot application on http://localhost:8080..."
java -jar backend/target/mrkzone-backend-1.0.0.jar
