import * as R from 'ramda'
import Lunr from 'lunr'

/**
 * Assumes data in denormalized (Vue model) form
 * @param entries
 */
const createIndex = (entries) => Lunr(function () {
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
  }, this)
})

const find = (index, query) => {
  return index.search(query).map(R.prop('ref'))
}

export default {
  createIndex,
  find
}
