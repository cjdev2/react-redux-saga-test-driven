import * as R from 'ramda'

const invokeLater = (f, timeout) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(f()), timeout)
    });
}

const ifThenElse = (condition, ifTrue, ifFalse) => {
    if (condition) return ifTrue
    else return ifFalse
}

const createFetchFake = (fetchSpecs) => {
    const actualFetches = []
    let fetchSpecIndex = 0
    let trackedPromises = []
    let nextTrackedFetchesIndex = 0
    const trackedFetch = (resource, init) => {
        actualFetches.push({resource, init})
        const thisFetchSpecIndex = fetchSpecIndex
        fetchSpecIndex++
        const fetchSpec = fetchSpecs[thisFetchSpecIndex]
        const expectedResource = fetchSpec.uri
        const expectedInitMethod = ifThenElse(R.isNil(fetchSpec.method), {}, {method: fetchSpec.method})
        const expectedInitBody = ifThenElse(R.isNil(fetchSpec.requestText), {}, {body: fetchSpec.requestText})
        const mergedInit = R.mergeRight(expectedInitMethod, expectedInitBody)
        const expectedInit = ifThenElse(R.isEmpty(mergedInit), undefined, mergedInit)
        const matches = R.equals(resource, expectedResource) && R.equals(init, expectedInit)
        if (matches) {
            const fetchSpecResponseText = ifThenElse(R.isNil(fetchSpec.responseText), '', fetchSpec.responseText)
            const textPromise = invokeLater(() => fetchSpecResponseText, 1)
            trackedPromises.push({
                name: 'text',
                spec: fetchSpec,
                resource,
                init,
                index: nextTrackedFetchesIndex,
                promise: textPromise
            })
            const responsePromise = invokeLater(() => ({
                text: () => textPromise
            }), 1)
            trackedPromises.push({
                name: 'response',
                spec: fetchSpec,
                resource,
                init,
                index: nextTrackedFetchesIndex,
                promise: responsePromise
            })
            return responsePromise
        } else {
            const messageLines = []
            messageLines.push(`Fetch expectation at index ${thisFetchSpecIndex} did not match`)
            messageLines.push(`expected resource = ${fetchSpec.uri}`)
            messageLines.push(`actual   resource = ${resource}`)
            messageLines.push(`expected init     = ${JSON.stringify(expectedInit)}`)
            messageLines.push(`actual   init     = ${JSON.stringify(init)}`)
            throw Error(R.join('\n', messageLines))
        }
    }
    const waitForAllTrackedPromises = () => {
        const promises = R.map(R.prop('promise'), trackedPromises)
        trackedPromises = []
        return Promise.all(promises)
    }
    const getTrackedPromises = () => trackedPromises
    const getPromiseCount = () => nextTrackedFetchesIndex
    const getActualFetches = () => actualFetches
    const waitForFetches = (timeout = 1) => {
        if (actualFetches.length === fetchSpecs.length) {
            return Promise.resolve()
        } else if (timeout > 1000) {
            throw Error(`Waiting fetch to be invoked ${fetchSpecs.length} times, only invoked ${actualFetches.length} times`)
        } else {
            return invokeLater(waitForFetches, timeout * 2)
        }
    }
    return {
        fetch: trackedFetch,
        waitForAllTrackedPromises,
        getTrackedPromises,
        getPromiseCount,
        getActualFetches,
        waitForFetches
    }
}

export default createFetchFake
