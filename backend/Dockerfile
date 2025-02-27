# backend/Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install ts-node-dev globally
RUN npm install -g ts-node-dev typescript

# Copy package files
COPY package*.json ./

# Remove bcrypt and install bcryptjs instead (pure JavaScript implementation)
RUN npm uninstall bcrypt || true
RUN npm install bcryptjs
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run in development mode
CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]