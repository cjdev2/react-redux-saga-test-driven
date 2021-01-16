import * as R from "ramda";

const profileModel = {
    profiles: {
        lens: R.lensPath(['profile', 'profiles']),
        initialValue: []
    },
    profileName: {
        lens: R.lensPath(['profile', 'profileName']),
        initialValue: ''
    }
}

export default profileModel
