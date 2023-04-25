import jwt from 'jsonwebtoken'

export async function authJWT(req, res, next) {
    let token = ''
    if(req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '')
    }
    try {
        const data = jwt.verify(token, 'TopSecretKeyStoredInDotEnv')
        req.userId = data.userId
        next()
    } catch {
        res.status(401).json({success: false, msg: 'Invalid token!'})
    }

}
