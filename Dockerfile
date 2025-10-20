# 1. Installer les dépendances et construire l'application
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Step 1: Copy metadata first to leverage Docker cache
COPY package*.json ./

# Step 2: Copy the Prisma schema. This MUST happen before `npm install`
# because the `postinstall` script runs `prisma generate`.
COPY prisma ./prisma

# Installer toutes les dépendances, y compris devDependencies pour le build et le seed
# This step automatically runs 'prisma generate' via the postinstall script.
RUN npm install

# Step 3: Copy the rest of the application files
COPY . .

# Step 4: Run the build
RUN npm run build

# 2. Créer l'image finale de production
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update \
    && apt-get install -y openssl \
    # Clean up apt caches to keep the image small
    && rm -rf /var/lib/apt/lists/*

# Copier les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copier les fichiers générés
COPY --from=builder /app/.next ./.next
#COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./

# The following copies are often *not* necessary if the entire node_modules
# is copied, but we'll keep them to align with your original intent
# of ensuring these development-related tools are present for `db seed`.
COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-no
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript
COPY --from=builder /app/node_modules/@types ./node_modules/@types
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

# Run migrations, seed the database, and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]