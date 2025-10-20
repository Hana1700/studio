# Use a modern, slim Node.js image as the base.
FROM node:20-slim

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and lock file.
COPY package.json package-lock.json* ./

# Install project dependencies.
RUN npm install

# Copy Prisma schema to generate the client.
COPY prisma ./prisma/

# Generate the Prisma client. This will now use the correct binary target.
RUN npx prisma generate

# Copy the rest of the application source code.
COPY . .

# Build the Next.js application for production.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 3000

# Define the command to run the application.
CMD ["npm", "run", "start"]
