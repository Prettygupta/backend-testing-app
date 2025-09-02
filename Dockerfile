# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the environment to development
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, tsconfig.json, and package-lock.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Copy the application code to the working directory
COPY . .

# Install both production and development dependencies
RUN npm install

# Build TypeScript files
RUN npm run build

# Expose the port that the application will run on
EXPOSE 8000

# Start the application
CMD [ "npm", "run", "start:dev" ]
