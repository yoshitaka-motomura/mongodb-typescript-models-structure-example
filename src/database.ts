import { Db, MongoClient } from 'mongodb'

export async function connection(url: string): Promise<Db> {
  const client = await MongoClient.connect(url)
  const db = client.db('example')
  return db
}
