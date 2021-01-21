import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'

const invokeLater = (f, timeout) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(f()), timeout)
    });
}

const passTime = timeout => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout)
    });
}

test('async to sequence', async () => {
    // given
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

    // when
    const result = await asyncSequence(array)

    // then
    expect(result).toEqual(2)
})

test('timers', async () => {
    // given
    const invokeLater = (f, timeout) => {
        return new Promise(resolve => {
            setTimeout(() => resolve(f()), timeout)
        });
    }
    const aPromise = invokeLater(() => 2, 0)
    const bPromise = invokeLater(() => 3, 0)

    // when
    const a = await aPromise
    const b = await bPromise

    // then
    expect(a * b).toEqual(6)
})

test('wrap promise', async () => {
    // given
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

    // when
    const bar = wrap(foo)

    // then
    expect(await bar(1, 2, 3)).toEqual(123)
})

test('wait for something to happen', async () => {
    let somethingHappened = false
    const events = []
    const waitForMe = () => {
        somethingHappened = true
    }
    invokeLater(waitForMe, 25)
    while (!somethingHappened) {
        events.push('waiting')
        await passTime(10)
    }
    expect(somethingHappened).toBeTruthy()
    expect(events[0]).toEqual('waiting')
    expect(events[1]).toEqual('waiting')
})
