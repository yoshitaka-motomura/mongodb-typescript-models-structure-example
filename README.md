# Mongodb with typescript Models Structure Example
[![Node.js Unit Tests](https://github.com/yoshitaka-motomura/mongodb-typescript-models-structure-example/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/yoshitaka-motomura/mongodb-typescript-models-structure-example/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/yoshitaka-motomura/mongodb-typescript-models-structure-example/badge.svg?branch=main)](https://coveralls.io/github/yoshitaka-motomura/mongodb-typescript-models-structure-example?branch=main)

> [!CAUTION]
> In conclusion, it is better to use `Prisma` if you are going to use it in pplication development.

## Description
This repository is a sample of the structure of defining a mongodb model in typescript.
The module used is `node-mongodb-native`.

## Documentation
[Docs](https://yoshitaka-motomura.github.io/mongodb-typescript-models-structure-example/)

---
### References
- [node-mongodb-native](https://mongodb.github.io/node-mongodb-native/4.0/)
- [jest](https://jestjs.io/docs/getting-started)
- [typescript](https://www.typescriptlang.org/docs/)
- [mongodb](https://docs.mongodb.com/)


## Features
- [x] create <br>
  Create a new document in the collection.
- [x] findById <br>
  Find a document by ObjectId
- [x] fetchAll <br>
  Fetch all documents in the collection.
- [x] delete <br>
  Delete a document by ObjectId
- [x] destroy <br>
  Delete all documents in the collection.
- [x] update <br>
  Update a document by ObjectId

## requirements
- nodejs
- npm
- mongodb
- jest
- typescript
- node-mongodb-native

## Usage
```typescript
// E.g User.ts
import { AppModel } from './AppModel'

export interface IUser {
  _id?: ObjectId
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

/**
* As is often the case with ORMs, if the collection name is defined in the 
* singular, it is used for the usrs collection.
* E.g. User -> users
**/
export class User extends AppModel<IUser> {
  constructor(db: Db) {
    super(db)
  }
}

// If you want to use a collection with a different name than the model name,
// define a `static collectionName` property in the model.

export class User extends AppModel<IUser> {
  static collectionName = 'members'
  constructor(db: Db) {
    super(db)
  }
}


// E.g main.ts

import { Db, MongoClient } from 'mongodb'

export async function connection(url: string): Promise<Db> {
  const client = await MongoClient.connect(url)
  const db = client.db('example')
  return db
}

const db = await connection('mongodb_url')
const user = new User(db)
const users = await user.fetchAll() // get all users
```

## Tests
```bash
$ npm test
// watch mode
$ npm run test:watch
```