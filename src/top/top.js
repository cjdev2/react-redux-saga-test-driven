import Profile from '../profile/Profile'
import profileDispatchSystem from '../profile/profileDispatchSystem'
import profileDispatch from "../profile/profileDispatch";
import {
    createInitialStateFromDispatchSystems,
    createReducerFromDispatchSystems,
    createSagaFromDispatchSystems
} from "../compose-util/compose-dispatch-system";

const dispatchSystems = [profileDispatchSystem]

const initialState = createInitialStateFromDispatchSystems(dispatchSystems)
const reducer = createReducerFromDispatchSystems(dispatchSystems)
const saga = createSagaFromDispatchSystems(dispatchSystems)
const initializeEvents = [profileDispatch.fetchProfilesRequest()]
const Top = Profile

export {Top, reducer, saga, initializeEvents, initialState}
