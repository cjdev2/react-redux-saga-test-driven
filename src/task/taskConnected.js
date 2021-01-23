import {createConnected} from '../compose-util/compose-connected';
import taskDispatch from './taskDispatch';
import Task from './Task';
import {taskModel, taskReducers} from './taskState';
import taskEffects, {taskError} from './taskEffects';

const createTaskConnected = componentDependencyMap => {
    return createConnected({
        name: 'task',
        model: taskModel,
        dispatch: taskDispatch,
        View: Task,
        reducerMap: taskReducers,
        effectMap: taskEffects,
        handleError: taskError,
        componentDependencyMap
    })
}

export default createTaskConnected
