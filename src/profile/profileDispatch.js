const profileEvent = {
    FETCH_PROFILES_REQUEST: 'PROFILE/FETCH_PROFILES_REQUEST',
    FETCH_PROFILES_SUCCESS: 'PROFILE/FETCH_PROFILES_SUCCESS',
}

const profileDispatch = {
    fetchProfilesRequest: () => ({type: profileEvent.FETCH_PROFILES_REQUEST}),
    fetchProfilesSuccess: profiles => ({type: profileEvent.FETCH_PROFILES_SUCCESS, profiles}),
}

export {profileEvent, profileDispatch}
