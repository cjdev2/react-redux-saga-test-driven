import * as R from "ramda";

const createFetchFunction = fetchEvents => {
    let index = 0
    return async (uri, options) => {
        const fetchEvent = fetchEvents[index]
        if (R.equals(uri, fetchEvent.uri) && R.equals(options, fetchEvent.options)) {
            index++
            const text = async () => fetchEvent.response
            return {
                text
            }
        } else {
            throw Error(`For fetchEvent[${index}], expected ${JSON.stringify({
                uri: fetchEvent.uri,
                options: fetchEvent.options
            })}, got ${JSON.stringify({uri, options})}`)
        }
    }
}

export default createFetchFunction
