import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import summaryModel from "./summaryModel";
import summaryDispatch from "./summaryDispatch";
import SummaryView from "./SummaryView";
import summaryReducerMap from "./summaryReducerMap";
import summaryEffectMap from "./summaryEffectMap";

const createSummaryDispatchSystem = componentDependencyMap => {
    return createDispatchSystem({
        name: "summary",
        model: summaryModel,
        dispatch: summaryDispatch,
        View: SummaryView,
        reducerMap: summaryReducerMap,
        effectMap: summaryEffectMap,
        componentDependencyMap
    })
}

export default createSummaryDispatchSystem
