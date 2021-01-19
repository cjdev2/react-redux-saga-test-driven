import {summaryEvent} from "./summaryDispatch";
import * as R from "ramda";
import summaryModel from "./summaryModel";

const fetchSummarySuccess = (state, event) => R.pipe(
    R.set(summaryModel.profileCount.lens, event.profileCount),
    R.set(summaryModel.taskCount.lens, event.taskCount))(state)

const summaryReducerMap = {
    [summaryEvent.FETCH_SUMMARY_SUCCESS]: fetchSummarySuccess
}

export default summaryReducerMap
