import {taskEvent} from "./taskDispatch";
import * as R from "ramda";
import {lensPathWithDefault} from "../compose-util/compose-connected";

const taskModel = {
    profile: lensPathWithDefault(['task', 'profile'], {id: 'null-profile-id', name: 'null-profile-name'}),
    tasks: lensPathWithDefault(['task', 'tasks'], []),
    taskName: lensPathWithDefault(['task', 'taskName'], '')
}

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

export {taskReducers, taskModel}
