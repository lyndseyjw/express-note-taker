const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text ) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    const noteString = JSON.stringify(newNote);

    readAndAppend(noteString, './db/db.json');
    console.log(noteString)
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      for (let i = 0; i < json.length; i++) {
          const currentNote = json[i];
          if (currentNote.id === noteId) {
              res.status(200).json(`Note deleted`);
              return;
          }
      }
  res.status(404).json('Review ID not found');
});
});

module.exports = notes;