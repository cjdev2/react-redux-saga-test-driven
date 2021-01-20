import {createConnected} from "../compose-util/compose-connected";
import summaryDispatch from "./summaryDispatch";
import Summary from "./Summary";
import {summaryModel, summaryReducers} from "./summaryState";
import summaryEffects, {summaryError} from "./summaryEffects";

const createSummaryConnected = componentDependencyMap => {
    return createConnected({
        name: "summary",
        model: summaryModel,
        dispatch: summaryDispatch,
        View: Summary,
        reducerMap: summaryReducers,
        effectMap: summaryEffects,
        handleError: summaryError,
        componentDependencyMap
    })
}

export default createSummaryConnected
