import '@testing-library/jest-dom/extend-expect'
import profileDispatch from "./profileDispatch";
import createSample from "../test-util/sample";
import profileDispatchSystem from "./profileDispatchSystem";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";

test('profile render default', async () => {
    // when
    const tester = createDispatchSystemTester({system: profileDispatchSystem})

    // then
    expect(tester.rendered.getByText('0 profiles')).toBeInTheDocument()
    expect(tester.store.getState()).toEqual({
        profile: {
            profileName: '',
            profiles: []
        }
    })
    expect(tester.events).toEqual([])
})

test('fetch profiles', async () => {
    // // given
    const sample = createSample()
    const profiles = sample.profileArray(3)
    const fetchEvent = {
        uri: '/proxy/profile',
        response: JSON.stringify(profiles)
    }
    const fetchEvents = [fetchEvent]
    const system = profileDispatchSystem
    const tester = createDispatchSystemTester({system, fetchEvents})

    // when
    await tester.dispatch(profileDispatch.fetchProfilesRequest())

    // then
    expect(tester.rendered.getByText('3 profiles')).toBeInTheDocument()
    expect(tester.rendered.getByText(profiles[0].name)).toBeInTheDocument()
    expect(tester.rendered.getByText(profiles[1].name)).toBeInTheDocument()
    expect(tester.rendered.getByText(profiles[2].name)).toBeInTheDocument()

    expect(tester.store.getState()).toEqual({
        profile: {
            profileName: '',
            profiles
        }
    })

    expect(tester.events).toEqual([
        {"type": "PROFILE/FETCH_PROFILES_REQUEST"},
        {"type": "PROFILE/FETCH_PROFILES_SUCCESS", profiles}
    ])
})

test('add profile', async () => {
    // // given
    const profile = {id: 'id', name: 'yo'}
    const profilesAfterAdd = [profile]
    const addProfileEvent = {
        uri: '/proxy/profile',
        options: {
            method: "POST",
            body: JSON.stringify({name: 'yo'})
        }
    }
    const listProfilesEvent = {
        uri: '/proxy/profile',
        response: JSON.stringify(profilesAfterAdd)
    }
    const fetchEvents = [addProfileEvent, listProfilesEvent]
    const system = profileDispatchSystem
    const tester = createDispatchSystemTester({system, fetchEvents})

    // when
    await tester.userTypes({placeholder: 'profile name', value: profile.name})
    await tester.userPressesKey({placeholder: 'profile name', key: 'Enter'})

    // then
    expect(tester.rendered.getByText('1 profile')).toBeInTheDocument()
    expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()

    expect(tester.store.getState()).toEqual({
        profile: {
            profileName: '',
            profiles: profilesAfterAdd
        }
    })

    expect(tester.events).toEqual([
        {"type": 'PROFILE/PROFILE_NAME_CHANGED', name: 'y'},
        {"type": 'PROFILE/PROFILE_NAME_CHANGED', name: 'yo'},
        {"type": "PROFILE/ADD_PROFILE_REQUEST", name: 'yo'},
        {"type": 'PROFILE/PROFILE_NAME_CHANGED', name: ''},
        {"type": "PROFILE/FETCH_PROFILES_REQUEST"},
        {"type": "PROFILE/FETCH_PROFILES_SUCCESS", profiles: profilesAfterAdd}
    ])
})

test('do not add blank profile', async () => {
    // given
    const system = profileDispatchSystem
    const tester = createDispatchSystemTester({system})

    // when
    await tester.userPressesKey({placeholder: 'profile name', key: 'Enter'})

    // then
    expect(tester.rendered.getByText('0 profiles')).toBeInTheDocument()

    expect(tester.store.getState()).toEqual({
        profile: {
            profileName: '',
            profiles: []
        }
    })

    expect(tester.events).toEqual([])
})
