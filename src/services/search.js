import * as R from 'ramda'
import Lunr from 'lunr'
import Worker from '@/services/search.worker'

/**
 * Assumes data in denormalized (Vue model) form
 * @param entries
 * @param progressCallback function Function that takes one parameter
 */
const createIndex = (entries, progressCallback) => new Promise((resolve, reject) => {
  const worker = new Worker()

  worker.onmessage = (event) => {
    const { progress, index } = event.data

    if (progress) {
      progressCallback(progress)
    } else if (index) {
      resolve(Lunr.Index.load(JSON.parse(index)))
    }
  }

  worker.onerror = (error) => { reject(error) }

  worker.postMessage(entries)
})

const find = (index, query) => {
  return index.search(query).map(R.prop('ref'))
}

export default {
  createIndex,
  find
}
