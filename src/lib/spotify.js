import SpotifyWebApi from 'spotify-web-api-js'
import { unfoldAsync, Unfold } from '@/utils/unfold'

const onSuccess = response => response.next
  ? Unfold.Continue(response.items, response.offset + response.limit)
  : Unfold.Done(response.items)

const shouldRetry = (response) => response && response.status === 429

const onError = error => shouldRetry(error)
  ? Unfold.Retry(3000)
  : Unfold.Fail(error)

const unfoldFn = unfoldAsync(onSuccess, onError)

const getUserPlaylists = (client, userId) => unfoldFn(offset => {
  return client.getUserPlaylists(
    userId,
    {
      limit: 50,
      offset: offset,
      fields: 'items(id,name,snapshot_id,owner.id),limit,next,offset'
    }
  )
})(0)

const getPlaylistTracks = (client, ownerId, playlistId) => unfoldFn(offset => {
  return client.getPlaylistTracks(
    ownerId,
    playlistId,
    {
      limit: 100,
      offset: offset,
      fields: 'items(added_at,track(album.name,artists.name,duration_ms,name)),limit,next,offset'
    }
  )
})(0)

const createClient = async (token) => {
  const client = new SpotifyWebApi()
  client.setAccessToken(token)

  const { id: userId } = await client.getMe()

  console.debug('Spotify client initialized')

  return {
    playlists () {
      return getUserPlaylists(client, userId)
    },
    tracks (ownerId, playlistId) {
      return getPlaylistTracks(client, ownerId, playlistId)
    }
  }
}

export default {
  createClient
}
