import Database from '@/lib/database'
import Playlist from '@/repositories/playlist'
import * as R from 'ramda'
import response from '../../../fixtures/api/me/playlists'

const sortById = R.sortBy(R.prop('id'))
const db = Database.createDb()
const playlists = sortById(response.items)

describe('Playlist', () => {
  beforeEach(() => {
    return db.playlists.toCollection().delete()
  })

  it('should store and retrieve all given playlists', async () => {
    await Playlist.add(db, playlists)
    const ps = sortById(await Playlist.findAll(db))
    expect(ps).to.deep.equal(playlists)
  })
})
