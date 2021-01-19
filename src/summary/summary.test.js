import '@testing-library/jest-dom/extend-expect'
import summaryDispatch from "./summaryDispatch";
import createSample from "../test-util/sample";
import createSummaryDispatchSystem from "./summaryDispatchSystem";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";
import * as R from 'ramda'

const createTester = ({fetchEvents, initialState}) => {
    const system = createSummaryDispatchSystem({})
    const tester = createDispatchSystemTester({system, fetchEvents, initialState})
    return tester
}

describe('summary', () => {
    test('render detached', async () => {
        // when
        const tester = createTester({})

        // then
        expect(tester.rendered.getByText('Number of profiles = 0')).toBeInTheDocument()
        expect(tester.rendered.getByText('Number of tasks across all profiles = 0')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            "summary": {
                "profileCount": 0,
                "taskCount": 0
            }
        })

        expect(tester.reduxEvents).toEqual([])
    })

    test('fetch summary', async () => {
        // when
        const sample = createSample()
        const profile1 = sample.profile()
        const profile2 = sample.profile()
        const profiles = [profile1, profile2]
        const tasksForProfile1 = sample.taskArray({quantity: 2, profile: profile1})
        const tasksForProfile2 = sample.taskArray({quantity: 3, profile: profile1})
        const tasks = R.concat(tasksForProfile1, tasksForProfile2)
        const httpFetchProfiles = {
            uri: '/proxy/profile',
            response: JSON.stringify(profiles)
        }
        const httpFetchTasks = {
            uri: '/proxy/task',
            response: JSON.stringify(tasks)
        }
        const fetchEvents = [httpFetchProfiles, httpFetchTasks]
        const tester = createTester({fetchEvents})

        // when
        await tester.dispatch(summaryDispatch.fetchSummaryRequest())

        // then

        expect(tester.rendered.getByText('Number of profiles = 2')).toBeInTheDocument()
        expect(tester.rendered.getByText('Number of tasks across all profiles = 5')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            "summary": {
                "profileCount": 2,
                "taskCount": 5
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'},
            {
                type: 'SUMMARY/FETCH_SUMMARY_SUCCESS',
                profileCount: 2,
                taskCount: 5
            }
        ])
    })
})
