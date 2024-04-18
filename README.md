# Mongodb with typescript Models Structure Example
[![Node.js Unit Tests](https://github.com/yoshitaka-motomura/mongodb-typescript-models-structure-example/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/yoshitaka-motomura/mongodb-typescript-models-structure-example/actions/workflows/test.yml)

## Description
This repository is a sample of the structure of defining a mongodb model in typescript.
The module used is `node-mongodb-native`.

## Features
- [x] create <br>
  Create a new document in the collection.
- [x] findById <br>
  Find a document by ObjectId
- [x] fetchAll <br>
  Fetch all documents in the collection.
- [ ] delete <br>
  Delete a document by ObjectId
- [ ] deleteAll <br>
  Delete all documents in the collection.
- [ ] update <br>
  Update a document by ObjectId

## requirements
- nodejs
- npm
- mongodb
- jest
- typescript
- node-mongodb-native

## Installation
```bash
$ git clone
$ npm install
```

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

export class User extends AppModel<IUser> {
  constructor(db: Db) {
    super(db, 'users')
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