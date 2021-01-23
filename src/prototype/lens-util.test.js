import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'
import {lensPathWithDefault} from '../compose-util/compose-connected';

test('lens with default getter', () => {
    // given
    const theState = {a: {b: {c: 123}}}
    const originalLens = R.lensPath(['a', 'b', 'c'])
    const lensWithDefault = (theLens, theDefault) => {
        const getter = R.pipe(R.view(theLens), R.defaultTo(theDefault))
        const setter = R.set(theLens)
        return R.lens(getter, setter)
    }
    // when
    const theLensWithDefault = lensWithDefault(originalLens, 456)

    // then
    expect(R.view(theLensWithDefault, theState)).toEqual(123)
    expect(R.view(theLensWithDefault, {})).toEqual(456)
})

test('effective state', () => {
    // given
    const model = {
        stringValue: lensPathWithDefault(['prototype', 'stringValue'], 'abc'),
        numberValue: lensPathWithDefault(['prototype', 'numberValue'], 123)
    }

    // when
    const effectiveStateFor = (model, state) => {
        const accumulateState = (accumulator, lens) => {
            const value = R.view(lens, state)
            const newAccumulator = R.set(lens, value, accumulator)
            return newAccumulator
        }
        return R.reduce(accumulateState, {}, R.values(model))
    }

    // then
    expect(effectiveStateFor(model, {})).toEqual({prototype: {stringValue: 'abc', numberValue: 123}})
    expect(effectiveStateFor(model, {prototype: {stringValue: 'def'}})).toEqual({
        prototype: {
            stringValue: 'def',
            numberValue: 123
        }
    })
    expect(effectiveStateFor(model, {prototype: {numberValue: 456}})).toEqual({
        prototype: {
            stringValue: 'abc',
            numberValue: 456
        }
    })
    expect(effectiveStateFor(model, {
        prototype: {
            stringValue: 'def',
            numberValue: 456
        }
    })).toEqual({prototype: {stringValue: 'def', numberValue: 456}})
})
