import * as R from "ramda";

const createFetchFunction = fetchEvents => {
    let index = 0
    return async (uri, options) => {
        const fetchEvent = fetchEvents[index]
        if (fetchEvent.errorMessage) throw Error(fetchEvent.errorMessage)
        if (R.equals(uri, fetchEvent.uri) && R.equals(options, fetchEvent.options)) {
            index++
            const text = async () => fetchEvent.response
            return {
                text
            }
        } else {
            const messageLines = []
            messageLines.push(`Fetch expectation at index ${index} did not match`)
            messageLines.push(`expected uri     = ${fetchEvent.uri}`)
            messageLines.push(`actual   uri     = ${uri}`)
            messageLines.push(`expected options = ${fetchEvent.options}`)
            messageLines.push(`actual   options = ${options}`)
            throw new Error(R.join('\n', messageLines))
        }
    }
}

export default createFetchFunction
