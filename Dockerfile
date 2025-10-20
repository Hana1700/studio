# Étape 1: Construire l'application
FROM node:20-slim AS builder

# Définir l'environnement
ENV NODE_ENV=production

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires pour le build
# Et la librairie manquante pour Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl wget && \
    wget http://ftp.br.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb

# Copier les fichiers de dépendances et de schéma Prisma
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Installer les dépendances de production
RUN npm install --omit=dev

# Générer le client Prisma (important de le faire ici)
RUN npx prisma generate

# Copier le reste du code de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Créer l'image de production finale
FROM node:20-slim AS runner

# Définir l'environnement
ENV NODE_ENV=production

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires pour l'exécution
# Et la librairie manquante pour Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl wget && \
    wget http://ftp.br.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb


# Copier uniquement les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Copier l'application construite
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Exposer le port
EXPOSE 3000

# Définir la commande de démarrage
CMD ["npm", "run", "start"]
