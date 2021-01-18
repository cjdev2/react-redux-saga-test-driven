import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import navigationModel from "./navigationModel";
import navigationDispatch from "./navigationDispatch";
import NavigationView from "./NavigationView";
import navigationReducerMap from "./navigationReducerMap";
import navigationEffectMap from "./navigationEffectMap";

const createNavigationDispatchSystem = componentDependencyMap => {
    return createDispatchSystem({
        name: "navigation",
        model: navigationModel,
        dispatch: navigationDispatch,
        View: NavigationView,
        reducerMap: navigationReducerMap,
        effectMap: navigationEffectMap,
        componentDependencyMap
    })
}

export default createNavigationDispatchSystem
