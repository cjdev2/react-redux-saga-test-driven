import {createConnected} from "../compose-util/compose-connected";
import summaryModel from "./summaryModel";
import summaryDispatch from "./summaryDispatch";
import Summary from "./Summary";
import summaryReducers from "./summaryReducers";
import summaryEffects from "./summaryEffects";

const createSummaryConnected = componentDependencyMap => {
    return createConnected({
        name: "summary",
        model: summaryModel,
        dispatch: summaryDispatch,
        View: Summary,
        reducerMap: summaryReducers,
        effectMap: summaryEffects,
        componentDependencyMap
    })
}

export default createSummaryConnected
