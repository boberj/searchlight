import Dexie from 'dexie'

export default {
  createDb: () => {
    const db = new Dexie('searchlight')

    db.version(1).stores({
      playlists: 'id'
    })

    return db
  }
}
