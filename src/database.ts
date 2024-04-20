import { Db, MongoClient } from 'mongodb'

export async function connection(url: string): Promise<{ db: Db; client: MongoClient }> {
  const client = await MongoClient.connect(url)
  const db = client.db('example')
  return { db, client }
}

export async function close(client: MongoClient): Promise<void> {
  client.close()
}
