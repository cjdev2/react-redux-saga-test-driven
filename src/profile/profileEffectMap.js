import profileDispatch, {profileEvent} from "./profileDispatch";
import {put} from "redux-saga/effects";

const fetchProfilesRequest = environment => function* () {
    const profiles = yield environment.fetchJson('/proxy/profile')
    yield put(profileDispatch.fetchProfilesSuccess(profiles))
}

const addProfileRequest = environment => function* (event) {
    const body = JSON.stringify({name: event.name})
    yield environment.fetchText(`/proxy/profile`, {method: 'POST', body})
    yield put(profileDispatch.profileNameChanged(''))
    yield put(profileDispatch.fetchProfilesRequest())
}

const profileEffectMap = {
    [profileEvent.FETCH_PROFILES_REQUEST]: fetchProfilesRequest,
    [profileEvent.ADD_PROFILE_REQUEST]: addProfileRequest
}

export default profileEffectMap
