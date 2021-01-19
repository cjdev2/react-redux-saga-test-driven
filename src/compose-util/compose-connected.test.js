import '@testing-library/jest-dom/extend-expect'
import {
    createConnected,
    createReducerFromConnected,
    createSagaFromConnected,
    lensPathWithDefault,
    pairsToObject
} from "./compose-connected";
import * as R from 'ramda'
import {put, takeEvery} from "redux-saga/effects";
import createConnectedTester from "../test-util/connectedTester";
import createSagaMiddleware from 'redux-saga'
import {applyMiddleware, createStore} from 'redux'
import {act} from "react-dom/test-utils";
import createEnvironment from "../environment/environment";

test('pairs to object', () => {
    // given
    const pairs = [['a', 1], ['b', 2]]

    // when
    const object = pairsToObject(pairs)

    // then
    expect(object).toEqual({a: 1, b: 2})
})

test('pairs to object disallows duplicates', () => {
    // given
    const pairs = [['a', 1], ['a', 2]]

    // then
    expect(() => pairsToObject(pairs)).toThrow("duplicate key 'a'")
})

test('compose reducer', () => {
    // given
    const valueLensA = R.lensPath(['a', 'value'])
    const valueLensB = R.lensPath(['b', 'value'])
    const reducerA = (state = {}, event) => {
        if (event.type === 'a-event') {
            return R.set(valueLensA, event.value, state)
        } else {
            return state
        }
    }
    const reducerB = (state = {}, event) => {
        if (event.type === 'b-event') {
            return R.set(valueLensB, event.value, state)
        } else {
            return state
        }
    }
    const connectedA = {
        name: 'a',
        reducer: reducerA
    }
    const connectedB = {
        name: 'b',
        reducer: reducerB
    }
    const connectedArray = [connectedA, connectedB]

    // when
    const reducer = createReducerFromConnected(connectedArray)

    // then
    expect(reducer({}, {type: 'a-event', value: 123})).toEqual({a: {value: 123}})
    expect(reducer({}, {type: 'b-event', value: 456})).toEqual({b: {value: 456}})
})

test('compose saga', async () => {
    // given
    const events = []
    const requestEvent = {type: 'request'}
    const responseEvent = {type: 'response'}
    const requestHandler = function* (event) {
        events.push(requestEvent)
        yield put(responseEvent)
    }
    const responseHandler = event => {
        events.push(responseEvent)
    }
    const sagaA = environment => function* (event) {
        yield takeEvery('request', requestHandler)
    }
    const sagaB = environment => function* (event) {
        yield takeEvery('response', responseHandler)
    }
    const connectedA = {
        name: 'a',
        saga: sagaA
    }
    const connectedB = {
        name: 'b',
        saga: sagaB
    }
    const connectedArray = [connectedA, connectedB]
    const environment = createEnvironment({})

    // when
    const saga = createSagaFromConnected(connectedArray)(environment)
    const reducer = (state, event) => state
    const state = {}
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(
        reducer,
        state,
        applyMiddleware(sagaMiddleware)
    )
    sagaMiddleware.run(saga)
    await act(async () => {
        store.dispatch(requestEvent)
    })

    // then
    expect(events).toEqual([requestEvent, responseEvent])
})

test('create connected', async () => {
    // given
    const name = 'foo'
    const model = {
        value: lensPathWithDefault(['value'], '')
    }
    const dispatch = {
        request: () => ({type: 'request'}),
        response: value => ({type: 'response', value})
    }
    const View = (props) => {
        return <div>Hello, {props.value}!</div>
    }
    const success = (state, event) => R.set(model.value, event.value, state)
    const reducerMap = {
        response: success
    }
    const request = environment => function* () {
        const value = yield environment.fetchText('/value')
        yield put({type: 'response', value})
    }
    const effectMap = {
        request,
    }

    // when
    const connected = createConnected({
        name,
        model,
        dispatch,
        View,
        reducerMap,
        effectMap
    })
    const httpGetValue = {uri: '/value', response: 'world'};
    const fetchEvents = [httpGetValue]
    const tester = createConnectedTester({connected, fetchEvents})
    await tester.dispatch(dispatch.request())

    // then
    expect(tester.rendered.getByText('Hello, world!')).toBeInTheDocument()
})
