import '@testing-library/jest-dom/extend-expect'

test('learn spies', () => {
    const myFunction = jest.fn()
    myFunction.mockReturnValueOnce(4);
    myFunction.mockReturnValueOnce(5);
    expect(myFunction(1)).toBe(4);
    expect(myFunction(2, 3)).toBe(5);
    expect(myFunction()).toBe(undefined);
    expect(myFunction.mock.calls).toEqual([[1], [2, 3], []])
})
