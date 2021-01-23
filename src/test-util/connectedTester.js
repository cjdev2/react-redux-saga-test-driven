import createFetchFake from '../test-util/fetch-fake';
import createEnvironment from '../environment/environment';
import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, createStore} from 'redux';
import {act} from 'react-dom/test-utils';
import {Provider} from 'react-redux'
import {fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import createPromiseTracker from './promise-tracker';
import {createMemoryHistory} from 'history';
import * as R from 'ramda';
import util from 'util'

const effectiveStateFor = (model, state) => {
    const accumulateState = (accumulator, lens) => {
        const value = R.view(lens, state)
        const newAccumulator = R.set(lens, value, accumulator)
        return newAccumulator
    }
    return R.reduce(accumulateState, {}, R.values(model))
}

const createHistoryMonitor = handleEvent => {
    const historyMonitor = ({location, action}) => {
        const event = {action, pathname: location.pathname, state: location.state}
        handleEvent(event)
    }
    return historyMonitor
}

const createReduxMonitor = handleEvent => {
    const reduxMonitor = store => next => event => {
        handleEvent(event)
        return next(event)
    }
    return reduxMonitor
}

const createSagaMonitor = handleEvent => {
    const rootSagaStarted = (options) => {
        handleEvent({rootSagaStarted: options})
    }
    const effectTriggered = (options) => {
        handleEvent({sagaEffectTriggered: options})
    }
    const effectResolved = (effectId, result) => {
        handleEvent({sagaEffectResolved: {effectId, result}})
    }
    const effectRejected = (effectId, error) => {
        handleEvent({sagaEffectRejected: {effectId, error}})
    }
    const effectCancelled = effectId => {
        handleEvent({sagaEffectCancelled: {effectId}})
    }
    const actionDispatched = action => {
        handleEvent({sagaActionDispatched: {action}})
    }
    const sagaMonitor = {
        rootSagaStarted,
        effectTriggered,
        effectResolved,
        effectRejected,
        effectCancelled,
        actionDispatched
    }
    return sagaMonitor
}

const createConnectedTester = ({connected, uri, fetchSpecs = [], initialState}) => {
    const history = createMemoryHistory()
    if (uri) {
        history.push(uri)
        history.go(0)
    }
    const combinedEvents = []
    const historyEvents = []
    const handleHistoryEvent = historyEvent => {
        historyEvents.push(historyEvent)
        combinedEvents.push({history: historyEvent})
    }
    history.listen(createHistoryMonitor(handleHistoryEvent));
    const {attachTracking, waitForAllPromises} = createPromiseTracker()
    const fetch = createFetchFake(fetchSpecs)
    const untrackedEnvironment = createEnvironment({history, window, fetch})
    const environment = {
        history: untrackedEnvironment.history,
        fetchText: attachTracking('fetchText', untrackedEnvironment.fetchText),
        fetchJson: attachTracking('fetchJson', untrackedEnvironment.fetchJson)
    }
    const sagaEvents = []
    const handleSagaEvent = sagaEvent => {
        sagaEvents.push(sagaEvent)
        combinedEvents.push({saga: sagaEvent})
    }
    const sagaMonitor = createSagaMonitor(handleSagaEvent)
    const sagaMiddleware = createSagaMiddleware({sagaMonitor})
    const reduxEvents = []
    const handleReduxEvent = reduxEvent => {
        reduxEvents.push(reduxEvent)
        combinedEvents.push({redux: reduxEvent})
    }
    const reduxMonitor = createReduxMonitor(handleReduxEvent)
    const reducer = connected.reducer
    const state = initialState || connected.initialState
    const store = createStore(reducer, state, applyMiddleware(sagaMiddleware, reduxMonitor))
    const saga = connected.saga(environment)
    sagaMiddleware.run(saga)
    const waitForEvents = async () => {
        await waitForAllPromises()
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
    const effectiveState = () => effectiveStateFor(connected.model, store.getState())
    const debug = () => {
        rendered.debug()
        const debugObject = {
            model: effectiveState(),
            events: combinedEvents
        }
        console.log(util.inspect(debugObject, {depth: null}))
    }
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
        sagaEvents,
        effectiveState,
        debug
    }
}

export default createConnectedTester
