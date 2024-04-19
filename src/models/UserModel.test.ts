import { MongoClient, Db, ObjectId } from 'mongodb'
import { User, UserI } from './User'
import MockDate from 'mockdate'
describe('User Model', () => {
  let connection: MongoClient
  let db: Db
  beforeAll(async () => {
    MockDate.set(new Date('2024-04-18T00:00:00.000Z'))
    connection = await MongoClient.connect((global as any).__MONGO_URI__)
    db = await connection.db('example')
  })
  afterAll(async () => {
    await connection.close()
  })

  describe('create document', () => {
    it('should insert a doc into collection', async () => {
      //act
      const userModel = new User(db)
      const result = await userModel.create({
        username: 'test',
        email: 'test@example.com',
      })
      //assert
      expect(result).toMatchObject<UserI>({
        username: 'test',
        email: 'test@example.com',
        createdAt: new Date('2024-04-18T00:00:00.000Z'),
        updatedAt: new Date('2024-04-18T00:00:00.000Z'),
      })
    })
    it('should return false when an error occurs', async () => {
      // arrange
      const userModel = new User(db)
      jest
        .spyOn(userModel['collection'], 'insertOne')
        .mockRejectedValueOnce({ acknowledged: false })

      // act
      const result = await userModel.create({
        username: 'test_user',
        email: 'test@example.com',
      })

      // assert
      expect(result).toBe(false)
    })
    it('should return false when acknowledged is false', async () => {
      // arrange
      const userModel = new User(db)
      jest.spyOn(userModel['collection'], 'insertOne').mockResolvedValueOnce(
        Promise.resolve({
          acknowledged: false,
          insertedId: new ObjectId(),
          insertedCount: 0,
        }) as any,
      )

      // act
      const result = await userModel.create({
        username: 'test_user',
        email: 'test@example.com',
      })

      // assert
      expect(result).toBe(false)
    })
  })
  describe('collection update tests', () => {
    let documentId: string
    const item = {
      username: 'test',
      email: 'test@example.com',
    }
    beforeEach(async () => {
      const d = await db.collection('users').insertOne(item)
      if (!d.insertedId) throw new Error('documentId not found')
      documentId = d.insertedId.toString()
    })
    afterEach(async () => {
      await db.collection('users').deleteMany({})
    })
    it('should update a doc', async () => {
      //arrange
      const userModel = new User(db)
      const updateData = {
        username: 'test2',
        email: 'test2@example.com',
      }
      //act
      const result = await userModel.update(documentId, updateData)
      //assert
      expect(result).toBeTruthy()
    })
    it('should return false if doc not found', async () => {
      //arrange
      const userModel = new User(db)
      const updateData = {
        username: 'test2',
        email: '',
      }
      //act
      const result = await userModel.update(
        '66213e02209b99d473d966f2',
        updateData,
      )
      //assert
      expect(result).toBeFalsy()
    })

    it('should return false if error', async () => {
      //arrange
      const userModel = new User(db)
      const updateData = {
        username: 'test2',
        email: 'test111@example.com',
      }
      jest
        .spyOn(userModel['collection'], 'updateOne')
        .mockImplementationOnce(() => {
          return Promise.reject(new Error('mock error'))
        })
      //act
      const result = await userModel.update(documentId, updateData)
      //assert
      expect(result).toBeFalsy()
    })

    it('should upsert true insert a new doc', async () => {
      //arrange
      const userModel = new User(db)
      const updateData = {
        username: 'test2',
        email: 'aaaaaaa@aaaaaaa',
      }

      // upsert true upsertedCount = 1になるモック
      jest.spyOn(userModel['collection'], 'updateOne').mockResolvedValueOnce({
        upsertedCount: 1,
        modifiedCount: 0,
        acknowledged: true,
        matchedCount: 0,
        upsertedId: null, // Add the 'upsertedId' property with a value of null
      })

      //act
      const result = await userModel.update(documentId, updateData, true)
      //assert
      expect(result).toBeTruthy()
    })
  })
  describe('find tests', () => {
    let documentId: string
    beforeEach(async () => {
      const d = await db.collection('users').insertOne({
        username: 'test',
        email: 'test@example.com',
        createdAt: new Date('2024-04-18T00:00:00.000Z'),
        updatedAt: new Date('2024-04-18T00:00:00.000Z'),
      })
      if (!d.insertedId) throw new Error('documentId not found')
      documentId = d.insertedId.toString()
    })
    afterEach(async () => {
      await db.collection('users').deleteMany({})
    })
    it('should find a doc by id', async () => {
      //act
      const userModel = new User(db)
      const result = await userModel.findById(documentId)

      //assert
      expect(result?._id?.toString()).toBe(documentId)
    })
    it('should return null if doc not found', async () => {
      //act
      const userModel = new User(db)
      const result = await userModel.findById('66213e02209b99d473d966f2')

      //assert
      expect(result).toBeNull()
    })
    it('should return null if invalid id', async () => {
      //act
      const userModel = new User(db)
      const result = await userModel.fetchAll()

      //assert
      expect(result.length).toBe(1)
    })

    it('should findById return null if error', async () => {
      //arrange
      const userModel = new User(db)
      jest
        .spyOn(userModel['collection'], 'findOne')
        .mockImplementationOnce(() => {
          return Promise.reject(new Error('mock error'))
        })
      // act
      const result = await userModel.findById('abcdefg')

      //assert
      expect(result).toBeNull()
    })
  })
  describe('delete methods tests', () => {
    let documentId: string
    beforeEach(async () => {
      const d = await db.collection('users').insertOne({
        username: 'test',
        email: 'test@example',
      })
      if (!d.insertedId) throw new Error('documentId not found')
      documentId = d.insertedId.toString()
    })
    afterEach(async () => {
      await db.collection('users').deleteMany({})
    })

    it('should delete a doc', async () => {
      //arrange
      const userModel = new User(db)
      //act
      const result = await userModel.delete(documentId)
      //assert
      expect(result).toBeTruthy()
    })
    it('should return false if doc not found', async () => {
      //arrange
      const userModel = new User(db)
      //act
      const result = await userModel.delete('66213e02209b99d473d966f2')
      //assert
      expect(result).toBeFalsy()
    })
    it('should return false if error', async () => {
      //arrange
      const userModel = new User(db)
      jest
        .spyOn(userModel['collection'], 'deleteOne')
        .mockImplementationOnce(() => {
          return Promise.reject(new Error('mock error'))
        })
      //act
      const result = await userModel.delete(documentId)
      //assert
      expect(result).toBeFalsy()
    })
    it('should delete doc acknowledged false', async () => {
      //arrange
      const userModel = new User(db)
      jest
        .spyOn(userModel['collection'], 'deleteOne')
        .mockImplementationOnce(() =>
          Promise.resolve({ acknowledged: false, deletedCount: 0 }),
        )
      //act
      const result = await userModel.delete(documentId)
      //assert
      expect(result).toBeFalsy()
    })
    it('should destroy all docs', async () => {
      //arrange
      const userModel = new User(db)
      //act
      const result = await userModel.destroy()
      //assert
      expect(result).toBeTruthy()
    })
    it('should destroy all docs acknowledged false', async () => {
      //arrange
      const userModel = new User(db)
      jest
        .spyOn(userModel['collection'], 'deleteMany')
        .mockImplementationOnce(() =>
          Promise.resolve({ acknowledged: false, deletedCount: 0 }),
        )
      //act
      const result = await userModel.destroy()
      //assert
      expect(result).toBeFalsy()
    })
  })
})
