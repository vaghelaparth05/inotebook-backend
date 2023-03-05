const express = require("express");
const router = express.Router();
const notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middlewares/fetchuser");

// Fetching all the notes, login required
router.get("/getnotes", fetchUser, async (req, res) => {
  try {
    user = req.user;
    const allNotes = await notes.find({ user: req.user.id });
    res.json(allNotes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

// Adding new note using post, login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title should be atleast 3 characters long").isLength({
      min: 3,
    }),
    body(
      "description",
      "Description should be atleast 5 characters long."
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    // returning errors when found.
    const noteTitle = req.body.title;
    const noteDescription = req.body.description;
    const noteTags = req.body.tag;
    console.log(noteTitle, noteDescription, noteTags);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newNote = new notes({
        title: noteTitle,
        description: noteDescription,
        tags: noteTags,
        user: req.user.id,
      });
      const savedNote = await newNote.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong!!!");
    }
  }
);

// Updating an existing note
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const noteId = req.params.id;
    console.log(req.body);

    let updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tags) {
      updatedNote.tags = tags;
    }

    // Find if the note to be updated exists and check if it exists
    let receivedNote = await notes.findById(noteId);
    if (!receivedNote) {
      return res.status(400).send("Not found");
    }

    // Check if the note belongs to the correct user or not.
    if (receivedNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    console.log(req.params.id, "..............");

    updatedNote = await notes.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

// Deleting an existing note
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    const noteId = req.params.id;
    // Find if the note to be deleted exists and check if it exists
    let receivedNote = await notes.findById(noteId);
    if (!receivedNote) {
      return res.status(400).send("Not found");
    }

    // Check if the note belongs to the correct user or not.
    if (receivedNote.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    deletedNote = await notes.findByIdAndDelete(req.params.id);
    res.json(deletedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong!!!");
  }
});

module.exports = router;
