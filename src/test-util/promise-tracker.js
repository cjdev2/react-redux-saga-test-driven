const createPromiseTracker = () => {
    const promises = []
    const trackPromise = p => {
        promises.push(p)
        return p
    }
    const waitForPromises = () => {
        const compositePromise = Promise.all(promises)
        promises.splice(0, promises.length)
        return compositePromise
    }
    const waitForAllPromises = async () => {
        const result = await waitForPromises()
        if (promises.length !== 0) {
            return await waitForAllPromises()
        } else {
            return result
        }
    }
    return {
        trackPromise,
        waitForPromises,
        waitForAllPromises
    }
}

export default createPromiseTracker
