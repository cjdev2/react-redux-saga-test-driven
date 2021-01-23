import {summaryEvent} from './summaryDispatch';
import * as R from 'ramda';
import {appendToArray, lensPathWithDefault} from '../compose-util/compose-connected';

const summaryModel = {
    profileCount: lensPathWithDefault(['summary', 'profileCount'], 0),
    taskCount: lensPathWithDefault(['summary', 'taskCount'], 0),
    errors: lensPathWithDefault(['summary', 'errors'], [])
}

const fetchSummarySuccess = (state, event) => R.pipe(
    R.set(summaryModel.profileCount, event.profileCount),
    R.set(summaryModel.taskCount, event.taskCount))(state)
const errorAdded = (state, event) => appendToArray(summaryModel.errors, event.error, state)

const summaryReducers = {
    [summaryEvent.FETCH_SUMMARY_SUCCESS]: fetchSummarySuccess,
    [summaryEvent.ADD_ERROR]: errorAdded
}

export {summaryReducers, summaryModel}
