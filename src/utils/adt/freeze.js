const freeze = (variant, adt) => {
  variant.prototype.freeze = function () {
    return Object.freeze(this)
  }
}

export default freeze
