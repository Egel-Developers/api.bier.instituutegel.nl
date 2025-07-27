import type {
  ClientMessage,
  CodeClientMessage,
  RatingExistingBeerClientMessage,
  RatingNewBeerClientMessage,
  UsernameClientMessage,
} from "./types";

function decodeCode(msg: string): CodeClientMessage {
  return JSON.parse(msg);
}

function decodeUsername(msg: string): UsernameClientMessage {
  return JSON.parse(msg);
}

function decodeRatingNewBeer(msg: string): RatingNewBeerClientMessage {
  return JSON.parse(msg);
}

function decodeRatingExistingBeer(
  msg: string
): RatingExistingBeerClientMessage {
  return JSON.parse(msg);
}

function decode(msg: string): ClientMessage {
  // TODO look at first byte
  const { messageType } = JSON.parse(msg);

  switch (messageType) {
    case 0:
      return decodeCode(msg);
    case 1:
      return decodeUsername(msg);
    case 2:
      return decodeRatingNewBeer(msg);
    case 3:
      return decodeRatingExistingBeer(msg);
    default:
      throw new Error(`Unhandled message type: ${msg}`);
  }
}

export const Decoder = { decode };
