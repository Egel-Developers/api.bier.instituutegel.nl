import { DB } from "./db/init";
import type { Data } from "./types";

const CODE = process.env.CODE!;

DB.init();

const server = Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      let data_: Data;
      try {
        data_ = JSON.parse(message as string);
        if (data_.code !== CODE) throw "nuh uh";
        ws.send("juh uh");

        try {
          if (data_.name === "") throw "name up";
          ws.send("name down");
        } catch {
          ws.send("name up");
        }
      } catch {
        ws.send("nuh uh");
      }
    }, // a message is received
    open(ws) {
      console.log("open!");
    }, // a socket is opened
    close(ws, code, message) {
      console.log("close!");
    }, // a socket is closed
  },
});

console.log(`Listening on port ${server.port}...`);
