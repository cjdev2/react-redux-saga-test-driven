import * as R from 'ramda'

const createSample = () => {
    let index = 0
    const string = prefix => `${prefix}-${++index}`
    const profile = (overrides) => {
        const generated = {
            id: string('profile-id'),
            name: string('profile-name')
        }
        return R.mergeRight(generated, overrides)
    }
    const profileArray = quantity => R.times(profile, quantity)

    return {
        profile,
        profileArray
    }
}

export default createSample
