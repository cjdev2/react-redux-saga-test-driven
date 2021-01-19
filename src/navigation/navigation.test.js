import '@testing-library/jest-dom/extend-expect'
import navigationDispatch from "./navigationDispatch";
import createNavigationConnected from "./navigationConnected";
import createConnectedTester from "../test-util/connectedTester";
import createSample from "../test-util/sample";

const createTester = ({uri}) => {
    const componentDependencyMap = {
        Profile: () => <span>profile component</span>,
        Task: () => <span>task component</span>,
        Summary: () => <span>summary component</span>
    }
    const connected = createNavigationConnected(componentDependencyMap)
    const tester = createConnectedTester({connected, uri})
    return tester
}

describe('navigation', () => {
    test('default sends redirect to profile page', async () => {
        // given
        const tester = createTester({})

        // when
        await tester.dispatch(navigationDispatch.fetchPageRequest())

        // then
        expect(tester.history.location.pathname).toEqual('/profile')

        expect(tester.reduxEvents).toEqual([
            {type: 'NAVIGATION/FETCH_PAGE_REQUEST'},
            {type: 'NAVIGATION/REDIRECT', uri: '/profile'}
        ])
    })

    test('render profile page', async () => {
        // given
        const tester = createTester({uri: '/profile'})

        // when
        await tester.dispatch(navigationDispatch.fetchPageRequest())

        // then
        expect(tester.rendered.getByText('profile component')).toBeInTheDocument()
        expect(tester.rendered.getByText('summary component')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            "navigation": {
                "page": "profile"
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'NAVIGATION/FETCH_PAGE_REQUEST'},
            {type: 'NAVIGATION/FETCH_PAGE_SUCCESS', page: 'profile'},
            {type: 'PROFILE/FETCH_PROFILES_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'}
        ])
    })

    test('render task page', async () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const tester = createTester({uri: `/task/${profile.id}`})

        // when
        await tester.dispatch(navigationDispatch.fetchPageRequest())

        // then
        expect(tester.rendered.getByText('task component')).toBeInTheDocument()
        expect(tester.rendered.getByText('summary component')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual({
            "navigation": {
                "page": "task"
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'NAVIGATION/FETCH_PAGE_REQUEST'},
            {type: 'NAVIGATION/FETCH_PAGE_SUCCESS', page: 'task'},
            {type: 'TASK/FETCH_TASKS_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'}
        ])
    })
})
