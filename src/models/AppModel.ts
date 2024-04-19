import {
  Collection,
  Db,
  ObjectId,
  Filter,
  OptionalUnlessRequiredId,
  Document,
  WithId,
  MatchKeysAndValues,
} from 'mongodb'
import { BaseModelInterface } from './interface'

/**
 * Abstract class representing an application model.
 * @template T - The type of the document.
 */
export abstract class AppModel<T extends Document>
  implements BaseModelInterface<T>
{
  protected collection: Collection<T & Document>
  /**
   * Constructs a new instance of the AppModel class.
   * @param db - The database connection.
   * @param collectionName - The name of the collection.
   */
  constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T & Document>(collectionName)
  }

  /**
   * Creates a new document in the collection.
   * @param data - The data for the new document.
   * @returns A promise that resolves to the created document or false if an error occurred.
   */
  async create(
    data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<T | boolean> {
    try {
      const now = new Date()
      const insertData: OptionalUnlessRequiredId<T> = {
        ...data,
        createdAt: now,
        updatedAt: now,
      } as unknown as OptionalUnlessRequiredId<T>

      const result = await this.collection.insertOne(insertData)
      return result.acknowledged ? (insertData as T) : false
    } catch (error) {
      return false
    }
  }

  /**
   * Finds a document in the collection by its ID.
   * @param id - The ID of the document.
   * @returns A promise that resolves to the found document or null if not found or an error occurred.
   */
  async findById(id: string): Promise<T | null> {
    try {
      const filter: Filter<T & Document> = { _id: new ObjectId(id) } as Filter<
        T & Document
      >
      const result = await this.collection.findOne(filter)
      return result as T | null
    } catch (error) {
      return null
    }
  }

  /**
   * Fetches all documents from the collection.
   * @returns A promise that resolves to an array of documents or an empty array if an error occurred.
   */
  async fetchAll(): Promise<T[]> {
    const result = await this.collection.find().toArray()
    return result as T[]
  }

  /**
   * Updates a document in the collection.
   *
   * @param id - The ID of the document to update.
   * @param data - The data to update the document with.
   * @param upsert - Optional. If set to true, creates a new document if no document matches the ID. Defaults to false.
   * @returns A promise that resolves to a boolean indicating whether the update was successful.
   */
  async update(
    id: string,
    data: Partial<Omit<T, '_id' | 'updatedAt' | 'createdAt'>>,
    upsert: boolean = false,
  ): Promise<boolean> {
    try {
      const now = new Date()
      const updateData: Partial<Omit<T, '_id' | 'updatedAt' | 'createdAt'>> & {
        updatedAt: Date
      } = {
        ...data,
        updatedAt: now,
      }

      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) as WithId<T & Document>['_id'] },
        { $set: updateData as unknown as MatchKeysAndValues<T & Document> },
        { upsert: upsert },
      )
      if (upsert && result.upsertedCount) return true
      return !!result.modifiedCount
    } catch (error) {
      return false
    }
  }

  /**
   * Deletes a document from the collection.
   * @param id - The ID of the document to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({
        _id: new ObjectId(id),
      } as Filter<T & Document>)
      return result.acknowledged ? !!result.deletedCount : false
    } catch (error) {
      return false
    }
  }

  /**
   * Deletes all documents from the collection.
   * @returns A promise that resolves to a boolean indicating whether the operation was successful.
   */
  async destroy(): Promise<boolean> {
    const result = await this.collection.deleteMany({})
    return result.acknowledged ? !!result.deletedCount : false
  }
}
