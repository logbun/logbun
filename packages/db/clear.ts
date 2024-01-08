import { sql } from 'drizzle-orm';
import { db } from '.';

const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

db.execute(query)
  .then((tables) => {
    tables.forEach((table) => {
      const truncateQuery = sql.raw(`DROP TABLE ${table.table_name} CASCADE;`);

      db.execute(truncateQuery)
        .then(() => {
          console.log(`Table ${table.table_name} truncated successfully.`);
        })
        .catch((error) => {
          console.error(`Error truncating table ${table.table_name}: ${error.message}`);
        });
    });
  })
  .catch((error) => {
    console.error(`Error executing query: ${error.message}`);
  });
