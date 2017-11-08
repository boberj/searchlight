import * as R from 'ramda'
import Lunr from 'lunr'

/**
 * Report every 500 entries
 * @param index
 */
const shouldReport = (index) => index % 500 === 0

/**
 * Assumes data in denormalized (Vue model) form
 * @param entries
 */
const createIndex = (entries, progressCallback) => Lunr(function () {
  this.ref('index')
  this.field('playlist')
  this.field('track')
  this.field('album')
  this.field('artist')

  entries.forEach(function (entry, index) {
    this.add({
      index,
      playlist: entry.playlist.name,
      track: entry.track.name,
      album: entry.track.album.name,
      artist: entry.track.artists.map(R.prop('name'))
    })

    if (shouldReport(index)) {
      progressCallback((index + 1) / entries.length)
    }
  }, this)
})

const postProgress = (progress) => postMessage({ progress })

onmessage = (event) => {
  // Serialize index using JSON.stringify so it can be sent using postMessage
  const index = JSON.stringify(createIndex(event.data, postProgress))
  postMessage({ index })
  close()
}
