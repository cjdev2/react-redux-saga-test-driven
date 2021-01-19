import {createConnected} from "../compose-util/compose-connected";
import navigationDispatch from "./navigationDispatch";
import Navigation from "./Navigation";
import {navigationModel, navigationReducers} from "./navigationState";
import navigationEffects from "./navigationEffects";

const createNavigationConnected = componentDependencyMap => {
    return createConnected({
        name: "navigation",
        model: navigationModel,
        dispatch: navigationDispatch,
        View: Navigation,
        reducerMap: navigationReducers,
        effectMap: navigationEffects,
        componentDependencyMap
    })
}

export default createNavigationConnected
