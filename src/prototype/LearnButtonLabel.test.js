import React from 'react';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {act} from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

const LearnButtonLabel = ({onClick}) => {
    const id = 'the-id'
    const text = 'the-text'
    return <div>
        <label htmlFor={id}>{text}</label>
        <button onClick={onClick} id={id}>delete</button>
    </div>
}

test('learn button label', async () => {
    let rendered;
    let clickCount = 0
    const onClick = jest.fn().mockImplementation(() => clickCount++)
    await act(async () => {
        rendered = render(<LearnButtonLabel onClick={onClick}/>)
        const theButton = rendered.getByLabelText('the-text')
        userEvent.click(theButton)
    })
    expect(clickCount).toEqual(1)
});
