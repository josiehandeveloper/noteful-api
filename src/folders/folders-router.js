/**
 * Folders Router
 * /api/folders
 * folderRoulter.route('/').get((req,res)=>res.json(FolderService.getAll()))
 * GET - gets all folders
 * POST - creates a new folder
 * 
 * /api/folders/:id
 * GET - gets one folder
 * PUT - update a folder
 * DELETE - delete a folder
 */

const path = require('path')
const express = require('express')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter 
    .route('/')
    .get((req, res, next) => {
    FoldersService.getAllFolders(
        req.app.get('db')
    )
        .then(folders => {
            res.json(folders)
        })
        .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newFolder = { name }

        for(const [key, value] of Object.entries(newFolder)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(folder)
            })
            .catch(next)
    })

foldersRouter 
    .route('/:folders_id')
    .all((req, res, next) => {
    FoldersService.getById(
        req.app.get('db'),
        req.params.folder_id
    )
        .then(folder => {
            if (!folder) {
                return res.status(404).json({
                    error: { message: `Folder doesn't exist` }
                })
            }
            res.json(folder)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body
        const folderToUpdate = { name }

        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body most contain 'name'`
                }
            })
        }
        
        NotesService.updateNote(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = foldersRouter