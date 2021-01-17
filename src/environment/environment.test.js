import '@testing-library/jest-dom/extend-expect'
import createEnvironment from "./environment";
import createFetchFunction from "../test-util/fetchFunction";

test('fetch text', async () => {
    // given
    const response = {uri: 'uri', response: 'content'}
    const responses = [response]
    const fetch = createFetchFunction(responses)
    const environment = createEnvironment({fetch})

    // when
    const actual = await environment.fetchText('uri')

    // then
    expect(actual).toEqual('content')
})

test('fetch text error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce('fetch error')
    const environment = createEnvironment({fetch})

    // when
    return expect(environment.fetchText('the-uri')).rejects.toThrow("Unable to fetch resource 'the-uri'")
})

test('fetch text with options error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce('fetch error')
    const environment = createEnvironment({fetch})

    // when
    return expect(environment.fetchText('uri', {method: 'POST'})).rejects.toThrow("Unable to fetch resource 'uri' with options {\"method\":\"POST\"}")
})

test('fetch json', async () => {
    // given
    const response = {uri: 'uri', response: JSON.stringify({a: 1})}
    const responses = [response]
    const fetch = createFetchFunction(responses)
    const environment = createEnvironment({fetch})

    // when
    const actual = await environment.fetchJson('uri')

    // then
    expect(actual).toEqual({a: 1})
})

test('fetch json parse error', async () => {
    // given
    const response = {uri: 'uri', response: "not valid json"}
    const responses = [response]
    const fetch = createFetchFunction(responses)
    const environment = createEnvironment({fetch})
    const expectedMessage = "Unable to parse response from resource 'uri' to json\nnot valid json"

    // then
    await expect(environment.fetchJson('uri')).rejects.toThrow(expectedMessage)
})

test('fetch json error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce('fetch error')
    const environment = createEnvironment({fetch})

    // when
    await expect(environment.fetchJson('uri')).rejects.toThrow("Unable to fetch resource 'uri'")
})

test('fetch json with options error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce('fetch error')
    const environment = createEnvironment({fetch})

    // when
    await expect(environment.fetchJson('uri', {method: 'POST'})).rejects.toThrow("Unable to fetch resource 'uri' with options {\"method\":\"POST\"}")
})
