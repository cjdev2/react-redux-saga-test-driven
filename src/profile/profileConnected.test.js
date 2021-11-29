import '@testing-library/jest-dom/extend-expect'
import profileDispatch from './profileDispatch';
import createSample from '../test-util/sample';
import createProfileConnected from './profileConnected';
import createConnectedTester from '../test-util/connectedTester';
import {clickedOnLabelAssociatedByHtmlFor} from '../test-util/mouse-event-test-util';

const createTester = ({fetchSpecs, initialState}) => {
    const connected = createProfileConnected({})
    const tester = createConnectedTester({connected, fetchSpecs, initialState})
    return tester
}

describe('profile', () => {
    test('fetch profiles', async () => {
        // given
        const sample = createSample()
        const profiles = sample.profileArray(3)
        const httpGetProfiles = {
            uri: '/proxy/profile',
            responseText: JSON.stringify(profiles)
        }
        const fetchSpecs = [httpGetProfiles]
        const tester = createTester({fetchSpecs})

        // when
        await tester.dispatch(profileDispatch.fetchProfilesRequest())

        // then
        expect(tester.rendered.getByText('3 profiles')).toBeInTheDocument()
        expect(tester.rendered.getByText(profiles[0].name)).toBeInTheDocument()
        expect(tester.rendered.getByText(profiles[1].name)).toBeInTheDocument()
        expect(tester.rendered.getByText(profiles[2].name)).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            profile: {
                profileName: '',
                profiles,
                errors: []
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'PROFILE/FETCH_PROFILES_REQUEST'},
            {type: 'PROFILE/FETCH_PROFILES_SUCCESS', profiles}
        ])
    })

    test('profiles error', async () => {
        // given
        const httpGetProfiles = {
            uri: '/proxy/profile',
            errorMessage: 'the-error-message'
        }
        const fetchSpecs = [httpGetProfiles]
        const tester = createTester({fetchSpecs})

        // when
        await tester.dispatch(profileDispatch.fetchProfilesRequest())

        // then
        expect(tester.rendered.getByText('0 profiles')).toBeInTheDocument()
        expect(tester.rendered.getByText('the-error-message', {exact: false})).toBeInTheDocument()
    })

    test('add profile', async () => {
        // given
        const profile = {id: 'id', name: 'yo'}
        const profilesAfterAdd = [profile]
        const httpPostCreateProfile = {
            uri: '/proxy/profile',
            method: 'POST',
            requestText: JSON.stringify({name: 'yo'})
        }
        const httpGetProfiles = {
            uri: '/proxy/profile',
            responseText: JSON.stringify(profilesAfterAdd)
        }
        const fetchSpecs = [httpPostCreateProfile, httpGetProfiles]
        const tester = createTester({fetchSpecs})

        // when
        await tester.userTypes({placeholder: 'profile name', value: profile.name})
        await tester.userPressesKey({placeholder: 'profile name', key: 'Enter'})

        // then
        expect(tester.rendered.getByText('1 profile')).toBeInTheDocument()
        expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            profile: {
                profileName: '',
                profiles: profilesAfterAdd,
                errors: []
            }
        })

        expect(tester.reduxEvents).toEqual([
            {type: 'PROFILE/PROFILE_NAME_CHANGED', name: 'y'},
            {type: 'PROFILE/PROFILE_NAME_CHANGED', name: 'yo'},
            {type: 'PROFILE/ADD_PROFILE_REQUEST', name: 'yo'},
            {type: 'PROFILE/PROFILE_NAME_CHANGED', name: ''},
            {type: 'PROFILE/FETCH_PROFILES_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'},
            {type: 'PROFILE/FETCH_PROFILES_SUCCESS', profiles: profilesAfterAdd}
        ])
    })

    test('do not add blank profile', async () => {
        // given
        const tester = createTester({})

        // when
        await tester.userPressesKey({placeholder: 'profile name', key: 'Enter'})

        // then
        expect(tester.rendered.getByText('0 profiles')).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual({
            profile: {
                profileName: '',
                profiles: [],
                errors: []
            }
        })

        expect(tester.reduxEvents).toEqual([])
    })

    test('delete profile', async () => {
        // given
        const sample = createSample()
        const profile1NoDelete = sample.profile({name: 'do not delete me'})
        const profile2Delete = sample.profile({name: 'target to delete'})
        const profile3NoDelete = sample.profile({name: 'do not delete me either'})
        const taskInProfile1 = sample.task({profile: profile1NoDelete.id})
        const firstTaskInProfile2 = sample.task({profile: profile2Delete.id})
        const secondTaskInProfile2 = sample.task({profile: profile2Delete.id})
        const initialTasks = [taskInProfile1, firstTaskInProfile2, secondTaskInProfile2]
        const initialProfiles = [profile1NoDelete, profile2Delete, profile3NoDelete]
        const profilesAfterDelete = [profile1NoDelete, profile3NoDelete]
        const initialState = {
            profile: {
                profileName: '',
                profiles: initialProfiles,
                errors: []
            }
        }
        const stateAfterDelete = {
            profile: {
                profileName: '',
                profiles: profilesAfterDelete,
                errors: []
            }
        }
        const httpGetTasks = {
            uri: '/proxy/task',
            responseText: JSON.stringify(initialTasks)
        }
        const httpDeleteFirstTask = {
            uri: `/proxy/task/${firstTaskInProfile2.id}`,
            method: 'DELETE'
        }
        const httpDeleteSecondTask = {
            uri: `/proxy/task/${secondTaskInProfile2.id}`,
            method: 'DELETE'
        }
        const httpDeleteProfile = {
            uri: `/proxy/profile/${profile2Delete.id}`,
            method: 'DELETE'
        }
        const httpGetProfiles = {
            uri: '/proxy/profile',
            responseText: JSON.stringify(profilesAfterDelete)
        }
        const fetchSpecs = [httpGetTasks, httpDeleteFirstTask, httpDeleteSecondTask, httpDeleteProfile, httpGetProfiles]
        const tester = createTester({fetchSpecs, initialState})

        // when
        await tester.userClicksElementWithLabelText(profile2Delete.name)

        // then
        expect(tester.rendered.getByText('2 profiles')).toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me')).toBeInTheDocument()
        expect(tester.rendered.queryByText('target to delete')).not.toBeInTheDocument()
        expect(tester.rendered.queryByText('do not delete me either')).toBeInTheDocument()

        expect(tester.effectiveState()).toEqual(stateAfterDelete)

        expect(tester.reduxEvents).toEqual([
            {type: 'PROFILE/DELETE_PROFILE_REQUEST', id: profile2Delete.id},
            {type: 'PROFILE/FETCH_PROFILES_REQUEST'},
            {type: 'SUMMARY/FETCH_SUMMARY_REQUEST'},
            {type: 'PROFILE/FETCH_PROFILES_SUCCESS', profiles: profilesAfterDelete}
        ])
    })

    test('do not trigger delete if clicking on label', async () => {
        // given
        const sample = createSample()
        const profile1 = sample.profile({name: 'do not delete me'})
        const profile2 = sample.profile({name: 'target to delete'})
        const profile3 = sample.profile({name: 'do not delete me either'})
        const initialProfiles = [profile1, profile2, profile3]
        const profilesAfterDelete = [profile1, profile3]
        const initialState = {
            profile: {
                profileName: '',
                profiles: initialProfiles,
                errors: []
            }
        }
        const httpDeleteProfile = {
            uri: `/proxy/profile/${profile2.id}`,
            method: 'DELETE'
        }
        const httpGetProfiles = {
            uri: '/proxy/profile',
            responseText: JSON.stringify(profilesAfterDelete)
        }

        const fetchSpecs = [httpDeleteProfile, httpGetProfiles]
        const tester = createTester({fetchSpecs, initialState})

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

        expect(tester.effectiveState()).toEqual(initialState)

        expect(tester.reduxEvents).toEqual([])
    })
})
