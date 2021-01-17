const eventHappenedInBoundingRect = (event) => {
    const isInRange = (target, lower, upper) => target >= lower && target <= upper
    const boundingRect = event.target.getBoundingClientRect()
    const inXRange = isInRange(event.clientX, boundingRect.left, boundingRect.right)
    const inYRange = isInRange(event.clientY, boundingRect.top, boundingRect.bottom)
    return inXRange && inYRange
}

export {eventHappenedInBoundingRect}
