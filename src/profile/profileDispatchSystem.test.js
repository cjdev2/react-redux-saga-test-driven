import '@testing-library/jest-dom/extend-expect'
import profileDispatch from "./profileDispatch";
import createSample from "../test-util/sample";
import createProfileDispatchSystem from "./profileDispatchSystem";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";
import {clickedOnLabelAssociatedByHtmlFor} from "../test-util/mouse-event-test-util";

const createTester = ({fetchEvents, initialState}) => {
    const system = createProfileDispatchSystem()
    const tester = createDispatchSystemTester({system, fetchEvents, initialState})
    return tester
}

describe('profile', () => {
    test('render default', async () => {
        // when
        const tester = createTester({})

        // then
        expect(tester.rendered.getByText('0 profiles')).toBeInTheDocument()
        expect(tester.store.getState()).toEqual({
            profile: {
                profileName: '',
                profiles: []
            }
        })
        expect(tester.reduxEvents).toEqual([])
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
        const tester = createTester({fetchEvents})

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

        expect(tester.reduxEvents).toEqual([
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
        const tester = createTester({fetchEvents})

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

        expect(tester.reduxEvents).toEqual([
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
        const tester = createTester({})

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

        expect(tester.reduxEvents).toEqual([])
    })

    test('delete profile', async () => {
        // // given
        const sample = createSample()
        const profile1 = sample.profile({name: 'do not delete me'})
        const profile2 = sample.profile({name: 'target to delete'})
        const profile3 = sample.profile({name: 'do not delete me either'})
        const initialProfiles = [profile1, profile2, profile3]
        const profilesAfterDelete = [profile1, profile3]
        const initialState = {
            profile: {
                profileName: '',
                profiles: initialProfiles
            }
        }
        const stateAfterDelete = {
            profile: {
                profileName: '',
                profiles: profilesAfterDelete
            }
        }
        const deleteProfileEvent = {
            uri: `/proxy/profile/${profile2.id}`,
            options: {
                method: "DELETE"
            }
        }
        const fetchProfilesAfterDeleteEvent = {
            uri: '/proxy/profile',
            response: JSON.stringify(profilesAfterDelete)
        }

        const fetchEvents = [deleteProfileEvent, fetchProfilesAfterDeleteEvent]
        const tester = createTester({fetchEvents, initialState})

        // when
        await tester.userClicksElementWithLabelText(profile2.name)

        // then
        expect(tester.rendered.getByText('2 profiles')).toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me')).toBeInTheDocument()
        expect(tester.rendered.queryByText('target to delete')).not.toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me either')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual(stateAfterDelete)

        expect(tester.reduxEvents).toEqual([
            {type: "PROFILE/DELETE_PROFILE_REQUEST", id: profile2.id},
            {type: "PROFILE/FETCH_PROFILES_REQUEST"},
            {type: "PROFILE/FETCH_PROFILES_SUCCESS", profiles: profilesAfterDelete}
        ])
    })

    test('do not trigger delete if clicking on label', async () => {
        // // given
        const sample = createSample()
        const profile1 = sample.profile({name: 'do not delete me'})
        const profile2 = sample.profile({name: 'target to delete'})
        const profile3 = sample.profile({name: 'do not delete me either'})
        const initialProfiles = [profile1, profile2, profile3]
        const profilesAfterDelete = [profile1, profile3]
        const initialState = {
            profile: {
                profileName: '',
                profiles: initialProfiles
            }
        }
        const deleteProfileEvent = {
            uri: `/proxy/profile/${profile2.id}`,
            options: {
                method: "DELETE"
            }
        }
        const fetchProfilesAfterDeleteEvent = {
            uri: '/proxy/profile',
            response: JSON.stringify(profilesAfterDelete)
        }

        const fetchEvents = [deleteProfileEvent, fetchProfilesAfterDeleteEvent]
        const tester = createTester({fetchEvents, initialState})

        // when
        await tester.userClicksElementWithLabelTextWithOptions({
            labelText: profile2.name,
            mouseEvent: clickedOnLabelAssociatedByHtmlFor
        })

        // then
        expect(tester.rendered.getByText('3 profiles')).toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me')).toBeInTheDocument()
        expect(tester.rendered.queryByText('target to delete')).toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me either')).toBeInTheDocument()

        expect(tester.store.getState()).toEqual(initialState)

        expect(tester.reduxEvents).toEqual([])
    })
})
