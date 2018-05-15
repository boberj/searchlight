const copy = (variant, adt) => {
  variant.prototype.copy = function (properties = {}) {
    const existingProperties = Object.getOwnPropertyDescriptors(this)
    const updatedProperties = Object.getOwnPropertyDescriptors(properties)

    // Validate variant has updated properties
    Object.keys(updatedProperties).forEach(property => {
      if (!existingProperties[property]) {
        throw new Error(`Can't update unknown property '${property}' on ${variant.tag}`)
      }
    })

    return Object.create(
      variant.prototype,
      Object.assign(
        existingProperties,
        updatedProperties
      )
    )
  }
}

export default copy
