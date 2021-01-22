import '@testing-library/jest-dom/extend-expect'

test('without async', () => {
    const createInFuture = x => Promise.resolve(x)
    const futureX = createInFuture(2)
    const futureY = createInFuture(3)
    const futureZ = futureX.then(x => futureY.then(y => x * y))
    futureZ.then(z => {
        expect(z).toEqual(6)
    })
})

test('with async', async () => {
    const createInFuture = async x => x
    const x = await createInFuture(2)
    const y = await createInFuture(3)
    const z = x * y
    expect(z).toEqual(6)
})
