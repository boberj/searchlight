import Lockr from 'lockr'
import Maybe from 'folktale/maybe'
import * as R from 'ramda'
import Url from 'url'

const SESSION_KEY = 'session'

const decode = (value) => Maybe.fromNullable(value).map(decodeURIComponent).getOrElse(null)

const parseHash = (hash) => R.fromPairs(
  hash
  .substring(1)
  .split('&')
  .map((param) => param.split('=').map(decode))
)

const getSessionFromHash = (hash) => {
  const parsedHash = parseHash(hash)
  const accessToken = Maybe.fromNullable(parsedHash.access_token)
  const expiresAt = Maybe.fromNullable(parsedHash.expires_in)
    .map((sessionLength) => Date.now() + sessionLength * 1000)
  const toSession = (accessToken) => (expiresAt) => ({ accessToken, expiresAt })

  return Maybe.Just(toSession).ap(accessToken).ap(expiresAt)
}

const getSessionFromLocalStorage = () => Maybe.fromNullable(Lockr.get(SESSION_KEY))

const authenticateUrl = Url.format({
  protocol: 'https',
  host: 'accounts.spotify.com',
  pathname: '/authorize',
  query: {
    client_id: '8ff22b4d074b418b9a20d935f59e0373',
    response_type: 'token',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
    // TODO state:
    scope: 'playlist-read-private playlist-read-collaborative user-library-read'
  }
})

const getSession = (hash) =>
  getSessionFromHash(hash)
    .orElse(getSessionFromLocalStorage)
    .filter(isValid)

const saveSession = (session) => {
  Lockr.set(SESSION_KEY, session)
}

const isValid = (session) => session.expiresAt > Date.now()

export default {
  authenticateUrl,
  getSession,
  saveSession
}
