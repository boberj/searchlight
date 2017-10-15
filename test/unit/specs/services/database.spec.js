import Database from '@/services/database'
import * as R from 'ramda'
import response from '../../../fixtures/api/me/playlists'

const sortById = R.sortBy(R.prop('id'))
const db = Database.createDb()
const playlists = sortById(response.items)

describe('Database', () => {
  beforeEach(() => {
    return db.playlists.toCollection().delete()
  })

  it('should store and retrieve all given playlists', async () => {
    await Database.addPlaylists(db, playlists)
    const ps = sortById(await Database.getPlaylists(db))
    expect(ps).to.deep.equal(playlists)
  })
})
