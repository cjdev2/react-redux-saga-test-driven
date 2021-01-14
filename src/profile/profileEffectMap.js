import {profileEvent, profileDispatch} from "./profileDispatch";
import {put} from "redux-saga/effects";

const fetchProfilesRequest = environment => function* () {
    const profiles = yield environment.fetchJson('/proxy/profile')
    yield put(profileDispatch.fetchProfilesSuccess(profiles))
}

const profileEffectMap = {
    [profileEvent.FETCH_PROFILES_REQUEST]: fetchProfilesRequest,
}

export default profileEffectMap
