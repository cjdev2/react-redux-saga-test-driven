import {createConnected} from "../compose-util/compose-connected";
import profileModel from "./profileModel";
import profileDispatch from "./profileDispatch";
import Profile from "./Profile";
import profileReducers from "./profileReducers";
import profileEffects from "./profileEffects";

const createProfileConnected = componentDependencyMap => {
    return createConnected({
        name: "profile",
        model: profileModel,
        dispatch: profileDispatch,
        View: Profile,
        reducerMap: profileReducers,
        effectMap: profileEffects,
        componentDependencyMap
    })
}

export default createProfileConnected
