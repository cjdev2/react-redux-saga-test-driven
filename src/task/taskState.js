import {taskEvent} from './taskDispatch';
import * as R from 'ramda';
import {appendToArray, lensPathWithDefault} from '../compose-util/compose-connected';

const taskModel = {
    profile: lensPathWithDefault(['task', 'profile'], {id: 'null-profile-id', name: 'null-profile-name'}),
    tasks: lensPathWithDefault(['task', 'tasks'], []),
    taskName: lensPathWithDefault(['task', 'taskName'], ''),
    errors: lensPathWithDefault(['task', 'errors'], [])
}

const fetchTasksSuccess = (state, event) => R.pipe(
    R.set(taskModel.profile, event.profile),
    R.set(taskModel.tasks, event.tasks)
)(state)

const taskNameChanged = (state, event) => {
    const result = R.set(taskModel.taskName, event.name, state)
    return result
}
const errorAdded = (state, event) => appendToArray(taskModel.errors, event.error, state)


const taskReducers = {
    [taskEvent.FETCH_TASKS_SUCCESS]: fetchTasksSuccess,
    [taskEvent.TASK_NAME_CHANGED]: taskNameChanged,
    [taskEvent.ADD_ERROR]: errorAdded
}

export {taskReducers, taskModel}
