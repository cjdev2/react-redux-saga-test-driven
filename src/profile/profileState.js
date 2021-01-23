import {profileEvent} from './profileDispatch';
import * as R from 'ramda';
import {appendToArray, lensPathWithDefault} from '../compose-util/compose-connected';

const profileModel = {
    profiles: lensPathWithDefault(['profile', 'profiles'], []),
    profileName: lensPathWithDefault(['profile', 'profileName'], ''),
    errors: lensPathWithDefault(['profile', 'errors'], [])
}

const fetchProfilesSuccess = (state, event) => R.set(profileModel.profiles, event.profiles, state)
const profileNameChanged = (state, event) => {
    const result = R.set(profileModel.profileName, event.name, state)
    return result
}
const errorAdded = (state, event) => appendToArray(profileModel.errors, event.error, state)

const profileReducers = {
    [profileEvent.FETCH_PROFILES_SUCCESS]: fetchProfilesSuccess,
    [profileEvent.PROFILE_NAME_CHANGED]: profileNameChanged,
    [profileEvent.ADD_ERROR]: errorAdded
}

export {profileReducers, profileModel}
