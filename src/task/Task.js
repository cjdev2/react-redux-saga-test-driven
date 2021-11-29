import './Task.css'
import * as R from 'ramda'
import {pluralize} from '../string-util/string-util';
import ErrorComponent from '../error/ErrorComponent';

const TaskListItem = ({task, updateTaskRequest}) => {
    const completeClass = task.complete ? 'complete' : 'in-progress';
    const onClick = () => {
        const newTask = {...task, complete: !task.complete}
        updateTaskRequest(newTask)
    }
    return <span className={completeClass} onClick={onClick}>
        {task.name}
    </span>
}

const TaskList = ({tasks, updateTaskRequest}) => {
    const createElement = task =>
        <TaskListItem key={task.id}
                      task={task}
                      updateTaskRequest={updateTaskRequest}/>
    const taskElements = R.map(createElement, tasks)
    return <div className={'elements'}>
        {taskElements}
    </div>
}

const AddTask = ({profile, taskName, taskNameChanged, addTaskRequest}) => {
    const onKeyUp = event => {
        if (R.trim(taskName) === '') return
        if (event.key !== 'Enter') return
        const task = {profile: profile.id, name: taskName, complete: false}
        addTaskRequest(task)
    }
    const onChange = event => {
        taskNameChanged(event.target.value)
    }
    return <input value={taskName}
                  autoFocus={true}
                  placeholder={'task name'}
                  onKeyUp={onKeyUp}
                  onChange={onChange}/>
}

const Task = ({
                  profile,
                  tasks,
                  taskName,
                  errors,
                  taskNameChanged,
                  addTaskRequest,
                  updateTaskRequest,
                  deleteTasksRequest
              }) => {
    const header = `${tasks.length} ${pluralize({
        quantity: tasks.length,
        singular: 'task',
        plural: 'tasks'
    })} in profile ${profile.name}`
    const onClickClearComplete = () => {
        const taskIsComplete = task => task.complete
        const completedTasks = R.filter(taskIsComplete, tasks)
        const completedTaskIds = R.map(R.prop('id'), completedTasks)
        deleteTasksRequest(completedTaskIds)
    }
    return <div className={'Task'}>
        <h2>{header}</h2>
        <ErrorComponent errors={errors}/>
        <AddTask profile={profile}
                 taskName={taskName}
                 taskNameChanged={taskNameChanged}
                 addTaskRequest={addTaskRequest}/>
        <TaskList tasks={tasks}
                  updateTaskRequest={updateTaskRequest}/>
        <button onClick={onClickClearComplete}>Clear Completed</button>
        <a href={'/profile'}>Profiles</a>
    </div>
}

export default Task;
