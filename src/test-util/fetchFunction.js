import * as R from "ramda";

const createFetchFunction = fetchEvents => {
    return async (uri, options) => {
        const matchesUriAndOptions = fetchEvent =>
            R.equals(uri, fetchEvent.uri) && R.equals(options, fetchEvent.options)
        const fetchEvent = R.find(matchesUriAndOptions, fetchEvents)
        if (R.isNil(fetchEvent)) throw Error(`No fetch event defined for uri '${uri}' and options ${JSON.stringify(options)}`)
        const text = async () => fetchEvent.response
        return {
            text
        }
    }
}

export default createFetchFunction
