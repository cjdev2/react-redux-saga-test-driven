import navigationDispatch, {navigationEvent} from "./navigationDispatch";
import {put} from "redux-saga/effects";
import profileDispatch from "../profile/profileDispatch";

const profilePattern = /profile($|\/)/

const redirect = environment => function* (event) {
    const uri = event.uri
    environment.history.push(uri)
    environment.history.go(0)
}

const fetchPage = environment => function* () {
    const uri = environment.history.location.pathname
    if (profilePattern.test(uri)) {
        yield put(navigationDispatch.fetchPageSuccess("profile"))
        yield put(profileDispatch.fetchProfilesRequest())
    } else {
        yield put(navigationDispatch.redirect('/profile'))
    }
}

const navigationEffectMap = {
    [navigationEvent.FETCH_PAGE_REQUEST]: fetchPage,
    [navigationEvent.REDIRECT]: redirect
}

export default navigationEffectMap
