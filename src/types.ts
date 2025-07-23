export type Data = {
  locked_in: boolean;
  code: string;
  name: string;
  rating?: {
    beer: string;
    rating: number;
  }
};

export type Rating = {
  username: string;
  beer: string;
  rating: number;
};

export type Ranking = {
  beer: string;
  rating: number;
  count: number;
}[];

export const flattenRanking = (ranking: Ranking) =>
  ranking.flatMap((r) => [r.beer, r.rating, r.count]);
