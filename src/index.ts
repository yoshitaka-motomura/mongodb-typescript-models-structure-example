import { connection } from './database'
import { User } from './models/User'
const url = 'mongodb://localhost:27017'

;(async () => {
  const db = await connection(url)
  const user = new User(db.db)
  const session = db.client.startSession()
  session.startTransaction()
  const result = await user.create({
    username: 'test_user',
    email: 'test@example.com',
  })
  await session.commitTransaction()
  session.endSession()
})()
