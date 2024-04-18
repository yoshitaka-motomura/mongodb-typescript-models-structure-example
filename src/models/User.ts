import { Db, ObjectId } from 'mongodb'
import { AppModel } from './AppModel'

export interface UserI {
  _id?: ObjectId
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export const Schema = {
  bsonType: 'object',
  required: ['username', 'email'],
  properties: {
    username: {
      bsonType: 'string',
      description: 'must be a string and is required',
    },
    email: {
      bsonType: 'string',
      pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
      description: 'must be a string and is required',
    },
    createdAt: {
      bsonType: 'date',
      description: 'must be a date',
    },
    updatedAt: {
      bsonType: 'date',
      description: 'must be a date',
    },
  },
}

export class User extends AppModel<UserI> {
  constructor(db: Db) {
    super(db, 'users')
    //this.createIndex()
  }
  // TODO: Implement the createIndex method
  // private async createIndex(): Promise<void> {
  //   const indexExists = await this.collection.indexExists('email_1')
  //   if (!indexExists) {
  //     await this.collection.createIndex({ email: 1 }, { unique: true })
  //   }
  // }
}
