const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('notes')
    },
    getById(knex, id) {
        return knex.from('notes').select('*').where('id', id).first()
    },
    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteNote(knex, id) {
        return knex('notes')
        .where({id})
        .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks')
          .where({ id })
          .update(newBookmarkFields)
    },
}

module.exports = NotesService