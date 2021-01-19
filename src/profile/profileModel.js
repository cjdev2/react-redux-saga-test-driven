import {lensPathWithDefault} from "../compose-util/compose-connected";

const profileModel = {
    profiles: lensPathWithDefault(['profile', 'profiles'], []),
    profileName: lensPathWithDefault(['profile', 'profileName'], '')
}

export default profileModel
