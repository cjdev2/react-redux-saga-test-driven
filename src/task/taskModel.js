import * as R from "ramda";

const taskModel = {
    profile: {
        lens: R.lensPath(['task', 'profile']),
        initialValue: {id: 'null-profile-id', name: 'null-profile-name'}
    },
    tasks: {
        lens: R.lensPath(['task', 'tasks']),
        initialValue: []
    },
    taskName: {
        lens: R.lensPath(['task', 'taskName']),
        initialValue: ''
    }
}

export default taskModel
