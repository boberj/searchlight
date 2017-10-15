import Dexie from 'dexie'

export default {
  createDb: () => {
    const db = new Dexie('searchlight')

    db.version(1).stores({
      playlists: 'id'
    })

    return db
  },
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

x Define playlist store
Fetch playlists and store in db
Load from db and display
Fetch tracks and store in db
Load from db and display

Create unit tests with fake db

Define classes?
 */
