import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import profileModel from "./profileModel";
import profileDispatch from "./profileDispatch";
import ProfileView from "./ProfileView";
import profileReducerMap from "./profileReducerMap";
import profileEffectMap from "./profileEffectMap";
import * as R from 'ramda'

const createProfileDispatchSystem = (overrides) => {
    const defaults = {
        name: "profile",
        model: profileModel,
        dispatch: profileDispatch,
        View: ProfileView,
        reducerMap: profileReducerMap,
        effectMap: profileEffectMap
    }
    const settings = R.mergeLeft(overrides, defaults)
    return createDispatchSystem(settings)
}

export default createProfileDispatchSystem
