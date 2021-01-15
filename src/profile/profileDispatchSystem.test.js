import '@testing-library/jest-dom/extend-expect'
import {profileDispatch} from "./profileDispatch";
import createSample from "../test-util/sample";
import profileDispatchSystem from "./profileDispatchSystem";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";

test('fetch profiles success', async () => {
    // // given
    const sample = createSample()
    const profiles = sample.profileArray(3)
    const response = {
        uri: '/proxy/profile',
        response: JSON.stringify(profiles)
    }
    const tester = createDispatchSystemTester({system: profileDispatchSystem, fetchResponses: [response]})

    // when
    await tester.dispatch(profileDispatch.fetchProfilesRequest())

    // then
    expect(tester.store.getState()).toEqual({profile:{profiles}})
    expect(tester.rendered.getByText('3 profiles')).toBeInTheDocument()
    expect(tester.events).toEqual([
        {"type": "PROFILE/FETCH_PROFILES_REQUEST"},
        {"type": "PROFILE/FETCH_PROFILES_SUCCESS", profiles}
    ])
})
