export type User = {
  id: number;
  name: string;
};

export type Beer = {
  id: number;
  name: string;
};

export type Rating = {
  user_id: number;
  beer_id: number;
  rating: number;
};

export type ServerMessage =
  | InitialServerMessage
  | CodeReqServerMessage
  | CodeAccServerMessage
  | UsernameReqServerMessage
  | UsernameAccServerMessage
  | RatingServerMessage;

export interface InitialServerMessage {
  messageType: 0;
  users: User[];
  beers: Beer[];
  ratings: Rating[];
}

export interface CodeReqServerMessage {
  messageType: 1;
}

export interface CodeAccServerMessage {
  messageType: 2;
}

export interface UsernameReqServerMessage {
  messageType: 3;
}

export interface UsernameAccServerMessage {
  messageType: 4;
}

export interface RatingServerMessage {
  messageType: 5;
  rating: number;
  beer_id: number;
  user_id: number;
  beer?: string;
  username?: string;
}

export type ClientMessage =
  | CodeClientMessage
  | UsernameClientMessage
  | RatingNewBeerClientMessage
  | RatingExistingBeerClientMessage;

export interface CodeClientMessage {
  messageType: 0;
  code: string;
}

export interface UsernameClientMessage {
  messageType: 1;
  code: string;
  username: string;
}

export interface RatingNewBeerClientMessage {
  messageType: 2;
  code: string;
  user_id: number;
  rating: number;
  beer: string;
}

export interface RatingExistingBeerClientMessage {
  messageType: 3;
  code: string;
  user_id: number;
  rating: number;
  beer_id: number;
}
