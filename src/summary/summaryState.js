import {summaryEvent} from "./summaryDispatch";
import * as R from "ramda";
import {lensPathWithDefault} from "../compose-util/compose-connected";

const summaryModel = {
    profileCount: lensPathWithDefault(['summary', 'profileCount'], 0),
    taskCount: lensPathWithDefault(['summary', 'taskCount'], 0)
}

const fetchSummarySuccess = (state, event) => R.pipe(
    R.set(summaryModel.profileCount, event.profileCount),
    R.set(summaryModel.taskCount, event.taskCount))(state)

const summaryReducers = {
    [summaryEvent.FETCH_SUMMARY_SUCCESS]: fetchSummarySuccess
}

export {summaryReducers, summaryModel}
