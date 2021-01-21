import * as R from "ramda";

const ifThenElse = (condition, ifTrue, ifFalse) => {
    if (condition) return ifTrue
    else return ifFalse
}

const createFetchFunction = fetchSpecs => {
    let fetchSpecIndex = 0
    return async (resource, init) => {
        const thisFetchSpecIndex = fetchSpecIndex
        fetchSpecIndex++
        const fetchSpec = fetchSpecs[thisFetchSpecIndex]
        if (fetchSpec.errorMessage) throw Error(fetchSpec.errorMessage)
        const expectedResource = fetchSpec.uri
        const expectedInitMethod = ifThenElse(R.isNil(fetchSpec.method), {}, {method: fetchSpec.method})
        const expectedInitBody = ifThenElse(R.isNil(fetchSpec.requestText), {}, {body: fetchSpec.requestText})
        const mergedInit = R.mergeRight(expectedInitMethod, expectedInitBody)
        const expectedInit = ifThenElse(R.isEmpty(mergedInit), undefined, mergedInit)
        const matches = R.equals(resource, expectedResource) && R.equals(init, expectedInit)
        if (matches) {
            const fetchSpecResponseText = ifThenElse(R.isNil(fetchSpec.responseText), '', fetchSpec.responseText)
            const textPromise = Promise.resolve(fetchSpecResponseText)
            const responsePromise = Promise.resolve({
                text: () => textPromise
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
}

export default createFetchFunction
