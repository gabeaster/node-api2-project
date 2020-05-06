const express = require("express");

const postsRouter = require("./data/posts-router");

const server = express();
const port = 4000;

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.json({ query: req.query, params: req.params, headers: req.headers });
});
server.listen(port, () => {
  console.log("(**SERVER RUNNING AWAY**)");
});
