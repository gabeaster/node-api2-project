const express = require("express");
const router = express.Router();
router.use(express.json());
const Posts = require("./db");

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving data" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "I cannot find a post with that id." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "I am having some trouble getting this data." });
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: "I need a valid title and content please." });
  } else {
    //newpost code here
    Posts.insert(req.body).then((res) =>
      Posts.findById(res.id)
        .then((post) => {
          if (post) {
            res.status(200).json(post);
          } else {
            res
              .status(404)
              .json({ message: "I cannot find a post with that id." });
          }
        })
        .catch((err) => {
          console.log("could not save post", err);
          res.status(500).json({
            message: "I could not update the post list.",
          });
        })
    );
  }
});

module.exports = router;
