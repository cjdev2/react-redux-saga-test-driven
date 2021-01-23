import '@testing-library/jest-dom/extend-expect'
import {eventCouldHaveComeFromLabelInsteadOfElement} from './element-util';
import {clickedOnLabelAssociatedByHtmlFor, typicalMouseEvent, usedKeyboard} from '../test-util/mouse-event-test-util';

test('typical mouse event', async () => {
    expect(eventCouldHaveComeFromLabelInsteadOfElement(typicalMouseEvent)).toEqual(false)
})

test('clicked on label associated by htmlFor', async () => {
    expect(eventCouldHaveComeFromLabelInsteadOfElement(clickedOnLabelAssociatedByHtmlFor)).toEqual(true)
})

test('used keyboard', async () => {
    expect(eventCouldHaveComeFromLabelInsteadOfElement(usedKeyboard)).toEqual(false)
})
