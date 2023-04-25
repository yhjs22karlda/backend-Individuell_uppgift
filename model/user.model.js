import Datastore from 'nedb-promises'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const users = Datastore.create('databases/users.db')

export function addUserToDatabase(username, password) {
    const userId = uuidv4()
    const hashedPassword = bcrypt.hashSync(password, 12)
    return users.insert({
        username,
        userId,
        password: hashedPassword,
        createdAt: new Date()})
}

export function getUserWithUserName(username) {
    return users.findOne({username})
}

export function getUserWithUserId(userId) {
    return users.findOne({userId})
}
