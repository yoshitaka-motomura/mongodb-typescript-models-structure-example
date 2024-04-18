import {
  Collection,
  Db,
  ObjectId,
  Filter,
  OptionalUnlessRequiredId,
  Document,
} from 'mongodb'

/**
 * Represents a base model interface.
 * @template T - The type of the model.
 */
interface BaseModel<T> {
  /**
   * Creates a new model instance.
   * @param data - The data for the model, excluding '_id', 'createdAt', and 'updatedAt' fields.
   * @returns A promise that resolves to the created model instance or `false` if creation fails.
   */
  create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T | boolean>

  /**
   * Finds a model instance by its ID.
   * @param id - The ID of the model instance to find.
   * @returns A promise that resolves to the found model instance or `null` if not found.
   */
  findById(id: string): Promise<T | null>

  /**
   * Fetches all model instances.
   * @returns A promise that resolves to an array of all model instances.
   */
  fetchAll(): Promise<T[]>
}

interface BaseModel<T> {
  create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T | boolean>
  findById(id: string): Promise<T | null>
  fetchAll(): Promise<T[]>
}

export type InsertData<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Date
  updatedAt: Date
}

/**
 * Abstract class representing an application model.
 * @template T - The type of the document.
 */
export abstract class AppModel<T extends Document> implements BaseModel<T> {
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
      const insertData: InsertData<T> = {
        ...data,
        createdAt: now,
        updatedAt: now,
      }

      const result = await this.collection.insertOne(
        insertData as unknown as OptionalUnlessRequiredId<T>,
      )
      return result.insertedId ? (insertData as unknown as T) : false
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
      const result = (await this.collection.findOne({
        _id: new ObjectId(id),
      } as Filter<T & Document>)) as T | null
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Fetches all documents from the collection.
   * @returns A promise that resolves to an array of documents or an empty array if an error occurred.
   */
  async fetchAll(): Promise<T[]> {
    const result = (await this.collection.find().toArray()) || []
    return result as T[]
  }
}
