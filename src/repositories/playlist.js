/*
Playlist {
  id
  name
  snapshot_id
  owner {
    id
  }
  tracks [{
    added_at
    track {
      album {
        name
      }
      artists [{
        name
      }]
      duration_ms
      name
    }
  }]
}
*/

export default {
  addPlaylist: (db, playlist) => {
    return db.playlists.put(playlist)
  },
  addPlaylists: (db, playlists) => {
    return db.playlists.bulkPut(playlists)
  },
  getPlaylist: (db, playlistId) => {
    return db.playlists.get(playlistId)
  },
  getPlaylists: (db) => {
    return db.playlists.toArray()
  },
  deletePlaylists: (db, keys) => {
    return db.playlists.bulkDelete(keys)
  },
  addTracks: (db, playlistId, tracks) => {
    return db.playlists.where(':id').equals(playlistId).modify((playlist) => {
      playlist.tracks = tracks
    })
  }
}
