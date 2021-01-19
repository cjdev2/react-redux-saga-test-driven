import taskDispatch, {taskEvent, taskUriPattern} from "./taskDispatch";
import {all, put} from "redux-saga/effects";
import * as R from 'ramda'
import summaryDispatch from "../summary/summaryDispatch";

const fetchTasksRequest = environment => function* (event) {
    const uri = environment.history.location.pathname
    const matchResult = uri.match(taskUriPattern)
    const profileId = matchResult[1]
    const profile = yield environment.fetchJson(`/proxy/profile/${profileId}`)
    const allTasks = yield environment.fetchJson('/proxy/task')
    const matchingProfileId = task => task.profileId === profileId
    const tasks = R.filter(matchingProfileId, allTasks)
    yield put(taskDispatch.fetchTasksSuccess({profile, tasks}))
}

const addTaskRequest = environment => function* (event) {
    const task = event.task
    const body = JSON.stringify(task)
    yield environment.fetchText(`/proxy/task`, {method: 'POST', body})
    yield put(taskDispatch.taskNameChanged(''))
    yield put(taskDispatch.fetchTasksRequest())
    yield put(summaryDispatch.fetchSummaryRequest())
}

const updateTaskRequest = environment => function* (event) {
    const task = event.task
    const body = JSON.stringify(task)
    yield environment.fetchText(`/proxy/task/${task.id}`, {method: 'POST', body})
    yield put(taskDispatch.fetchTasksRequest())
}

const deleteTasksRequest = environment => function* (event) {
    const taskIds = event.taskIds
    const createDeleteTaskFunction = taskId => environment.fetchText(`/proxy/task/${taskId}`, {method: 'DELETE'})
    const deleteTaskFunctions = R.map(createDeleteTaskFunction, taskIds)
    yield all(deleteTaskFunctions)
    yield put(taskDispatch.fetchTasksRequest())
    yield put(summaryDispatch.fetchSummaryRequest())
}

const taskEffects = {
    [taskEvent.FETCH_TASKS_REQUEST]: fetchTasksRequest,
    [taskEvent.ADD_TASK_REQUEST]: addTaskRequest,
    [taskEvent.UPDATE_TASK_REQUEST]: updateTaskRequest,
    [taskEvent.DELETE_TASKS_REQUEST]: deleteTasksRequest,
}

export default taskEffects
