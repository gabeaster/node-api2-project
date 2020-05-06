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

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Posts.remove(id)
    .then((res) => {
      if (res === 1) {
        Posts.find().then((res2) => {
          res2.status(200).json(res2);
        });
      } else {
        res.status(404).json({ message: "I could not find the post that ID" });
      }
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: "I could not remove this post." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  Posts.findPostComments(id)
    .then((res) => {
      if (res) {
        res.status(200).json(res);
      } else {
        res
          .status(404)
          .json({ message: "I could not find comments with the ID provided." });
      }
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: "I could not retrieve the comments." });
    });
});

router.post("/:id/comments", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ message: "I will need text to add a comment." });
  } else {
    Posts.findById(req.params.id)
      .then((post) => {
        if (post) {
          // console.log(post[0].id)
          Posts.insertComment({
            text: req.body.text,
            post_id: post[0].id,
          })
            .then((res) => {
              console.log(res);
              Posts.findCommentById(res.id)
                .then((comment) => {
                  if (comment.length > 0) {
                    res.status(200).json(comment[0]);
                  } else {
                    res.status(404).json({
                      message: "I could not find a comment with that id",
                    });
                  }
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ message: "I could not retrieve the data", err });
                });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ message: "I could not post this comment", err });
            });
        } else {
          res
            .status(404)
            .json({ message: "I could not find a post with that id" });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "I could not retrieve that data.", err });
      });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "I need the title and contents for this post please.",
    });
  }
  Posts.update(id, req.body)
    .then((res) => {
      if (res === 1) {
        res.status(200).json(req.body);
      } else {
        res
          .status(404)
          .json({ message: "I could not find the post with that id." });
      }
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({ error: "I could not update this post." });
    });
});

module.exports = router;
