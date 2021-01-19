import '@testing-library/jest-dom/extend-expect'
import * as R from 'ramda'
import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {put, take, takeEvery} from "redux-saga/effects";
import {act} from "react-dom/test-utils"

const assertArrayIsSorted = array => {
    const sortedArray = R.sortBy(R.identity, array)
    expect(array).toEqual(sortedArray)
}

test('take', async () => {
    // given
    const eventOrder = []
    const reducer = (state, event) => state
    const state = {}
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(
        reducer,
        state,
        applyMiddleware(sagaMiddleware)
    )
    const saga = function* () {
        eventOrder.push('2 - entered saga')
        yield take('foo')
        eventOrder.push('4 - exited saga')
    }

    // when
    eventOrder.push('1 - about to run saga')
    sagaMiddleware.run(saga)
    eventOrder.push('3 - finished running saga, about to dispatch event')
    store.dispatch({type: 'foo'})
    eventOrder.push('5 - dispatched event')

    // then
    assertArrayIsSorted(eventOrder)
})

test('fire event from both saga and store', async () => {
    // given
    const eventsHandled = []
    const reducer = (state, event) => state
    const state = {}
    const sagaMiddleware = createSagaMiddleware()
    const fooEvent = {type: 'foo', payload: 'foo content'}
    const barEvent = {type: 'bar', payload: 'bar content'}
    const store = createStore(
        reducer,
        state,
        applyMiddleware(sagaMiddleware)
    )
    const fooHandler = event => {
        eventsHandled.push(event)
    }
    const barHandler = event => {
        eventsHandled.push(event)
    }
    const saga = function* () {
        yield takeEvery('foo', fooHandler)
        yield takeEvery('bar', barHandler)
        yield put(fooEvent)
    }
    sagaMiddleware.run(saga)

    // when
    store.dispatch(barEvent)

    // then
    expect(eventsHandled).toEqual([fooEvent, barEvent])
})

test('one event fires another', async () => {
    // given
    const eventsHandled = []
    const reducer = (state, event) => state
    const state = {}
    const sagaMiddleware = createSagaMiddleware()
    const fooEvent = {type: 'foo', payload: 'foo content'}
    const barEvent = {type: 'bar', payload: 'bar content'}
    const store = createStore(
        reducer,
        state,
        applyMiddleware(sagaMiddleware)
    )
    const fooHandler = function* (event) {
        eventsHandled.push(event)
        yield put(barEvent)
    }
    const barHandler = event => {
        eventsHandled.push(event)
    }
    const saga = function* () {
        yield takeEvery('foo', fooHandler)
        yield takeEvery('bar', barHandler)
    }
    sagaMiddleware.run(saga)

    // when
    store.dispatch(fooEvent)

    // then
    expect(eventsHandled).toEqual([fooEvent, barEvent])
})

test('event makes async call', async () => {
    // given
    const eventsHandled = []
    const reducer = (state, event) => state
    const state = {}
    const sagaMiddleware = createSagaMiddleware()
    const fooEvent = {type: 'foo', payload: 'foo content'}
    const asyncFunction = async () => "async content"
    const store = createStore(
        reducer,
        state,
        applyMiddleware(sagaMiddleware)
    )
    const fooHandler = function* (event) {
        eventsHandled.push(event)
        const asyncResult = yield asyncFunction()
        const barEvent = {type: 'bar', payload: asyncResult}
        yield put(barEvent)
    }
    const barHandler = event => {
        eventsHandled.push(event)
    }
    const saga = function* () {
        yield takeEvery('foo', fooHandler)
        yield takeEvery('bar', barHandler)
    }
    sagaMiddleware.run(saga)

    // when
    await act(async () => {
        store.dispatch(fooEvent)
    })

    // then
    expect(eventsHandled).toEqual([fooEvent, {type: 'bar', payload: 'async content'}])
})
