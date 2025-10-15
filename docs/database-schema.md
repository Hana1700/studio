# Schéma de base de données SQLite

Ce document décrit comment créer une structure de base de données SQLite qui correspond aux données utilisées dans l'application (`src/lib/data.ts`).

## Aperçu des entités

L'application est organisée autour de trois concepts principaux :

1.  **Structures** : Ce sont les entités de haut niveau, comme les directions ou les départements principaux.
2.  **Sous-directions** (`SubDepartments`) : Chaque structure peut contenir plusieurs sous-directions.
3.  **Contacts** : Les personnes, qui sont rattachées à une structure et (optionnellement) à une sous-direction.

## Schéma SQL pour SQLite

Voici les commandes `CREATE TABLE` pour générer les tables correspondantes dans SQLite.

### 1. Table `structures`

Cette table stocke les informations sur les directions principales.

```sql
CREATE TABLE structures (
    id TEXT PRIMARY KEY NOT NULL,  -- Identifiant unique (ex: 'direction-generale')
    name TEXT NOT NULL,            -- Nom de la structure (ex: 'Direction de ....')
    description TEXT               -- Description de la structure
);
```

### 2. Table `sub_departments`

Cette table stocke les informations sur les sous-directions. Chaque sous-direction est liée à une structure parente via `structure_id`.

```sql
CREATE TABLE sub_departments (
    id TEXT PRIMARY KEY NOT NULL,  -- Identifiant unique (ex: 'presidence')
    name TEXT NOT NULL,            -- Nom de la sous-direction (ex: 'Sous-direction de...')
    structure_id TEXT NOT NULL,    -- Clé étrangère qui référence la structure parente
    FOREIGN KEY (structure_id) REFERENCES structures(id)
);
```

### 3. Table `contacts`

Cette table contient tous les contacts. Chaque contact est obligatoirement lié à une `structure` et peut optionnellement être lié à une `sub_department`.

```sql
CREATE TABLE contacts (
    id TEXT PRIMARY KEY NOT NULL,      -- Identifiant unique (ex: '1')
    name TEXT NOT NULL,                -- Nom complet du contact
    title TEXT NOT NULL,               -- Grade ou poste
    phone TEXT NOT NULL,               -- Numéro de téléphone principal
    mobile TEXT,                       -- Numéro de téléphone secondaire (optionnel)
    structure_id TEXT NOT NULL,        -- Clé étrangère qui référence la structure
    sub_department_id TEXT,            -- Clé étrangère qui référence la sous-direction (optionnel)
    FOREIGN KEY (structure_id) REFERENCES structures(id),
    FOREIGN KEY (sub_department_id) REFERENCES sub_departments(id)
);
```

## Comment utiliser ce schéma

1.  **Créez la base de données** : Utilisez l'interface en ligne de commande de SQLite pour créer un nouveau fichier de base de données (par exemple `annuaire.db`).
2.  **Exécutez les commandes** : Copiez-collez les commandes `CREATE TABLE` ci-dessus dans votre terminal SQLite pour créer les tables.
3.  **Populez les tables** : Vous pouvez ensuite écrire des scripts pour insérer les données depuis le fichier `src/lib/data.ts` dans ces tables en utilisant des commandes `INSERT INTO`.

Ce schéma vous servira de point de départ pour rendre votre application dynamique avec votre propre backend et base de données SQLite.
