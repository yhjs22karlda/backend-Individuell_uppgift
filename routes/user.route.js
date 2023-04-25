import { Router } from 'express'
export const router = Router()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { addUserToDatabase, getUserWithUserId, getUserWithUserName } from '../model/user.model.js'
import { validateLoginInfo } from '../middleware/user.validate.js'
import { authJWT } from '../middleware/auth.js'

router.route("/signup")
    .post(validateLoginInfo, async (req, res) => {
        try {
            const user = await getUserWithUserName(req.body.username)
            if(user) {
                res.json({success: false, msg: "User already exists."})
            } else {
                await addUserToDatabase(req.body.username, req.body.password)
                res.status(201).json({success: true, msg: "User added."})
            }
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString() || "Unknown error."})
        }
    })

router.route("/login")
    .post(validateLoginInfo, async (req, res) => {
        try {
            const user = await getUserWithUserName(req.body.username)
            if(!user) return res.json({success: false, msg: "No user found."})
            const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password)
            if(passwordIsCorrect) {
                const token = jwt.sign({userId: user.userId}, 'TopSecretKeyStoredInDotEnv', {
                    expiresIn: 4000
                })
                res.json({success: true, token, msg: "Logged in."})
            } else {
                res.json({success:false, msg: "Wrong password!"})
            }
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString() || "Unknown error."})
        }
    })

router.route("/validatetoken")
    .get(authJWT, async (req, res) => {
        try {
            const user = await getUserWithUserId(req.userId)
            if(user) {
                res.json({success: true, msg: "Token valid.", username: user.username})
            } else {
                res.json({success: false, msg: "User not found in the database."})
            }
        } catch(err) {
            res.status(500).json({success: false, msg: err.toString() || "Unknown error."})
        }
    })
