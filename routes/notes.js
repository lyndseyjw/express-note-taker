const notes = require('express').Router();
// const savedNotes = require('./db/db.json');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    console.log(newNote)
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:id', (req, res) => {
    if (req.body && req.params.id) {
        console.info(`${req.method} request received to delete a note`);
        const noteId = req.params.id;
        readFromFile('./db/db.json').then((data) => {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                const currentNote = data[i];
                if (currentNote.id === noteId) {
                    res.status(200).json(`Note deleted`);
                    return;
                }
            }
        //     res.json(data)});
        res.status(404).json('Review ID not found');
    });
    }
  });

module.exports = notes;