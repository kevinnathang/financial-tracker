FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npx", "craco", "start"]