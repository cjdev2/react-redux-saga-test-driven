const taskUriPattern = /^\/task\/([^/]*)/

const taskEvent = {
    FETCH_TASKS_REQUEST: 'TASK/FETCH_TASKS_REQUEST',
    FETCH_TASKS_SUCCESS: 'TASK/FETCH_TASKS_SUCCESS',
    TASK_NAME_CHANGED: 'TASK/TASK_NAME_CHANGED',
    ADD_TASK_REQUEST: 'TASK/ADD_TASK_REQUEST',
    UPDATE_TASK_REQUEST: 'TASK/UPDATE_TASK_REQUEST',
    DELETE_TASKS_REQUEST: 'TASK/DELETE_TASKS_REQUEST',
    ADD_ERROR: 'TASK/ADD_ERROR'
}

const taskDispatch = {
    fetchTasksRequest: () => ({type: taskEvent.FETCH_TASKS_REQUEST}),
    fetchTasksSuccess: ({profile, tasks}) => ({type: taskEvent.FETCH_TASKS_SUCCESS, profile, tasks}),
    taskNameChanged: name => ({type: taskEvent.TASK_NAME_CHANGED, name}),
    addTaskRequest: task => ({type: taskEvent.ADD_TASK_REQUEST, task}),
    updateTaskRequest: task => ({type: taskEvent.UPDATE_TASK_REQUEST, task}),
    deleteTasksRequest: taskIds => ({type: taskEvent.DELETE_TASKS_REQUEST, taskIds}),
    addError: error => ({type: taskEvent.ADD_ERROR, error})
}

export {taskDispatch as default, taskEvent, taskUriPattern}
