import type {
  CodeAccServerMessage,
  CodeReqServerMessage,
  InitialServerMessage,
  RatingServerMessage,
  ServerMessage,
  UsernameAccServerMessage,
  UsernameReqServerMessage,
} from "./types";
import { Utils } from "./utils";

function encodeInitial(msg: InitialServerMessage) {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];

  // 1. Message type
  parts.push(Uint8Array.of(0));

  // 2. Users
  const users = msg.users;
  parts.push(Uint8Array.of(users.length));
  for (const user of users) {
    const nameBytes = encoder.encode(user.name);
    if (nameBytes.length > 255) throw new Error("Username too long");
    parts.push(Uint8Array.of(nameBytes.length), nameBytes);
  }

  // 3. Beers
  const beers = msg.beers;
  parts.push(Uint8Array.of(beers.length));
  for (const beer of beers) {
    const beerBytes = encoder.encode(beer.name);
    if (beerBytes.length > 255) throw new Error("Beer name too long");
    parts.push(Uint8Array.of(beerBytes.length), beerBytes);
  }

  // 4. Ratings
  const ratings = msg.ratings;
  const ratingCount = ratings.length;
  parts.push(Uint8Array.of((ratingCount >> 8) & 0xff, ratingCount & 0xff));
  for (const r of ratings) {
    parts.push(Uint8Array.of(r.user_id, r.beer_id, r.rating));
  }

  return Utils.concatManyUint8Arrays(parts);
  // const usersArr =
  // // const arr = new Uint8Array([1,2,3]);

  // // new TextEncoder().encode("GG")

  // return JSON.stringify(msg);
}

function encodeCodeReq() {
  return new Uint8Array([1]);
}

function encodeCodeAcc() {
  return new Uint8Array([2]);
  // return JSON.stringify(msg);
}

function encodeUsernameReq() {
  return new Uint8Array([3]);
  // return JSON.stringify(msg);
}

function encodeUsernameAcc(msg: UsernameAccServerMessage) {
  const buf = new Uint8Array(2);
  buf[0] = 4;
  buf[1] = msg.user_id;
  return buf;
  // return JSON.stringify(msg);
}

function encodeRating(msg: RatingServerMessage) {
  const encoder = new TextEncoder();
  const parts: number[] = [5, msg.rating, msg.beer_id, msg.user_id];

  if (msg.username) {
    const usernameBytes = encoder.encode(msg.username);
    if (usernameBytes.length < 3 || usernameBytes.length > 32) {
      throw new Error("Username must be 3–32 bytes");
    }
    parts.push(usernameBytes.length, ...usernameBytes);
  }

  if (msg.beer) {
    const beerBytes = encoder.encode(msg.beer);
    if (beerBytes.length < 3 || beerBytes.length > 32) {
      throw new Error("Beer name must be 3–32 bytes");
    }
    parts.push(beerBytes.length, ...beerBytes);
  }

  return Uint8Array.from(parts);
  // return JSON.stringify(msg);
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
