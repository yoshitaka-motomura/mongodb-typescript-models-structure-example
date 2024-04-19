import { connection } from './database'
import { User } from './models/User'
const url = 'mongodb://localhost:27017'

;(async () => {
  const db = await connection(url)
  const userModel = new User(db)
  const r = await userModel.findById('66213e02209b99d473d966f2')

  // eslint-disable-next-line no-console
  console.log(r)
})()
