//Dependencies
const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
//Useful for promises, saves a ton of time
const util = require("util");

const app = express();
const PORT = process.env.PORT || 3001;

//Data parsing
app.use(express.urlencoded({ extended: true }));
//line 12 is super useful
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public/")));

//Routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
//default set to index
//app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
// above works!

//shortcut for db path
const data = path.join(__dirname, "/db/db.json");
console.log("Read JSON file: " + data);

//Display notes
app.get("/api/notes", (req, res) => {
  res.sendFile(data);
});

app.get("/api/notes/:id", (req, res) => {
  res.sendFile(data[Number(req.params.id)]);
});
//Save notes (POST)
app.post("/api/notes", (req, res) => {
  let userNote = req.body;
  util
    .promisify(fs.readFile)(data, "utf8")
    .then((result, err) => {
      if (err) console.log(err);
      return Promise.resolve(JSON.parse(result));
    })
    .then((next) => {
      userNote.id = getIndex(next) + 1;
      data.length > 0 ? next.push(userNote) : (next = [userNote]);
      return Promise.resolve(next);
    })
    .then((next) => {
      util.promisify(fs.writeFile)(data, JSON.stringify(next));
      res.json(userNote);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

//Delete note api, buggy does not work quite yet.
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  util
    .promisify(fs.readFile)(data, "utf8")
    .then((result, err) => {
      if (err) console.err(err);
      return Promise.resolve(JSON.parse(result));
    })
    .then((next) => {
      next.splice(next.indexOf(next.find((element) => element.id == id)), 1);
      return Promise.resolve(next);
    })
    .then((next) => {
      util.promisify(fs.writeFile)(data, JSON.stringify(next));
      res.send("OK");
    })
    .catch((err) => {
      if (err) throw err;
    });
});

//For 404
app.use((req, res, next) => {
  res.status(404).send("Cannot Find");
});
//function to grab index of note
function getIndex(next) {
  if (next.length > 0) return next[next.length - 1].id;
  return 0;
}

//Start Server to listen
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
