import http from "http";
import { Socket } from "net";
import { decode, encode, getHanshakeHeaders } from "./ws";
import rawData from "./data.json";
import crypto from "crypto";

const PORT = 8081;

const server = http.createServer();
const clients: Record<string, Socket> = {};
// @ts-ignore
const movies = JSON.parse(rawData);

type Movie = {
  id: number;
  title: string;
  description: string;
  type: string;
  image: string;
  rating: string;
  genre: string;
  year: number;
  language: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

server.on("upgrade", async (request: any, socket: Socket) => {
  if (clients[request.headers["sec-websocket-key"]]) {
    return;
  }

  const { "sec-websocket-key": secWebKey } = request.headers;
  const headers = getHanshakeHeaders(secWebKey);

  // complete the handshake
  socket.write(headers);
  clients[secWebKey] = socket;

  socket.on("data", async (data) => {
    const decoded = decode(data);
    const parsedObj = JSON.parse(decoded.data);
    const movie = movies.find((item: Movie) => item.id === parsedObj.id);

    const result = await fetch(movie.image)
      .then((res) => res.blob())
      .then(async (blob) => Buffer.from(await blob.arrayBuffer()))
      .then((buffer) => {
        const sha = crypto.createHash("sha1").update(buffer).digest("base64");
        return sha;
      });

    // when hash is null it will print red as they do not match, as soon hash is on the frontend
    // when is turned on it will print green, I decided to keep this as it will demo
    // both cases red and green, I could've easily added a check to only print on non null value of hash from client
    if (parsedObj.hash !== result) {
      // Print in red
      console.log("\x1b[31m%s\x1b[0m", {
        id: movie.id,
        hash: result,
        image: movie.image,
      });
    } else {
      // print in green
      console.log("\x1b[32m%s\x1b[0m", {
        id: movie.id,
        hash: result,
        image: movie.image,
      });
    }
  });

  // once connection is established, start sending data
  while (true) {
    for (const item of movies) {
      await sleep(2000);
      socket.write(encode({ id: item.id, image: item.image }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
