# Use official Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port 4000
EXPOSE 4000

# Run the app
CMD ["npm", "start"]
