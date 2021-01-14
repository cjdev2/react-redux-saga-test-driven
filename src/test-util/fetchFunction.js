import * as R from "ramda";

const createFetchFunction = responses => {
    return async (uri, options) => {
        const responseMatches = response =>
            R.equals(uri, response.uri) && R.equals(options, response.options)
        const responseElement = R.find(responseMatches, responses)
        if (R.isNil(responseElement)) throw Error(`No response defined for uri '${uri}' and options ${JSON.stringify(options)}`)
        const text = async () => responseElement.response
        return {
            text
        }
    }
}

export default createFetchFunction
