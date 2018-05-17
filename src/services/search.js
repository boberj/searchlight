import Trie from '@/utils/trie'

const paths = [
  ['playlist', 'name'],
  ['track', 'name'],
  ['track', 'artists', 'name'],
  ['track', 'album', 'name']
]

/**
 * Assumes data in denormalized (Vue model) form
 * @param entries
 */
const createIndex = (entries) => {
  return Trie.create(paths, entries)
}

const find = (index, query) => {
  return Trie.find(index, query)
}

export default {
  createIndex,
  find
}
