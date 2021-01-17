const eventCouldHaveComeFromLabelInsteadOfElement = (event) => {
    if (event.screenX === 0 && event.screenY === 0) {
        // probably didn't come from mouse, more likely keyboard
        return false
    } else {
        // if mouse event didn't happen within the bounding rectangle, it might have come from the htmlFor element of a label
        const isInRange = (target, lower, upper) => target >= lower && target <= upper
        const boundingRect = event.target.getBoundingClientRect()
        const inXRange = isInRange(event.clientX, boundingRect.left, boundingRect.right)
        const inYRange = isInRange(event.clientY, boundingRect.top, boundingRect.bottom)
        const inRange = inXRange && inYRange
        return !inRange
    }
}

export {eventCouldHaveComeFromLabelInsteadOfElement}
