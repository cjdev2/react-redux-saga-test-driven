import * as R from 'ramda'

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
            const text = await response.text()
            return text
        } catch (error) {
            const messageLines = []
            messageLines.push(`Unable to fetch resource '${resource}'`)
            if (init) {
                messageLines.push(`options = ${JSON.stringify(init)}`)
            }
            messageLines.push(`message = ${error.message}`)
            throw new Error(R.join('\n', messageLines))
        }
    }
    const untrackedFetchJson = async (resource, init) => {
        const text = await untrackedFetchText(resource, init)
        try {
            return JSON.parse(text)
        } catch (error) {
            const messageLines = []
            messageLines.push(`Unable to json from text '${text}'`)
            messageLines.push(`resource = ${resource}`)
            if (init) {
                messageLines.push(`options = ${JSON.stringify(init)}`)
            }
            messageLines.push(`message = ${error.message}`)
            throw new Error(R.join('\n', messageLines))
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
