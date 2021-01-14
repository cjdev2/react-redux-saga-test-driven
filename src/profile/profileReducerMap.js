import {profileEvent} from "./profileDispatch";
import * as R from "ramda";
import profileModel from "./profileModel";

const fetchProfilesSuccess = (state, event) =>  R.set(profileModel.profiles.lens, event.profiles, state)

const profileReducerMap = {
    [profileEvent.FETCH_PROFILES_SUCCESS]: fetchProfilesSuccess
}

export default profileReducerMap
