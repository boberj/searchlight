import * as Union from 'folktale/adt/union/union'

const Unfold = Union('Unfold', {
  Continue (value, next) {
    return { value, next }
  },
  Done (value) {
    return { value }
  },
  Fail (error) {
    return { error }
  },
  Retry (delayMs) {
    return { delayMs }
  }
})

const delay = (fn, delay) => new Promise((resolve, reject) => {
  setTimeout(() => fn().then(resolve, reject), delay)
})

const unfoldAsync = (onSuccess, onError) => fn => seed => {
  const doUnfold = (value, acc) => {
    return fn(value)
      .then(onSuccess, onError)
      .then(unfold => unfold.matchWith({
        Continue: ({ value, next }) => doUnfold(next, acc.concat(value)),
        Done: ({ value }) => acc.concat(value),
        Fail: ({ error }) => Promise.reject(error),
        Retry: ({ delayMs }) => delay(() => doUnfold(value, acc), delayMs)
      }))
  }

  return doUnfold(seed, [])
}

export {
  unfoldAsync,
  Unfold
}
