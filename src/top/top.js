import createProfileDispatchSystem from '../profile/profileDispatchSystem'
import {
    createInitialStateFromDispatchSystems,
    createReducerFromDispatchSystems,
    createSagaFromDispatchSystems
} from "../compose-util/compose-dispatch-system";
import createNavigationDispatchSystem from "../navigation/navigationDispatchSystem";
import navigationDispatch from "../navigation/navigationDispatch";
import createTaskDispatchSystem from "../task/taskDispatchSystem";
import createSummaryDispatchSystem from "../summary/summaryDispatchSystem";

const profileSystem = createProfileDispatchSystem({})
const taskSystem = createTaskDispatchSystem({})
const summarySystem = createSummaryDispatchSystem({})
const navigationSystem = createNavigationDispatchSystem({
    Profile: profileSystem.Component,
    Task: taskSystem.Component,
    Summary: summarySystem.Component
})
const dispatchSystems = [profileSystem, taskSystem, navigationSystem, summarySystem]
const initializeEvents = [navigationDispatch.fetchPageRequest()]
const Top = navigationSystem.Component

const initialState = createInitialStateFromDispatchSystems(dispatchSystems)
const reducer = createReducerFromDispatchSystems(dispatchSystems)
const saga = createSagaFromDispatchSystems(dispatchSystems)

export {Top, reducer, saga, initializeEvents, initialState}
