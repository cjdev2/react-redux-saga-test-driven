import '@testing-library/jest-dom/extend-expect'

test('simple generator', () => {
    const myGenerator = function* () {
        yield 1
        yield 2
        yield 3
    }
    const iterator = myGenerator()
    expect(iterator.next()).toEqual({done: false, value: 1})
    expect(iterator.next()).toEqual({done: false, value: 2})
    expect(iterator.next()).toEqual({done: false, value: 3})
    expect(iterator.next()).toEqual({done: true})
})

test('yield array', () => {
    const myGenerator = function* () {
        yield* [1, 2, 3]
    }
    const iterator = myGenerator()
    expect(iterator.next()).toEqual({done: false, value: 1})
    expect(iterator.next()).toEqual({done: false, value: 2})
    expect(iterator.next()).toEqual({done: false, value: 3})
    expect(iterator.next()).toEqual({done: true})
})

test('send data back to generator', () => {
    const myGenerator = function* () {
        const a = yield 'first yield'
        const b = yield 'second yield knows about ' + a
        return yield 'third yield knows about ' + b
    }
    const iterator = myGenerator()
    expect(iterator.next('first parameter not used')).toEqual({done: false, value: 'first yield'})
    expect(iterator.next('second parameter')).toEqual({done: false, value: 'second yield knows about second parameter'})
    expect(iterator.next('third parameter')).toEqual({done: false, value: 'third yield knows about third parameter'})
    expect(iterator.next('fourth parameter')).toEqual({done: true, value: 'fourth parameter'})
    expect(iterator.next('fifth parameter')).toEqual({done: true})
})
