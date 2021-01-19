import {profileEvent} from "./profileDispatch";
import * as R from "ramda";
import {lensPathWithDefault} from "../compose-util/compose-connected";

const profileModel = {
    profiles: lensPathWithDefault(['profile', 'profiles'], []),
    profileName: lensPathWithDefault(['profile', 'profileName'], '')
}

const fetchProfilesSuccess = (state, event) => R.set(profileModel.profiles, event.profiles, state)
const profileNameChanged = (state, event) => {
    const result = R.set(profileModel.profileName, event.name, state)
    return result
}

const profileReducers = {
    [profileEvent.FETCH_PROFILES_SUCCESS]: fetchProfilesSuccess,
    [profileEvent.PROFILE_NAME_CHANGED]: profileNameChanged
}

export {profileReducers, profileModel}
