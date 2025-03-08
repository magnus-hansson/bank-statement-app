import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = new Database('./local.db');
const db = drizzle(sqlite);

// This will run migrations from the 'drizzle' folder
async function main() {
    console.log('Running migrations...');
    await migrate(db, {
        migrationsFolder: join(__dirname, '../../../../drizzle')
    });
    console.log('Migrations completed!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Migration failed!');
    console.error(err);
    process.exit(1);
});