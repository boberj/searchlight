import Database from '@/lib/database'
import Playlist from '@/repositories/playlist'
import Playlists from '@/services/playlists'
import * as R from 'ramda'
import response from '../../../fixtures/api/me/playlists'

const db = Database.createDb()
const playlists = response.items

describe('Playlists', () => {
  beforeEach(() => {
    return db.playlists.toCollection().delete()
  })

  describe('#getPlaylistsToAdd', () => {
    it('should find any playlist that doesn\'t exist in the database', async () => {
      // Given
      await Playlist.add(db, playlists)
      const newPlaylist = {
        id: '1',
        snapshot_id: '1'
      }
      const currentPlaylists = R.append(newPlaylist, playlists)

      // When
      const ps = Playlists.getPlaylistsToAdd(currentPlaylists, playlists)

      // Then
      expect(ps).to.deep.equal([newPlaylist])
    })

    it('should find any playlist where the snapshot ids don\'t match', async () => {
      // Given
      await Playlist.add(db, playlists)
      const setSnapshotIdToOne = R.set(R.lensProp('snapshot_id'), '1')
      const currentPlaylists = R.over(R.lensIndex(0), setSnapshotIdToOne, playlists)

      // When
      const ps = Playlists.getPlaylistsToAdd(currentPlaylists, playlists)

      // Then
      expect(ps).to.deep.equal([R.head(currentPlaylists)])
    })
  })

  describe('#getPlaylistsToDelete', () => {
    it('should delete any playlists that exist in the db but not in the current list', async () => {
      // Given
      await Playlist.add(db, playlists)
      const currentPlaylists = [R.head(playlists)]

      // When
      const ps = Playlists.getPlaylistsToDelete(currentPlaylists, playlists)

      // Then
      expect(ps).to.deep.equal(R.tail(playlists))
    })
  })
})
