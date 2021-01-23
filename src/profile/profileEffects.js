import profileDispatch, {profileEvent} from './profileDispatch';
import {all, put} from 'redux-saga/effects';
import summaryDispatch from '../summary/summaryDispatch';
import * as R from 'ramda';
import {composeErrorMessage} from '../error/ErrorComponent';

const fetchProfilesRequest = environment => function* () {
    const profiles = yield environment.fetchJson('/proxy/profile')
    yield put(profileDispatch.fetchProfilesSuccess(profiles))
}

const addProfileRequest = environment => function* (event) {
    const body = JSON.stringify({name: event.name})
    yield environment.fetchText(`/proxy/profile`, {method: 'POST', body})
    yield put(profileDispatch.profileNameChanged(''))
    yield put(profileDispatch.fetchProfilesRequest())
    yield put(summaryDispatch.fetchSummaryRequest())
}

const deleteProfileRequest = environment => function* (event) {
    const profileId = event.id
    const allTasks = yield environment.fetchJson('/proxy/task')
    const matchesProfile = task => task.profileId === profileId
    const tasksForProfile = R.filter(matchesProfile, allTasks)
    const taskIds = R.map(R.prop('id'), tasksForProfile)
    const createDeleteTaskFunction = taskId => environment.fetchText(`/proxy/task/${taskId}`, {method: 'DELETE'})
    const deleteTaskFunctions = R.map(createDeleteTaskFunction, taskIds)
    yield all(deleteTaskFunctions)
    yield environment.fetchText(`/proxy/profile/${profileId}`, {method: 'DELETE'})
    yield put(profileDispatch.fetchProfilesRequest())
    yield put(summaryDispatch.fetchSummaryRequest())
}

const profileEffects = {
    [profileEvent.FETCH_PROFILES_REQUEST]: fetchProfilesRequest,
    [profileEvent.ADD_PROFILE_REQUEST]: addProfileRequest,
    [profileEvent.DELETE_PROFILE_REQUEST]: deleteProfileRequest
}

const profileError = environment => function* (error, event) {
    yield put(profileDispatch.addError(composeErrorMessage({error, event})))
}

export {profileEffects as default, profileError}
