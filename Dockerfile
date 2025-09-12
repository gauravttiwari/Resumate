FROM node:16-alpine as client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy client build
COPY --from=client-builder /app/client/build ./client/build

# Install server dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

# Copy server files
COPY server/ ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]