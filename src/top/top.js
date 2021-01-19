import createProfileDispatchSystem from '../profile/profileDispatchSystem'
import {
    createInitialStateFromDispatchSystems,
    createReducerFromDispatchSystems,
    createSagaFromDispatchSystems
} from "../compose-util/compose-dispatch-system";
import createNavigationDispatchSystem from "../navigation/navigationDispatchSystem";
import navigationDispatch from "../navigation/navigationDispatch";
import createTaskDispatchSystem from "../task/taskDispatchSystem";

const profileSystem = createProfileDispatchSystem({})
const taskSystem = createTaskDispatchSystem({})
const navigationSystem = createNavigationDispatchSystem({
    Profile: profileSystem.Component,
    Task: taskSystem.Component
})
const dispatchSystems = [profileSystem, taskSystem, navigationSystem]
const initializeEvents = [navigationDispatch.fetchPageRequest()]
const Top = navigationSystem.Component

const initialState = createInitialStateFromDispatchSystems(dispatchSystems)
const reducer = createReducerFromDispatchSystems(dispatchSystems)
const saga = createSagaFromDispatchSystems(dispatchSystems)

export {Top, reducer, saga, initializeEvents, initialState}
