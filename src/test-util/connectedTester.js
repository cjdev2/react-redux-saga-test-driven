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

const createConnectedTester = ({system, uri, fetchEvents = [], initialState}) => {
    const history = createMemoryHistory()
    if (uri) {
        history.push(uri)
        history.go(0)
    }
    const historyEvents = []
    history.listen(({location, action}) => {
        historyEvents.push({action, pathname: location.pathname, state: location.state})
    });
    const fetch = createFetchFunction(fetchEvents)
    const promiseTracker = createPromiseTracker()
    const environment = createEnvironment({history, window, fetch, promiseTracker})
    const sagaMiddleware = createSagaMiddleware()
    const reduxEvents = []
    const monitor = store => next => event => {
        reduxEvents.push(event)
        return next(event)
    }
    const reducer = system.reducer
    const state = initialState || system.initialState
    const store = createStore(reducer, state, applyMiddleware(sagaMiddleware, monitor))
    const saga = system.saga(environment)
    sagaMiddleware.run(saga)
    const dispatch = async event => await act(async () => {
        store.dispatch(event)
    })
    const userTypes = async ({placeholder, value}) => {
        const dataEntry = rendered.getByPlaceholderText(placeholder)
        await userEvent.type(dataEntry, value)
        return await promiseTracker.waitForAllPromises()
    }
    const userPressesKey = async ({placeholder, key}) => {
        const dataEntry = rendered.getByPlaceholderText(placeholder)
        await fireEvent.keyUp(dataEntry, {key})
        return await promiseTracker.waitForAllPromises()
    }
    const userClicksElementWithText = async text => {
        const element = rendered.getByText(text)
        await userEvent.click(element);
        return await promiseTracker.waitForAllPromises()
    }
    const userClicksElementWithLabelText = async labelText => {
        const element = rendered.getByLabelText(labelText)
        await userEvent.click(element);
        return await promiseTracker.waitForAllPromises()
    }
    const userClicksElementWithLabelTextWithOptions = async ({labelText, mouseEvent}) => {
        const element = rendered.getByLabelText(labelText)
        await userEvent.click(element, mouseEvent);
        return await promiseTracker.waitForAllPromises()
    }
    const Component = system.Component
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
        debug
    }
}

export default createConnectedTester