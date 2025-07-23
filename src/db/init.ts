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
    CREATE TABLE IF NOT EXISTS beers (
        id INT NOT NULL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ratings (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        beer_id INT NOT NULL REFERENCES beers(id) ON DELETE CASCADE,
        rating INT NOT NULL,
        PRIMARY KEY (user_id, beer_id)
    );
    `.simple();
  });
}

async function down() {
  await sql.begin(async (sql) => {
    await sql`
        DROP TABLE IF EXISTS ratings;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS beers;
        `.simple();
  });
}

export const DB = { init };
