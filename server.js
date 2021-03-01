//Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

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

  let userNotes = JSON.stringify(req.body);
    console.log("Read userNotes: " + userNotes);
  let noteId = ((JSON.stringify(data).length));
  console.log("Read ID at: " + noteId);
  res.end;
});



//app.post('/api/notes', (req, res) => res.sendFile(path.join(__dirname, '/db/db.json')));
//Delete notes
//app.delete('/api/notes:id', (req, res) => res.sendFile(path.join(__dirname, '/db/db.json')));

// app.get('/api/notes', (req, res) => res.json(__dirname, '../db/db.js'));

// API requests
// app.post('/api/notes', (req, res) => {
//     const inputNotes = req.body;
//     fs.readFile('../db/db.json', (err, data) => {
//         if (err) throw err;
//         dbData = JSON.parse(data);
//         dbData.push(userNotes);
//         let count = 1;
//         dbData.forEach((note, index) => {
//             note.id = count;
//             count++;
//             return dbData;
//         });
//         console.log(dbData);
//         stringData = JSON.stringify(dbData);

//         fs.writeFile('../db/db.json', stringData, (err, data) => {
//             if (err) throw err;
//         });
//     });
//     res.send('Your note has been captured!');
// });

// delete note
// app.delete('/api/notes/:id', (req, res) => {
//     const deleteNote = req.params.id;
//     console.log(deleteNote);

//     fs.readFile('../db/db.json', (err, data) => {
//         if (err) throw err;

//         dbData = JSON.parse(data);
//         for (let i = 0; i < dbData.length; i++) {
//             if (dbData[i].id === Number(deleteNote)) {
//                 dbData.splice([i], 1);
//             }
//         }
//         console.log(dbData);
//         stringData = JSON.stringify(dbData);

//         fs.writeFile('../db/db.json', stringData, (err, data) => {
//             if (err) throw err;
//         });
//     });
//     res.status(204).send();
// });

//Start Server to listen
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
