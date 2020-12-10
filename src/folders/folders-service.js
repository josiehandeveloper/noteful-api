/**
 * FoldersService
 * getAll(knex)
 * getById(knex, id)
 *  knex.select('*').from('folders').where({id})
 * create(knex, newFolder)
 * update(knex, newFolder, id)
 * delete(knex, id)
*/




const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('folders')
    },
    getById(knex, id) {
        return knex.from('folders').select('*').where('id', id).first()
    },
    insertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteFolder(knex, id) {
        return knex('notes')
        .where({id})
        .delete()
    },
    updateFolder(knex, id, newFolderFields) {
        return knex('folders')
          .where({ id })
          .update(newFolderFields)
    },
}

module.exports = FoldersService