import '@testing-library/jest-dom/extend-expect'
import taskDispatch, {taskEvent} from './taskDispatch';
import createSample from '../test-util/sample';
import createTaskConnected from './taskConnected';
import createConnectedTester from '../test-util/connectedTester';
import {taskReducers} from './taskState';

const createTester = ({fetchSpecs, uri, initialState}) => {
    const connected = createTaskConnected({})
    const tester = createConnectedTester({connected, uri, fetchSpecs, initialState})
    return tester
}

describe('task state', () => {
    test('fetch tasks success', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const task1 = sample.task({profile: profile.id})
        const task2 = sample.task({profile: profile.id})
        const task3 = sample.task({profile: profile.id})
        const tasks = [task1, task2, task3]
        const event = taskDispatch.fetchTasksSuccess({profile, tasks})
        const reducer = taskReducers[taskEvent.FETCH_TASKS_SUCCESS]

        // when
        const actual = reducer({}, event)

        // then
        expect(actual).toEqual({
            task: {
                profile,
                tasks
            }
        })
    })
})
