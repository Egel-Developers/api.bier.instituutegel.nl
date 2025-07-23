import { sql } from "bun";
import type { Ranking, Rating } from "../types";

async function rate(rating: Rating) {
  try {
    await sql`INSERT INTO ratings ${sql(
      rating
    )} ON CONFLICT (username, beer) DO UPDATE SET rating = ${rating.rating}`;
    return true;
  } catch {
    return false;
  }
}

async function getYourRankings(
  username: string
): Promise<false | Omit<Rating, "username">[]> {
  try {
    const ratings: Omit<Rating, "username">[] = await sql`
    SELECT
        beer,
        rating
    FROM
        ratings
    WHERE
        username = ${username}
    ORDER BY
        rating DESC;`;

    return ratings.map((r) => ({
      beer: r.beer,
      rating: parseInt(r.rating.toString()),
    }));
  } catch {
    return false;
  }
}

async function getRanking(): Promise<false | Ranking> {
  try {
    const ratings: Ranking = await sql`
    SELECT
        beer,
        AVG(rating) AS rating,
        COUNT(*) AS count
    FROM
        ratings
    GROUP BY
        beer
    ORDER BY
        rating DESC;`;

    return ratings.map((r) => ({
      beer: r.beer,
      rating: parseInt(r.rating.toString()),
      count: parseInt(r.count.toString()),
    }));
  } catch {
    return false;
  }
}

export const Ratings = {
  rate,
  getYourRankings,
  getRanking,
};
