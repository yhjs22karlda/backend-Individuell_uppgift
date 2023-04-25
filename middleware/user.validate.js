import Joi from 'joi'

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

export async function validateLoginInfo(req, res, next) {
    try{
        await loginSchema.validateAsync(req.body)
        next()
    }
    catch(err) {
        res.status(400).json({success: false, msg: err.details[0].message})
    }
}
