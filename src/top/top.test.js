import '@testing-library/jest-dom/extend-expect'
import {initializeEvents, reducer, saga, Top} from './top'

test('smoke test', async () => {
    expect(Top).toBeDefined()
    expect(reducer).toBeDefined()
    expect(saga).toBeDefined()
    expect(initializeEvents).toBeDefined()
})
