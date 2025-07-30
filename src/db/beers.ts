import { sql } from "bun";
import type { Beer } from "../types";

async function getAll() {
  try {
    const users: Beer[] = await sql`
        SELECT id, name FROM beers;
        `;
    return users;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function add(name: string) {
  try {
    const [{ id }] = await sql`
    INSERT INTO beers ${sql({
      name,
    })} ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;
    `;
    return parseInt(id);
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function isNew(beer_id: number) {
  return (
    (await sql`SELECT rating FROM ratings WHERE beer_id = ${beer_id} LIMIT 1`)
      .length > 0
  );
}

export const Beers = { getAll, add, isNew };
