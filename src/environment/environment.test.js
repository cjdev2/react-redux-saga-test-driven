import '@testing-library/jest-dom/extend-expect'
import createEnvironment from './environment';
import createFetchFake from '../test-util/fetch-fake';

const captureException = async f => {
    try {
        await f()
        throw Error('exception was expected to be thrown')
    } catch (error) {
        return error
    }
}

test('fetch text', async () => {
    // given
    const response = {uri: 'uri', responseText: 'content'}
    const responses = [response]
    const fetch = createFetchFake(responses)
    const environment = createEnvironment({fetch})

    // when
    const actual = await environment.fetchText('uri')

    // then
    expect(actual).toEqual('content')
})

test('fetch text error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce(Error('the-error'))
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchText('the-uri'))

    // then
    expect(exception.message).toContain('the-uri')
    expect(exception.message).toContain('the-error')
})

test('fetch text with options error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce(Error('the-error'))
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchText('the-uri', {method: 'POST'}))

    // then
    expect(exception.message).toContain('the-uri')
    expect(exception.message).toContain('the-error')
    expect(exception.message).toContain('POST')
})

test('fetch json', async () => {
    // given
    const response = {uri: 'uri', responseText: JSON.stringify({a: 1})}
    const responses = [response]
    const fetch = createFetchFake(responses)
    const environment = createEnvironment({fetch})

    // when
    const actual = await environment.fetchJson('uri')

    // then
    expect(actual).toEqual({a: 1})
})

test('fetch json parse error', async () => {
    // given
    const response = {uri: 'the-uri', responseText: 'not valid json'}
    const responses = [response]
    const fetch = createFetchFake(responses)
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchJson('the-uri'))

    // then
    expect(exception.message).toContain('not valid json')
    expect(exception.message).toContain('the-uri')
})

test('fetch json error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce(Error('the-error'))
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchJson('the-uri'))

    // then
    expect(exception.message).toContain('the-uri')
    expect(exception.message).toContain('the-error')
})

test('fetch json with options error', async () => {
    // given
    const fetch = jest.fn().mockRejectedValueOnce(Error('the-error'))
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchJson('the-uri', {method: 'POST'}))
    expect(exception.message).toContain('the-uri')
    expect(exception.message).toContain('the-error')
    expect(exception.message).toContain('POST')
})

test('fetch json parse error with options', async () => {
    // given
    const response = {uri: 'the-uri', method: 'POST', responseText: 'not valid json'}
    const responses = [response]
    const fetch = createFetchFake(responses)
    const environment = createEnvironment({fetch})

    // when
    const exception = await captureException(() => environment.fetchJson('the-uri', {method: 'POST'}))
    expect(exception.message).toContain('not valid json')
    expect(exception.message).toContain('the-uri')
    expect(exception.message).toContain('POST')
})
