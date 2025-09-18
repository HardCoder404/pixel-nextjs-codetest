# ---------------------------
# Dockerfile for Work Orders App
# ---------------------------

# Step 1: Base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Step 4: Copy rest of the project
COPY . .

# Step 5: Generate Prisma client
RUN npx prisma generate

# Step 6: Build Next.js app
RUN npm run build

# Step 7: Expose port
EXPOSE 3000

# Step 8: Run migrations + seed + start app
CMD npx prisma migrate dev --name init && \
    npm run seed && \
    npm run dev
