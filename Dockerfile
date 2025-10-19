# 1. Installer les dépendances et construire l'application
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package*.json ./
# Installer toutes les dépendances, y compris devDependencies pour le build et le seed
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Créer l'image finale de production
FROM node:20-slim AS runner
WORKDIR /app

# Copier les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copier le client Prisma généré
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client


# Copier les fichiers de build de Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copier le schéma Prisma et le script de seed
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-node
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript
COPY --from=builder /app/node_modules/@types ./node_modules/@types
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs


EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
