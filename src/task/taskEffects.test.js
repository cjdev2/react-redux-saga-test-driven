import '@testing-library/jest-dom/extend-expect'
import taskDispatch, {taskEvent} from './taskDispatch';
import taskEffects from './taskEffects';
import createSample from '../test-util/sample';
import createEnvironment from '../environment/environment';
import createFetchFake from '../test-util/fetch-fake';
import {createMemoryHistory} from 'history';

describe('task effects', () => {
    test('fetch tasks', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const task1 = sample.task({profile: profile.id})
        const task2 = sample.task()
        const task3 = sample.task({profile: profile.id})
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
        const fetch = createFetchFake(fetchSpecs)
        const uri = `/task/${profile.id}`
        const history = createMemoryHistory()
        history.push(uri)
        history.go(0)
        const environment = createEnvironment({fetch, history})
        const generator = taskEffects[taskEvent.FETCH_TASKS_REQUEST](environment)

        // when
        const iterator = generator()

        // then
        expect(await iterator.next().value).toEqual(profile)
        expect(await iterator.next(profile).value).toEqual(tasks)
        expect(iterator.next(tasks).value.payload.action).toEqual(taskDispatch.fetchTasksSuccess({
            profile,
            tasks: tasksInProfile
        }))
        expect(iterator.next().done).toBeTruthy()
    })
})
