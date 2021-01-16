import createFetchFunction from "./fetchFunction";
import createEnvironment from "../environment/environment";
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, createStore} from "redux";
import {act} from "react-dom/test-utils";
import {Provider} from 'react-redux'
import {fireEvent, render} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import createPromiseTracker from "./promise-tracker";

const createDispatchSystemTester = ({system, fetchEvents}) => {
    const fetch = createFetchFunction(fetchEvents)
    const promiseTracker = createPromiseTracker()
    const environment = createEnvironment({fetch, promiseTracker})
    const sagaMiddleware = createSagaMiddleware()
    const events = []
    const monitor = store => next => event => {
        events.push(event)
        return next(event)
    }
    const reducer = system.reducer
    const state = system.initialState
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
    const Component = system.Component
    const rendered = render(<Provider store={store}><Component/></Provider>)
    const debug = () => {
        console.log('view')
        rendered.debug()

        console.log('model')
        console.log(store.getState())

        console.log('events')
        console.log(events)
    }
    return {
        dispatch,
        store,
        events,
        rendered,
        userTypes,
        userPressesKey,
        debug
    }
}

export default createDispatchSystemTester