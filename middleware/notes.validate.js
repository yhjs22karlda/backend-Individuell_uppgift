import Joi from 'joi'

const postNoteSchema = Joi.object({
    title: Joi.string().max(50).required(),
    text: Joi.string().max(300).required(),
})

const deleteNoteSchema = Joi.object({
    id: Joi.string().required()
})

const changeNoteSchema = postNoteSchema.concat(deleteNoteSchema)

const searchTitleSchema = Joi.object({
    searchstring: Joi.string().required()
})

export async function validateInput(req, res, next) {
    let inObject = null
    let schema = null 
    switch(req.method) {
        case 'POST': 
            schema = postNoteSchema
            inObject = req.body
            break
        case 'PUT':
            schema = changeNoteSchema
            inObject = req.body
            break
        case 'DELETE':
            console.log('asdf')
            schema = deleteNoteSchema
            inObject = req.params
            break
        case 'GET':
            schema = searchTitleSchema
            inObject = req.query
            break
        default:
            console.log("Hit borde man inte komma.")
            throw new Error("Invalid path")
    }

    try{
        await schema.validateAsync(inObject)
        next()
    }
    catch(err) {
        res.status(400).json({success: false, msg: err.details[0].message})
    }
}
