import '@testing-library/jest-dom/extend-expect'
import taskDispatch, {taskEvent} from "./taskDispatch";
import createSample from "../test-util/sample";
import createTaskConnected from "./taskConnected";
import createConnectedTester from "../test-util/connectedTester";
import * as R from 'ramda'

const createTester = ({fetchSpecs, uri, initialState}) => {
    const connected = createTaskConnected({})
    const tester = createConnectedTester({connected, uri, fetchSpecs, initialState})
    return tester
}

describe('task', () => {
    test('load tasks', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const uri = `/task/${profile.id}`
        const task1 = sample.task({profileId: profile.id})
        const task2 = sample.task()
        const task3 = sample.task({profileId: profile.id})
        const tasks = [task1, task2, task3]
        const tasksInProfile = [task1, task3]
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            responseText: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            responseText: JSON.stringify(tasks)
        }
        const fetchSpecs = [httpGetProfile, httpGetTasks]
        const tester = createTester({fetchSpecs, uri})

        // when
        await tester.dispatch(taskDispatch.fetchTasksRequest())

        // then
        expect(tester.rendered.getByText(`2 tasks in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task1.name)).toBeInTheDocument()
        expect(tester.rendered.queryByText(task2.name)).not.toBeInTheDocument()
        expect(tester.rendered.getByText(task3.name)).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            "task": {
                profile,
                "tasks": tasksInProfile,
                "taskName": "",
                errors: []
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

    test('task error', async () => {
        // given
        const uri = `/task/the-profile-id`
        const httpGetProfile = {
            uri: `/proxy/profile/the-profile-id`,
            errorMessage: 'the-error'

        }
        const fetchSpecs = [httpGetProfile]
        const tester = createTester({fetchSpecs, uri})

        // when
        await tester.dispatch(taskDispatch.fetchTasksRequest())

        // then
        expect(tester.rendered.getByText('the-error', {exact: false})).toBeInTheDocument()
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
            method: 'POST',
            requestText: JSON.stringify(taskWithoutId)
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            responseText: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            responseText: JSON.stringify([task])
        }
        const fetchSpecs = [httpPostCreateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [],
                taskName: ''
            }
        }
        const tester = createTester({fetchSpecs, uri, initialState})

        // when
        await tester.userTypes({placeholder: 'task name', value: task.name})
        await tester.userPressesKey({placeholder: 'task name', key: 'Enter'})

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [task],
                taskName: '',
                errors: []
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

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [],
                taskName: '',
                errors: []
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

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [],
                taskName: 'a',
                errors: []
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

        const httpPostUpdateTask = {
            uri: `/proxy/task/${incompleteTask.id}`,
            method: 'POST',
            requestText: JSON.stringify(completeTask)
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            responseText: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            responseText: JSON.stringify([completeTask])
        }
        const fetchSpecs = [httpPostUpdateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: ''
            }
        }
        const tester = createTester({fetchSpecs, uri, initialState})

        // when
        await tester.userClicksElementWithText(incompleteTask.name)

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(completeTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(completeTask.name)).toHaveClass('complete')

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [completeTask],
                taskName: '',
                errors: []
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

        const httpPostUpdateTask = {
            uri: `/proxy/task/${completeTask.id}`,
            method: 'POST',
            requestText: JSON.stringify(incompleteTask)
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            responseText: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            responseText: JSON.stringify([incompleteTask])
        }
        const fetchSpecs = [httpPostUpdateTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks: [completeTask],
                taskName: ''
            }
        }
        const tester = createTester({fetchSpecs, uri, initialState})

        // when
        await tester.userClicksElementWithText(completeTask.name)

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(incompleteTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(incompleteTask.name)).toHaveClass('in-progress')

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: '',
                errors: []
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
            method: 'DELETE'
        }
        const httpGetProfile = {
            uri: `/proxy/profile/${profile.id}`,
            responseText: JSON.stringify(profile)
        }
        const httpGetTasks = {
            uri: `/proxy/task`,
            responseText: JSON.stringify([incompleteTask])
        }
        const fetchSpecs = [httpDeleteTask, httpGetProfile, httpGetTasks]
        const initialState = {
            task: {
                profile,
                tasks,
                taskName: ''
            }
        }
        const tester = createTester({fetchSpecs, uri, initialState})

        // when
        await tester.userClicksElementWithText('Clear Completed')

        // then
        expect(tester.rendered.getByText(`1 task in profile ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.queryByText(incompleteTask.name)).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            task: {
                profile,
                tasks: [incompleteTask],
                taskName: '',
                errors: []
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
