const createEnvironment = ({fetch, history, window}) => {
    const fetchText = async (resource, init) => {
        try {
            const response = await fetch(resource, init)
            return await response.text()
        } catch (error) {
            if(init){
                throw Error(`Unable to fetch text from resource '${resource}' and custom settings ${JSON.stringify(init)}`)
            } else {
                throw Error(`Unable to fetch text from resource '${resource}'`)
            }
        }
    }
    const fetchJson = async (resource, init) => {
        const text = await fetchText(resource, init)
        try {
            return JSON.parse(text)
        } catch (error) {
            throw Error(`Unable to parse response from ${JSON.stringify({resource, init})} to json\n${text}`)
        }
    }
    return {
        fetch,
        history,
        window,
        fetchText,
        fetchJson
    }
}

export default createEnvironment
