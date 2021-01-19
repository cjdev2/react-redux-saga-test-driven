import {createConnected} from "../compose-util/compose-connected";
import taskModel from "./taskModel";
import taskDispatch from "./taskDispatch";
import Task from "./Task";
import taskReducers from "./taskReducers";
import taskEffects from "./taskEffects";

const createTaskConnected = componentDependencyMap => {
    return createConnected({
        name: "task",
        model: taskModel,
        dispatch: taskDispatch,
        View: Task,
        reducerMap: taskReducers,
        effectMap: taskEffects,
        componentDependencyMap
    })
}

export default createTaskConnected
