import { sql } from "bun";

async function init() {
  try {
    await sql.connect();
    console.log("Connected to the database");
    // await down();
    await up();
  } catch (err) {
    console.error(err);
    console.log("Retrying in 3 seconds...");
    await new Promise((res) => setTimeout(res, 3000));
    init();
  }
}

async function up() {
  await sql.begin(async (sql) => {
    await sql`
    CREATE TABLE IF NOT EXISTS ratings (
        username VARCHAR(255) NOT NULL,
        beer VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        PRIMARY KEY (username, beer)
    );
    `.simple();
  });
}

async function down() {
  await sql.begin(async (sql) => {
    await sql`
        DROP TABLE IF EXISTS ratings;
        `.simple();
  });
}

export const DB = { init };
