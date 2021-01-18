import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import navigationModel from "./navigationModel";
import navigationDispatch from "./navigationDispatch";
import NavigationView from "./NavigationView";
import navigationReducerMap from "./navigationReducerMap";
import navigationEffectMap from "./navigationEffectMap";
import Profile from "../profile/Profile";
import * as R from 'ramda'

const createNavigationDispatchSystem = overrides => {
    const defaults = {
        name: "navigation",
        model: navigationModel,
        dispatch: navigationDispatch,
        View: NavigationView,
        reducerMap: navigationReducerMap,
        effectMap: navigationEffectMap,
        componentDependencyMap: {
            Profile
        }
    }
    const settings = R.mergeLeft(overrides, defaults)
    return createDispatchSystem(settings)
}

export default createNavigationDispatchSystem
