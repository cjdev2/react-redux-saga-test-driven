import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'

test('async to sequence', async () => {
    const a = async () => 1
    const b = async () => 2
    const array = [a, b]
    const asyncSequence = async array => {
        if (array.length === 0) {
            throw Error('array must not be empty')
        } else if (array.length === 1) {
            return await array[0]()
        } else {
            return await asyncSequence(R.drop(1, array))
        }
    }
    const result = await asyncSequence(array)
    expect(result).toEqual(2)
})

test('timers', async () => {
    const invokeLater = (f, timeout) => {
        return new Promise(resolve => {
            setTimeout(() => resolve(f()), timeout)
        });

    }
    const aPromise = invokeLater(() => 2, 0)
    const bPromise = invokeLater(() => 3, 0)
    const a = await aPromise
    const b = await bPromise
    expect(a * b).toEqual(6)
})

test('wrap promise', async () => {
    const foo = async (a, b, c) => {
        return a * 100 + b * 10 + c
    }
    const wrap = f => {
        const wrapped = (...theArguments) => {
            const result = f(...theArguments)
            return result
        }
        return wrapped
    }
    const bar = wrap(foo)
    expect(await bar(1, 2, 3)).toEqual(123)
})
