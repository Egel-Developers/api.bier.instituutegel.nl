import type {
  CodeAccServerMessage,
  CodeReqServerMessage,
  InitialServerMessage,
  RatingServerMessage,
  ServerMessage,
  UsernameAccServerMessage,
  UsernameReqServerMessage,
} from "./types";

function encodeInitial(msg: InitialServerMessage) {
  return JSON.stringify(msg);
}

function encodeCodeReq(msg: CodeReqServerMessage) {
  return JSON.stringify(msg);
}

function encodeCodeAcc(msg: CodeAccServerMessage) {
  return JSON.stringify(msg);
}

function encodeUsernameReq(msg: UsernameReqServerMessage) {
  return JSON.stringify(msg);
}

function encodeUsernameAcc(msg: UsernameAccServerMessage) {
  return JSON.stringify(msg);
}

function encodeRating(msg: RatingServerMessage) {
  return JSON.stringify(msg);
}

function encode(msg: ServerMessage) {
  switch (msg.messageType) {
    case 0:
      return encodeInitial(msg);
    case 1:
      return encodeCodeReq(msg);
    case 2:
      return encodeCodeAcc(msg);
    case 3:
      return encodeUsernameReq(msg);
    case 4:
      return encodeUsernameAcc(msg);
    case 5:
      return encodeRating(msg);
    default:
      throw new Error(`Unhandled message type: ${msg}`);
  }
}

export const Encoder = { encode };
