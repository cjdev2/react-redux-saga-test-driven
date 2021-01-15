import * as R from "ramda";

const profileModel = {
    profiles: {
        lens: R.lensPath(['profile','profiles']),
        initialValue: []
    }
}

export default profileModel
