import createFetchFunction from "./fetchFunction";
import createEnvironment from "../environment/environment";
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, createStore} from "redux";
import {act} from "react-dom/test-utils";
import {Provider} from 'react-redux'
import {fireEvent, render} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import createPromiseTracker from "./promise-tracker";
import {createMemoryHistory} from "history";
import * as R from "ramda";
import createSagaMonitor from "./saga-monitor";

const effectiveStateFor = (model, state) => {
    const accumulateState = (accumulator, lens) => {
        const value = R.view(lens, state)
        const newAccumulator = R.set(lens, value, accumulator)
        return newAccumulator
    }
    return R.reduce(accumulateState, {}, R.values(model))
}

const createConnectedTester = ({connected, uri, fetchSpecs = [], initialState}) => {
    const history = createMemoryHistory()
    if (uri) {
        history.push(uri)
        history.go(0)
    }
    const historyEvents = []
    history.listen(({location, action}) => {
        historyEvents.push({action, pathname: location.pathname, state: location.state})
    });
    const promiseTracker = createPromiseTracker()
    const fetch = createFetchFunction(fetchSpecs)
    const untrackedEnvironment = createEnvironment({history, window, fetch})
    const environment = {
        history: untrackedEnvironment.history,
        fetchText: promiseTracker.attachTracking('fetchText', untrackedEnvironment.fetchText),
        fetchJson: promiseTracker.attachTracking('fetchJson', untrackedEnvironment.fetchJson)
    }
    const {sagaMonitor} = createSagaMonitor()
    const sagaMiddleware = createSagaMiddleware({sagaMonitor})
    const reduxEvents = []
    const monitor = store => next => event => {
        reduxEvents.push(event)
        return next(event)
    }
    const reducer = connected.reducer
    const state = initialState || connected.initialState
    const store = createStore(reducer, state, applyMiddleware(sagaMiddleware, monitor))
    const saga = connected.saga(environment)
    sagaMiddleware.run(saga)
    const waitForEvents = async () => {
        await promiseTracker.waitForAllPromises()
    }
    const dispatch = async event => await act(async () => {
        store.dispatch(event)
    })
    const userTypes = async ({placeholder, value}) => {
        const dataEntry = rendered.getByPlaceholderText(placeholder)
        await userEvent.type(dataEntry, value)
        await waitForEvents()
    }
    const userPressesKey = async ({placeholder, key}) => {
        const dataEntry = rendered.getByPlaceholderText(placeholder)
        await fireEvent.keyUp(dataEntry, {key})
        await waitForEvents()
    }
    const userClicksElementWithText = async text => {
        const element = rendered.getByText(text)
        await userEvent.click(element);
        await waitForEvents()
    }
    const userClicksElementWithLabelText = async labelText => {
        const element = rendered.getByLabelText(labelText)
        await userEvent.click(element);
        await waitForEvents()
    }
    const userClicksElementWithLabelTextWithOptions = async ({labelText, mouseEvent}) => {
        const element = rendered.getByLabelText(labelText)
        await userEvent.click(element, mouseEvent);
        await waitForEvents()
    }
    const Component = connected.Component
    const rendered = render(<Provider store={store}><Component/></Provider>)
    const debug = () => {
        console.log('view')
        rendered.debug()

        console.log('model')
        console.log(JSON.stringify(store.getState(), null, 2))

        console.log('redux events')
        console.log(reduxEvents)

        console.log(`history events (${history.location.pathname})`)
        console.log(historyEvents)
    }
    const effectiveState = () => effectiveStateFor(connected.model, store.getState())
    return {
        dispatch,
        store,
        reduxEvents,
        rendered,
        userTypes,
        userPressesKey,
        userClicksElementWithText,
        userClicksElementWithLabelText,
        userClicksElementWithLabelTextWithOptions,
        history,
        historyEvents,
        effectiveState,
        debug
    }
}

export default createConnectedTester