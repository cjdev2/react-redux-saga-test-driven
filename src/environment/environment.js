import * as R from 'ramda'

const createEnvironment = (
    {
        fetch,
        history
    }) => {
    const fetchText = async (resource, init) => {
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
    const fetchJson = async (resource, init) => {
        const text = await fetchText(resource, init)
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

    return {
        history,
        fetchText,
        fetchJson
    }
}

export default createEnvironment
