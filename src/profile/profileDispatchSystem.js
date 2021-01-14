import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import profileModel from "./profileModel";
import {profileDispatch} from "./profileDispatch";
import ProfileView from "./ProfileView";
import profileReducerMap from "./profileReducerMap";
import profileEffectMap from "./profileEffectMap";

const profileDispatchSystem = createDispatchSystem({
    name:"profile",
    model:profileModel,
    dispatch:profileDispatch,
    View:ProfileView,
    reducerMap:profileReducerMap,
    effectMap:profileEffectMap
})

export default profileDispatchSystem
