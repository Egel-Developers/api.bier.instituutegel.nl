import { sql } from "bun";
import type { User } from "../types";

async function getAll() {
  try {
    const users: User[] = await sql`
        SELECT id, name FROM users;
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
    INSERT INTO users ${sql({
      name,
    })} ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;
    `;
    return parseInt(id);
  } catch (e) {
    console.error(e);
    return false;
  }
}

// enum UserStatus {
//   HasRatings,
//   Exists,
//   NotExists,
// }

type UserStatus = "not_exists" | "has_ratings" | { username: string };

async function getStatus(user_id: number): Promise<false | UserStatus> {
  try {
    const res = await sql`SELECT name FROM users WHERE id = ${user_id} LIMIT 1`;
    const exists = res.length > 0;

    // const exists =
    //   (await sql`SELECT * FROM users WHERE id = ${user_id} LIMIT 1`).length > 0;
    if (!exists) return "not_exists";

    const hasRatings =
      (await sql`SELECT * FROM ratings WHERE user_id = ${user_id} LIMIT 1`)
        .length > 0;
    if (hasRatings) return "has_ratings";
    return { username: res[0].name };
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const Users = { getAll, add, getStatus };
