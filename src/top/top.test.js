import '@testing-library/jest-dom/extend-expect'
import {Top, reducer, saga, initializeEvents} from './top'

test('smoke test', async () => {
    expect(Top).toBeDefined()
    expect(reducer).toBeDefined()
    expect(saga).toBeDefined()
    expect(initializeEvents).toBeDefined()
})
