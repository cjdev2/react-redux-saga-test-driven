import {createConnected} from "../compose-util/compose-connected";
import navigationModel from "./navigationModel";
import navigationDispatch from "./navigationDispatch";
import Navigation from "./Navigation";
import navigationReducers from "./navigationReducers";
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
