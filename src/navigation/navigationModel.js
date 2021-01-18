import * as R from "ramda";

const navigationModel = {
    page: {
        lens: R.lensPath(['navigation', 'page']),
        initialValue: ''
    }
}

export default navigationModel
