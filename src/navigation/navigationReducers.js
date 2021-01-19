import {navigationEvent} from "./navigationDispatch";
import * as R from "ramda";
import navigationModel from "./navigationModel";

const fetchPage = (state, event) => R.set(navigationModel.page, event.page, state)

const navigationReducers = {
    [navigationEvent.FETCH_PAGE_SUCCESS]: fetchPage
}

export default navigationReducers
