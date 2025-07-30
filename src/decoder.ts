import type {
  ClientMessage,
  CodeClientMessage,
  RatingExistingBeerClientMessage,
  RatingNewBeerClientMessage,
  UsernameClientMessage,
} from "./types";

function decodeCode(buf: Uint8Array): CodeClientMessage {
  const decoder = new TextDecoder();
  let offset = 0;

  const messageType = buf[offset++];
  if (messageType !== 0) {
    throw new Error("Expected messageType 0");
  }

  const codeLength = buf[offset++]!;

  const codeBytes = buf.slice(offset, offset + codeLength);
  const code = decoder.decode(codeBytes);

  return {
    messageType: 0,
    code,
  };
}

function decodeUsername(buf: Uint8Array): UsernameClientMessage {
  const decoder = new TextDecoder();
  let offset = 0;

  const messageType = buf[offset++];
  if (messageType !== 1) throw new Error("Expected messageType 1");

  const codeLength = buf[offset++]!;
  const codeBytes = buf.slice(offset, offset + codeLength);
  offset += codeLength;
  const code = decoder.decode(codeBytes);

  const nameLength = buf[offset++]!;
  const nameBytes = buf.slice(offset, offset + nameLength);
  const name = decoder.decode(nameBytes);

  return {
    messageType: 1,
    code,
    username: name,
  };
}

function decodeRatingNewBeer(buf: Uint8Array): RatingNewBeerClientMessage {
  const decoder = new TextDecoder();
  let offset = 0;

  const messageType = buf[offset++];
  if (messageType !== 2) throw new Error("Expected messageType 2");

  const codeLength = buf[offset++]!;
  const code = decoder.decode(buf.slice(offset, offset + codeLength));
  offset += codeLength;

  const user_id = buf[offset++]!;
  const rating = buf[offset++]!;

  const beerLength = buf[offset++]!;
  const beer = decoder.decode(buf.slice(offset, offset + beerLength));

  return {
    messageType: 2,
    code,
    user_id,
    rating,
    beer,
  };
}

function decodeRatingExistingBeer(
  buf: Uint8Array
): RatingExistingBeerClientMessage {
  const decoder = new TextDecoder();
  let offset = 0;

  const messageType = buf[offset++];

  const codeLength = buf[offset++]!;
  const code = decoder.decode(buf.slice(offset, offset + codeLength));
  offset += codeLength;

  const user_id = buf[offset++]!;
  const rating = buf[offset++]!;

  const beer_id = buf[offset++]!;

  return {
    messageType: 3,
    code,
    user_id,
    rating,
    beer_id,
  };
}

function decode(msg: ArrayBuffer): ClientMessage {
  const buf = new Uint8Array(msg);
  const messageType = buf.at(0);

  switch (messageType) {
    case 0:
      return decodeCode(buf);
    case 1:
      return decodeUsername(buf);
    case 2:
      return decodeRatingNewBeer(buf);
    case 3:
      return decodeRatingExistingBeer(buf);
    default:
      throw new Error(`Unhandled message type: ${messageType}`);
  }
}

export const Decoder = { decode };
