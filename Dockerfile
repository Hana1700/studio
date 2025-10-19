# Étape 1: Builder l'application
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json ./

# Installer les dépendances
# Nous installons toutes les dépendances (y compris dev) car `prisma generate` en a besoin
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Générer le client Prisma (essentiel pour la construction)
RUN npx prisma generate

# Construire l'application pour la production
RUN npm run build

# ---

# Étape 2: Créer l'image de production
FROM node:20-alpine AS runner

WORKDIR /app

# Ne pas exécuter en tant que root
USER node

# Copier uniquement les artefacts nécessaires depuis l'étape de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

# Exposer le port sur lequel l'application s'exécutera
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]
