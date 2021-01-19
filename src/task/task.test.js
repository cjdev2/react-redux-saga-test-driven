import '@testing-library/jest-dom/extend-expect'
import taskDispatch, {taskEvent} from "./taskDispatch";
import createSample from "../test-util/sample";
import createTaskDispatchSystem from "./taskDispatchSystem";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";
import * as R from 'ramda'

const createTester = ({fetchEvents, uri, initialState}) => {
    const system = createTaskDispatchSystem({})
    const tester = createDispatchSystemTester({system, uri, fetchEvents, initialState})
    return tester
}

describe('task', () => {
    test('render detached', async () => {
        // when
        const tester = createTester({})

        // then
        expect(tester.rendered.getByText('0 tasks in profile null-profile-name')).toBeInTheDocument()
        expect(tester.store.getState()).toEqual({
            "task": {
                "profile": {
                    "id": "null-profile-id",
                    "name": "null-profile-name"
                },
                "tasks": [],
                "taskName": ""
            }
        })
        expect(tester.reduxEvents).toEqual([])
    })

    test('load tasks tasks', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const task1 = sample.task({profileId: profile.id})
        const task2 = sample.task()
        const task3 = sample.task({profileId: profile.id})
        const tasks = [task1, task2, task3]
        const tasksInProfile = [task1, task3]
        const getProfile = {
            uri: `/proxy/profile/${profile.id}`,
            response: JSON.stringify(profile)
        }
        const getTasks = {
            uri: `/proxy/task`,
            response: JSON.stringify(tasks)
        }
        const fetchEvents = [getProfile, getTasks]
        const tester = createTester({fetchEvents, uri})

        // when
        await tester.dispatch(taskDispatch.fetchTasksRequest())

        // then
        expect(tester.rendered.getByText(`2 tasks in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task1.name)).toBeInTheDocument()
        expect(tester.rendered.queryByText(task2.name)).not.toBeInTheDocument()
        expect(tester.rendered.getByText(task3.name)).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            "task": {
                profile,
                "tasks": tasksInProfile,
                "taskName": ""
            }
        })

        expect(tester.reduxEvents).toEqual(
            [
                {type: 'TASK/FETCH_TASKS_REQUEST'},
                {
                    type: 'TASK/FETCH_TASKS_SUCCESS',
                    profile,
                    tasks: tasksInProfile
                }
            ]
        )
    })

    test('add task', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const task = sample.task({profileId: profile.id})
        const taskWithoutId = R.dissoc('id', task)
        const httpPostCreateTask = {
            uri: `/proxy/task`,
            options: {
                method: 'POST',
                body: JSON.stringify(taskWithoutId)
            }
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            response: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            response: JSON.stringify([task])
        }
        const fetchEvents = [httpPostCreateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [],
                taskName: ''
            }
        }
        const tester = createTester({fetchEvents, uri, initialState})

        // when
        await tester.userTypes({placeholder: 'task name', value: task.name})
        await tester.userPressesKey({placeholder: 'task name', key: 'Enter'})

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [task],
                taskName: ''
            }
        })

        const eventsAfterTypingInName = R.dropWhile(event => event.type === taskEvent.TASK_NAME_CHANGED, tester.reduxEvents)

        expect(eventsAfterTypingInName).toEqual([
            {
                type: 'TASK/ADD_TASK_REQUEST',
                task: taskWithoutId
            },
            {type: 'TASK/TASK_NAME_CHANGED', name: ''},
            {type: 'TASK/FETCH_TASKS_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'},
            {
                type: 'TASK/FETCH_TASKS_SUCCESS',
                profile,
                tasks: [task]
            }
        ])
    })

    test('do not add task if it is blank', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const initialState = {
            task: {
                profile,
                tasks: [],
                taskName: ''
            }
        }
        const tester = createTester({initialState})

        // when
        await tester.userPressesKey({placeholder: 'task name', key: 'Enter'})

        // then
        expect(tester.rendered.getByText(`0 tasks in profile ${profile.name}`)).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [],
                taskName: ''
            }
        })

        expect(tester.reduxEvents).toEqual([])
    })

    test('do not add task if the key event is not Enter', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const initialState = {
            task: {
                profile,
                tasks: [],
                taskName: ''
            }
        }
        const tester = createTester({initialState})

        // when
        await tester.userTypes({placeholder: 'task name', value: 'a'})
        await tester.userPressesKey({placeholder: 'task name', key: 'a'})

        // then
        expect(tester.rendered.getByText(`0 tasks in profile ${profile.name}`)).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [],
                taskName: 'a'
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'TASK/TASK_NAME_CHANGED', name: 'a'}
        ])
    })

    test('mark task complete', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const incompleteTask = sample.task({profileId: profile.id})
        const completeTask = R.assoc('complete', true, incompleteTask)

        const httpUpdateTask = {
            uri: `/proxy/task/${incompleteTask.id}`,
            options: {
                method: 'POST',
                body: JSON.stringify(completeTask)
            }
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            response: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            response: JSON.stringify([completeTask])
        }
        const fetchEvents = [httpUpdateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: ''
            }
        }
        const tester = createTester({fetchEvents, uri, initialState})

        // when
        await tester.userClicksElementWithText(incompleteTask.name)

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(completeTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(completeTask.name)).toHaveClass('complete')

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [completeTask],
                taskName: ''
            }
        })

        expect(tester.reduxEvents).toEqual([
            {
                type: 'TASK/UPDATE_TASK_REQUEST',
                task: completeTask
            },
            {type: 'TASK/FETCH_TASKS_REQUEST'},
            {
                type: 'TASK/FETCH_TASKS_SUCCESS',
                profile,
                tasks: [completeTask]
            }
        ])
    })

    test('mark task not complete', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const incompleteTask = sample.task({profileId: profile.id})
        const completeTask = R.assoc('complete', true, incompleteTask)

        const httpUpdateTask = {
            uri: `/proxy/task/${completeTask.id}`,
            options: {
                method: 'POST',
                body: JSON.stringify(incompleteTask)
            }
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            response: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            response: JSON.stringify([incompleteTask])
        }
        const fetchEvents = [httpUpdateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [completeTask],
                taskName: ''
            }
        }
        const tester = createTester({fetchEvents, uri, initialState})

        // when
        await tester.userClicksElementWithText(completeTask.name)

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(incompleteTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(incompleteTask.name)).toHaveClass('in-progress')

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: ''
            }
        })

        expect(tester.reduxEvents).toEqual([
            {
                type: 'TASK/UPDATE_TASK_REQUEST',
                task: incompleteTask
            },
            {type: 'TASK/FETCH_TASKS_REQUEST'},
            {
                type: 'TASK/FETCH_TASKS_SUCCESS',
                profile,
                tasks: [incompleteTask]
            }
        ])
    })

    test('clear completed tasks', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const incompleteTask = sample.task({profileId: profile.id})
        const completeTask = sample.task({profileId: profile.id, complete: true})
        const tasks = [completeTask, incompleteTask]

        const httpDeleteTask = {
            uri: `/proxy/task/${completeTask.id}`,
            options: {
                method: 'DELETE'
            }
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            response: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            response: JSON.stringify([incompleteTask])
        }
        const fetchEvents = [httpDeleteTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks,
                taskName: ''
            }
        }
        const tester = createTester({fetchEvents, uri, initialState})

        // when
        await tester.userClicksElementWithText('Clear Completed')

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(incompleteTask.name)).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: ''
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'TASK/DELETE_TASKS_REQUEST', taskIds: [completeTask.id]},
            {type: 'TASK/FETCH_TASKS_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'},
            {
                type: 'TASK/FETCH_TASKS_SUCCESS',
                profile,
                tasks: [incompleteTask]
            }
        ])
    })
})
