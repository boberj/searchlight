import * as R from 'ramda'
import Playlist from '../repositories/playlist'

/**
 * Adds new playlists to the database
 * Updates outdated ones
 * Deletes no longer existing ones
 *
 * @param db
 * @param spotify
 * @param progressCallback
 * @returns {Promise.<void>}
 */
const syncPlaylists = async (db, spotify, progressCallback) => {
  console.log('Syncing')

  const [currentPlaylists, dbPlaylists] = await Promise.all([
    spotify.playlists(),
    Playlist.findAll(db)
  ])

  const playlistsToAdd = getPlaylistsToAdd(currentPlaylists, dbPlaylists)
  const playlistsToDelete = getPlaylistsToDelete(currentPlaylists, dbPlaylists)

  console.log(`Adding/updating ${playlistsToAdd.length} playlists`)
  console.log(`Deleting ${playlistsToDelete.length} playlists`)

  for (let i = 0; i < playlistsToAdd.length; i++) {
    const playlist = playlistsToAdd[i]
    console.log(`Adding playlist ${playlist.name} ${playlist.id}`)
    const tracks = await spotify.tracks(playlist.owner.id, playlist.id)
    const playlistWithTracks = R.assoc('tracks', tracks, playlist)
    await Playlist.add(db, [playlistWithTracks])
    progressCallback((i + 1) / playlistsToAdd.length)
  }

  await Playlist.delete(db, R.map(R.prop('id'), playlistsToDelete))
}

/**
 * Finds any playlist that only exists in the new list or the snapshot ids don't match
 *
 * @param currentPlaylists
 * @param oldPlaylists
 */
const getPlaylistsToAdd = (currentPlaylists, oldPlaylists) => {
  const oldPlaylistsById = R.indexBy(R.prop('id'), oldPlaylists)
  const inOldPlaylist = (playlist) => oldPlaylistsById[playlist.id] !== undefined
  const snapshotIdDiffers = (playlist) => oldPlaylistsById[playlist.id].snapshot_id !== playlist.snapshot_id

  return R.filter(
    (playlist) => !inOldPlaylist(playlist) || snapshotIdDiffers(playlist),
    currentPlaylists
  )
}

/**
 * Finds any playlist that only exists in the old list
 *
 * @param currentPlaylists
 * @param oldPlaylists
 */
const getPlaylistsToDelete = (currentPlaylists, oldPlaylists) => {
  const currentPlaylistsById = R.indexBy(R.prop('id'), currentPlaylists)
  const inCurrentPlaylist = (playlist) => currentPlaylistsById[playlist.id] !== undefined

  return R.filter(
    (playlist) => !inCurrentPlaylist(playlist),
    oldPlaylists
  )
}

export default {
  syncPlaylists,
  getPlaylistsToAdd,
  getPlaylistsToDelete
}
