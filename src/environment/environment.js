const nopPromiseTracker = {
    trackPromise: p => p
}

const createEnvironment = (
    {
        fetch,
        history,
        window,
        promiseTracker = nopPromiseTracker
    }) => {
    const untrackedFetchText = async (resource, init) => {
        try {
            const response = await fetch(resource, init)
            return await response.text()
        } catch (error) {
            if (init) {
                throw Error(`Unable to fetch text from resource '${resource}' and custom settings ${JSON.stringify(init)}`)
            } else {
                throw Error(`Unable to fetch text from resource '${resource}'`)
            }
        }
    }
    const untrackedFetchJson = async (resource, init) => {
        const text = await untrackedFetchText(resource, init)
        try {
            return JSON.parse(text)
        } catch (error) {
            throw Error(`Unable to parse response from ${JSON.stringify({resource, init})} to json\n${text}`)
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
        window,
        fetchText,
        fetchJson
    }
}

export default createEnvironment
