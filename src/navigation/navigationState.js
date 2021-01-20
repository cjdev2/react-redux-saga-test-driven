import {navigationEvent} from "./navigationDispatch";
import * as R from "ramda";
import {appendToArray, lensPathWithDefault} from "../compose-util/compose-connected";

const navigationModel = {
    page: lensPathWithDefault(['navigation', 'page'], ''),
    errors: lensPathWithDefault(['navigation', 'errors'], [])
}

const fetchPage = (state, event) => R.set(navigationModel.page, event.page, state)
const errorAdded = (state, event) => appendToArray(navigationModel.errors, event.error, state)

const navigationReducers = {
    [navigationEvent.FETCH_PAGE_SUCCESS]: fetchPage,
    [navigationEvent.ADD_ERROR]: errorAdded

}

export {navigationReducers, navigationModel}
