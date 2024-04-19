/**
 * Represents a base model interface.
 * @template T - The type of the model.
 */
export interface BaseModelInterface<T> {
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

  /* The `update` method in the `AppModel` class is used to update a document in the collection based
  on the provided ID. Here is a breakdown of its parameters and functionality: */
  update(id: string, data: T, upsert: boolean): Promise<boolean>

  /* The `delete(id: string): Promise<boolean>` method in the `BaseModelInterface` interface is used to
  delete a model instance from the data source based on the provided ID. It takes the ID of the
  model instance to be deleted as a parameter and returns a promise that resolves to a boolean value
  indicating whether the deletion was successful (`true`) or not (`false`). */
  delete(id: string): Promise<boolean>

  /* The `destroy(): Promise<boolean>` method in the `BaseModelInterface` interface is used to
  permanently delete all model instances from the data source. When called, this method will remove
  all records associated with the model, essentially clearing the data storage of all instances. The
  method returns a promise that resolves to a boolean value indicating whether the operation was
  successful (`true`) or not (`false`). */
  destroy(): Promise<boolean>
}

export type InsertDataType<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Date
  updatedAt: Date
}
