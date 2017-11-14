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
  add: (db, playlists) => {
    return db.playlists.bulkPut(playlists)
  },
  findAll: (db) => {
    return db.playlists.toArray()
  },
  delete: (db, keys) => {
    return db.playlists.bulkDelete(keys)
  }
}
