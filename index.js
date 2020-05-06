const express = require("express");
const server = express();
const port = 4000;
server.use(express.json());
server.get("/", (req, res) => {
  res.send("Express says HEYYYY");
});

server.listen(port, () => {
  console.log("(**SERVER RUNNING AWAY**)");
});
