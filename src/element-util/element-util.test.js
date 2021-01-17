import '@testing-library/jest-dom/extend-expect'
import {eventHappenedInBoundingRect} from "./element-util";

test('event happened in bounding rect', async () => {
    // when
    const event = {
        clientX: 552,
        clientY: 11,
        target: {
            getBoundingClientRect: () => ({
                left: 511.7578125,
                right: 564.078125,
                top: 0,
                bottom: 21.5
            })
        }
    }

    // then
    expect(eventHappenedInBoundingRect(event)).toEqual(true)
})

test('event happened outside bounding rect', async () => {
    // when
    const event = {
        clientX: 477,
        clientY: 11,
        target: {
            getBoundingClientRect: () => ({
                left: 511.7578125,
                right: 564.078125,
                top: 0,
                bottom: 21.5
            })
        }
    }

    // then
    expect(eventHappenedInBoundingRect(event)).toEqual(false)
})
