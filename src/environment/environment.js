const nopPromiseTracker = {
    trackPromise: p => p
}

const createEnvironment = (
    {
        fetch,
        history,
        promiseTracker = nopPromiseTracker
    }) => {
    const untrackedFetchText = async (resource, init) => {
        try {
            const response = await fetch(resource, init)
            return await response.text()
        } catch (error) {
            if (init) {
                throw Error(`Unable to fetch resource '${resource}' with options ${JSON.stringify(init)}`)
            } else {
                throw Error(`Unable to fetch resource '${resource}'`)
            }
        }
    }
    const untrackedFetchJson = async (resource, init) => {
        const text = await untrackedFetchText(resource, init)
        try {
            return JSON.parse(text)
        } catch (error) {
            throw Error(`Unable to parse response from resource '${resource}' to json\n${text}`)
        }
    }
    const trackPromise = f => {
        const tracked = (...theArguments) => {
            const promise = f(...theArguments)
            promiseTracker.trackPromise(promise)
            return promise
        }
        return tracked
    }

    const fetchText = trackPromise(untrackedFetchText)
    const fetchJson = trackPromise(untrackedFetchJson)

    return {
        fetch,
        history,
        fetchText,
        fetchJson
    }
}

export default createEnvironment
