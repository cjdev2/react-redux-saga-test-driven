import {navigationEvent} from "./navigationDispatch";
import * as R from "ramda";
import navigationModel from "./navigationModel";

const fetchPage = (state, event) => R.set(navigationModel.page.lens, event.page, state)

const navigationReducerMap = {
    [navigationEvent.FETCH_PAGE_SUCCESS]: fetchPage
}

export default navigationReducerMap
