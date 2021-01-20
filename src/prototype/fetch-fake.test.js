import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'

const invokeLater = (f, timeout) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(f()), timeout)
    });
}

const passTime = timeout => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout)
    });
}

const ifThenElse = (condition, ifTrue, ifFalse) => {
    if (condition) return ifTrue
    else return ifFalse
}

const createFetchFake = (fetchSpecs) => {
    let fetchSpecIndex = 0
    let trackedPromises = []
    let nextTrackedFetchesIndex = 0
    const trackedFetch = (resource, init) => {
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
                text: textPromise
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
    return {
        fetch: trackedFetch,
        waitForAllTrackedPromises,
        getTrackedPromises: () => trackedPromises
    }
}

test('fetch fake works with await', async () => {
    // given
    const fetchSpec1 = {
        uri: "uri-1",
        responseText: "response-text-1"
    }
    const fetchSpec2 = {
        uri: "uri-2",
        method: "POST",
        requestText: "request-body-2"
    }
    const fetchSpecs = [fetchSpec1, fetchSpec2]
    const {fetch} = createFetchFake(fetchSpecs)

    const monitor = []

    const useFetch1 = async () => {
        const response = await fetch('uri-1')
        const text = await response.text
        monitor.push(`fetch 1 completed with response '${text}'`)
    }

    const useFetch2 = async () => {
        await fetch('uri-2', {method: "POST", body: 'request-body-2'})
        monitor.push(`fetch 2 completed`)
    }

    // when
    await useFetch1()
    await useFetch2()

    // then
    expect(monitor).toEqual([
        "fetch 1 completed with response 'response-text-1'",
        'fetch 2 completed'
    ])
})

test('keep track of fetch fake promises', async () => {
    // given
    const fetchSpec1 = {
        uri: "uri-1",
        responseText: "response-text-1"
    }
    const fetchSpec2 = {
        uri: "uri-2",
        method: "POST",
        requestText: "request-body-2"
    }
    const fetchSpecs = [fetchSpec1, fetchSpec2]
    const {fetch, waitForAllTrackedPromises, getTrackedPromises} = createFetchFake(fetchSpecs)

    const monitor = []

    const useFetch1 = async () => {
        const response = await fetch('uri-1')
        const text = await response.text
        monitor.push(`fetch 1 completed with response '${text}'`)
    }

    const useFetch2 = async () => {
        await fetch('uri-2', {method: "POST", body: "request-body-2"})
        monitor.push(`fetch 2 completed`)
    }

    // when
    useFetch1()
    useFetch2()
    await waitForAllTrackedPromises()

    // then
    expect(monitor).toEqual([
        "fetch 1 completed with response 'response-text-1'",
        'fetch 2 completed'
    ])
})
