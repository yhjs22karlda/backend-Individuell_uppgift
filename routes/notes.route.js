import {Router} from 'express'
export const router = Router()
import {validateInput} from "../middleware/notes.validate.js"
import {addNoteToDatabase, changeNote, deleteNoteId, getAllUserNotes, getOneNote} from "../model/notes.model.js"
import {authJWT} from "../middleware/auth.js"


router.route("/")
    .get(authJWT, async (req, res) => {
        try {
            const notes = await getAllUserNotes(req.userId)
            notes.map(note => note._id = undefined)
            res.json({success: true, notes})
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString()})
        }
    })
    .post(validateInput, authJWT, async (req, res) => {
        try {
            await addNoteToDatabase(req.body.title, req.body.text, req.userId)
            res.json({success: true, msg: "Note added."})
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString()})
        }
    })
    .put(validateInput, authJWT, async (req, res) => {
        try {
            const note = await getOneNote(req.body.id, req.userId)
            if(!note) return res.json({success: false, msg: "No note found."})
            await changeNote(note.id, req.body.title, req.body.text)
            res.json({success: true, msg: "Note changed."})
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString()})
        }
    })

router.route("/del/:id")
    .delete(validateInput, authJWT, async (req, res) => {
        try {
            const notesRemoved = await deleteNoteId(req.params.id, req.userId)
            if(notesRemoved > 0) {
                res.json({success: true, msg: "Note removed."})
            } else {
                res.json({success: false, msg: "Nothing removed."})
            }
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString()})
        }
    })

router.route("/search")
    .get(validateInput, authJWT, async (req, res) => {
        try {
            const notes = await getAllUserNotes(req.userId)
            const searchString = req.query.searchstring.trim().toLowerCase()
            const fileredNotes = notes.filter(note => note.title.toLowerCase().includes(searchString))
            res.json({success: true, notes: fileredNotes})
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString()})
        }
    })
