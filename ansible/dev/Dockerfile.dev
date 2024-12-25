# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application source code from the current directory to the working directory in the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run the application when the container launches
CMD ["npm", "start"]
