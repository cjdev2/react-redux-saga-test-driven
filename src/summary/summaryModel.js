import * as R from "ramda";

const summaryModel = {
    profileCount: {
        lens: R.lensPath(['summary', 'profileCount']),
        initialValue: 0
    },
    taskCount: {
        lens: R.lensPath(['summary', 'taskCount']),
        initialValue: 0
    }
}

export default summaryModel
