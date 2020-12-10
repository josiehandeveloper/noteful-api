
const path = require('path')
const express = require('express')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
    .route('/')
    .get((req, res, next) => {
    NotesService.getAllNotes(
        req.app.get('db')
    )
        .then(notes => {
            res.json(notes)
        })
        .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { name, date_modified, folder_id, content} = req.body
        const newNote = { name, date_modified, folder_id, content }

        for(const [key, value] of Object.entries(newNote)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${notes.id}`))
                    .json(note)
            })
            .catch(next)
    })

notesRouter
    .route('/:notes_id')
    .all((req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist` }
                    })
                }
                res.json(note)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, date_modified, folder_id, content} = req.body
        const noteToUpdate = { name, date_modified, folder_id, content }

        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body most contain either 'name', 'date_modified', 'folder_id', 'content'`
                }
            })
        }
        
        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })  

module.exports = notesRouter