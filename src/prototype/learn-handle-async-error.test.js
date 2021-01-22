import React from "react";
import '@testing-library/jest-dom/extend-expect'

test('handle async error', async () => {
    const mySetError = jest.fn()
    const error = new Error('oops!')
    const myAsyncFunctionThatThrows = async () => {
        throw error
    }
    const handleAsyncError = setError => f => async () => {
        try {
            await f()
        } catch (e) {
            setError(e)
        }
    }
    const myAsyncFunction = handleAsyncError(mySetError)(myAsyncFunctionThatThrows)
    await myAsyncFunction()

    expect(mySetError.mock.calls).toEqual([[error]])
})
