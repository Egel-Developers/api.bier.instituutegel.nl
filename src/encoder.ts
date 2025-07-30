import type {
  InitialServerMessage,
  RatingServerMessage,
  ServerMessage,
  UsernameAccServerMessage,
} from "./types";

function encodeInitial(msg: InitialServerMessage) {
  const encoder = new TextEncoder();
  const bytes: number[] = [0]; // messageType

  // Users
  bytes.push(msg.users.length);
  for (const user of msg.users) {
    bytes.push(user.id); // explicit user_id
    const nameBytes = encoder.encode(user.name);
    bytes.push(nameBytes.length, ...nameBytes);
  }

  // Beers
  bytes.push(msg.beers.length);
  for (const beer of msg.beers) {
    bytes.push(beer.id); // explicit beer_id
    const nameBytes = encoder.encode(beer.name);
    bytes.push(nameBytes.length, ...nameBytes);
  }

  // Ratings
  const ratingCount = msg.ratings.length;
  bytes.push((ratingCount >> 8) & 0xff, ratingCount & 0xff); // 2-byte count
  for (const r of msg.ratings) {
    bytes.push(r.user_id, r.beer_id, r.rating);
  }

  return Uint8Array.from(bytes);
}

function encodeCodeReq() {
  return new Uint8Array([1]);
}

function encodeCodeAcc() {
  return new Uint8Array([2]);
}

function encodeUsernameReq() {
  return new Uint8Array([3]);
}

function encodeUsernameAcc(msg: UsernameAccServerMessage) {
  const buf = new Uint8Array(2);
  buf[0] = 4;
  buf[1] = msg.user_id;
  return buf;
}

function encodeRating(msg: RatingServerMessage) {
  const encoder = new TextEncoder();
  const parts: number[] = [5, msg.rating, msg.beer_id, msg.user_id];

  if (msg.username) {
    const usernameBytes = encoder.encode(msg.username);
    parts.push(usernameBytes.length, ...usernameBytes);
  }

  if (msg.beer) {
    const beerBytes = encoder.encode(msg.beer);
    parts.push(beerBytes.length, ...beerBytes);
  }

  return Uint8Array.from(parts);
}

function encode(msg: ServerMessage) {
  switch (msg.messageType) {
    case 0:
      return encodeInitial(msg);
    case 1:
      return encodeCodeReq();
    case 2:
      return encodeCodeAcc();
    case 3:
      return encodeUsernameReq();
    case 4:
      return encodeUsernameAcc(msg);
    case 5:
      return encodeRating(msg);
    default:
      throw new Error(`Unhandled message type: ${msg}`);
  }
}

export const Encoder = { encode };
