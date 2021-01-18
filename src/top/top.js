import createProfileDispatchSystem from '../profile/profileDispatchSystem'
import {
    createInitialStateFromDispatchSystems,
    createReducerFromDispatchSystems,
    createSagaFromDispatchSystems
} from "../compose-util/compose-dispatch-system";
import createNavigationDispatchSystem from "../navigation/navigationDispatchSystem";
import navigationDispatch from "../navigation/navigationDispatch";

const profileSystem = createProfileDispatchSystem()
const navigationSystem = createNavigationDispatchSystem({extraState: {Profile: profileSystem.Component}})
const dispatchSystems = [profileSystem, navigationSystem]
const initializeEvents = [navigationDispatch.fetchPageRequest()]
const Top = navigationSystem.Component

const initialState = createInitialStateFromDispatchSystems(dispatchSystems)
const reducer = createReducerFromDispatchSystems(dispatchSystems)
const saga = createSagaFromDispatchSystems(dispatchSystems)

export {Top, reducer, saga, initializeEvents, initialState}
