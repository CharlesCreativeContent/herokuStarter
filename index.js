const express = require("express");
const cors = require("cors");
const server = express();
const PORT = process.env.PORT || 8080;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(__dirname + "/public"));

const MongoClient = require("mongodb").MongoClient;
ObjectId = require("mongodb").ObjectId;
const localDb = "mongodb://127.0.0.1:27017/twitter";
const atlasURL =
  "mongodb+srv://Shawn_charles:a90db52b@cluster0.ctxg1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "twitter";
let db;

server.listen(PORT, () => console.log(`server listening on PORT: ${PORT}`));

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home/index.html");
});
server.get("/:user", (req, res) => {
  res.sendFile(__dirname + `/public/home/${req.params.user}.html`);
});

MongoClient.connect(atlasURL, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);

    console.log(`Connected MongoDB: ${atlasURL}`);
    console.log(`Database: ${dbName}`);

    const quotesCollection = db.collection("quotes");

    const twitterCollection = db.collection("TwitterUsers");

    const userCollection = db.collection("userInfo");

    server.get("/user/:user", (req, res) => {
      twitterCollection
        .find()
        .toArray()
        .then((result) => {
          res.send(result);
        });
    });

    server.post("/quotes", (req, res) => {
      console.log("form submitted");
      console.log(req.body);

      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.status(200).json({ status: "success" });
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    });

    server.post("/add", async (req, res) => {
      let urlFound = await twitterCollection
        .find({ url: req.body.url })
        .count();
      if (urlFound === 0) {
        if (req.body.followers.length > 2) {
          twitterCollection
            .findOneAndReplace(
              { url: req.body.url },
              {
                url: req.body.url,
                name: req.body.name,
                img: req.body.img,
                followers: req.body.followers,
                active: Date.now(),
                human: "true",
                following: [],
              },
              { upsert: true }
            )
            .then((result) => {
              res.status(200).json({ status: "success" });
            })
            .catch((error) => {
              console.error(error);
              res.send(error);
            });
        } else {
          res.status(200).json({ status: "Not Enough Followers" });
        }
      } else {
        twitterCollection
          .findOneAndUpdate(
            { url: req.body.url },
            {
              $set: {
                followers: req.body.followers,
                active: Date.now(),
              },
            }
          )
          .then((result) => {
            res.status(200).json({ status: "updated the followers" });
          })
          .catch((error) => {
            console.error(error);
            res.send(error);
          });
      }
    });

    server.post("/remove", (req, res) => {
      twitterCollection
        .findOneAndDelete({ url: req.body.url })
        .then((result) => {
          console.log("Deleted Document");
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });

      userCollection
        .insertOne({
          url: req.body.url,
          name: req.body.name,
          img: req.body.img,
          followers: req.body.followers,
          active: Date.now(),
          human: req.body.human,
          following: [],
        })
        .then((result) => {
          res.status(200).json({ status: "Deleted Document" });
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    });

    server.get("/students", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((result) => {
          res.send(result);
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));
