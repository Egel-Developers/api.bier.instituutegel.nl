import { sql } from "bun";
import type { Rating } from "../types";

async function add(rating: Rating) {
  try {
    await sql`INSERT INTO ratings ${sql(
      rating
    )} ON CONFLICT (user_id, beer_id) DO UPDATE SET rating = ${rating.rating}`;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// async function getYourRankings(
//   username: string
// ): Promise<false | Omit<Rating, "username">[]> {
//   try {
//     const ratings: Omit<Rating, "username">[] = await sql`
//     SELECT
//         beer,
//         rating
//     FROM
//         ratings
//     WHERE
//         username = ${username}
//     ORDER BY
//         rating DESC;`;

//     return ratings.map((r) => ({
//       beer: r.beer,
//       rating: parseInt(r.rating.toString()),
//     }));
//   } catch (e) { console.error(e);
//     return false;
//   }
// }

async function getAll() {
  try {
    // const ratings: Ranking = await sql`
    // SELECT
    //     beer,
    //     AVG(rating) AS rating,
    //     COUNT(*) AS count
    // FROM
    //     ratings
    // GROUP BY
    //     beer
    // ORDER BY
    //     rating DESC;`;

    // return ratings.map((r) => ({
    //   beer: r.beer,
    //   rating: parseInt(r.rating.toString()),
    //   count: parseInt(r.count.toString()),
    // }));
    const ratings: Rating[] = await sql`
    SELECT
      user_id,
      beer_id,
      rating
    FROM
      ratings
    `;

    return ratings;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export const Ratings = {
  add,
  // getYourRankings,
  getAll,
};
