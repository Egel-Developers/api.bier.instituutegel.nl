import { DB } from "./db/init";
import { Ratings } from "./db/ratings";
import { flattenRanking, type Data } from "./types";

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
      let data_: Data;
      try {
        data_ = JSON.parse(message as string);
        if (data_.code !== CODE) throw "nuh uh";
        if (!data_.locked_in) ws.send("juh uh");

        try {
          if (data_.name === "") throw "name up";
          if (!data_.locked_in) ws.send("name down");

          if ("rating" in data_ && data_.rating !== undefined) {
            await Ratings.rate({
              username: data_.name,
              beer: data_.rating.beer,
              rating: data_.rating.rating,
            });

            const ranking = await Ratings.getRanking();
            if (ranking === false) return;
            server.publish(
              "ranking",
              JSON.stringify({ type: "all", data: flattenRanking(ranking) })
            );
          }
        } catch {
          ws.send("name up");
        }
      } catch {
        ws.send("nuh uh");
      }
    }, // a message is received
    async open(ws) {
      console.log("open!");
      ws.subscribe("ranking");
      const ranking = await Ratings.getRanking();
      if (ranking === false) return;
      ws.send(JSON.stringify({ type: "all", data: flattenRanking(ranking) }));
    }, // a socket is opened
    close(ws, code, message) {
      console.log("close!");
    }, // a socket is closed
  },
});

console.log(`Listening on port ${server.port}...`);
