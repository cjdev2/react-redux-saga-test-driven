import {profileEvent} from "./profileDispatch";
import * as R from "ramda";
import profileModel from "./profileModel";

const fetchProfilesSuccess = (state, event) => R.set(profileModel.profiles, event.profiles, state)
const profileNameChanged = (state, event) => {
    const result = R.set(profileModel.profileName, event.name, state)
    return result
}

const profileReducers = {
    [profileEvent.FETCH_PROFILES_SUCCESS]: fetchProfilesSuccess,
    [profileEvent.PROFILE_NAME_CHANGED]: profileNameChanged
}

export default profileReducers
