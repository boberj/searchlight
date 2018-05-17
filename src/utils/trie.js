import * as R from 'ramda'

function Node () {
  this.values = []
  this.children = {}
}

const create = (paths, entries) => {
  const trie = new Node()

  entries.forEach(entry => {
    paths.forEach(path => {
      const values = getValues(entry, 0, path)
      R.chain(splitAndCleanup, values).forEach(value => {
        insert(value, entry, 0, trie)
      })
    })
  })

  return trie
}

/**
 * Finds a value in an object structure by following the given path.
 * If any step of the path is an array all values will be collected.
 *
 * @param {*} obj Object to walk
 * @param {*} i Current step in the walk
 * @param {*} path Path to follow
 * @returns {Array<String>} List of found values
 */
const getValues = (obj, i, path) => {
  let value = obj

  while (i < path.length) {
    value = value[path[i]]
    i++

    if (value instanceof Array) {
      return R.chain(val => getValues(val, i, path), value)
    }
  }

  return [value]
}

const insert = (word, value, i, root) => {
  if (word.length === 0) {
    return
  }

  const node = getLocation(word[i], root)

  if (word.length - 1 === i) {
    node.values.push(value)
  } else {
    insert(word, value, i + 1, node)
  }
}

const getLocation = (letter, node) => {
  let child = node.children[letter]

  if (!child) {
    child = new Node()
    node.children[letter] = child
  }

  return child
}

const find = (root, phrase) => {
  const results = R.map(doFind(root), splitAndCleanup(phrase))

  const mergedResults = R.reduce(intersection, new Set(R.head(results)), R.tail(results))

  return toArray(mergedResults)
}

const doFind = root => prefix => {
  // Find start node
  let node = root
  let i = 0
  while (node && i < prefix.length) {
    node = node.children[prefix[i]]
    i++
  }

  // For performance
  const results = []
  const collect = ({ values, children }) => {
    values.forEach(value => results.push(value))

    for (let key in children) {
      collect(children[key])
    }
  }

  if (node) {
    collect(node)
  }

  return results
}

const intersection = (set, list) => {
  const result = new Set()

  // Can't optimize by swapping list and set if list > set since converting the list to Set is O(n)

  for (let item of list) {
    if (set.has(item)) {
      result.add(item)
    }
  }

  return result
}

const splitAndCleanup = R.pipe(R.trim, R.toLower, R.split(/\s+/))

const toArray = set => {
  const array = []

  set.forEach(value => array.push(value))

  return array
}

export default {
  create,
  find
}
