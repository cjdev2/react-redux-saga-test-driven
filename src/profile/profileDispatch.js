const profileUriPattern = /^\/profile($|\/)/

const profileEvent = {
    ADD_PROFILE_REQUEST: 'PROFILE/ADD_PROFILE_REQUEST',
    FETCH_PROFILES_REQUEST: 'PROFILE/FETCH_PROFILES_REQUEST',
    FETCH_PROFILES_SUCCESS: 'PROFILE/FETCH_PROFILES_SUCCESS',
    PROFILE_NAME_CHANGED: 'PROFILE/PROFILE_NAME_CHANGED',
    DELETE_PROFILE_REQUEST: 'PROFILE/DELETE_PROFILE_REQUEST'
}

const profileDispatch = {
    fetchProfilesRequest: () => ({type: profileEvent.FETCH_PROFILES_REQUEST}),
    addProfileRequest: name => ({type: profileEvent.ADD_PROFILE_REQUEST, name}),
    fetchProfilesSuccess: profiles => ({type: profileEvent.FETCH_PROFILES_SUCCESS, profiles}),
    profileNameChanged: name => ({type: profileEvent.PROFILE_NAME_CHANGED, name}),
    deleteProfileRequest: id => ({type: profileEvent.DELETE_PROFILE_REQUEST, id})
}

export {profileDispatch as default, profileEvent, profileUriPattern}
