FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use node to serve the application
FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy build from the previous stage
COPY --from=build /app/dist /app/dist

# Expose the port that serve will use
EXPOSE 8000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3000"]