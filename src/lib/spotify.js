import SpotifyWebApi from 'spotify-web-api-js'

function getP (playlists, offset) {
  return client.getUserPlaylists(userId, {limit: 50, offset: offset, fields: 'items(id,name,snapshot_id,owner.id),limit,next,offset'})
    .then(function (response) {
      if (response.next === null) {
        return playlists.concat(response.items)
      } else {
        return getP(playlists.concat(response.items), response.offset + response.limit)
      }
    })
}

function getT (ownerId, playlistId, tracks, offset) {
  return client.getPlaylistTracks(ownerId, playlistId, {limit: 100, offset: offset, fields: 'items(added_at,track(album.name,artists.name,duration_ms,name)),limit,next,offset'}).then(response => {
    if (response.next === null) {
      return tracks.concat(response.items)
    } else {
      return getT(ownerId, playlistId, tracks.concat(response.items), response.offset + response.limit)
    }
  }).catch(response => {
    if (response.status === 429) {
      return new Promise((resolve, reject) => {
        window.setTimeout(_ => {
          getT(ownerId, playlistId, tracks, offset).then(
            success => resolve(success),
            error => reject(error)
          )
        }, 3000)
      })
    }

    console.error('Failed to load playlist ' + playlistId + '. Returning partial results.')

    return tracks
  })
}

var client
var userId

export default {
  init (token) {
    client = new SpotifyWebApi()
    client.setAccessToken(token)
    client.getMe()
      .then(response => { userId = response.id })
      .then(console.debug('Spotify client initialized'))
  },
  playlists () {
    return getP([], 0)
  },
  tracks (ownerId, playlistId) {
    return getT(ownerId, playlistId, [], 0)
  }
}
