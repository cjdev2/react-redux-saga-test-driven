import {navigationEvent} from "./navigationDispatch";
import * as R from "ramda";
import {lensPathWithDefault} from "../compose-util/compose-connected";

const navigationModel = {
    page: lensPathWithDefault(['navigation', 'page'], '')
}

const fetchPage = (state, event) => R.set(navigationModel.page, event.page, state)

const navigationReducers = {
    [navigationEvent.FETCH_PAGE_SUCCESS]: fetchPage
}

export {navigationReducers, navigationModel}
