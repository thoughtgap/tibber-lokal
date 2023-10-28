# Use an official Node.js runtime as the parent image
FROM node:14-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the necessary packages defined in package.json
RUN npm install

# Make port 3000 available to the world outside this container (if your app uses a port, otherwise remove this line)
EXPOSE 3000

# Define the command to run your app using CMD which keeps the container running
CMD ["node", "index.js"]
