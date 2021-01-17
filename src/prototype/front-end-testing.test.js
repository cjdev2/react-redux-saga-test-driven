import '@testing-library/jest-dom/extend-expect'
import {applyMiddleware, createStore} from "redux";
import {connect, Provider} from 'react-redux'
import {fireEvent, render} from "@testing-library/react";
import * as R from 'ramda'
import userEvent from "@testing-library/user-event";
import createSagaMiddleware from "redux-saga";
import {put, takeEvery} from "redux-saga/effects";

test('react redux saga', () => {
    const LIST_VALUES_REQUEST = 'LIST_VALUES_REQUEST'
    const LIST_VALUES_SUCCESS = 'LIST_VALUES_SUCCESS'
    const ADD_VALUE_REQUEST = 'ADD_VALUE_REQUEST'
    const VALUE_TO_ADD_CHANGED = 'VALUE_TO_ADD_CHANGED'
    const fakeExternalStore = []
    const addToExternalStore = text => fakeExternalStore.push(text)
    const valueToAddLens = R.lensPath(['prototype', 'valueToAdd'])
    const valuesLens = R.lensPath(['prototype', 'values'])
    const mapStateToProps = (state) => ({
        values: R.view(valuesLens, state),
        valueToAdd: R.view(valueToAddLens, state)
    })
    const valueToAddChangedReducer = (state, event) => R.set(valueToAddLens, event.valueToAdd, state)
    const listValuesSuccessReducer = (state, event) => R.set(valuesLens, event.values, state)
    const mapDispatchToProps = (dispatch) => ({
        listValuesRequest: () => dispatch({type: LIST_VALUES_REQUEST}),
        listValuesSuccess: values => dispatch({type: LIST_VALUES_SUCCESS, values}),
        addValueRequest: valueToAdd => dispatch({type: ADD_VALUE_REQUEST, valueToAdd}),
        valueToAddChanged: valueToAdd => dispatch({type: VALUE_TO_ADD_CHANGED, valueToAdd})
    })
    const View = ({values, valueToAdd, valueToAddChanged, addValueRequest}) => {
        const onChange = event => {
            valueToAddChanged(event.target.value)
        }
        const onKeyUp = event => {
            if (event.key === 'Enter') {
                addValueRequest(valueToAdd)
            }
        }
        const renderSingleValue = ({index, value}) => <li key={index}>{value}</li>
        const indexedValues = R.addIndex(R.map)((value, index) => ({value, index}))(values)
        const renderedValues = R.map(renderSingleValue, indexedValues)
        return <div>
            <input value={valueToAdd}
                   autoFocus={true}
                   placeholder={'the placeholder'}
                   onChange={onChange}
                   onKeyUp={onKeyUp}/>
            <ul>{renderedValues}</ul>
        </div>
    }
    const Connected = connect(mapStateToProps, mapDispatchToProps)(View)
    const reducer = (state, event) => {
        if (event.type === LIST_VALUES_SUCCESS) {
            return listValuesSuccessReducer(state, event)
        } else if (event.type === VALUE_TO_ADD_CHANGED) {
            return valueToAddChangedReducer(state, event)
        } else {
            return state
        }
    }
    const initialState = R.pipe(
        R.set(valueToAddLens, ''),
        R.set(valuesLens, []))({})

    const events = []
    const monitor = store => next => event => {
        events.push(event)
        return next(event)
    }

    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, initialState, applyMiddleware(sagaMiddleware, monitor))
    const listValuesRequest = function* () {
        yield put({type: LIST_VALUES_SUCCESS, values: fakeExternalStore})
    }
    const addValueRequest = function* (event) {
        addToExternalStore(event.valueToAdd)
        yield put({type: VALUE_TO_ADD_CHANGED, valueToAdd: ''})
        yield put({type: LIST_VALUES_REQUEST})
    }
    const saga = function* () {
        yield takeEvery('LIST_VALUES_REQUEST', listValuesRequest)
        yield takeEvery('ADD_VALUE_REQUEST', addValueRequest)
    }
    sagaMiddleware.run(saga)
    const rendered = render(<Provider store={store}><Connected/></Provider>)
    const dataEntry = rendered.getByPlaceholderText('the placeholder')
    userEvent.type(dataEntry, "abc")
    fireEvent.keyUp(dataEntry, {key: 'Enter'})

    // test the view
    expect(rendered.getByText('abc')).toBeInTheDocument()

    // test the model
    expect(store.getState()).toEqual({prototype: {valueToAdd: '', values: ['abc']}})

    // test the events
    expect(events).toEqual([
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'a'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'ab'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'abc'},
        {type: 'ADD_VALUE_REQUEST', valueToAdd: 'abc'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: ''},
        {type: 'LIST_VALUES_REQUEST'},
        {type: 'LIST_VALUES_SUCCESS', values: ['abc']}
    ])
})

