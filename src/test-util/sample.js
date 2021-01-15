import * as R from 'ramda'

const createSample = () => {
    let index = 0
    const string = prefix => `${prefix}-${++index}`
    const profile = () => ({
        id: string('profile-id'),
        name: string('profile-name')
    })
    const profileArray = quantity => R.times(profile, quantity)

    return {
        profile,
        profileArray
    }
}

export default createSample
