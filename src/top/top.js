import createProfileConnected from '../profile/profileConnected'
import {
    createInitialStateFromConnected,
    createReducerFromConnected,
    createSagaFromConnected
} from "../compose-util/compose-connected";
import createNavigationConnected from "../navigation/navigationConnected";
import navigationDispatch from "../navigation/navigationDispatch";
import createTaskConnected from "../task/taskConnected";
import createSummaryConnected from "../summary/summaryConnected";

const profileSystem = createProfileConnected({})
const taskSystem = createTaskConnected({})
const summarySystem = createSummaryConnected({})
const navigationSystem = createNavigationConnected({
    Profile: profileSystem.Component,
    Task: taskSystem.Component,
    Summary: summarySystem.Component
})
const connectedArray = [profileSystem, taskSystem, navigationSystem, summarySystem]
const initializeEvents = [navigationDispatch.fetchPageRequest()]
const Top = navigationSystem.Component

const initialState = createInitialStateFromConnected(connectedArray)
const reducer = createReducerFromConnected(connectedArray)
const saga = createSagaFromConnected(connectedArray)

export {Top, reducer, saga, initializeEvents, initialState}
