import React from 'react';
import {render} from '@testing-library/react';

class MyClassComponent extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

test('render class component', () => {
    const renderResult = render(<MyClassComponent name={'the-name'}/>)
    expect(renderResult.getByText('Hello, the-name')).toBeInTheDocument()

})

const MyFunctionalComponent = ({name}) => <h1>Hello, {name}</h1>

test('render functional component', () => {
    const renderResult = render(<MyFunctionalComponent name={'the-name'}/>)
    expect(renderResult.getByText('Hello, the-name')).toBeInTheDocument()
})

const FunctionalComponentWithChildren = ({children}) => <h1>hello {children} world</h1>

test('functional component with children', () => {
    const renderResult = render(<FunctionalComponentWithChildren>
        <div>child 1</div>
        <div>child 2</div>
    </FunctionalComponentWithChildren>)
    expect(renderResult.getByText('hello world')).toBeInTheDocument()
    expect(renderResult.getByText('child 1')).toBeInTheDocument()
    expect(renderResult.getByText('child 2')).toBeInTheDocument()
})
