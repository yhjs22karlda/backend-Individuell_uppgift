import Datastore from 'nedb-promises'
import { v4 as uuidv4 } from 'uuid'

const notes = Datastore.create('databases/notes.db')

export function getAllUserNotes(userId) {
    return notes.find({userId}).sort({createdAt: -1})
}

export function getOneNote(noteId, userId) {
    return notes.findOne({ $and: [{id: noteId}, {userId}]})
}

export function addNoteToDatabase(title, text, userId) {
    const id = uuidv4()
    return notes.insert({
        userId,
        id,
        title,
        text,
        createdAt: new Date(),
        modifiedAt: new Date()
    })
}

export function changeNote(noteId, newTitle, newText) {
    return notes.update(
        {id: noteId},
        {$set: {
            title: newTitle,
            text: newText,
            modifiedAt: new Date()
            }
        })
}

export function deleteNoteId(noteId, userId) {
    return notes.remove({ $and: [{id: noteId}, {userId}]})
}
