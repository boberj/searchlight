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
    await Playlist.addPlaylists(db, playlists)
    const ps = sortById(await Playlist.getPlaylists(db))
    expect(ps).to.deep.equal(playlists)
  })
})
