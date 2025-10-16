# Schéma de base de données SQLite

Ce document décrit comment créer une structure de base de données SQLite qui correspond aux données utilisées dans l'application via Prisma ORM.

## Aperçu des entités

L'application est organisée autour de trois concepts principaux :

1.  **Structures** : Ce sont les entités de haut niveau, comme les directions ou les départements principaux.
2.  **Sous-directions** (`SubDepartments`) : Chaque structure peut contenir plusieurs sous-directions.
3.  **Contacts** : Les personnes, qui sont rattachées à une structure et (optionnellement) à une sous-direction.

## Schéma Prisma

Le schéma est défini dans `prisma/schema.prisma`. Prisma génère les commandes SQL nécessaires pour créer les tables.

### 1. Modèle `Structure`

```prisma
model Structure {
  id            String          @id @default(cuid())
  name          String
  description   String?
  subDepartments SubDepartment[]
  contacts      Contact[]
}
```

### 2. Modèle `SubDepartment`

```prisma
model SubDepartment {
  id          String    @id @default(cuid())
  name        String
  structure   Structure @relation(fields: [structureId], references: [id], onDelete: Cascade)
  structureId String
  contacts    Contact[]
}
```

### 3. Modèle `Contact`

```prisma
model Contact {
  id              String         @id @default(cuid())
  name            String
  title           String
  threeDigits     String?
  fourDigits      String?
  fourDigitsXX    String?
  fourDigitsYY    String?
  structure       Structure      @relation(fields: [structureId], references: [id])
  structureId     String
  subDepartment   SubDepartment? @relation(fields: [subDepartmentId], references: [id])
  subDepartmentId String?
}
```

## Comment utiliser ce schéma

1.  **Installer les dépendances** : Exécutez `npm install`.
2.  **Générer le client Prisma** : Exécutez `npx prisma generate`.
3.  **Appliquer les migrations** : Exécutez `npx prisma db push` pour créer la base de données SQLite et les tables correspondantes.
4.  **Populer la base de données (Optionnel)** : Exécutez `npx prisma db seed` pour remplir la base de données avec des données de test définies dans `prisma/seed.ts`.
