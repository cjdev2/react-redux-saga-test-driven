import * as R from 'ramda'

const createSample = () => {
    let index = 0
    const string = prefix => `${prefix}-${++index}`
    const profile = overrides => {
        const generated = {
            id: string('profile-id'),
            name: string('profile-name')
        }
        return R.mergeRight(generated, overrides)
    }
    const profileArray = quantity => R.times(profile, quantity)
    const task = overrides => {
        const generated = {
            profile: string('profile-id'),
            id: string('task-id'),
            name: string('task-name'),
            complete: false
        }
        return R.mergeRight(generated, overrides)
    }
    const taskArray = ({quantity, profile}) => R.times(() => task({profile: profile.id}), quantity)

    return {
        profile,
        profileArray,
        task,
        taskArray
    }
}

export default createSample
