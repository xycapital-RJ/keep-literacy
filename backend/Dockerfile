FROM node:20-bullseye-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install all deps
RUN npm install --ignore-scripts

# Generate Prisma types BEFORE building (needed for TypeScript)
RUN npx prisma generate

# Copy source and build TypeScript
COPY src ./src
RUN npm run build

RUN test -f dist/src/main.js && echo "dist/src/main.js exists OK"

EXPOSE 3000

# Generate at runtime too to ensure correct binary, then start
CMD ["sh", "-c", "npx prisma generate && node dist/src/main"]
