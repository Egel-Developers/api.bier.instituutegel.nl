import { sql } from "bun";
import type { Beer } from "../types";

async function getAll() {
  try {
    const users: Beer[] = await sql`
        SELECT id, name FROM beers;
        `;
    return users;
  } catch {
    return false;
  }
}

async function add(name: string) {
  try {
    const [{ id }] = await sql`
    INSERT INTO beers ${sql({
      name,
    })} ON CONFLICT (name) DO NOTHING RETURNING id;
    `;
    return parseInt(id);
  } catch {
    return false;
  }
}

export const Beers = { getAll, add };
