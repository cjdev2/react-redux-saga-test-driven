import {createDispatchSystem} from "../compose-util/compose-dispatch-system";
import taskModel from "./taskModel";
import taskDispatch from "./taskDispatch";
import TaskView from "./TaskView";
import taskReducerMap from "./taskReducerMap";
import taskEffectMap from "./taskEffectMap";

const createTaskDispatchSystem = componentDependencyMap => {
    return createDispatchSystem({
        name: "task",
        model: taskModel,
        dispatch: taskDispatch,
        View: TaskView,
        reducerMap: taskReducerMap,
        effectMap: taskEffectMap,
        componentDependencyMap
    })
}

export default createTaskDispatchSystem
