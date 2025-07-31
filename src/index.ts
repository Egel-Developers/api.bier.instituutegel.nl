import { Beers } from "./db/beers";
import { DB } from "./db/init";
import { Ratings } from "./db/ratings";
import { Users } from "./db/users";
import { Decoder } from "./decoder";
import { Encoder } from "./encoder";

const CODE = process.env.CODE!;

DB.init();

const server = Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) return;
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    async message(ws, message) {
      const msg = Decoder.decode(message as unknown as ArrayBuffer);
      if (msg.code !== CODE) {
        ws.send(Encoder.encode({ messageType: 1 }));
        return;
      }

      switch (msg.messageType) {
        case 0: {
          ws.send(Encoder.encode({ messageType: 2 }));
          return;
        }
        case 1: {
          if (msg.username.length < 3 || msg.username.length > 32) {
            ws.send(Encoder.encode({ messageType: 3 }));
            return;
          }

          const user_id = await Users.add(msg.username);

          if (user_id === false) return;
          ws.send(Encoder.encode({ messageType: 4, user_id }));
          return;
        }
        case 2: {
          if (msg.rating < 0 || msg.rating > 100) return;

          const userStatus = await Users.getStatus(msg.user_id);
          if (userStatus === false) return;
          if (userStatus === "not_exists") {
            ws.send(Encoder.encode({ messageType: 3 }));
            return;
          }

          const beer_id = await Beers.add(msg.beer);
          if (beer_id === false) return;

          // const isNew = await Beers.isNew(beer_id);

          const res = await Ratings.add({
            user_id: msg.user_id,
            beer_id: beer_id,
            rating: msg.rating,
          });
          if (res === false) return;

          const username =
            userStatus === "has_ratings" ? undefined : userStatus.username;

          server.publish(
            "ranking",
            Encoder.encode({
              messageType: 5,
              rating: msg.rating,
              user_id: msg.user_id,
              beer_id,
              // beer: isNew ? msg.beer : undefined,
              beer: msg.beer,
              username,
            })
          );
          return;
        }
        case 3: {
          if (msg.rating < 0 || msg.rating > 100) return;

          const userStatus = await Users.getStatus(msg.user_id);
          if (userStatus === false) return;
          if (userStatus === "not_exists") {
            ws.send(Encoder.encode({ messageType: 3 }));
            return;
          }

          const res = await Ratings.add({
            user_id: msg.user_id,
            beer_id: msg.beer_id,
            rating: msg.rating,
          });
          if (res === false) return;

          const username =
            userStatus === "has_ratings" ? undefined : userStatus.username;

          server.publish(
            "ranking",
            Encoder.encode({
              messageType: 5,
              rating: msg.rating,
              user_id: msg.user_id,
              beer_id: msg.beer_id,
              username,
            })
          );
          return;
        }
      }

      // let data_: Data;
      // try {
      //   data_ = JSON.parse(message as string);
      //   if (data_.code !== CODE) throw "nuh uh";
      //   if (!data_.locked_in) ws.send("juh uh");

      //   try {
      //     if (data_.name === "") throw "name up";
      //     if (data_.name.length < 3 || data_.name.length > 32) {
      //       ws.send("wees geen snuif");
      //       return;
      //     }
      //     if (!data_.locked_in) ws.send("name down");

      //     if ("rating" in data_ && data_.rating !== undefined) {
      //       if (
      //         data_.rating.beer.length < 3 ||
      //         data_.rating.beer.length > 32 ||
      //         data_.rating.rating < 0 ||
      //         data_.rating.rating > 100
      //       ) {
      //         ws.send("wees geen snuif");
      //         return;
      //       }

      //       await Ratings.rate({
      //         username: data_.name,
      //         beer: data_.rating.beer,
      //         rating: data_.rating.rating,
      //       });

      //       const ranking = await Ratings.getAll();
      //       if (ranking === false) return;
      //       server.publish(
      //         "ranking",
      //         JSON.stringify({ type: "all", data: flattenRanking(ranking) })
      //       );
      //     }
      //   } catch {
      //     ws.send("name up");
      //   }
      // } catch {
      //   ws.send("nuh uh");
      // }
    }, // a message is received
    async open(ws) {
      console.log("open!");
      ws.subscribe("ranking");
      const users = await Users.getAll();
      if (users === false) return;
      const beers = await Beers.getAll();
      if (beers === false) return;
      const ratings = await Ratings.getAll();
      if (ratings === false) return;
      ws.send(Encoder.encode({ messageType: 0, users, beers, ratings }));
    }, // a socket is opened
    close(ws, code, message) {
      console.log("close!");
    }, // a socket is closed
  },
});

console.log(`Listening on port ${server.port}...`);
