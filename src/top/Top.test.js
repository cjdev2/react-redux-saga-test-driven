import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import createSample from "../test/sample";
import {render} from "@testing-library/react";
import Top from './Top'

test('contains profiles', async () => {
    // given
    const sample = createSample()
    const profiles = sample.profileArray(3)

    // when
    const rendered = render(<Top profiles={profiles}/>)

    // then
    expect(rendered.getByText('3 profiles')).toBeInTheDocument()
})
