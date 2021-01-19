import summaryDispatch, {summaryEvent} from "./summaryDispatch";
import {put} from "redux-saga/effects";

const fetchSummaryRequest = environment => function* () {
    const profiles = yield environment.fetchJson('/proxy/profile')
    const profileCount = profiles.length
    const tasks = yield environment.fetchJson('/proxy/task')
    const taskCount = tasks.length
    yield put(summaryDispatch.fetchSummarySuccess({profileCount, taskCount}))
}

const summaryEffectMap = {
    [summaryEvent.FETCH_SUMMARY_REQUEST]: fetchSummaryRequest
}

export default summaryEffectMap
