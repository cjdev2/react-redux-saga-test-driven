import * as R from "ramda";

const profileModel = {
    profiles: {
        lens: R.lensPath(['profiles']),
        initialValue: []
    }
}

export default profileModel
