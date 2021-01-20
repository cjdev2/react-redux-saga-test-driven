import summaryDispatch, {summaryEvent} from "./summaryDispatch";
import {put} from "redux-saga/effects";
import {composeErrorMessage} from "../error/ErrorComponent";

const fetchSummaryRequest = environment => function* () {
    const profiles = yield environment.fetchJson('/proxy/profile')
    const profileCount = profiles.length
    const tasks = yield environment.fetchJson('/proxy/task')
    const taskCount = tasks.length
    yield put(summaryDispatch.fetchSummarySuccess({profileCount, taskCount}))
}

const summaryEffects = {
    [summaryEvent.FETCH_SUMMARY_REQUEST]: fetchSummaryRequest
}

const summaryError = environment => function* (error, event) {
    yield put(summaryDispatch.addError(composeErrorMessage({error, event})))
}

export {summaryEffects as default, summaryError}
