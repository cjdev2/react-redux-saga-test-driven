import navigationDispatch, {navigationEvent} from "./navigationDispatch";
import {put} from "redux-saga/effects";
import profileDispatch, {profileUriPattern} from "../profile/profileDispatch";
import taskDispatch, {taskUriPattern} from "../task/taskDispatch";
import summaryDispatch from "../summary/summaryDispatch";

const redirect = environment => function* (event) {
    const uri = event.uri
    environment.history.push(uri)
    environment.history.go(0)
}

const fetchPage = environment => function* () {
    const uri = environment.history.location.pathname
    if (profileUriPattern.test(uri)) {
        yield put(navigationDispatch.fetchPageSuccess("profile"))
        yield put(profileDispatch.fetchProfilesRequest())
        yield put(summaryDispatch.fetchSummaryRequest())
    } else if (taskUriPattern.test(uri)) {
        yield put(navigationDispatch.fetchPageSuccess("task"))
        yield put(taskDispatch.fetchTasksRequest())
        yield put(summaryDispatch.fetchSummaryRequest())
    } else {
        yield put(navigationDispatch.redirect('/profile'))
    }
}

const navigationEffectMap = {
    [navigationEvent.FETCH_PAGE_REQUEST]: fetchPage,
    [navigationEvent.REDIRECT]: redirect
}

export default navigationEffectMap
