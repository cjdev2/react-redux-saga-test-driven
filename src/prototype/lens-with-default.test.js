import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'

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

