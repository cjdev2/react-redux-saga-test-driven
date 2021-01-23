import createProfileConnected from '../profile/profileConnected'
import {createReducerFromConnected, createSagaFromConnected} from '../compose-util/compose-connected';
import createNavigationConnected from '../navigation/navigationConnected';
import navigationDispatch from '../navigation/navigationDispatch';
import createTaskConnected from '../task/taskConnected';
import createSummaryConnected from '../summary/summaryConnected';

const profileConnected = createProfileConnected({})
const taskConnected = createTaskConnected({})
const summaryConnected = createSummaryConnected({})
const navigationConnected = createNavigationConnected({
    Profile: profileConnected.Component,
    Task: taskConnected.Component,
    Summary: summaryConnected.Component
})
const connectedArray = [
    profileConnected,
    taskConnected,
    navigationConnected,
    summaryConnected
]
const initializeEvents = [
    navigationDispatch.fetchPageRequest()
]
const Top = navigationConnected.Component

const reducer = createReducerFromConnected(connectedArray)
const saga = createSagaFromConnected(connectedArray)

export {Top, reducer, saga, initializeEvents}