test('react redux saga async', async () => {
    const LIST_VALUES_REQUEST = 'LIST_VALUES_REQUEST'
    const LIST_VALUES_SUCCESS = 'LIST_VALUES_SUCCESS'
    const ADD_VALUE_REQUEST = 'ADD_VALUE_REQUEST'
    const VALUE_TO_ADD_CHANGED = 'VALUE_TO_ADD_CHANGED'
    const fakeExternalStore = []
    const addToExternalStore = text => {
        fakeExternalStore.push(text)
    }
    const addToExternalStoreAsync = async text => {
        return new Promise(resolve => setTimeout(() => resolve(addToExternalStore(text)), 0))
    }
    const valueToAddLens = R.lensPath(['prototype', 'valueToAdd'])
    const valuesLens = R.lensPath(['prototype', 'values'])
    const mapStateToProps = (state) => ({
        values: R.view(valuesLens, state),
        valueToAdd: R.view(valueToAddLens, state)
    })
    const valueToAddChangedReducer = (state, event) => R.set(valueToAddLens, event.valueToAdd, state)
    const listValuesSuccessReducer = (state, event) => R.set(valuesLens, event.values, state)
    const mapDispatchToProps = (dispatch) => ({
        listValuesRequest: () => dispatch({type: LIST_VALUES_REQUEST}),
        listValuesSuccess: values => dispatch({type: LIST_VALUES_SUCCESS, values}),
        addValueRequest: valueToAdd => dispatch({type: ADD_VALUE_REQUEST, valueToAdd}),
        valueToAddChanged: valueToAdd => dispatch({type: VALUE_TO_ADD_CHANGED, valueToAdd})
    })
    const View = ({values, valueToAdd, valueToAddChanged, addValueRequest}) => {
        const onChange = event => {
            valueToAddChanged(event.target.value)
        }
        const onKeyUp = event => {
            if (event.key === 'Enter') {
                addValueRequest(valueToAdd)
            }
        }
        const renderSingleValue = ({index, value}) => <li key={index}>{value}</li>
        const indexedValues = R.addIndex(R.map)((value, index) => ({value, index}))(values)
        const renderedValues = R.map(renderSingleValue, indexedValues)
        return <div>
            <input value={valueToAdd}
                   autoFocus={true}
                   placeholder={'the placeholder'}
                   onChange={onChange}
                   onKeyUp={onKeyUp}/>
            <ul>{renderedValues}</ul>
        </div>
    }
    const Connected = connect(mapStateToProps, mapDispatchToProps)(View)
    const reducer = (state, event) => {
        if (event.type === LIST_VALUES_SUCCESS) {
            return listValuesSuccessReducer(state, event)
        } else if (event.type === VALUE_TO_ADD_CHANGED) {
            return valueToAddChangedReducer(state, event)
        } else {
            return state
        }
    }
    const initialState = R.pipe(
        R.set(valueToAddLens, ''),
        R.set(valuesLens, []))({})

    const events = []
    const monitor = store => next => event => {
        events.push(event)
        return next(event)
    }

    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, initialState, applyMiddleware(sagaMiddleware, monitor))
    const createPromiseTracker = () => {
        const promises = []
        const trackPromise = p => {
            promises.push(p)
            return p
        }
        const waitForPromises = () => {
            const compositePromise = Promise.all(promises)
            promises.splice(0, promises.length)
            return compositePromise
        }
        return {
            trackPromise,
            waitForPromises
        }
    }
    const environment = {
        promiseTracker: createPromiseTracker()
    }
    const listValuesRequest = environment => function* () {
        yield put({type: LIST_VALUES_SUCCESS, values: fakeExternalStore})
    }
    const addValueRequest = environment => function* (event) {
        yield environment.promiseTracker.trackPromise(addToExternalStoreAsync(event.valueToAdd))
        yield put({type: VALUE_TO_ADD_CHANGED, valueToAdd: ''})
        yield put({type: LIST_VALUES_REQUEST})
    }
    const saga = environment => function* () {
        yield takeEvery('LIST_VALUES_REQUEST', listValuesRequest(environment))
        yield takeEvery('ADD_VALUE_REQUEST', addValueRequest(environment))
    }
    sagaMiddleware.run(saga(environment))
    const rendered = render(<Provider store={store}><Connected/></Provider>)
    const dataEntry = rendered.getByPlaceholderText('the placeholder')
    userEvent.type(dataEntry, "abc")
    fireEvent.keyUp(dataEntry, {key: 'Enter'})
    await environment.promiseTracker.waitForPromises()

    // test the view
    expect(rendered.getByText('abc')).toBeInTheDocument()

    // test the model
    expect(store.getState()).toEqual({prototype: {valueToAdd: '', values: ['abc']}})

    // test the events
    expect(events).toEqual([
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'a'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'ab'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: 'abc'},
        {type: 'ADD_VALUE_REQUEST', valueToAdd: 'abc'},
        {type: 'VALUE_TO_ADD_CHANGED', valueToAdd: ''},
        {type: 'LIST_VALUES_REQUEST'},
        {type: 'LIST_VALUES_SUCCESS', values: ['abc']}
    ])
})
