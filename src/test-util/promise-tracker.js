const createPromiseTracker = () => {
    const promises = []
    const trackPromise = (caption, p) => {
        promises.push(p)
        return p
    }
    const waitForPromises = () => {
        const compositePromise = Promise.all(promises)
        promises.splice(0, promises.length)
        return compositePromise
    }
    const waitForAllPromises = async () => {
        while (promises.length !== 0) {
            await waitForPromises()
        }
    }
    const attachTracking = (caption, f) => (...theArguments) => {
        const promise = f(...theArguments)
        trackPromise(caption, promise)
        return promise
    }

    return {
        trackPromise,
        attachTracking,
        waitForPromises,
        waitForAllPromises
    }
}

export default createPromiseTracker
