import createFetchFunction from "./fetchFunction";
import createEnvironment from "../environment/environment";
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, createStore} from "redux";
import {act} from "react-dom/test-utils";
import {Provider} from 'react-redux'
import {render} from "@testing-library/react";

const createDispatchSystemTester = ({system, fetchEvents}) => {
    const fetch = createFetchFunction(fetchEvents)
    const environment = createEnvironment({fetch})
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
    const Component = system.Component
    const rendered = render(<Provider store={store}><Component/></Provider>)
    return {
        dispatch,
        store,
        events,
        rendered
    }
}

export default createDispatchSystemTester