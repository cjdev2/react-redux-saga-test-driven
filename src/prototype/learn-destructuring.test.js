import '@testing-library/jest-dom/extend-expect'

test('destructure array', () => {
    const a = [1, 2, 3]
    const [b, c] = a
    expect(b).toBe(1)
    expect(c).toBe(2)
})

test('destructure map', () => {
    const a = {b: 1, c: 2, d: 3}
    const {b, c} = a
    expect(b).toBe(1)
    expect(c).toBe(2)
})

test('create map', () => {
    const b = 2
    const c = 3
    const theMap = {a: 1, b: b, c}
    expect(theMap).toStrictEqual({a: 1, b: 2, c: 3})
})
