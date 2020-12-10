const NotesService = require('../src/notes/notes-service')
const knex = require('knex')
const { expect } = require('chai')

describe(`Notes service object`, function() {
    let db
    let testNotes = [
        {
            name: 'First test post!',
            date_modified: '2019-01-03T00:00:00.000Z',
            folderid: 1,
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
            name: 'Second test post!',
            date_modified: '2019-01-03T00:00:00.000Z',
            folderid: 2,
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
            name: 'Third test post', 
            date_modified: '2019-01-03T00:00:00.000Z',
            folderid: 3, 
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        }
    ]


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('noteful_notes').truncate())

    before(() => {
        return db
            .into('noteful_notes')
            .insert(testNotes)
    })

    after(() => db.destroy())

    describe(`getAllNotes()`, () => {
        it(`resolves all notes from 'noteful_folders' table`, () => {
            return NotesService.getAllNotes(db)
                .then(actual => {
                    expect(actual).to.eql(testNotes)
                })
        })
    })
  })