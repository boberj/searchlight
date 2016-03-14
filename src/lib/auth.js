import Url from 'url'
import Lockr from 'lockr'

// const Maybe = Monet.Maybe

function parseHash (hash) {
  return hash
    .substring(1)
    .split('&')
    .map(function (param) { return param.split('=') })
    .reduce(function (params, param) {
      params[param[0]] = decodeURIComponent(param[1])
      return params
    }, {})
}

function authenticateUrl () {
  return Url.format({
    protocol: 'https',
    host: 'accounts.spotify.com',
    pathname: '/authorize',
    query: {
      client_id: '8ff22b4d074b418b9a20d935f59e0373',
      response_type: 'token',
      redirect_uri: SPOTIFY_REDIRECT_URL,
      // TODO state:
      scope: 'playlist-read-private playlist-read-collaborative user-library-read'
    }
  })
}

function hasHash (hash) {
  return !!hash
}

function getSession () {
  var session

  if (hasHash(window.location.hash)) {
    session = parseHash(window.location.hash)['access_token']
    session.expires_at = Date.now().getTime() + session.expires_in
    saveSession(session)
  }

  if (session == null) {
    session = getSessionFromStore()
  }

  return isValid(session) ? session : null
}

function saveSession (session) {
  Lockr.set('session', session)
}

function getSessionFromStore () {
  return Lockr.get('session')
}

function isValid (session) {
  return session.expires_at > Date.now().getTime()
}

export default {
  authenticate () {
    window.location = authenticateUrl()
  },
  loggedIn () { return getSession() != null },
  getSession: getSession
}
