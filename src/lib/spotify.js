import SpotifyWebApi from 'spotify-web-api-js'

function getP (client, userId, playlists, offset) {
  return client.getUserPlaylists(userId, {limit: 50, offset: offset, fields: 'items(id,name,snapshot_id,owner.id),limit,next,offset'})
    .then(function (response) {
      if (response.next === null) {
        return playlists.concat(response.items)
      } else {
        return getP(client, userId, playlists.concat(response.items), response.offset + response.limit)
      }
    })
}

function getT (client, ownerId, playlistId, tracks, offset) {
  return client.getPlaylistTracks(ownerId, playlistId, {limit: 100, offset: offset, fields: 'items(added_at,track(album.name,artists.name,duration_ms,name)),limit,next,offset'}).then(response => {
    if (response.next === null) {
      return tracks.concat(response.items)
    } else {
      return getT(client, ownerId, playlistId, tracks.concat(response.items), response.offset + response.limit)
    }
  }).catch(response => {
    if (response.status === 429) {
      return new Promise((resolve, reject) => {
        window.setTimeout(_ => {
          getT(client, ownerId, playlistId, tracks, offset).then(
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

const createClient = async (token) => {
  const client = new SpotifyWebApi()
  client.setAccessToken(token)

  const { id: userId } = await client.getMe()

  console.debug('Spotify client initialized')

  return {
    playlists () {
      return getP(client, userId, [], 0)
    },
    tracks (ownerId, playlistId) {
      return getT(client, ownerId, playlistId, [], 0)
    }
  }
}

export default {
  createClient
}
