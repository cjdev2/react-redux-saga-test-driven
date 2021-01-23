import {createConnected} from '../compose-util/compose-connected';
import profileDispatch from './profileDispatch';
import Profile from './Profile';
import {profileModel, profileReducers} from './profileState';
import profileEffects, {profileError} from './profileEffects';

const createProfileConnected = componentDependencyMap => {
    return createConnected({
        name: 'profile',
        model: profileModel,
        dispatch: profileDispatch,
        View: Profile,
        reducerMap: profileReducers,
        effectMap: profileEffects,
        handleError: profileError,
        componentDependencyMap
    })
}

export default createProfileConnected
