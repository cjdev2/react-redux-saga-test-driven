import {taskEvent} from "./taskDispatch";
import * as R from "ramda";
import taskModel from "./taskModel";

const fetchTasksSuccess = (state, event) => R.pipe(
    R.set(taskModel.profile, event.profile),
    R.set(taskModel.tasks, event.tasks)
)(state)

const taskNameChanged = (state, event) => {
    const result = R.set(taskModel.taskName, event.name, state)
    return result
}

const taskReducers = {
    [taskEvent.FETCH_TASKS_SUCCESS]: fetchTasksSuccess,
    [taskEvent.TASK_NAME_CHANGED]: taskNameChanged
}

export default taskReducers
