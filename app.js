const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: "String",
  content: "String",
});
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    let article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save((err) => {
      if (!err) {
        res.send("Successfully added an article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });

app
  .route("/articles/:articlename")
  .get((req, res) => {
    Article.findOne({ title: req.params.articlename }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne({ title: req.params.articlename }, req.body, (err) => {
      if (!err) {
        res.send(
          `Successfully replaced the article on ${req.params.articlename}.`
        );
      } else {
        res.send(err);
      }
    });
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articlename }, req.body, (err) => {
      if (!err) {
        res.send(
          `Successfully updated the article on ${req.params.articlename}.`
        );
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articlename }, (err) => {
      if (!err) {
        res.send(
          `Sucessfully deleted the article on ${req.params.articlename}`
        );
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server has started");
});
