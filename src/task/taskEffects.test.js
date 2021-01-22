import '@testing-library/jest-dom/extend-expect'
import taskDispatch, {taskEvent} from "./taskDispatch";
import taskEffects from "./taskEffects";
import createSample from "../test-util/sample";
import createTaskConnected from "./taskConnected";
import createConnectedTester from "../test-util/connectedTester";
import createEnvironment from "../environment/environment";
import createFetchFake from "../test-util/fetch-fake";
import {createMemoryHistory} from "history";

const createTester = ({fetchSpecs, uri, initialState}) => {
    const connected = createTaskConnected({})
    const tester = createConnectedTester({connected, uri, fetchSpecs, initialState})
    return tester
}

describe('task effects', () => {
    /*
     ● Console

    console.log
      [
        {
          profileId: 'profile-id-1',
          id: 'task-id-4',
          name: 'task-name-5',
          complete: false
        },
        {
          profileId: 'profile-id-6',
          id: 'task-id-7',
          name: 'task-name-8',
          complete: false
        },
        {
          profileId: 'profile-id-1',
          id: 'task-id-10',
          name: 'task-name-11',
          complete: false
        }
      ]

      at Object.<anonymous> (src/task/taskEffects.test.js:57:17)

    console.log
      {
        type: 'TASK/FETCH_TASKS_SUCCESS',
        profile: { id: 'profile-id-1', name: 'profile-name-2' },
        tasks: [
          {
            profileId: 'profile-id-1',
            id: 'task-id-4',
            name: 'task-name-5',
            complete: false
          },
          {
            profileId: 'profile-id-1',
            id: 'task-id-10',
            name: 'task-name-11',
            complete: false
          }
        ]
      }

      at Object.<anonymous> (src/task/taskEffects.test.js:58:17)

    console.log
      true

      at Object.<anonymous> (src/task/taskEffects.test.js:59:17)

     */

    test('fetch tasks', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
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
        expect(await iterator.next(tasks).value.payload.action).toEqual(taskDispatch.fetchTasksSuccess(tasksInProfile))
        expect(iterator.next().done).toBeTruthy()
    })
})
